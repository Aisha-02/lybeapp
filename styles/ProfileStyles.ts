import { StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "stretch",
    padding: 20,
    backgroundColor: Colors.background,
    paddingBottom: 100, 
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },

  headerTitle: {
    flex: 1,
    fontSize: 26,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
  },

  dp: {
    width: "100%",
    height: 380,
    borderRadius: 20,
    marginTop: 10,
    overflow: "hidden",
    backgroundColor: Colors.imageplaceholder,
  },

  gradientOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  nameOverlayText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  editButton: {
    backgroundColor: Colors.buttonBackground,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 20,
    width: "60%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },

  editButtonText: {
    color: Colors.buttonText,
    fontSize: 17,
    fontWeight: "600",
  },

  sectionContainer: {
    marginTop: 10,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 20,
    marginBottom: 10,
  },

  bioText: {
    fontSize: 16,
    color: Colors.subText,
    lineHeight: 22,
  },

  vibeText: {
    fontSize: 22,
    color: Colors.buttonBackground,
    fontWeight: "600",
    marginTop: 10,
  },

  // Genres / Tags
  genreWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
    marginBottom: 20,
  },

  genreChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: Colors.chipBackground,
    borderRadius: 20,
    marginRight: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  
  genreChipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  // Input Fields (Edit mode)
  fieldContainer: {
    width: "100%",
    marginTop: 10,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 6,
  },

  input: {
    backgroundColor: Colors.inputBackground,
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
