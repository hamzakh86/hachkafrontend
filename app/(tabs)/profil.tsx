import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useApp } from '../../context/AppContext';

const { width } = Dimensions.get('window');

const menuSections = [
  {
    titre: 'Mon Compte',
    items: [
      { icon: 'bag-outline', label: 'Mes commandes', badge: '3', couleur: '#D4AF37' },
      { icon: 'heart-outline', label: 'Mes favoris', badge: null, couleur: '#ff6b6b' },
      { icon: 'location-outline', label: 'Mes adresses', badge: null, couleur: '#4CAF50' },
      { icon: 'card-outline', label: 'Paiement', badge: null, couleur: '#2196F3' },
    ],
  },
  {
    titre: 'Support',
    items: [
      { icon: 'help-circle-outline', label: 'Aide & Support', badge: null, couleur: '#9C27B0' },
      { icon: 'shield-checkmark-outline', label: 'Confidentialité', badge: null, couleur: '#FF9800' },
      { icon: 'star-outline', label: "Noter l'app", badge: null, couleur: '#D4AF37' },
    ],
  },
];

export default function ProfilScreen() {
  const { utilisateur, estConnecte, deconnecter, favoris, panier, nombreArticles } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handleDeconnexion = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnecter', style: 'destructive', onPress: () => { deconnecter(); router.push('/(tabs)/login'); } },
      ]
    );
  };

  // Si non connecté
  if (!estConnecte) {
    return (
      <View style={styles.nonConnecteContainer}>
        <Animated.View entering={FadeInDown.delay(100)} style={styles.nonConnecteContent}>
          <View style={styles.nonConnecteIcon}>
            <Ionicons name="person-outline" size={64} color="#D4AF37" />
          </View>
          <Text style={styles.nonConnecteTitre}>Connectez-vous</Text>
          <Text style={styles.nonConnecteDesc}>
            Accédez à votre profil, vos commandes et vos favoris
          </Text>
          <TouchableOpacity style={styles.connexionBtn} onPress={() => router.push('/(tabs)/login')}>
            <LinearGradient colors={['#D4AF37', '#B8962E']} style={styles.connexionBtnGradient}>
              <Ionicons name="log-in-outline" size={20} color="#0a0a0a" />
              <Text style={styles.connexionBtnText}>Se connecter</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.inscriptionBtn} onPress={() => router.push('/(tabs)/login')}>
            <Text style={styles.inscriptionBtnText}>Créer un compte</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100)}>
        <LinearGradient colors={['#1a1400', '#0a0a0a']} style={styles.headerGradient}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.settingsBtn}>
              <Ionicons name="settings-outline" size={22} color="#D4AF37" />
            </TouchableOpacity>
          </View>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarDefault}>
              <Ionicons name="person" size={42} color="#D4AF37" />
            </View>
            <TouchableOpacity style={styles.avatarEditBtn}>
              <Ionicons name="camera" size={14} color="#0a0a0a" />
            </TouchableOpacity>
          </View>
          <Text style={styles.nom}>{utilisateur?.nom}</Text>
          <Text style={styles.email}>{utilisateur?.email}</Text>
          {utilisateur?.telephone ? (
            <Text style={styles.telephone}>{utilisateur.telephone}</Text>
          ) : null}
          <View style={styles.memberBadge}>
            <Ionicons name="diamond-outline" size={12} color="#0a0a0a" />
            <Text style={styles.memberText}>Membre Premium</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Stats */}
      <Animated.View entering={FadeInDown.delay(200)} style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNombre}>3</Text>
          <Text style={styles.statLabel}>Commandes</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCard}>
          <Text style={styles.statNombre}>{favoris.length}</Text>
          <Text style={styles.statLabel}>Favoris</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCard}>
          <Text style={styles.statNombre}>{nombreArticles}</Text>
          <Text style={styles.statLabel}>Panier</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCard}>
          <Text style={styles.statNombre}>240</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
      </Animated.View>

      {/* Menu sections */}
      {menuSections.map((section, si) => (
        <Animated.View key={si} entering={FadeInDown.delay(300 + si * 100)}>
          <Text style={styles.sectionTitle}>{section.titre}</Text>
          <View style={styles.menuContainer}>
            {section.items.map((item, ii) => (
              <TouchableOpacity
                key={ii}
                style={[styles.menuItem, ii < section.items.length - 1 && styles.menuItemBorder]}
                activeOpacity={0.7}
                onPress={() => {
                  if (item.label === 'Mes favoris') {
                    Alert.alert('Favoris', `Vous avez ${favoris.length} produit(s) en favoris`);
                  } else if (item.label === 'Mes commandes') {
                    Alert.alert('Commandes', 'Vous avez 3 commandes passées');
                  } else {
                    Alert.alert(item.label, 'Fonctionnalité bientôt disponible !');
                  }
                }}>
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIconContainer, { backgroundColor: item.couleur + '20' }]}>
                    <Ionicons name={item.icon as any} size={20} color={item.couleur} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </View>
                <View style={styles.menuRight}>
                  {item.label === 'Mes favoris' && favoris.length > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{favoris.length}</Text>
                    </View>
                  )}
                  {item.badge && item.label !== 'Mes favoris' && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={16} color="#444" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      ))}

      {/* Paramètres */}
      <Animated.View entering={FadeInDown.delay(500)}>
        <Text style={styles.sectionTitle}>Paramètres</Text>
        <View style={styles.menuContainer}>
          <View style={[styles.menuItem, styles.menuItemBorder]}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: '#D4AF3720' }]}>
                <Ionicons name="notifications-outline" size={20} color="#D4AF37" />
              </View>
              <Text style={styles.menuLabel}>Notifications</Text>
            </View>
            <Switch value={notifications} onValueChange={setNotifications} trackColor={{ false: '#333', true: '#D4AF37' }} thumbColor="#fff" />
          </View>
          <View style={[styles.menuItem, styles.menuItemBorder]}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: '#2196F320' }]}>
                <Ionicons name="mail-outline" size={20} color="#2196F3" />
              </View>
              <Text style={styles.menuLabel}>Newsletter</Text>
            </View>
            <Switch value={newsletter} onValueChange={setNewsletter} trackColor={{ false: '#333', true: '#D4AF37' }} thumbColor="#fff" />
          </View>
          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: '#9C27B020' }]}>
                <Ionicons name="moon-outline" size={20} color="#9C27B0" />
              </View>
              <Text style={styles.menuLabel}>Mode sombre</Text>
            </View>
            <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ false: '#333', true: '#D4AF37' }} thumbColor="#fff" />
          </View>
        </View>
      </Animated.View>

      {/* Déconnexion */}
      <Animated.View entering={FadeInDown.delay(600)}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleDeconnexion} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color="#ff4444" />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
        <Text style={styles.version}>Hachka v1.0.0 • Fait avec ❤️ en Tunisie</Text>
      </Animated.View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },

  // Non connecté
  nonConnecteContainer: { flex: 1, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center', padding: 32 },
  nonConnecteContent: { alignItems: 'center', width: '100%' },
  nonConnecteIcon: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#111', borderWidth: 2, borderColor: '#D4AF37', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  nonConnecteTitre: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  nonConnecteDesc: { color: '#888', fontSize: 14, textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  connexionBtn: { width: '100%', borderRadius: 14, overflow: 'hidden', marginBottom: 12 },
  connexionBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16 },
  connexionBtnText: { color: '#0a0a0a', fontSize: 16, fontWeight: 'bold' },
  inscriptionBtn: { width: '100%', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#333', alignItems: 'center' },
  inscriptionBtnText: { color: '#D4AF37', fontSize: 15, fontWeight: 'bold' },

  // Header
  headerGradient: { alignItems: 'center', paddingBottom: 24 },
  headerTop: { width: '100%', flexDirection: 'row', justifyContent: 'flex-end', padding: 16 },
  settingsBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#333', alignItems: 'center', justifyContent: 'center' },
  avatarContainer: { position: 'relative', marginBottom: 12 },
  avatarDefault: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#1a1a1a', borderWidth: 2, borderColor: '#D4AF37', alignItems: 'center', justifyContent: 'center' },
  avatarEditBtn: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: '#D4AF37', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#0a0a0a' },
  nom: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  email: { color: '#888', fontSize: 13, marginBottom: 4 },
  telephone: { color: '#666', fontSize: 12, marginBottom: 12 },
  memberBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#D4AF37', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  memberText: { color: '#0a0a0a', fontSize: 12, fontWeight: 'bold' },

  // Stats
  statsContainer: { flexDirection: 'row', backgroundColor: '#111', marginHorizontal: 16, marginTop: 16, borderRadius: 16, borderWidth: 1, borderColor: '#1a1a1a', padding: 16 },
  statCard: { flex: 1, alignItems: 'center' },
  statNombre: { color: '#D4AF37', fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: '#888', fontSize: 11, marginTop: 4, textAlign: 'center' },
  statDivider: { width: 1, backgroundColor: '#222' },

  // Section
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 16, marginTop: 24, marginBottom: 12 },

  // Menu
  menuContainer: { backgroundColor: '#111', marginHorizontal: 16, borderRadius: 16, borderWidth: 1, borderColor: '#1a1a1a', overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIconContainer: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { color: '#fff', fontSize: 14 },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: { backgroundColor: '#D4AF37', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { color: '#0a0a0a', fontSize: 11, fontWeight: 'bold' },

  // Logout
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 16, marginTop: 20, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#ff444433', backgroundColor: '#ff444411' },
  logoutText: { color: '#ff4444', fontSize: 15, fontWeight: 'bold' },
  version: { color: '#333', fontSize: 11, textAlign: 'center', marginTop: 16 },
});