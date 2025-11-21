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
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../theme/colors";

const API_BASE_URL = "http://192.168.15.11:3000";

export default function EditServicoScreen() {
  const { id } = useLocalSearchParams();

  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(true);

  const [form, setForm] = useState({
    cliente_id: "",
    dispositivo: "",
    numero_serie: "",
    tecnico: "",
    status_servico: "",
    prioridade: "",
    previsao_conclusao: "",
    descricao_problema: "",
    observacao_tecnica: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // 🔵 CARREGAR CLIENTES
  async function loadClientes() {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/cliente/listarTodos`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        return Alert.alert("Erro", "Erro ao carregar clientes.");
      }

      setClientes(data);
    } catch (err) {
      console.log("Erro ao carregar clientes:", err);
    } finally {
      setLoadingClientes(false);
    }
  }

  // 🔵 CARREGAR SERVIÇO POR ID
  async function loadServico() {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/servico/buscaid/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      if (!res.ok) {
        return Alert.alert("Erro", data?.message || "Erro ao carregar serviço.");
      }

      const servico = Array.isArray(data) ? data[0] : data;

      setForm({
        cliente_id: servico.cliente_id || "",
        dispositivo: servico.dispositivo || "",
        numero_serie: servico.numero_serie || "",
        tecnico: servico.tecnico || "",
        status_servico: servico.status_servico || "",
        prioridade: servico.prioridade || "",
        previsao_conclusao: servico.previsao_conclusao
          ? servico.previsao_conclusao.slice(0, 10)
          : "",
        descricao_problema: servico.descricao_problema || "",
        observacao_tecnica: servico.observacao_tecnica || "",
      });

    } catch (err) {
      console.log("Erro ao buscar servico:", err);
      Alert.alert("Erro", "Servidor indisponível.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function init() {
      await loadClientes();
      if (id) await loadServico();
    }
    init();
  }, [id]);

  // 🟢 SALVAR ALTERAÇÕES
  async function salvar() {
    try {
      const token = await AsyncStorage.getItem("token");
      setSaving(true);

      const res = await fetch(`${API_BASE_URL}/servico/atualizar/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        return Alert.alert("Erro", data?.message || "Erro ao atualizar serviço.");
      }

      Alert.alert("Sucesso!", "Serviço atualizado!", [
        { text: "OK", onPress: () => router.replace("/servicos") },
      ]);
    } catch (err) {
      console.log("Erro ao salvar:", err);
      Alert.alert("Erro", "Falha no servidor.");
    } finally {
      setSaving(false);
    }
  }

  if (loading || loadingClientes) {
    return (
      <View style={styles.loadingArea}>
        <ActivityIndicator size="large" color={COLORS.blue} />
        <Text style={styles.loadingText}>Carregando informações...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* TOPO */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Editar Serviço</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/servicos")}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      >
        {/* CLIENTE */}
        <View style={styles.pickerBox}>
          <Text style={styles.label}>Cliente</Text>
          <Picker
            selectedValue={form.cliente_id}
            onValueChange={(v) => update("cliente_id", v)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione um cliente" value="" />
            {clientes.map((c) => (
              <Picker.Item key={c.id} label={c.nome} value={c.id} />
            ))}
          </Picker>
        </View>

        <TextInput
          placeholder="DISPOSITIVO"
          placeholderTextColor={COLORS.gray}
          style={styles.input}
          value={form.dispositivo}
          onChangeText={(v) => update("dispositivo", v)}
        />

        <TextInput
          placeholder="NÚMERO DE SÉRIE"
          placeholderTextColor={COLORS.gray}
          style={styles.input}
          value={form.numero_serie}
          onChangeText={(v) => update("numero_serie", v)}
        />

        {/* TÉCNICO */}
        <View style={styles.pickerBox}>
          <Text style={styles.label}>Técnico</Text>
          <Picker
            selectedValue={form.tecnico}
            onValueChange={(v) => update("tecnico", v)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione o técnico" value="" />
            <Picker.Item label="Michel" value="Michel" />
            <Picker.Item label="Celso" value="Celso" />
          </Picker>
        </View>

        {/* STATUS */}
        <View style={styles.pickerBox}>
          <Text style={styles.label}>Status</Text>
          <Picker
            selectedValue={form.status_servico}
            onValueChange={(v) => update("status_servico", v)}
            style={styles.picker}
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
        <View style={styles.pickerBox}>
          <Text style={styles.label}>Prioridade</Text>
          <Picker
            selectedValue={form.prioridade}
            onValueChange={(v) => update("prioridade", v)}
            style={styles.picker}
          >
            <Picker.Item label="Baixa" value="Baixa" />
            <Picker.Item label="Média" value="Média" />
            <Picker.Item label="Alta" value="Alta" />
          </Picker>
        </View>

        <TextInput
          placeholder="DESCRIÇÃO DO PROBLEMA"
          placeholderTextColor={COLORS.gray}
          style={[styles.input, styles.textArea]}
          value={form.descricao_problema}
          onChangeText={(v) => update("descricao_problema", v)}
          multiline
        />

        <TextInput
          placeholder="OBSERVAÇÃO TÉCNICA"
          placeholderTextColor={COLORS.gray}
          style={[styles.input, styles.textArea]}
          value={form.observacao_tecnica}
          onChangeText={(v) => update("observacao_tecnica", v)}
          multiline
        />

        <TextInput
          placeholder="PREVISÃO DE CONCLUSÃO (YYYY-MM-DD)"
          placeholderTextColor={COLORS.gray}
          style={styles.input}
          value={form.previsao_conclusao}
          onChangeText={(v) => update("previsao_conclusao", v)}
        />

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
  textArea: {
    height: 110,
    textAlignVertical: "top",
  },
  pickerBox: {
    backgroundColor: "#0f172a",
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  picker: {
    color: COLORS.white,
  },
  label: {
    color: COLORS.gray,
    paddingLeft: 12,
    paddingTop: 6,
    marginBottom: -4,
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
