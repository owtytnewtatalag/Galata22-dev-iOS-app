const STORAGE_KEYS = {
  USER: 'qauth_user',
  TOKEN: 'qauth_token',
  QR_REQUESTS: 'qauth_qr_requests',
} as const;

export const storage = {
  getUser: (): any => {
    try {
      const user = localStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  setUser: (user: any): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  removeUser: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  setToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  },

  getQRRequests: (): any[] => {
    try {
      const requests = localStorage.getItem(STORAGE_KEYS.QR_REQUESTS);
      return requests ? JSON.parse(requests) : [];
    } catch {
      return [];
    }
  },

  setQRRequests: (requests: any[]): void => {
    localStorage.setItem(STORAGE_KEYS.QR_REQUESTS, JSON.stringify(requests));
  },

  addQRRequest: (request: any): void => {
    const requests = storage.getQRRequests();
    requests.push(request);
    storage.setQRRequests(requests);
  },

  updateQRRequest: (requestId: string, updates: Partial<any>): void => {
    const requests = storage.getQRRequests();
    const index = requests.findIndex(req => req.id === requestId);
    if (index !== -1) {
      requests[index] = { ...requests[index], ...updates };
      storage.setQRRequests(requests);
    }
  },
};