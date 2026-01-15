import { useFileSystemStore } from '../../stores/fileSystemStore';
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Search,
  LayoutGrid,
  List,
  Home,
  Folder,
  FileText,
  Image,
  Music,
  File,
  Download,
  Monitor,
  Star,
  Clock,
  type LucideIcon,
} from 'lucide-react';
import { formatFileSize } from '../../data/mockFileSystem';
import styles from './FileExplorer.module.css';

const iconMap: Record<string, LucideIcon> = {
  home: Home,
  folder: Folder,
  'file-text': FileText,
  image: Image,
  music: Music,
  file: File,
  download: Download,
  monitor: Monitor,
  'file-spreadsheet': FileText,
  package: File,
};

export const FileExplorer = () => {
  const {
    viewMode,
    selectedItems,
    navigateTo,
    navigateUp,
    selectItem,
    clearSelection,
    setViewMode,
    getCurrentFolder,
    getCurrentChildren,
    getBreadcrumbs,
  } = useFileSystemStore();

  const currentFolder = getCurrentFolder();
  const children = getCurrentChildren();
  const breadcrumbs = getBreadcrumbs();

  const handleItemClick = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    selectItem(itemId, e.ctrlKey || e.metaKey);
  };

  const handleItemDoubleClick = (itemId: string, type: string) => {
    if (type === 'folder') {
      navigateTo(itemId);
    }
  };

  const handleContainerClick = () => {
    clearSelection();
  };

  const sortedChildren = [...children].sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className={styles.fileExplorer}>
      <div className={styles.toolbar}>
        <div className={styles.navigation}>
          <button className={styles.navButton} disabled title="Back">
            <ChevronLeft size={16} />
          </button>
          <button className={styles.navButton} disabled title="Forward">
            <ChevronRight size={16} />
          </button>
          <button
            className={styles.navButton}
            onClick={navigateUp}
            disabled={!currentFolder?.parentId}
            title="Up"
          >
            <ChevronUp size={16} />
          </button>
        </div>

        <div className={styles.breadcrumbs}>
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.id} className={styles.breadcrumbItem}>
              {index > 0 && <ChevronRight size={12} className={styles.breadcrumbSeparator} />}
              <button
                className={styles.breadcrumbButton}
                onClick={() => navigateTo(crumb.id)}
              >
                {crumb.name}
              </button>
            </span>
          ))}
        </div>

        <div className={styles.searchBox}>
          <Search size={14} />
          <input type="text" placeholder="Search..." />
        </div>

        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid view"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
            onClick={() => setViewMode('list')}
            title="List view"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <div className={styles.sidebarLabel}>
              <Star size={12} /> Favorites
            </div>
            <button className={styles.sidebarItem} onClick={() => navigateTo('documents')}>
              <Folder size={16} /> Documents
            </button>
            <button className={styles.sidebarItem} onClick={() => navigateTo('downloads')}>
              <Download size={16} /> Downloads
            </button>
            <button className={styles.sidebarItem} onClick={() => navigateTo('desktop')}>
              <Monitor size={16} /> Desktop
            </button>
          </div>

          <div className={styles.sidebarSection}>
            <div className={styles.sidebarLabel}>
              <Clock size={12} /> Recent
            </div>
            <button className={styles.sidebarItem} onClick={() => navigateTo('work-folder')}>
              <Folder size={16} /> Work
            </button>
          </div>

          <div className={styles.sidebarSection}>
            <div className={styles.sidebarLabel}>
              <Folder size={12} /> Folders
            </div>
            <button className={styles.sidebarItem} onClick={() => navigateTo('root')}>
              <Home size={16} /> Home
            </button>
            <button className={styles.sidebarItem} onClick={() => navigateTo('documents')}>
              <Folder size={16} /> Documents
            </button>
            <button className={styles.sidebarItem} onClick={() => navigateTo('pictures')}>
              <Image size={16} /> Pictures
            </button>
            <button className={styles.sidebarItem} onClick={() => navigateTo('music')}>
              <Music size={16} /> Music
            </button>
          </div>
        </div>

        <div className={styles.content} onClick={handleContainerClick}>
          {viewMode === 'grid' ? (
            <div className={styles.grid}>
              {sortedChildren.map(item => {
                const IconComponent = iconMap[item.icon || 'file'] || File;
                const isSelected = selectedItems.includes(item.id);

                return (
                  <button
                    key={item.id}
                    className={`${styles.gridItem} ${isSelected ? styles.selected : ''}`}
                    onClick={(e) => handleItemClick(item.id, e)}
                    onDoubleClick={() => handleItemDoubleClick(item.id, item.type)}
                  >
                    <div className={styles.gridItemIcon}>
                      <IconComponent size={36} strokeWidth={1.5} />
                    </div>
                    <span className={styles.gridItemName}>{item.name}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className={styles.list}>
              <div className={styles.listHeader}>
                <span className={styles.listHeaderName}>Name</span>
                <span className={styles.listHeaderDate}>Modified</span>
                <span className={styles.listHeaderSize}>Size</span>
              </div>
              {sortedChildren.map(item => {
                const IconComponent = iconMap[item.icon || 'file'] || File;
                const isSelected = selectedItems.includes(item.id);

                return (
                  <button
                    key={item.id}
                    className={`${styles.listItem} ${isSelected ? styles.selected : ''}`}
                    onClick={(e) => handleItemClick(item.id, e)}
                    onDoubleClick={() => handleItemDoubleClick(item.id, item.type)}
                  >
                    <span className={styles.listItemName}>
                      <IconComponent size={16} />
                      {item.name}
                    </span>
                    <span className={styles.listItemDate}>
                      {item.modifiedAt.toLocaleDateString()}
                    </span>
                    <span className={styles.listItemSize}>
                      {item.type === 'file' && item.size ? formatFileSize(item.size) : '--'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {sortedChildren.length === 0 && (
            <div className={styles.empty}>
              <Folder size={48} strokeWidth={1} />
              <p>This folder is empty</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.statusBar}>
        <span>{sortedChildren.length} items</span>
        {selectedItems.length > 0 && (
          <span>{selectedItems.length} selected</span>
        )}
      </div>
    </div>
  );
};
