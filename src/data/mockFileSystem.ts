import type { FSNode } from '../types';

const now = new Date();
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

export const mockFileSystem: Record<string, FSNode> = {
  'root': {
    id: 'root',
    name: 'Home',
    type: 'folder',
    path: '/',
    parentId: null,
    children: ['documents', 'pictures', 'music', 'downloads', 'desktop'],
    createdAt: lastWeek,
    modifiedAt: now,
    icon: 'home',
  },
  'documents': {
    id: 'documents',
    name: 'Documents',
    type: 'folder',
    path: '/Documents',
    parentId: 'root',
    children: ['work-folder', 'personal-folder'],
    createdAt: lastWeek,
    modifiedAt: now,
    icon: 'folder',
  },
  'work-folder': {
    id: 'work-folder',
    name: 'Work',
    type: 'folder',
    path: '/Documents/Work',
    parentId: 'documents',
    children: ['project-proposal', 'budget-2026', 'meeting-notes'],
    createdAt: lastWeek,
    modifiedAt: yesterday,
    icon: 'folder',
  },
  'project-proposal': {
    id: 'project-proposal',
    name: 'Project Proposal.docx',
    type: 'file',
    path: '/Documents/Work/Project Proposal.docx',
    parentId: 'work-folder',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 45056,
    createdAt: lastWeek,
    modifiedAt: yesterday,
    icon: 'file-text',
    content: 'Project proposal content...',
  },
  'budget-2026': {
    id: 'budget-2026',
    name: 'Budget 2026.xlsx',
    type: 'file',
    path: '/Documents/Work/Budget 2026.xlsx',
    parentId: 'work-folder',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 32768,
    createdAt: lastWeek,
    modifiedAt: lastWeek,
    icon: 'file-spreadsheet',
  },
  'meeting-notes': {
    id: 'meeting-notes',
    name: 'Meeting Notes.txt',
    type: 'file',
    path: '/Documents/Work/Meeting Notes.txt',
    parentId: 'work-folder',
    mimeType: 'text/plain',
    size: 2048,
    createdAt: yesterday,
    modifiedAt: now,
    icon: 'file-text',
    content: `Team Meeting - January 15, 2026
================================

Attendees: Alex, Jordan, Sam, Taylor

Agenda:
1. Q1 Planning Review
2. Product Roadmap Updates
3. Resource Allocation

Notes:
- Q1 targets are on track
- New feature launch scheduled for March
- Need additional frontend developer

Action Items:
- Alex: Finalize budget proposal
- Jordan: Update project timeline
- Sam: Schedule customer interviews`,
  },
  'personal-folder': {
    id: 'personal-folder',
    name: 'Personal',
    type: 'folder',
    path: '/Documents/Personal',
    parentId: 'documents',
    children: ['resume', 'ideas'],
    createdAt: lastWeek,
    modifiedAt: yesterday,
    icon: 'folder',
  },
  'resume': {
    id: 'resume',
    name: 'Resume.pdf',
    type: 'file',
    path: '/Documents/Personal/Resume.pdf',
    parentId: 'personal-folder',
    mimeType: 'application/pdf',
    size: 156000,
    createdAt: lastWeek,
    modifiedAt: lastWeek,
    icon: 'file',
  },
  'ideas': {
    id: 'ideas',
    name: 'Ideas.txt',
    type: 'file',
    path: '/Documents/Personal/Ideas.txt',
    parentId: 'personal-folder',
    mimeType: 'text/plain',
    size: 1024,
    createdAt: yesterday,
    modifiedAt: yesterday,
    icon: 'file-text',
    content: `App Ideas:
- Task manager with AI
- Habit tracker
- Recipe organizer
- Budget app

Side Projects:
- Learn Rust
- Build a game
- Contribute to open source`,
  },
  'pictures': {
    id: 'pictures',
    name: 'Pictures',
    type: 'folder',
    path: '/Pictures',
    parentId: 'root',
    children: ['vacation-folder', 'screenshots-folder'],
    createdAt: lastWeek,
    modifiedAt: yesterday,
    icon: 'image',
  },
  'vacation-folder': {
    id: 'vacation-folder',
    name: 'Vacation',
    type: 'folder',
    path: '/Pictures/Vacation',
    parentId: 'pictures',
    children: ['beach-photo', 'sunset-photo'],
    createdAt: lastWeek,
    modifiedAt: lastWeek,
    icon: 'folder',
  },
  'beach-photo': {
    id: 'beach-photo',
    name: 'beach.jpg',
    type: 'file',
    path: '/Pictures/Vacation/beach.jpg',
    parentId: 'vacation-folder',
    mimeType: 'image/jpeg',
    size: 2500000,
    createdAt: lastWeek,
    modifiedAt: lastWeek,
    icon: 'image',
  },
  'sunset-photo': {
    id: 'sunset-photo',
    name: 'sunset.png',
    type: 'file',
    path: '/Pictures/Vacation/sunset.png',
    parentId: 'vacation-folder',
    mimeType: 'image/png',
    size: 3200000,
    createdAt: lastWeek,
    modifiedAt: lastWeek,
    icon: 'image',
  },
  'screenshots-folder': {
    id: 'screenshots-folder',
    name: 'Screenshots',
    type: 'folder',
    path: '/Pictures/Screenshots',
    parentId: 'pictures',
    children: ['screenshot-001'],
    createdAt: lastWeek,
    modifiedAt: yesterday,
    icon: 'folder',
  },
  'screenshot-001': {
    id: 'screenshot-001',
    name: 'screenshot-001.png',
    type: 'file',
    path: '/Pictures/Screenshots/screenshot-001.png',
    parentId: 'screenshots-folder',
    mimeType: 'image/png',
    size: 450000,
    createdAt: yesterday,
    modifiedAt: yesterday,
    icon: 'image',
  },
  'music': {
    id: 'music',
    name: 'Music',
    type: 'folder',
    path: '/Music',
    parentId: 'root',
    children: ['favorites-folder'],
    createdAt: lastWeek,
    modifiedAt: lastWeek,
    icon: 'music',
  },
  'favorites-folder': {
    id: 'favorites-folder',
    name: 'Favorites',
    type: 'folder',
    path: '/Music/Favorites',
    parentId: 'music',
    children: ['playlist'],
    createdAt: lastWeek,
    modifiedAt: lastWeek,
    icon: 'folder',
  },
  'playlist': {
    id: 'playlist',
    name: 'playlist.m3u',
    type: 'file',
    path: '/Music/Favorites/playlist.m3u',
    parentId: 'favorites-folder',
    mimeType: 'audio/x-mpegurl',
    size: 512,
    createdAt: lastWeek,
    modifiedAt: lastWeek,
    icon: 'music',
  },
  'downloads': {
    id: 'downloads',
    name: 'Downloads',
    type: 'folder',
    path: '/Downloads',
    parentId: 'root',
    children: ['installer', 'document-pdf'],
    createdAt: lastWeek,
    modifiedAt: now,
    icon: 'download',
  },
  'installer': {
    id: 'installer',
    name: 'installer.dmg',
    type: 'file',
    path: '/Downloads/installer.dmg',
    parentId: 'downloads',
    mimeType: 'application/x-apple-diskimage',
    size: 85000000,
    createdAt: yesterday,
    modifiedAt: yesterday,
    icon: 'package',
  },
  'document-pdf': {
    id: 'document-pdf',
    name: 'document.pdf',
    type: 'file',
    path: '/Downloads/document.pdf',
    parentId: 'downloads',
    mimeType: 'application/pdf',
    size: 125000,
    createdAt: now,
    modifiedAt: now,
    icon: 'file',
  },
  'desktop': {
    id: 'desktop',
    name: 'Desktop',
    type: 'folder',
    path: '/Desktop',
    parentId: 'root',
    children: ['desktop-notes'],
    createdAt: lastWeek,
    modifiedAt: yesterday,
    icon: 'monitor',
  },
  'desktop-notes': {
    id: 'desktop-notes',
    name: 'Quick Notes.txt',
    type: 'file',
    path: '/Desktop/Quick Notes.txt',
    parentId: 'desktop',
    mimeType: 'text/plain',
    size: 256,
    createdAt: yesterday,
    modifiedAt: yesterday,
    icon: 'file-text',
    content: `Quick Notes
-----------
- Call mom
- Buy groceries
- Finish report`,
  },
};

export const getChildren = (parentId: string): FSNode[] => {
  const parent = mockFileSystem[parentId];
  if (!parent || !parent.children) return [];
  return parent.children.map(id => mockFileSystem[id]).filter(Boolean);
};

export const getNodeByPath = (path: string): FSNode | undefined => {
  return Object.values(mockFileSystem).find(node => node.path === path);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};
