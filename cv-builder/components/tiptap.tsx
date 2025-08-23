'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import BulletList from '@tiptap/extension-bullet-list'
import ListItem from '@tiptap/extension-list-item'

export function RichTextEditor({ content, onChange }: { content: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit.configure({}), Underline, BulletList, ListItem],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: { class: 'prose dark:prose-invert max-w-none min-h-[120px] p-3 border rounded-md' },
    },
  })

  if (!editor) return null
  return (
    <div>
      <div className="flex gap-2 mb-2 text-sm">
        <button className="px-2 py-1 border rounded" onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
        <button className="px-2 py-1 border rounded" onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
        <button className="px-2 py-1 border rounded" onClick={() => editor.chain().focus().toggleUnderline().run()}>Underline</button>
        <button className="px-2 py-1 border rounded" onClick={() => editor.chain().focus().toggleBulletList().run()}>Bullets</button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

