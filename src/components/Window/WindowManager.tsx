import { useState, useEffect } from 'react';
import { useWindowStore } from '../../stores/windowStore';
import { Window } from './Window';
import { FileExplorer } from '../../apps/FileExplorer/FileExplorer';
import { Notes } from '../../apps/Notes/Notes';
import { Browser } from '../../apps/Browser/Browser';
import { Settings } from '../../apps/Settings/Settings';
import { PlaceholderApp } from '../../apps/PlaceholderApp';
import { CloudApp } from '../../apps/CloudApp';
import { appRegistry } from '../../data/appRegistry';
import type { SnapPosition } from '../../types';
import styles from './Window.module.css';

const appComponents: Record<string, React.ComponentType<{ appId?: string }>> = {
  'file-explorer': FileExplorer,
  'notes': Notes,
  'browser': Browser,
  'settings': Settings,
  'photos': PlaceholderApp,
  'music': PlaceholderApp,
};

const SNAP_THRESHOLD = 20;

const detectSnapZone = (x: number, y: number): SnapPosition => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const statusBarHeight = 28;
  const dockHeight = 70;

  const nearLeft = x < SNAP_THRESHOLD;
  const nearRight = x > screenWidth - SNAP_THRESHOLD;
  const nearTop = y < statusBarHeight + SNAP_THRESHOLD;
  const nearBottom = y > screenHeight - dockHeight - SNAP_THRESHOLD;

  if (nearLeft && nearTop) return 'top-left';
  if (nearRight && nearTop) return 'top-right';
  if (nearLeft && nearBottom) return 'bottom-left';
  if (nearRight && nearBottom) return 'bottom-right';
  if (nearLeft) return 'left';
  if (nearRight) return 'right';

  return null;
};

const getPreviewStyle = (snapPosition: SnapPosition): React.CSSProperties => {
  if (!snapPosition) return {};

  const statusBarHeight = 28;
  const dockHeight = 70;
  const availableHeight = window.innerHeight - statusBarHeight - dockHeight;
  const halfWidth = window.innerWidth / 2;
  const halfHeight = availableHeight / 2;

  switch (snapPosition) {
    case 'left':
      return { left: 0, top: statusBarHeight, width: halfWidth, height: availableHeight };
    case 'right':
      return { left: halfWidth, top: statusBarHeight, width: halfWidth, height: availableHeight };
    case 'top-left':
      return { left: 0, top: statusBarHeight, width: halfWidth, height: halfHeight };
    case 'top-right':
      return { left: halfWidth, top: statusBarHeight, width: halfWidth, height: halfHeight };
    case 'bottom-left':
      return { left: 0, top: statusBarHeight + halfHeight, width: halfWidth, height: halfHeight };
    case 'bottom-right':
      return { left: halfWidth, top: statusBarHeight + halfHeight, width: halfWidth, height: halfHeight };
    default:
      return {};
  }
};

export const WindowManager = () => {
  const windows = useWindowStore(state => state.windows);
  const [snapPreview, setSnapPreview] = useState<SnapPosition>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Only show snap preview when dragging (body has 'dragging' class)
      if (document.body.classList.contains('dragging')) {
        const zone = detectSnapZone(e.clientX, e.clientY);
        setSnapPreview(zone);
      }
    };

    const handleMouseUp = () => {
      setSnapPreview(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      {/* Snap preview overlay */}
      {snapPreview && (
        <div className={styles.snapPreview} style={getPreviewStyle(snapPreview)} />
      )}

      {/* Windows */}
      {windows.map(win => {
        const app = appRegistry[win.appId];
        const isExternal = app?.isExternal;

        // Use CloudApp for external apps, otherwise use registered component or placeholder
        if (isExternal) {
          return (
            <Window key={win.id} window={win}>
              <CloudApp appId={win.appId} />
            </Window>
          );
        }

        const AppComponent = appComponents[win.appId] || PlaceholderApp;
        return (
          <Window key={win.id} window={win}>
            <AppComponent />
          </Window>
        );
      })}
    </>
  );
};
