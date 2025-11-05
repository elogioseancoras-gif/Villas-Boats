import { apiClient } from '../client';
import type { LoginRequest, RegisterRequest, AuthResponse, UserResponse } from '@/types/api';

export class AuthService {
  /**
   * Login user with email and password
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return data;
  }

  /**
   * Register new user
   */
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', userData);
    return data;
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/refresh', { refreshToken });
    return data;
  }

  /**
   * Logout user (invalidate refresh token on backend)
   */
  static async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  }

  /**
   * Get current authenticated user profile
   */
  static async getProfile(): Promise<UserResponse> {
    const { data } = await apiClient.get<UserResponse>('/users/profile');
    return data;
  }

  /**
   * Request password reset email
   */
  static async requestPasswordReset(email: string): Promise<void> {
    await apiClient.post('/auth/password-reset/request', { email });
  }

  /**
   * Reset password with token from email
   */
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/password-reset/confirm', { token, newPassword });
  }

  /**
   * Verify email with token
   */
  static async verifyEmail(token: string): Promise<void> {
    await apiClient.post('/auth/verify-email', { token });
  }
}
