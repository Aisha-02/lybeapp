import { StyleSheet, Dimensions } from "react-native";
import { Colors } from '../constants/Colors';

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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },

  trackName: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.track,
    textAlign: "center",
    marginBottom: 6,
  },

  artists: {
    fontSize: 16,
    color: Colors.artist2,
    textAlign: "center",
    marginBottom: 4,
  },

  albumInfo: {
    fontSize: 14,
    color: Colors.albumInfo,
    marginTop: 2,
  },

  sliderWrapper: {
    width: "100%",
    marginTop: 20,
  },

  slider: {
    width: "100%",
    height: 40,
  },

  slider2: {
    width: 120,
  },

  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },

  timeText: {
    color: Colors.text,
    fontSize: 12,
  },

  controls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    justifyContent: "space-around",
    width: "100%",
  },

  playButton: {
    alignItems: "center",
    justifyContent: "center",
  },

  volumeControl: {
    flexDirection: "row",
    alignItems: "center",
  },

  volumeIcon: {
    marginHorizontal: 6,
  },

  noPreview: {
    color: Colors.text,
    marginTop: 30,
    fontSize: 16,
    fontStyle: 'italic',
  },

  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    width: "100%",
  },

  actionButton: {
    alignItems: "center",
  },

  buttonText: {
    marginTop: 4,
    color: Colors.text,
    fontSize: 14,
  },

  activityIndicator: {
    marginTop: 20,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: Colors.background,
    borderRadius: 14,
    paddingVertical: 24,
    paddingHorizontal: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  playlistItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.borderBottom,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  playlistItemText: {
    color: Colors.text,
    fontSize: 16,
    flex: 1,
  },
  selectedPlaylistItem: {
    backgroundColor: Colors.buttonBackground,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 20,
  },
  closeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  modalActionButton: {
    backgroundColor: Colors.buttonBackground,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalActionButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.buttonText,
  },
  playlistInput: {
    borderColor: Colors.borderBottom,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
  },
});
