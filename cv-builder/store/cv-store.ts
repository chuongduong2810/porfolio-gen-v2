'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AnySection, CvState, SectionType, TemplateId } from '@/lib/types'
import { generateId } from '@/lib/utils'
import React from 'react'

type UpdateSectionArg = Partial<AnySection> | ((prev: any) => Partial<AnySection>)

interface CvStore {
  state: CvState
  hydrate: () => void
  setTitle: (title: string) => void
  setLayout: (layout: string[]) => void
  setSectionWidth: (id: string, width: number) => void
  setTemplate: (templateId: TemplateId) => void
  addSection: (type: SectionType) => void
  removeSection: (id: string) => void
  updateSection: (id: string, changes: UpdateSectionArg) => void
  exportPdf: () => Promise<void>
}

const initialState: CvState = {
  title: 'Untitled CV',
  sections: [],
  layout: [],
  layoutMeta: {},
  templateId: 'classic',
}

export const useCvStore = create<CvStore>()(
  persist(
    (set, get) => ({
      state: initialState,
      hydrate: () => set((s) => ({ state: { ...initialState, ...s.state } })),
      setTitle: (title) => set((s) => ({ state: { ...s.state, title } })),
      setLayout: (layout) => set((s) => ({ state: { ...s.state, layout } })),
      setSectionWidth: (id, width) => set((s) => ({
        state: {
          ...s.state,
          layoutMeta: { ...(s.state.layoutMeta || {}), [id]: width },
        },
      })),
      setTemplate: (templateId) => set((s) => ({ state: { ...s.state, templateId } })),
      addSection: (type) => set((s) => {
        const id = generateId('sec')
        const base = { id, type, title: type === 'custom' ? 'Custom' : capitalize(type) } as AnySection
        let section: AnySection
        switch (type) {
          case 'profile':
            section = { ...base, type: 'profile', content: { id: generateId('rt'), html: '<p>Write a short profile...</p>' } }
            break
          case 'experience':
            section = { ...base, type: 'experience', items: [] }
            break
          case 'education':
            section = { ...base, type: 'education', items: [] }
            break
          case 'skills':
            section = { ...base, type: 'skills', items: [] }
            break
          case 'projects':
            section = { ...base, type: 'projects', items: [] }
            break
          case 'languages':
            section = { ...base, type: 'languages', items: [] }
            break
          case 'contact':
            section = { ...base, type: 'contact', fields: [] }
            break
          case 'custom':
          default:
            section = { ...base, type: 'custom', content: { id: generateId('rt'), html: '' } }
            break
        }
        return {
          state: {
            ...s.state,
            sections: [...s.state.sections, section],
            layout: [...s.state.layout, id],
            layoutMeta: { ...(s.state.layoutMeta || {}), [id]: 12 },
          },
        }
      }),
      removeSection: (id) => set((s) => ({
        state: {
          ...s.state,
          sections: s.state.sections.filter((sec) => sec.id !== id),
          layout: s.state.layout.filter((x) => x !== id),
        },
      })),
      updateSection: (id, changes) => set((s) => {
        const updated = s.state.sections.map((sec) => {
          if (sec.id !== id) return sec
          const partial = typeof changes === 'function' ? (changes as any)(sec) : changes
          return { ...sec, ...partial } as AnySection
        })
        return { state: { ...s.state, sections: updated } }
      }),
      exportPdf: async () => {
        const current = get().state
        const [{ pdf }, templates] = await Promise.all([
          import('@react-pdf/renderer'),
          import('@/templates'),
        ])
        const Component = current.templateId === 'compact'
          ? (templates as any).CompactCvPdfDocument
          : (templates as any).ClassicCvPdfDocument
        const element = React.createElement(Component, { state: current })
        const blob = await pdf(element as any).toBlob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${current.title.replace(/\s+/g, '-')}.pdf`
        a.click()
        URL.revokeObjectURL(url)
      },
    }),
    { name: 'cv-builder' }
  )
)

function capitalize<T extends string>(s: T): Capitalize<T> {
  return (s.charAt(0).toUpperCase() + s.slice(1)) as Capitalize<T>
}

