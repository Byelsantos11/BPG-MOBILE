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

export default function EstoqueScreen() {
  const [produtos, setProdutos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  async function loadProdutos() {
    try {
      const res = await fetch(`${API_BASE_URL}/produtos`);
      const data = await res.json();
      setProdutos(data);
    } catch (err) {
      console.log("Erro ao carregar produtos:", err);
    }
  }

  useEffect(() => {
    loadProdutos();
  }, []);

  async function excluirProduto(id) {
    Alert.alert(
      "Excluir Produto",
      "Tem certeza que deseja remover esse item?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await fetch(`${API_BASE_URL}/produtos/${id}`, {
              method: "DELETE",
            });
            loadProdutos();
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Estoque</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/dashboard")}
        >
          <Text style={styles.backButtonText}>← Dashboard</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/addproduto")}
      >
        <Text style={styles.addButtonText}>+ Adicionar Produto</Text>
      </TouchableOpacity>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadProdutos} />
        }
      >
        {produtos.map((p) => (
          <View key={p.id} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{p.nome}</Text>
              <Text style={styles.info}>
                {p.marca} • {p.modelo}
              </Text>
              <Text style={styles.info}>
                R$ {Number(p.preco).toFixed(2)} • Estoque: {p.estoque}
              </Text>
              {p.categoria ? (
                <Text style={styles.tag}>{p.categoria}</Text>
              ) : null}
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => router.push(`/editproduto?id=${p.id}`)}
              >
                <Text style={styles.edit}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => excluirProduto(p.id)}>
                <Text style={styles.delete}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {produtos.length === 0 && (
          <Text style={styles.emptyText}>Nenhum produto encontrado.</Text>
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
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    backgroundColor: "#020617",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#334155",
  },
  backButtonText: {
    color: COLORS.gray,
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: COLORS.blue,
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  addButtonText: {
    textAlign: "center",
    fontWeight: "bold",
    color: COLORS.white,
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
  name: { color: COLORS.white, fontSize: 18, fontWeight: "600" },
  info: { color: COLORS.gray },
  tag: { marginTop: 4, color: COLORS.blue, fontWeight: "600" },
  actions: { justifyContent: "center", gap: 6 },
  edit: { color: COLORS.blue, fontWeight: "bold" },
  delete: { color: COLORS.danger, fontWeight: "bold" },
  emptyText: { color: COLORS.gray, textAlign: "center", marginTop: 20 },
});
