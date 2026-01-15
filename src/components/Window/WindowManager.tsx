import { useWindowStore } from '../../stores/windowStore';
import { Window } from './Window';
import { FileExplorer } from '../../apps/FileExplorer/FileExplorer';
import { Notes } from '../../apps/Notes/Notes';
import { Browser } from '../../apps/Browser/Browser';
import { Settings } from '../../apps/Settings/Settings';
import { PlaceholderApp } from '../../apps/PlaceholderApp';

const appComponents: Record<string, React.ComponentType> = {
  'file-explorer': FileExplorer,
  'notes': Notes,
  'browser': Browser,
  'settings': Settings,
  'photos': PlaceholderApp,
  'music': PlaceholderApp,
};

export const WindowManager = () => {
  const windows = useWindowStore(state => state.windows);

  return (
    <>
      {windows.map(win => {
        const AppComponent = appComponents[win.appId] || PlaceholderApp;
        return (
          <Window key={win.id} window={win}>
            <AppComponent />
          </Window>
        );
      })}
    </>
  );
};
