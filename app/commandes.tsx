import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown, SlideInRight } from 'react-native-reanimated';
import { useApp } from '../context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function CommandesScreen() {
  const { commandes, loading } = useApp();

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'livrée': return '#4CAF50';
      case 'en_cours': return '#2196F3';
      case 'en_attente': return '#FFC107';
      case 'annulée': return '#F44336';
      default: return '#888';
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'livrée': return 'Livrée';
      case 'en_cours': return 'En cours';
      case 'en_attente': return 'En attente';
      case 'annulée': return 'Annulée';
      default: return statut;
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#D4AF37" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Mes Commandes</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {commandes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={80} color="#333" />
            <Text style={styles.emptyText}>Aucune commande pour le moment</Text>
            <TouchableOpacity style={styles.shopBtn} onPress={() => router.push('/(tabs)/explore')}>
              <Text style={styles.shopBtnText}>Commencer vos achats</Text>
            </TouchableOpacity>
          </View>
        ) : (
          commandes.map((commande, index) => (
            <Animated.View 
              key={commande.id} 
              entering={FadeInDown.delay(index * 100)} 
              style={styles.card}
            >
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.orderId}>Commande #{commande.id.slice(-6).toUpperCase()}</Text>
                  <Text style={styles.date}>{new Date(commande.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
                </View>
                <View style={[styles.statutBadge, { backgroundColor: getStatutColor(commande.statut) + '20', borderColor: getStatutColor(commande.statut) }]}>
                  <Text style={[styles.statutText, { color: getStatutColor(commande.statut) }]}>{getStatutLabel(commande.statut)}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.articlesList}>
                {commande.articles.map((art: any, i: number) => (
                  <View key={i} style={styles.articleItem}>
                    <Text style={styles.articleInfo}>{art.quantite}x {art.nom} ({art.taille})</Text>
                    <Text style={styles.articlePrix}>{art.prix * art.quantite} DT</Text>
                  </View>
                ))}
              </View>

              <View style={styles.divider} />

              <View style={styles.cardFooter}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{commande.total} DT</Text>
              </View>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  center: { flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingTop: 60, 
    paddingBottom: 20, 
    paddingHorizontal: 16,
    backgroundColor: '#111'
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1a1a1a', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { color: '#888', fontSize: 16, marginTop: 20, marginBottom: 30 },
  shopBtn: { backgroundColor: '#D4AF37', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  shopBtnText: { color: '#0a0a0a', fontWeight: 'bold' },
  card: { 
    backgroundColor: '#111', 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#222', 
    padding: 16, 
    marginBottom: 16 
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderId: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  date: { color: '#666', fontSize: 12, marginTop: 4 },
  statutBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  statutText: { fontSize: 11, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#222', marginVertical: 12 },
  articlesList: { gap: 8 },
  articleItem: { flexDirection: 'row', justifyContent: 'space-between' },
  articleInfo: { color: '#aaa', fontSize: 13 },
  articlePrix: { color: '#fff', fontSize: 13, fontWeight: 'medium' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { color: '#888', fontSize: 14 },
  totalValue: { color: '#D4AF37', fontSize: 18, fontWeight: 'bold' },
});
