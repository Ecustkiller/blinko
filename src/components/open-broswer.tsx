import { open } from '@tauri-apps/plugin-shell';
import Link from 'next/link';

export const OpenBroswer = ({ title, url, className }: { title: string, url: string, className?: string }) => {
  return (
    <Link 
      className={`underline hover:text-zinc-900 ${className}`}
      href={'#'}
      onClick={() => {open(url)}}
    >{title}</Link>
  );
};