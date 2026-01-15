import { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Star,
  Menu,
  Lock,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import styles from './Browser.module.css';

interface Bookmark {
  name: string;
  url: string;
  embedFriendly: boolean;
}

// Sites that allow iframe embedding
const defaultBookmarks: Bookmark[] = [
  { name: 'Wikipedia', url: 'https://www.wikipedia.org', embedFriendly: true },
  { name: 'Archive.org', url: 'https://archive.org', embedFriendly: true },
  { name: 'DuckDuckGo', url: 'https://duckduckgo.com', embedFriendly: true },
  { name: 'OpenStreetMap', url: 'https://www.openstreetmap.org', embedFriendly: true },
  { name: 'Hacker News', url: 'https://news.ycombinator.com', embedFriendly: true },
  { name: 'Google', url: 'https://www.google.com', embedFriendly: false },
  { name: 'GitHub', url: 'https://www.github.com', embedFriendly: false },
];

// Known sites that block iframe embedding
const blockedSites = [
  'google.com',
  'github.com',
  'twitter.com',
  'x.com',
  'facebook.com',
  'instagram.com',
  'linkedin.com',
  'youtube.com',
  'reddit.com',
  'amazon.com',
  'microsoft.com',
  'apple.com',
  'netflix.com',
  'spotify.com',
];

const isLikelyBlocked = (url: string): boolean => {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return blockedSites.some(site => hostname.includes(site));
  } catch {
    return false;
  }
};

export const Browser = () => {
  const [url, setUrl] = useState('https://www.wikipedia.org');
  const [inputUrl, setInputUrl] = useState('https://www.wikipedia.org');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [history, setHistory] = useState<string[]>(['https://www.wikipedia.org']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;
  const showBlockedWarning = isLikelyBlocked(url);

  useEffect(() => {
    // Reset error state when URL changes
    setLoadError(false);
    setIsLoading(true);
  }, [url]);

  const navigateTo = (newUrl: string) => {
    let processedUrl = newUrl;
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = 'https://' + processedUrl;
    }

    // Add to history
    const newHistory = [...history.slice(0, historyIndex + 1), processedUrl];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    setUrl(processedUrl);
    setInputUrl(processedUrl);
  };

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(inputUrl);
  };

  const handleBookmarkClick = (bookmark: Bookmark) => {
    navigateTo(bookmark.url);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setLoadError(false);
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }
  };

  const handleHome = () => {
    navigateTo('https://www.wikipedia.org');
  };

  const handleBack = () => {
    if (canGoBack) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const prevUrl = history[newIndex];
      setUrl(prevUrl);
      setInputUrl(prevUrl);
    }
  };

  const handleForward = () => {
    if (canGoForward) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextUrl = history[newIndex];
      setUrl(nextUrl);
      setInputUrl(nextUrl);
    }
  };

  const handleOpenExternal = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setLoadError(true);
  };

  return (
    <div className={styles.browser}>
      <div className={styles.toolbar}>
        <div className={styles.navigation}>
          <button
            className={styles.navButton}
            disabled={!canGoBack}
            onClick={handleBack}
            title="Back"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            className={styles.navButton}
            disabled={!canGoForward}
            onClick={handleForward}
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
            placeholder="Enter URL..."
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
            className={`${styles.bookmark} ${!bookmark.embedFriendly ? styles.externalBookmark : ''}`}
            onClick={() => handleBookmarkClick(bookmark)}
            title={bookmark.embedFriendly ? bookmark.name : `${bookmark.name} (opens externally)`}
          >
            {bookmark.name}
            {!bookmark.embedFriendly && <ExternalLink size={10} className={styles.bookmarkExternal} />}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {showBlockedWarning || loadError ? (
          <div className={styles.blockedMessage}>
            <AlertTriangle size={48} />
            <h2>This site cannot be embedded</h2>
            <p>
              <strong>{new URL(url).hostname}</strong> has security restrictions that prevent it from being displayed in an iframe.
            </p>
            <p className={styles.hint}>
              Many popular websites block embedding for security reasons. Click the button below to open it in a new browser tab.
            </p>
            <button className={styles.openExternalButton} onClick={handleOpenExternal}>
              <ExternalLink size={18} />
              <span>Open in New Tab</span>
            </button>
            <div className={styles.suggestion}>
              <p>Try one of these embed-friendly sites:</p>
              <div className={styles.suggestionLinks}>
                {defaultBookmarks.filter(b => b.embedFriendly).slice(0, 4).map(b => (
                  <button
                    key={b.url}
                    className={styles.suggestionLink}
                    onClick={() => navigateTo(b.url)}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <iframe
              ref={iframeRef}
              src={url}
              className={styles.iframe}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              title="Browser content"
            />
            {isLoading && (
              <div className={styles.loadingOverlay}>
                <RotateCw size={24} className={styles.spinning} />
                <span>Loading...</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
