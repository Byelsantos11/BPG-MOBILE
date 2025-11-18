import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { COLORS } from "../theme/colors";

const API_BASE_URL = "http://192.168.0.112:3000";

export default function AddClienteScreen() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
  });

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function salvarCliente() {
    try {
      const res = await fetch(`${API_BASE_URL}/clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        Alert.alert("Erro", "Falha ao salvar cliente.");
        return;
      }

      Alert.alert("Sucesso", "Cliente cadastrado!");
      router.push("/dashboard");
    } catch (err) {
      Alert.alert("Erro", "Servidor indisponível.");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Novo Cliente</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/dashboard")}
        >
          <Text style={styles.backButtonText}>← Dashboard</Text>
        </TouchableOpacity>
      </View>

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

      <TouchableOpacity style={styles.button} onPress={salvarCliente}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
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
    borderWidth: 1,
    borderColor: "#334155",
    backgroundColor: "#020617",
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
    fontSize: 16,
  },
});
