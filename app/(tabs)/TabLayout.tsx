import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../../constants/Colors';
import styles from '../../styles/Index_TabLayout';

// Screens
import ConnectScreen from './connect';
import HomeScreen from './home';
import SearchScreen from './search';
import LibraryScreen from './library';
import MessagesScreen from '@/screens/messages';
import MiniPlayer from '@/components/MiniPlayer';

const Tab = createBottomTabNavigator();

const TAB_BAR_HEIGHT = 60; // adjust based on your style

const TabLayout = () => {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.background,
          tabBarInactiveTintColor: Colors.icon,
          tabBarStyle: { ...styles.tabBarStyle, height: TAB_BAR_HEIGHT },
          tabBarLabelStyle: styles.tabBarLabelStyle,
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
          name="Chat"
          component={MessagesScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'}
                size={24}
                color={color}
              />
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

      {/* Floating Mini Player */}
      <View
        style={{
          position: 'absolute',
          bottom: TAB_BAR_HEIGHT, // places it just above the tab bar
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <MiniPlayer />
      </View>
    </View>
  );
};

export default TabLayout;
