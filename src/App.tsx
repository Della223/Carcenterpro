import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import AppShell from './components/AppShell';
import LoginScreen from './screens/LoginScreen';
import BootstrapAdminScreen from './screens/BootstrapAdminScreen';
import HomeScreen from './screens/HomeScreen';
import ComercialScreen from './screens/ComercialScreen';
import DespesasScreen from './screens/DespesasScreen';
import DashboardScreen from './screens/DashboardScreen';
import DREScreen from './screens/DREScreen';
import OrcamentosScreen from './screens/OrcamentosScreen';
import RelatoriosScreen from './screens/RelatoriosScreen';
import GestaoUsuariosScreen from './screens/GestaoUsuariosScreen';
import ConfiguracoesScreen from './screens/ConfiguracoesScreen';
import PlaceholderScreen from './screens/PlaceholderScreen';
import { NAV_ITEMS, type ScreenId } from './config/navigation';

const SCREEN_COMPONENTS: Partial<Record<ScreenId, React.ComponentType>> = {
  home: HomeScreen,
  comercial: ComercialScreen,
  despesas: DespesasScreen,
  dashboard: DashboardScreen,
  dre: DREScreen,
  orcamentos: OrcamentosScreen,
  relatorios: RelatoriosScreen,
  usuarios: GestaoUsuariosScreen,
  configuracoes: ConfiguracoesScreen,
};

function AuthenticatedApp() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');

  const ScreenComponent = SCREEN_COMPONENTS[currentScreen];
  const activeItem = NAV_ITEMS.find((item) => item.id === currentScreen)!;

  return (
    <AppShell currentScreen={currentScreen} onNavigate={setCurrentScreen}>
      {ScreenComponent ? <ScreenComponent /> : <PlaceholderScreen item={activeItem} />}
    </AppShell>
  );
}

function AppContent() {
  const { user, loading, needsBootstrap, bootstrapLoading } = useAuth();

  if (loading || bootstrapLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (needsBootstrap) {
    return <BootstrapAdminScreen />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <AuthenticatedApp />;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}  
