import { Construction } from 'lucide-react';
import styles from './PlaceholderApp.module.css';

export const PlaceholderApp = () => {
  return (
    <div className={styles.placeholder}>
      <Construction size={48} strokeWidth={1.5} />
      <h2 className={styles.title}>Coming Soon</h2>
      <p className={styles.description}>
        This application is under construction and will be available in a future update.
      </p>
    </div>
  );
};
