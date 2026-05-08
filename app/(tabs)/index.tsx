import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useApp } from '../../context/AppContext';

const { width } = Dimensions.get('window');

const categories = [
  { id: '1', label: 'Tous', icon: 'grid-large' },
  { id: '2', label: 'Vestes', icon: 'jacket' },
  { id: '3', label: 'Robes', icon: 'tshirt-crew' },
  { id: '4', label: 'Chemises', icon: 'button-pointer' },
  { id: '5', label: 'Accessoires', icon: 'bag-personal' },
];

export const produits = [
  { id: '1', nom: 'Veste Élégante', prix: 189, ancienPrix: 230, categorie: 'Vestes', tailles: ['S', 'M', 'L', 'XL'], note: 4.8, avis: 124, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', badge: 'Nouveau' },
  { id: '2', nom: 'Robe Dorée', prix: 145, ancienPrix: null, categorie: 'Robes', tailles: ['S', 'M', 'L'], note: 4.6, avis: 89, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400', badge: 'Populaire' },
  { id: '3', nom: 'Sac Premium', prix: 220, ancienPrix: null, categorie: 'Accessoires', tailles: ['Unique'], note: 4.9, avis: 56, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400', badge: null },
  { id: '4', nom: 'Chemise Luxe', prix: 95, ancienPrix: 120, categorie: 'Chemises', tailles: ['S', 'M', 'L', 'XL', 'XXL'], note: 4.5, avis: 201, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400', badge: '-20%' },
  { id: '5', nom: 'Pantalon Chic', prix: 110, ancienPrix: null, categorie: 'Pantalons', tailles: ['S', 'M', 'L', 'XL'], note: 4.7, avis: 78, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', badge: null },
  { id: '6', nom: 'Écharpe Or', prix: 65, ancienPrix: null, categorie: 'Accessoires', tailles: ['Unique'], note: 4.4, avis: 43, image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400', badge: 'Nouveau' },
];

const bannieres = [
  { id: '1', titre: 'Nouvelle Collection', sous: 'Printemps 2026', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800' },
  { id: '2', titre: 'Soldes -30%', sous: 'Offres limitées', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800' },
];

export default function HomeScreen() {
  const { toggleFavori, estFavori, ajouterAuPanier, nombreArticles, utilisateur, estConnecte } = useApp();
  const [categorieActive, setCategorieActive] = useState('1');
  const [tailleSelectionnee, setTailleSelectionnee] = useState<{ [id: string]: string }>({});

  const produitsFiltres = categorieActive === '1'
    ? produits
    : produits.filter(p => p.categorie === categories.find(c => c.id === categorieActive)?.label);

  const handleAjouterPanier = (produit: typeof produits[0]) => {
    const taille = tailleSelectionnee[produit.id] || produit.tailles[0];
    ajouterAuPanier(produit, taille);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
        <View>
          <Text style={styles.headerBonjour}>
            {estConnecte ? `Bonjour 👋` : 'Bienvenue 👋'}
          </Text>
          <Text style={styles.headerNom}>
            {estConnecte ? utilisateur?.nom : 'Invité'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="search-outline" size={22} color="#D4AF37" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/(tabs)/panier')}>
            <Ionicons name="bag-outline" size={22} color="#D4AF37" />
            {nombreArticles > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{nombreArticles}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Bannières */}
      <Animated.View entering={FadeInDown.delay(200)}>
        <FlatList
          data={bannieres}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.banniereContainer}>
              <Image source={{ uri: item.image }} style={styles.banniereImage} contentFit="cover" />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.banniereGradient}>
                <Text style={styles.banniereSous}>{item.sous}</Text>
                <Text style={styles.banniereTitre}>{item.titre}</Text>
                <TouchableOpacity style={styles.banniereBtn} onPress={() => router.push('/(tabs)/explore')}>
                  <Text style={styles.banniereBtnText}>Découvrir</Text>
                  <Ionicons name="arrow-forward" size={14} color="#0a0a0a" />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}
        />
      </Animated.View>

      {/* Catégories */}
      <Animated.View entering={FadeInDown.delay(300)}>
        <Text style={styles.sectionTitle}>Catégories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesRow}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryChip, categorieActive === cat.id && styles.categoryChipActive]}
              onPress={() => setCategorieActive(cat.id)}>
              <MaterialCommunityIcons
                name={cat.icon as any}
                size={18}
                color={categorieActive === cat.id ? '#0a0a0a' : '#D4AF37'}
              />
              <Text style={[styles.categoryText, categorieActive === cat.id && styles.categoryTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Produits */}
      <Text style={styles.sectionTitle}>Produits Vedettes ✨</Text>
      <View style={styles.produitsGrid}>
        {produitsFiltres.map((p, index) => (
          <Animated.View key={p.id} entering={FadeInDown.delay(400 + index * 80)} style={styles.produitCard}>
            <TouchableOpacity activeOpacity={0.9}>

              {/* Image */}
              <View style={styles.produitImageContainer}>
                <Image source={{ uri: p.image }} style={styles.produitImage} contentFit="cover" />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.4)']} style={StyleSheet.absoluteFill} />
                {p.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{p.badge}</Text>
                  </View>
                )}
                <TouchableOpacity style={styles.favoriBtn} onPress={() => toggleFavori(p.id)}>
                  <Ionicons
                    name={estFavori(p.id) ? 'heart' : 'heart-outline'}
                    size={16}
                    color={estFavori(p.id) ? '#D4AF37' : '#fff'}
                  />
                </TouchableOpacity>
              </View>

              {/* Info */}
              <View style={styles.produitInfo}>
                <Text style={styles.produitNom} numberOfLines={1}>{p.nom}</Text>
                <View style={styles.noteRow}>
                  <Ionicons name="star" size={11} color="#D4AF37" />
                  <Text style={styles.noteText}>{p.note} ({p.avis})</Text>
                </View>

                {/* Tailles */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                  {p.tailles.map(t => (
                    <TouchableOpacity
                      key={t}
                      style={[styles.tailleChip, tailleSelectionnee[p.id] === t && styles.tailleChipActive]}
                      onPress={() => setTailleSelectionnee(prev => ({ ...prev, [p.id]: t }))}>
                      <Text style={[styles.tailleText, tailleSelectionnee[p.id] === t && styles.tailleTextActive]}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <View style={styles.produitFooter}>
                  <View>
                    <Text style={styles.produitPrix}>{p.prix} DT</Text>
                    {p.ancienPrix && <Text style={styles.ancienPrix}>{p.ancienPrix} DT</Text>}
                  </View>
                  <TouchableOpacity style={styles.addBtn} onPress={() => handleAjouterPanier(p)}>
                    <Ionicons name="bag-add-outline" size={16} color="#0a0a0a" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  headerBonjour: { color: '#888', fontSize: 13 },
  headerNom: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  headerActions: { flexDirection: 'row', gap: 10 },
  headerBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#111', borderWidth: 1, borderColor: '#222', alignItems: 'center', justifyContent: 'center' },
  cartBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#D4AF37', borderRadius: 10, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  cartBadgeText: { color: '#0a0a0a', fontSize: 10, fontWeight: 'bold' },

  // Bannières
  banniereContainer: { width: width - 32, height: 200, marginHorizontal: 16, borderRadius: 20, overflow: 'hidden', marginBottom: 8 },
  banniereImage: { width: '100%', height: '100%' },
  banniereGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingTop: 40 },
  banniereSous: { color: '#D4AF37', fontSize: 11, letterSpacing: 2, marginBottom: 4 },
  banniereTitre: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  banniereBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#D4AF37', alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  banniereBtnText: { color: '#0a0a0a', fontSize: 12, fontWeight: 'bold' },

  // Catégories
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 20, marginTop: 24, marginBottom: 14 },
  categoriesRow: { paddingLeft: 20, marginBottom: 4 },
  categoryChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#111', borderWidth: 1, borderColor: '#333', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 25, marginRight: 10 },
  categoryChipActive: { backgroundColor: '#D4AF37', borderColor: '#D4AF37' },
  categoryText: { color: '#D4AF37', fontSize: 13 },
  categoryTextActive: { color: '#0a0a0a', fontWeight: 'bold' },

  // Produits
  produitsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, justifyContent: 'space-between' },
  produitCard: { width: (width - 40) / 2, backgroundColor: '#111', borderRadius: 16, marginHorizontal: 4, marginBottom: 16, borderWidth: 1, borderColor: '#1a1a1a', overflow: 'hidden' },
  produitImageContainer: { width: '100%', height: 180, position: 'relative' },
  produitImage: { width: '100%', height: '100%' },
  badge: { position: 'absolute', top: 10, left: 10, backgroundColor: '#D4AF37', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText: { color: '#0a0a0a', fontSize: 10, fontWeight: 'bold' },
  favoriBtn: { position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  produitInfo: { padding: 12 },
  produitNom: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  noteRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  noteText: { color: '#888', fontSize: 11 },
  tailleChip: { borderWidth: 1, borderColor: '#333', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginRight: 4 },
  tailleChipActive: { borderColor: '#D4AF37', backgroundColor: '#D4AF3720' },
  tailleText: { color: '#666', fontSize: 10 },
  tailleTextActive: { color: '#D4AF37' },
  produitFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  produitPrix: { color: '#D4AF37', fontSize: 14, fontWeight: 'bold' },
  ancienPrix: { color: '#555', fontSize: 11, textDecorationLine: 'line-through' },
  addBtn: { backgroundColor: '#D4AF37', borderRadius: 20, width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
});