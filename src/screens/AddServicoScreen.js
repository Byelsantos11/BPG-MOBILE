import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { COLORS } from "../theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddServicoScreen = () => {
  const [clientes, setClientes] = useState([]);

  const [form, setForm] = useState({
    cliente_id: "",
    dispositivo: "",
    numero_serie: "",
    tecnico: "",
    status_servico: "",
    prioridade: "",
    previsao_conclusao: "",
    descricao_problema: "",
  });

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Carregar clientes
  const loadClientes = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const resp = await fetch("http://192.168.15.11:3000/cliente/listarTodos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await resp.json();
      setClientes(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os clientes.");
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

  // Enviar serviço
  const handleAdd = async () => {
    if (
      !form.cliente_id ||
      !form.dispositivo ||
      !form.numero_serie ||
      !form.tecnico ||
      !form.status_servico ||
      !form.prioridade ||
      !form.descricao_problema
    ) {
      return Alert.alert("Erro", "Preencha todos os campos obrigatórios!");
    }

    const API_BASE_URL = "http://192.168.15.11:3000/servico/criar";
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        return Alert.alert("Erro", "Falha ao cadastrar o serviço.");
      }

      Alert.alert("Sucesso", "Serviço cadastrado!");
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Adicionar Serviço</Text>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      {/* CLIENTE */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.cliente_id}
          onValueChange={(v) => update("cliente_id", v)}
          style={styles.picker}
          dropdownIconColor={COLORS.white}
        >
          <Picker.Item label="Selecione o cliente" value="" />

          {clientes.map((c) => (
            <Picker.Item
              key={c.id}
              label={c.nome}
              value={c.id.toString()}
            />
          ))}
        </Picker>
      </View>

      <TextInput
        placeholder="Dispositivo"
        placeholderTextColor={COLORS.gray}
        style={styles.input}
        value={form.dispositivo}
        onChangeText={(v) => update("dispositivo", v)}
      />

      <TextInput
        placeholder="Número de Série"
        placeholderTextColor={COLORS.gray}
        style={styles.input}
        value={form.numero_serie}
        onChangeText={(v) => update("numero_serie", v)}
      />

      {/* TÉCNICO */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.tecnico}
          onValueChange={(v) => update("tecnico", v)}
          style={styles.picker}
          dropdownIconColor={COLORS.white}
        >
          <Picker.Item label="Selecione o técnico" value="" />
          <Picker.Item label="Michel" value="Michel" />
          <Picker.Item label="Celso" value="Celso" />
        </Picker>
      </View>

      {/* STATUS DO SERVIÇO */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.status_servico}
          onValueChange={(v) => update("status_servico", v)}
          style={styles.picker}
          dropdownIconColor={COLORS.white}
        >
          <Picker.Item label="Selecione o status" value="" />
          <Picker.Item label="Pendente" value="Pendente" />
          <Picker.Item label="Em diagnóstico" value="Em diagnóstico" />
          <Picker.Item label="Aguardando peças" value="Aguardando peças" />
          <Picker.Item label="Em andamento" value="Em andamento" />
          <Picker.Item label="Concluído" value="Concluído" />
          <Picker.Item label="Cancelado" value="Cancelado" />
        </Picker>
      </View>

      {/* PRIORIDADE */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.prioridade}
          onValueChange={(v) => update("prioridade", v)}
          style={styles.picker}
          dropdownIconColor={COLORS.white}
        >
          <Picker.Item label="Selecione a prioridade" value="" />
          <Picker.Item label="Baixa" value="Baixa" />
          <Picker.Item label="Média" value="Média" />
          <Picker.Item label="Alta" value="Alta" />
        </Picker>
      </View>

      <TextInput
        placeholder="Previsão de Conclusão (AAAA-MM-DD)"
        placeholderTextColor={COLORS.gray}
        style={styles.input}
        value={form.previsao_conclusao}
        onChangeText={(v) => update("previsao_conclusao", v)}
      />

      {/* DESCRIÇÃO DO PROBLEMA */}
      <TextInput
        placeholder="Descrição do Problema"
        placeholderTextColor={COLORS.gray}
        style={[styles.input, styles.textArea]}
        multiline
        value={form.descricao_problema}
        onChangeText={(v) => update("descricao_problema", v)}
      />

      {/* BOTÃO */}
      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddServicoScreen;

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
