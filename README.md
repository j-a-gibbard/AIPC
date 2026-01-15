# AIPC - AI-Native Cloud Operating System

An OS-agnostic, cloud-first personal computing environment with AI at its core. AIPC runs entirely in a web browser, providing a consistent experience across any device with a modern browser.

## Vision

*"A computing environment where AI is the primary interface, applications live in the cloud, and your desktop follows you everywhere."*

## Features

### Core Desktop Environment
- **Multi-window System** - Draggable, resizable windows with minimize/maximize/close
- **Desktop Icons** - Quick access to applications
- **Dock/Taskbar** - Running applications and favorites
- **Status Bar** - System info, clock, and theme toggle

### AI Assistant
- Central AI widget on the desktop
- Natural language commands to open applications
- Quick action buttons
- Expandable chat interface

### Built-in Applications
- **File Explorer** - Browse virtual file system with grid/list views
- **Notes** - Create and edit text notes
- **Browser** - Embedded web browser with bookmarks
- **Settings** - Customize theme, wallpaper, and accent colors

### Theming
- Light and dark mode support
- Multiple wallpaper options
- Customizable accent colors

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/j-a-gibbard/AIPC.git
cd AIPC

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Zustand** - State management
- **Lucide React** - Icons
- **CSS Modules** - Scoped styling

## Project Structure

```
src/
├── components/      # UI components
│   ├── AI/          # AI Assistant widget
│   ├── Desktop/     # Desktop and icons
│   ├── Dock/        # Application dock
│   ├── StatusBar/   # Top status bar
│   └── Window/      # Window manager
├── apps/            # Built-in applications
│   ├── Browser/     # Web browser
│   ├── FileExplorer/# File explorer
│   ├── Notes/       # Notes editor
│   └── Settings/    # System settings
├── stores/          # Zustand state stores
├── data/            # Mock data and configs
├── types/           # TypeScript types
└── styles/          # Global styles and themes
```

## AI Commands

Try these commands with the AI Assistant:
- "Open files" - Opens File Explorer
- "Open browser" - Opens the web browser
- "Open notes" - Opens Notes app
- "Open settings" - Opens Settings
- "What time is it?" - Shows current time
- "Help" - Lists available commands

## Documentation

See [docs/PRODUCT_DESIGN.md](docs/PRODUCT_DESIGN.md) for the full product design document.

## License

MIT
