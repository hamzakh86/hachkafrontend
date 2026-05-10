import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, SlideInRight } from 'react-native-reanimated';
import { useApp } from '../../context/AppContext';

const { width } = Dimensions.get('window');
const codesPromo = ['HACHKA10', 'MODE20'];

export default function PanierScreen() {
  const { panier, supprimerDuPanier, incrementerQuantite, decrementerQuantite, viderPanier, totalPanier, nombreArticles, estConnecte, passerCommande } = useApp();
  const [promo, setPromo] = useState('');
  const [promoApplique, setPromoApplique] = useState(false);
  const [promoErreur, setPromoErreur] = useState(false);

  const remise = promoApplique ? Math.round(totalPanier * 0.1) : 0;
  const livraison = panier.length > 0 ? 8 : 0;
  const total = totalPanier - remise + livraison;

  const appliquerPromo = () => {
    if (codesPromo.includes(promo.toUpperCase())) {
      setPromoApplique(true);
      setPromoErreur(false);
    } else {
      setPromoErreur(true);
    }
  };

  const handleCommander = async () => {
    if (!estConnecte) {
      Alert.alert(
        'Connexion requise',
        'Veuillez vous connecter pour passer une commande',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Se connecter', onPress: () => router.push('/(tabs)/login') },
        ]
      );
      return;
    }

    // Simulation d'adresse par défaut
    const adresse = {
      rue: 'Avenue Habib Bourguiba',
      ville: 'Tunis',
      codePostal: '1000',
      pays: 'Tunisie',
    };

    const success = await passerCommande(adresse, promoApplique ? promo : undefined);

    if (success) {
      Alert.alert(
        'Commande confirmée ! 🎉',
        `Votre commande de ${total} DT a été passée avec succès !`,
        [{ text: 'Super !', onPress: () => router.push('/commandes') }]
      );
    } else {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la commande.');
    }
  };

  if (panier.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Animated.View entering={FadeInDown.delay(100)} style={styles.emptyContent}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="bag-outline" size={64} color="#D4AF37" />
          </View>
          <Text style={styles.emptyTitle}>Votre panier est vide</Text>
          <Text style={styles.emptyDesc}>Découvrez nos produits et ajoutez-les à votre panier</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/(tabs)/explore')}>
            <Text style={styles.emptyBtnText}>Explorer le catalogue</Text>
            <Ionicons name="arrow-forward" size={16} color="#0a0a0a" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Étapes */}
      <Animated.View entering={FadeInDown.delay(100)} style={styles.etapesContainer}>
        <View style={styles.etape}>
          <View style={[styles.etapeCircle, styles.etapeCircleActive]}>
            <Ionicons name="bag-outline" size={16} color="#0a0a0a" />
          </View>
          <Text style={[styles.etapeLabel, styles.etapeLabelActive]}>Panier</Text>
        </View>
        <View style={styles.etapeLine} />
        <View style={styles.etape}>
          <View style={styles.etapeCircle}>
            <Ionicons name="location-outline" size={16} color="#555" />
          </View>
          <Text style={styles.etapeLabel}>Livraison</Text>
        </View>
        <View style={styles.etapeLine} />
        <View style={styles.etape}>
          <View style={styles.etapeCircle}>
            <Ionicons name="card-outline" size={16} color="#555" />
          </View>
          <Text style={styles.etapeLabel}>Paiement</Text>
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Nombre articles */}
        <Animated.View entering={FadeInDown.delay(150)} style={styles.articlesHeader}>
          <Text style={styles.articlesTitle}>{nombreArticles} article{nombreArticles > 1 ? 's' : ''}</Text>
          <TouchableOpacity onPress={() => Alert.alert('Vider le panier', 'Êtes-vous sûr ?', [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Vider', style: 'destructive', onPress: viderPanier },
          ])}>
            <Text style={styles.viderText}>Vider le panier</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Articles */}
        {panier.map((p, index) => (
          <Animated.View key={`${p.produit.id}-${p.taille}`} entering={SlideInRight.delay(index * 100)} style={styles.item}>
            <Image source={{ uri: p.produit.image }} style={styles.itemImage} contentFit="cover" />
            <View style={styles.itemInfo}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemNom} numberOfLines={1}>{p.produit.nom}</Text>
                <TouchableOpacity onPress={() => supprimerDuPanier(p.produit.id, p.taille)}>
                  <Ionicons name="close-circle" size={22} color="#444" />
                </TouchableOpacity>
              </View>
              <View style={styles.tailleBadge}>
                <Text style={styles.tailleText}>Taille : {p.taille}</Text>
              </View>
              <View style={styles.itemFooter}>
                <Text style={styles.itemPrix}>{p.produit.prix * p.quantite} DT</Text>
                <View style={styles.quantiteRow}>
                  <TouchableOpacity onPress={() => decrementerQuantite(p.produit.id, p.taille)} style={styles.qtyBtn}>
                    <Ionicons name="remove" size={14} color="#D4AF37" />
                  </TouchableOpacity>
                  <Text style={styles.quantite}>{p.quantite}</Text>
                  <TouchableOpacity onPress={() => incrementerQuantite(p.produit.id, p.taille)} style={styles.qtyBtn}>
                    <Ionicons name="add" size={14} color="#D4AF37" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Animated.View>
        ))}

        {/* Code promo */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.promoContainer}>
          <Text style={styles.promoTitle}>
            <Ionicons name="pricetag-outline" size={16} color="#D4AF37" /> Code promo
          </Text>
          {promoApplique ? (
            <View style={styles.promoSuccess}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.promoSuccessText}>Code appliqué ! -10% sur votre commande 🎉</Text>
            </View>
          ) : (
            <>
              <View style={styles.promoRow}>
                <View style={[styles.promoInput, promoErreur && styles.promoInputErreur]}>
                  <TextInput
                    placeholder="Entrez votre code..."
                    placeholderTextColor="#555"
                    style={styles.promoTextInput}
                    value={promo}
                    onChangeText={(t) => { setPromo(t); setPromoErreur(false); }}
                    autoCapitalize="characters"
                  />
                </View>
                <TouchableOpacity style={styles.promoBtn} onPress={appliquerPromo}>
                  <Text style={styles.promoBtnText}>Appliquer</Text>
                </TouchableOpacity>
              </View>
              {promoErreur && <Text style={styles.promoErreurText}>❌ Code invalide. Essayez HACHKA10</Text>}
            </>
          )}
        </Animated.View>

        {/* Résumé */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.resume}>
          <Text style={styles.resumeTitle}>Résumé de commande</Text>
          <View style={styles.resumeRow}>
            <Text style={styles.resumeLabel}>Sous-total ({nombreArticles} articles)</Text>
            <Text style={styles.resumeValeur}>{totalPanier} DT</Text>
          </View>
          {promoApplique && (
            <View style={styles.resumeRow}>
              <Text style={[styles.resumeLabel, { color: '#4CAF50' }]}>Remise promo (-10%)</Text>
              <Text style={[styles.resumeValeur, { color: '#4CAF50' }]}>-{remise} DT</Text>
            </View>
          )}
          <View style={styles.resumeRow}>
            <Text style={styles.resumeLabel}>Livraison</Text>
            <Text style={styles.resumeValeur}>{livraison} DT</Text>
          </View>
          <View style={styles.resumeDivider} />
          <View style={styles.resumeRow}>
            <Text style={styles.resumeTotalLabel}>Total</Text>
            <Text style={styles.resumeTotalValeur}>{total} DT</Text>
          </View>
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bouton commander */}
      <View style={styles.commanderContainer}>
        <TouchableOpacity style={styles.commanderBtn} onPress={handleCommander} activeOpacity={0.85}>
          <LinearGradient colors={['#D4AF37', '#B8962E']} style={styles.commanderGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Ionicons name="bag-check-outline" size={20} color="#0a0a0a" />
            <Text style={styles.commanderText}>Commander — {total} DT</Text>
            <Ionicons name="arrow-forward" size={18} color="#0a0a0a" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },

  // Vide
  emptyContainer: { flex: 1, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyContent: { alignItems: 'center' },
  emptyIconContainer: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#111', borderWidth: 2, borderColor: '#D4AF37', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  emptyTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  emptyDesc: { color: '#888', fontSize: 14, textAlign: 'center', marginBottom: 28, lineHeight: 20 },
  emptyBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#D4AF37', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14 },
  emptyBtnText: { color: '#0a0a0a', fontSize: 15, fontWeight: 'bold' },

  // Étapes
  etapesContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  etape: { alignItems: 'center', gap: 4 },
  etapeCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#333', alignItems: 'center', justifyContent: 'center' },
  etapeCircleActive: { backgroundColor: '#D4AF37', borderColor: '#D4AF37' },
  etapeLabel: { color: '#555', fontSize: 11 },
  etapeLabelActive: { color: '#D4AF37', fontWeight: 'bold' },
  etapeLine: { flex: 1, height: 1, backgroundColor: '#222', marginHorizontal: 8, marginBottom: 14 },

  // Articles header
  articlesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  articlesTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  viderText: { color: '#ff4444', fontSize: 13 },

  // Item
  item: { flexDirection: 'row', backgroundColor: '#111', marginHorizontal: 16, marginBottom: 12, borderRadius: 16, borderWidth: 1, borderColor: '#1a1a1a', overflow: 'hidden' },
  itemImage: { width: 100, height: 120 },
  itemInfo: { flex: 1, padding: 12 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  itemNom: { color: '#fff', fontSize: 14, fontWeight: 'bold', flex: 1, marginRight: 8 },
  tailleBadge: { alignSelf: 'flex-start', borderWidth: 1, borderColor: '#333', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 10 },
  tailleText: { color: '#888', fontSize: 11 },
  itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemPrix: { color: '#D4AF37', fontSize: 16, fontWeight: 'bold' },
  quantiteRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyBtn: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: '#D4AF37', alignItems: 'center', justifyContent: 'center' },
  quantite: { color: '#fff', fontSize: 15, fontWeight: 'bold', minWidth: 20, textAlign: 'center' },

  // Promo
  promoContainer: { backgroundColor: '#111', marginHorizontal: 16, marginTop: 4, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1a1a1a' },
  promoTitle: { color: '#D4AF37', fontSize: 14, fontWeight: 'bold', marginBottom: 12 },
  promoRow: { flexDirection: 'row', gap: 10 },
  promoInput: { flex: 1, backgroundColor: '#1a1a1a', borderRadius: 10, borderWidth: 1, borderColor: '#333', paddingHorizontal: 12 },
  promoInputErreur: { borderColor: '#ff4444' },
  promoTextInput: { color: '#fff', paddingVertical: 10, fontSize: 13 },
  promoBtn: { backgroundColor: '#D4AF37', borderRadius: 10, paddingHorizontal: 16, justifyContent: 'center' },
  promoBtnText: { color: '#0a0a0a', fontWeight: 'bold', fontSize: 13 },
  promoSuccess: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  promoSuccessText: { color: '#4CAF50', fontSize: 13 },
  promoErreurText: { color: '#ff4444', fontSize: 12, marginTop: 8 },

  // Résumé
  resume: { backgroundColor: '#111', marginHorizontal: 16, marginTop: 12, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1a1a1a' },
  resumeTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 14 },
  resumeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  resumeLabel: { color: '#888', fontSize: 14 },
  resumeValeur: { color: '#fff', fontSize: 14 },
  resumeDivider: { height: 1, backgroundColor: '#222', marginVertical: 10 },
  resumeTotalLabel: { color: '#D4AF37', fontSize: 16, fontWeight: 'bold' },
  resumeTotalValeur: { color: '#D4AF37', fontSize: 20, fontWeight: 'bold' },

  // Commander
  commanderContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: '#0a0a0a', borderTopWidth: 1, borderTopColor: '#1a1a1a' },
  commanderBtn: { borderRadius: 16, overflow: 'hidden' },
  commanderGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16 },
  commanderText: { color: '#0a0a0a', fontSize: 16, fontWeight: 'bold', flex: 1, textAlign: 'center' },
});