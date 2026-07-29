import { Route, Routes } from 'react-router-dom';
import './App.css';
import { MainLayout } from './layouts/MainLayout';
import { HomeView } from './features/home/views/HomeView';
import { TimerView } from './features/timer/views/TimerView';
import { TournamentView } from './features/tournament/views/TournamentView';
import { NewTournamentView } from './features/tournament/views/NewTournamentView';
import { EditTournamentView } from './features/tournament/views/EditTournamentView';
import { TournamentSummaryView } from './features/tournament/views/TournamentSummaryView';
import { CashGameView } from './features/cashgame/views/CashGameView';
import { NewCashGameView } from './features/cashgame/views/NewCashGameView';
import { EditCashGameView } from './features/cashgame/views/EditCashGameView';
import { CashGameActiveView } from './features/cashgame/views/CashGameActiveView.tsx';
import { CashGameSummaryView } from './features/cashgame/views/CashGameSummaryView';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/timer" element={<TimerView />} />
        <Route path="/tournaments" element={<TournamentView />} />
        <Route path="/tournaments/new" element={<NewTournamentView />} />
        <Route path="/tournaments/:tournamentId/edit" element={<EditTournamentView />} />
        <Route path="/tournaments/summary" element={<TournamentSummaryView />} />
        <Route path="/cashgames" element={<CashGameView />} />
        <Route path="/cashgames/new" element={<NewCashGameView />} />
        <Route path="/cashgames/:cashGameId/edit" element={<EditCashGameView />} />
        <Route path="/cashgames/timer" element={<CashGameActiveView />} />
        <Route path="/cashgames/summary" element={<CashGameSummaryView />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
