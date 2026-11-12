import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import type { TabScreenProps } from '../navigation/types';
import { COLORS } from '../constants/theme';

export function HomeScreen({ navigation }: TabScreenProps<'HomeTab'>) {
  const { doctors, userProfile, favorites } = useApp();
  const featured = doctors.slice(0, 3);
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Сәлеметсіз бе!</Text>
          <Text style={styles.name}>{userProfile.fullName || 'Қонақ'}</Text>
        </View>
        <TouchableOpacity style={styles.notification} onPress={() => navigation.navigate('Notifications')}><Text style={styles.notificationIcon}>♧</Text><View style={styles.dot} /></TouchableOpacity>
      </View>
      <View style={styles.searchBox}><Text style={styles.searchIcon}>⌕</Text><Text style={styles.searchPlaceholder}>Дәрігерді немесе қызметті іздеу</Text></View>
      <View style={styles.banner}>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTag}>SKIN FIRSTS</Text>
          <Text style={styles.bannerTitle}>Теріңізге{ '\n' }кәсіби күтім</Text>
          <Text style={styles.bannerText}>Дерматолог кеңесіне оңай жазылыңыз.</Text>
          <TouchableOpacity style={styles.bannerButton} onPress={() => navigation.navigate('DoctorsTab')}><Text style={styles.bannerButtonText}>Дәрігер табу</Text></TouchableOpacity>
        </View>
        <View style={styles.bannerArt}><Text style={styles.bannerEmoji}>🧑🏻‍⚕️</Text></View>
      </View>
      <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>Қызметтер</Text><Text style={styles.seeAll} onPress={() => navigation.navigate('DoctorsTab')}>Барлығы</Text></View>
      <View style={styles.servicesRow}>
        <Service icon="🩺" title="Дерматолог" onPress={() => navigation.navigate('DoctorsTab')} />
        <Service icon="📅" title="Жазылу" onPress={() => navigation.navigate('AppointmentsTab')} />
        <Service icon="♡" title="Таңдаулылар" onPress={() => navigation.navigate('Favorites')} />
      </View>
      <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>Ұсынылатын дәрігерлер</Text><Text style={styles.seeAll} onPress={() => navigation.navigate('DoctorsTab')}>Барлығын көру</Text></View>
      {featured.map((doctor) => (
        <TouchableOpacity key={doctor.id} style={styles.doctorCard} onPress={() => navigation.navigate('DoctorProfile', { doctorId: doctor.id })}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{doctor.name.replace('Dr. ', '').charAt(0)}</Text></View>
          <View style={{ flex: 1 }}><Text style={styles.doctorName}>{doctor.name}</Text><Text style={styles.specialty}>{doctor.specialty}</Text><Text style={styles.rating}>★ {doctor.rating}  ·  {doctor.experienceYears} жыл тәжірибе</Text></View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.note}>Медициналық ақпарат анықтамалық сипатта. Диагноз қою үшін дәрігерге жүгініңіз.</Text>
    </ScrollView>
    </SafeAreaView>
  );
}

function Service({ icon, title, onPress }: { icon: string; title: string; onPress: () => void }) {
  return <TouchableOpacity style={styles.service} onPress={onPress}><Text style={styles.serviceIcon}>{icon}</Text><Text style={styles.serviceTitle}>{title}</Text></TouchableOpacity>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background }, content: { padding: 20, paddingBottom: 32 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }, greeting: { color: COLORS.muted, fontSize: 13 }, name: { color: COLORS.text, fontSize: 21, fontWeight: '800', marginTop: 3 },
  notification: { width: 44, height: 44, borderRadius: 15, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center' }, notificationIcon: { color: COLORS.primary, fontSize: 25 }, dot: { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF7777', right: 10, top: 9 },
  searchBox: { height: 48, borderRadius: 14, backgroundColor: COLORS.white, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, marginBottom: 18 }, searchIcon: { fontSize: 25, color: COLORS.primary, marginRight: 10 }, searchPlaceholder: { color: '#A1A8B8', fontSize: 13 },
  banner: { backgroundColor: COLORS.primary, borderRadius: 22, padding: 18, flexDirection: 'row', minHeight: 180, overflow: 'hidden' }, bannerTag: { color: '#DCE6FF', fontSize: 10, fontWeight: '800', letterSpacing: 1 }, bannerTitle: { color: COLORS.white, fontSize: 23, lineHeight: 27, fontWeight: '800', marginTop: 8 }, bannerText: { color: '#E5ECFF', fontSize: 11, marginTop: 7, maxWidth: 170 }, bannerButton: { backgroundColor: COLORS.white, alignSelf: 'flex-start', paddingHorizontal: 15, paddingVertical: 9, borderRadius: 18, marginTop: 13 }, bannerButtonText: { color: COLORS.primary, fontWeight: '800', fontSize: 11 }, bannerArt: { width: 105, justifyContent: 'center', alignItems: 'center' }, bannerEmoji: { fontSize: 68 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, marginBottom: 12 }, sectionTitle: { color: COLORS.text, fontSize: 17, fontWeight: '800' }, seeAll: { color: COLORS.primary, fontSize: 11, fontWeight: '700' },
  servicesRow: { flexDirection: 'row', gap: 10 }, service: { flex: 1, backgroundColor: COLORS.white, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }, serviceIcon: { fontSize: 25, color: COLORS.primary }, serviceTitle: { color: COLORS.text, fontSize: 11, fontWeight: '700', marginTop: 9 },
  doctorCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, padding: 12, borderRadius: 16, marginBottom: 10 }, avatar: { width: 48, height: 48, borderRadius: 16, backgroundColor: COLORS.paleBlue, alignItems: 'center', justifyContent: 'center', marginRight: 12 }, avatarText: { color: COLORS.primary, fontWeight: '800', fontSize: 20 }, doctorName: { color: COLORS.text, fontWeight: '800', fontSize: 12 }, specialty: { color: COLORS.muted, fontSize: 11, marginTop: 3 }, rating: { color: COLORS.primary, fontSize: 10, marginTop: 5, fontWeight: '700' }, arrow: { color: COLORS.primary, fontSize: 27, paddingHorizontal: 5 },
  note: { color: COLORS.muted, fontSize: 10, lineHeight: 15, marginTop: 18, textAlign: 'center' },
});
