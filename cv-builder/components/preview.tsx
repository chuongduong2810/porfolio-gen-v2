'use client'

import { Card, CardContent, CardHeader } from '@/components/ui'
import { useCvStore } from '@/store/cv-store'

export function Preview() {
  const state = useCvStore((s) => s.state)
  return (
    <Card className="sticky top-6 h-[calc(100vh-6rem)] overflow-auto">
      <CardHeader>
        <div className="font-medium">Live Preview</div>
      </CardHeader>
      <CardContent>
        {state.templateId === 'compact' ? (
          <CompactPreview state={state} />
        ) : (
          <ClassicPreview state={state} />
        )}
      </CardContent>
    </Card>
  )
}

function ClassicPreview({ state }: { state: any }) {
  return (
    <div className="mx-auto w-[900px] max-w-full bg-white dark:bg-zinc-900 shadow p-8">
      <h1 className="text-2xl font-bold mb-4">{state.title}</h1>
      <div className="grid grid-cols-12 gap-4">
        {state.layout.map((id: string) => {
          const sec = state.sections.find((s: any) => s.id === id)
          if (!sec) return null
          const width = state.layoutMeta?.[id] ?? 12
          const spanClass = width === 6 ? 'col-span-12 md:col-span-6' : width === 4 ? 'col-span-12 md:col-span-4' : 'col-span-12'
          return (
            <div key={id} className={spanClass}>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{sec.title}</h2>
                {renderSection(sec)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CompactPreview({ state }: { state: any }) {
  const sidebarTypes = new Set(['contact', 'skills', 'languages'])
  const mainTypes = new Set(['profile', 'experience', 'projects', 'education', 'custom'])

  return (
    <div className="mx-auto w-[850px] max-w-full bg-white dark:bg-zinc-900 shadow p-6">
      <div className="flex items-end justify-between border-b pb-3 mb-4">
        <h1 className="text-2xl font-bold">{state.title}</h1>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-4">
          {state.layout.map((id: string) => {
            const sec = state.sections.find((s: any) => s.id === id)
            if (!sec || !sidebarTypes.has(sec.type)) return null
            return (
              <div key={id} className="mb-4">
                <h2 className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{sec.title}</h2>
                <div className="text-sm">
                  {renderSection(sec)}
                </div>
              </div>
            )
          })}
        </div>
        <div className="col-span-12 md:col-span-8">
          {state.layout.map((id: string) => {
            const sec = state.sections.find((s: any) => s.id === id)
            if (!sec || !mainTypes.has(sec.type)) return null
            const showHeading = sec.type !== 'profile'
            return (
              <div key={id} className="mb-4">
                {showHeading && (
                  <h2 className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground border-b pb-1 mb-2">
                    {sec.title}
                  </h2>
                )}
                <div className="text-sm">
                  {renderSection(sec)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function renderSection(section: any) {
  switch (section.type) {
    case 'profile':
    case 'custom':
      return <div dangerouslySetInnerHTML={{ __html: section.content.html }} />
    case 'experience':
      return (
        <div className="space-y-3">
          {section.items.map((it: any) => (
            <div key={it.id}>
              <div className="flex justify-between font-medium">
                <span>
                  {it.role} {it.company && `• ${it.company}`}
                </span>
                <span className="text-sm text-muted-foreground">{it.period}</span>
              </div>
              <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: it.description.html }} />
            </div>
          ))}
        </div>
      )
    case 'education':
      return (
        <ul className="list-disc pl-5">
          {section.items.map((it: any) => (
            <li key={it.id}>
              <span className="font-medium">{it.institution}</span> — {it.degree} ({it.period})
            </li>
          ))}
        </ul>
      )
    case 'skills':
      return (
        <div className="flex flex-wrap gap-2">
          {section.items.map((it: any) => (
            <span key={it.id} className="rounded bg-zinc-100 dark:bg-zinc-800 px-2 py-1 text-sm">
              {it.name}
            </span>
          ))}
        </div>
      )
    case 'projects':
      return (
        <div className="space-y-3">
          {section.items.map((it: any) => (
            <div key={it.id}>
              <div className="font-medium">
                {it.link ? (
                  <a href={it.link} className="text-primary underline" target="_blank" rel="noreferrer">
                    {it.name}
                  </a>
                ) : (
                  it.name
                )}
              </div>
              <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: it.description.html }} />
            </div>
          ))}
        </div>
      )
    case 'languages':
      return (
        <ul className="list-disc pl-5">
          {section.items.map((it: any) => (
            <li key={it.id}>
              {it.name} — {it.level}
            </li>
          ))}
        </ul>
      )
    case 'contact':
      return (
        <div className="grid grid-cols-2 gap-2">
          {section.fields.map((f: any) => (
            <div key={f.id}>
              <span className="font-medium">{f.label}:</span> {f.value}
            </div>
          ))}
        </div>
      )
  }
}

