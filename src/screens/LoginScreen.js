import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../theme/colors";
import Logo from "../../assets/logo/bpg-logo.png";

const API_BASE_URL = "http://192.168.0.112:3000"; // ajuste pro seu backend

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  // animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // fade-in do card + tela subindo levemente
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

   
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.05,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 0.95,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim, logoScale]);

  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha email e senha.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        Alert.alert("Erro", "Email ou senha inválidos.");
        return;
      }

      const data = await response.json();

      if (!data.token) {
        Alert.alert("Erro", "Resposta do servidor inválida.");
        return;
      }

      await AsyncStorage.setItem("token", data.token);

      router.push("/dashboard");
    } catch (error) {
      console.log("Erro no login:", error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>BPG Store</Text>

      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Animated.Image
          source={Logo}
          style={[styles.logo, { transform: [{ scale: logoScale }] }]}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Digite seu email"
          placeholderTextColor={COLORS.gray}
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          placeholder="Digite sua senha"
          placeholderTextColor={COLORS.gray}
          secureTextEntry
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          autoCapitalize="none"
          autoComplete="password"
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>
            {loading ? "Entrando..." : "Entrar"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.helperText}>
          Use suas credenciais da BPG Store para acessar o painel.
        </Text>
      </Animated.View>
    </KeyboardAvoidingView>
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
