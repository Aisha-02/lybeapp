import { StyleSheet } from "react-native";
import { Colors } from '../constants/Colors';

const styles = StyleSheet.create({
  ion: {
    marginHorizontal: 8,
  },
  loading: {
    marginTop: 20,
  },
  contentContainer: {
    paddingBottom: 100
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.background // black background for dark theme
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.searchBar, // dark gray for search bar
    marginTop: 16,
    borderColor: Colors.searchBarBorder, // lighter gray for border
    borderWidth: 1,
    paddingVertical:8,
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 50,
  },
  albumImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: Colors.albumImage, // dark gray for album image background
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.buttonText,
    paddingVertical: 0,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.loading,      // Spotify green color for a fresh vibe
    marginVertical: 16,
    marginLeft: 12,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomColor: Colors.borderBottom, // soft gray for border
    borderBottomWidth: 1,
  },
  trackName: {
    color: Colors.track, // white for track name
    fontSize: 16,
    fontWeight: "bold",
  },
  artistName: {
    color: Colors.artist, // light gray for artist name
    fontSize: 14,
    marginTop: 4,
  },
  errorText: {
    marginTop: 15,
    color: Colors.error, // soft red for error
    fontWeight: "600",
  },
  noResults: {
    marginTop: 30,
    fontSize: 16,
    color: Colors.noResults, // muted gray text
    textAlign: "center",
  },
  viewProp: {
    flex: 1, 
    marginLeft: 12
  }
});

export default styles;
