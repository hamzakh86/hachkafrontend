import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const { connecter, estConnecte, utilisateur, deconnecter } = useApp();

  const [mode, setMode] = useState<'login' | 'inscription'>('login');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [nomFocus, setNomFocus] = useState(false);
  const [telFocus, setTelFocus] = useState(false);
  const [loading, setLoading] = useState(false);

  const validerEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = () => {
    if (mode === 'inscription') {
      if (!nom.trim()) return Alert.alert('Erreur', 'Veuillez entrer votre nom');
      if (!validerEmail(email)) return Alert.alert('Erreur', 'Email invalide');
      if (motDePasse.length < 6) return Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      setLoading(true);
      setTimeout(() => {
        connecter(nom, email, telephone);
        setLoading(false);
        Alert.alert('Bienvenue ! 🎉', `Compte créé avec succès pour ${nom}`);
        router.push('/(tabs)');
      }, 1000);
    } else {
      if (!validerEmail(email)) return Alert.alert('Erreur', 'Email invalide');
      if (!motDePasse) return Alert.alert('Erreur', 'Veuillez entrer votre mot de passe');
      setLoading(true);
      setTimeout(() => {
        connecter(email.split('@')[0], email);
        setLoading(false);
        Alert.alert('Connexion réussie ! 👋', `Bon retour sur Hachka !`);
        router.push('/(tabs)');
      }, 1000);
    }
  };

  // Si déjà connecté
  if (estConnecte) {
    return (
      <View style={styles.container}>
        <Animated.View entering={FadeInDown.delay(100)} style={styles.connectedContainer}>
          <LinearGradient colors={['#1a1400', '#0a0a0a']} style={styles.connectedGradient}>
            <View style={styles.connectedAvatar}>
              <Ionicons name="person" size={48} color="#D4AF37" />
            </View>
            <Text style={styles.connectedNom}>{utilisateur?.nom}</Text>
            <Text style={styles.connectedEmail}>{utilisateur?.email}</Text>
            <View style={styles.connectedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.connectedBadgeText}>Connecté</Text>
            </View>

            <View style={styles.connectedActions}>
              <TouchableOpacity style={styles.connectedBtn} onPress={() => router.push('/(tabs)/profil')}>
                <Ionicons name="person-outline" size={18} color="#D4AF37" />
                <Text style={styles.connectedBtnText}>Mon Profil</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.connectedBtn} onPress={() => router.push('/(tabs)')}>
                <Ionicons name="home-outline" size={18} color="#D4AF37" />
                <Text style={styles.connectedBtnText}>Accueil</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={() => { deconnecter(); }}>
              <Ionicons name="log-out-outline" size={18} color="#ff4444" />
              <Text style={styles.logoutText}>Se déconnecter</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800' }}
        style={styles.backgroundImage}
        contentFit="cover"
      />
      <LinearGradient colors={['rgba(0,0,0,0.3)', 'rgba(10,10,10,0.95)', '#0a0a0a']} style={StyleSheet.absoluteFill} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Logo */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.logoContainer}>
          <Text style={styles.logo}>HACHKA</Text>
          <Text style={styles.logoSub}>Mode & Élégance Tunisienne</Text>
          <View style={styles.logoDivider} />
        </Animated.View>

        {/* Card */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.card}>

          {/* Toggle */}
          <View style={styles.toggle}>
            <TouchableOpacity style={[styles.toggleBtn, mode === 'login' && styles.toggleBtnActive]} onPress={() => setMode('login')} activeOpacity={0.8}>
              {mode === 'login' ? (
                <LinearGradient colors={['#D4AF37', '#B8962E']} style={styles.toggleGradient}>
                  <Ionicons name="log-in-outline" size={16} color="#0a0a0a" />
                  <Text style={styles.toggleTextActive}>Connexion</Text>
                </LinearGradient>
              ) : (
                <View style={styles.toggleGradient}>
                  <Ionicons name="log-in-outline" size={16} color="#888" />
                  <Text style={styles.toggleText}>Connexion</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.toggleBtn, mode === 'inscription' && styles.toggleBtnActive]} onPress={() => setMode('inscription')} activeOpacity={0.8}>
              {mode === 'inscription' ? (
                <LinearGradient colors={['#D4AF37', '#B8962E']} style={styles.toggleGradient}>
                  <Ionicons name="person-add-outline" size={16} color="#0a0a0a" />
                  <Text style={styles.toggleTextActive}>Inscription</Text>
                </LinearGradient>
              ) : (
                <View style={styles.toggleGradient}>
                  <Ionicons name="person-add-outline" size={16} color="#888" />
                  <Text style={styles.toggleText}>Inscription</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Formulaire */}
          <View style={styles.form}>

            {mode === 'inscription' && (
              <>
                <Animated.View entering={FadeInDown.delay(100)} style={[styles.inputWrapper, nomFocus && styles.inputWrapperFocus]}>
                  <View style={styles.inputIconContainer}>
                    <Ionicons name="person-outline" size={18} color={nomFocus ? '#D4AF37' : '#555'} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Nom complet"
                    placeholderTextColor="#444"
                    value={nom}
                    onChangeText={setNom}
                    onFocus={() => setNomFocus(true)}
                    onBlur={() => setNomFocus(false)}
                  />
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(150)} style={[styles.inputWrapper, telFocus && styles.inputWrapperFocus]}>
                  <View style={styles.inputIconContainer}>
                    <Ionicons name="call-outline" size={18} color={telFocus ? '#D4AF37' : '#555'} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Numéro de téléphone"
                    placeholderTextColor="#444"
                    value={telephone}
                    onChangeText={setTelephone}
                    keyboardType="phone-pad"
                    onFocus={() => setTelFocus(true)}
                    onBlur={() => setTelFocus(false)}
                  />
                </Animated.View>
              </>
            )}

            <Animated.View entering={FadeInDown.delay(200)} style={[styles.inputWrapper, emailFocus && styles.inputWrapperFocus]}>
              <View style={styles.inputIconContainer}>
                <Ionicons name="mail-outline" size={18} color={emailFocus ? '#D4AF37' : '#555'} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Adresse email"
                placeholderTextColor="#444"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
              />
              {validerEmail(email) && (
                <Ionicons name="checkmark-circle" size={18} color="#4CAF50" style={{ marginRight: 12 }} />
              )}
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(250)} style={[styles.inputWrapper, passwordFocus && styles.inputWrapperFocus]}>
              <View style={styles.inputIconContainer}>
                <Ionicons name="lock-closed-outline" size={18} color={passwordFocus ? '#D4AF37' : '#555'} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor="#444"
                value={motDePasse}
                onChangeText={setMotDePasse}
                secureTextEntry={!showPassword}
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ marginRight: 12 }}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#555" />
              </TouchableOpacity>
            </Animated.View>

            {/* Force mot de passe */}
            {mode === 'inscription' && motDePasse.length > 0 && (
              <Animated.View entering={FadeInDown} style={styles.forceContainer}>
                <View style={styles.forceBarre}>
                  <View style={[styles.forceSegment, motDePasse.length >= 4 && styles.forceSegmentActive]} />
                  <View style={[styles.forceSegment, motDePasse.length >= 7 && styles.forceSegmentActive]} />
                  <View style={[styles.forceSegment, motDePasse.length >= 10 && { backgroundColor: '#4CAF50' }]} />
                </View>
                <Text style={styles.forceLabel}>
                  {motDePasse.length < 4 ? '🔴 Faible' : motDePasse.length < 7 ? '🟡 Moyen' : '🟢 Fort'}
                </Text>
              </Animated.View>
            )}

            {mode === 'login' && (
              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
              </TouchableOpacity>
            )}

            {/* Bouton submit */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85} disabled={loading}>
              <LinearGradient colors={loading ? ['#888', '#666'] : ['#D4AF37', '#B8962E']} style={styles.submitGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                {loading ? (
                  <Text style={styles.submitText}>Chargement...</Text>
                ) : (
                  <>
                    <Text style={styles.submitText}>{mode === 'login' ? 'Se connecter' : 'Créer mon compte'}</Text>
                    <Ionicons name="arrow-forward" size={18} color="#0a0a0a" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Séparateur */}
            <View style={styles.separateur}>
              <View style={styles.separateurLine} />
              <Text style={styles.separateurText}>ou</Text>
              <View style={styles.separateurLine} />
            </View>

            {/* Boutons sociaux */}
            <View style={styles.sociauxRow}>
              <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8} onPress={() => Alert.alert('Google', 'Connexion Google bientôt disponible !')}>
                <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png' }} style={styles.socialIcon} contentFit="contain" />
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8} onPress={() => Alert.alert('Facebook', 'Connexion Facebook bientôt disponible !')}>
                <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/768px-Facebook_Logo_%282019%29.png' }} style={styles.socialIcon} contentFit="contain" />
                <Text style={styles.socialText}>Facebook</Text>
              </TouchableOpacity>
            </View>

          </View>
        </Animated.View>

        {/* Footer */}
        <Animated.View entering={FadeInUp.delay(400)} style={styles.footer}>
          <Text style={styles.footerText}>{mode === 'login' ? "Pas encore de compte ? " : "Déjà un compte ? "}</Text>
          <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'inscription' : 'login')}>
            <Text style={styles.footerLink}>{mode === 'login' ? "S'inscrire" : "Se connecter"}</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  backgroundImage: { position: 'absolute', top: 0, left: 0, right: 0, height: height * 0.4 },
  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 80 },

  // Connecté
  connectedContainer: { flex: 1 },
  connectedGradient: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  connectedAvatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#1a1a1a', borderWidth: 2, borderColor: '#D4AF37', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  connectedNom: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  connectedEmail: { color: '#888', fontSize: 14, marginBottom: 12 },
  connectedBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#4CAF5020', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginBottom: 32 },
  connectedBadgeText: { color: '#4CAF50', fontSize: 13, fontWeight: 'bold' },
  connectedActions: { flexDirection: 'row', gap: 12, marginBottom: 20, width: '100%' },
  connectedBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#111', borderWidth: 1, borderColor: '#D4AF37', borderRadius: 14, padding: 14 },
  connectedBtnText: { color: '#D4AF37', fontSize: 14, fontWeight: 'bold' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14 },
  logoutText: { color: '#ff4444', fontSize: 14, fontWeight: 'bold' },

  // Logo
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  logo: { color: '#D4AF37', fontSize: 52, fontWeight: 'bold', letterSpacing: 10 },
  logoSub: { color: '#888', fontSize: 12, marginTop: 6, letterSpacing: 2 },
  logoDivider: { width: 60, height: 2, backgroundColor: '#D4AF37', marginTop: 14, borderRadius: 2 },

  // Card
  card: { backgroundColor: 'rgba(17,17,17,0.95)', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#1a1a1a' },

  // Toggle
  toggle: { flexDirection: 'row', backgroundColor: '#0a0a0a', borderRadius: 14, padding: 4, marginBottom: 24, gap: 4 },
  toggleBtn: { flex: 1, borderRadius: 10, overflow: 'hidden' },
  toggleBtnActive: {},
  toggleGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
  toggleText: { color: '#888', fontSize: 14, fontWeight: '600' },
  toggleTextActive: { color: '#0a0a0a', fontSize: 14, fontWeight: 'bold' },

  // Form
  form: { gap: 12 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0a0a0a', borderRadius: 14, borderWidth: 1, borderColor: '#222' },
  inputWrapperFocus: { borderColor: '#D4AF37' },
  inputIconContainer: { width: 46, alignItems: 'center' },
  input: { flex: 1, color: '#fff', paddingVertical: 14, fontSize: 14 },

  // Force
  forceContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: -4 },
  forceBarre: { flex: 1, flexDirection: 'row', gap: 4 },
  forceSegment: { flex: 1, height: 3, backgroundColor: '#222', borderRadius: 2 },
  forceSegmentActive: { backgroundColor: '#D4AF37' },
  forceLabel: { color: '#888', fontSize: 11 },

  // Forgot
  forgotBtn: { alignSelf: 'flex-end', marginTop: -4 },
  forgotText: { color: '#D4AF37', fontSize: 13 },

  // Submit
  submitBtn: { borderRadius: 14, overflow: 'hidden', marginTop: 4 },
  submitGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16 },
  submitText: { color: '#0a0a0a', fontSize: 16, fontWeight: 'bold' },

  // Séparateur
  separateur: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  separateurLine: { flex: 1, height: 1, backgroundColor: '#1a1a1a' },
  separateurText: { color: '#444', fontSize: 12 },

  // Sociaux
  sociauxRow: { flexDirection: 'row', gap: 12 },
  socialBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#0a0a0a', borderWidth: 1, borderColor: '#222', borderRadius: 14, padding: 14 },
  socialIcon: { width: 20, height: 20 },
  socialText: { color: '#fff', fontSize: 14 },

  // Footer
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: '#666', fontSize: 14 },
  footerLink: { color: '#D4AF37', fontSize: 14, fontWeight: 'bold' },
});