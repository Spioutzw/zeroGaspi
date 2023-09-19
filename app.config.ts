import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "zeroGaspi",
  slug: "zeroGaspi",
  owner: "mathend",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.mathend.zeroGaspi",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    googleServicesFile: process.env.googleServicesFile,
    package: "com.mathend.zeroGaspi",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    "@react-native-google-signin/google-signin",
    "expo-barcode-scanner",
    [
      "expo-camera",
      { cameraPermission: "Autorisez vous zeroGaspi à utiliser votre caméra" },
    ],
    "expo-notifications",
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: "f7be0223-a291-44cb-9463-9d9455c27f2f",
    },
  },
});
