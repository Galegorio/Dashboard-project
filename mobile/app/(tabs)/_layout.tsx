import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {

  return (

    <Tabs screenOptions={{

      headerShown: false,

      tabBarStyle: {
        backgroundColor: "#020617",
        borderTopWidth: 0
      },

      tabBarActiveTintColor: "#22d3ee",
      tabBarInactiveTintColor: "#64748b"

    }}>

      <Tabs.Screen
        name="index"
        options={{
          title: "Clima",
          tabBarIcon: ({ color }) =>
            <Ionicons name="cloud" size={22} color={color} />
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Cripto",
          tabBarIcon: ({ color }) =>
            <Ionicons name="stats-chart" size={22} color={color} />
        }}
      />

    </Tabs>
  );
}
