import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme';
import { RootStackParamList } from '../types';
import { presentPaywall } from '../services/purchases';
import { useAppStore } from '../store/useAppStore';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function PaywallScreen() {
  const navigation = useNavigation<Nav>();
  const syncSubscription = useAppStore((s) => s.syncSubscription);

  useEffect(() => {
    (async () => {
      const purchased = await presentPaywall();
      if (purchased) {
        await syncSubscription();
      }
      navigation.goBack();
    })();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bgSecondary }}>
      <ActivityIndicator size="large" color={colors.accentGold} />
    </View>
  );
}
