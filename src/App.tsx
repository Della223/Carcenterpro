import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer, useToast } from './components/ui/Toast';
import LoginScreen from './screens/LoginScreen';
import AppShell from './components/AppShell';
import HomeScreen from './screens/HomeScreen';
import ComercialScreen from './screens/ComercialScreen';
import DespesasScreen from './screens/DespesasScreen';
import DashboardScreen from './screens/DashboardScreen';
import DREScreen from './screens/DREScreen';
import OrcamentosScreen from './screens/OrcamentosScreen';
import RelatoriosScreen from './screens/RelatoriosScreen';
import ConfiguracoesScreen from './screens/ConfiguracoesScreen';
import PlaceholderScreen from './screens/PlaceholderScreen';
import { NAV_ITEMS, type ScreenId } from './config/navigation';

function AppContent() {
  const { user, loading } = useAuth();
  const toast = useToast();
  const [screen, setScreen] = useState<ScreenId>('home');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
          <p className="text-sm text-ink-500">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) return <LoginScreen />;

  const activeItem = NAV_ITEMS.find((item) => item.id === screen)!;

  const renderScreen = () => {
    switch (screen) {
      case 'home': return <HomeScreen />;
      case 'comercial': return <ComercialScreen />;
      case 'despesas': return <DespesasScreen />;
      case 'dashboard': return <DashboardScreen />;
      case 'dre': return <DREScreen />;
      case 'orcamentos': return <OrcamentosScreen />;
      case 'relatorios': return <RelatoriosScreen />;
      case 'configuracoes': return <ConfiguracoesScreen />;
      case 'ajuda': return <PlaceholderScreen item={activeItem} />;
      default: return <HomeScreen />;
    }
  };

  return (
    <>
      <AppShell currentScreen={screen} onNavigate={setScreen}>
        {renderScreen()}
      </AppShell>
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
