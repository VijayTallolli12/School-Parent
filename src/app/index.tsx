import { useEffect, useRef } from "react";
import { router } from "expo-router";
import { View, Text, Animated } from "react-native";
import { useAuthStore } from "@/store/auth.store";

export default function SplashScreen() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace("/(tabs)" as any);
      } else {
        router.replace("/(auth)/login" as any);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  return (
    <View className="flex-1 bg-blue-600 items-center justify-center">
      <Animated.View
        style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
        className="items-center"
      >
        <View className="w-24 h-24 bg-white rounded-2xl items-center justify-center mb-6 shadow-lg">
          <Text className="text-4xl">🏫</Text>
        </View>
        <Text className="text-white text-3xl font-bold tracking-wider">
          School Parent
        </Text>
        <Text className="text-blue-200 text-sm mt-2">
          Connecting parents with schools
        </Text>
      </Animated.View>
      <Animated.View
        style={{ opacity: fadeAnim }}
        className="absolute bottom-12"
      >
        <Text className="text-blue-300 text-xs">Version 1.0.0</Text>
      </Animated.View>
    </View>
  );
}