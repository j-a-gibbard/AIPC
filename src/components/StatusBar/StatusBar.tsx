import { useState, useEffect } from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import { Wifi, Battery, Sun, Moon } from 'lucide-react';
import styles from './StatusBar.module.css';

export const StatusBar = () => {
  const [time, setTime] = useState(new Date());
  const { theme, toggleTheme } = useSettingsStore();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={styles.statusBar}>
      <div className={styles.left}>
        <button className={styles.logoButton}>
          <span className={styles.logo}>AIPC</span>
        </button>
      </div>

      <div className={styles.center}>
        <span className={styles.date}>{formatDate(time)}</span>
        <span className={styles.time}>{formatTime(time)}</span>
      </div>

      <div className={styles.right}>
        <button
          className={styles.iconButton}
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
        </button>
        <div className={styles.iconButton}>
          <Wifi size={14} />
        </div>
        <div className={styles.batteryIndicator}>
          <Battery size={18} />
          <span className={styles.batteryPercent}>100%</span>
        </div>
      </div>
    </div>
  );
};
