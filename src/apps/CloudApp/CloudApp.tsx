import { ExternalLink, Globe, AlertCircle } from 'lucide-react';
import { appRegistry } from '../../data/appRegistry';
import styles from './CloudApp.module.css';

interface CloudAppProps {
  appId: string;
}

// Brand colors for cloud apps
const brandColors: Record<string, { primary: string; secondary: string }> = {
  'google-docs': { primary: '#4285F4', secondary: '#174EA6' },
  'google-sheets': { primary: '#34A853', secondary: '#137333' },
  'google-slides': { primary: '#FBBC04', secondary: '#E37400' },
  'ms-word': { primary: '#2B579A', secondary: '#124078' },
  'ms-excel': { primary: '#217346', secondary: '#0E5C2F' },
  'ms-powerpoint': { primary: '#D24726', secondary: '#B7472A' },
  'figma': { primary: '#F24E1E', secondary: '#A259FF' },
  'notion': { primary: '#000000', secondary: '#191919' },
  'slack': { primary: '#4A154B', secondary: '#611f64' },
  'spotify': { primary: '#1DB954', secondary: '#158E3E' },
};

export const CloudApp = ({ appId }: CloudAppProps) => {
  const app = appRegistry[appId];

  if (!app || !app.externalUrl) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <AlertCircle size={48} />
          <h2>App Not Found</h2>
          <p>This application could not be loaded.</p>
        </div>
      </div>
    );
  }

  const colors = brandColors[appId] || { primary: '#007AFF', secondary: '#0056b3' };

  const handleOpenExternal = () => {
    window.open(app.externalUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.hero}
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        }}
      >
        <div className={styles.heroContent}>
          <Globe size={64} strokeWidth={1} />
          <h1>{app.name}</h1>
          <p className={styles.subtitle}>Cloud Application</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.info}>
          <AlertCircle size={20} className={styles.infoIcon} />
          <div>
            <p>
              <strong>{app.name}</strong> is a cloud-based application that runs in your browser.
            </p>
            <p className={styles.hint}>
              For the best experience, click the button below to open it in a new tab.
            </p>
          </div>
        </div>

        <button className={styles.openButton} onClick={handleOpenExternal}>
          <ExternalLink size={20} />
          <span>Open {app.name}</span>
        </button>

        <div className={styles.features}>
          <h3>Why use {app.name}?</h3>
          <ul>
            {appId.startsWith('google-') && (
              <>
                <li>Real-time collaboration with others</li>
                <li>Automatic cloud saving</li>
                <li>Access from any device</li>
                <li>Integrates with Google Drive</li>
              </>
            )}
            {appId.startsWith('ms-') && (
              <>
                <li>Full Microsoft Office compatibility</li>
                <li>Real-time co-authoring</li>
                <li>Integrates with OneDrive</li>
                <li>Works across all your devices</li>
              </>
            )}
            {appId === 'figma' && (
              <>
                <li>Professional design tools in the browser</li>
                <li>Real-time collaboration</li>
                <li>Prototyping and design systems</li>
                <li>Export to multiple formats</li>
              </>
            )}
            {appId === 'notion' && (
              <>
                <li>All-in-one workspace</li>
                <li>Notes, docs, wikis, and databases</li>
                <li>Team collaboration</li>
                <li>Customizable templates</li>
              </>
            )}
            {appId === 'slack' && (
              <>
                <li>Team messaging and channels</li>
                <li>File sharing and integrations</li>
                <li>Voice and video calls</li>
                <li>Searchable history</li>
              </>
            )}
            {appId === 'spotify' && (
              <>
                <li>Millions of songs and podcasts</li>
                <li>Personalized playlists</li>
                <li>Offline listening (premium)</li>
                <li>Cross-device sync</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
