"use client";

import { useEffect, useState } from "react"
import { config } from './config'

export function SettingTab() {
  const [currentAnchor, setCurrentAnchor] = useState('about')

  useEffect(() => {
    setCurrentAnchor(config[0].anchor)
  }, [])
  return (
    <div className="w-56 border-r h-full min-h-screen bg-zinc-50 p-4">
      <ul>
        {
          config.map(item => {
            return (
              <li
                key={item.anchor}
                className={currentAnchor === item.anchor ? '!bg-zinc-900 text-white setting-anchor' : 'setting-anchor'}
                onClick={() => setCurrentAnchor(item.anchor)}
              >
                {item.icon}
                <a href={`#${item.anchor}`}>{item.title}</a>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}