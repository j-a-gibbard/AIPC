import { useEffect } from 'react';
import { StatusBar } from './components/StatusBar';
import { Desktop } from './components/Desktop';
import { Dock } from './components/Dock';
import { WindowManager } from './components/Window';
import { useSettingsStore } from './stores/settingsStore';
import './styles/global.css';

function App() {
  const theme = useSettingsStore(state => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="aipc">
      <StatusBar />
      <Desktop />
      <WindowManager />
      <Dock />
    </div>
  );
}

export default App;
