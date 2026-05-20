import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/auth.store";
import { router } from "expo-router";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const MODULES = [
  { icon: "calendar-outline", label: "Attendance", color: "#3B82F6", route: "attendance" },
  { icon: "cash-outline", label: "Fees", color: "#10B981", route: "fees" },
  { icon: "book-outline", label: "Homework", color: "#F59E0B", route: null },
  { icon: "notifications-outline", label: "Notices", color: "#EF4444", route: "notifications" },
  { icon: "time-outline", label: "Timetable", color: "#8B5CF6", route: "timetable" },
  { icon: "trophy-outline", label: "Results", color: "#EC4899", route: "results" },
  { icon: "document-text-outline", label: "Leave", color: "#06B6D4", route: null },
  { icon: "settings-outline", label: "Settings", color: "#6B7280", route: null },
];

const RECENT_NOTIFICATIONS = [
  { id: 1, title: "Fee Reminder", body: "Tuition fee for May is due on 25th", type: "fees", time: "2 hours ago", is_read: false },
  { id: 2, title: "Attendance Alert", body: "Your child was marked absent today", type: "attendance", time: "1 day ago", is_read: false },
  { id: 3, title: "Exam Schedule", body: "Mid-term exams start June 10", type: "result", time: "3 days ago", is_read: true },
];

const UPCOMING_EXAMS = [
  { subject: "Mathematics", date: "Jun 10", time: "09:00 AM" },
  { subject: "Science", date: "Jun 12", time: "09:00 AM" },
  { subject: "English", date: "Jun 14", time: "09:00 AM" },
];

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const user = useAuthStore((s) => s.user);
  const students = useAuthStore((s) => s.students);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const firstStudent = students[0];

  return (
    <SafeAreaView className="flex-1 bg-surface-background">
      {/* Header */}
      <View className="bg-white px-5 pt-4 pb-4 border-b border-slate-100">
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
            className="w-10 h-10 bg-slate-100 rounded-full items-center justify-center relative"
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={20} color="#64748B" />
            <View className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-status-error rounded-full items-center justify-center">
              <Text className="text-white text-[9px] font-bold">3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Student Chip */}
        {firstStudent && (
          <TouchableOpacity
            className="flex-row items-center bg-primary-50 border border-primary-100 rounded-xl px-3.5 py-2.5 mt-3"
            activeOpacity={0.7}
            onPress={() => {
              console.log("[Dashboard] Navigating to student-profile");
              router.push("/(tabs)/(home)/student-profile" as any);
            }}
          >
            <View className="w-9 h-9 bg-primary-200 rounded-full items-center justify-center mr-3">
              <Text className="text-primary-700 font-bold text-sm">
                {firstStudent.name.charAt(0)}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-slate-800 font-semibold text-sm">
                {firstStudent.name}
              </Text>
              <Text className="text-slate-500 text-xs">
                Class {firstStudent.class}-{firstStudent.section} • Roll: {firstStudent.roll_number}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B82F6"
            colors={["#3B82F6"]}
          />
        }
      >
        {/* Stats Row */}
        <View className="flex-row gap-3 mt-5 mb-6">
          <Card padding="md" className="flex-1 items-center">
            <View className="w-10 h-10 bg-green-50 rounded-xl items-center justify-center mb-2">
              <Ionicons name="checkmark-circle" size={22} color="#16A34A" />
            </View>
            <Text className="text-slate-800 text-lg font-bold">92%</Text>
            <Text className="text-slate-400 text-xs mt-0.5">Attendance</Text>
          </Card>
          <Card padding="md" className="flex-1 items-center">
            <View className="w-10 h-10 bg-amber-50 rounded-xl items-center justify-center mb-2">
              <Ionicons name="wallet-outline" size={22} color="#F59E0B" />
            </View>
            <Text className="text-slate-800 text-lg font-bold">₹2,500</Text>
            <Text className="text-slate-400 text-xs mt-0.5">Due Fees</Text>
          </Card>
          <Card padding="md" className="flex-1 items-center">
            <View className="w-10 h-10 bg-purple-50 rounded-xl items-center justify-center mb-2">
              <Ionicons name="book-outline" size={22} color="#8B5CF6" />
            </View>
            <Text className="text-slate-800 text-lg font-bold">3</Text>
            <Text className="text-slate-400 text-xs mt-0.5">Homework</Text>
          </Card>
        </View>

        {/* Quick Actions */}
        <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
          Quick Actions
        </Text>
        <View className="flex-row flex-wrap gap-3 mb-6">
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
              onPress={() => {
                if (module.route) {
                  console.log(`[Dashboard] Quick action: ${module.route}`);
                  router.push(`/(tabs)/(home)/${module.route}` as any);
                }
              }}
            >
              <View
                className="w-11 h-11 rounded-xl items-center justify-center mb-3"
                style={{ backgroundColor: module.color + "15" }}
              >
                <Ionicons name={module.icon as any} size={22} color={module.color} />
              </View>
              <Text className="text-slate-800 font-semibold text-sm">
                {module.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Notifications */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Recent Notifications
          </Text>
          <TouchableOpacity
            onPress={() => {
              console.log("[Dashboard] Navigating to notifications");
              router.push("/(tabs)/(home)/notifications" as any);
            }}
          >
            <Text className="text-primary-600 text-xs font-semibold">See All</Text>
          </TouchableOpacity>
        </View>
        <Card padding="none" className="overflow-hidden mb-6">
          {RECENT_NOTIFICATIONS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              className={`flex-row items-center px-4 py-3.5 ${
                index < RECENT_NOTIFICATIONS.length - 1 ? "border-b border-slate-50" : ""
              }`}
              activeOpacity={0.7}
            >
              <View className="relative">
                <View className={[
                  "w-10 h-10 rounded-xl items-center justify-center",
                  item.type === "fees" ? "bg-amber-50" : "",
                  item.type === "attendance" ? "bg-blue-50" : "",
                  item.type === "result" ? "bg-purple-50" : "",
                ].join(" ")}>
                  <Ionicons
                    name={
                      item.type === "fees" ? "wallet-outline" :
                      item.type === "attendance" ? "calendar-outline" :
                      "school-outline"
                    }
                    size={18}
                    color={
                      item.type === "fees" ? "#F59E0B" :
                      item.type === "attendance" ? "#3B82F6" :
                      "#8B5CF6"
                    }
                  />
                </View>
                {!item.is_read && (
                  <View className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary-500 rounded-full border-2 border-white" />
                )}
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-slate-800 text-sm font-semibold">
                  {item.title}
                </Text>
                <Text className="text-slate-400 text-xs mt-0.5" numberOfLines={1}>
                  {item.body}
                </Text>
              </View>
              <Text className="text-slate-400 text-[11px] ml-2">{item.time}</Text>
            </TouchableOpacity>
          ))}
        </Card>

        {/* Upcoming Exams */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Upcoming Exams
          </Text>
          <TouchableOpacity
            onPress={() => {
              console.log("[Dashboard] Navigating to results");
              router.push("/(tabs)/(home)/results" as any);
            }}
          >
            <Text className="text-primary-600 text-xs font-semibold">View All</Text>
          </TouchableOpacity>
        </View>
        <Card padding="none" className="overflow-hidden mb-8">
          {UPCOMING_EXAMS.map((exam, index) => (
            <View
              key={exam.subject}
              className={`flex-row items-center px-4 py-3.5 ${
                index < UPCOMING_EXAMS.length - 1 ? "border-b border-slate-50" : ""
              }`}
            >
              <View className="w-10 h-10 bg-primary-50 rounded-xl items-center justify-center">
                <Ionicons name="school-outline" size={20} color="#3B82F6" />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-slate-800 text-sm font-semibold">
                  {exam.subject}
                </Text>
                <Text className="text-slate-400 text-xs mt-0.5">{exam.time}</Text>
              </View>
              <Badge label={exam.date} variant="info" />
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
