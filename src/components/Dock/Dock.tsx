import { useWindowStore } from '../../stores/windowStore';
import { appRegistry, defaultDockApps } from '../../data/appRegistry';
import {
  Folder,
  Globe,
  FileText,
  Settings,
  Image,
  Music,
  Plus,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import styles from './Dock.module.css';

const iconMap: Record<string, LucideIcon> = {
  folder: Folder,
  globe: Globe,
  'file-text': FileText,
  settings: Settings,
  image: Image,
  music: Music,
};

// Branded icons for dock
const brandStyles: Record<string, { bg: string; color: string; label: string }> = {
  'google-docs': { bg: '#4285F4', color: 'white', label: 'D' },
  'google-sheets': { bg: '#34A853', color: 'white', label: 'S' },
  'google-slides': { bg: '#FBBC04', color: 'white', label: 'P' },
  'ms-word': { bg: '#2B579A', color: 'white', label: 'W' },
  'ms-excel': { bg: '#217346', color: 'white', label: 'X' },
  'ms-powerpoint': { bg: '#D24726', color: 'white', label: 'P' },
  'figma': { bg: 'linear-gradient(135deg, #F24E1E 0%, #A259FF 50%, #1ABCFE 100%)', color: 'white', label: 'F' },
  'notion': { bg: '#000000', color: 'white', label: 'N' },
  'slack': { bg: '#4A154B', color: 'white', label: '#' },
  'spotify': { bg: '#1DB954', color: 'white', label: '♫' },
};

interface DockProps {
  isAIOpen: boolean;
  onToggleAI: () => void;
}

export const Dock = ({ isAIOpen, onToggleAI }: DockProps) => {
  const { windows, openWindow, focusWindow, restoreWindow } = useWindowStore();

  const handleAppClick = (appId: string) => {
    const appWindows = windows.filter(w => w.appId === appId);

    if (appWindows.length === 0) {
      openWindow(appId);
    } else {
      const minimized = appWindows.find(w => w.state === 'minimized');
      if (minimized) {
        restoreWindow(minimized.id);
      } else {
        focusWindow(appWindows[0].id);
      }
    }
  };

  const runningAppIds = new Set(windows.map(w => w.appId));
  const allAppIds = new Set([...defaultDockApps, ...runningAppIds]);

  return (
    <div className={styles.dockContainer}>
      <div className={styles.dock}>
        {/* AI Assistant Button */}
        <button
          className={`${styles.dockItem} ${styles.aiButton} ${isAIOpen ? styles.active : ''}`}
          onClick={onToggleAI}
          title="AI Assistant"
          data-ai-trigger
        >
          <div className={`${styles.iconWrapper} ${styles.aiIconWrapper}`}>
            <Sparkles size={24} strokeWidth={1.5} />
          </div>
          {isAIOpen && <div className={styles.runningIndicator} />}
        </button>

        <div className={styles.divider} />

        {Array.from(allAppIds).map(appId => {
          const app = appRegistry[appId];
          if (!app) return null;

          const IconComponent = iconMap[app.icon];
          const brandStyle = brandStyles[app.icon];
          const isRunning = runningAppIds.has(appId);
          const isActive = windows.some(w => w.appId === appId && w.isActive);

          return (
            <button
              key={appId}
              className={`${styles.dockItem} ${isActive ? styles.active : ''}`}
              onClick={() => handleAppClick(appId)}
              title={app.name}
            >
              <div className={styles.iconWrapper}>
                {brandStyle ? (
                  <div
                    className={styles.brandedIcon}
                    style={{ background: brandStyle.bg, color: brandStyle.color }}
                  >
                    {brandStyle.label}
                  </div>
                ) : IconComponent ? (
                  <IconComponent size={24} strokeWidth={1.5} />
                ) : (
                  <Folder size={24} strokeWidth={1.5} />
                )}
              </div>
              {isRunning && <div className={styles.runningIndicator} />}
            </button>
          );
        })}

        <div className={styles.divider} />

        <button className={styles.dockItem} title="App Launcher">
          <div className={styles.iconWrapper}>
            <Plus size={24} strokeWidth={1.5} />
          </div>
        </button>
      </div>
    </div>
  );
};
