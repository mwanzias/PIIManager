import { Testimonial } from '../types/testimonial';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

export const testimonialService = {
  // Get all approved testimonials
  getApprovedTestimonials: async (page: number = 1, limit: number = 3): Promise<{ testimonials: Testimonial[]; total: number }> => {
    const response = await fetch(`${API_BASE_URL}/testimonials?status=approved&page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch testimonials');
    }
    return response.json();
  },

  // Get pending testimonials for moderation
  getPendingTestimonials: async (): Promise<Testimonial[]> => {
    const response = await fetch(`${API_BASE_URL}/testimonials?status=pending`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch pending testimonials');
    }
    return response.json();
  },

  // Submit a new testimonial
  submitTestimonial: async (text: string): Promise<Testimonial> => {
    const response = await fetch(`${API_BASE_URL}/testimonials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      throw new Error('Failed to submit testimonial');
    }
    return response.json();
  },

  // Moderate a testimonial
  moderateTestimonial: async (id: string, action: 'approve' | 'reject'): Promise<Testimonial> => {
    const response = await fetch(`${API_BASE_URL}/testimonials/${id}/moderate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ action }),
    });
    if (!response.ok) {
      throw new Error('Failed to moderate testimonial');
    }
    return response.json();
  },
}; 