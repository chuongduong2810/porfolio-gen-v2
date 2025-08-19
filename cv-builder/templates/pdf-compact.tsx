import React from 'react'
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer'
import { CvState } from '@/lib/types'

const styles = StyleSheet.create({
  page: { padding: 28, fontSize: 10, fontFamily: 'Helvetica' },
  titleRow: { paddingBottom: 8, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  title: { fontSize: 18 },
  grid: { flexDirection: 'row', gap: 16 },
  col: { flexDirection: 'column', flexGrow: 1 },
  colSidebar: { width: '32%' },
  colMain: { width: '68%' },
  section: { marginBottom: 8 },
  headingSidebar: { fontSize: 10, marginBottom: 4, textTransform: 'uppercase', color: '#6b7280' },
  headingMain: { fontSize: 10, marginBottom: 4, textTransform: 'uppercase', color: '#6b7280', paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  bullet: { marginLeft: 10 },
})

export function CvPdfDocument({ state }: { state: CvState }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{state.title}</Text>
        </View>
        <View style={styles.grid}>
          <View style={[styles.col, styles.colSidebar]}>
            {state.layout.map((id) => {
              const sec = state.sections.find((s) => s.id === id)
              if (!sec || !['contact', 'skills', 'languages'].includes(sec.type)) return null
              return (
                <View key={id} style={styles.section} wrap>
                  <Text style={styles.headingSidebar}>{sec.title}</Text>
                  {renderSection(sec)}
                </View>
              )
            })}
          </View>
          <View style={[styles.col, styles.colMain]}>
            {state.layout.map((id) => {
              const sec = state.sections.find((s) => s.id === id)
              if (!sec || ['contact', 'skills', 'languages'].includes(sec.type)) return null
              const showHeading = sec.type !== 'profile'
              return (
                <View key={id} style={styles.section} wrap>
                  {showHeading && <Text style={styles.headingMain}>{sec.title}</Text>}
                  {renderSection(sec)}
                </View>
              )
            })}
          </View>
        </View>
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


