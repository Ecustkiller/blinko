export function SettingType(
  {id, title, icon, children}:
  { id: string, title: string, icon?: React.ReactNode, children?: React.ReactNode}
) {
  return <div id={id} className="flex flex-col">
    <h2 className="text-xl w-full mt-8 font-bold flex items-center gap-2 mb-4">
      {icon}
      {title}
    </h2>
    {children}
  </div>
}
export function SettingRow({border = false, children, className}: { border?: boolean, children: React.ReactNode, className?: string}) {
  return <div className={`${border ? "border-b py-4" : ""} flex justify-between text-sm items-center ${className}`}>
    {children}
  </div>
}

export function FormItem({title, children}: { title: string, children: React.ReactNode}) {
  return <div className="flex flex-col my-2 w-full">
    <div className="text-sm text-gray-500 mb-2">{title}</div>
    {children}
  </div>
}