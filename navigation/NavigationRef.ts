import { createNavigationContainerRef, ParamListBase } from '@react-navigation/native';
import type { RootStackParamList } from '../app/_layout'; // wherever your type is

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// Strongly typed navigate function
export function navigate<RouteName extends keyof RootStackParamList>(
    ...args: undefined extends RootStackParamList[RouteName]
      ? [screen: RouteName, params?: RootStackParamList[RouteName]]
      : [screen: RouteName, params: RootStackParamList[RouteName]]
  ) {
    if (navigationRef.isReady()) {
      navigationRef.navigate(...args as any);
    }
  }
