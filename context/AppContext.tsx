import { createContext, useContext, useState, ReactNode } from 'react';

// Types
export type Produit = {
  id: string;
  nom: string;
  prix: number;
  image: string;
  categorie: string;
  tailles: string[];
  badge?: string | null;
  note?: number;
  avis?: number;
  ancienPrix?: number | null;
};

export type ArticlePanier = Produit & {
  taille: string;
  quantite: number;
};

export type Utilisateur = {
  nom: string;
  email: string;
  telephone: string;
} | null;

type AppContextType = {
  // Panier
  panier: ArticlePanier[];
  ajouterAuPanier: (produit: Produit, taille: string) => void;
  supprimerDuPanier: (id: string, taille: string) => void;
  incrementerQuantite: (id: string, taille: string) => void;
  decrementerQuantite: (id: string, taille: string) => void;
  viderPanier: () => void;
  totalPanier: number;
  nombreArticles: number;

  // Favoris
  favoris: string[];
  toggleFavori: (id: string) => void;
  estFavori: (id: string) => boolean;

  // Utilisateur
  utilisateur: Utilisateur;
  connecter: (nom: string, email: string, telephone?: string) => void;
  deconnecter: () => void;
  estConnecte: boolean;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [panier, setPanier] = useState<ArticlePanier[]>([]);
  const [favoris, setFavoris] = useState<string[]>([]);
  const [utilisateur, setUtilisateur] = useState<Utilisateur>(null);

  // ── Panier ──
  const ajouterAuPanier = (produit: Produit, taille: string) => {
    setPanier(prev => {
      const existe = prev.find(p => p.id === produit.id && p.taille === taille);
      if (existe) {
        return prev.map(p =>
          p.id === produit.id && p.taille === taille
            ? { ...p, quantite: p.quantite + 1 }
            : p
        );
      }
      return [...prev, { ...produit, taille, quantite: 1 }];
    });
  };

  const supprimerDuPanier = (id: string, taille: string) => {
    setPanier(prev => prev.filter(p => !(p.id === id && p.taille === taille)));
  };

  const incrementerQuantite = (id: string, taille: string) => {
    setPanier(prev => prev.map(p =>
      p.id === id && p.taille === taille ? { ...p, quantite: p.quantite + 1 } : p
    ));
  };

  const decrementerQuantite = (id: string, taille: string) => {
    setPanier(prev => prev
      .map(p => p.id === id && p.taille === taille ? { ...p, quantite: p.quantite - 1 } : p)
      .filter(p => p.quantite > 0)
    );
  };

  const viderPanier = () => setPanier([]);

  const totalPanier = panier.reduce((acc, p) => acc + p.prix * p.quantite, 0);
  const nombreArticles = panier.reduce((acc, p) => acc + p.quantite, 0);

  // ── Favoris ──
  const toggleFavori = (id: string) => {
    setFavoris(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const estFavori = (id: string) => favoris.includes(id);

  // ── Utilisateur ──
  const connecter = (nom: string, email: string, telephone?: string) => {
    setUtilisateur({ nom, email, telephone: telephone || '' });
  };

  const deconnecter = () => setUtilisateur(null);

  const estConnecte = utilisateur !== null;

  return (
    <AppContext.Provider value={{
      panier, ajouterAuPanier, supprimerDuPanier,
      incrementerQuantite, decrementerQuantite, viderPanier,
      totalPanier, nombreArticles,
      favoris, toggleFavori, estFavori,
      utilisateur, connecter, deconnecter, estConnecte,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp doit être utilisé dans AppProvider');
  return context;
}