import React from 'react'
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer'
import { CvState } from '@/lib/types'

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 11, fontFamily: 'Helvetica' },
  title: { fontSize: 20, marginBottom: 12 },
  section: { marginBottom: 12 },
  heading: { fontSize: 14, marginBottom: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  bullet: { marginLeft: 12 },
})

export function CvPdfDocument({ state }: { state: CvState }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{state.title}</Text>
        {state.layout.map((id) => {
          const sec = state.sections.find((s) => s.id === id)
          if (!sec) return null
          return (
            <View key={id} style={styles.section} wrap>
              <Text style={styles.heading}>{sec.title}</Text>
              {renderSection(sec)}
            </View>
          )
        })}
      </Page>
    </Document>
  )
}

function renderSection(section: any): React.ReactNode {
  switch (section.type) {
    case 'profile':
    case 'custom':
      return <Text>{stripHtml(section.content.html)}</Text>
    case 'experience':
      return (
        <View>
          {section.items.map((it: any) => (
            <View key={it.id}>
              <View style={styles.row}>
                <Text>
                  {it.role} {it.company ? `• ${it.company}` : ''}
                </Text>
                <Text>{it.period}</Text>
              </View>
              <Text style={styles.bullet}>{stripHtml(it.description.html)}</Text>
            </View>
          ))}
        </View>
      )
    case 'education':
      return (
        <View>
          {section.items.map((it: any) => (
            <Text key={it.id}>
              {it.institution} — {it.degree} ({it.period})
            </Text>
          ))}
        </View>
      )
    case 'skills':
      return (
        <Text>{section.items.map((it: any) => it.name).filter(Boolean).join(', ')}</Text>
      )
    case 'projects':
      return (
        <View>
          {section.items.map((it: any) => (
            <View key={it.id}>
              {it.link ? <Link src={it.link}>{it.name}</Link> : <Text>{it.name}</Text>}
              <Text style={styles.bullet}>{stripHtml(it.description.html)}</Text>
            </View>
          ))}
        </View>
      )
    case 'languages':
      return (
        <View>
          {section.items.map((it: any) => (
            <Text key={it.id}>
              {it.name} — {it.level}
            </Text>
          ))}
        </View>
      )
    case 'contact':
      return (
        <View>
          {section.fields.map((f: any) => (
            <Text key={f.id}>
              {f.label}: {f.value}
            </Text>
          ))}
        </View>
      )
  }
}

function stripHtml(html: string): string {
  if (!html) return ''
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

