import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme';
import { AuthStackParamList } from '../types';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.bgPrimary },
        headerShadowVisible: false,
        headerTintColor: colors.textPrimary,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerTitle: '' }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerTitle: '' }}
      />
    </Stack.Navigator>
  );
}
