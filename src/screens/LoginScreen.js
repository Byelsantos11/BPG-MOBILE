import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { router } from "expo-router";
import { COLORS } from "../theme/colors";
import Logo from "../../assets/logo/bpg-logo.png"; // ajusta o caminho se precisar

export default function LoginScreen() {
  function irParaDashboard() {
    // sem validação, sem backend – só navega
    router.push("/dashboard");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BPG Store</Text>

      <View style={styles.card}>
        <Image source={Logo} style={styles.logo} />

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Digite seu email (teste)"
          placeholderTextColor={COLORS.gray}
          style={styles.input}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          placeholder="Digite sua senha (teste)"
          placeholderTextColor={COLORS.gray}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={irParaDashboard}>
          <Text style={styles.buttonText}>Entrar (teste)</Text>
        </TouchableOpacity>

        <Text style={styles.helperText}>
          Este é um login de teste, não valida nada.{"\n"}
          É só pra visualizar o Dashboard / telas do frontend.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: COLORS.blue,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#020617",
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  logo: {
    width: 140,
    height: 140,
    alignSelf: "center",
    marginBottom: 24,
    resizeMode: "contain",
  },
  label: {
    color: COLORS.white,
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#0f172a",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.white,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  button: {
    backgroundColor: COLORS.blue,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 4,
  },
  buttonText: {
    textAlign: "center",
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  helperText: {
    color: COLORS.gray,
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
  },
});
