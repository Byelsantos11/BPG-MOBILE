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
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://192.168.15.11:3000/produto/criar";

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
    if (!form.nome.trim()) return Alert.alert("Atenção", "Digite o nome");
    if (!form.marca.trim()) return Alert.alert("Atenção", "Digite a marca");
    if (!form.preco) return Alert.alert("Atenção", "Digite o preço");

    const precoNum = Number(form.preco);
    const estoqueNum = Number(form.estoque || 0);

    if (isNaN(precoNum)) return Alert.alert("Erro", "Preço inválido");

    try {
      const token = await AsyncStorage.getItem("token");

      const body = {
        nome: form.nome,
        marca: form.marca,
        modelo: form.modelo,
        preco: precoNum,
        estoque: isNaN(estoqueNum) ? 0 : estoqueNum,
        categoria: form.categoria || null,
        descricao: form.descricao,
      };

      const res = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) return Alert.alert("Erro", "Falha ao cadastrar produto");

      Alert.alert("Sucesso!", "Produto cadastrado!");
      router.push("/estoque");
    } catch (err) {
      Alert.alert("Erro", "Servidor indisponível");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Novo Produto</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/estoque")}
        >
          <Text style={styles.backButtonText}>← Estoque</Text>
        </TouchableOpacity>
      </View>

      {/* CAMPOS */}
      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor={COLORS.gray}
        value={form.nome}
        onChangeText={(v) => update("nome", v)}
      />

      <TextInput
        style={styles.input}
        placeholder="Marca"
        placeholderTextColor={COLORS.gray}
        value={form.marca}
        onChangeText={(v) => update("marca", v)}
      />

      <TextInput
        style={styles.input}
        placeholder="Modelo"
        placeholderTextColor={COLORS.gray}
        value={form.modelo}
        onChangeText={(v) => update("modelo", v)}
      />

      <TextInput
        style={styles.input}
        placeholder="Preço"
        keyboardType="numeric"
        placeholderTextColor={COLORS.gray}
        value={form.preco}
        onChangeText={(v) => update("preco", v)}
      />

      <TextInput
        style={styles.input}
        placeholder="Estoque"
        keyboardType="numeric"
        placeholderTextColor={COLORS.gray}
        value={form.estoque}
        onChangeText={(v) => update("estoque", v)}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.categoria}
          onValueChange={(v) => update("categoria", v)}
          style={styles.picker}
          dropdownIconColor={COLORS.white}
        >
          <Picker.Item label="Selecione uma categoria" value="" />
          <Picker.Item label="Notebooks" value="Notebooks" />
          <Picker.Item label="Smartphones" value="Smartphones" />
          <Picker.Item label="TVs" value="TVs" />
          <Picker.Item label="Impressoras" value="Impressoras" />
          <Picker.Item label="Acessórios" value="Acessórios" />
        </Picker>
      </View>

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descrição"
        placeholderTextColor={COLORS.gray}
        value={form.descricao}
        multiline
        onChangeText={(v) => update("descricao", v)}
      />

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
  pickerContainer: {
    backgroundColor: "#0f172a",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1e293b",
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  picker: {
    color: COLORS.white,
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
    fontWeight: "bold",
  },
});
