import { apiClient } from '../client';
import type { UserResponse, Language } from '@/types/api';

export interface UpdateProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  preferredLanguage?: Language;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export class UserService {
  /**
   * Get current user profile
   */
  static async getProfile(): Promise<UserResponse> {
    const { data } = await apiClient.get<UserResponse>('/users/profile');
    return data;
  }

  /**
   * Update current user profile
   */
  static async updateProfile(updates: UpdateProfileRequest): Promise<UserResponse> {
    const { data } = await apiClient.put<UserResponse>('/users/profile', updates);
    return data;
  }

  /**
   * Change password
   */
  static async changePassword(passwords: ChangePasswordRequest): Promise<void> {
    await apiClient.put('/users/profile/password', passwords);
  }

  /**
   * Delete account
   */
  static async deleteAccount(): Promise<void> {
    await apiClient.delete('/users/profile');
  }

  /**
   * Get user by ID (admin only)
   */
  static async getUserById(id: string): Promise<UserResponse> {
    const { data } = await apiClient.get<UserResponse>(`/users/${id}`);
    return data;
  }

  /**
   * Get all users (admin only)
   */
  static async getAllUsers(): Promise<UserResponse[]> {
    const { data } = await apiClient.get<UserResponse[]>('/users');
    return data;
  }

  /**
   * Update user status (admin only)
   */
  static async updateUserStatus(id: string, isActive: boolean): Promise<UserResponse> {
    const { data } = await apiClient.put<UserResponse>(`/users/${id}/status`, { isActive });
    return data;
  }
}
