'use client'

import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { Card, CardContent, CardHeader } from '@/components/ui'
import { AnySection } from '@/lib/types'
import { SectionEditor } from '@/components/section-editor'
import { GripVertical, Trash2 } from 'lucide-react'
import { useCvStore } from '@/store/cv-store'

export function SortableSection({ section }: { section: AnySection }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id })
  const removeSection = useCvStore((s) => s.removeSection)
  const setSectionWidth = useCvStore((s) => s.setSectionWidth)
  const layoutMeta = useCvStore((s) => s.state.layoutMeta)
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }
  return (
    <div ref={setNodeRef} style={style}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <button className="cursor-grab" {...attributes} {...listeners}>
              <GripVertical size={16} />
            </button>
            <div className="font-medium">{section.title}</div>
          </div>
          <div className="flex items-center gap-2">
            <select
              aria-label="Section width"
              className="h-8 rounded-md border bg-background px-2 text-sm"
              value={String(layoutMeta?.[section.id] ?? 12)}
              onChange={(e) => setSectionWidth(section.id, parseInt(e.target.value))}
            >
              <option value={12}>Full</option>
              <option value={6}>1/2</option>
              <option value={4}>1/3</option>
            </select>
            <button className="text-red-500" onClick={() => removeSection(section.id)}>
              <Trash2 size={16} />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <SectionEditor section={section} />
        </CardContent>
      </Card>
    </div>
  )
}

