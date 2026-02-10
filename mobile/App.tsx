import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { colors } from './src/theme';
import { RootStackParamList } from './src/types';
import TabNavigator from './src/navigation/TabNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import PaywallScreen from './src/screens/PaywallScreen';
import CreateDropAlertScreen from './src/screens/CreateDropAlertScreen';
import { useAppStore } from './src/store/useAppStore';
import { registerForPushNotifications, registerPushTokenWithServer } from './src/services/notifications';
import { initPurchases, identifyUser } from './src/services/purchases';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  const isAuthLoading = useAppStore((s) => s.isAuthLoading);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const user = useAppStore((s) => s.user);
  const restoreSession = useAppStore((s) => s.restoreSession);

  // Initialize RevenueCat on mount
  useEffect(() => {
    initPurchases();
  }, []);

  useEffect(() => {
    restoreSession();
  }, []);

  // Register push notifications + identify RevenueCat user when authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    registerForPushNotifications().then((token) => {
      if (token) {
        registerPushTokenWithServer(token);
      }
    });

    identifyUser(user.id);
  }, [isAuthenticated, user?.id]);

  // Notification listeners
  useEffect(() => {
    // Foreground notification received
    notificationListener.current = Notifications.addNotificationReceivedListener((_notification) => {
      // Notification is displayed automatically via the handler in notifications.ts
    });

    // User tapped notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if ((data?.type === 'price_alert' || data?.type === 'drop_alert' || data?.type === 'restock_alert') && data?.productId) {
        // Navigate to product detail
        if (navigationRef.isReady()) {
          navigationRef.navigate('ProductDetail', { productId: Number(data.productId) });
        }
      }
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  if (isAuthLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bgPrimary }}>
        <ActivityIndicator size="large" color={colors.accentGold} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator>
          <Stack.Screen
            name="MainTabs"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={{
              headerTitle: '',
              headerBackTitle: 'Back',
              headerStyle: { backgroundColor: colors.bgPrimary },
              headerShadowVisible: false,
              headerTintColor: colors.textPrimary,
            }}
          />
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{
              headerShown: false,
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="Paywall"
            component={PaywallScreen}
            options={{
              headerShown: false,
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="CreateDropAlert"
            component={CreateDropAlertScreen}
            options={{
              headerTitle: 'New Drop Alert',
              headerBackTitle: 'Back',
              headerStyle: { backgroundColor: colors.bgPrimary },
              headerShadowVisible: false,
              headerTintColor: colors.textPrimary,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
