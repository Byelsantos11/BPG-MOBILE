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
const SERVICE_ENDPOINT = `${API_BASE_URL}/services`;

export default function ServicosScreen() {
  const [servicos, setServicos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  async function loadServicos() {
    try {
      const res = await fetch(SERVICE_ENDPOINT);
      const data = await res.json();
      setServicos(data);
    } catch (err) {
      console.log("Erro ao carregar serviços:", err);
    }
  }

  useEffect(() => {
    loadServicos();
  }, []);

  async function excluirServico(id) {
    Alert.alert(
      "Excluir Serviço",
      "Tem certeza que deseja remover este serviço?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await fetch(`${SERVICE_ENDPOINT}/${id}`, {
                method: "DELETE",
              });
              loadServicos();
            } catch (err) {
              console.log("Erro ao excluir serviço:", err);
            }
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      {/* TOPO */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Serviços</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/dashboard")}
        >
          <Text style={styles.backButtonText}>← Dashboard</Text>
        </TouchableOpacity>
      </View>

      {/* BOTÃO ADICIONAR */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/addservico")}
      >
        <Text style={styles.addButtonText}>+ Adicionar Serviço</Text>
      </TouchableOpacity>

      {/* LISTA */}
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadServicos}
          />
        }
      >
        {servicos.map((s) => (
          <View key={s.id} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{s.titulo || s.nome}</Text>
              {s.clienteNome && (
                <Text style={styles.info}>Cliente: {s.clienteNome}</Text>
              )}
              {s.status && (
                <Text style={styles.info}>Status: {s.status}</Text>
              )}
              {s.valor && (
                <Text style={styles.info}>
                  Valor: R$ {Number(s.valor).toFixed(2)}
                </Text>
              )}
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => router.push(`/editservico?id=${s.id}`)}
              >
                <Text style={styles.edit}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => excluirServico(s.id)}>
                <Text style={styles.delete}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {servicos.length === 0 && (
          <Text style={styles.emptyText}>
            Nenhum serviço cadastrado ainda.
          </Text>
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
    fontSize: 13,
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
    gap: 10,
  },
  name: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
  },
  info: {
    color: COLORS.gray,
    fontSize: 13,
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
    color: COLORS.gray,
    textAlign: "center",
    marginTop: 20,
  },
});
