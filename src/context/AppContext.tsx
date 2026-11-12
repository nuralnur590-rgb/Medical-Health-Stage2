import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Doctor, Appointment, NotificationItem, ChatMessage } from '../types';

interface AppContextType {
  userProfile: {
    fullName: string;
    email: string;
    phone: string;
    dob: string;
  };
  updateProfile: (profile: { fullName: string; email: string; phone: string; dob: string }) => void;
  doctors: Doctor[];
  favorites: string[];
  toggleFavorite: (doctorId: string) => void;
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  cancelAppointment: (id: string) => void;
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  addNotification: (title: string, message: string, type: NotificationItem['type']) => void;
  signOut: () => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => void;
}

const initialDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Olivia Turner, M.D.',
    title: 'Кәсіби дерматолог',
    specialty: 'Дерматоэндокринология',
    rating: 4.9,
    reviewsCount: 60,
    experienceYears: 15,
    price: 80,
    about: 'Гормондық тері өзгерістері, безеу және фотодерматит бойынша кеңес береді.',
    careerPath: 'Дерматология саласында 10 жылдық тәжірибесі бар.',
    gender: 'Female',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300',
  },
  {
    id: '2',
    name: 'Dr. Alexander Bennett, Ph.D.',
    title: 'Кәсіби дерматолог',
    specialty: 'Дерматогенетика',
    rating: 4.8,
    reviewsCount: 40,
    experienceYears: 12,
    price: 70,
    about: 'Тұқым қуалайтын тері аурулары мен сирек кездесетін жағдайлар бойынша маман.',
    careerPath: 'Медициналық генетика саласында ғылыми тәжірибесі бар.',
    gender: 'Male',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300',
  },
  {
    id: '3',
    name: 'Dr. Sophia Martinez, Ph.D.',
    title: 'Кәсіби дерматолог',
    specialty: 'Эстетикалық дерматология',
    rating: 4.9,
    reviewsCount: 150,
    experienceYears: 10,
    price: 90,
    about: 'Инвазивті емес косметологиялық процедуралар мен теріні жасарту бойынша маман.',
    careerPath: 'Эстетикалық клиникаларда кеңес беру тәжірибесі бар.',
    gender: 'Female',
    avatar: 'https://images.unsplash.com/photo-1594824813566-7885a3977336?w=300',
  },
  {
    id: '4',
    name: 'Dr. Michael Davidson, M.D.',
    title: 'Кәсіби дерматолог',
    specialty: 'Дерматология',
    rating: 4.7,
    reviewsCount: 90,
    experienceYears: 8,
    price: 65,
    about: 'Псориаз және жергілікті емдеу тәсілдері бойынша маман.',
    careerPath: 'Дерматологиялық емдеу әдістерін қолдану тәжірибесі бар.',
    gender: 'Male',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300',
  },
];

const initialAppointments: Appointment[] = [];

const initialNotifications: NotificationItem[] = [];

const initialChatMessages: ChatMessage[] = [];

const GUEST_PROFILE = {
  fullName: 'Қонақ пайдаланушы',
  email: '',
  phone: '',
  dob: '',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState(GUEST_PROFILE);

  const [doctors] = useState<Doctor[]>(initialDoctors);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);

  const updateProfile = (profile: { fullName: string; email: string; phone: string; dob: string }) => {
    setUserProfile(profile);
  };

  const toggleFavorite = (doctorId: string) => {
    setFavorites((prev) =>
      prev.includes(doctorId) ? prev.filter((id) => id !== doctorId) : [...prev, doctorId]
    );
  };

  const addAppointment = (appData: Omit<Appointment, 'id'>) => {
    const newApp: Appointment = {
      ...appData,
      id: `app-${Date.now()}`,
    };
    setAppointments((prev) => [newApp, ...prev]);
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'Cancelled' as const } : app))
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const addNotification = (title: string, message: string, type: NotificationItem['type']) => {
    const item: NotificationItem = {
      id: `n-${Date.now()}`,
      title,
      message,
      time: 'Қазір',
      type,
      isRead: false,
    };
    setNotifications((prev) => [item, ...prev]);
  };

  // Выход: очищаем все локальные данные пользователя.
  // Когда подключим Supabase, здесь же будет supabase.auth.signOut().
  const signOut = () => {
    setUserProfile(GUEST_PROFILE);
    setFavorites([]);
    setAppointments([]);
    setNotifications([]);
    setChatMessages([]);
  };

  const sendChatMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'user',
      text,
      time: 'Қазір',
      isDoctor: false,
    };
    setChatMessages((prev) => [...prev, newMessage]);
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        updateProfile,
        doctors,
        favorites,
        toggleFavorite,
        appointments,
        addAppointment,
        cancelAppointment,
        notifications,
        markNotificationAsRead,
        addNotification,
        signOut,
        chatMessages,
        sendChatMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};