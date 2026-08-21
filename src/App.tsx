import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { DriverDetailPage, EventDetailPage, LeagueDetailPage, PlayerDetailPage, TeamDetailPage } from '@/pages/Details';
import { CollectablesPage } from '@/pages/CollectablesPage';
import { ExplorePage } from '@/pages/Explore';
import { FavoritesPage } from '@/pages/Favorites';
import { GaragePage } from '@/pages/Garage';
import { HomePage } from '@/pages/Home';
import { LivePage } from '@/pages/Live';
import { OnboardingPage } from '@/pages/Onboarding';
import { SchedulePage } from '@/pages/Schedule';
import { SettingsPage } from '@/pages/Settings';
import { WelcomePage } from '@/pages/Welcome';
import { SportsDataProvider } from '@/providers/SportsDataContext';
import { usePrefsStore } from '@/state/stores';

export default function App() {
  return (
    <SportsDataProvider>
      <Routes>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route element={<AppShell />}>
          <Route path="/" element={<HomeGate />} />
          <Route path="/live" element={<LivePage />} />
          <Route path="/garage" element={<GaragePage />} />
          <Route path="/collectables" element={<CollectablesPage />} />
          <Route path="/collection" element={<Navigate to="/collectables" replace />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/event/:id" element={<EventDetailPage />} />
          <Route path="/team/:id" element={<TeamDetailPage />} />
          <Route path="/player/:id" element={<PlayerDetailPage />} />
          <Route path="/driver/:id" element={<DriverDetailPage />} />
          <Route path="/league/:id" element={<LeagueDetailPage />} />
          <Route path="/card/:id" element={<CollectablesPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SportsDataProvider>
  );
}

function HomeGate() {
  const onboarded = usePrefsStore((s) => s.onboardingComplete);
  if (!onboarded) return <Navigate to="/welcome" replace />;
  return <HomePage />;
}
