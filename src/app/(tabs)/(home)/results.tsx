import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const EXAMS = [
  {
    id: 1,
    name: "Mid-Term Examinations",
    date: "Jun 10 - Jun 20, 2026",
    status: "upcoming" as const,
  },
  {
    id: 2,
    name: "Unit Test 2",
    date: "May 5 - May 10, 2026",
    status: "completed" as const,
    results: [
      { subject: "Mathematics", total: 100, obtained: 85, grade: "A" },
      { subject: "Science", total: 100, obtained: 78, grade: "B+" },
      { subject: "English", total: 100, obtained: 92, grade: "A+" },
      { subject: "Hindi", total: 100, obtained: 88, grade: "A" },
      { subject: "Social Studies", total: 100, obtained: 76, grade: "B+" },
    ],
  },
  {
    id: 3,
    name: "Unit Test 1",
    date: "Feb 10 - Feb 15, 2026",
    status: "completed" as const,
    results: [
      { subject: "Mathematics", total: 100, obtained: 82, grade: "A" },
      { subject: "Science", total: 100, obtained: 85, grade: "A" },
      { subject: "English", total: 100, obtained: 88, grade: "A" },
      { subject: "Hindi", total: 100, obtained: 90, grade: "A+" },
      { subject: "Social Studies", total: 100, obtained: 72, grade: "B+" },
    ],
  },
];

const overallPercentage = (results: { obtained: number; total: number }[]) => {
  const total = results.reduce((s, r) => s + r.total, 0);
  const obtained = results.reduce((s, r) => s + r.obtained, 0);
  return Math.round((obtained / total) * 100);
};

const getGradeFromPercentage = (percentage: number) => {
  if (percentage >= 90) return { grade: "A+", color: "#16A34A" };
  if (percentage >= 80) return { grade: "A", color: "#22C55E" };
  if (percentage >= 70) return { grade: "B+", color: "#3B82F6" };
  if (percentage >= 60) return { grade: "B", color: "#F59E0B" };
  if (percentage >= 50) return { grade: "C", color: "#F97316" };
  return { grade: "D", color: "#DC2626" };
};

export default function ResultsScreen() {
  const [selectedExam, setSelectedExam] = useState<number | null>(2);

  const completedExams = EXAMS.filter((e) => e.status === "completed");
  const selected = EXAMS.find((e) => e.id === selectedExam);

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
            Exams & Results
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-5"
        showsVerticalScrollIndicator={false}
      >
        {/* Upcoming Exams */}
        <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
          Upcoming Exams
        </Text>
        {EXAMS.filter((e) => e.status === "upcoming").map((exam) => (
          <Card key={exam.id} padding="md" className="flex-row items-center mb-4">
            <View className="w-12 h-12 bg-primary-50 rounded-2xl items-center justify-center mr-3">
              <Ionicons name="calendar-outline" size={24} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-800 text-sm font-bold">{exam.name}</Text>
              <Text className="text-slate-400 text-xs mt-0.5">{exam.date}</Text>
            </View>
            <Badge label="Upcoming" variant="info" />
          </Card>
        ))}

        {/* Completed Exam Selector */}
        <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
          Results
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          {completedExams.map((exam) => {
            const pct = exam.results ? overallPercentage(exam.results) : 0;
            const gradeInfo = getGradeFromPercentage(pct);
            return (
              <TouchableOpacity
                key={exam.id}
                className={`px-4 py-3 rounded-2xl mr-3 border ${
                  selectedExam === exam.id
                    ? "bg-primary-600 border-primary-600"
                    : "bg-white border-slate-100"
                }`}
                onPress={() => setSelectedExam(exam.id)}
                activeOpacity={0.7}
                style={
                  selectedExam === exam.id
                    ? {
                        shadowColor: "#2563EB",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.2,
                        shadowRadius: 8,
                        elevation: 4,
                      }
                    : {
                        shadowColor: "#1E293B",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.06,
                        shadowRadius: 8,
                        elevation: 2,
                      }
                }
              >
                <Text className={`text-sm font-bold ${
                  selectedExam === exam.id ? "text-white" : "text-slate-800"
                }`}>
                  {exam.name}
                </Text>
                <Text className={`text-xs mt-0.5 ${
                  selectedExam === exam.id ? "text-primary-200" : "text-slate-400"
                }`}>
                  {exam.date}
                </Text>
                {exam.results && (
                  <View className="flex-row items-center mt-2">
                    <Text className={`text-lg font-bold ${
                      selectedExam === exam.id ? "text-white" : "text-slate-800"
                    }`}>
                      {pct}%
                    </Text>
                    <Text className={`ml-1.5 text-xs font-semibold px-1.5 py-0.5 rounded ${
                      selectedExam === exam.id
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {gradeInfo.grade}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Selected Exam Details */}
        {selected?.results && (
          <>
            {/* Overall Summary Card */}
            <Card padding="lg" className="mb-4">
              <View className="flex-row items-center justify-between mb-4">
                <View>
                  <Text className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                    Overall Performance
                  </Text>
                  <Text className="text-slate-800 text-3xl font-bold mt-1">
                    {overallPercentage(selected.results)}%
                  </Text>
                </View>
                <View className="w-16 h-16 bg-primary-50 rounded-2xl items-center justify-center">
                  <Text className="text-primary-600 text-2xl font-bold">
                    {getGradeFromPercentage(overallPercentage(selected.results)).grade}
                  </Text>
                </View>
              </View>
              <View className="bg-slate-100 rounded-full h-2 overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${overallPercentage(selected.results)}%`,
                    backgroundColor: getGradeFromPercentage(overallPercentage(selected.results)).color,
                  }}
                />
              </View>
            </Card>

            {/* Subject Results */}
            <Card padding="none" className="overflow-hidden mb-8">
              {selected.results.map((result, index) => {
                const pct = Math.round((result.obtained / result.total) * 100);
                const barColor = pct >= 80 ? "#16A34A" : pct >= 60 ? "#F59E0B" : "#DC2626";
                return (
                  <View
                    key={result.subject}
                    className={`px-4 py-3.5 ${
                      index < selected.results!.length - 1 ? "border-b border-slate-50" : ""
                    }`}
                  >
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-slate-800 text-sm font-semibold flex-1">
                        {result.subject}
                      </Text>
                      <Text className="text-slate-600 text-sm font-bold mr-2">
                        {result.obtained}/{result.total}
                      </Text>
                      <Badge
                        label={result.grade}
                        variant={
                          pct >= 80 ? "success" : pct >= 60 ? "warning" : "error"
                        }
                      />
                    </View>
                    <View className="bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <View
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: barColor,
                        }}
                      />
                    </View>
                  </View>
                );
              })}
            </Card>
          </>
        )}

        {!selected?.results && selected?.status === "upcoming" && (
          <Card padding="lg" className="items-center mb-8">
            <View className="w-14 h-14 bg-slate-100 rounded-full items-center justify-center mb-3">
              <Ionicons name="hourglass-outline" size={28} color="#94A3B8" />
            </View>
            <Text className="text-slate-600 text-sm font-medium">
              Results not published yet
            </Text>
            <Text className="text-slate-400 text-xs mt-1 text-center">
              Results will appear here once the exam is completed and evaluated
            </Text>
          </Card>
        )}

        {completedExams.length === 0 && (
          <View className="items-center justify-center py-12">
            <View className="w-16 h-16 bg-slate-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="document-text-outline" size={28} color="#94A3B8" />
            </View>
            <Text className="text-slate-600 text-base font-semibold">
              No Results Yet
            </Text>
            <Text className="text-slate-400 text-sm mt-1 text-center">
              Exam results will appear here once published by the school
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
