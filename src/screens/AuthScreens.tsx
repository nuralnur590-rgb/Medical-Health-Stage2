import React, { useState } from 'react';
import {Alert, KeyboardAvoidingView, KeyboardTypeOptions, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import type { RootScreenProps } from '../navigation/types';
import { isValidEmail, isValidPassword, isValidPhone } from '../utils/validation';

type LayoutProps = { navigation: { goBack: () => void }; children: React.ReactNode };

function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <View style={[styles.brandMark, inverse && styles.brandMarkInverse]}>
      <Text style={[styles.brandIcon, inverse && styles.brandIconInverse]}>✚</Text>
    </View>
  );
}

export function SplashScreen({ navigation }: RootScreenProps<'Splash'>) {
  return (
    <SafeAreaView style={styles.splash}>
      <View style={styles.splashCenter}>
        <BrandMark />
        <Text style={styles.splashTitle}>Skin Firsts</Text>
        <Text style={styles.splashSubtitle}>Дерматология орталығы</Text>
      </View>
      <Text style={styles.splashFoot}>Тері саулығы — өз қолыңызда</Text>
      <TouchableOpacity style={styles.splashButton} onPress={() => navigation.replace('Welcome')}>
        <Text style={styles.splashButtonText}>Бастау</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export function WelcomeScreen({ navigation }: RootScreenProps<'Welcome'>) {
  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.welcomeContent}>
        <BrandMark inverse />
        <Text style={styles.brandTitle}>Skin Firsts</Text>
        <Text style={styles.brandSubtitle}>Дерматология орталығы</Text>
        <View style={styles.welcomeIllustration}>
          <Text style={styles.illustrationEmoji}>🩺</Text>
          <View style={styles.illustrationBadge}><Text style={styles.illustrationBadgeText}>✓</Text></View>
        </View>
        <Text style={styles.welcomeTitle}>Тері күтімі —{ '\n' }денсаулықтың бастауы</Text>
        <Text style={styles.welcomeDescription}>
          Білікті дерматологтарды табыңыз, кеңеске жазылыңыз және тері саулығын бір жерде бақылаңыз.
        </Text>
      </View>
      <View style={styles.welcomeActions}>
        <PrimaryButton title="Кіру" onPress={() => navigation.navigate('Login')} />
        <SecondaryButton title="Тіркелу" onPress={() => navigation.navigate('SignUp')} />
        <TouchableOpacity onPress={() => navigation.replace('MainTabs')} style={styles.guestButton}>
          <Text style={styles.guestText}>Қолданбаны шолу</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export function LoginScreen({ navigation }: RootScreenProps<'Login'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Мәліметтер толық емес', 'Электрондық пошта мен құпиясөзді енгізіңіз.');
      return;
    }
    Alert.alert('Әзірге қолжетімсіз', 'Нақты авторизация Supabase қосылғаннан кейін іске қосылады. Қазір қолданбаны шолу режимінде пайдалана аласыз.');
  };
  return (
    <AuthLayout navigation={navigation}>
      <Text style={styles.formEyebrow}>ҚОШ КЕЛДІҢІЗ</Text>
      <Text style={styles.formTitle}>Аккаунтқа кіру</Text>
      <Text style={styles.formSubtitle}>Жалғастыру үшін деректеріңізді енгізіңіз.</Text>
      <Field label="Электрондық пошта немесе телефон" value={email} onChangeText={setEmail} placeholder="name@example.com" keyboardType="email-address" />
      <Field label="Құпиясөз" value={password} onChangeText={setPassword} placeholder="Құпиясөзді енгізіңіз" secureTextEntry={!visible} rightText={visible ? 'Жасыру' : 'Көрсету'} onRightPress={() => setVisible(!visible)} />
      <TouchableOpacity onPress={() => navigation.navigate('SetPassword')} style={styles.forgotLink}><Text style={styles.linkText}>Құпиясөзді ұмыттыңыз ба?</Text></TouchableOpacity>
      <PrimaryButton title="Кіру" onPress={handleLogin} />
      <View style={styles.bottomPrompt}><Text style={styles.promptText}>Аккаунтыңыз жоқ па? </Text><Text onPress={() => navigation.navigate('SignUp')} style={styles.linkText}>Тіркелу</Text></View>
    </AuthLayout>
  );
}

export function SignUpScreen({ navigation }: RootScreenProps<'SignUp'>) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const submit = () => {
    if (!name.trim()) {
      Alert.alert('Мәліметтерді тексеріңіз', 'Аты-жөніңізді енгізіңіз.');
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert('Мәліметтерді тексеріңіз', 'Электрондық пошта дұрыс емес. Мысалы: name@example.com');
      return;
    }
    if (!isValidPhone(phone)) {
      Alert.alert('Мәліметтерді тексеріңіз', 'Телефон нөмірін толық енгізіңіз. Мысалы: +7 701 123 45 67');
      return;
    }
    if (!isValidPassword(password)) {
      Alert.alert('Мәліметтерді тексеріңіз', 'Құпиясөз кемінде 8 таңбадан тұруы керек.');
      return;
    }
    Alert.alert('Тіркелу әзірге қолжетімсіз', 'Supabase авторизациясы қосылғаннан кейін аккаунт жасау іске қосылады.');
  };
  return (
    <AuthLayout navigation={navigation}>
      <Text style={styles.formEyebrow}>ЖАҢА АККАУНТ</Text>
      <Text style={styles.formTitle}>Тіркелу</Text>
      <Text style={styles.formSubtitle}>Өзіңіз туралы қысқаша ақпарат енгізіңіз.</Text>
      <Field label="Аты-жөні" value={name} onChangeText={setName} placeholder="Аты-жөніңіз" />
      <Field label="Электрондық пошта" value={email} onChangeText={setEmail} placeholder="name@example.com" keyboardType="email-address" />
      <Field label="Ұялы телефон" value={phone} onChangeText={setPhone} placeholder="+7 7XX XXX XX XX" keyboardType="phone-pad" />
      <Field label="Құпиясөз" value={password} onChangeText={setPassword} placeholder="Кемінде 8 таңба" secureTextEntry />
      <PrimaryButton title="Аккаунт құру" onPress={submit} />
      <View style={styles.bottomPrompt}><Text style={styles.promptText}>Аккаунтыңыз бар ма? </Text><Text onPress={() => navigation.navigate('Login')} style={styles.linkText}>Кіру</Text></View>
    </AuthLayout>
  );
}

export function SetPasswordScreen({ navigation }: RootScreenProps<'SetPassword'>) {
  const [email, setEmail] = useState('');
  const submit = () => {
    if (!isValidEmail(email)) {
      Alert.alert('Мәліметтерді тексеріңіз', 'Электрондық пошта дұрыс емес. Мысалы: name@example.com');
      return;
    }
    Alert.alert('Қалпына келтіру', 'Құпиясөзді қалпына келтіру қызметі Backend қосылғаннан кейін іске қосылады.');
  };
  return (
    <AuthLayout navigation={navigation}>
      <Text style={styles.formEyebrow}>АККАУНТ ҚАУІПСІЗДІГІ</Text>
      <Text style={styles.formTitle}>Құпиясөзді қалпына келтіру</Text>
      <Text style={styles.formSubtitle}>Тіркелген электрондық поштаңызды енгізіңіз.</Text>
      <Field label="Электрондық пошта" value={email} onChangeText={setEmail} placeholder="name@example.com" keyboardType="email-address" />
      <PrimaryButton title="Сілтеме жіберу" onPress={submit} />
    </AuthLayout>
  );
}

function AuthLayout({ children, navigation }: LayoutProps) {
  return (
    <SafeAreaView style={styles.page}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}><Text style={styles.backText}>‹  Артқа</Text></TouchableOpacity>
          <BrandMark inverse />
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field(props: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; keyboardType?: KeyboardTypeOptions; secureTextEntry?: boolean; rightText?: string; onRightPress?: () => void }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{props.label}</Text>
      <View style={styles.inputWrap}>
        <TextInput style={styles.input} value={props.value} onChangeText={props.onChangeText} placeholder={props.placeholder} placeholderTextColor="#A7AEC0" keyboardType={props.keyboardType} autoCapitalize="none" secureTextEntry={props.secureTextEntry} />
        {props.rightText ? <Text onPress={props.onRightPress} style={styles.inputAction}>{props.rightText}</Text> : null}
      </View>
    </View>
  );
}

export function PrimaryButton({ title, onPress }: { title: string; onPress: () => void }) {
  return <TouchableOpacity accessibilityRole="button" style={styles.primaryButton} onPress={onPress}><Text style={styles.primaryButtonText}>{title}</Text></TouchableOpacity>;
}
function SecondaryButton({ title, onPress }: { title: string; onPress: () => void }) {
  return <TouchableOpacity accessibilityRole="button" style={styles.secondaryButton} onPress={onPress}><Text style={styles.secondaryButtonText}>{title}</Text></TouchableOpacity>;
}

const styles = StyleSheet.create({
  splash: { flex: 1, backgroundColor: COLORS.primary, padding: 28, justifyContent: 'space-between', alignItems: 'center' },
  splashCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  brandMark: { width: 88, height: 88, borderRadius: 28, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  brandMarkInverse: { backgroundColor: COLORS.primary, width: 66, height: 66, borderRadius: 22, marginBottom: 16 },
  brandIcon: { color: COLORS.primary, fontSize: 46, fontWeight: '700' },
  brandIconInverse: { color: COLORS.white, fontSize: 36 },
  splashTitle: { color: COLORS.white, fontSize: 34, fontWeight: '800', letterSpacing: 0.3 },
  splashSubtitle: { color: '#DCE6FF', fontSize: 15, marginTop: 5 },
  splashFoot: { color: '#DCE6FF', marginBottom: 20 },
  splashButton: { backgroundColor: COLORS.white, width: '100%', paddingVertical: 16, borderRadius: 28, alignItems: 'center' },
  splashButtonText: { color: COLORS.primary, fontWeight: '800', fontSize: 16 },
  page: { flex: 1, backgroundColor: COLORS.white },
  welcomeContent: { flex: 1, alignItems: 'center', paddingHorizontal: 28, paddingTop: 38 },
  brandTitle: { color: COLORS.primary, fontSize: 27, fontWeight: '800' },
  brandSubtitle: { color: COLORS.muted, fontSize: 13, marginTop: 3 },
  welcomeIllustration: { width: 190, height: 170, borderRadius: 38, backgroundColor: COLORS.lightBlue, marginTop: 30, alignItems: 'center', justifyContent: 'center' },
  illustrationEmoji: { fontSize: 76 },
  illustrationBadge: { position: 'absolute', right: 30, bottom: 26, width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: COLORS.white },
  illustrationBadgeText: { color: COLORS.white, fontWeight: '800', fontSize: 18 },
  welcomeTitle: { fontSize: 25, lineHeight: 32, fontWeight: '800', color: COLORS.text, textAlign: 'center', marginTop: 26 },
  welcomeDescription: { fontSize: 14, lineHeight: 22, color: COLORS.muted, textAlign: 'center', marginTop: 12 },
  welcomeActions: { paddingHorizontal: 24, paddingBottom: 22 },
  primaryButton: { backgroundColor: COLORS.primary, borderRadius: 26, minHeight: 52, alignItems: 'center', justifyContent: 'center', marginTop: 14, paddingHorizontal: 20 },
  primaryButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  secondaryButton: { backgroundColor: COLORS.paleBlue, borderRadius: 26, minHeight: 52, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  secondaryButtonText: { color: COLORS.primary, fontSize: 16, fontWeight: '700' },
  guestButton: { alignItems: 'center', padding: 14 },
  guestText: { color: COLORS.muted, fontSize: 13, fontWeight: '600' },
  formContainer: { paddingHorizontal: 24, paddingTop: 14, paddingBottom: 36 },
  backButton: { paddingVertical: 12, marginBottom: 18 },
  backText: { color: COLORS.primary, fontSize: 16, fontWeight: '700' },
  formEyebrow: { color: COLORS.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginTop: 18 },
  formTitle: { color: COLORS.text, fontSize: 27, fontWeight: '800', marginTop: 8 },
  formSubtitle: { color: COLORS.muted, fontSize: 14, lineHeight: 21, marginTop: 8, marginBottom: 14 },
  fieldWrap: { marginTop: 15 },
  fieldLabel: { color: COLORS.text, fontSize: 13, fontWeight: '700', marginBottom: 8 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.lightBlue, borderColor: COLORS.border, borderWidth: 1, borderRadius: 13, paddingHorizontal: 14 },
  input: { flex: 1, minHeight: 50, color: COLORS.text, fontSize: 14 },
  inputAction: { color: COLORS.primary, fontSize: 12, fontWeight: '700', paddingLeft: 8 },
  forgotLink: { alignSelf: 'flex-end', paddingVertical: 14 },
  linkText: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
  bottomPrompt: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 },
  promptText: { color: COLORS.muted, fontSize: 13 },
});
