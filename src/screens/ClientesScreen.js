import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { COLORS } from "../theme/colors";

const API_BASE_URL = "http://192.168.0.112:3000";

export default function ClientesScreen() {
  const [clientes, setClientes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  async function loadClientes() {
    try {
      const res = await fetch(`${API_BASE_URL}/clientes`);
      const data = await res.json();
      setClientes(data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadClientes();
  }, []);

  async function excluirCliente(id) {
    Alert.alert(
      "Excluir cliente",
      "Tem certeza que deseja remover este cliente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await fetch(`${API_BASE_URL}/clientes/${id}`, {
              method: "DELETE",
            });
            loadClientes();
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho com botão voltar */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Clientes</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/dashboard")}
        >
          <Text style={styles.backButtonText}>← Dashboard</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/addcliente")}
      >
        <Text style={styles.addButtonText}>+ Adicionar Cliente</Text>
      </TouchableOpacity>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadClientes}
          />
        }
      >
        {clientes.map((c) => (
          <View key={c.id} style={styles.card}>
            <View>
              <Text style={styles.name}>{c.nome}</Text>
              <Text style={styles.info}>{c.email}</Text>
              <Text style={styles.info}>{c.telefone}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => router.push(`/editcliente?id=${c.id}`)}
              >
                <Text style={styles.edit}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => excluirCliente(c.id)}>
                <Text style={styles.delete}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: "bold",
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#334155",
    backgroundColor: "#020617",
  },
  backButtonText: {
    color: COLORS.gray,
    fontSize: 13,
    fontWeight: "500",
  },
  addButton: {
    backgroundColor: COLORS.blue,
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  addButtonText: {
    textAlign: "center",
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#0f172a",
    marginBottom: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1e293b",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
  },
  info: {
    color: COLORS.gray,
    fontSize: 14,
  },
  actions: {
    gap: 6,
    justifyContent: "center",
  },
  edit: {
    color: COLORS.blue,
    fontWeight: "bold",
  },
  delete: {
    color: COLORS.danger,
    fontWeight: "bold",
  },
});
