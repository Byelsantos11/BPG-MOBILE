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

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE_URL}/clientes/${id}`);
        const data = await res.json();
        setForm(data);
      } catch (err) {
        console.log("Erro ao carregar cliente:", err);
      }
    }

    if (id) load();
  }, [id]);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function salvar() {
    try {
      const res = await fetch(`${API_BASE_URL}/clientes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        Alert.alert("Erro", "Não foi possível atualizar o cliente.");
        return;
      }

      Alert.alert("Sucesso", "Cliente atualizado!");
      router.push("/dashboard");
    } catch (err) {
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
          onPress={() => router.push("/dashboard")}
        >
          <Text style={styles.backButtonText}>← Dashboard</Text>
        </TouchableOpacity>
      </View>

      {/* inputs */}
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
  },
  buttonText: {
    color: COLORS.white,
    textAlign: "center",
    fontWeight: "bold",
  },
});
