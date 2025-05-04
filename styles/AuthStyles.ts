// styles/AuthStyles.ts
import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 150,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderRadius: 10,
    backgroundColor: Colors.inputBackground,
    paddingLeft: 50,
    paddingRight: 16,
    fontSize: 16,
    // placeholderTextColor should be passed as a prop to the TextInput component
    color: Colors.text,
  },
  inputIcon: {
    position: 'absolute',
    width: 25,
    height: 25,
    top: 15,
    left: 16,
    tintColor: Colors.icon,
  },
  forgetPassword: {
    color: Colors.subText,
    textAlign: 'right',
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  loginButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: Colors.buttonText,
    fontSize: 18,
    fontWeight: 'bold',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.subText,
  },
  orText: {
    marginHorizontal: 10,
    color: Colors.subText,
    fontSize: 14,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.inputBackground,
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  header: {
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
    color: Colors.text,
  },
  googleButtonText: {
    fontSize: 16,
    color: Colors.buttonText,
    fontWeight: 'bold',
  },
  registerText: {
    marginBottom: 30,
    textAlign: 'center',
    color: Colors.subText,
    fontSize: 14,
  },
  registerLink: {
    color: Colors.buttonBackground,
    fontWeight: 'bold',
  },
});

export default styles;
