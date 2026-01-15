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

          const IconComponent = iconMap[app.icon] || Folder;
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
                <IconComponent size={24} strokeWidth={1.5} />
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
