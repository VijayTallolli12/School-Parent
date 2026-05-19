import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTHLY_STATS = {
  present: 22,
  absent: 1,
  late: 2,
  halfDay: 0,
  total: 25,
};

const generateCalendarDays = () => {
  const days: { date: number; status: "present" | "absent" | "late" | "half_day" | "future" | null }[] = [];
  const totalDays = 30;
  for (let i = 1; i <= totalDays; i++) {
    if (i > 25) {
      days.push({ date: i, status: "future" });
    } else if (i === 8) {
      days.push({ date: i, status: "absent" });
    } else if (i === 15 || i === 22) {
      days.push({ date: i, status: "late" });
    } else {
      days.push({ date: i, status: "present" });
    }
  }
  return days;
};

const calendarDays = generateCalendarDays();
const firstDayOfMonth = 1;

export default function AttendanceScreen() {
  const [selectedMonth] = useState(4);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const percentage = Math.round((MONTHLY_STATS.present / MONTHLY_STATS.total) * 100);

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "present": return "bg-green-500";
      case "absent": return "bg-red-500";
      case "late": return "bg-amber-500";
      case "half_day": return "bg-blue-500";
      default: return "bg-slate-100";
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case "present": return "checkmark-circle";
      case "absent": return "close-circle";
      case "late": return "time";
      case "half_day": return "remove-circle";
      default: return "ellipse-outline";
    }
  };

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case "present": return "Present";
      case "absent": return "Absent";
      case "late": return "Late";
      case "half_day": return "Half Day";
      default: return "";
    }
  };

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
          <Text className="text-slate-800 text-lg font-bold tracking-tight">
            Attendance
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-5"
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Cards Row */}
        <View className="flex-row gap-3 mb-4">
          <Card padding="md" className="flex-1 items-center">
            <Text className="text-green-600 text-2xl font-bold">{MONTHLY_STATS.present}</Text>
            <Text className="text-slate-400 text-xs mt-1">Present</Text>
          </Card>
          <Card padding="md" className="flex-1 items-center">
            <Text className="text-red-600 text-2xl font-bold">{MONTHLY_STATS.absent}</Text>
            <Text className="text-slate-400 text-xs mt-1">Absent</Text>
          </Card>
          <Card padding="md" className="flex-1 items-center">
            <Text className="text-amber-600 text-2xl font-bold">{MONTHLY_STATS.late}</Text>
            <Text className="text-slate-400 text-xs mt-1">Late</Text>
          </Card>
        </View>

        {/* Attendance Ring Card */}
        <Card padding="lg" className="mb-4">
          <View className="flex-row items-center">
            {/* Ring visualization */}
            <View className="w-24 h-24 rounded-full bg-slate-100 items-center justify-center mr-5 relative">
              <View
                className="absolute inset-0 rounded-full border-4 border-green-500"
                style={{
                  borderLeftColor: percentage > 75 ? "#16A34A" : "#F59E0B",
                  borderBottomColor: percentage > 75 ? "#16A34A" : "#F59E0B",
                  borderRightColor: percentage > 75 ? "#16A34A" : "#F59E0B",
                  transform: [{ rotate: "-45deg" }],
                }}
              />
              <View className="w-20 h-20 bg-white rounded-full items-center justify-center">
                <Text className="text-slate-800 text-2xl font-bold">{percentage}%</Text>
              </View>
            </View>
            <View className="flex-1">
              <Text className="text-slate-800 text-base font-bold">
                Monthly Attendance
              </Text>
              <Text className="text-slate-400 text-xs mt-1">
                {MONTHS[selectedMonth]} 2026
              </Text>
              <View className="flex-row items-center mt-2">
                <Badge label={`${percentage}%`} variant={percentage >= 75 ? "success" : "warning"} />
                <Text className="text-slate-400 text-xs ml-2">
                  {percentage >= 75 ? "Good" : "Needs Improvement"}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Legend */}
        <View className="flex-row justify-center gap-4 mb-4">
          {[
            { label: "Present", color: "bg-green-500" },
            { label: "Absent", color: "bg-red-500" },
            { label: "Late", color: "bg-amber-500" },
          ].map((item) => (
            <View key={item.label} className="flex-row items-center">
              <View className={`w-3 h-3 rounded-full ${item.color} mr-1.5`} />
              <Text className="text-slate-500 text-xs">{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Calendar */}
        <Card padding="md" className="mb-8">
          {/* Month Header */}
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity className="w-8 h-8 bg-slate-100 rounded-lg items-center justify-center">
              <Ionicons name="chevron-back" size={18} color="#64748B" />
            </TouchableOpacity>
            <Text className="text-slate-800 text-base font-bold">
              {MONTHS[selectedMonth]} 2026
            </Text>
            <TouchableOpacity className="w-8 h-8 bg-slate-100 rounded-lg items-center justify-center">
              <Ionicons name="chevron-forward" size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Day Headers */}
          <View className="flex-row mb-2">
            {DAYS.map((day) => (
              <View key={day} className="flex-1 items-center py-1">
                <Text className="text-slate-400 text-[11px] font-medium">{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          <View className="flex-row flex-wrap">
            {/* Empty cells for offset */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <View key={`empty-${i}`} className="w-[14.28%] aspect-square p-1" />
            ))}
            {calendarDays.map((day) => (
              <TouchableOpacity
                key={day.date}
                className="w-[14.28%] aspect-square p-1"
                onPress={() => setSelectedDay(day.date)}
              >
                <View className={`flex-1 rounded-xl items-center justify-center ${
                  selectedDay === day.date ? "border-2 border-primary-500" : ""
                } ${day.status === "future" ? "opacity-30" : ""}`}>
                  {day.status && day.status !== "future" ? (
                    <Ionicons
                      name={getStatusIcon(day.status) as any}
                      size={20}
                      color={
                        day.status === "present" ? "#16A34A" :
                        day.status === "absent" ? "#DC2626" :
                        "#F59E0B"
                      }
                    />
                  ) : (
                    <Text className={`text-xs ${
                      day.status === "future" ? "text-slate-300" : "text-slate-600"
                    }`}>
                      {day.date}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Selected Day Detail */}
        {selectedDay && (
          <Card padding="md" className="mb-8">
            <Text className="text-slate-800 text-sm font-bold mb-2">
              {DAYS[new Date(2026, selectedMonth, selectedDay).getDay()]}, {selectedDay} {MONTHS[selectedMonth]} 2026
            </Text>
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-green-50 rounded-xl items-center justify-center mr-3">
                <Ionicons name="checkmark-circle" size={22} color="#16A34A" />
              </View>
              <View>
                <Text className="text-slate-800 text-sm font-semibold">Present</Text>
                <Text className="text-slate-400 text-xs mt-0.5">Regular class day</Text>
              </View>
            </View>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
