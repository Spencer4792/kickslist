import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
} from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { Platform } from 'react-native';

const REVENUECAT_IOS_KEY = 'test_QZbMYNVrzPmiFsIwJjlNebuPSeQ';
const REVENUECAT_ANDROID_KEY = 'test_QZbMYNVrzPmiFsIwJjlNebuPSeQ';
const ENTITLEMENT_ID = 'Kickslist Pro';

export async function initPurchases() {
  Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

  if (Platform.OS === 'ios') {
    Purchases.configure({ apiKey: REVENUECAT_IOS_KEY });
  } else if (Platform.OS === 'android') {
    Purchases.configure({ apiKey: REVENUECAT_ANDROID_KEY });
  }
}

export async function identifyUser(userId: string) {
  await Purchases.logIn(userId);
}

export async function logoutPurchases() {
  await Purchases.logOut();
}

export async function checkProEntitlement(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch {
    return false;
  }
}

export async function restorePurchases(): Promise<{
  isPro: boolean;
  customerInfo: CustomerInfo;
}> {
  const customerInfo = await Purchases.restorePurchases();
  const isPro = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  return { isPro, customerInfo };
}

export async function presentPaywall(): Promise<boolean> {
  const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywall();

  switch (paywallResult) {
    case PAYWALL_RESULT.PURCHASED:
    case PAYWALL_RESULT.RESTORED:
      return true;
    case PAYWALL_RESULT.NOT_PRESENTED:
    case PAYWALL_RESULT.ERROR:
    case PAYWALL_RESULT.CANCELLED:
    default:
      return false;
  }
}
