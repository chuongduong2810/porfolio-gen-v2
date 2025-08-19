'use client'

import { Button, Input } from '@/components/ui'
import { useCvStore } from '@/store/cv-store'
import { Download } from 'lucide-react'
import Link from 'next/link'

export function Toolbar() {
  const title = useCvStore((s) => s.state.title)
  const setTitle = useCvStore((s) => s.setTitle)
  const exportPdf = useCvStore((s) => s.exportPdf)

  return (
    <div className="flex items-center gap-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-48"
      />
      <Button onClick={exportPdf} className="bg-secondary text-secondary-foreground border">
        <Download size={16} className="mr-2" /> Export PDF
      </Button>
      <Link href="#" className="text-sm text-muted-foreground hover:underline">
        Help
      </Link>
    </div>
  )
}

