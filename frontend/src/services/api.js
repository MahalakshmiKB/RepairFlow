/**
 * Centralized API service for communicating with the Spring Boot backend.
 * Uses Fetch API, handles non-2xx statuses, and formats error responses.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);

    // 204 No Content
    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      let errorMessage = 'An error occurred while contacting the server.';
      let fieldErrors = null;

      if (data && typeof data === 'object') {
        if (data.message) errorMessage = data.message;
        if (data.errors)  fieldErrors = data.errors;
      }

      const error = new Error(errorMessage);
      error.status = response.status;
      error.fieldErrors = fieldErrors;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const netError = new Error('Unable to connect to the backend server. Please verify that Spring Boot is running on port 8080.');
      netError.isNetworkError = true;
      throw netError;
    }
    throw err;
  }
}

export const api = {
  // Staff – Dashboard
  getDashboardStats: () => request('/api/dashboard/stats'),

  // Staff – Repairs (CRUD)
  getRepairs: ({ search = '', status = '', page = 0, size = 10, sortBy = 'createdAt', direction = 'desc' } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    params.append('page', page);
    params.append('size', size);
    params.append('sortBy', sortBy);
    params.append('direction', direction);
    return request(`/api/repairs?${params.toString()}`);
  },

  getRepairById: (id) => request(`/api/repairs/${id}`),

  createRepair: (data) => request('/api/repairs', { method: 'POST', body: JSON.stringify(data) }),

  updateRepair: (id, data) => request(`/api/repairs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  updateStatus: (id, { status, note }) => request(`/api/repairs/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, note })
  }),

  deleteRepair: (id) => request(`/api/repairs/${id}`, { method: 'DELETE' }),

  getStatusHistory: (id) => request(`/api/repairs/${id}/history`),

  // Public Repair Tracking (no auth required)
  getTracking: (trackingId) => request(`/api/tracking/${encodeURIComponent(trackingId.trim())}`),
};

export default api;
