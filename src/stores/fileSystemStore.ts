import { create } from 'zustand';
import type { FSNode } from '../types';
import { mockFileSystem, getChildren } from '../data/mockFileSystem';

interface FileSystemStore {
  currentPath: string;
  currentFolderId: string;
  selectedItems: string[];
  viewMode: 'grid' | 'list';

  navigateTo: (folderId: string) => void;
  navigateUp: () => void;
  selectItem: (itemId: string, multi?: boolean) => void;
  clearSelection: () => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  getCurrentFolder: () => FSNode | undefined;
  getCurrentChildren: () => FSNode[];
  getNode: (id: string) => FSNode | undefined;
  getBreadcrumbs: () => FSNode[];
}

export const useFileSystemStore = create<FileSystemStore>((set, get) => ({
  currentPath: '/',
  currentFolderId: 'root',
  selectedItems: [],
  viewMode: 'grid',

  navigateTo: (folderId: string) => {
    const folder = mockFileSystem[folderId];
    if (folder && folder.type === 'folder') {
      set({
        currentFolderId: folderId,
        currentPath: folder.path,
        selectedItems: [],
      });
    }
  },

  navigateUp: () => {
    const current = mockFileSystem[get().currentFolderId];
    if (current && current.parentId) {
      get().navigateTo(current.parentId);
    }
  },

  selectItem: (itemId: string, multi = false) => {
    set(state => {
      if (multi) {
        const isSelected = state.selectedItems.includes(itemId);
        return {
          selectedItems: isSelected
            ? state.selectedItems.filter(id => id !== itemId)
            : [...state.selectedItems, itemId],
        };
      }
      return { selectedItems: [itemId] };
    });
  },

  clearSelection: () => {
    set({ selectedItems: [] });
  },

  setViewMode: (mode: 'grid' | 'list') => {
    set({ viewMode: mode });
  },

  getCurrentFolder: () => {
    return mockFileSystem[get().currentFolderId];
  },

  getCurrentChildren: () => {
    return getChildren(get().currentFolderId);
  },

  getNode: (id: string) => {
    return mockFileSystem[id];
  },

  getBreadcrumbs: () => {
    const breadcrumbs: FSNode[] = [];
    let currentId: string | null = get().currentFolderId;

    while (currentId) {
      const node: FSNode | undefined = mockFileSystem[currentId];
      if (node) {
        breadcrumbs.unshift(node);
        currentId = node.parentId;
      } else {
        break;
      }
    }

    return breadcrumbs;
  },
}));
