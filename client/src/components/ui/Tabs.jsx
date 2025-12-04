import { useState } from 'react'
import './Tabs.css'

export default function Tabs({ tabs, initial, onChange }) {
  const [active, setActive] = useState(initial || tabs[0]?.value)
  const set = (v) => { setActive(v); onChange?.(v) }
  return (
    <div className="ui-tabs">
      {tabs.map(t => (
        <button key={t.value} onClick={() => set(t.value)} className={`ui-tabs__btn ${active === t.value ? 'ui-tabs__btn--active' : ''}`}>{t.label}</button>
      ))}
    </div>
  )
}