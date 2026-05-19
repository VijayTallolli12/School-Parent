import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  leftIcon,
  isPassword,
  containerStyle,
  className = "",
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const hasValue = typeof rest.value === "string" && rest.value.length > 0;
  const showError = !!error;
  const isActive = isFocused || hasValue;

  return (
    <View style={containerStyle}>
      {label && (
        <Text className="text-sm font-semibold text-slate-700 mb-2 ml-1">
          {label}
        </Text>
      )}
      <View
        className={[
          "flex-row items-center rounded-2xl border-2 px-4 transition-all duration-200",
          isFocused
            ? "border-primary-500 bg-white"
            : showError
              ? "border-status-error bg-red-50"
              : "border-slate-100 bg-slate-100",
          isFocused && !showError ? "shadow-sm" : "",
        ].join(" ")}
        style={
          isFocused && !showError
            ? { shadowColor: "#3B82F6", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 3 }
            : undefined
        }
      >
        {leftIcon && (
          <View className="mr-3">
            <Ionicons
              name={leftIcon}
              size={20}
              color={
                showError
                  ? "#DC2626"
                  : isFocused
                    ? "#3B82F6"
                    : "#94A3B8"
              }
            />
          </View>
        )}
        <TextInput
          className={[
            "flex-1 py-4 text-base text-slate-800 placeholder:text-slate-400",
            className,
          ].join(" ")}
          placeholderTextColor="#94A3B8"
          selectionColor="#3B82F6"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !showPassword}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className="ml-2 p-1"
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={isFocused ? "#3B82F6" : "#94A3B8"}
            />
          </TouchableOpacity>
        )}
      </View>
      {showError && (
        <View className="flex-row items-center mt-1.5 ml-1">
          <Ionicons name="alert-circle" size={14} color="#DC2626" />
          <Text className="text-status-error text-xs ml-1 font-medium">
            {error}
          </Text>
        </View>
      )}
    </View>
  );
}
