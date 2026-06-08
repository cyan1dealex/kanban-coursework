import React, { useEffect, useState, useMemo } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import classes from './DescriptionEditor.module.css'
import { Dropdown } from '../Dropdown'

const extensions = [StarterKit]

const headingOptions = [
	{ id: 0, label: 'Обычный текст' },
	{ id: 1, label: 'Большой заголовок' },
	{ id: 2, label: 'Средний заголовок' },
	{ id: 3, label: 'Маленький заголовок' },
]

const listOptions = [
	{ id: '', label: 'Выбрать список' },
	{ id: 'bullet', label: 'Маркированный' },
	{ id: 'ordered', label: 'Нумерованный' },
]

export const DescriptionEditor = ({ initialData, onSave, onCancel }) => {
	const [, setUpdate] = useState(0)

	const editor = useEditor({
		extensions: extensions,
		content: initialData || '',
		immediatelyRender: false,
		autofocus: 'end',
	})

	useEffect(() => {
		if (!editor) return
		const update = () => setUpdate(s => s + 1)
		editor.on('transaction', update)
		return () => editor.off('transaction', update)
	}, [editor])

	const setLink = () => {
		const previousUrl = editor.getAttributes('link').href
		const url = prompt('Введите URL', previousUrl)
		if (url === null) return
		if (url === '') {
			editor.chain().focus().unsetLink().run()
			return
		}
		editor.chain().focus().setLink({ href: url }).run()
	}

	const currentHeading = useMemo(() => {
		if (!editor) return 'Обычный текст'
		return editor.isActive('heading', { level: 1 })
			? 'Большой заголовок'
			: editor.isActive('heading', { level: 2 })
				? 'Средний заголовок'
				: editor.isActive('heading', { level: 3 })
					? 'Маленький заголовок'
					: 'Обычный текст'
	}, [editor, editor?.isActive('heading')])

	const currentList = useMemo(() => {
		if (!editor) return 'Выбрать список'
		return editor.isActive('bulletList')
			? 'Маркированный'
			: editor.isActive('orderedList')
				? 'Нумерованный'
				: 'Выбрать список'
	}, [editor, editor?.isActive('bulletList'), editor?.isActive('orderedList')])

	if (!editor) return null

	return (
		<div className={classes.descriptionEditor}>
			<div className={classes.descriptionEditorToolbar}>
				<Dropdown
					title={currentHeading}
					options={headingOptions}
					style={
						currentHeading !== 'Обычный текст'
							? { borderColor: 'var(--color-accent)' }
							: undefined
					}
					onSelect={level => {
						if (level === 0) {
							editor.chain().focus().setParagraph().run()
						} else {
							editor.chain().focus().toggleHeading({ level }).run()
						}
					}}
				/>

				<button
					type='button'
					onPointerDown={e => e.preventDefault()}
					onClick={() => editor.chain().focus().toggleBold().run()}
					className={`${classes.descriptionEditorButtonBold} ${
						editor.isActive('bold') ? classes.active : ''
					}`}
				>
					B
				</button>
				<button
					type='button'
					onPointerDown={e => e.preventDefault()}
					onClick={() => editor.chain().focus().toggleItalic().run()}
					className={`${classes.descriptionEditorButtonItalic} ${
						editor.isActive('italic') ? classes.active : ''
					}`}
				>
					I
				</button>

				<Dropdown
					title={currentList}
					options={listOptions}
					style={
						currentList !== 'Выбрать список'
							? { borderColor: 'var(--color-accent)' }
							: undefined
					}
					onSelect={type => {
						if (type === 'bullet') {
							editor.chain().focus().toggleBulletList().run()
						} else if (type === 'ordered') {
							editor.chain().focus().toggleOrderedList().run()
						}
					}}
				/>

				<button
					className={classes.descriptionEditorLink}
					onPointerDown={e => e.preventDefault()}
					onClick={setLink}
				>
					Добавить ссылку
				</button>
			</div>

			<EditorContent
				className={classes.descriptionEditorTextarea}
				editor={editor}
			/>

			<div className={classes.editorActions}>
				<button
					className={classes.saveBtn}
					onClick={() => onSave(editor.getHTML())}
				>
					Сохранить
				</button>
				<button className={classes.cancelBtn} onClick={onCancel}>
					Отмена
				</button>
			</div>
		</div>
	)
}
