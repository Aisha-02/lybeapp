import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");

export default StyleSheet.create({
  bg: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  albumImage: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 20,
    marginBottom: 20,
  },
  trackName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 6,
  },
  artists: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
  },
  albumInfo: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 4,
  },
  sliderWrapper: {
    width: "100%",
    marginTop: 20,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    color: "#fff",
    fontSize: 12,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    gap: 20,
  },
  playButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  volumeControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  noPreview: {
    color: "#fff",
    marginTop: 30,
    fontSize: 16,
  },
});
