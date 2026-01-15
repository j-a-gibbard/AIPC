import { create } from 'zustand';
import type { Window, Position, Size, WindowState, SnapPosition } from '../types';
import { appRegistry } from '../data/appRegistry';

interface WindowStore {
  windows: Window[];
  activeWindowId: string | null;

  openWindow: (appId: string) => string;
  closeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  restoreWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  updateWindowPosition: (windowId: string, position: Position) => void;
  updateWindowSize: (windowId: string, size: Size) => void;
  setWindowState: (windowId: string, state: WindowState) => void;
  snapWindow: (windowId: string, snapPosition: SnapPosition) => void;
  unSnapWindow: (windowId: string) => void;
  getWindowsByApp: (appId: string) => Window[];
}

let windowCounter = 0;

const getNextZIndex = (windows: Window[]): number => {
  if (windows.length === 0) return 100;
  return Math.max(...windows.map(w => w.zIndex)) + 1;
};

const getCenteredPosition = (size: Size): Position => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight - 80; // Account for dock and statusbar
  const offset = (windowCounter % 10) * 30; // Cascade windows
  return {
    x: Math.max(50, (screenWidth - size.width) / 2 + offset),
    y: Math.max(50, (screenHeight - size.height) / 2 + offset),
  };
};

const getSnapGeometry = (snapPosition: SnapPosition): { position: Position; size: Size } => {
  const statusBarHeight = 28;
  const dockHeight = 70;
  const availableHeight = window.innerHeight - statusBarHeight - dockHeight;
  const halfWidth = window.innerWidth / 2;
  const halfHeight = availableHeight / 2;

  switch (snapPosition) {
    case 'left':
      return {
        position: { x: 0, y: statusBarHeight },
        size: { width: halfWidth, height: availableHeight },
      };
    case 'right':
      return {
        position: { x: halfWidth, y: statusBarHeight },
        size: { width: halfWidth, height: availableHeight },
      };
    case 'top-left':
      return {
        position: { x: 0, y: statusBarHeight },
        size: { width: halfWidth, height: halfHeight },
      };
    case 'top-right':
      return {
        position: { x: halfWidth, y: statusBarHeight },
        size: { width: halfWidth, height: halfHeight },
      };
    case 'bottom-left':
      return {
        position: { x: 0, y: statusBarHeight + halfHeight },
        size: { width: halfWidth, height: halfHeight },
      };
    case 'bottom-right':
      return {
        position: { x: halfWidth, y: statusBarHeight + halfHeight },
        size: { width: halfWidth, height: halfHeight },
      };
    default:
      return {
        position: { x: 100, y: 100 },
        size: { width: 600, height: 400 },
      };
  }
};

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  activeWindowId: null,

  openWindow: (appId: string) => {
    const app = appRegistry[appId];
    if (!app) {
      console.error(`App not found: ${appId}`);
      return '';
    }

    // Check for single instance apps
    if (!app.allowMultipleInstances) {
      const existing = get().windows.find(w => w.appId === appId);
      if (existing) {
        get().focusWindow(existing.id);
        if (existing.state === 'minimized') {
          get().restoreWindow(existing.id);
        }
        return existing.id;
      }
    }

    const windowId = `window-${++windowCounter}-${Date.now()}`;
    const position = getCenteredPosition(app.defaultSize);
    const zIndex = getNextZIndex(get().windows);

    const newWindow: Window = {
      id: windowId,
      appId: app.id,
      title: app.name,
      position,
      size: { ...app.defaultSize },
      state: 'normal',
      zIndex,
      isActive: true,
    };

    set(state => ({
      windows: [...state.windows.map(w => ({ ...w, isActive: false })), newWindow],
      activeWindowId: windowId,
    }));

    return windowId;
  },

  closeWindow: (windowId: string) => {
    set(state => {
      const remaining = state.windows.filter(w => w.id !== windowId);
      const newActive = remaining.length > 0
        ? remaining.reduce((a, b) => a.zIndex > b.zIndex ? a : b).id
        : null;

      return {
        windows: remaining.map(w => ({
          ...w,
          isActive: w.id === newActive,
        })),
        activeWindowId: newActive,
      };
    });
  },

  minimizeWindow: (windowId: string) => {
    set(state => {
      const remaining = state.windows.filter(w => w.id !== windowId && w.state !== 'minimized');
      const newActive = remaining.length > 0
        ? remaining.reduce((a, b) => a.zIndex > b.zIndex ? a : b).id
        : null;

      return {
        windows: state.windows.map(w =>
          w.id === windowId
            ? { ...w, state: 'minimized' as WindowState, isActive: false }
            : { ...w, isActive: w.id === newActive }
        ),
        activeWindowId: newActive,
      };
    });
  },

  maximizeWindow: (windowId: string) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === windowId
          ? { ...w, state: 'maximized' as WindowState, snapPosition: null }
          : w
      ),
    }));
  },

  restoreWindow: (windowId: string) => {
    const zIndex = getNextZIndex(get().windows);
    set(state => ({
      windows: state.windows.map(w => {
        if (w.id === windowId) {
          // If restoring from snap, use pre-snap values
          if (w.snapPosition && w.preSnapPosition && w.preSnapSize) {
            return {
              ...w,
              state: 'normal' as WindowState,
              position: w.preSnapPosition,
              size: w.preSnapSize,
              snapPosition: null,
              preSnapPosition: undefined,
              preSnapSize: undefined,
              zIndex,
              isActive: true,
            };
          }
          return { ...w, state: 'normal' as WindowState, zIndex, isActive: true };
        }
        return { ...w, isActive: false };
      }),
      activeWindowId: windowId,
    }));
  },

  focusWindow: (windowId: string) => {
    const zIndex = getNextZIndex(get().windows);
    set(state => ({
      windows: state.windows.map(w =>
        w.id === windowId
          ? { ...w, zIndex, isActive: true }
          : { ...w, isActive: false }
      ),
      activeWindowId: windowId,
    }));
  },

  updateWindowPosition: (windowId: string, position: Position) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === windowId ? { ...w, position } : w
      ),
    }));
  },

  updateWindowSize: (windowId: string, size: Size) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === windowId ? { ...w, size } : w
      ),
    }));
  },

  setWindowState: (windowId: string, windowState: WindowState) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === windowId ? { ...w, state: windowState } : w
      ),
    }));
  },

  snapWindow: (windowId: string, snapPosition: SnapPosition) => {
    if (!snapPosition) return;

    const { position, size } = getSnapGeometry(snapPosition);
    const zIndex = getNextZIndex(get().windows);

    set(state => ({
      windows: state.windows.map(w => {
        if (w.id === windowId) {
          // Only save pre-snap values if not already snapped
          const preSnapPosition = w.snapPosition ? w.preSnapPosition : w.position;
          const preSnapSize = w.snapPosition ? w.preSnapSize : w.size;

          return {
            ...w,
            state: 'snapped' as WindowState,
            position,
            size,
            snapPosition,
            preSnapPosition,
            preSnapSize,
            zIndex,
            isActive: true,
          };
        }
        return { ...w, isActive: false };
      }),
      activeWindowId: windowId,
    }));
  },

  unSnapWindow: (windowId: string) => {
    set(state => ({
      windows: state.windows.map(w => {
        if (w.id === windowId && w.snapPosition) {
          return {
            ...w,
            state: 'normal' as WindowState,
            position: w.preSnapPosition || w.position,
            size: w.preSnapSize || w.size,
            snapPosition: null,
            preSnapPosition: undefined,
            preSnapSize: undefined,
          };
        }
        return w;
      }),
    }));
  },

  getWindowsByApp: (appId: string) => {
    return get().windows.filter(w => w.appId === appId);
  },
}));
