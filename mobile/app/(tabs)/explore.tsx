import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import { useEffect, useState } from "react";
import axios from "axios";
import { Image } from "expo-image";
import { useRouter } from "expo-router";


const API = "http://192.168.0.162:8000";


interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  price: number;
  change: number;
  rank: number;
}


export default function CryptoScreen() {

  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();


  async function loadCoins() {

    try {

      const res = await axios.get(`${API}/crypto/top5`);

      setCoins(res.data);

    } catch (err) {
      console.log("Erro:", err);
    }

    finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadCoins();
  }, []);


  function openCoin(id: string) {

    router.push(`/crypto/${id}`);
  }


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00e5ff" />
        <Text style={{ color: "#aaa", marginTop: 10 }}>
          Carregando criptos...
        </Text>
      </View>
    );
  }


  return (

    <View style={styles.container}>

      <Text style={styles.title}>💰 Top 5 Criptos</Text>

      <FlatList

        data={coins}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}

        renderItem={({ item }) => (

          <TouchableOpacity
            style={styles.card}
            onPress={() => openCoin(item.id)}
          >

            {/* Rank */}
            <Text style={styles.rank}>#{item.rank}</Text>


            {/* Ícone */}
            <Image
              source={{ uri: item.image }}
              style={styles.icon}
            />


            {/* Nome */}
            <View style={{ flex: 1 }}>

              <Text style={styles.name}>
                {item.symbol.toUpperCase()}
              </Text>

              <Text style={styles.fullName}>
                {item.name}
              </Text>

            </View>


            {/* Preço */}
            <View style={{ alignItems: "flex-end" }}>

              <Text style={styles.price}>
                R$ {item.price.toLocaleString("pt-BR")}
              </Text>

              <Text
                style={[
                  styles.change,
                  {
                    color:
                      item.change >= 0
                        ? "#00ff9c"
                        : "#ff4d4d",
                  },
                ]}
              >
                {item.change.toFixed(2)}%
              </Text>

            </View>

          </TouchableOpacity>
        )}
      />

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingHorizontal: 16,
    paddingTop: 50,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#00e5ff",
    marginBottom: 20,
    textAlign: "center",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#020617",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },

  rank: {
    color: "#64748b",
    fontSize: 14,
    width: 32,
    textAlign: "center",
  },

  icon: {
    width: 40,
    height: 40,
    marginHorizontal: 12,
    borderRadius: 20,
  },

  name: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "bold",
  },

  fullName: {
    color: "#94a3b8",
    fontSize: 12,
  },

  price: {
    color: "#f1f5f9",
    fontSize: 15,
    fontWeight: "600",
  },

  change: {
    fontSize: 13,
    marginTop: 4,
  },
});
