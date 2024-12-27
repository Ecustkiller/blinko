import { TrayIcon, TrayIconOptions } from '@tauri-apps/api/tray';
import { defaultWindowIcon } from '@tauri-apps/api/app';
import { Image } from '@tauri-apps/api/image';
import { getCurrentWindow } from '@tauri-apps/api/window';

let tray: TrayIcon;

export default async function createTray() {
  const icon = await defaultWindowIcon() as Image;
  
  const options: TrayIconOptions = {
    id: 'tray',
    icon,
    action: async(event) => {
      switch (event.type) {
        case 'Click':
          const window = getCurrentWindow();
          if (!await window.isVisible()) {
            window.show()
          } else {
            window.setFocus()
          }
          break;
      }
    },
  };

  tray = await TrayIcon.new(options);

  return tray;
}
