export interface IUser {
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface ITutor {
  _id: string;
  user: string;
  name: string;
  email: string;
  bio: string;
  address: string;
  hourlyRate: number;
  tutorImage: string;
  backgroundImage: string;
  phone: string;
  subject: string[];
  qualification?: string;
  rating: number;
  reviews: {
    _id: string;
    studentId: string;
    review: string;
    rating: number;
  }[];
  experience: number;
  age: number;
  bookedStudents?: string[];
  availability: {
    _id: string;
    day: string;
    timeSlots: string;
  }[];
}
