import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Параметры вкладок нижнего меню
export type MainTabParamList = {
  HomeTab: undefined;
  DoctorsTab: undefined;
  AppointmentsTab: undefined;
  ProfileTab: undefined;
};

// Все экраны приложения и параметры, которые им передаются
export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  SetPassword: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  DoctorProfile: { doctorId: string };
  Booking: { doctorId: string };
  Payment: {
    doctorId: string;
    date: string; // формат YYYY-MM-DD
    time: string; // формат HH:MM
    patientName: string;
    patientAge: number;
    patientGender: 'Male' | 'Female' | 'Other';
    problemDescription: string;
  };
  PaymentSuccess: { doctorName: string; date: string; time: string };
  EditProfile: undefined;
  Notifications: undefined;
  Chat: undefined;
  Settings: undefined;
  Favorites: undefined;
};

// Пропсы обычного экрана (из корневого стека)
export type RootScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

// Пропсы экрана-вкладки (можно переходить и на вкладки, и на экраны корневого стека)
export type TabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
