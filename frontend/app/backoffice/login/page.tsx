'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Ship, Globe } from 'lucide-react';
import axios from 'axios';

// Simple translation object for backoffice (admin-only)
const translations = {
  en: {
    title: 'Admin Portal',
    description: 'Enter your credentials to access the backoffice',
    email: 'Email',
    emailPlaceholder: 'admin@villasboats.com',
    password: 'Password',
    loginButton: 'Sign In',
    loading: 'Loading...',
    loginError: 'Failed to sign in. Please check your credentials.',
    adminOnlyError: 'Access restricted to administrators only.',
  },
  'pt-BR': {
    title: 'Portal Administrativo',
    description: 'Digite suas credenciais para acessar o backoffice',
    email: 'E-mail',
    emailPlaceholder: 'admin@villasboats.com',
    password: 'Senha',
    loginButton: 'Entrar',
    loading: 'Carregando...',
    loginError: 'Falha ao entrar. Verifique suas credenciais.',
    adminOnlyError: 'Acesso restrito apenas a administradores.',
  },
  'pt-PT': {
    title: 'Portal Administrativo',
    description: 'Introduza as suas credenciais para aceder ao backoffice',
    email: 'E-mail',
    emailPlaceholder: 'admin@villasboats.com',
    password: 'Palavra-passe',
    loginButton: 'Iniciar Sessão',
    loading: 'A carregar...',
    loginError: 'Falha ao iniciar sessão. Verifique as suas credenciais.',
    adminOnlyError: 'Acesso restrito apenas a administradores.',
  },
  es: {
    title: 'Portal Administrativo',
    description: 'Ingrese sus credenciales para acceder al backoffice',
    email: 'Correo Electrónico',
    emailPlaceholder: 'admin@villasboats.com',
    password: 'Contraseña',
    loginButton: 'Iniciar Sesión',
    loading: 'Cargando...',
    loginError: 'Falha ao iniciar sesión. Verifique sus credenciales.',
    adminOnlyError: 'Acceso restringido solo a administradores.',
  },
};

type Language = keyof typeof translations;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState<Language>('en');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const t = translations[language];
  const redirectTo = searchParams.get('redirect') || `/${language}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', { email, password });

      // Store auth token with the key that AuthContext expects
      if (response.data.token) {
        localStorage.setItem('access_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));

        // Reload the page to reinitialize AuthContext
        window.location.href = redirectTo;
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || t.loginError;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12">
      <Container className="flex items-center justify-center">
        <Card className="w-full max-w-md border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
              <Ship className="h-6 w-6 text-blue-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">{t.title}</CardTitle>
            <CardDescription className="text-slate-400">{t.description}</CardDescription>

            {/* Language Selector */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <Globe className="h-4 w-4 text-slate-500" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="rounded-md border border-slate-600 bg-slate-700 px-2 py-1 text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="en">English</option>
                <option value="pt-BR">Português (BR)</option>
                <option value="pt-PT">Português (PT)</option>
                <option value="es">Español</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-300">
                  {t.email}
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder={t.emailPlaceholder}
                  className="border-slate-600 bg-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-300">
                  {t.password}
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="••••••••"
                  className="border-slate-600 bg-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? t.loading : t.loginButton}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}

export default function BackofficeLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
