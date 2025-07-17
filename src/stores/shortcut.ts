import { create } from 'zustand';
import { Store } from "@tauri-apps/plugin-store";
import { register, unregisterAll } from '@tauri-apps/plugin-global-shortcut';
import emitter from '@/lib/emitter';

interface Shortcut {
  key: string,
  value: string,
}

interface SettingState {
  initShortcut: () => Promise<void>,
  setShortcut: (key: string, value: string) => void,
  shortcuts: Shortcut[],
}

async function initShortcut(shortcut: Shortcut) {
  await unregisterAll()
  try {
    await register(shortcut.value, (event) => {
      if (event.state === 'Pressed') {
        emitter.emit(shortcut.key)
      }
    });
  } catch (error) {
    console.error(`Failed to register shortcut ${shortcut.value}:`, error);
  }
}

const useShortcutStore = create<SettingState>((set, get) => ({

  initShortcut: async () => {
    const store = await Store.load('store.json');
    const shortcuts = await store.get<Shortcut[]>('shortcuts')
    if (shortcuts && shortcuts.length) {
      shortcuts.forEach(async (shortcut) => {
        set({ [shortcut.key]: shortcut.value })
        await initShortcut(shortcut)
      })
    } else {
      await store.set('shortcuts', get().shortcuts)
      get().shortcuts.forEach(async (shortcut) => {
        await initShortcut(shortcut)
      })
    }
  },

  setShortcut: async (key: string, value: string) => {
    const store = await Store.load('store.json');
    await store.set(key, value)
    set({ [key]: value })
  },

  shortcuts: [
    {
      key: 'quickRecordText',
      value: 'CommandOrControl+Shift+C'
    }
  ],
}))

export default useShortcutStore