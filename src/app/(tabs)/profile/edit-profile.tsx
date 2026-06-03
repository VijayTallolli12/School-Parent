import { View, Text } from "react-native";
import { useAuthStore } from "@/store/auth.store";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

export default function EditProfileScreen() {
  const user = useAuthStore((s) => s.user);

  return (
    <ScreenWrapper title="Edit Profile">
      <Card padding="lg" className="mb-5">
        <View className="flex-row items-center">
          <View className="w-16 h-16 bg-primary-50 rounded-full items-center justify-center border border-primary-100">
            <Text className="text-primary-600 text-2xl font-bold">
              {user?.name?.charAt(0) || "P"}
            </Text>
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-slate-900 text-base font-bold">
              {user?.name || "Parent User"}
            </Text>
            <Text className="text-slate-500 text-sm mt-0.5">
              {user?.email || "parent@school.com"}
            </Text>
          </View>
        </View>
      </Card>

      <Card padding="lg" className="mb-5">
        <View className="mb-4">
          <Text className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">Full Name</Text>
          <View className="bg-slate-50 rounded-xl px-4 py-3">
            <Text className="text-slate-800 text-sm">{user?.name || "—"}</Text>
          </View>
        </View>
        <View className="mb-4">
          <Text className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">Email</Text>
          <View className="bg-slate-50 rounded-xl px-4 py-3">
            <Text className="text-slate-800 text-sm">{user?.email || "—"}</Text>
          </View>
        </View>
        <View>
          <Text className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">Phone</Text>
          <View className="bg-slate-50 rounded-xl px-4 py-3">
            <Text className="text-slate-800 text-sm">{user?.phone || "—"}</Text>
          </View>
        </View>
      </Card>

      <EmptyState
        icon="construct-outline"
        title="Editing Coming Soon"
        description="Profile editing will be available in a future update. Please contact the school office for changes."
      />
    </ScreenWrapper>
  );
}
