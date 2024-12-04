"use client";

export function SettingTitle({title, anchor, icon}: {title: string, anchor: string, icon?: React.ReactNode}) {
  return (
    <h2 id={anchor} className="text-lg font-bold border-b pb-2 pt-4 flex gap-2 items-center">
      {icon}
      {title}
    </h2>
  )
}