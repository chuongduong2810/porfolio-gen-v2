'use client'

import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { Card, CardContent, CardHeader } from '@/components/ui'
import { useCvStore } from '@/store/cv-store'
import { SortableSection } from '@/components/sortable-section'
import { AddSection } from '@/components/new-section'

export function Canvas() {
  const sensors = useSensors(useSensor(PointerSensor))
  const sections = useCvStore((s) => s.state.sections)
  const layout = useCvStore((s) => s.state.layout)
  const setLayout = useCvStore((s) => s.setLayout)

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = layout.indexOf(active.id as string)
    const newIndex = layout.indexOf(over.id as string)
    setLayout(arrayMove(layout, oldIndex, newIndex))
  }

  return (
    <Card>
      <CardHeader>
        <div className="font-medium">Layout Editor</div>
        <AddSection />
      </CardHeader>
      <CardContent>
        <DndContext sensors={sensors} onDragEnd={onDragEnd}>
          <SortableContext items={layout} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-3">
              {layout.map((id) => {
                const section = sections.find((s) => s.id === id)
                if (!section) return null
                return <SortableSection key={id} section={section} />
              })}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  )
}

