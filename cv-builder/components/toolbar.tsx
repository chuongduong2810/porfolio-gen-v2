'use client'

import { Button, Input } from '@/components/ui'
import { useCvStore } from '@/store/cv-store'
import { Download } from 'lucide-react'
import Link from 'next/link'

export function Toolbar() {
  const title = useCvStore((s) => s.state.title)
  const templateId = useCvStore((s) => s.state.templateId)
  const setTitle = useCvStore((s) => s.setTitle)
  const setTemplate = useCvStore((s) => s.setTemplate)
  const exportPdf = useCvStore((s) => s.exportPdf)

  return (
    <div className="flex items-center gap-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-48"
      />
      <select
        className="h-10 rounded-md border bg-background px-3 text-sm"
        value={templateId}
        onChange={(e) => setTemplate(e.target.value as any)}
      >
        <option value="classic">Classic</option>
        <option value="compact">Compact</option>
      </select>
      <Button onClick={exportPdf} className="bg-secondary text-secondary-foreground border">
        <Download size={16} className="mr-2" /> Export PDF
      </Button>
      <Link href="#" className="text-sm text-muted-foreground hover:underline">
        Help
      </Link>
    </div>
  )
}

