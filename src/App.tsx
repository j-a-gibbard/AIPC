import { useEffect, useState } from 'react';
import { StatusBar } from './components/StatusBar';
import { Desktop } from './components/Desktop';
import { Dock } from './components/Dock';
import { WindowManager } from './components/Window';
import { AIAssistant } from './components/AI';
import { useSettingsStore } from './stores/settingsStore';
import './styles/global.css';

function App() {
  const theme = useSettingsStore(state => state.theme);
  const [isAIOpen, setIsAIOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleToggleAI = () => {
    setIsAIOpen(prev => !prev);
  };

  const handleCloseAI = () => {
    setIsAIOpen(false);
  };

  return (
    <div className="aipc">
      <StatusBar />
      <Desktop />
      <WindowManager />
      <AIAssistant isOpen={isAIOpen} onClose={handleCloseAI} />
      <Dock isAIOpen={isAIOpen} onToggleAI={handleToggleAI} />
    </div>
  );
}

export default App;
