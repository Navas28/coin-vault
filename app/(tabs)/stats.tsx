import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { ChartMode, FilterPeriod, useStats } from "../../hooks/useStats";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function Stats() {
  const { colors, isDark } = useTheme();
  const {
    totalIncome,
    totalExpense,
    netSavings,
    expenseCategoryStats,
    incomeCategoryStats,
    loading,
    filter,
    setFilter,
    customFrom,
    customTo,
    setCustomFrom,
    setCustomTo,
    refetch,
  } = useStats();

  const [chartMode, setChartMode] = useState<ChartMode>("expense");
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const op = isDark ? colors.whiteOpacity : colors.blackOpacity;
  const gradientColors = (
    isDark ? [colors.background, "#284b5c"] : [colors.background, "#F2F5F7"]
  ) as [string, string];

  const FILTERS: FilterPeriod[] = ["Week", "Month", "Year", "Custom"];

  const formatAmount = (v: number) => `₹${Math.round(v).toLocaleString()}`;

  const activeCategoryStats =
    chartMode === "expense" ? expenseCategoryStats : incomeCategoryStats;
  const activeTotalForChart =
    chartMode === "expense" ? totalExpense : totalIncome;

  const chartData = activeCategoryStats.map((cat) => ({
    value: cat.total,
    color: cat.color,
    text: cat.name,
  }));

  return (
    <LinearGradient colors={gradientColors} className="flex-1 pt-5">
      <SafeAreaView className="flex-1" edges={["top"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 110 }}
        >
          <View className="px-6 mt-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {FILTERS.map((f) => (
                  <TouchableOpacity
                    key={f}
                    onPress={() => setFilter(f)}
                    className="px-[18px] py-[9px] rounded-[20px] border"
                    style={{
                      backgroundColor: filter === f ? colors.emerald : op(0.07),
                      borderColor:
                        filter === f ? colors.emerald : colors.border,
                    }}
                  >
                    <Text
                      className="font-bold text-[13px] tracking-[0.3px]"
                      style={{
                        color: filter === f ? "#fff" : colors.textMuted,
                      }}
                    >
                      {f === "Custom" ? "📅 Range" : f}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {filter === "Custom" && (
            <View
              className="mx-6 mt-3.5 rounded-[18px] p-4 flex-row gap-3 border"
              style={{
                backgroundColor: isDark ? colors.card : "#FFFFFF",
                borderColor: colors.border,
              }}
            >
              <TouchableOpacity
                onPress={() => setShowFromPicker(true)}
                className="flex-1 rounded-xl p-3 items-center border"
                style={{
                  backgroundColor: op(0.05),
                  borderColor: colors.border,
                }}
              >
                <Text
                  className="text-[10px] font-bold uppercase"
                  style={{ color: colors.textMuted }}
                >
                  From
                </Text>
                <Text
                  className="font-bold text-sm mt-1"
                  style={{ color: colors.text }}
                >
                  {format(customFrom, "dd MMM")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowToPicker(true)}
                className="flex-1 rounded-xl p-3 items-center border"
                style={{
                  backgroundColor: op(0.05),
                  borderColor: colors.border,
                }}
              >
                <Text
                  className="text-[10px] font-bold uppercase"
                  style={{ color: colors.textMuted }}
                >
                  To
                </Text>
                <Text
                  className="font-bold text-sm mt-1"
                  style={{ color: colors.text }}
                >
                  {format(customTo, "dd MMM")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={refetch}
                className="w-11 rounded-xl items-center justify-center"
                style={{ backgroundColor: colors.emerald }}
              >
                <MaterialIcons name="refresh" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          {showFromPicker && (
            <DateTimePicker
              value={customFrom}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              maximumDate={customTo}
              onChange={(_, d) => {
                setShowFromPicker(false);
                if (d) setCustomFrom(d);
              }}
            />
          )}
          {showToPicker && (
            <DateTimePicker
              value={customTo}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              minimumDate={customFrom}
              maximumDate={new Date()}
              onChange={(_, d) => {
                setShowToPicker(false);
                if (d) setCustomTo(d);
              }}
            />
          )}

          <View className="mx-6 mt-[18px] flex-row gap-3">
            <View
              className="flex-1 rounded-[20px] p-4 border"
              style={{
                backgroundColor: isDark ? colors.card : "#FFFFFF",
                borderColor: colors.border,
              }}
            >
              <Text
                className="text-[12px] font-bold"
                style={{ color: colors.textMuted }}
              >
                INCOME
              </Text>
              <Text
                className="font-bold text-lg mt-1"
                style={{ color: "#4ADE80" }}
              >
                {formatAmount(totalIncome)}
              </Text>
            </View>
            <View
              className="flex-1 rounded-[20px] p-4 border"
              style={{
                backgroundColor: isDark ? colors.card : "#FFFFFF",
                borderColor: colors.border,
              }}
            >
              <Text
                className="text-[12px] font-bold"
                style={{ color: colors.textMuted }}
              >
                EXPENSE
              </Text>
              <Text
                className="font-bold text-lg mt-1"
                style={{ color: "#F87171" }}
              >
                {formatAmount(totalExpense)}
              </Text>
            </View>
          </View>

          <View className="mx-6 mt-5">
            <View
              className="flex-row rounded-2xl p-1"
              style={{ backgroundColor: op(0.06) }}
            >
              {(["expense", "income"] as ChartMode[]).map((m) => (
                <TouchableOpacity
                  key={m}
                  onPress={() => setChartMode(m)}
                  className="flex-1 py-2.5 rounded-xl items-center"
                  style={{
                    backgroundColor:
                      chartMode === m
                        ? m === "expense"
                          ? "#F87171"
                          : "#4ADE80"
                        : "transparent",
                  }}
                >
                  <Text
                    className="font-bold text-[12px]"
                    style={{
                      color: chartMode === m ? "#fff" : colors.textMuted,
                    }}
                  >
                    {m === "expense" ? "Expenses" : "Income"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {loading ? (
            <View className="mt-[60px] items-center">
              <ActivityIndicator size="large" color={colors.emerald} />
            </View>
          ) : activeCategoryStats.length === 0 ? (
            <View className="mt-10 items-center">
              <MaterialIcons
                name="pie-chart"
                size={48}
                color={colors.textMuted}
              />
              <Text
                className="mt-3 text-sm"
                style={{ color: colors.textMuted }}
              >
                No data for this period
              </Text>
            </View>
          ) : (
            <>
              <View className="items-center mt-[30px]">
                <PieChart
                  donut
                  radius={110}
                  innerRadius={75}
                  data={chartData}
                  centerLabelComponent={() => (
                    <View className="items-center justify-center">
                      <Text
                        className="text-[12px] font-bold"
                        style={{ color: colors.textMuted }}
                      >
                        TOTAL
                      </Text>
                      <Text
                        className="text-xl font-extrabold"
                        style={{ color: colors.text }}
                      >
                        {formatAmount(activeTotalForChart)}
                      </Text>
                    </View>
                  )}
                  innerCircleColor={isDark ? colors.card : "#FFFFFF"}
                />
              </View>

              <View
                className="mx-6 mt-[30px] rounded-[24px] p-4 border"
                style={{
                  backgroundColor: isDark ? colors.card : "#FFFFFF",
                  borderColor: colors.border,
                }}
              >
                <Text
                  className="font-extrabold text-base mb-4"
                  style={{ color: colors.text }}
                >
                  Breakdown
                </Text>
                {activeCategoryStats.map((cat, i) => (
                  <View
                    key={cat.name}
                    className="flex-row items-center justify-between py-3"
                    style={{
                      borderBottomWidth:
                        i === activeCategoryStats.length - 1 ? 0 : 1,
                      borderBottomColor: colors.border,
                    }}
                  >
                    <View className="flex-row items-center gap-3 flex-1">
                      <View
                        className="w-[10px] h-[10px] rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <MaterialIcons
                        name={cat.icon as any}
                        size={18}
                        color={cat.color}
                      />
                      <Text
                        className="font-semibold"
                        style={{ color: colors.text }}
                      >
                        {cat.name}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text
                        className="font-bold"
                        style={{ color: colors.text }}
                      >
                        {formatAmount(cat.total)}
                      </Text>
                      <Text
                        className="text-[11px]"
                        style={{ color: colors.textMuted }}
                      >
                        {cat.percentage.toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
