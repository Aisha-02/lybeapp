import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  albumImage: {
    width: 250,
    height: 250,
    borderRadius: 8,
    marginVertical: 30,
  },
  trackName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  artists: {
    fontSize: 16,
    color: "#aaa",
    marginTop: 5,
    marginBottom: 10,
    textAlign: "center",
  },
  albumName: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 4,
    textAlign: "center",
  },
  releaseDate: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 20,
    textAlign: "center",
  },
  slider: {
    width: "90%",
    height: 40,
    marginTop: 10,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
  },
  timeText: {
    color: "#888",
    fontSize: 12,
  },
  playButton: {
    marginTop: 30,
  },
  noPreview: {
    color: "#888",
    marginTop: 20,
  },
});
