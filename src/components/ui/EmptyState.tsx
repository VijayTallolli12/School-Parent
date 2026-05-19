import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = "file-tray-outline",
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="items-center justify-center py-12 px-8">
      <View className="w-16 h-16 bg-slate-100 rounded-full items-center justify-center mb-4">
        <Ionicons name={icon} size={28} color="#94A3B8" />
      </View>
      <Text className="text-slate-700 text-base font-semibold text-center">
        {title}
      </Text>
      {description && (
        <Text className="text-slate-400 text-sm text-center mt-1.5 leading-5">
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <View className="mt-4">
          <Button
            title={actionLabel}
            onPress={onAction}
            variant="outline"
            size="sm"
          />
        </View>
      )}
    </View>
  );
}
