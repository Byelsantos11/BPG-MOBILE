import React, { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet } from "react-native";
import { COLORS } from "../theme/colors";

export default function DashCard({
  title,
  value,
  subtitle,
  type = "primary",
  index = 0, // usado pro delay do card
}) {
  const palette = getPalette(type);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 450,
      delay: index * 120, // efeito cascata
      useNativeDriver: true,
    }).start();

    Animated.timing(translateAnim, {
      toValue: 0,
      duration: 450,
      delay: index * 120,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, translateAnim, index]);

  return (
    <Animated.View
      style={[
        styles.card,
        { borderColor: palette.border },
        {
          opacity: fadeAnim,
          transform: [{ translateY: translateAnim }],
        },
      ]}
    >
      <Text style={[styles.title, { color: palette.title }]}>{title}</Text>
      <Text style={[styles.value, { color: palette.value }]}>{value}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: palette.subtitle }]}>
          {subtitle}
        </Text>
      )}
    </Animated.View>
  );
}

function getPalette(type) {
  switch (type) {
    case "info":
      return {
        border: COLORS.blue,
        value: COLORS.blue,
        title: COLORS.white,
        subtitle: COLORS.gray,
      };
    case "secondary":
      return {
        border: "#1f2937",
        value: COLORS.white,
        title: COLORS.gray,
        subtitle: COLORS.gray,
      };
    case "danger":
      return {
        border: COLORS.danger,
        value: COLORS.danger,
        title: COLORS.white,
        subtitle: COLORS.gray,
      };
    case "success":
      return {
        border: "#16a34a",
        value: "#22c55e",
        title: COLORS.white,
        subtitle: COLORS.gray,
      };
    default:
      return {
        border: COLORS.blue,
        value: COLORS.blue,
        title: COLORS.white,
        subtitle: COLORS.gray,
      };
  }
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#020617",
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1.4,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
  },
  value: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 6,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});
