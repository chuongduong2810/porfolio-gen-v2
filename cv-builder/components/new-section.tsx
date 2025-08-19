'use client'

import { useCvStore } from '@/store/cv-store'
import { Button } from '@/components/ui'

export function AddSection() {
  const addSection = useCvStore((s) => s.addSection)
  return (
    <div className="flex items-center gap-2">
      <Button onClick={() => addSection('profile')}>Profile</Button>
      <Button onClick={() => addSection('experience')}>Experience</Button>
      <Button onClick={() => addSection('education')}>Education</Button>
      <Button onClick={() => addSection('skills')}>Skills</Button>
      <Button onClick={() => addSection('projects')}>Projects</Button>
      <Button onClick={() => addSection('languages')}>Languages</Button>
      <Button onClick={() => addSection('contact')}>Contact</Button>
      <Button onClick={() => addSection('custom')}>Custom</Button>
    </div>
  )
}

