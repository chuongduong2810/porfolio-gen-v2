export type SectionType =
  | 'profile'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'languages'
  | 'contact'
  | 'custom'

export type TemplateId = 'classic' | 'compact'

export interface SectionBase {
  id: string
  type: SectionType
  title: string
}

export interface RichTextBlock {
  id: string
  html: string
}

export interface ProfileSection extends SectionBase {
  type: 'profile'
  content: RichTextBlock
}

export interface ExperienceItem {
  id: string
  company: string
  role: string
  period: string
  description: RichTextBlock
}

export interface ExperienceSection extends SectionBase {
  type: 'experience'
  items: ExperienceItem[]
}

export interface EducationItem {
  id: string
  institution: string
  degree: string
  period: string
  notes?: RichTextBlock
}

export interface EducationSection extends SectionBase {
  type: 'education'
  items: EducationItem[]
}

export interface SkillItem {
  id: string
  name: string
  level?: 'beginner' | 'intermediate' | 'advanced'
}

export interface SkillsSection extends SectionBase {
  type: 'skills'
  items: SkillItem[]
}

export interface ProjectItem {
  id: string
  name: string
  link?: string
  description: RichTextBlock
}

export interface ProjectsSection extends SectionBase {
  type: 'projects'
  items: ProjectItem[]
}

export interface LanguagesSection extends SectionBase {
  type: 'languages'
  items: { id: string; name: string; level: string }[]
}

export interface ContactSection extends SectionBase {
  type: 'contact'
  fields: { id: string; label: string; value: string }[]
}

export interface CustomSection extends SectionBase {
  type: 'custom'
  content: RichTextBlock
}

export type AnySection =
  | ProfileSection
  | ExperienceSection
  | EducationSection
  | SkillsSection
  | ProjectsSection
  | LanguagesSection
  | ContactSection
  | CustomSection

export interface CvState {
  title: string
  sections: AnySection[]
  layout: string[]
  layoutMeta: Record<string, number>
  templateId: TemplateId
}

