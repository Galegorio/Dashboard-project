import { View, Text, StyleSheet, TextInput, ActivityIndicator, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.EXPO_PUBLIC_API_URL;

export default function WeatherScreen() {

  const [city, setCity] = useState("Sao Paulo");
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function fetchWeather(target: string) {

    if (!target) return;

    setLoading(true);

    try {
      const res = await axios.get(`${API}/weather/${target}`);
      setWeather(res.data);
    } catch {
      setWeather(null);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchWeather(city);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>🌤️ Clima</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite a cidade..."
        placeholderTextColor="#64748b"
        onSubmitEditing={e => fetchWeather(e.nativeEvent.text)}
      />

      {loading && <ActivityIndicator color="#38bdf8" size="large" />}

      {weather && weather.main && (

        <View style={styles.card}>

          <Text style={styles.city}>{weather.name}</Text>

          <Text style={styles.temp}>
            {Math.round(weather.main.temp)}°C
          </Text>

          <Text style={styles.desc}>
            {weather.weather[0].description}
          </Text>

          <View style={styles.row}>
            <Text style={styles.item}>💧 {weather.main.humidity}%</Text>
            <Text style={styles.item}>💨 {weather.wind.speed} km/h</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.item}>
              ☁️ {weather.clouds.all}%
            </Text>

            <Text style={styles.item}>
              🌡️ Sensação {Math.round(weather.main.feels_like)}°C
            </Text>
          </View>

        </View>
      )}

    </ScrollView>
  );
}


const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    backgroundColor: "#020617",
    padding: 25,
    paddingTop: 60
  },

  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20
  },

  input: {
    backgroundColor: "#0f172a",
    color: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 25
  },

  card: {
    backgroundColor: "#020617",
    padding: 25,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#1e293b",
    alignItems: "center"
  },

  city: {
    color: "#94a3b8",
    fontSize: 18
  },

  temp: {
    color: "#38bdf8",
    fontSize: 70,
    fontWeight: "200"
  },

  desc: {
    color: "#fff",
    fontSize: 16,
    textTransform: "capitalize",
    marginBottom: 20
  },

  row: {
    flexDirection: "row",
    gap: 20,
    marginTop: 10
  },

  item: {
    color: "#64748b",
    fontSize: 15
  }
});
