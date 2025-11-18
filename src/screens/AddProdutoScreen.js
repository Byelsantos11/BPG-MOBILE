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

export default function AddProdutoScreen() {
  const [form, setForm] = useState({
    nome: "",
    marca: "",
    modelo: "",
    preco: "",
    estoque: "",
    categoria: "",
    descricao: "",
  });

  function update(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function salvar() {
    try {
      const body = {
        ...form,
        preco: Number(form.preco),
        estoque: Number(form.estoque || 0),
      };

      const res = await fetch(`${API_BASE_URL}/produtos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) return Alert.alert("Erro", "Falha ao cadastrar produto");

      Alert.alert("Sucesso!", "Produto cadastrado!");
      router.push("/dashboard");
    } catch (err) {
      Alert.alert("Erro", "Servidor indisponível");
    }
  }

  return (
    <View style={styles.container}>
      {/* TOPO */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Novo Produto</Text>
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
          style={[styles.input, key === "descricao" && styles.textArea]}
          value={form[key]}
          onChangeText={(v) => update(key, v)}
          multiline={key === "descricao"}
          numberOfLines={key === "descricao" ? 4 : 1}
        />
      ))}

      <TouchableOpacity style={styles.button} onPress={salvar}>
        <Text style={styles.buttonText}>Salvar Produto</Text>
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
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
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
