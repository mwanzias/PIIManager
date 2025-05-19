export interface Testimonial {
  id: string;
  text: string;
  email: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
} 