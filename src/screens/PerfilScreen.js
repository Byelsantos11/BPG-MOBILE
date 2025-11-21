import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../theme/colors";

export default function PerfilScreen() {
  const [darkMode, setDarkMode] = useState(true);

  // Carrega o tema escolhido pelo usuário
  useEffect(() => {
    async function loadTheme() {
      const savedTheme = await AsyncStorage.getItem("darkMode");
      if (savedTheme !== null) {
        setDarkMode(savedTheme === "true");
      }
    }
    loadTheme();
  }, []);

  // Alternar o tema
  async function toggleTheme() {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    await AsyncStorage.setItem("darkMode", newTheme.toString());
  }

  async function handleLogout() {
    try {
      await AsyncStorage.removeItem("token");
      router.replace("/");
    } catch (err) {
      console.log("Erro ao deslogar:", err);
    }
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: darkMode ? COLORS.dark : "#f1f5f9" },
      ]}
    >
      <View style={styles.headerRow}>
        <Text
          style={[
            styles.title,
            { color: darkMode ? COLORS.white : COLORS.dark },
          ]}
        >
          Perfil & Configurações
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/dashboard")}
        >
          <Text style={styles.backButtonText}>← Dashboard</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, darkMode ? styles.darkCard : styles.lightCard]}>
        <Text style={[styles.sectionTitle, { color: darkMode ? COLORS.white : COLORS.dark }]}>
          Usuário
        </Text>

        <Text style={styles.label}>Nome</Text>
        <Text style={[styles.value, { color: darkMode ? COLORS.white : COLORS.dark }]}>
          Michel Amorim (BPG Store)
        </Text>

        <Text style={styles.label}>Email</Text>
        <Text style={[styles.value, { color: darkMode ? COLORS.white : COLORS.dark }]}>
          michelAmorim123@gmail.com
        </Text>
      </View>

      <View style={[styles.card, darkMode ? styles.darkCard : styles.lightCard]}>
        <Text style={[styles.sectionTitle, { color: darkMode ? COLORS.white : COLORS.dark }]}>
          Preferências
        </Text>

        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Tema escuro</Text>
            <Text style={styles.helper}>
              Se desativar, a interface ficará clara.
            </Text>
          </View>

          <Switch value={darkMode} onValueChange={toggleTheme} />
        </View>
      </View>

      <View style={[styles.card, darkMode ? styles.darkCard : styles.lightCard]}>
        <Text style={[styles.sectionTitle, { color: darkMode ? COLORS.white : COLORS.dark }]}>
          Sessão
        </Text>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
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
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  darkCard: {
    backgroundColor: "#020617",
    borderColor: "#1f2937",
  },
  lightCard: {
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
  },

  sectionTitle: {
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
