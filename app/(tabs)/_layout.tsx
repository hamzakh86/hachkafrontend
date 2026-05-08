import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#D4AF37',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#0a0a0a',
          borderTopColor: '#D4AF37',
          borderTopWidth: 1,
        },
        headerStyle: { backgroundColor: '#0a0a0a' },
        headerTintColor: '#D4AF37',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 22 },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hachka',
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Catalogue',
          tabBarLabel: 'Catalogue',
          tabBarIcon: ({ color }) => <Ionicons name="grid" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="panier"
        options={{
          title: 'Mon Panier',
          tabBarLabel: 'Panier',
          tabBarIcon: ({ color }) => <Ionicons name="bag" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Mon Profil',
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: 'Connexion',
          tabBarLabel: 'Connexion',
          tabBarIcon: ({ color }) => <Ionicons name="log-in" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}