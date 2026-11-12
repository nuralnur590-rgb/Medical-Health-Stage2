export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  price: number;
  about: string;
  careerPath: string;
  gender: 'Male' | 'Female';
  avatar: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string; // формат YYYY-MM-DD
  time: string; // формат HH:MM
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  problemDescription: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  price: number;
  paymentMethod: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'appointment' | 'system' | 'update';
  isRead: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  time: string;
  isDoctor: boolean;
}