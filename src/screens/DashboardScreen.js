import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import DashCard from "../components/DashCard";
import { COLORS } from "../theme/colors";

const API_BASE_URL = "http://192.168.0.112:3000";

export default function DashboardScreen() {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeServices: 0,
    totalStock: 0,
    lowStockAlerts: 0,
    serviceAlerts: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadDashboard() {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/dashboard/metrics`);
      const data = await response.json();

      setStats({
        totalClients: data.totalClients ?? 0,
        activeServices: data.activeServices ?? 0,
        totalStock: data.totalStock ?? 0,
        lowStockAlerts: data.lowStockAlerts ?? 0,
        serviceAlerts: data.serviceAlerts ?? 0,
      });
    } catch (error) {
      console.log("Erro ao carregar métricas:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function onRefresh() {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  }

  const hasAlerts = stats.lowStockAlerts > 0 || stats.serviceAlerts > 0;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.appTitle}>BPG Store</Text>
        <Text style={styles.subtitle}>Visão geral do sistema</Text>

        {/* MENU COMPLETO – CLIENTES / ESTOQUE / SERVIÇOS / PERFIL */}
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push("/clientes")}
          >
            <Text style={styles.menuText}>Clientes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push("/estoque")}
          >
            <Text style={styles.menuText}>Estoque</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push("/servicos")}
          >
            <Text style={styles.menuText}>Serviços</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push("/perfil")}
          >
            <Text style={styles.menuText}>Perfil</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingArea}>
            <ActivityIndicator size="large" color={COLORS.blue} />
            <Text style={styles.loadingText}>Carregando dados...</Text>
          </View>
        ) : (
          <>
            <View style={styles.cardsRow}>
              <DashCard
                title="Clientes"
                value={stats.totalClients}
                subtitle="Cadastrados"
                type="primary"
                index={0}
              />

              <DashCard
                title="Serviços ativos"
                value={stats.activeServices}
                subtitle="Em andamento"
                type="info"
                index={1}
              />
            </View>

            <View style={styles.cardsRow}>
              <DashCard
                title="Estoque"
                value={stats.totalStock}
                subtitle="Itens totais"
                type="secondary"
                index={2}
              />

              <DashCard
                title="Alertas"
                value={stats.lowStockAlerts + stats.serviceAlerts}
                subtitle="Pendências"
                type={hasAlerts ? "danger" : "success"}
                index={3}
              />
            </View>

            <View style={styles.alertsWrapper}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Alertas de serviços</Text>

                <View style={styles.alertItem}>
                  <View style={styles.alertTagService} />
                  <View style={styles.alertTextBlock}>
                    <Text style={styles.alertTitle}>Serviços com problema</Text>
                    <Text style={styles.alertDescription}>
                      {stats.serviceAlerts} serviço(s) com status de alerta.
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Alertas de estoque</Text>

                <View style={styles.alertItem}>
                  <View style={styles.alertTagStock} />
                  <View style={styles.alertTextBlock}>
                    <Text style={styles.alertTitle}>
                      Produtos com estoque baixo
                    </Text>
                    <Text style={styles.alertDescription}>
                      {stats.lowStockAlerts} produto(s) abaixo do nível mínimo.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

/* ESTILOS */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  appTitle: {
    fontSize: 28,
    color: COLORS.blue,
    fontWeight: "bold",
  },
  subtitle: {
    color: COLORS.gray,
    marginTop: 4,
    marginBottom: 24,
    fontSize: 14,
  },

  /* NOVO MENU ESTILOS */
  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  menuButton: {
    flex: 1,
    backgroundColor: "#1e293b",
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  menuText: {
    color: COLORS.white,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15,
  },

  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  alertsWrapper: { marginTop: 8, gap: 12 },

  section: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  sectionTitle: {
    color: COLORS.white,
    fontWeight: "600",
    marginBottom: 12,
    fontSize: 16,
  },
  alertItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  alertTagService: {
    width: 10,
    height: 40,
    borderRadius: 999,
    backgroundColor: COLORS.blue,
    marginRight: 10,
  },
  alertTagStock: {
    width: 10,
    height: 40,
    borderRadius: 999,
    backgroundColor: COLORS.danger,
    marginRight: 10,
  },
  alertTextBlock: {
    flex: 1,
  },
  alertTitle: {
    color: COLORS.white,
    fontWeight: "600",
    marginBottom: 2,
  },
  alertDescription: {
    color: COLORS.gray,
    fontSize: 13,
  },
  loadingArea: {
    marginTop: 40,
    alignItems: "center",
  },
  loadingText: {
    color: COLORS.gray,
    marginTop: 8,
  },
});
