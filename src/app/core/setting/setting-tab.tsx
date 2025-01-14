"use client";

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation";
import config from './config'

export function SettingTab() {
  const [currentAnchor, setCurrentAnchor] = useState('about')
  const searchParams = useSearchParams()

  function handleAnchor(anchor: string) {
    setCurrentAnchor(anchor)
    const settingForm = document.querySelector('#setting-form')
    const titleDom = document.querySelector<HTMLElement>(`#${anchor}`)
    if (settingForm && titleDom) {
      const y = titleDom?.offsetTop - 16
      settingForm.scrollTop = y || 0
    }
  }

  useEffect(() => {
    const anchor = searchParams.get('anchor')
    if (anchor) {
      handleAnchor(anchor)
    } else {
      setCurrentAnchor(config[0].anchor)
    }
  }, [])
  return (
    <div className="w-56 border-r h-full min-h-screen bg-sidebar p-4">
      <ul>
        {
          config.map(item => {
            return (
              <li
                key={item.anchor}
                className={currentAnchor === item.anchor ? '!bg-zinc-800 text-white setting-anchor' : 'setting-anchor'}
                onClick={() => handleAnchor(item.anchor)}
              >
                {item.icon}
                <span>{item.title}</span>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}