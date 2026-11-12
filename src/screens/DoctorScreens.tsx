import React, { useState } from 'react';
import {Alert, View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import type { RootScreenProps, TabScreenProps } from '../navigation/types';
import { getNextDays } from '../utils/dates';

const PRIMARY_COLOR = '#2864F5';

export const DoctorsScreen = ({ navigation }: TabScreenProps<'DoctorsTab'>) => {
  const { doctors, favorites, toggleFavorite } = useApp();
  const [filter, setFilter] = useState<'All' | 'Female' | 'Male'>('All');

  const filteredDoctors = doctors.filter((doc) => {
    if (filter === 'All') return true;
    return doc.gender === filter;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 20 }}>
        <Text style={styles.title}>Дәрігерлер тізімі</Text>
        <View style={styles.filterRow}>
          {([{ key: 'All', label: 'Барлығы' }, { key: 'Female', label: 'Әйел' }, { key: 'Male', label: 'Ер' }] as const).map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              style={[styles.filterChip, filter === key && styles.activeFilterChip]}
              onPress={() => setFilter(key)}
            >
              <Text style={[styles.filterText, filter === key && { color: '#fff' }]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredDoctors.map((doc) => (
            <TouchableOpacity
              key={doc.id}
              style={styles.card}
              onPress={() => navigation.navigate('DoctorProfile', { doctorId: doc.id })}
            >
              <Image source={{ uri: doc.avatar }} style={styles.avatar} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.docName}>{doc.name}</Text>
                <Text style={styles.docSpecialty}>{doc.specialty}</Text>
                <Text style={{ color: PRIMARY_COLOR, fontWeight: 'bold', marginTop: 4 }}>⭐ {doc.rating} | ${doc.price}</Text>
              </View>
              <TouchableOpacity onPress={() => toggleFavorite(doc.id)}>
                <Text style={{ fontSize: 22 }}>{favorites.includes(doc.id) ? '❤️' : '🤍'}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export const FavoritesScreen = ({ navigation }: RootScreenProps<'Favorites'>) => {
  const { doctors, favorites, toggleFavorite } = useApp();
  const favoriteDoctors = doctors.filter((doctor) => favorites.includes(doctor.id));
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 20, flex: 1 }}>
        <Text style={styles.title}>Таңдаулы дәрігерлер</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {favoriteDoctors.length === 0 ? (
            <Text style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>Таңдаулы дәрігерлер тізімі әзірге бос.</Text>
          ) : favoriteDoctors.map((doctor) => (
            <View key={doctor.id} style={styles.card}>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }} onPress={() => navigation.navigate('DoctorProfile', { doctorId: doctor.id })}>
                <Image source={{ uri: doctor.avatar }} style={styles.avatar} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.docName}>{doctor.name}</Text>
                  <Text style={styles.docSpecialty}>{doctor.specialty}</Text>
                  <Text style={{ color: PRIMARY_COLOR, marginTop: 4 }}>★ {doctor.rating}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleFavorite(doctor.id)}><Text style={{ fontSize: 22 }}>❤️</Text></TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export const DoctorProfileScreen = ({ route, navigation }: RootScreenProps<'DoctorProfile'>) => {
  const { doctorId } = route.params;
  const { doctors } = useApp();
  const doctor = doctors.find((d) => d.id === doctorId) || doctors[0];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 15 }}>
          <Text style={{ color: PRIMARY_COLOR, fontSize: 16 }}>← Артқа</Text>
        </TouchableOpacity>

        <View style={styles.profileHeader}>
          <Image source={{ uri: doctor.avatar }} style={styles.largeAvatar} />
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginTop: 10 }}>{doctor.name}</Text>
          <Text style={{ color: PRIMARY_COLOR, fontSize: 15, marginTop: 2 }}>{doctor.specialty}</Text>
          <Text style={{ color: '#666', marginTop: 4 }}>{doctor.experienceYears} жыл тәжірибе</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Дәрігер туралы</Text>
          <Text style={styles.bodyText}>{doctor.about}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Кәсіби тәжірибесі</Text>
          <Text style={styles.bodyText}>{doctor.careerPath}</Text>
        </View>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('Booking', { doctorId: doctor.id })}
        >
          <Text style={styles.btnText}>Қабылдауға жазылу ({doctor.price} $)</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export const BookingScreen = ({ route, navigation }: RootScreenProps<'Booking'>) => {
  const { doctorId } = route.params;
  const { doctors, appointments, userProfile } = useApp();
  const doctor = doctors.find((d) => d.id === doctorId) || doctors[0];

  const days = getNextDays(7);
  const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00'];

  const [selectedDate, setSelectedDate] = useState(days[0].iso);
  const [selectedTime, setSelectedTime] = useState(timeSlots[2]);
  const [patientName, setPatientName] = useState(
    userProfile.email ? userProfile.fullName : ''
  );
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [problem, setProblem] = useState('');

  const genderOptions = [
    { key: 'Male', label: 'Ер' },
    { key: 'Female', label: 'Әйел' },
    { key: 'Other', label: 'Басқа' },
  ] as const;

  const handleProceedToPayment = () => {
    const ageNumber = Number(age);
    if (!patientName.trim()) {
      Alert.alert('Мәліметтерді тексеріңіз', 'Пациенттің аты-жөнін енгізіңіз.');
      return;
    }
    if (!Number.isInteger(ageNumber) || ageNumber < 1 || ageNumber > 120) {
      Alert.alert('Мәліметтерді тексеріңіз', 'Жасты 1-ден 120-ға дейінгі сан түрінде енгізіңіз.');
      return;
    }
    if (problem.trim().length < 5) {
      Alert.alert('Мәліметтерді тексеріңіз', 'Мәселеңізді кемінде 5 таңбамен сипаттаңыз.');
      return;
    }
    const alreadyBooked = appointments.some(
      (a) =>
        a.status === 'Upcoming' &&
        a.doctorId === doctor.id &&
        a.date === selectedDate &&
        a.time === selectedTime
    );
    if (alreadyBooked) {
      Alert.alert('Уақыт бос емес', 'Бұл дәрігерге осы уақытқа жазылып қойғансыз. Басқа уақытты таңдаңыз.');
      return;
    }
    navigation.navigate('Payment', {
      doctorId: doctor.id,
      date: selectedDate,
      time: selectedTime,
      patientName: patientName.trim(),
      patientAge: ageNumber,
      patientGender: gender,
      problemDescription: problem.trim(),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 15 }}>
          <Text style={{ color: PRIMARY_COLOR, fontSize: 16 }}>← Артқа</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Кесте және мәліметтер</Text>
        <Text style={{ fontSize: 16, color: PRIMARY_COLOR, fontWeight: 'bold', marginBottom: 15 }}>{doctor.name}</Text>

        <Text style={styles.sectionTitle}>Күнді таңдаңыз</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          {days.map((day) => (
            <TouchableOpacity
              key={day.iso}
              style={[styles.dayChip, selectedDate === day.iso && styles.activeTimeChip]}
              onPress={() => setSelectedDate(day.iso)}
            >
              <Text style={[styles.dayWeekday, selectedDate === day.iso && { color: '#fff' }]}>{day.weekday}</Text>
              <Text style={[styles.dayNumber, selectedDate === day.iso && { color: '#fff' }]}>{day.day}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Қолжетімді уақыт</Text>
        <View style={styles.timeGrid}>
          {timeSlots.map((slot) => (
            <TouchableOpacity
              key={slot}
              style={[styles.timeChip, selectedTime === slot && styles.activeTimeChip]}
              onPress={() => setSelectedTime(slot)}
            >
              <Text style={[styles.timeText, selectedTime === slot && { color: '#fff' }]}>{slot}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Пациент туралы мәлімет</Text>
        <Text style={styles.label}>Аты-жөні</Text>
        <TextInput style={styles.input} value={patientName} onChangeText={setPatientName} placeholder="Аты-жөні" />

        <Text style={styles.label}>Жасы</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={age} onChangeText={setAge} placeholder="Мысалы: 30" />

        <Text style={styles.label}>Жынысы</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {genderOptions.map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              style={[styles.filterChip, { marginRight: 0 }, gender === key && styles.activeFilterChip]}
              onPress={() => setGender(key)}
            >
              <Text style={[styles.filterText, gender === key && { color: '#fff' }]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Мәселеңізді сипаттаңыз</Text>
        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
          multiline
          placeholder="Белгілеріңізді немесе тері мәселесін сипаттаңыз..."
          value={problem}
          onChangeText={setProblem}
        />

        <TouchableOpacity style={styles.primaryBtn} onPress={handleProceedToPayment}>
          <Text style={styles.btnText}>Төлем әдісін таңдау</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FC' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  card: { flexDirection: 'row', backgroundColor: '#fff', padding: 14, borderRadius: 16, marginBottom: 12, alignItems: 'center' },
  avatar: { width: 55, height: 55, borderRadius: 27.5 },
  largeAvatar: { width: 100, height: 100, borderRadius: 50 },
  docName: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  docSpecialty: { color: '#666', fontSize: 13, marginTop: 2 },
  filterRow: { flexDirection: 'row', marginBottom: 15 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', marginRight: 10 },
  activeFilterChip: { backgroundColor: PRIMARY_COLOR },
  filterText: { fontWeight: 'bold', color: '#333' },
  profileHeader: { alignItems: 'center', marginBottom: 20 },
  section: { backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  bodyText: { color: '#666', lineHeight: 20 },
  primaryBtn: { backgroundColor: PRIMARY_COLOR, paddingVertical: 14, borderRadius: 25, alignItems: 'center', marginTop: 15 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  timeChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#DDD' },
  activeTimeChip: { backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR },
  timeText: { fontSize: 12, fontWeight: 'bold', color: '#333' },
  dayChip: { width: 52, paddingVertical: 10, marginRight: 8, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: '#DDD', alignItems: 'center' },
  dayWeekday: { fontSize: 11, color: '#666', fontWeight: 'bold' },
  dayNumber: { fontSize: 18, color: '#333', fontWeight: 'bold', marginTop: 2 },
  label: { fontSize: 13, color: '#666', marginTop: 10, marginBottom: 4 },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E0E0E0' },
});