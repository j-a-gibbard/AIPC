import { useSettingsStore } from '../../stores/settingsStore';
import {
  Palette,
  Monitor,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';
import styles from './Settings.module.css';

const wallpaperOptions = [
  { id: 'gradient-1', name: 'Purple Dream', colors: ['#667eea', '#764ba2'] },
  { id: 'gradient-2', name: 'Pink Sunset', colors: ['#f093fb', '#f5576c'] },
  { id: 'gradient-3', name: 'Ocean Blue', colors: ['#4facfe', '#00f2fe'] },
  { id: 'gradient-4', name: 'Fresh Green', colors: ['#43e97b', '#38f9d7'] },
  { id: 'gradient-5', name: 'Warm Glow', colors: ['#fa709a', '#fee140'] },
  { id: 'gradient-6', name: 'Soft Pink', colors: ['#a8edea', '#fed6e3'] },
  { id: 'dark-1', name: 'Midnight', colors: ['#1a1a2e', '#16213e'] },
  { id: 'dark-2', name: 'Charcoal', colors: ['#232526', '#414345'] },
];

const accentColors = [
  { id: 'blue', color: '#007aff', name: 'Blue' },
  { id: 'purple', color: '#5856d6', name: 'Purple' },
  { id: 'pink', color: '#ff2d55', name: 'Pink' },
  { id: 'orange', color: '#ff9500', name: 'Orange' },
  { id: 'green', color: '#34c759', name: 'Green' },
  { id: 'teal', color: '#5ac8fa', name: 'Teal' },
];

export const Settings = () => {
  const { theme, wallpaper, accentColor, setTheme, setWallpaper, setAccentColor } = useSettingsStore();

  return (
    <div className={styles.settings}>
      <div className={styles.sidebar}>
        <button className={`${styles.sidebarItem} ${styles.active}`}>
          <Palette size={18} />
          <span>Appearance</span>
        </button>
        <button className={styles.sidebarItem}>
          <Monitor size={18} />
          <span>Desktop</span>
        </button>
        <button className={styles.sidebarItem}>
          <Sparkles size={18} />
          <span>AI Assistant</span>
        </button>
        <button className={styles.sidebarItem}>
          <Info size={18} />
          <span>About</span>
        </button>
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>Appearance</h1>
        <p className={styles.subtitle}>Customize the look and feel of AIPC</p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Theme</h2>
          <div className={styles.themeOptions}>
            <button
              className={`${styles.themeOption} ${theme === 'light' ? styles.selected : ''}`}
              onClick={() => setTheme('light')}
            >
              <div className={styles.themePreview} style={{ background: '#f5f5f7' }}>
                <div className={styles.themePreviewWindow} style={{ background: '#ffffff' }} />
              </div>
              <span>Light</span>
              {theme === 'light' && <Check size={14} className={styles.checkIcon} />}
            </button>
            <button
              className={`${styles.themeOption} ${theme === 'dark' ? styles.selected : ''}`}
              onClick={() => setTheme('dark')}
            >
              <div className={styles.themePreview} style={{ background: '#1d1d1f' }}>
                <div className={styles.themePreviewWindow} style={{ background: '#2d2d2f' }} />
              </div>
              <span>Dark</span>
              {theme === 'dark' && <Check size={14} className={styles.checkIcon} />}
            </button>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Accent Color</h2>
          <div className={styles.colorOptions}>
            {accentColors.map((c) => (
              <button
                key={c.id}
                className={`${styles.colorOption} ${accentColor === c.color ? styles.selected : ''}`}
                style={{ '--accent': c.color } as React.CSSProperties}
                onClick={() => setAccentColor(c.color)}
                title={c.name}
              >
                {accentColor === c.color && <Check size={12} />}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Wallpaper</h2>
          <div className={styles.wallpaperGrid}>
            {wallpaperOptions.map((wp) => (
              <button
                key={wp.id}
                className={`${styles.wallpaperOption} ${wallpaper === wp.id ? styles.selected : ''}`}
                onClick={() => setWallpaper(wp.id)}
                title={wp.name}
              >
                <div
                  className={styles.wallpaperPreview}
                  style={{
                    background: `linear-gradient(135deg, ${wp.colors[0]} 0%, ${wp.colors[1]} 100%)`
                  }}
                />
                {wallpaper === wp.id && (
                  <div className={styles.wallpaperCheck}>
                    <Check size={16} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
