import { useState } from 'react';
import type { DesktopIcon as DesktopIconType } from '../../types';
import {
  Folder,
  Globe,
  FileText,
  Image,
  Music,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import styles from './Desktop.module.css';

interface DesktopIconProps {
  icon: DesktopIconType;
  onDoubleClick: () => void;
}

const iconMap: Record<string, LucideIcon> = {
  folder: Folder,
  globe: Globe,
  'file-text': FileText,
  image: Image,
  music: Music,
  settings: Settings,
};

export const DesktopIcon = ({ icon, onDoubleClick }: DesktopIconProps) => {
  const [isSelected, setIsSelected] = useState(false);
  const IconComponent = iconMap[icon.icon] || Folder;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSelected(true);
  };

  const handleBlur = () => {
    setIsSelected(false);
  };

  return (
    <button
      className={`${styles.desktopIcon} ${isSelected ? styles.selected : ''}`}
      onClick={handleClick}
      onDoubleClick={onDoubleClick}
      onBlur={handleBlur}
    >
      <div className={styles.iconWrapper}>
        <IconComponent size={40} strokeWidth={1.5} />
      </div>
      <span className={styles.iconLabel}>{icon.name}</span>
    </button>
  );
};
