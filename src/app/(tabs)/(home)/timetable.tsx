import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Card } from "@/components/ui/Card";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "#3B82F6",
  Science: "#10B981",
  English: "#8B5CF6",
  Hindi: "#F59E0B",
  "Social Studies": "#EC4899",
  "Physical Education": "#06B6D4",
  "Computer Science": "#6366F1",
  Art: "#F97316",
  "General Knowledge": "#14B8A6",
};

const TIMETABLE: Record<string, { period: number; subject: string; teacher: string; start: string; end: string }[]> = {
  Monday: [
    { period: 1, subject: "Mathematics", teacher: "Mr. Sharma", start: "08:00", end: "08:45" },
    { period: 2, subject: "Science", teacher: "Ms. Patel", start: "08:45", end: "09:30" },
    { period: 3, subject: "English", teacher: "Mr. Kumar", start: "09:30", end: "10:15" },
    { period: 4, subject: "Hindi", teacher: "Ms. Singh", start: "10:15", end: "11:00" },
    { period: 5, subject: "Break", teacher: "", start: "11:00", end: "11:30" },
    { period: 6, subject: "Social Studies", teacher: "Mr. Verma", start: "11:30", end: "12:15" },
    { period: 7, subject: "Computer Science", teacher: "Ms. Gupta", start: "12:15", end: "13:00" },
  ],
  Tuesday: [
    { period: 1, subject: "English", teacher: "Mr. Kumar", start: "08:00", end: "08:45" },
    { period: 2, subject: "Mathematics", teacher: "Mr. Sharma", start: "08:45", end: "09:30" },
    { period: 3, subject: "Science", teacher: "Ms. Patel", start: "09:30", end: "10:15" },
    { period: 4, subject: "Physical Education", teacher: "Mr. Kapoor", start: "10:15", end: "11:00" },
    { period: 5, subject: "Break", teacher: "", start: "11:00", end: "11:30" },
    { period: 6, subject: "Hindi", teacher: "Ms. Singh", start: "11:30", end: "12:15" },
    { period: 7, subject: "Art", teacher: "Ms. Joshi", start: "12:15", end: "13:00" },
  ],
  Wednesday: [
    { period: 1, subject: "Science", teacher: "Ms. Patel", start: "08:00", end: "08:45" },
    { period: 2, subject: "Mathematics", teacher: "Mr. Sharma", start: "08:45", end: "09:30" },
    { period: 3, subject: "Social Studies", teacher: "Mr. Verma", start: "09:30", end: "10:15" },
    { period: 4, subject: "English", teacher: "Mr. Kumar", start: "10:15", end: "11:00" },
    { period: 5, subject: "Break", teacher: "", start: "11:00", end: "11:30" },
    { period: 6, subject: "General Knowledge", teacher: "Ms. Gupta", start: "11:30", end: "12:15" },
    { period: 7, subject: "Computer Science", teacher: "Ms. Gupta", start: "12:15", end: "13:00" },
  ],
  Thursday: [
    { period: 1, subject: "Hindi", teacher: "Ms. Singh", start: "08:00", end: "08:45" },
    { period: 2, subject: "English", teacher: "Mr. Kumar", start: "08:45", end: "09:30" },
    { period: 3, subject: "Mathematics", teacher: "Mr. Sharma", start: "09:30", end: "10:15" },
    { period: 4, subject: "Science", teacher: "Ms. Patel", start: "10:15", end: "11:00" },
    { period: 5, subject: "Break", teacher: "", start: "11:00", end: "11:30" },
    { period: 6, subject: "Physical Education", teacher: "Mr. Kapoor", start: "11:30", end: "12:15" },
    { period: 7, subject: "Art", teacher: "Ms. Joshi", start: "12:15", end: "13:00" },
  ],
  Friday: [
    { period: 1, subject: "Social Studies", teacher: "Mr. Verma", start: "08:00", end: "08:45" },
    { period: 2, subject: "Science", teacher: "Ms. Patel", start: "08:45", end: "09:30" },
    { period: 3, subject: "Mathematics", teacher: "Mr. Sharma", start: "09:30", end: "10:15" },
    { period: 4, subject: "Hindi", teacher: "Ms. Singh", start: "10:15", end: "11:00" },
    { period: 5, subject: "Break", teacher: "", start: "11:00", end: "11:30" },
    { period: 6, subject: "English", teacher: "Mr. Kumar", start: "11:30", end: "12:15" },
    { period: 7, subject: "General Knowledge", teacher: "Ms. Gupta", start: "12:15", end: "13:00" },
  ],
  Saturday: [
    { period: 1, subject: "Physical Education", teacher: "Mr. Kapoor", start: "08:00", end: "08:45" },
    { period: 2, subject: "Art", teacher: "Ms. Joshi", start: "08:45", end: "09:30" },
    { period: 3, subject: "Computer Science", teacher: "Ms. Gupta", start: "09:30", end: "10:15" },
  ],
};

export default function TimetableScreen() {
  const today = DAYS[new Date().getDay() - 1] || "Monday";
  const [selectedDay, setSelectedDay] = useState(today);
  const schedule = TIMETABLE[selectedDay] || [];

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
            Timetable
          </Text>
        </View>

        {/* Day Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4 -mb-1"
        >
          {DAYS.map((day) => (
            <TouchableOpacity
              key={day}
              className={`px-4 py-2 rounded-xl mr-2 ${
                selectedDay === day ? "bg-primary-600" : "bg-slate-100"
              }`}
              onPress={() => setSelectedDay(day)}
              activeOpacity={0.7}
            >
              <Text className={`text-sm font-semibold ${
                selectedDay === day ? "text-white" : "text-slate-600"
              }`}>
                {day.slice(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-5"
        showsVerticalScrollIndicator={false}
      >
        {/* Timeline */}
        <View className="relative pl-4">
          {schedule.map((item, index) => {
            const isBreak = item.subject === "Break";
            const color = SUBJECT_COLORS[item.subject] || "#64748B";

            return (
              <View key={index} className="flex-row mb-3">
                {/* Time column */}
                <View className="w-16 pt-1">
                  <Text className="text-slate-400 text-[11px] font-medium">
                    {item.start}
                  </Text>
                </View>

                {/* Timeline dot + line */}
                <View className="items-center mx-3">
                  <View
                    className={`w-3 h-3 rounded-full mt-1.5 ${
                      isBreak ? "bg-slate-300" : ""
                    }`}
                    style={!isBreak ? { backgroundColor: color } : undefined}
                  />
                  {index < schedule.length - 1 && (
                    <View className="w-0.5 flex-1 bg-slate-200 mt-1" />
                  )}
                </View>

                {/* Subject Card */}
                <TouchableOpacity
                  className="flex-1 pb-3"
                  activeOpacity={isBreak ? 1 : 0.7}
                >
                  <View
                    className={`rounded-2xl p-4 border ${
                      isBreak
                        ? "bg-slate-50 border-slate-100"
                        : "bg-white border-slate-100"
                    }`}
                    style={
                      !isBreak
                        ? {
                            shadowColor: color,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.08,
                            shadowRadius: 6,
                            elevation: 2,
                            borderLeftColor: color,
                            borderLeftWidth: 3,
                          }
                        : undefined
                    }
                  >
                    {isBreak ? (
                      <View className="flex-row items-center justify-center">
                        <Ionicons name="cafe-outline" size={18} color="#94A3B8" />
                        <Text className="text-slate-400 text-sm font-medium ml-2">
                          Break
                        </Text>
                      </View>
                    ) : (
                      <>
                        <View className="flex-row items-center justify-between mb-1">
                          <Text className="text-slate-800 text-sm font-bold">
                            {item.subject}
                          </Text>
                          <Text className="text-slate-400 text-xs">
                            {item.start} - {item.end}
                          </Text>
                        </View>
                        <View className="flex-row items-center">
                          <View className="w-6 h-6 bg-slate-50 rounded-full items-center justify-center mr-1.5">
                            <Ionicons name="person-outline" size={12} color="#64748B" />
                          </View>
                          <Text className="text-slate-500 text-xs">
                            {item.teacher}
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
