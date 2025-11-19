import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../constants/Colors';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.container,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 27,
    color: Colors.text,
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
    backgroundColor: Colors.chipBackground,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    margin: 6,
    shadowColor: Colors.background,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  chipSelected: {
    backgroundColor: Colors.buttonBackground,
  },
  chipText: {
    color: Colors.chipTextSelected,
    fontSize: 16,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: Colors.chipTextSelected,
    fontWeight: 'bold',
  },
  navButton: {
    position: 'absolute',
    bottom: 10,
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
    bottom: 10,
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
    bottom: 10,
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
    color: Colors.background,
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
    backgroundColor: Colors.imageplaceholder,
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
    color: Colors.background,
    backgroundColor: Colors.inputBackground,
    fontSize: 16,
  },
  uploadText: {
    color: Colors.text,
    fontSize: 14,
    marginTop: 15,
    textAlign: 'center',
  },
  // New error text style that matches your design language
  errorText: {
    color: Colors.error2, // Standard error red
    fontSize: 14,
    marginTop: 6,
    marginLeft: 10,
    fontWeight: '500',
  },

  // Complete Profile Screen Styles
  gradientContainer: {
    flex: 1,
  },
  safeAreaContainer: {
    flex: 1,
  },
  pageContainer: {
    width,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 25,
    padding: 20,
    shadowColor: Colors.background,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
    width: '100%',
  },
  completionMessage: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  completionText: {
    color: Colors.completionText,
    fontSize: 14,
    textAlign: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  navigationContainerKeyboard: {
    paddingBottom: 40,
  },
  backButton: {
    backgroundColor: Colors.backButton,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  nextButtonProfile: {
    backgroundColor: Colors.nextButtonProfile,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  nextButtonDisabled: {
    backgroundColor: Colors.nextButtonDisabled,
  },
  nextButtonAuto: {
    marginLeft: 'auto',
  },
  buttonText: {
    color: Colors.buttonText,
    fontSize: 16,
  },
  finishButton: {
    backgroundColor: Colors.finishButton,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
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
    backgroundColor: Colors.drawerContainer,
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
    color: Colors.logoutText,
  },

  /** ------------ QUESTION COMPONENT STYLES ------------- */
  
  // Main question container
  questionContainer: {
    marginBottom: 24,
  },
  
  // Floating label container
  floatingLabelContainer: {
    position: 'relative',
    paddingTop: 24,
  },
  
  // Date input specific styles
  dateInputContainer: {
    justifyContent: 'center',
  },

  /** ------------ PROGRESS BAR COMPONENT STYLES ------------- */
  
  container2: {
    zIndex: 2,
    paddingHorizontal: 20,
    marginTop: 60,
    alignItems: 'center',
  },
  backgroundBar: {
    height: 12,
    backgroundColor: Colors.text,
    borderRadius: 20,
    overflow: 'hidden',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    borderRadius: 20,
  },
  percentageText: {
    marginTop: 6,
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default styles;
