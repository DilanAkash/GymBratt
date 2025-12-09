// client/types/firebase-react-native.d.ts

declare module "firebase/auth/react-native" {
  import type { Persistence } from "firebase/auth";

  // The actual implementation from firebase/auth/react-native
  export function getReactNativePersistence(storage: any): Persistence;
}
