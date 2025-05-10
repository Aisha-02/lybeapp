import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../constants/Colors';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D005F', // deep purple
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 27,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chipContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    backgroundColor: '#E100FF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    margin: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  chipSelected: {
    backgroundColor: Colors.buttonBackground,
  },
  chipText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#fff',
  fontWeight: 'bold',
  },
  navButton: {
    position: 'absolute',
    bottom : 20,
    right: 20,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    zIndex: 1, // Ensures the button is above other elements
  },
  navBack: {
  position: 'absolute',
  left: 20,
  bottom: 25,
  backgroundColor: 'transparent', // or any color you want
  borderRadius: 30,
  alignItems: 'center',
  justifyContent: 'center',
  padding: 10,
  zIndex: 1, 
  },
  nextButton: {
    position: 'absolute',
    right: 20,
    bottom: 25,
    backgroundColor: Colors.buttonBackground,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    // Ensures the button is above other elements
  },
  nextButtonText: {
    color: '#000',
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
    borderRadius: 10,
    padding: 10,
    color: '#000',
    backgroundColor: Colors.inputBackground,
    fontSize: 16,
  },
  uploadText: {
    color: '#fff',
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