import { SoundProvider } from "@emoji-minis/kit";
import { GameContainer } from "./components/GameContainer";

function App() {
  return (
    <SoundProvider>
      <GameContainer />
    </SoundProvider>
  );
}

export default App;
