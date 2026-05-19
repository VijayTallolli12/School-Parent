import { Stack } from "expo-router";

export default function HomeStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="student-profile" />
      <Stack.Screen name="fees" />
      <Stack.Screen name="attendance" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="timetable" />
      <Stack.Screen name="results" />
    </Stack>
  );
}
