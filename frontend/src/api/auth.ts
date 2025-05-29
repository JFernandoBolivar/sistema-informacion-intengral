interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export const authApi = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Error de autenticación');
    }

    const data = await response.json();
    localStorage.setItem('auth_token', data.token);
    return data;
  },

  async logout(): Promise<void> {
    const token = localStorage.getItem('auth_token');
    if (token) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
    }
    localStorage.removeItem('auth_token');
  }
};

