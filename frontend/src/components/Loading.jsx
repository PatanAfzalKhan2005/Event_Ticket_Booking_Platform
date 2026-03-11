import React from 'react'

export default function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="flex items-center gap-3 rounded-full border border-primary/15 bg-white px-5 py-3 shadow-soft">
        <span className="h-3 w-3 animate-pulse rounded-full bg-primary" />
        <span className="text-sm font-semibold text-slate-700">Loading EventSphere...</span>
      </div>
    </div>
  )
}
