import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#000", // black background for dark theme
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderColor: "#444",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 50,
  },
  albumImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: "#333",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    paddingVertical: 0,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomColor: "#444",
    borderBottomWidth: 1,
  },
  trackName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  artistName: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 4,
  },
  errorText: {
    marginTop: 15,
    color: "#ff5555", // soft red for error
    fontWeight: "600",
  },
  noResults: {
    marginTop: 30,
    fontSize: 16,
    color: "#666", // muted gray text
    textAlign: "center",
  },
});

export default styles;
