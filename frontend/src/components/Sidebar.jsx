import React from 'react'

export default function Sidebar({ items, activeSection, onSelect }) {
  return (
    <aside className="rounded-3xl border border-primary/10 bg-white p-4 shadow-soft">
      <div className="mb-4 px-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Workspace</div>
      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
              activeSection === item.id
                ? 'bg-primary text-white shadow-purple'
                : 'bg-slate-50 text-slate-600 hover:bg-primary/8 hover:text-primary-dark'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}
