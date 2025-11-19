import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../theme/colors";

const API_BASE_URL = "http://192.168.0.112:3000";

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

  // BUSCAR DADOS EXISTENTES DO CLIENTE
  useEffect(() => {
    async function loadCliente() {
      try {
        const token = await AsyncStorage.getItem("token");

        const res = await fetch(`${API_BASE_URL}/cliente/listarUm/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          Alert.alert("Erro", data.message || "Não foi possível carregar o cliente.");
          return;
        }

        // Preenche os campos
        setForm({
          nome: data.nome || "",
          email: data.email || "",
          telefone: data.telefone || "",
          endereco: data.endereco || "",
          cidade: data.cidade || "",
          estado: data.estado || "",
        });

      } catch (err) {
        console.log("Erro ao carregar cliente:", err);
        Alert.alert("Erro", "Falha ao buscar o cliente.");
      }
    }

    if (id) loadCliente();
  }, [id]);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // SALVAR ALTERAÇÕES
  async function salvar() {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/cliente/atualizar/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Erro", data.message || "Não foi possível atualizar.");
        return;
      }

      Alert.alert("Sucesso", "Cliente atualizado!");
      router.push("/clientes");

    } catch (err) {
      console.log(err);
      Alert.alert("Erro", "Falha no servidor.");
    }
  }

  return (
    <View style={styles.container}>
      {/* topo */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Editar Cliente</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/clientes")}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
      </View>

      {/* inputs preenchidos com dados existentes */}
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

      <TouchableOpacity style={styles.button} onPress={salvar}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>
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
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: COLORS.white,
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
  input: {
    backgroundColor: "#0f172a",
    color: COLORS.white,
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  button: {
    backgroundColor: COLORS.blue,
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    color: COLORS.white,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
