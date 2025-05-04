import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/login';
import RegisterScreen from '../screens/register';
import ForgetPassword from '../screens/forgetpassword';
import profile  from '../screens/completeprofile';
import TabLayout from './(tabs)/TabLayout'; // Tab navigator

const Stack = createNativeStackNavigator();

const AppLayout = () => {
  return (
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="CompleteProfile" component={profile} />
        <Stack.Screen name="Forget" component={ForgetPassword} />
        <Stack.Screen name="Home" component={TabLayout} />
      </Stack.Navigator>
  );
}
export default AppLayout;





