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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../theme/colors";

const API_LISTAR = "http://192.168.15.11:3000/cliente/listarTodos";
const API_DELETE = "http://192.168.15.11:3000/cliente/deletar";

export default function ClientesScreen() {
  const [clientes, setClientes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  async function loadClientes() {
    try {
      setRefreshing(true);

      const token = await AsyncStorage.getItem("token");

      const res = await fetch(API_LISTAR, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Erro", data.message || "Falha ao carregar clientes.");
        return;
      }

      setClientes(data);
    } catch (err) {
      console.log("Erro ao buscar clientes:", err);
      Alert.alert("Erro", "Servidor indisponível.");
    } finally {
      setRefreshing(false);
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
            try {
              const token = await AsyncStorage.getItem("token");

              const res = await fetch(`${API_DELETE}/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              const data = await res.json().catch(() => ({}));

              if (!res.ok) {
                Alert.alert("Erro", data.message || "Falha ao excluir.");
                return;
              }

              Alert.alert("Sucesso", "Cliente removido com sucesso!");
              loadClientes();
            } catch (err) {
              console.log("Erro excluir:", err);
              Alert.alert("Erro", "Servidor indisponível.");
            }
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Clientes</Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/dashboard")}
        >
          <Text style={styles.backButtonText}>← Dashboard</Text>
        </TouchableOpacity>
      </View>

      {/* Botão adicionar */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/addcliente")}
      >
        <Text style={styles.addButtonText}>+ Adicionar Cliente</Text>
      </TouchableOpacity>

      {/* LISTAGEM */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadClientes} />
        }
      >
        {clientes.map((c) => (
          <View key={c.id} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{c.nome}</Text>
              <Text style={styles.info}>{c.email}</Text>
              <Text style={styles.info}>{c.telefone}</Text>
            </View>

            {/* Ações */}
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

        {clientes.length === 0 && (
          <Text style={styles.emptyText}>
            Nenhum cliente cadastrado ainda.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

/* --- ESTILOS --- */
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
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#334155",
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
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1e293b",
    marginBottom: 12,
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
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 6,
  },

  edit: {
    color: COLORS.blue,
    fontWeight: "bold",
  },

  delete: {
    color: COLORS.danger,
    fontWeight: "bold",
  },

  emptyText: {
    textAlign: "center",
    color: COLORS.gray,
    marginTop: 20,
    fontSize: 14,
  },
});
