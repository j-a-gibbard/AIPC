import type { Application } from '../types';

export const appRegistry: Record<string, Application> = {
  'file-explorer': {
    id: 'file-explorer',
    name: 'Files',
    icon: 'folder',
    defaultSize: { width: 800, height: 500 },
    minSize: { width: 400, height: 300 },
    allowMultipleInstances: true,
  },
  'notes': {
    id: 'notes',
    name: 'Notes',
    icon: 'file-text',
    defaultSize: { width: 600, height: 450 },
    minSize: { width: 300, height: 200 },
    allowMultipleInstances: true,
  },
  'browser': {
    id: 'browser',
    name: 'Browser',
    icon: 'globe',
    defaultSize: { width: 900, height: 600 },
    minSize: { width: 400, height: 300 },
    allowMultipleInstances: true,
  },
  'settings': {
    id: 'settings',
    name: 'Settings',
    icon: 'settings',
    defaultSize: { width: 700, height: 500 },
    minSize: { width: 500, height: 400 },
    allowMultipleInstances: false,
  },
  'photos': {
    id: 'photos',
    name: 'Photos',
    icon: 'image',
    defaultSize: { width: 800, height: 600 },
    minSize: { width: 400, height: 300 },
    allowMultipleInstances: true,
  },
  'music': {
    id: 'music',
    name: 'Music',
    icon: 'music',
    defaultSize: { width: 400, height: 500 },
    minSize: { width: 300, height: 400 },
    allowMultipleInstances: false,
  },
};

export const defaultDesktopIcons = [
  { id: 'icon-1', appId: 'file-explorer', name: 'Files', icon: 'folder', position: { x: 0, y: 0 } },
  { id: 'icon-2', appId: 'browser', name: 'Browser', icon: 'globe', position: { x: 0, y: 1 } },
  { id: 'icon-3', appId: 'notes', name: 'Notes', icon: 'file-text', position: { x: 0, y: 2 } },
  { id: 'icon-4', appId: 'photos', name: 'Photos', icon: 'image', position: { x: 0, y: 3 } },
  { id: 'icon-5', appId: 'music', name: 'Music', icon: 'music', position: { x: 0, y: 4 } },
  { id: 'icon-6', appId: 'settings', name: 'Settings', icon: 'settings', position: { x: 0, y: 5 } },
];

export const defaultDockApps = ['file-explorer', 'browser', 'notes', 'settings'];
