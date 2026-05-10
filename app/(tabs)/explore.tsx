import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useApp } from '../../context/AppContext';

const { width } = Dimensions.get('window');



export default function CatalogueScreen() {
  const { produits, categories, loading, toggleFavori, estFavori, ajouterAuPanier, nombreArticles } = useApp();
  const [categorieActive, setCategorieActive] = useState('1');
  const [recherche, setRecherche] = useState('');
  const [vue, setVue] = useState<'grille' | 'liste'>('grille');
  const [tailleSelectionnee, setTailleSelectionnee] = useState<{ [id: string]: string }>({});

  const produitsFiltres = produits.filter(p => {
    const matchCat = categorieActive === '1' || p.categorie === categories.find(c => c.id === categorieActive)?.label;
    const matchSearch = p.nom.toLowerCase().includes(recherche.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAjouterPanier = (produit: any) => {
    if (produit.tailles && produit.tailles.length > 0 && !tailleSelectionnee[produit.id]) {
      Alert.alert('Attention', 'Veuillez sélectionner une taille avant d\'ajouter au panier');
      return;
    }
    const taille = tailleSelectionnee[produit.id] || (produit.tailles && produit.tailles[0]) || 'Unique';
    ajouterAuPanier(produit, taille);
  };

  const renderGrille = (p: any, index: number) => (
    <Animated.View key={p.id} entering={FadeInDown.delay(index * 80)} style={styles.produitCardGrille}>
      <TouchableOpacity activeOpacity={0.9}>
        <View style={styles.produitImageContainer}>
          <Image source={{ uri: p.image }} style={styles.produitImage} contentFit="cover" />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.4)']} style={StyleSheet.absoluteFill} />
          {p.badge && <View style={styles.badge}><Text style={styles.badgeText}>{p.badge}</Text></View>}
          <TouchableOpacity style={styles.favoriBtn} onPress={() => toggleFavori(p.id)}>
            <Ionicons name={estFavori(p.id) ? 'heart' : 'heart-outline'} size={16} color={estFavori(p.id) ? '#D4AF37' : '#fff'} />
          </TouchableOpacity>
        </View>
        <View style={styles.produitInfo}>
          <Text style={styles.produitNom} numberOfLines={1}>{p.nom}</Text>
          <View style={styles.noteRow}>
            <Ionicons name="star" size={11} color="#D4AF37" />
            <Text style={styles.noteText}>{p.note} ({p.avis})</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
            {p.tailles.map((t: string) => (
              <TouchableOpacity
                key={t}
                style={[styles.tailleChip, tailleSelectionnee[p.id] === t && styles.tailleChipActive]}
                onPress={() => setTailleSelectionnee(prev => ({ ...prev, [p.id]: t }))}>
                <Text style={[styles.tailleText, tailleSelectionnee[p.id] === t && styles.tailleTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.prixRow}>
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
  );

  const renderListe = (p: any, index: number) => (
    <Animated.View key={p.id} entering={FadeInRight.delay(index * 80)} style={styles.produitCardListe}>
      <TouchableOpacity activeOpacity={0.9} style={styles.produitListeInner}>
        <View style={styles.produitListeImageContainer}>
          <Image source={{ uri: p.image }} style={styles.produitListeImage} contentFit="cover" />
          {p.badge && <View style={styles.badge}><Text style={styles.badgeText}>{p.badge}</Text></View>}
        </View>
        <View style={styles.produitListeInfo}>
          <Text style={styles.produitNom}>{p.nom}</Text>
          <Text style={styles.produitCategorie}>{p.categorie}</Text>
          <View style={styles.noteRow}>
            <Ionicons name="star" size={11} color="#D4AF37" />
            <Text style={styles.noteText}>{p.note} ({p.avis} avis)</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
            {p.tailles.map((t: string) => (
              <TouchableOpacity
                key={t}
                style={[styles.tailleChip, tailleSelectionnee[p.id] === t && styles.tailleChipActive]}
                onPress={() => setTailleSelectionnee(prev => ({ ...prev, [p.id]: t }))}>
                <Text style={[styles.tailleText, tailleSelectionnee[p.id] === t && styles.tailleTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.prixRow}>
            <View>
              <Text style={styles.produitPrix}>{p.prix} DT</Text>
              {p.ancienPrix && <Text style={styles.ancienPrix}>{p.ancienPrix} DT</Text>}
            </View>
            <View style={styles.listeActions}>
              <TouchableOpacity onPress={() => toggleFavori(p.id)}>
                <Ionicons name={estFavori(p.id) ? 'heart' : 'heart-outline'} size={20} color={estFavori(p.id) ? '#D4AF37' : '#666'} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.addBtn} onPress={() => handleAjouterPanier(p)}>
                <Ionicons name="bag-add-outline" size={16} color="#0a0a0a" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: '#fff' }}>Chargement des produits...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Recherche */}
      <Animated.View entering={FadeInDown.delay(100)} style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un produit..."
          placeholderTextColor="#555"
          value={recherche}
          onChangeText={setRecherche}
        />
        {recherche.length > 0 && (
          <TouchableOpacity onPress={() => setRecherche('')}>
            <Ionicons name="close-circle" size={18} color="#888" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options-outline" size={18} color="#D4AF37" />
        </TouchableOpacity>
      </Animated.View>

      {/* Catégories */}
      <Animated.View entering={FadeInDown.delay(200)}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryChip, categorieActive === cat.id && styles.categoryChipActive]}
              onPress={() => setCategorieActive(cat.id)}>
              <MaterialCommunityIcons name={cat.icon as any} size={16} color={categorieActive === cat.id ? '#0a0a0a' : '#888'} />
              <Text style={[styles.categoryText, categorieActive === cat.id && styles.categoryTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Barre résultats */}
      <Animated.View entering={FadeInDown.delay(300)} style={styles.resultatsBar}>
        <Text style={styles.resultatsText}>{produitsFiltres.length} produits trouvés</Text>
        <View style={styles.vueToggle}>
          <TouchableOpacity style={[styles.vueBtn, vue === 'grille' && styles.vueBtnActive]} onPress={() => setVue('grille')}>
            <Ionicons name="grid-outline" size={18} color={vue === 'grille' ? '#0a0a0a' : '#888'} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.vueBtn, vue === 'liste' && styles.vueBtnActive]} onPress={() => setVue('liste')}>
            <Ionicons name="list-outline" size={18} color={vue === 'liste' ? '#0a0a0a' : '#888'} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Produits */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={vue === 'grille' ? styles.grilleContainer : styles.listeContainer}>
        {produitsFiltres.length === 0 ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ color: '#888', fontSize: 14 }}>Aucun produit trouvé</Text>
          </View>
        ) : (
          <>
            {vue === 'grille'
              ? produitsFiltres.map((p, i) => renderGrille(p, i))
              : produitsFiltres.map((p, i) => renderListe(p, i))
            }
          </>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },

  // Recherche
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', marginHorizontal: 16, marginTop: 16, marginBottom: 12, borderRadius: 14, borderWidth: 1, borderColor: '#222', paddingHorizontal: 14, paddingVertical: 4 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: '#fff', paddingVertical: 12, fontSize: 14 },
  filterBtn: { marginLeft: 8, backgroundColor: '#1a1a1a', padding: 8, borderRadius: 10, borderWidth: 1, borderColor: '#333' },

  // Catégories
  categoryChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#111', borderWidth: 1, borderColor: '#222', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 25, marginRight: 8, marginBottom: 12 },
  categoryChipActive: { backgroundColor: '#D4AF37', borderColor: '#D4AF37' },
  categoryText: { color: '#888', fontSize: 13 },
  categoryTextActive: { color: '#0a0a0a', fontWeight: 'bold' },

  // Résultats
  resultatsBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  resultatsText: { color: '#888', fontSize: 13 },
  vueToggle: { flexDirection: 'row', backgroundColor: '#111', borderRadius: 10, borderWidth: 1, borderColor: '#222', overflow: 'hidden' },
  vueBtn: { padding: 8, paddingHorizontal: 12 },
  vueBtnActive: { backgroundColor: '#D4AF37' },

  // Grille
  grilleContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, justifyContent: 'space-between' },
  produitCardGrille: { width: (width - 40) / 2, backgroundColor: '#111', borderRadius: 16, marginHorizontal: 4, marginBottom: 16, borderWidth: 1, borderColor: '#1a1a1a', overflow: 'hidden' },
  produitImageContainer: { width: '100%', height: 170, position: 'relative' },
  produitImage: { width: '100%', height: '100%' },

  // Liste
  listeContainer: { paddingHorizontal: 16 },
  produitCardListe: { backgroundColor: '#111', borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#1a1a1a', overflow: 'hidden' },
  produitListeInner: { flexDirection: 'row' },
  produitListeImageContainer: { width: 120, height: 150, position: 'relative' },
  produitListeImage: { width: '100%', height: '100%' },
  produitListeInfo: { flex: 1, padding: 12 },
  listeActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },

  // Commun
  badge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#D4AF37', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText: { color: '#0a0a0a', fontSize: 9, fontWeight: 'bold' },
  favoriBtn: { position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  produitInfo: { padding: 10 },
  produitNom: { color: '#fff', fontSize: 13, fontWeight: 'bold', marginBottom: 4 },
  produitCategorie: { color: '#888', fontSize: 11, marginBottom: 4 },
  noteRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  noteText: { color: '#888', fontSize: 11 },
  tailleChip: { borderWidth: 1, borderColor: '#333', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginRight: 4 },
  tailleChipActive: { borderColor: '#D4AF37', backgroundColor: '#D4AF3720' },
  tailleText: { color: '#666', fontSize: 10 },
  tailleTextActive: { color: '#D4AF37' },
  prixRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  produitPrix: { color: '#D4AF37', fontSize: 14, fontWeight: 'bold' },
  ancienPrix: { color: '#555', fontSize: 11, textDecorationLine: 'line-through' },
  addBtn: { backgroundColor: '#D4AF37', borderRadius: 20, width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
});