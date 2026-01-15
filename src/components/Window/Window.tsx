import { useRef, useCallback, useEffect, useState } from 'react';
import type { Window as WindowType, SnapPosition } from '../../types';
import { useWindowStore } from '../../stores/windowStore';
import { appRegistry } from '../../data/appRegistry';
import { Minus, Square, X } from 'lucide-react';
import styles from './Window.module.css';

interface WindowProps {
  window: WindowType;
  children: React.ReactNode;
}

const SNAP_THRESHOLD = 20; // pixels from edge to trigger snap

const detectSnapZone = (x: number, y: number): SnapPosition => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const statusBarHeight = 28;
  const dockHeight = 70;

  const nearLeft = x < SNAP_THRESHOLD;
  const nearRight = x > screenWidth - SNAP_THRESHOLD;
  const nearTop = y < statusBarHeight + SNAP_THRESHOLD;
  const nearBottom = y > screenHeight - dockHeight - SNAP_THRESHOLD;

  // Corner snaps
  if (nearLeft && nearTop) return 'top-left';
  if (nearRight && nearTop) return 'top-right';
  if (nearLeft && nearBottom) return 'bottom-left';
  if (nearRight && nearBottom) return 'bottom-right';

  // Edge snaps (half screen)
  if (nearLeft) return 'left';
  if (nearRight) return 'right';

  return null;
};

export const Window = ({ window: win, children }: WindowProps) => {
  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    snapWindow,
    unSnapWindow,
  } = useWindowStore();

  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [snapPreview, setSnapPreview] = useState<SnapPosition>(null);
  const dragStart = useRef({ x: 0, y: 0, windowX: 0, windowY: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0, windowX: 0, windowY: 0 });

  const app = appRegistry[win.appId];
  const minSize = app?.minSize || { width: 300, height: 200 };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    focusWindow(win.id);
  }, [focusWindow, win.id]);

  const handleTitleBarMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0 || win.state === 'maximized') return;
    e.preventDefault();

    // If window is snapped, unsnap it first and adjust drag start
    if (win.state === 'snapped' && win.preSnapSize) {
      unSnapWindow(win.id);
      // Center the window on the cursor based on pre-snap size
      const halfWidth = win.preSnapSize.width / 2;
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        windowX: e.clientX - halfWidth,
        windowY: e.clientY - 20,
      };
    } else {
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        windowX: win.position.x,
        windowY: win.position.y,
      };
    }

    setIsDragging(true);
    document.body.classList.add('dragging');
  }, [win.position, win.state, win.preSnapSize, win.id, unSnapWindow]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, direction: string) => {
    if (e.button !== 0 || win.state === 'maximized' || win.state === 'snapped') return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: win.size.width,
      height: win.size.height,
      windowX: win.position.x,
      windowY: win.position.y,
    };
    document.body.classList.add('dragging');
  }, [win.size, win.position, win.state]);

  const handleTitleBarDoubleClick = useCallback(() => {
    if (win.state === 'maximized' || win.state === 'snapped') {
      restoreWindow(win.id);
    } else {
      maximizeWindow(win.id);
    }
  }, [win.id, win.state, maximizeWindow, restoreWindow]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStart.current.x;
        const deltaY = e.clientY - dragStart.current.y;
        const newX = Math.max(0, Math.min(window.innerWidth - 100, dragStart.current.windowX + deltaX));
        const newY = Math.max(0, Math.min(window.innerHeight - 100, dragStart.current.windowY + deltaY));
        updateWindowPosition(win.id, { x: newX, y: newY });

        // Detect snap zone
        const snapZone = detectSnapZone(e.clientX, e.clientY);
        setSnapPreview(snapZone);
      }

      if (isResizing && resizeDirection) {
        const deltaX = e.clientX - resizeStart.current.x;
        const deltaY = e.clientY - resizeStart.current.y;

        let newWidth = resizeStart.current.width;
        let newHeight = resizeStart.current.height;
        let newX = resizeStart.current.windowX;
        let newY = resizeStart.current.windowY;

        if (resizeDirection.includes('e')) {
          newWidth = Math.max(minSize.width, resizeStart.current.width + deltaX);
        }
        if (resizeDirection.includes('w')) {
          const proposedWidth = resizeStart.current.width - deltaX;
          if (proposedWidth >= minSize.width) {
            newWidth = proposedWidth;
            newX = resizeStart.current.windowX + deltaX;
          }
        }
        if (resizeDirection.includes('s')) {
          newHeight = Math.max(minSize.height, resizeStart.current.height + deltaY);
        }
        if (resizeDirection.includes('n')) {
          const proposedHeight = resizeStart.current.height - deltaY;
          if (proposedHeight >= minSize.height) {
            newHeight = proposedHeight;
            newY = resizeStart.current.windowY + deltaY;
          }
        }

        updateWindowSize(win.id, { width: newWidth, height: newHeight });
        if (newX !== win.position.x || newY !== win.position.y) {
          updateWindowPosition(win.id, { x: newX, y: newY });
        }
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        // Apply snap if there's a preview
        if (snapPreview) {
          snapWindow(win.id, snapPreview);
        }
        setSnapPreview(null);
      }

      if (isDragging || isResizing) {
        setIsDragging(false);
        setIsResizing(false);
        setResizeDirection(null);
        document.body.classList.remove('dragging');
      }
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, resizeDirection, win.id, win.position, updateWindowPosition, updateWindowSize, minSize, snapPreview, snapWindow]);

  if (win.state === 'minimized') {
    return null;
  }

  const isMaximized = win.state === 'maximized';
  const isSnapped = win.state === 'snapped';
  const windowStyle = isMaximized
    ? {
        left: 0,
        top: 28,
        width: '100%',
        height: 'calc(100% - 28px - 70px)',
        zIndex: win.zIndex,
      }
    : {
        left: win.position.x,
        top: win.position.y,
        width: win.size.width,
        height: win.size.height,
        zIndex: win.zIndex,
      };

  return (
    <div
      ref={windowRef}
      className={`${styles.window} ${win.isActive ? styles.active : ''} ${isMaximized ? styles.maximized : ''} ${isSnapped ? styles.snapped : ''}`}
      style={windowStyle}
      onMouseDown={handleMouseDown}
    >
      <div
        className={styles.titleBar}
        onMouseDown={handleTitleBarMouseDown}
        onDoubleClick={handleTitleBarDoubleClick}
      >
        <div className={styles.trafficLights}>
          <button
            className={`${styles.trafficLight} ${styles.close}`}
            onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}
            title="Close"
          >
            <X size={8} />
          </button>
          <button
            className={`${styles.trafficLight} ${styles.minimize}`}
            onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id); }}
            title="Minimize"
          >
            <Minus size={8} />
          </button>
          <button
            className={`${styles.trafficLight} ${styles.maximize}`}
            onClick={(e) => {
              e.stopPropagation();
              (isMaximized || isSnapped) ? restoreWindow(win.id) : maximizeWindow(win.id);
            }}
            title={isMaximized || isSnapped ? 'Restore' : 'Maximize'}
          >
            <Square size={7} />
          </button>
        </div>
        <div className={styles.title}>{win.title}</div>
        <div className={styles.titleBarSpacer} />
      </div>

      <div className={styles.content}>
        {children}
      </div>

      {!isMaximized && !isSnapped && (
        <>
          <div className={`${styles.resizeHandle} ${styles.resizeN}`} onMouseDown={(e) => handleResizeMouseDown(e, 'n')} />
          <div className={`${styles.resizeHandle} ${styles.resizeS}`} onMouseDown={(e) => handleResizeMouseDown(e, 's')} />
          <div className={`${styles.resizeHandle} ${styles.resizeE}`} onMouseDown={(e) => handleResizeMouseDown(e, 'e')} />
          <div className={`${styles.resizeHandle} ${styles.resizeW}`} onMouseDown={(e) => handleResizeMouseDown(e, 'w')} />
          <div className={`${styles.resizeHandle} ${styles.resizeNE}`} onMouseDown={(e) => handleResizeMouseDown(e, 'ne')} />
          <div className={`${styles.resizeHandle} ${styles.resizeNW}`} onMouseDown={(e) => handleResizeMouseDown(e, 'nw')} />
          <div className={`${styles.resizeHandle} ${styles.resizeSE}`} onMouseDown={(e) => handleResizeMouseDown(e, 'se')} />
          <div className={`${styles.resizeHandle} ${styles.resizeSW}`} onMouseDown={(e) => handleResizeMouseDown(e, 'sw')} />
        </>
      )}
    </div>
  );
};

// Snap preview overlay component
export const SnapPreviewOverlay = ({ snapPosition }: { snapPosition: SnapPosition }) => {
  if (!snapPosition) return null;

  const getPreviewStyle = () => {
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

  return (
    <div className={styles.snapPreview} style={getPreviewStyle()} />
  );
};
