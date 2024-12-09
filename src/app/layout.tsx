'use client'
import { Toaster } from "@/components/ui/toaster"
import "./globals.scss";
import 'md-editor-rt/lib/style.css';
import 'md-editor-rt/lib/preview.css';
import { restoreStateCurrent, saveWindowState, StateFlags } from '@tauri-apps/plugin-window-state';
import { useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  useEffect(() => {
    restoreStateCurrent(StateFlags.ALL);
    listen('tauri://resize', async() => {
      if (StateFlags) {
        await saveWindowState(StateFlags.ALL);
      }
    })
  }, [])

  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <body>
          {children}
          <Toaster />
        </body>
      </html>
    </>
  );
}
