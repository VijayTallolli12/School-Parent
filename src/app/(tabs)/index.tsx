import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/auth.store";
import { router } from "expo-router";
import { Card } from "@/components/ui/Card";

const MODULES = [
  { icon: "calendar-outline", label: "Attendance", color: "#3B82F6" },
  { icon: "cash-outline", label: "Fees", color: "#10B981" },
  { icon: "book-outline", label: "Homework", color: "#F59E0B" },
  { icon: "notifications-outline", label: "Notices", color: "#EF4444" },
  { icon: "time-outline", label: "Timetable", color: "#8B5CF6" },
  { icon: "trophy-outline", label: "Results", color: "#EC4899" },
  { icon: "document-text-outline", label: "Leave", color: "#06B6D4" },
  { icon: "settings-outline", label: "Settings", color: "#6B7280" },
];

export default function DashboardScreen() {
  const user = useAuthStore((s) => s.user);
  const students = useAuthStore((s) => s.students);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-background">
      {/* Header */}
      <View className="bg-white px-5 pt-4 pb-5 border-b border-slate-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              Welcome back,
            </Text>
            <Text className="text-slate-800 text-xl font-bold mt-0.5">
              {user?.name || "Parent"}
            </Text>
          </View>
          <TouchableOpacity
            className="w-10 h-10 bg-slate-100 rounded-full items-center justify-center"
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Student selector */}
        {students.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4 -mb-1"
          >
            {students.map((student) => (
              <TouchableOpacity
                key={student.id}
                className="flex-row items-center bg-primary-50 border border-primary-100 rounded-xl px-3 py-2 mr-2"
                activeOpacity={0.7}
              >
                <View className="w-8 h-8 bg-primary-200 rounded-full items-center justify-center mr-2">
                  <Text className="text-primary-700 font-bold text-sm">
                    {student.name.charAt(0)}
                  </Text>
                </View>
                <View>
                  <Text className="text-slate-800 font-semibold text-sm">
                    {student.name}
                  </Text>
                  <Text className="text-slate-500 text-xs">
                    Class {student.class}-{student.section}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <ScrollView
        className="flex-1 px-5 pt-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions Grid */}
        <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
          Quick Actions
        </Text>
        <View className="flex-row flex-wrap gap-3 mb-8">
          {MODULES.map((module) => (
            <TouchableOpacity
              key={module.label}
              className="w-[47%] bg-white rounded-2xl p-4 border border-slate-100"
              activeOpacity={0.7}
              style={{
                shadowColor: "#1E293B",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View
                className="w-11 h-11 rounded-xl items-center justify-center mb-3"
                style={{ backgroundColor: module.color + "15" }}
              >
                <Ionicons
                  name={module.icon as any}
                  size={22}
                  color={module.color}
                />
              </View>
              <Text className="text-slate-800 font-semibold text-sm">
                {module.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
          Recent Activity
        </Text>
        <Card padding="lg">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
              <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-slate-800 font-medium text-sm">
                No recent activity
              </Text>
              <Text className="text-slate-400 text-xs mt-0.5">
                Activity will appear here once school updates are available
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
