import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/auth.store";
import { router } from "expo-router";
import { Card } from "@/components/ui/Card";
import { storage } from "@/utils/storage";
import { STORAGE_KEYS } from "@/constants/config";

const MENU_ITEMS = [
  { icon: "person-outline", label: "Edit Profile", route: "/profile/edit-profile" },
  { icon: "notifications-outline", label: "Notifications", route: "/notifications" },
  { icon: "shield-checkmark-outline", label: "Privacy", route: "/profile/privacy" },
  { icon: "help-circle-outline", label: "Help & Support", route: "/profile/help" },
] as const;

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    await storage.remove(STORAGE_KEYS.AUTH_TOKEN);
    await storage.remove(STORAGE_KEYS.USER_DATA);
    await storage.remove("school_parent_auth_store");
    logout();
    router.replace("/(auth)/login" as any);
  };

  const handleMenuPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-background">
      <View className="bg-white px-5 pt-3 pb-3 border-b border-slate-100">
        <Text className="text-slate-900 text-lg font-bold tracking-tight">
          Profile
        </Text>
      </View>

      <View className="flex-1 px-5 pt-6">
        <Card padding="lg" className="items-center mb-4">
          <View className="w-20 h-20 bg-primary-50 rounded-full items-center justify-center mb-3 border border-primary-100">
            <Text className="text-primary-600 text-3xl font-bold">
              {user?.name?.charAt(0) || "P"}
            </Text>
          </View>
          <Text className="text-slate-900 text-lg font-bold">
            {user?.name || "Parent User"}
          </Text>
          <Text className="text-slate-500 text-sm mt-0.5">
            {user?.email || "parent@school.com"}
          </Text>
        </Card>

        <Card padding="none" className="overflow-hidden">
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              className={`flex-row items-center px-5 py-4 ${
                index < MENU_ITEMS.length - 1 ? "border-b border-slate-50" : ""
              }`}
              activeOpacity={0.7}
              onPress={() => handleMenuPress(item.route)}
            >
              <View className="w-8 h-8 bg-slate-50 rounded-lg items-center justify-center">
                <Ionicons name={item.icon as any} size={18} color="#64748B" />
              </View>
              <Text className="text-slate-700 text-sm font-medium ml-3 flex-1">
                {item.label}
              </Text>
              <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
            </TouchableOpacity>
          ))}
        </Card>

        <TouchableOpacity
          className="mt-6 bg-white rounded-2xl border border-red-100 p-4 items-center"
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text className="text-status-error font-semibold text-sm">
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
