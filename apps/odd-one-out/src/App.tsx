import { GameProvider } from './hooks/useGameController';
import { GameScreen } from './components/GameScreen';

export function App() {
  return (
    <GameProvider>
      <GameScreen />
    </GameProvider>
  );
}

export default App;
