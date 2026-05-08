import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

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

interface AppContextType {
  produits: Produit[];
  loading: boolean;
  chargerProduits: () => void;
  panier: ArticlePanier[];
  favoris: string[];
  utilisateur: Utilisateur | null;
  ajouterAuPanier: (produit: Produit, taille: string) => void;
  supprimerDuPanier: (produitId: string) => void;
  incrementerQuantite: (produitId: string) => void;
  decrementerQuantite: (produitId: string) => void;
  viderPanier: () => void;
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
  const [loading, setLoading] = useState(true);
  const [panier, setPanier] = useState<ArticlePanier[]>([]);
  const [favoris, setFavoris] = useState<string[]>([]);
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);

  // Charge les produits depuis le backend
  useEffect(() => {
    chargerProduits();
  }, []);

  const chargerProduits = async () => {
    try {
      const response = await api.get('/produits');
      if (response.data.success) {
        setProduits(response.data.produits.map((p: any) => ({
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
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    } finally {
      setLoading(false);
    }
  };

  // Panier
  const ajouterAuPanier = (produit: Produit, taille: string) => {
    const existant = panier.find(
      (item) => item.produit.id === produit.id && item.taille === taille
    );

    if (existant) {
      setPanier(
        panier.map((item) =>
          item.produit.id === produit.id && item.taille === taille
            ? { ...item, quantite: item.quantite + 1 }
            : item
        )
      );
    } else {
      setPanier([...panier, { produit, taille, quantite: 1 }]);
    }
  };

  const supprimerDuPanier = (produitId: string) => {
    setPanier(panier.filter((item) => item.produit.id !== produitId));
  };

  const incrementerQuantite = (produitId: string) => {
    setPanier(
      panier.map((item) =>
        item.produit.id === produitId
          ? { ...item, quantite: item.quantite + 1 }
          : item
      )
    );
  };

  const decrementerQuantite = (produitId: string) => {
    setPanier(
      panier.map((item) =>
        item.produit.id === produitId && item.quantite > 1
          ? { ...item, quantite: item.quantite - 1 }
          : item
      )
    );
  };

  const viderPanier = () => {
    setPanier([]);
  };

  // Favoris
  const toggleFavori = (produitId: string) => {
    if (favoris.includes(produitId)) {
      setFavoris(favoris.filter((id) => id !== produitId));
    } else {
      setFavoris([...favoris, produitId]);
    }
  };

  const estFavori = (produitId: string) => {
    return favoris.includes(produitId);
  };

  // Utilisateur
  const connecter = (user: Utilisateur) => {
    setUtilisateur(user);
  };

  const deconnecter = () => {
    setUtilisateur(null);
    setPanier([]);
    setFavoris([]);
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
        loading,
        chargerProduits,
        panier,
        favoris,
        utilisateur,
        ajouterAuPanier,
        supprimerDuPanier,
        incrementerQuantite,
        decrementerQuantite,
        viderPanier,
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