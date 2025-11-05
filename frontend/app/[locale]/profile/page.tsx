'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { UserService } from '@/lib/api/services/user.service';
import type { Language } from '@/types/api';
import { User, Lock, Trash2 } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const t = useTranslations('profile');
  const tCommon = useTranslations('common');
  const { user, loading: authLoading, refreshUser, logout } = useAuth();

  // Profile form state
  const [profileData, setProfileData] = useState({
    fullName: '',
    phoneNumber: '',
    preferredLanguage: 'en' as Language,
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Delete account state
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/profile');
    }
  }, [authLoading, user, router]);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName,
        phoneNumber: user.phoneNumber || '',
        preferredLanguage: user.preferredLanguage,
      });
    }
  }, [user]);

  // Show loading state
  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 py-12">
        <Container>
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground">{tCommon('loading')}</p>
          </div>
        </Container>
      </div>
    );
  }

  const handleProfileChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setProfileLoading(true);

    try {
      await UserService.updateProfile({
        fullName: profileData.fullName,
        phoneNumber: profileData.phoneNumber || undefined,
        preferredLanguage: profileData.preferredLanguage,
      });
      await refreshUser();
      setProfileSuccess(t('profileUpdateSuccess'));
    } catch (err: any) {
      console.error('Profile update error:', err);
      setProfileError(err.response?.data?.message || t('profileUpdateError'));
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError(t('passwordMismatch'));
      return;
    }

    // Validate password length
    if (passwordData.newPassword.length < 8) {
      setPasswordError(t('passwordTooShort'));
      return;
    }

    setPasswordLoading(true);

    try {
      await UserService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordSuccess(t('passwordChangeSuccess'));
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      console.error('Password change error:', err);
      setPasswordError(err.response?.data?.message || t('passwordChangeError'));
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== user.email) {
      return;
    }

    setDeleteLoading(true);

    try {
      await UserService.deleteAccount();
      await logout();
    } catch (err: any) {
      console.error('Delete account error:', err);
      alert(t('deleteAccountError'));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 py-12">
      <Container className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {t('profileTab')}
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              {t('passwordTab')}
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              {t('accountTab')}
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>{t('profileTitle')}</CardTitle>
                <CardDescription>{t('profileDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  {profileError && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                      {profileError}
                    </div>
                  )}
                  {profileSuccess && (
                    <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600">
                      {profileSuccess}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      {t('email')}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">{t('emailHint')}</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium">
                      {t('fullName')}
                    </label>
                    <Input
                      id="fullName"
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => handleProfileChange('fullName', e.target.value)}
                      required
                      disabled={profileLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phoneNumber" className="text-sm font-medium">
                      {t('phoneNumber')}
                    </label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={profileData.phoneNumber}
                      onChange={(e) => handleProfileChange('phoneNumber', e.target.value)}
                      disabled={profileLoading}
                      placeholder="+351 912 345 678"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="preferredLanguage" className="text-sm font-medium">
                      {t('preferredLanguage')}
                    </label>
                    <Select
                      value={profileData.preferredLanguage}
                      onValueChange={(value) => handleProfileChange('preferredLanguage', value)}
                      disabled={profileLoading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="pt-PT">Português (Portugal)</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('role')}</label>
                    <Input
                      type="text"
                      value={user.role}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <Button type="submit" disabled={profileLoading}>
                    {profileLoading ? tCommon('loading') : t('saveProfile')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Password Tab */}
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>{t('passwordTitle')}</CardTitle>
                <CardDescription>{t('passwordDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  {passwordError && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                      {passwordError}
                    </div>
                  )}
                  {passwordSuccess && (
                    <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600">
                      {passwordSuccess}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="currentPassword" className="text-sm font-medium">
                      {t('currentPassword')}
                    </label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      required
                      disabled={passwordLoading}
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="newPassword" className="text-sm font-medium">
                      {t('newPassword')}
                    </label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      required
                      disabled={passwordLoading}
                      placeholder="••••••••"
                      minLength={8}
                    />
                    <p className="text-xs text-muted-foreground">{t('passwordHint')}</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                      {t('confirmPassword')}
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      required
                      disabled={passwordLoading}
                      placeholder="••••••••"
                      minLength={8}
                    />
                  </div>

                  <Button type="submit" disabled={passwordLoading}>
                    {passwordLoading ? tCommon('loading') : t('changePassword')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account">
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">{t('deleteAccountTitle')}</CardTitle>
                <CardDescription>{t('deleteAccountDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md bg-destructive/10 p-4">
                  <p className="text-sm text-destructive font-medium mb-2">
                    {t('deleteAccountWarning')}
                  </p>
                  <ul className="list-disc list-inside text-sm text-destructive/80 space-y-1">
                    <li>{t('deleteWarning1')}</li>
                    <li>{t('deleteWarning2')}</li>
                    <li>{t('deleteWarning3')}</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <label htmlFor="deleteConfirm" className="text-sm font-medium">
                    {t('deleteConfirmLabel', { email: user.email })}
                  </label>
                  <Input
                    id="deleteConfirm"
                    type="text"
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    placeholder={user.email}
                    disabled={deleteLoading}
                  />
                </div>

                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirm !== user.email || deleteLoading}
                  className="w-full"
                >
                  {deleteLoading ? tCommon('loading') : t('deleteAccountButton')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
}
