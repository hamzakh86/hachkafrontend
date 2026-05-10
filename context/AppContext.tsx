import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export interface Produit {
  id: string;
  nom: string;
  prix: number;
  ancienPrix?: number;
  categorie: string;
  tailles: string[];
  image: string;
  badge?: string;
  note: number;
  avis: number;
}

export interface Categorie {
  id: string;
  label: string;
  icon: string;
}

export interface Banniere {
  id: string;
  titre: string;
  sous: string;
  image: string;
}

export interface ArticlePanier {
  produit: Produit;
  taille: string;
  quantite: number;
}

export interface Utilisateur {
  id: string;
  nom: string;
  email: string;
  telephone?: string;
}

export interface Commande {
  id: string;
  articles: any[];
  total: number;
  remise: number;
  livraison: number;
  statut: string;
  createdAt: string;
}

interface AppContextType {
  produits: Produit[];
  categories: Categorie[];
  bannieres: Banniere[];
  loading: boolean;
  chargerProduits: () => void;
  panier: ArticlePanier[];
  favoris: string[];
  commandes: Commande[];
  utilisateur: Utilisateur | null;
  ajouterAuPanier: (produit: Produit, taille: string) => void;
  supprimerDuPanier: (produitId: string, taille?: string) => void;
  incrementerQuantite: (produitId: string, taille: string) => void;
  decrementerQuantite: (produitId: string, taille: string) => void;
  viderPanier: () => void;
  passerCommande: (adresse: any, codePromo?: string) => Promise<boolean>;
  toggleFavori: (produitId: string) => void;
  estFavori: (produitId: string) => boolean;
  connecter: (user: Utilisateur) => void;
  deconnecter: () => void;
  estConnecte: boolean;
  totalPanier: number;
  nombreArticles: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [bannieres, setBannieres] = useState<Banniere[]>([]);
  const [loading, setLoading] = useState(true);
  const [panier, setPanier] = useState<ArticlePanier[]>([]);
  const [favoris, setFavoris] = useState<string[]>([]);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);

  // Charge les données globales depuis le backend
  useEffect(() => {
    verifierToken();
    chargerDonneesGlobales();
  }, []);

  const verifierToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // L'intercepteur dans api.js ajoutera automatiquement le token au header
        const response = await api.get('auth/me');
        if (response.data.success) {
          const u = response.data.user;
          setUtilisateur({
            id: u._id,
            nom: u.nom,
            email: u.email,
            telephone: u.telephone,
          });
        }
      }
    } catch (error) {
      console.error('Erreur vérification token:', error);
      // Si le token est invalide ou expiré, on le supprime
      await AsyncStorage.removeItem('token');
    }
  };

  // Charge le panier si connecté
  useEffect(() => {
    if (utilisateur) {
      chargerPanier();
      chargerFavoris();
      chargerCommandes();
    }
  }, [utilisateur]);

  const chargerPanier = async () => {
    try {
      const response = await api.get('panier');
      if (response.data.success) {
        setPanier(response.data.panier.map((p: any) => ({
          produit: {
            id: p.produit._id,
            nom: p.produit.nom,
            prix: p.produit.prix,
            ancienPrix: p.produit.ancienPrix,
            categorie: p.produit.categorie,
            tailles: p.produit.tailles,
            image: p.produit.image,
            badge: p.produit.badge,
            note: p.produit.note || 4.5,
            avis: p.produit.avis || 0,
          },
          taille: p.taille,
          quantite: p.quantite
        })));
      }
    } catch (error) {
      console.error('Erreur chargement panier:', error);
    }
  };

  const chargerFavoris = async () => {
    try {
      const response = await api.get('favoris');
      if (response.data.success) {
        setFavoris(response.data.favoris.map((f: any) => f.produit._id));
      }
    } catch (error) {
      console.error('Erreur chargement favoris:', error);
    }
  };

  const chargerCommandes = async () => {
    try {
      const response = await api.get('commandes');
      if (response.data.success) {
        setCommandes(response.data.commandes.map((c: any) => ({
          id: c._id,
          articles: c.articles,
          total: c.total,
          remise: c.remise,
          livraison: c.livraison,
          statut: c.statut,
          createdAt: c.createdAt,
        })));
      }
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
    }
  };

  const chargerDonneesGlobales = async () => {
    try {
      const [resProduits, resCategories, resBannieres] = await Promise.all([
        api.get('produits'),
        api.get('app-data/categories'),
        api.get('app-data/bannieres')
      ]);

      if (resProduits.data.success) {
        setProduits(resProduits.data.produits.map((p: any) => ({
          id: p._id,
          nom: p.nom,
          prix: p.prix,
          ancienPrix: p.ancienPrix,
          categorie: p.categorie,
          tailles: p.tailles,
          image: p.image,
          badge: p.badge,
          note: p.note || 4.5,
          avis: p.avis || 0,
        })));
      }

      if (resCategories.data.success) {
        // Ajouter 'Tous' par défaut s'il n'est pas dans la bdd
        const cats = resCategories.data.categories.map((c: any) => ({
          id: c._id,
          label: c.label,
          icon: c.icon
        }));
        setCategories([{ id: '1', label: 'Tous', icon: 'grid-large' }, ...cats]);
      } else {
        setCategories([{ id: '1', label: 'Tous', icon: 'grid-large' }]);
      }

      if (resBannieres.data.success) {
        setBannieres(resBannieres.data.bannieres.map((b: any) => ({
          id: b._id,
          titre: b.titre,
          sous: b.sous,
          image: b.image
        })));
      }

    } catch (error) {
      console.error('Erreur chargement données globales:', error);
      // Fallback categories en cas d'erreur
      setCategories([{ id: '1', label: 'Tous', icon: 'grid-large' }]);
    } finally {
      setLoading(false);
    }
  };

  // Panier
  const ajouterAuPanier = async (produit: Produit, taille: string) => {
    if (utilisateur) {
      try {
        await api.post('panier', { produitId: produit.id, taille, quantite: 1 });
        await chargerPanier();
        return;
      } catch (error) {
        console.error('Erreur ajout panier:', error);
      }
    }

    // Fallback local
    const existant = panier.find(item => item.produit.id === produit.id && item.taille === taille);
    if (existant) {
      setPanier(panier.map(item => item.produit.id === produit.id && item.taille === taille ? { ...item, quantite: item.quantite + 1 } : item));
    } else {
      setPanier([...panier, { produit, taille, quantite: 1 }]);
    }
  };

  const supprimerDuPanier = async (produitId: string, taille?: string) => {
    if (utilisateur) {
      try {
        await api.delete(`panier/${produitId}${taille ? `?taille=${taille}` : ''}`);
        await chargerPanier();
        return;
      } catch (error) {
        console.error('Erreur suppression panier:', error);
      }
    }
    setPanier(panier.filter(item => !(item.produit.id === produitId && (!taille || item.taille === taille))));
  };

  const incrementerQuantite = async (produitId: string, taille: string) => {
    if (utilisateur) {
      try {
        await api.post('panier', { produitId, taille, quantite: 1 });
        await chargerPanier();
        return;
      } catch (error) {
        console.error('Erreur incrément:', error);
      }
    }
    setPanier(panier.map(item => item.produit.id === produitId && item.taille === taille ? { ...item, quantite: item.quantite + 1 } : item));
  };

  const decrementerQuantite = async (produitId: string, taille: string) => {
    const existant = panier.find(item => item.produit.id === produitId && item.taille === taille);
    if (existant && existant.quantite <= 1) {
      return supprimerDuPanier(produitId, taille);
    }

    if (utilisateur) {
      try {
        await api.post('panier', { produitId, taille, quantite: -1 });
        await chargerPanier();
        return;
      } catch (error) {
        console.error('Erreur décrément:', error);
      }
    }
    setPanier(panier.map(item => item.produit.id === produitId && item.taille === taille && item.quantite > 1 ? { ...item, quantite: item.quantite - 1 } : item));
  };

  const viderPanier = async () => {
    if (utilisateur) {
      try {
        await api.delete('panier');
        await chargerPanier();
        return;
      } catch (error) {
        console.error('Erreur vidage panier:', error);
      }
    }
    setPanier([]);
  };

  const passerCommande = async (adresse: any, codePromo?: string) => {
    if (!utilisateur) return false;
    try {
      const payload = {
        articles: panier.map(item => ({
          produit: item.produit.id,
          nom: item.produit.nom,
          prix: item.produit.prix,
          taille: item.taille,
          quantite: item.quantite,
          image: item.produit.image
        })),
        adresseLivraison: adresse,
        codePromo: codePromo || null
      };
      
      const response = await api.post('commandes', payload);
      if (response.data.success) {
        await viderPanier();
        await chargerCommandes();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur passage commande:', error);
      return false;
    }
  };

  // Favoris
  const toggleFavori = async (produitId: string) => {
    const isFavori = favoris.includes(produitId);
    
    // Update local immediately for UI
    if (isFavori) {
      setFavoris(favoris.filter((id) => id !== produitId));
    } else {
      setFavoris([...favoris, produitId]);
    }

    if (utilisateur) {
      try {
        if (isFavori) {
          await api.delete(`favoris/${produitId}`);
        } else {
          await api.post('favoris', { produitId });
        }
      } catch (error) {
        console.error('Erreur toggle favori:', error);
        // Revert local if error
        chargerFavoris();
      }
    }
  };

  const estFavori = (produitId: string) => {
    return favoris.includes(produitId);
  };

  // Utilisateur
  const connecter = (user: Utilisateur) => {
    setUtilisateur(user);
  };

  const deconnecter = async () => {
    setUtilisateur(null);
    setPanier([]);
    setFavoris([]);
    await AsyncStorage.removeItem('token');
  };

  const estConnecte = !!utilisateur;

  // Calculs
  const totalPanier = panier.reduce(
    (total, item) => total + item.produit.prix * item.quantite,
    0
  );

  const nombreArticles = panier.reduce((total, item) => total + item.quantite, 0);

  return (
    <AppContext.Provider
      value={{
        produits,
        categories,
        bannieres,
        loading,
        chargerProduits: chargerDonneesGlobales,
        panier,
        favoris,
        commandes,
        utilisateur,
        ajouterAuPanier,
        supprimerDuPanier,
        incrementerQuantite,
        decrementerQuantite,
        viderPanier,
        passerCommande,
        toggleFavori,
        estFavori,
        connecter,
        deconnecter,
        estConnecte,
        totalPanier,
        nombreArticles,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}