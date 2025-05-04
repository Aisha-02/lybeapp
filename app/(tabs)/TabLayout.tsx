import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../../constants/Colors';

// Screens
import ConnectScreen from './connect';
import JamroomScreen from './jamroom';
import HomeScreen from './home';
import SearchScreen from './search';
import LibraryScreen from './library';

const Tab = createBottomTabNavigator();

const TabLayout = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.buttonBackground,
        tabBarInactiveTintColor: Colors.buttonText,
        tabBarStyle: {
          backgroundColor: Colors.background,
          paddingBottom: 14,
          height: 75,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
      }}
    >
      <Tab.Screen
        name="Connect"
        component={ConnectScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'people' : 'people-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Jamroom"
        component={JamroomScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'musical-notes' : 'musical-notes-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'library' : 'library-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabLayout;
