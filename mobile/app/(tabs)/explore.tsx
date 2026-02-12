import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Dimensions,
  ActivityIndicator
} from "react-native";

import { useEffect, useState } from "react";
import axios from "axios";

import { LineChart } from "react-native-chart-kit";

const API = process.env.EXPO_PUBLIC_API_URL;
const { width } = Dimensions.get("window");


const COINS: any = {
  bitcoin: "BTC",
  ethereum: "ETH",
  tether: "USDT",
  ripple: "XRP",
  binancecoin: "BNB"
};


export default function CryptoScreen() {

  const [prices, setPrices] = useState<any>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [coin, setCoin] = useState("bitcoin");
  const [loading, setLoading] = useState(false);


  async function loadAll(target = "bitcoin") {

    setLoading(true);

    try {

      const res = await axios.get(`${API}/crypto`);
      setPrices(res.data);

      const chart = await axios.get(`${API}/crypto/history/${target}`);
      setHistory(chart.data);

    } catch {
      setHistory([]);
    }

    setLoading(false);
  }


  useEffect(() => {
    loadAll(coin);
  }, []);


  function searchCoin(text: string) {

    const name = text.toLowerCase();

    if (COINS[name]) {
      setCoin(name);
      loadAll(name);
    }
  }


  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>💰 Criptos</Text>

      {/* Busca */}

      <TextInput
        style={styles.input}
        placeholder="bitcoin, ethereum..."
        placeholderTextColor="#64748b"
        onSubmitEditing={e => searchCoin(e.nativeEvent.text)}
      />


      {/* Gráfico */}

      <View style={styles.chartBox}>

        <Text style={styles.chartTitle}>
          {coin.toUpperCase()} - 7 dias
        </Text>

        {loading ? (

          <ActivityIndicator color="#38bdf8" />

        ) : (

          <LineChart
            data={{
              labels: [],
              datasets: [{ data: history }]
            }}
            width={width - 70}
            height={200}
            bezier
            withDots={false}
            withInnerLines={false}
            chartConfig={chartConfig}
          />

        )}

      </View>


      {/* Ranking */}

      <Text style={styles.subtitle}>Top 5</Text>

      {prices && Object.keys(COINS).map((key, i) => (

        <View key={key} style={styles.row}>

          <Text style={styles.rank}>#{i + 1}</Text>

          <Text style={styles.coin}>
            {COINS[key]}
          </Text>

          <View style={{ alignItems: "flex-end" }}>

            <Text style={styles.price}>
              R$ {prices[key]?.brl?.toLocaleString("pt-BR", {
                minimumFractionDigits: 2
              })}
            </Text>

            <Text
              style={[
                styles.change,
                {
                  color:
                    prices[key]?.brl_24h_change >= 0
                      ? "#22c55e"
                      : "#ef4444"
                }
              ]}
            >
              {prices[key]?.brl_24h_change.toFixed(2)}%
            </Text>

          </View>

        </View>

      ))}

    </ScrollView>
  );
}


const chartConfig = {

  backgroundGradientFrom: "#020617",
  backgroundGradientTo: "#020617",

  color: (o = 1) => `rgba(56,189,248,${o})`,

  strokeWidth: 2
};


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 20,
    paddingTop: 60
  },

  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 15
  },

  input: {
    backgroundColor: "#0f172a",
    color: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20
  },

  chartBox: {
    backgroundColor: "#020617",
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1e293b",
    overflow: "hidden"
  },

  chartTitle: {
    color: "#94a3b8",
    marginBottom: 10,
    marginLeft: 5
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: 16,
    marginVertical: 20,
    fontWeight: "bold"
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0f172a",
    padding: 18,
    borderRadius: 15,
    marginBottom: 10
  },

  rank: {
    color: "#818cf8",
    fontWeight: "bold"
  },

  coin: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },

  price: {
    color: "#38bdf8",
    fontWeight: "bold"
  },

  change: {
    fontSize: 12
  }
});
