import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from "react-native";
import { router } from "expo-router";
import { COLORS } from "../theme/colors";

export default function PerfilScreen() {
  const [darkMode] = React.useState(true); // só UI, sem lógica real

  return (
    <View style={styles.container}>
      {/* TOPO */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Perfil & Configurações</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/dashboard")}
        >
          <Text style={styles.backButtonText}>← Dashboard</Text>
        </TouchableOpacity>
      </View>

      {/* INFO DO USUÁRIO */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Usuário</Text>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>Deivid (BPG Store)</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>admin@bpgstore.com</Text>
      </View>

      {/* CONFIGURAÇÕES */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Preferências</Text>

        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Tema escuro</Text>
            <Text style={styles.helper}>
              O tema escuro está ativado por padrão.
            </Text>
          </View>
          <Switch value={darkMode} disabled />
        </View>
      </View>

      {/* AÇÕES */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Sessão</Text>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => router.push("/")}
        >
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ESTILOS */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
    padding: 20,
    gap: 14,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    color: COLORS.white,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
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
    fontSize: 13,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#020617",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  sectionTitle: {
    color: COLORS.white,
    fontWeight: "600",
    marginBottom: 10,
    fontSize: 16,
  },
  label: {
    color: COLORS.gray,
    fontSize: 13,
    marginTop: 4,
  },
  value: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "500",
  },
  helper: {
    color: COLORS.gray,
    fontSize: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: "#1f2937",
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  logoutText: {
    color: COLORS.danger,
    textAlign: "center",
    fontWeight: "bold",
  },
});
