import type { CSSProperties } from 'react';
import { Route, Routes } from 'react-router-dom';
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
import DecisionLog from './pages/DecisionLog';
import SourceConfidence from './pages/SourceConfidence';
import PilotProposal from './pages/PilotProposal';
import Sandbox from './pages/Sandbox';

const shellStyle: CSSProperties = {
  minHeight: '100vh',
  paddingLeft: 240,
  paddingTop: 64,
  background: 'var(--color-ariya-bg)',
};

const mainStyle: CSSProperties = {
  padding: 24,
  maxWidth: 1280,
};

export default function App() {
  return (
    <DemoModeProvider>
      <DecisionLogProvider>
      <ScenarioProvider>
        <TourProvider>
          <ScrollToTop />
          <Sidebar />
          <Header />
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
