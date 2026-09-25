import {
  TeamRegistrationPayload,
  RegistrationResponseData,
  Announcement,
  ScheduleItem,
  TeamDetails,
  AdminStats,
  ResultItem,
  SubmissionData,
  UserSession,
  EventPaymentConfig,
  EventPaymentAudit,
} from '../types';
import { EVENT_CONFIG } from '../config/eventConfig';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('olympus_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Health
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return await res.json();
    } catch {
      return { status: 'offline' };
    }
  },

  // Auth
  login: async (email: string, password: string): Promise<{ success: boolean; token?: string; user?: UserSession; message?: string }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error during login' };
    }
  },

  getMe: async (): Promise<{ success: boolean; user?: UserSession; token?: string }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch {
      return { success: false };
    }
  },

  // Registrations
  registerTeam: async (payload: TeamRegistrationPayload): Promise<{ success: boolean; message: string; data?: RegistrationResponseData }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error during registration' };
    }
  },

  getRegistrationByCode: async (code: string): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/registrations/${encodeURIComponent(code)}`);
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message || 'Error fetching pass' };
    }
  },

  // Announcements
  getAnnouncements: async (): Promise<Announcement[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/announcements`);
      const json = await res.json();
      return json.success ? json.data : [];
    } catch {
      return [
        {
          id: 'fallback-1',
          title: 'OLYMPUS 2026 Registration is Now Open',
          content: 'Registrations are now officially live for Full Stack Development with AI and Engineer’s Got Talent. Open to all branches.',
          priority: 'HIGH',
          category: 'GENERAL',
          active: true,
          publishedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      ];
    }
  },

  createAnnouncement: async (announcement: { title: string; content: string; priority: string; category: string }) => {
    const res = await fetch(`${API_BASE_URL}/announcements`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(announcement),
    });
    return await res.json();
  },

  deleteAnnouncement: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/announcements/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await res.json();
  },

  // Schedule
  getSchedule: async (): Promise<ScheduleItem[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/schedule`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
      return (EVENT_CONFIG.defaultSchedule as ScheduleItem[]) || [];
    } catch {
      return (EVENT_CONFIG.defaultSchedule as ScheduleItem[]) || [];
    }
  },

  createScheduleItem: async (item: Partial<ScheduleItem>) => {
    const res = await fetch(`${API_BASE_URL}/schedule`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    return await res.json();
  },

  deleteScheduleItem: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/schedule/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await res.json();
  },

  // Submissions
  submitProject: async (payload: {
    teamCode?: string;
    regCode?: string;
    projectTitle: string;
    repoUrl?: string;
    liveDemoUrl?: string;
    videoUrl?: string;
    fileUrl?: string;
    notes?: string;
  }) => {
    const res = await fetch(`${API_BASE_URL}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  getAllSubmissions: async (): Promise<any[]> => {
    const res = await fetch(`${API_BASE_URL}/submissions`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    return json.success ? json.data : [];
  },

  // Results
  getResults: async (eventType?: string): Promise<ResultItem[]> => {
    try {
      const url = eventType ? `${API_BASE_URL}/results?eventType=${eventType}` : `${API_BASE_URL}/results`;
      const res = await fetch(url);
      const json = await res.json();
      return json.success ? json.data : [];
    } catch {
      return [];
    }
  },

  saveResult: async (resultData: Partial<ResultItem>) => {
    const res = await fetch(`${API_BASE_URL}/results`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(resultData),
    });
    return await res.json();
  },

  deleteResult: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/results/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await res.json();
  },

  // Admin
  getAdminStats: async (): Promise<AdminStats | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch {
      return null;
    }
  },

  getAdminRegistrations: async (search?: string, eventType?: string): Promise<TeamDetails[]> => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (eventType) params.append('eventType', eventType);

      const res = await fetch(`${API_BASE_URL}/admin/registrations?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      return json.success ? json.data : [];
    } catch {
      return [];
    }
  },

  exportRegistrationsCSV: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/export-csv`, {
      headers: getAuthHeaders(),
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `olympus_registrations_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  },

  // Events & Payment Settings (Public)
  getAllEventsPayment: async (): Promise<EventPaymentConfig[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/events/payment`);
      const json = await res.json();
      return json.success ? json.data : [];
    } catch {
      return [];
    }
  },

  getEventPayment: async (eventKey: string): Promise<EventPaymentConfig | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/events/${eventKey}/payment`);
      const json = await res.json();
      return json.success ? json.data : null;
    } catch {
      return null;
    }
  },

  // Events & Payment Settings (Admin / Super Admin)
  getAdminEventsPayment: async (): Promise<EventPaymentConfig[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/events/payment`, {
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      return json.success ? json.data : [];
    } catch {
      return [];
    }
  },

  getAdminEventPayment: async (eventId: string): Promise<EventPaymentConfig | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/events/${eventId}/payment`, {
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch {
      return null;
    }
  },

  updateEventPayment: async (eventId: string, data: Partial<EventPaymentConfig>) => {
    const res = await fetch(`${API_BASE_URL}/admin/events/${eventId}/payment`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  uploadEventQR: async (eventId: string, imageBase64: string, filename?: string) => {
    const res = await fetch(`${API_BASE_URL}/admin/events/${eventId}/payment/qr`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ imageBase64, filename }),
    });
    return await res.json();
  },

  removeEventQR: async (eventId: string) => {
    const res = await fetch(`${API_BASE_URL}/admin/events/${eventId}/payment/qr`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await res.json();
  },

  getPaymentAuditHistory: async (eventId?: string): Promise<EventPaymentAudit[]> => {
    try {
      const url = eventId && eventId !== 'all'
        ? `${API_BASE_URL}/admin/events/${eventId}/payment/history`
        : `${API_BASE_URL}/admin/events/payment/history`;
      const res = await fetch(url, { headers: getAuthHeaders() });
      const json = await res.json();
      return json.success ? json.data : [];
    } catch {
      return [];
    }
  },

  updateRegistrationPaymentStatus: async (registrationId: string, paymentStatus: string, notes?: string) => {
    const res = await fetch(`${API_BASE_URL}/admin/registrations/${registrationId}/payment-status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ paymentStatus, notes }),
    });
    return await res.json();
  },

  deleteRegistration: async (id: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/registrations/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error while deleting registration.' };
    }
  },

  getAdminUsers: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: getAuthHeaders(),
    });
    return await res.json();
  },

  createAdminUser: async (data: { email: string; name: string; password: string; role: string }) => {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  updateAdminRole: async (userId: string, role: 'SUPER_ADMIN' | 'ADMIN') => {
    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role }),
    });
    return await res.json();
  },

  toggleAdminStatus: async (userId: string) => {
    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    return await res.json();
  },

  deleteAdminUser: async (userId: string) => {
    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await res.json();
  },

  updateAdminCredentials: async (
    userId: string,
    data: { email?: string; name?: string; password?: string; role?: 'ADMIN' | 'SUPER_ADMIN' }
  ) => {
    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/credentials`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await res.json();
  },
};
