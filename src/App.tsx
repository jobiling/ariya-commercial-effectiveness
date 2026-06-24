import { useState, type CSSProperties } from 'react';
import { Route, Routes } from 'react-router-dom';
import { PasswordGate, isAuthed } from './components/auth/PasswordGate';
import { Header } from './components/layout/Header';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { Sidebar } from './components/layout/Sidebar';
import { ScenarioProvider } from './context/ScenarioContext';
import { TourProvider } from './context/TourContext';
import { DemoModeProvider } from './context/DemoModeContext';
import { DecisionLogProvider } from './context/DecisionLogContext';
import { DemoOverlay } from './components/demo/DemoOverlay';
import GMHome from './pages/GMHome';
import MorningBriefing from './pages/MorningBriefing';
import MarketPerformance from './pages/MarketPerformance';
import InvestmentRadar from './pages/InvestmentRadar';
import ExecutionSignals from './pages/ExecutionSignals';
import CustomerAccountFocus from './pages/CustomerAccountFocus';
import TrainingToSales from './pages/TrainingToSales';
import ScenarioPlanner from './pages/ScenarioPlanner';
import AskAriya from './pages/AskAriya';
import Alerts from './pages/Alerts';
import OtxWatchlist from './pages/OtxWatchlist';
import DecisionLog from './pages/DecisionLog';
import SourceConfidence from './pages/SourceConfidence';
import PilotProposal from './pages/PilotProposal';
import Sandbox from './pages/Sandbox';

const shellStyle: CSSProperties = {
  minHeight: '100vh',
  paddingLeft: 240,
  paddingTop: 90, // 64px header + 26px illustrative-data banner
  background: 'var(--color-ariya-bg)',
};

const mainStyle: CSSProperties = {
  padding: 24,
  maxWidth: 1280,
};

// Slim banner pinned directly under the header. Keeps "Illustrative data · v0.1"
// visible on every screen, independent of sidebar scroll.
const illustrativeBannerStyle: CSSProperties = {
  position: 'fixed',
  top: 64,
  left: 240,
  right: 0,
  height: 26,
  display: 'flex',
  alignItems: 'center',
  padding: '0 24px',
  background: 'var(--color-ariya-surface)',
  borderBottom: '1px solid var(--color-ariya-line)',
  color: 'var(--color-ariya-muted)',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.02em',
  zIndex: 19,
};

export default function App() {
  const [unlocked, setUnlocked] = useState(isAuthed);

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <DemoModeProvider>
      <DecisionLogProvider>
      <ScenarioProvider>
        <TourProvider>
          <ScrollToTop />
          <Sidebar />
          <Header />
          <div style={illustrativeBannerStyle}>Illustrative data · v0.1</div>
          <div style={shellStyle}>
            <main style={mainStyle}>
              <Routes>
                <Route path="/" element={<GMHome />} />
                <Route path="/morning-briefing" element={<MorningBriefing />} />
                <Route path="/market-performance" element={<MarketPerformance />} />
                <Route path="/investment-radar" element={<InvestmentRadar />} />
                <Route path="/execution-signals" element={<ExecutionSignals />} />
                <Route path="/customer-account-focus" element={<CustomerAccountFocus />} />
                <Route path="/training-to-sales" element={<TrainingToSales />} />
                <Route path="/scenario-planner" element={<ScenarioPlanner />} />
                <Route path="/ask-ariya" element={<AskAriya />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/otx-watchlist" element={<OtxWatchlist />} />
                <Route path="/decision-log" element={<DecisionLog />} />
                <Route path="/source-confidence" element={<SourceConfidence />} />
                <Route path="/pilot-proposal" element={<PilotProposal />} />
                <Route path="/sandbox" element={<Sandbox />} />
              </Routes>
            </main>
          </div>
          <DemoOverlay />
        </TourProvider>
      </ScenarioProvider>
      </DecisionLogProvider>
    </DemoModeProvider>
  );
}
