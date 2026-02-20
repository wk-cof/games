import { useState } from 'react';
import { useToddlerInput } from './hooks/useToddlerInput';
import { CosmicEvent } from './components/CosmicEvent';
import { synthEngine } from './audio/SynthEngine';

function App() {
  const { activeEvents, removeEvent } = useToddlerInput();
  const [started, setStarted] = useState(false);

  const handleStart = () => {
    synthEngine.init();
    setStarted(true);
    // Try to enter fullscreen to lock out OS shortcuts
    document.documentElement.requestFullscreen().catch((err) => {
      console.warn('Could not launch fullscreen:', err);
    });
  };

  if (!started) {
    return (
      <div
        className="cosmic-void"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        onClick={handleStart}
      >
        <div style={{ color: 'white', fontFamily: 'system-ui', textAlign: 'center' }}>
          <h1>The Cosmic Mirror</h1>
          <p>Click anywhere to start</p>
          <p style={{ opacity: 0.5, fontSize: '0.8rem' }}>Press ESC to exit full screen</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cosmic-void">
      {activeEvents.map(evt => (
        <CosmicEvent key={evt.id} event={evt} onComplete={removeEvent} />
      ))}
    </div>
  );
}

export default App;
