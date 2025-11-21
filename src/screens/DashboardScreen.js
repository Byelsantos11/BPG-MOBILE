import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import DashCard from "../components/DashCard";
import { COLORS } from "../theme/colors";

const API_CLIENTE = "http://192.168.15.11:3000/cliente/quantidade";
const API_PRODUTO = "http://192.168.15.11:3000/produto/quantidade";

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

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erro", "Token não encontrado. Faça login novamente.");
        return;
      }

      /* ===== CLIENTES ===== */
      const resClientes = await fetch(API_CLIENTE, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const dataClientes = await resClientes.json();

      if (!resClientes.ok) {
        Alert.alert("Erro", dataClientes.message || "Falha ao carregar clientes.");
        return;
      }

      /* ===== PRODUTOS ===== */
      const resProduto = await fetch(API_PRODUTO, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const dataProduto = await resProduto.json();

      if (!resProduto.ok) {
        Alert.alert("Erro", dataProduto.message || "Falha ao carregar produtos.");
        return;
      }

      /* Inserindo valores no estado do dashboard */
      setStats((prev) => ({
        ...prev,
        totalClients: dataClientes.total || 0,
        totalStock: dataProduto.total || 0,
        lowStockAlerts: dataProduto.baixoEstoque || 0, // Caso você envie isso no backend depois
      }));

    } catch (err) {
      console.log("Erro ao buscar dados:", err);
      Alert.alert("Erro", "Servidor indisponível.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function onRefresh() {
    setRefreshing(true);
    await loadDashboard();
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

        {/* MENU */}
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

        {/* CARDS */}
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

  loadingArea: {
    marginTop: 40,
    alignItems: "center",
  },
  loadingText: {
    color: COLORS.gray,
    marginTop: 8,
  },
});
