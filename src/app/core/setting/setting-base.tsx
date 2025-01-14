export function SettingType({title, children}: { title: string, children?: React.ReactNode}) {
  return <div className="flex flex-col">
    <h2 className="text-lg border-b w-full my-4 pb-2 font-bold">{title}</h2>
    {children}
  </div>
}
export function SettingRow({children}: { children: React.ReactNode}) {
  return <div className="flex justify-between text-sm">
    {children}
  </div>
}

export function FormItem({title, children}: { title: string, children: React.ReactNode}) {
  return <div className="flex flex-col my-2 w-full">
    <div className="text-sm text-gray-500">{title}</div>
    {children}
  </div>
}