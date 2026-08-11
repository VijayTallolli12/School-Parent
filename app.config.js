const IS_PRODUCTION =
  process.env.EAS_BUILD_PROFILE === "production" || process.env.NODE_ENV === "production";

const DEFAULT_API_URL = IS_PRODUCTION
  ? "https://paleturquoise-monkey-126256.hostingersite.com/api/v1"
  : "http://192.168.1.3:8000/api/v1";

export default {
  expo: {
    name: "School Parent App",
    slug: "school-parent",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    scheme: "school-parent-app",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.school.parent",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: false,
        },
      },
    },
    android: {
      package: "com.school.parent",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      permissions: [
        "INTERNET",
        "ACCESS_NETWORK_STATE",
      ],
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro",
    },
    plugins: [
      "expo-router",
      "@react-native-community/datetimepicker",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      apiUrl: process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL,
      eas: {
        projectId: "b0b35913-33ff-47ec-9aea-8340f7de72d3",
      },
    },
    owner: "vijaytallolli",
  },
};
