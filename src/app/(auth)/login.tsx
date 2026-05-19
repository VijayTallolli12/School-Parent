import { useState, useCallback, useRef } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/store/auth.store";
import apiClient from "@/services/api";
import type { LoginResponse } from "@/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hydrateFromApi = useAuthStore((s) => s.hydrateFromApi);
  const scrollRef = useRef<ScrollView>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onLogin = useCallback(async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const { data } = await apiClient.post<LoginResponse>(
        "/auth/login",
        values,
      );
      hydrateFromApi(data);
      router.replace("/(tabs)");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      Alert.alert("Login Error", message);
    } finally {
      setIsSubmitting(false);
    }
  }, [hydrateFromApi]);

  return (
    <SafeAreaView className="flex-1 bg-surface-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Hero Section */}
          <View className="bg-primary-600 rounded-b-3xl px-6 pt-8 pb-12">
            <View className="items-center">
              {/* Logo Container */}
              <View
                className="w-20 h-20 bg-white rounded-2xl items-center justify-center mb-5"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <Ionicons name="school-outline" size={40} color="#2563EB" />
              </View>

              {/* Welcome Text */}
              <Text className="text-white text-3xl font-bold tracking-tight">
                Welcome Back
              </Text>
              <Text className="text-primary-200 text-base mt-2">
                Sign in to your parent account
              </Text>
            </View>
          </View>

          {/* Form Card - Overlapping Hero */}
          <View className="px-5 -mt-8">
            <View
              className="bg-white rounded-3xl px-6 pt-8 pb-6"
              style={{
                shadowColor: "#1E293B",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.1,
                shadowRadius: 24,
                elevation: 8,
              }}
            >
              {/* Form Fields */}
              <View className="gap-6">
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Email Address"
                      placeholder="parent@school.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      leftIcon="mail-outline"
                      error={errors.email?.message}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      returnKeyType="next"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Password"
                      placeholder="Enter your password"
                      autoComplete="password"
                      leftIcon="lock-closed-outline"
                      isPassword
                      error={errors.password?.message}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit(onLogin)}
                    />
                  )}
                />

                <View className="pt-2">
                  <Button
                    title="Sign In"
                    onPress={handleSubmit(onLogin)}
                    loading={isSubmitting}
                    size="lg"
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View className="items-center justify-center pt-8 pb-6 px-6">
            <View className="flex-row items-center">
              <View className="w-8 h-px bg-slate-200" />
              <Text className="text-slate-400 text-xs mx-3 font-medium">
                School Parent App
              </Text>
              <View className="w-8 h-px bg-slate-200" />
            </View>
            <Text className="text-slate-400 text-xs mt-2">
              Powered by Folkslogic
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
