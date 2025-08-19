'use client'
export const dynamic = 'force-dynamic'

import { useEffect } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Toolbar } from '@/components/toolbar'
import { Canvas } from '@/components/canvas'
import { Preview } from '@/components/preview'
import { useCvStore } from '@/store/cv-store'

export default function HomePage() {
  const hydrate = useCvStore((s) => s.hydrate)
  useEffect(() => {
    hydrate()
  }, [hydrate])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex h-14 items-center justify-between gap-4">
          <div className="font-semibold">CV Builder</div>
          <div className="flex items-center gap-2">
            <Toolbar />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="container flex flex-1 gap-6 py-6">
        <div className="w-full lg:w-1/2">
          <Canvas />
        </div>
        <div className="hidden lg:block w-1/2">
          <Preview />
        </div>
      </main>
    </div>
  )
}

