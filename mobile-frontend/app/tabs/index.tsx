import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  useColorScheme,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import {
  apiClient,
  mockApiClient,
  useMockData,
  type Transaction,
  type BalanceData,
} from "@/lib/api-client";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Colors, Shadow } from "@/lib/theme";
import QrScannerScreen from "@/components/QrScanner";

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  const bg = isDark ? Colors.dark.background : Colors.background;
  const surface = isDark ? Colors.dark.surface : Colors.surface;
  const textPrimary = isDark ? Colors.dark.textPrimary : Colors.textPrimary;
  const textSecondary = isDark
    ? Colors.dark.textSecondary
    : Colors.textSecondary;
  const border = isDark ? Colors.dark.border : Colors.border;

  const loadData = async () => {
    try {
      const client = useMockData ? mockApiClient : apiClient;
      const [balRes, txRes] = await Promise.all([
        client.getBalance(),
        client.getTransactions(5),
      ]);
      if (balRes.success && balRes.data) {
        setBalance((balRes.data as BalanceData).balance);
      }
      if (txRes.success && txRes.data) {
        setTransactions(txRes.data as Transaction[]);
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
      Alert.alert(
        "Error",
        "Failed to load dashboard data. Pull down to retry.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleScanSuccess = (data: string) => {
    setScannerOpen(false);
    try {
      if (data.startsWith("paynext://")) {
        const url = new URL(data);
        const action = url.hostname;
        if (action === "request") {
          const dp = url.searchParams.get("details");
          if (dp) {
            const d = JSON.parse(decodeURIComponent(dp));
            router.push(
              `/tabs/send?recipient=${d.userId}&amount=${d.amount}&memo=${encodeURIComponent(d.memo || "")}`,
            );
          }
        } else if (action === "pay") {
          const dp = url.searchParams.get("details");
          if (dp) {
            const d = JSON.parse(decodeURIComponent(dp));
            router.push(
              `/tabs/send?recipient=${d.recipient}&amount=${d.amount}`,
            );
          }
        }
      } else {
        router.push(`/tabs/send?recipient=${encodeURIComponent(data)}`);
      }
    } catch {
      Alert.alert("Invalid QR Code", "The QR code format is not recognised.");
    }
  };

  const QuickAction = ({
    icon,
    label,
    color,
    bgColor,
    onPress,
  }: {
    icon: string;
    label: string;
    color: string;
    bgColor: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[
        styles.quickAction,
        { backgroundColor: surface, borderColor: border },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: bgColor }]}>
        <Ionicons name={icon as any} size={22} color={color} />
      </View>
      <Text style={[styles.quickActionLabel, { color: textSecondary }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: bg }]}
      edges={["top"]}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerGreeting, { color: textSecondary }]}>
              {user
                ? `Welcome back, ${user.name.split(" ")[0]} 👋`
                : "Good day"}
            </Text>
            <Text style={[styles.headerTitle, { color: textPrimary }]}>
              PayNext
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.notifBtn,
              { backgroundColor: surface, borderColor: border },
            ]}
            onPress={() => router.push("/tabs/profile")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="notifications-outline"
              size={20}
              color={textSecondary}
            />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          {/* Decorative circles */}
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />

          <Text style={styles.balanceLabel}>Available Balance</Text>
          {loading ? (
            <ActivityIndicator
              color="rgba(255,255,255,0.8)"
              size="large"
              style={{ marginVertical: 8 }}
            />
          ) : (
            <Text style={styles.balanceAmount}>
              {balance !== null ? formatCurrency(balance) : "-"}
            </Text>
          )}
          <Text style={styles.balanceSub}>USD • PayNext Wallet</Text>

          <View style={styles.balanceStats}>
            <View style={styles.balanceStat}>
              <Ionicons
                name="arrow-down-circle"
                size={16}
                color="rgba(255,255,255,0.7)"
              />
              <Text style={styles.balanceStatLabel}>Income</Text>
              <Text style={styles.balanceStatValue}>$2,850.00</Text>
            </View>
            <View style={styles.balanceStatDivider} />
            <View style={styles.balanceStat}>
              <Ionicons
                name="arrow-up-circle"
                size={16}
                color="rgba(255,255,255,0.7)"
              />
              <Text style={styles.balanceStatLabel}>Expenses</Text>
              <Text style={styles.balanceStatValue}>$1,615.44</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: textPrimary }]}>
          Quick Actions
        </Text>
        <View style={styles.quickActions}>
          <QuickAction
            icon="send"
            label="Send"
            color={Colors.primary}
            bgColor={isDark ? "rgba(25,118,210,0.2)" : "#e3f2fd"}
            onPress={() => router.push("/tabs/send")}
          />
          <QuickAction
            icon="arrow-down-circle"
            label="Request"
            color={Colors.success}
            bgColor={isDark ? "rgba(46,125,50,0.2)" : "#e8f5e9"}
            onPress={() => router.push("/tabs/request")}
          />
          <QuickAction
            icon="qr-code"
            label="Scan QR"
            color="#7c3aed"
            bgColor={isDark ? "rgba(124,58,237,0.2)" : "#f3e8ff"}
            onPress={() => setScannerOpen(true)}
          />
          <QuickAction
            icon="list"
            label="History"
            color={Colors.warning}
            bgColor={isDark ? "rgba(245,124,0,0.2)" : "#fff3e0"}
            onPress={() => router.push("/tabs/transactions")}
          />
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Recent Activity
          </Text>
          <TouchableOpacity onPress={() => router.push("/tabs/transactions")}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: surface, borderColor: border },
          ]}
        >
          {loading ? (
            [0, 1, 2].map((i) => (
              <View key={i} style={styles.txSkeleton}>
                <View
                  style={[styles.txSkeletonIcon, { backgroundColor: border }]}
                />
                <View style={{ flex: 1, gap: 6 }}>
                  <View
                    style={[
                      styles.txSkeletonLine,
                      { backgroundColor: border, width: "60%" },
                    ]}
                  />
                  <View
                    style={[
                      styles.txSkeletonLine,
                      { backgroundColor: border, width: "40%" },
                    ]}
                  />
                </View>
                <View
                  style={[
                    styles.txSkeletonLine,
                    { backgroundColor: border, width: 60 },
                  ]}
                />
              </View>
            ))
          ) : transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <View
                style={[
                  styles.emptyIcon,
                  { backgroundColor: isDark ? Colors.dark.border : "#f1f5f9" },
                ]}
              >
                <Ionicons
                  name="receipt-outline"
                  size={28}
                  color={textSecondary}
                />
              </View>
              <Text style={[styles.emptyTitle, { color: textPrimary }]}>
                No transactions yet
              </Text>
              <Text style={[styles.emptySubtitle, { color: textSecondary }]}>
                Your activity will appear here
              </Text>
            </View>
          ) : (
            transactions.map((tx, idx) => (
              <View key={tx.id}>
                <View style={styles.txRow}>
                  <View
                    style={[
                      styles.txIcon,
                      {
                        backgroundColor:
                          tx.amount < 0
                            ? isDark
                              ? "rgba(239,68,68,0.15)"
                              : "#fef2f2"
                            : isDark
                              ? "rgba(34,197,94,0.15)"
                              : "#f0fdf4",
                      },
                    ]}
                  >
                    <Ionicons
                      name={tx.amount < 0 ? "arrow-up" : "arrow-down"}
                      size={18}
                      color={
                        tx.amount < 0 ? Colors.errorMid : Colors.successMid
                      }
                    />
                  </View>
                  <View style={styles.txInfo}>
                    <Text
                      style={[styles.txDesc, { color: textPrimary }]}
                      numberOfLines={1}
                    >
                      {tx.description}
                    </Text>
                    <Text style={[styles.txDate, { color: textSecondary }]}>
                      {formatDate(tx.date)}
                      {tx.status && (
                        <Text
                          style={
                            tx.status === "completed"
                              ? styles.statusCompleted
                              : styles.statusPending
                          }
                        >
                          {" "}
                          {tx.status}
                        </Text>
                      )}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.txAmount,
                      {
                        color:
                          tx.amount < 0 ? Colors.errorMid : Colors.successMid,
                      },
                    ]}
                  >
                    {tx.amount < 0 ? "-" : "+"}${Math.abs(tx.amount).toFixed(2)}
                  </Text>
                </View>
                {idx < transactions.length - 1 && (
                  <View style={[styles.divider, { backgroundColor: border }]} />
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* QR Scanner Modal */}
      <Modal
        visible={scannerOpen}
        animationType="slide"
        onRequestClose={() => setScannerOpen(false)}
      >
        <QrScannerScreen
          onScanSuccess={handleScanSuccess}
          onClose={() => setScannerOpen(false)}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 32 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerGreeting: { fontSize: 13, fontWeight: "500", marginBottom: 2 },
  headerTitle: { fontSize: 24, fontWeight: "800", letterSpacing: -0.5 },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    position: "relative",
  },
  notifDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    borderWidth: 1.5,
    borderColor: "#fff",
  },

  // Balance Card
  balanceCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    overflow: "hidden",
    ...Shadow.lg,
  },
  decorCircle1: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  decorCircle2: {
    position: "absolute",
    bottom: -40,
    left: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  balanceLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 44,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -1,
    marginBottom: 4,
  },
  balanceSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 20,
  },
  balanceStats: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.15)",
  },
  balanceStat: { flex: 1, alignItems: "center", gap: 4 },
  balanceStatDivider: {
    width: 1,
    height: 36,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  balanceStatLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    marginTop: 2,
  },
  balanceStatValue: { fontSize: 14, fontWeight: "700", color: "#fff" },

  // Quick Actions
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  seeAll: { fontSize: 13, color: Colors.primary, fontWeight: "600" },
  quickActions: { flexDirection: "row", gap: 10, marginBottom: 24 },
  quickAction: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
    ...Shadow.sm,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionLabel: { fontSize: 11, fontWeight: "600" },

  // Card
  card: { borderRadius: 20, borderWidth: 1, overflow: "hidden", ...Shadow.sm },

  // Transaction rows
  txRow: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  txInfo: { flex: 1, minWidth: 0 },
  txDesc: { fontSize: 14, fontWeight: "600", marginBottom: 3 },
  txDate: { fontSize: 12 },
  txAmount: { fontSize: 14, fontWeight: "700", flexShrink: 0 },
  divider: { height: 1, marginLeft: 68 },
  statusCompleted: { color: Colors.success, fontSize: 11 },
  statusPending: { color: Colors.warning, fontSize: 11 },

  // Skeleton
  txSkeleton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  txSkeletonIcon: { width: 40, height: 40, borderRadius: 12 },
  txSkeletonLine: { height: 12, borderRadius: 6 },

  // Empty state
  emptyState: { alignItems: "center", paddingVertical: 32, gap: 8 },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 15, fontWeight: "600" },
  emptySubtitle: { fontSize: 13 },
});
