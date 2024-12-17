'use client'
import { Toaster } from "@/components/ui/toaster"
import "./globals.scss";
import 'md-editor-rt/lib/style.css';
import 'md-editor-rt/lib/preview.css';
import 'react-photo-view/dist/react-photo-view.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

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
