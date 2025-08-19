'use client'

import { AnySection, ExperienceItem, ProjectItem, SkillItem } from '@/lib/types'
import { useCvStore } from '@/store/cv-store'
import { Input } from '@/components/ui'
import { RichTextEditor } from '@/components/tiptap'
import { generateId } from '@/lib/utils'

export function SectionEditor({ section }: { section: AnySection }) {
  const updateSection = useCvStore((s) => s.updateSection)

  switch (section.type) {
    case 'profile':
    case 'custom':
      return (
        <div className="space-y-2">
          <Input
            value={section.title}
            onChange={(e) => updateSection(section.id, { title: e.target.value })}
          />
          <RichTextEditor
            content={section.content.html}
            onChange={(html) => updateSection(section.id, { content: { ...section.content, html } })}
          />
        </div>
      )
    case 'experience': {
      const s = section
      return (
        <div className="space-y-4">
          <Input value={s.title} onChange={(e) => updateSection(s.id, { title: e.target.value })} />
          {s.items.map((item) => (
            <div key={item.id} className="space-y-2 rounded-md border p-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Input value={item.company} placeholder="Company" onChange={(e) => updateItem('experience', s.id, item.id, { company: e.target.value })} />
                <Input value={item.role} placeholder="Role" onChange={(e) => updateItem('experience', s.id, item.id, { role: e.target.value })} />
                <Input value={item.period} placeholder="Period" onChange={(e) => updateItem('experience', s.id, item.id, { period: e.target.value })} />
              </div>
              <RichTextEditor content={item.description.html} onChange={(html) => updateItem('experience', s.id, item.id, { description: { ...item.description, html } })} />
            </div>
          ))}
          <button className="text-sm underline" onClick={() => addItem('experience', s.id)}>+ Add experience</button>
        </div>
      )
    }
    case 'education': {
      const s = section
      return (
        <div className="space-y-4">
          <Input value={s.title} onChange={(e) => updateSection(s.id, { title: e.target.value })} />
          {s.items.map((item) => (
            <div key={item.id} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <Input value={item.institution} placeholder="Institution" onChange={(e) => updateItem('education', s.id, item.id, { institution: e.target.value })} />
              <Input value={item.degree} placeholder="Degree" onChange={(e) => updateItem('education', s.id, item.id, { degree: e.target.value })} />
              <Input value={item.period} placeholder="Period" onChange={(e) => updateItem('education', s.id, item.id, { period: e.target.value })} />
            </div>
          ))}
          <button className="text-sm underline" onClick={() => addItem('education', s.id)}>+ Add education</button>
        </div>
      )
    }
    case 'skills': {
      const s = section
      return (
        <div className="space-y-2">
          <Input value={s.title} onChange={(e) => updateSection(s.id, { title: e.target.value })} />
          <div className="flex flex-wrap gap-2">
            {s.items.map((item) => (
              <Input
                key={item.id}
                className="w-40"
                value={item.name}
                placeholder="Skill"
                onChange={(e) => updateItem('skills', s.id, item.id, { name: e.target.value })}
              />
            ))}
            <button className="text-sm underline" onClick={() => addItem('skills', s.id)}>+ Add skill</button>
          </div>
        </div>
      )
    }
    case 'projects': {
      const s = section
      return (
        <div className="space-y-4">
          <Input value={s.title} onChange={(e) => updateSection(s.id, { title: e.target.value })} />
          {s.items.map((item) => (
            <div key={item.id} className="space-y-2 rounded-md border p-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input value={item.name} placeholder="Name" onChange={(e) => updateItem('projects', s.id, item.id, { name: e.target.value })} />
                <Input value={item.link ?? ''} placeholder="Link" onChange={(e) => updateItem('projects', s.id, item.id, { link: e.target.value })} />
              </div>
              <RichTextEditor content={item.description.html} onChange={(html) => updateItem('projects', s.id, item.id, { description: { ...item.description, html } })} />
            </div>
          ))}
          <button className="text-sm underline" onClick={() => addItem('projects', s.id)}>+ Add project</button>
        </div>
      )
    }
    case 'languages': {
      const s = section
      return (
        <div className="space-y-2">
          <Input value={s.title} onChange={(e) => updateSection(s.id, { title: e.target.value })} />
          <div className="space-y-2">
            {s.items.map((item) => (
              <div key={item.id} className="grid grid-cols-2 gap-2">
                <Input value={item.name} placeholder="Language" onChange={(e) => updateItem('languages', s.id, item.id, { name: e.target.value })} />
                <Input value={item.level} placeholder="Level" onChange={(e) => updateItem('languages', s.id, item.id, { level: e.target.value })} />
              </div>
            ))}
            <button className="text-sm underline" onClick={() => addItem('languages', s.id)}>+ Add language</button>
          </div>
        </div>
      )
    }
    case 'contact': {
      const s = section
      return (
        <div className="space-y-2">
          <Input value={s.title} onChange={(e) => updateSection(s.id, { title: e.target.value })} />
          {s.fields.map((f) => (
            <div key={f.id} className="grid grid-cols-2 gap-2">
              <Input value={f.label} placeholder="Label" onChange={(e) => updateFieldLabel(s.id, f.id, e.target.value)} />
              <Input value={f.value} placeholder="Value" onChange={(e) => updateFieldValue(s.id, f.id, e.target.value)} />
            </div>
          ))}
          <button className="text-sm underline" onClick={() => addField(s.id)}>+ Add field</button>
        </div>
      )
    }
  }

  function addItem(type: 'experience' | 'education' | 'skills' | 'projects' | 'languages', sectionId: string) {
    switch (type) {
      case 'experience': {
        const item: ExperienceItem = {
          id: generateId('exp'),
          company: '',
          role: '',
          period: '',
          description: { id: generateId('rt'), html: '' },
        }
        updateSection(sectionId, (prev) => ({ items: [...prev.items, item] }))
        break
      }
      case 'education': {
        updateSection(sectionId, (prev) => ({ items: [...prev.items, { id: generateId('edu'), institution: '', degree: '', period: '' }] }))
        break
      }
      case 'skills': {
        const item: SkillItem = { id: generateId('skill'), name: '' }
        updateSection(sectionId, (prev) => ({ items: [...prev.items, item] }))
        break
      }
      case 'projects': {
        const item: ProjectItem = { id: generateId('proj'), name: '', link: '', description: { id: generateId('rt'), html: '' } }
        updateSection(sectionId, (prev) => ({ items: [...prev.items, item] }))
        break
      }
      case 'languages': {
        updateSection(sectionId, (prev) => ({ items: [...prev.items, { id: generateId('lang'), name: '', level: '' }] }))
        break
      }
    }
  }

  function updateItem(
    type: 'experience' | 'education' | 'skills' | 'projects' | 'languages',
    sectionId: string,
    itemId: string,
    changes: any
  ) {
    updateSection(sectionId, (prev) => ({
      items: prev.items.map((it: any) => (it.id === itemId ? { ...it, ...changes } : it)),
    }))
  }

  function addField(sectionId: string) {
    updateSection(sectionId, (prev) => ({
      fields: [...prev.fields, { id: generateId('field'), label: '', value: '' }],
    }))
  }
  function updateFieldLabel(sectionId: string, fieldId: string, label: string) {
    updateSection(sectionId, (prev) => ({
      fields: prev.fields.map((f: any) => (f.id === fieldId ? { ...f, label } : f)),
    }))
  }
  function updateFieldValue(sectionId: string, fieldId: string, value: string) {
    updateSection(sectionId, (prev) => ({
      fields: prev.fields.map((f: any) => (f.id === fieldId ? { ...f, value } : f)),
    }))
  }
}

