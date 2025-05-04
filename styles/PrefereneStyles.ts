import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../constants/Colors';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    paddingBottom: 50,
  },
  title: {
    fontSize: 16,
    marginTop: 10,
  fontWeight: '600',
  marginBottom: 10,
  color: '#111',
  },
  chipContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  chipSelected: {
    backgroundColor: '#1DB954',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.chipTextUnselected,
  },
  chipTextSelected: {
    color: '#fff',
  fontWeight: 'bold',
  },
  navButton: {
    position: 'absolute',
    bottom : 20,
    left: 20,
    backgroundColor: Colors.buttonBackground, // Optional: Set background color
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    zIndex: 1, // Ensures the button is above other elements
  },
  nextButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    padding: 15,
    backgroundColor: Colors.buttonBackground,  // Use your primary color
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1, // Ensures the button is above other elements
  },
  nextButtonText: {
    color: Colors.text,  // Make sure the text is readable
    fontSize: 18,
    fontWeight: '700',
  },
  imagePickerContainer: {
    alignItems: 'center',
  marginBottom: 10,
  },
  imagePlaceholder: {
    width: 120,
  height: 120,
  borderRadius: 60,
  backgroundColor: '#ddd',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    color: '#000',
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  uploadText: {
    color: Colors.subText,
    fontSize: 14,
    marginTop: 15,
    textAlign: 'center',
  },

  /** ------------ MENU SCREEN RELATED ------------- */

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // semi-transparent black overlay
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  drawerContainer: {
    width: width * 0.75,
    backgroundColor: '#333',
    position: 'absolute',
    top: 20,
    left: 0,
    height: '100%', // make sure the menu is the full height of the screen
    paddingTop: 50,
    paddingHorizontal: 20,
    zIndex: 999,
    elevation: 10,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  cancelIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    backgroundColor: Colors.inputBackground,
  },
  userName: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '600',
  },
  menuContent: {
    marginTop: 70, // Push down content so it's below the cancel icon
    flex: 1,
    paddingBottom: 50, // Space at the bottom for scrollable menu
  },
  menuItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuText: {
    color: Colors.text,
    fontSize: 17,
  },
  logoutText: {
    color: '#FF5C5C',
  },
});

export default styles;