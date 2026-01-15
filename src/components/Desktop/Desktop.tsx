import { useSettingsStore } from '../../stores/settingsStore';
import { useWindowStore } from '../../stores/windowStore';
import { defaultDesktopIcons } from '../../data/appRegistry';
import { DesktopIcon } from './DesktopIcon';
import styles from './Desktop.module.css';

const wallpapers: Record<string, string> = {
  'gradient-1': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'gradient-2': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'gradient-3': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'gradient-4': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'gradient-5': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'gradient-6': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'dark-1': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
  'dark-2': 'linear-gradient(135deg, #232526 0%, #414345 100%)',
};

export const Desktop = () => {
  const wallpaper = useSettingsStore(state => state.wallpaper);
  const openWindow = useWindowStore(state => state.openWindow);

  const handleIconDoubleClick = (appId: string) => {
    openWindow(appId);
  };

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      // Could clear selection or other desktop click behavior
    }
  };

  return (
    <div
      className={styles.desktop}
      style={{ background: wallpapers[wallpaper] || wallpapers['gradient-1'] }}
      onClick={handleDesktopClick}
    >
      <div className={styles.iconGrid}>
        {defaultDesktopIcons.map(icon => (
          <DesktopIcon
            key={icon.id}
            icon={icon}
            onDoubleClick={() => handleIconDoubleClick(icon.appId)}
          />
        ))}
      </div>
    </div>
  );
};
