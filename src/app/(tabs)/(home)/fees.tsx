import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

const FEE_SUMMARY = {
  total: 45000,
  paid: 32500,
  due: 12500,
};

const FEE_HISTORY = [
  { id: 1, type: "Tuition Fee", amount: 5000, paid: 5000, due: 0, due_date: "05 Apr 2026", status: "paid" as const },
  { id: 2, type: "Transport Fee", amount: 2500, paid: 2500, due: 0, due_date: "05 Apr 2026", status: "paid" as const },
  { id: 3, type: "Library Fee", amount: 1000, paid: 1000, due: 0, due_date: "10 Apr 2026", status: "paid" as const },
  { id: 4, type: "Tuition Fee", amount: 5000, paid: 5000, due: 0, due_date: "05 May 2026", status: "paid" as const },
  { id: 5, type: "Transport Fee", amount: 2500, paid: 2500, due: 0, due_date: "05 May 2026", status: "paid" as const },
  { id: 6, type: "Tuition Fee", amount: 5000, paid: 0, due: 5000, due_date: "05 Jun 2026", status: "unpaid" as const },
  { id: 7, type: "Activity Fee", amount: 2000, paid: 0, due: 2000, due_date: "15 Jun 2026", status: "unpaid" as const },
  { id: 8, type: "Annual Sports Fee", amount: 3000, paid: 0, due: 3000, due_date: "20 Jun 2026", status: "unpaid" as const },
  { id: 9, type: "Exam Fee", amount: 1500, paid: 1500, due: 0, due_date: "01 Jun 2026", status: "paid" as const },
  { id: 10, type: "Computer Lab Fee", amount: 1000, paid: 0, due: 1000, due_date: "25 Jun 2026", status: "unpaid" as const },
];

const PAYMENT_HISTORY = FEE_HISTORY.filter(f => f.status === "paid").slice(0, 4);

export default function FeesScreen() {
  const [activeTab, setActiveTab] = useState<"overview" | "history">("overview");

  const paidPercentage = Math.round((FEE_SUMMARY.paid / FEE_SUMMARY.total) * 100);

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
            Fees
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-5"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Summary Card */}
        <Card padding="lg" className="mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                Total Fees
              </Text>
              <Text className="text-slate-800 text-3xl font-bold mt-1">
                ₹{FEE_SUMMARY.total.toLocaleString()}
              </Text>
            </View>
            <View className="w-14 h-14 bg-green-50 rounded-2xl items-center justify-center">
              <Ionicons name="wallet-outline" size={28} color="#16A34A" />
            </View>
          </View>

          {/* Progress Bar */}
          <View className="bg-slate-100 rounded-full h-3 mb-4 overflow-hidden">
            <View
              className="h-full rounded-full bg-green-500"
              style={{ width: `${paidPercentage}%` }}
            />
          </View>

          <View className="flex-row justify-between">
            <View className="items-center flex-1">
              <Text className="text-slate-800 text-lg font-bold text-green-600">
                ₹{FEE_SUMMARY.paid.toLocaleString()}
              </Text>
              <Text className="text-slate-400 text-xs mt-0.5">Paid</Text>
            </View>
            <View className="w-px bg-slate-100" />
            <View className="items-center flex-1">
              <Text className="text-slate-800 text-lg font-bold text-amber-600">
                ₹{FEE_SUMMARY.due.toLocaleString()}
              </Text>
              <Text className="text-slate-400 text-xs mt-0.5">Due</Text>
            </View>
          </View>
        </Card>

        {/* Due Alerts */}
        {FEE_HISTORY.filter(f => f.status === "unpaid").length > 0 && (
          <Card padding="md" className="mb-4 bg-amber-50 border-amber-200">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-amber-100 rounded-xl items-center justify-center mr-3">
                <Ionicons name="alert-circle" size={22} color="#F59E0B" />
              </View>
              <View className="flex-1">
                <Text className="text-amber-800 text-sm font-bold">
                  {FEE_HISTORY.filter(f => f.status === "unpaid").length} Payments Due
                </Text>
                <Text className="text-amber-600 text-xs mt-0.5">
                  Total due: ₹{FEE_HISTORY.filter(f => f.status === "unpaid").reduce((s, f) => s + f.due, 0).toLocaleString()}
                </Text>
              </View>
              <TouchableOpacity className="px-3 py-1.5 bg-amber-500 rounded-lg">
                <Text className="text-white text-xs font-bold">Pay Now</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}

        {/* Tabs */}
        <View className="flex-row bg-slate-100 rounded-xl p-1 mb-4">
          <TouchableOpacity
            className={`flex-1 py-2.5 rounded-lg items-center ${
              activeTab === "overview" ? "bg-white shadow-sm" : ""
            }`}
            onPress={() => setActiveTab("overview")}
          >
            <Text className={`text-sm font-semibold ${
              activeTab === "overview" ? "text-primary-600" : "text-slate-500"
            }`}>
              Fee Structure
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2.5 rounded-lg items-center ${
              activeTab === "history" ? "bg-white shadow-sm" : ""
            }`}
            onPress={() => setActiveTab("history")}
          >
            <Text className={`text-sm font-semibold ${
              activeTab === "history" ? "text-primary-600" : "text-slate-500"
            }`}>
              Payment History
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "overview" ? (
          /* Fee Structure List */
          <Card padding="none" className="overflow-hidden mb-8">
            {FEE_HISTORY.map((fee, index) => (
              <View
                key={fee.id}
                className={`flex-row items-center px-4 py-3.5 ${
                  index < FEE_HISTORY.length - 1 ? "border-b border-slate-50" : ""
                }`}
              >
                <View className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${
                  fee.status === "paid" ? "bg-green-50" : "bg-red-50"
                }`}>
                  <Ionicons
                    name={fee.status === "paid" ? "checkmark-circle" : "alert-circle"}
                    size={20}
                    color={fee.status === "paid" ? "#16A34A" : "#DC2626"}
                  />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Text className="text-slate-800 text-sm font-semibold flex-1">
                      {fee.type}
                    </Text>
                    <Text className="text-slate-800 text-sm font-bold">
                      ₹{fee.amount.toLocaleString()}
                    </Text>
                  </View>
                  <View className="flex-row items-center mt-0.5">
                    <Text className="text-slate-400 text-xs">Due: {fee.due_date}</Text>
                    <View className="ml-2">
                      <Badge
                        label={fee.status === "paid" ? "Paid" : "Unpaid"}
                        variant={fee.status === "paid" ? "success" : "error"}
                      />
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </Card>
        ) : (
          /* Payment History */
          <Card padding="none" className="overflow-hidden mb-8">
            {PAYMENT_HISTORY.length > 0 ? (
              PAYMENT_HISTORY.map((payment, index) => (
                <View
                  key={payment.id}
                  className={`flex-row items-center px-4 py-3.5 ${
                    index < PAYMENT_HISTORY.length - 1 ? "border-b border-slate-50" : ""
                  }`}
                >
                  <View className="w-10 h-10 bg-green-50 rounded-xl items-center justify-center mr-3">
                    <Ionicons name="receipt-outline" size={20} color="#16A34A" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-800 text-sm font-semibold">
                      {payment.type}
                    </Text>
                    <Text className="text-slate-400 text-xs mt-0.5">
                      Paid on {payment.due_date}
                    </Text>
                  </View>
                  <TouchableOpacity className="px-3 py-1.5 bg-slate-100 rounded-lg mr-2">
                    <Text className="text-slate-600 text-xs font-semibold">Receipt</Text>
                  </TouchableOpacity>
                  <Text className="text-green-600 text-sm font-bold">
                    ₹{payment.paid.toLocaleString()}
                  </Text>
                </View>
              ))
            ) : (
              <EmptyState
                icon="receipt-outline"
                title="No Payment History"
                description="Your payment records will appear here"
              />
            )}
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
