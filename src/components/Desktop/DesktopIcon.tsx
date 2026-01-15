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

// Branded icons as simple colored divs with letters/symbols
const BrandedIcon = ({ type }: { type: string }) => {
  const brandStyles: Record<string, { bg: string; color: string; label: string }> = {
    'google-docs': { bg: '#4285F4', color: 'white', label: 'D' },
    'google-sheets': { bg: '#34A853', color: 'white', label: 'S' },
    'google-slides': { bg: '#FBBC04', color: 'white', label: 'P' },
    'ms-word': { bg: '#2B579A', color: 'white', label: 'W' },
    'ms-excel': { bg: '#217346', color: 'white', label: 'X' },
    'ms-powerpoint': { bg: '#D24726', color: 'white', label: 'P' },
    'figma': { bg: 'linear-gradient(135deg, #F24E1E 0%, #A259FF 50%, #1ABCFE 100%)', color: 'white', label: 'F' },
    'notion': { bg: '#000000', color: 'white', label: 'N' },
    'slack': { bg: '#4A154B', color: 'white', label: '#' },
    'spotify': { bg: '#1DB954', color: 'white', label: '♫' },
  };

  const style = brandStyles[type];
  if (!style) return null;

  return (
    <div
      className={styles.brandedIcon}
      style={{
        background: style.bg,
        color: style.color,
      }}
    >
      {style.label}
    </div>
  );
};

export const DesktopIcon = ({ icon, onDoubleClick }: DesktopIconProps) => {
  const [isSelected, setIsSelected] = useState(false);
  const IconComponent = iconMap[icon.icon];
  const isBranded = !IconComponent;

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
        {isBranded ? (
          <BrandedIcon type={icon.icon} />
        ) : (
          <IconComponent size={40} strokeWidth={1.5} />
        )}
      </div>
      <span className={styles.iconLabel}>{icon.name}</span>
    </button>
  );
};
