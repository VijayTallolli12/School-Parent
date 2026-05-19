import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

const NOTIFICATIONS = [
  {
    id: 1, title: "Fee Reminder", body: "Tuition fee for the month of June is due. Please pay before 10th June to avoid late fee.", type: "fees" as const, is_read: false, created_at: "2026-05-19T10:30:00Z",
  },
  {
    id: 2, title: "Attendance Alert", body: "Your child was marked absent on 18th May 2026. Please provide a valid reason.", type: "attendance" as const, is_read: false, created_at: "2026-05-18T14:00:00Z",
  },
  {
    id: 3, title: "Mid-Term Exam Schedule", body: "Mid-term examinations will begin from 10th June 2026. Check the timetable for details.", type: "result" as const, is_read: false, created_at: "2026-05-16T09:00:00Z",
  },
  {
    id: 4, title: "PTM Announcement", body: "Parent-Teacher meeting is scheduled for 25th May 2026 at 10:00 AM.", type: "general" as const, is_read: true, created_at: "2026-05-14T11:00:00Z",
  },
  {
    id: 5, title: "Homework Assigned", body: "Mathematics homework has been assigned for the week. Submission deadline: 22nd May.", type: "homework" as const, is_read: true, created_at: "2026-05-13T16:00:00Z",
  },
  {
    id: 6, title: "Summer Break Notice", body: "School will remain closed for summer break from 1st June to 30th June.", type: "general" as const, is_read: true, created_at: "2026-05-10T10:00:00Z",
  },
];

const TYPE_CONFIG = {
  fees: { icon: "wallet-outline" as const, bg: "bg-amber-50", color: "#F59E0B" },
  attendance: { icon: "calendar-outline" as const, bg: "bg-blue-50", color: "#3B82F6" },
  result: { icon: "school-outline" as const, bg: "bg-purple-50", color: "#8B5CF6" },
  general: { icon: "megaphone-outline" as const, bg: "bg-slate-50", color: "#64748B" },
  homework: { icon: "book-outline" as const, bg: "bg-orange-50", color: "#F97316" },
};

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHrs < 1) return "Just now";
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const groupByDate = (notifications: typeof NOTIFICATIONS) => {
  const groups: { label: string; data: typeof NOTIFICATIONS }[] = [];
  const today: typeof NOTIFICATIONS = [];
  const yesterday: typeof NOTIFICATIONS = [];
  const older: typeof NOTIFICATIONS = [];

  notifications.forEach((n) => {
    const date = new Date(n.created_at);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) today.push(n);
    else if (diffDays === 1) yesterday.push(n);
    else older.push(n);
  });

  if (today.length) groups.push({ label: "Today", data: today });
  if (yesterday.length) groups.push({ label: "Yesterday", data: yesterday });
  if (older.length) groups.push({ label: "Earlier", data: older });
  return groups;
};

export default function NotificationsScreen() {
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filtered = filter === "unread"
    ? NOTIFICATIONS.filter((n) => !n.is_read)
    : NOTIFICATIONS;

  const grouped = groupByDate(filtered);
  const unreadCount = NOTIFICATIONS.filter((n) => !n.is_read).length;

  return (
    <SafeAreaView className="flex-1 bg-surface-background">
      {/* Header */}
      <View className="bg-white px-5 pt-4 pb-4 border-b border-slate-100">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-9 h-9 bg-slate-100 rounded-full items-center justify-center mr-3"
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={20} color="#64748B" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-slate-800 text-lg font-bold tracking-tight">
              Notifications
            </Text>
          </View>
          {unreadCount > 0 && (
            <View className="bg-primary-50 px-3 py-1 rounded-full">
              <Text className="text-primary-600 text-xs font-bold">
                {unreadCount} New
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="flex-row px-5 pt-4 pb-3 gap-2">
        <TouchableOpacity
          className={`px-4 py-2 rounded-xl ${
            filter === "all" ? "bg-primary-600" : "bg-slate-100"
          }`}
          onPress={() => setFilter("all")}
        >
          <Text className={`text-sm font-semibold ${
            filter === "all" ? "text-white" : "text-slate-600"
          }`}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`px-4 py-2 rounded-xl ${
            filter === "unread" ? "bg-primary-600" : "bg-slate-100"
          }`}
          onPress={() => setFilter("unread")}
        >
          <Text className={`text-sm font-semibold ${
            filter === "unread" ? "text-white" : "text-slate-600"
          }`}>
            Unread
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
      >
        {grouped.length === 0 ? (
          <EmptyState
            icon="notifications-off-outline"
            title="No Notifications"
            description={filter === "unread" ? "You have no unread notifications" : "No notifications to show"}
          />
        ) : (
          grouped.map((group) => (
            <View key={group.label} className="mb-4">
              <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
                {group.label}
              </Text>
              <Card padding="none" className="overflow-hidden">
                {group.data.map((item, index) => {
                  const config = TYPE_CONFIG[item.type];
                  return (
                    <TouchableOpacity
                      key={item.id}
                      className={`flex-row items-start px-4 py-3.5 ${
                        index < group.data.length - 1 ? "border-b border-slate-50" : ""
                      }`}
                      activeOpacity={0.7}
                    >
                      <View className="relative">
                        <View className={`w-10 h-10 ${config.bg} rounded-xl items-center justify-center`}>
                          <Ionicons name={config.icon} size={20} color={config.color} />
                        </View>
                        {!item.is_read && (
                          <View className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary-500 rounded-full border-2 border-white" />
                        )}
                      </View>
                      <View className="flex-1 ml-3">
                        <View className="flex-row items-center">
                          <Text className={`text-sm flex-1 ${
                            item.is_read ? "text-slate-600" : "text-slate-800 font-semibold"
                          }`}>
                            {item.title}
                          </Text>
                          <Text className="text-slate-400 text-[11px] ml-2">
                            {formatTime(item.created_at)}
                          </Text>
                        </View>
                        <Text
                          className={`text-xs mt-1 leading-4 ${
                            item.is_read ? "text-slate-400" : "text-slate-500"
                          }`}
                          numberOfLines={2}
                        >
                          {item.body}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </Card>
            </View>
          ))
        )}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
