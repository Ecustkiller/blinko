import { open } from '@tauri-apps/plugin-shell';
import Link from 'next/link';

export const OpenBroswer = ({ title, url }: { title: string, url: string }) => {
  return (
    <Link 
      className="underline hover:text-zinc-900 "
      href={'#'}
      onClick={() => {open(url)}}
    >{title}</Link>
  );
};