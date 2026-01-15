import { useState, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Star,
  Menu,
  Lock,
  ExternalLink,
} from 'lucide-react';
import styles from './Browser.module.css';

interface Bookmark {
  name: string;
  url: string;
}

const defaultBookmarks: Bookmark[] = [
  { name: 'Google', url: 'https://www.google.com' },
  { name: 'Wikipedia', url: 'https://www.wikipedia.org' },
  { name: 'GitHub', url: 'https://www.github.com' },
];

export const Browser = () => {
  const [url, setUrl] = useState('https://www.wikipedia.org');
  const [inputUrl, setInputUrl] = useState('https://www.wikipedia.org');
  const [isLoading, setIsLoading] = useState(true);
  const [canGoBack] = useState(false);
  const [canGoForward] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let newUrl = inputUrl;
    if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
      newUrl = 'https://' + newUrl;
    }
    setUrl(newUrl);
    setIsLoading(true);
  };

  const handleBookmarkClick = (bookmarkUrl: string) => {
    setUrl(bookmarkUrl);
    setInputUrl(bookmarkUrl);
    setIsLoading(true);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }
  };

  const handleHome = () => {
    const homeUrl = 'https://www.wikipedia.org';
    setUrl(homeUrl);
    setInputUrl(homeUrl);
    setIsLoading(true);
  };

  const handleOpenExternal = () => {
    window.open(url, '_blank');
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={styles.browser}>
      <div className={styles.toolbar}>
        <div className={styles.navigation}>
          <button
            className={styles.navButton}
            disabled={!canGoBack}
            title="Back"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            className={styles.navButton}
            disabled={!canGoForward}
            title="Forward"
          >
            <ArrowRight size={16} />
          </button>
          <button
            className={styles.navButton}
            onClick={handleRefresh}
            title="Refresh"
          >
            <RotateCw size={16} className={isLoading ? styles.spinning : ''} />
          </button>
          <button
            className={styles.navButton}
            onClick={handleHome}
            title="Home"
          >
            <Home size={16} />
          </button>
        </div>

        <form className={styles.addressBar} onSubmit={handleNavigate}>
          <Lock size={12} className={styles.lockIcon} />
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className={styles.addressInput}
          />
          <button type="button" className={styles.starButton} title="Bookmark">
            <Star size={14} />
          </button>
        </form>

        <div className={styles.actions}>
          <button
            className={styles.navButton}
            onClick={handleOpenExternal}
            title="Open in new tab"
          >
            <ExternalLink size={16} />
          </button>
          <button className={styles.navButton} title="Menu">
            <Menu size={16} />
          </button>
        </div>
      </div>

      <div className={styles.bookmarksBar}>
        {defaultBookmarks.map((bookmark) => (
          <button
            key={bookmark.url}
            className={styles.bookmark}
            onClick={() => handleBookmarkClick(bookmark.url)}
          >
            {bookmark.name}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        <iframe
          ref={iframeRef}
          src={url}
          className={styles.iframe}
          onLoad={handleIframeLoad}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          title="Browser content"
        />
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <RotateCw size={24} className={styles.spinning} />
            <span>Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
};
