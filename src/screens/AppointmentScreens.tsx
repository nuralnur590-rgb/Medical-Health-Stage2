import React, { useState } from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import type { RootScreenProps, TabScreenProps } from '../navigation/types';
import { formatDateKz } from '../utils/dates';

const PRIMARY_COLOR = '#2864F5';

export const AppointmentsScreen = (_props: TabScreenProps<'AppointmentsTab'>) => {
  const { appointments, cancelAppointment } = useApp();
  const [tab, setTab] = useState<'Upcoming' | 'Completed' | 'Cancelled'>('Upcoming');

  const filtered = appointments.filter((a) => a.status === tab);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 20, flex: 1 }}>
        <Text style={styles.title}>Барлық жазбалар</Text>

        <View style={styles.tabRow}>
          {([{ key: 'Upcoming', label: 'Алдағы' }, { key: 'Completed', label: 'Аяқталған' }, { key: 'Cancelled', label: 'Бас тартылған' }] as const).map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              style={[styles.tabBtn, tab === key && styles.activeTabBtn]}
              onPress={() => setTab(key)}
            >
              <Text style={[styles.tabText, tab === key && { color: '#fff' }]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {filtered.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>Бұл бөлімде әзірге жазба жоқ.</Text>
          ) : (
            filtered.map((app) => (
              <View key={app.id} style={styles.card}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{app.doctorName}</Text>
                <Text style={{ color: PRIMARY_COLOR, marginTop: 2 }}>{app.doctorSpecialty}</Text>
                <Text style={{ color: '#666', fontSize: 13, marginTop: 8 }}>📅 {formatDateKz(app.date)} | 🕒 {app.time}</Text>
                <Text style={{ color: '#333', fontSize: 13, marginTop: 4 }}>Пациент: {app.patientName}</Text>

                {tab === 'Upcoming' && (
                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                    <TouchableOpacity
                      style={[styles.smallBtn, { backgroundColor: '#FF4D4D' }]}
                      onPress={() => {
                        cancelAppointment(app.id);
                        Alert.alert('Бас тартылды', 'Қабылдау жазбасы тоқтатылды.');
                      }}
                    >
                      <Text style={styles.smallBtnText}>Бас тарту</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export const PaymentScreen = ({ route, navigation }: RootScreenProps<'Payment'>) => {
  const { doctorId, date, time, patientName, patientAge, patientGender, problemDescription } = route.params;
  const { doctors, addAppointment, addNotification } = useApp();
  const doctor = doctors.find((d) => d.id === doctorId) || doctors[0];

  const methods = ['Банк картасы', 'Apple Pay', 'PayPal', 'Google Pay'];
  const [selectedMethod, setSelectedMethod] = useState(methods[0]);
  const [submitting, setSubmitting] = useState(false);

  // Демо-оплата: деньги не списываются, запись сохраняется как оплаченная в демо-режиме.
  const handleConfirm = () => {
    if (submitting) return;
    setSubmitting(true);
    addAppointment({
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      date,
      time,
      patientName,
      patientAge,
      patientGender,
      problemDescription,
      status: 'Upcoming',
      price: doctor.price,
      paymentMethod: selectedMethod,
    });
    addNotification(
      'Жазылу расталды',
      `${doctor.name} қабылдауына ${formatDateKz(date)}, ${time} уақытына жазылдыңыз.`,
      'appointment'
    );
    navigation.replace('PaymentSuccess', { doctorName: doctor.name, date, time });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 15 }}><Text style={{ color: PRIMARY_COLOR }}>← Артқа</Text></TouchableOpacity>
        <Text style={styles.title}>Төлем әдісін таңдау</Text>
        <View style={styles.card}>
          <Text style={{ color: '#666', fontSize: 13 }}>Дәрігер</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 4 }}>{doctor.name}</Text>
          <Text style={{ color: '#666', fontSize: 13, marginTop: 8 }}>📅 {formatDateKz(date)} | 🕒 {time}</Text>
          <Text style={{ color: '#666', fontSize: 13, marginTop: 4 }}>Пациент: {patientName}</Text>
          <Text style={{ color: PRIMARY_COLOR, fontWeight: 'bold', fontSize: 20, marginTop: 14 }}>{doctor.price} $</Text>
        </View>
        {methods.map((method) => (
          <TouchableOpacity key={method} onPress={() => setSelectedMethod(method)} style={[styles.card, { flexDirection: 'row', justifyContent: 'space-between', borderWidth: selectedMethod === method ? 1 : 0, borderColor: PRIMARY_COLOR }]}>
            <Text style={{ fontWeight: '600', color: '#333' }}>{method}</Text>
            <Text style={{ color: PRIMARY_COLOR, fontWeight: 'bold' }}>{selectedMethod === method ? '●' : '○'}</Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.demoNote}>
          Бұл — демо-төлем. Нақты ақша есептен шығарылмайды, банк картасының деректері сұралмайды.
        </Text>
        <TouchableOpacity style={[styles.payBtn, submitting && { opacity: 0.6 }]} onPress={handleConfirm} disabled={submitting}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Демо-төлемді растау</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export const PaymentSuccessScreen = ({ route, navigation }: RootScreenProps<'PaymentSuccess'>) => {
  const { doctorName, date, time } = route.params;
  return (
    <SafeAreaView style={[styles.container, styles.successScreen]}>
      <View style={styles.checkCircle}>
        <Text style={{ color: PRIMARY_COLOR, fontSize: 44, fontWeight: 'bold' }}>✓</Text>
      </View>
      <Text style={styles.successTitle}>Жазылу расталды!</Text>
      <Text style={styles.successText}>Демо-төлем сәтті өтті. Нақты ақша есептен шығарылған жоқ.</Text>
      <View style={styles.successCard}>
        <Text style={styles.successCardLabel}>Сіз жазылдыңыз:</Text>
        <Text style={styles.successCardDoctor}>{doctorName}</Text>
        <Text style={styles.successCardLabel}>📅 {formatDateKz(date)}   🕒 {time}</Text>
      </View>
      <TouchableOpacity
        style={styles.whiteBtn}
        onPress={() => navigation.reset({ index: 0, routes: [{ name: 'MainTabs', params: { screen: 'AppointmentsTab' } }] })}
      >
        <Text style={{ color: PRIMARY_COLOR, fontWeight: 'bold', fontSize: 16 }}>Менің жазбаларым</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FC' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  tabRow: { flexDirection: 'row', backgroundColor: '#E0E8FF', borderRadius: 20, padding: 4, marginBottom: 15 },
  tabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 16 },
  activeTabBtn: { backgroundColor: PRIMARY_COLOR },
  tabText: { fontWeight: 'bold', fontSize: 13, color: '#666' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 12 },
  smallBtn: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 12 },
  smallBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  demoNote: { color: '#666', fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 6 },
  payBtn: { backgroundColor: PRIMARY_COLOR, paddingVertical: 14, borderRadius: 25, alignItems: 'center', marginTop: 20 },
  successScreen: { backgroundColor: PRIMARY_COLOR, alignItems: 'center', justifyContent: 'center', padding: 24 },
  checkCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  successTitle: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginTop: 24 },
  successText: { color: '#DCE6FF', fontSize: 14, textAlign: 'center', marginTop: 8 },
  successCard: { borderWidth: 1, borderColor: '#9DB8FF', borderRadius: 16, padding: 16, marginTop: 28, alignSelf: 'stretch', alignItems: 'center' },
  successCardLabel: { color: '#DCE6FF', fontSize: 13, marginTop: 4 },
  successCardDoctor: { color: '#fff', fontSize: 17, fontWeight: 'bold', marginTop: 4 },
  whiteBtn: { backgroundColor: '#fff', paddingVertical: 14, paddingHorizontal: 50, borderRadius: 25, marginTop: 40 },
});