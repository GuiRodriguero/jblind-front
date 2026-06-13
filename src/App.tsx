import { Route, Routes } from 'react-router-dom';
import './App.css';
import { MainLayout } from './layouts/MainLayout';
import { HomeView } from './features/home/views/HomeView';
import { TimerView } from './features/timer/views/TimerView';
import { TournamentView } from './features/tournament/views/TournamentView';
import { NewTournamentView } from './features/tournament/views/NewTournamentView';
import { EditTournamentView } from './features/tournament/views/EditTournamentView';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/timer" element={<TimerView />} />
        <Route path="/tournaments" element={<TournamentView />} />
        <Route path="/tournaments/new" element={<NewTournamentView />} />
        <Route path="/tournaments/:tournamentId/edit" element={<EditTournamentView />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
