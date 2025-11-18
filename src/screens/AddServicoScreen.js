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
const SERVICE_ENDPOINT = `${API_BASE_URL}/services`;

export default function AddServicoScreen() {
  const [form, setForm] = useState({
    titulo: "",
    clienteNome: "",
    status: "",
    valor: "",
    descricao: "",
  });

  function update(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function salvar() {
    if (!form.titulo || !form.clienteNome) {
      Alert.alert("Erro", "Preencha pelo menos título e cliente.");
      return;
    }

    try {
      const body = {
        ...form,
        valor: form.valor ? Number(form.valor) : 0,
      };

      const res = await fetch(SERVICE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        Alert.alert("Erro", "Não foi possível cadastrar o serviço.");
        return;
      }

      Alert.alert("Sucesso!", "Serviço cadastrado!");
      router.push("/dashboard");
    } catch (err) {
      console.log("Erro ao salvar serviço:", err);
      Alert.alert("Erro", "Servidor indisponível.");
    }
  }

  return (
    <View style={styles.container}>
      {/* TOPO */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Novo Serviço</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/dashboard")}
        >
          <Text style={styles.backButtonText}>← Dashboard</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Título do serviço"
        placeholderTextColor={COLORS.gray}
        style={styles.input}
        value={form.titulo}
        onChangeText={(v) => update("titulo", v)}
      />
      <TextInput
        placeholder="Nome do cliente"
        placeholderTextColor={COLORS.gray}
        style={styles.input}
        value={form.clienteNome}
        onChangeText={(v) => update("clienteNome", v)}
      />
      <TextInput
        placeholder="Status (ex: Em andamento, Concluído)"
        placeholderTextColor={COLORS.gray}
        style={styles.input}
        value={form.status}
        onChangeText={(v) => update("status", v)}
      />
      <TextInput
        placeholder="Valor (ex: 250.00)"
        placeholderTextColor={COLORS.gray}
        style={styles.input}
        value={form.valor}
        onChangeText={(v) => update("valor", v)}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Descrição"
        placeholderTextColor={COLORS.gray}
        style={[styles.input, styles.textArea]}
        value={form.descricao}
        onChangeText={(v) => update("descricao", v)}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.button} onPress={salvar}>
        <Text style={styles.buttonText}>Salvar Serviço</Text>
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
