import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
} from "react-native";

import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";

import { API_URL } from "../services/api";

import { LineChart } from "react-native-chart-kit";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  price: number;
  change: number;
  rank: number;
  history: number[];
}

export default function CryptoDetails() {

  const { id } = useLocalSearchParams<{ id: string }>();

  const [coin, setCoin] = useState<Coin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);


  async function loadDetails() {

    try {

      setLoading(true);
      setError(false);

      const res = await axios.get(
        `${API_URL}/crypto/details/${id}`,
        { timeout: 10000 }
      );

      if (res.data?.error) {
        setError(true);
        return;
      }

      setCoin(res.data);

    } catch (err) {

      console.log("Erro:", err);
      setError(true);

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {

    if (id) {
      loadDetails();
    }

  }, [id]);


  /* LOADING */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00e5ff" />
        <Text style={{ color: "#aaa", marginTop: 10 }}>
          Carregando detalhes...
        </Text>
      </View>
    );
  }


  /* ERRO */
  if (error || !coin) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#ff4d4d" }}>
          Erro ao carregar moeda 😢
        </Text>
      </View>
    );
  }


  return (

    <ScrollView style={styles.container}>

      <Image
        source={{ uri: coin.image }}
        style={styles.image}
      />

      <Text style={styles.title}>{coin.name}</Text>

      <Text style={styles.text}>
        💰 Preço: R$ {coin.price.toLocaleString("pt-BR")}
      </Text>

      <Text style={styles.text}>
        🏆 Rank: #{coin.rank}
      </Text>

      <Text
        style={[
          styles.text,
          {
            color: coin.change >= 0 ? "#00ff9c" : "#ff4d4d",
          },
        ]}
      >
        {coin.change.toFixed(2)}%
      </Text>


      <Text style={styles.subtitle}>
        📈 Últimos 7 dias
      </Text>


      <LineChart
        data={{
          labels: ["7d", "6d", "5d", "4d", "3d", "2d", "Hoje"],
          datasets: [
            {
              data: coin.history,
            },
          ],
        }}

        width={Dimensions.get("window").width - 32}
        height={220}

        yAxisLabel="R$ "

        chartConfig={{
          backgroundColor: "#020617",
          backgroundGradientFrom: "#020617",
          backgroundGradientTo: "#020617",
          decimalPlaces: 2,

          color: (opacity = 1) =>
            `rgba(0,229,255,${opacity})`,

          labelColor: () => "#94a3b8",
        }}

        bezier

        style={{
          marginVertical: 16,
          borderRadius: 12,
        }}
      />

    </ScrollView>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0f172a",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },

  image: {
    width: 90,
    height: 90,
    alignSelf: "center",
    marginBottom: 12,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00e5ff",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    marginTop: 24,
    marginBottom: 8,
    fontWeight: "bold",
    color: "#f8fafc",
    fontSize: 16,
  },

  text: {
    color: "#cbd5f5",
    textAlign: "center",
    marginTop: 4,
    fontSize: 15,
  },

});
