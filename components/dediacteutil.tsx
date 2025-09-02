import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseconfig";
import { Alert } from "react-native";

export const sendDedication = async (
  track: any,
  recipientId: string, // 👈 clearer name
  recipientName: string
) => {
  const me = auth.currentUser;
  if (!me) return;

  try {
    // 1. Fetch my user profile
    const meDoc = await getDoc(doc(db, "users", me.uid));
    const meData = meDoc.data();
    const fromName = meData?.username || me.email || "Someone";

    // 2. Save request in recipient's friendRequests subcollection
    const requestRef = doc(db, "users", recipientId, "friendRequests", me.uid);
    await setDoc(requestRef, {
      from: me.uid,
      fromName,
      track,
      status: "pending",
      createdAt: new Date(),
    });

    // 3. Get recipient’s push token 👈 ensure we fetch the target user
    const recipientDoc = await getDoc(doc(db, "users", recipientId));
    const token = recipientDoc.data()?.expoPushToken;

    // 4. Send push notification
    if (token) {
      const res = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: token,
          title: `${fromName} sent you a dedication!`,
          body: `Track: ${track.name}`,
          data: {
            screen: "notification",
            fromUid: me.uid,
            trackId: track.id,
          },
        }),
      });
      const resData = await res.json();
      console.log("Push response:", resData);
    } else {
      console.log("Recipient has no expoPushToken registered");
    }

    Alert.alert("Sent", `Dedication sent to ${recipientName}`);
  } catch (err) {
    console.error("Dedicate Error:", err);
    Alert.alert("Error", "Failed to send dedication. Try again.");
  }
};
