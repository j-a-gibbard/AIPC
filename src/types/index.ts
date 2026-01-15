// Window types
export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export type WindowState = 'normal' | 'minimized' | 'maximized' | 'snapped';
export type SnapPosition = 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null;

export interface Window {
  id: string;
  appId: string;
  title: string;
  position: Position;
  size: Size;
  state: WindowState;
  zIndex: number;
  isActive: boolean;
  snapPosition?: SnapPosition;
  preSnapPosition?: Position;
  preSnapSize?: Size;
}

// File System types
export type FSNodeType = 'file' | 'folder';

export interface FSNode {
  id: string;
  name: string;
  type: FSNodeType;
  path: string;
  parentId: string | null;
  children?: string[];
  content?: string;
  mimeType?: string;
  size?: number;
  createdAt: Date;
  modifiedAt: Date;
  icon?: string;
}

// Application types
export interface Application {
  id: string;
  name: string;
  icon: string;
  defaultSize: Size;
  minSize: Size;
  isExternal?: boolean;
  externalUrl?: string;
  allowMultipleInstances: boolean;
}

// AI types
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AICommand {
  action: 'openApp' | 'showTime' | 'showHelp' | 'respond';
  appId?: string;
  response?: string;
}

// Settings types
export type Theme = 'light' | 'dark';

export interface Settings {
  theme: Theme;
  accentColor: string;
  wallpaper: string;
  dockPosition: 'bottom' | 'left' | 'right';
  iconSize: 'small' | 'medium' | 'large';
}

// Desktop Icon
export interface DesktopIcon {
  id: string;
  appId: string;
  name: string;
  icon: string;
  position: Position;
}
