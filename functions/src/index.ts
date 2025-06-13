const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.sendPushNotification = functions.https.onRequest(async (req: { body: { token: any; title: any; body: any; data: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; }) => {
  try {
    const { token, title, body, data } = req.body;

    const message = {
      token,
      notification: {
        title,
        body,
      },
      data,
    };

    await admin.messaging().send(message);
    res.status(200).send("Notification sent!");
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).send("Failed to send notification.");
  }
});
