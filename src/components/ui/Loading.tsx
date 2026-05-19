import { View, ActivityIndicator, Text } from "react-native";

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export function Loading({ message, fullScreen = false }: LoadingProps) {
  if (fullScreen) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-background">
        <View className="items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          {message && (
            <Text className="text-slate-500 text-sm mt-3">{message}</Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View className="items-center justify-center py-8">
      <ActivityIndicator size="small" color="#3B82F6" />
      {message && (
        <Text className="text-slate-500 text-sm mt-2">{message}</Text>
      )}
    </View>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <View
      className={["bg-slate-200 rounded-xl animate-pulse", className].join(" ")}
    />
  );
}

export function CardSkeleton() {
  return (
    <View className="bg-white rounded-2xl border border-slate-100 p-4">
      <View className="flex-row items-center">
        <Skeleton className="w-12 h-12 rounded-full" />
        <View className="ml-3 flex-1">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </View>
      </View>
    </View>
  );
}
