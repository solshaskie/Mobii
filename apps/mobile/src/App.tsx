import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';

// Import screens
import DashboardScreen from './screens/DashboardScreen';
import WorkoutsScreen from './screens/WorkoutsScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import AIGeneratorScreen from './screens/AIGeneratorScreen';
import GoalsScreen from './screens/GoalsScreen';
import WorkoutPlayerScreen from './screens/WorkoutPlayerScreen';
import ProfileScreen from './screens/ProfileScreen';

// Import components
import { ThemeProvider } from './components/providers/ThemeProvider';
import { SensorProvider } from './components/providers/SensorProvider';
import { AuthProvider } from './components/providers/AuthProvider';
import { WorkoutProvider } from './components/providers/WorkoutProvider';

// Import theme
import { theme } from './theme';
import { useTheme } from './hooks/useTheme';

// Import icons
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Require cycle:',
  'ViewPropTypes will be removed',
  'AsyncStorage has been extracted',
]);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
              break;
            case 'Workouts':
              iconName = focused ? 'dumbbell' : 'dumbbell-outline';
              break;
            case 'Analytics':
              iconName = focused ? 'chart-line' : 'chart-line-outline';
              break;
            case 'AI Generator':
              iconName = focused ? 'brain' : 'brain-outline';
              break;
            case 'Goals':
              iconName = focused ? 'target' : 'target-outline';
              break;
            case 'Profile':
              iconName = focused ? 'account' : 'account-outline';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Workouts" 
        component={WorkoutsScreen}
        options={{ title: 'Workouts' }}
      />
      <Tab.Screen 
        name="Analytics" 
        component={AnalyticsScreen}
        options={{ title: 'Analytics' }}
      />
      <Tab.Screen 
        name="AI Generator" 
        component={AIGeneratorScreen}
        options={{ title: 'AI Generator' }}
      />
      <Tab.Screen 
        name="Goals" 
        component={GoalsScreen}
        options={{ title: 'Goals' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

function App() {
  useEffect(() => {
    // Hide splash screen after app is ready
    SplashScreen.hide();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <SensorProvider>
              <WorkoutProvider>
                <PaperProvider theme={theme}>
                  <NavigationContainer theme={theme}>
                    <StatusBar 
                      barStyle="light-content" 
                      backgroundColor={theme.colors.primary}
                    />
                    <Stack.Navigator
                      screenOptions={{
                        headerShown: false,
                      }}
                    >
                      <Stack.Screen name="Main" component={TabNavigator} />
                      <Stack.Screen 
                        name="WorkoutPlayer" 
                        component={WorkoutPlayerScreen}
                        options={{
                          headerShown: true,
                          title: 'Workout',
                          headerStyle: {
                            backgroundColor: theme.colors.background,
                          },
                          headerTintColor: theme.colors.textPrimary,
                        }}
                      />
                    </Stack.Navigator>
                  </NavigationContainer>
                </PaperProvider>
              </WorkoutProvider>
            </SensorProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
