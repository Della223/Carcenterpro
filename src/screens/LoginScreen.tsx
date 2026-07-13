import { useState } from 'react';
import { ShieldCheck, TrendingUp, Lock, Mail, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Mode = 'login' | 'recovery';

export default function LoginScreen() {
  const { signIn, resetPassword } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        const { error: signInError } = await signIn(email, password);
        if (signInError) setError(signInError);
      } else {
        const { error: recoveryError } = await resetPassword(email);
        if (recoveryError) setError(recoveryError);
        else setRecoverySent(true);
      }
    } catch {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-ink-50">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white p-1.5 ring-1 ring-white/20">
              <img src="/logo-symbol.png" alt="CarCenter" className="h-full w-full object-contain" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">CarCenter PRO Finance</p>
              <p className="text-xs text-primary-200 font-medium">Centro de Inteligência Empresarial</p>
            </div>
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight tracking-tight">
              Gestão financeira<br />de ponta a ponta<br />para o seu centro automotivo.
            </h1>
            <p className="text-primary-200 text-lg max-w-md">
              Controle completo de receitas, despesas, comissões, veículos e muito
