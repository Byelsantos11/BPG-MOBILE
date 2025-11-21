import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../theme/colors";

const API_BASE_URL = "http://192.168.15.11:3000";

export default function EditClienteScreen() {
  const { id } = useLocalSearchParams();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // 🔵 CARREGAR CLIENTE (URL CORRETA RESTAURADA)
  useEffect(() => {
    async function loadCliente() {
      try {
        const token = await AsyncStorage.getItem("token");

        const res = await fetch(`${API_BASE_URL}/cliente/buscaid/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const text = await res.text();
        let data;

        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }

        if (!res.ok) {
          return Alert.alert("Erro", data?.message || "Erro ao carregar cliente.");
        }

        const cliente = Array.isArray(data) ? data[0] : data;

        setForm({
          nome: cliente.nome || "",
          email: cliente.email || "",
          telefone: cliente.telefone || "",
          endereco: cliente.endereco || "",
          cidade: cliente.cidade || "",
          estado: cliente.estado || "",
        });
      } catch (err) {
        console.log("Erro ao buscar cliente:", err);
        Alert.alert("Erro", "Servidor indisponível.");
      } finally {
        setLoading(false);
      }
    }

    if (id) loadCliente();
  }, [id]);

  // 🟢 SALVAR ALTERAÇÕES
  async function salvar() {
    try {
      const token = await AsyncStorage.getItem("token");
      setSaving(true);

      const res = await fetch(`${API_BASE_URL}/cliente/atualizar/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      if (!res.ok) {
        return Alert.alert("Erro", data?.message || "Erro ao atualizar cliente.");
      }

      Alert.alert("Sucesso", "Cliente atualizado!", [
        {
          text: "OK",
          onPress: () => router.replace("/clientes"),
        },
      ]);
      
    } catch (err) {
      console.log("Erro ao atualizar:", err);
      Alert.alert("Erro", "Falha no servidor.");
    } finally {
      setSaving(false);
    }
  }

  // 🔵 LOADING
  if (loading) {
    return (
      <View style={styles.loadingArea}>
        <ActivityIndicator size="large" color={COLORS.blue} />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Topo */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Editar Cliente</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/clientes")}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <ScrollView>
        {Object.keys(form).map((key) => (
          <TextInput
            key={key}
            placeholder={key.toUpperCase()}
            placeholderTextColor={COLORS.gray}
            style={styles.input}
            value={form[key]}
            onChangeText={(v) => update(key, v)}
          />
        ))}

        <TouchableOpacity
          style={[styles.button, saving && { opacity: 0.6 }]}
          onPress={salvar}
          disabled={saving}
        >
          <Text style={styles.buttonText}>
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* 🎨 ESTILOS */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    color: COLORS.white,
    fontWeight: "bold",
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 8,
  },
  backButtonText: {
    color: COLORS.gray,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#0f172a",
    color: COLORS.white,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1e293b",
    marginBottom: 14,
  },
  button: {
    backgroundColor: COLORS.blue,
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 30,
  },
  buttonText: {
    textAlign: "center",
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.dark,
  },
  loadingText: {
    color: COLORS.gray,
    marginTop: 8,
  },
});
