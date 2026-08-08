'use client'

import { useEffect, useId, useRef, useState } from 'react'
import {
  Ban,
  Check,
  ChevronDown,
  CreditCard,
  Database,
  Gauge,
  Globe2,
  Layers3,
  Lock,
  MessagesSquare,
  Server,
  Shield,
  Sparkles,
  Workflow,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import {
  normalizeTechnicalHighlights,
  TECHNICAL_HIGHLIGHT_ICON_KEYS,
  type TechnicalHighlight,
  type TechnicalHighlightIcon,
} from '@/types/project'
import DashboardSelect from './DashboardSelect'

export interface ProjectRow {
  id?: string
  title: string
  slug: string
  classification: 'production' | 'personal'
  description: string
  image_url: string
  live_url: string
  github_url: string | null
  show_view_project: boolean
  show_source: boolean
  tech_stack: string[]
  project_subtitle: string
  organization: string
  project_year: number | null
  project_context: string
  key_features: string[]
  gallery_images: string[]
  show_technical_highlights: boolean
  technical_highlights: TechnicalHighlight[]
  status: 'published' | 'draft'
  sort_order: number
}

type ListField = 'key_features' | 'gallery_images'

export const MAX_KEY_FEATURES = 6
export const MAX_GALLERY_IMAGES = 4
export const MAX_TECHNICAL_HIGHLIGHTS = 5

const LIST_LIMITS: Record<ListField, number> = {
  key_features: MAX_KEY_FEATURES,
  gallery_images: MAX_GALLERY_IMAGES,
}

const TECHNICAL_HIGHLIGHT_ICON_OPTIONS: Array<{
  key: TechnicalHighlightIcon
  label: string
  Icon: LucideIcon
}> = [
  { key: 'shield', label: 'Shield', Icon: Shield },
  { key: 'lock', label: 'Lock', Icon: Lock },
  { key: 'database', label: 'Database', Icon: Database },
  { key: 'workflow', label: 'Workflow', Icon: Workflow },
  { key: 'globe', label: 'Globe', Icon: Globe2 },
  { key: 'messages', label: 'Messages', Icon: MessagesSquare },
  { key: 'credit-card', label: 'Payment', Icon: CreditCard },
  { key: 'gauge', label: 'Performance', Icon: Gauge },
  { key: 'layers', label: 'Layers', Icon: Layers3 },
  { key: 'server', label: 'Server', Icon: Server },
  { key: 'zap', label: 'Speed', Icon: Zap },
  { key: 'sparkles', label: 'Sparkles', Icon: Sparkles },
]

function TechnicalHighlightIconPicker({
  value,
  onValueChange,
  label,
}: {
  value: TechnicalHighlightIcon | null
  onValueChange: (value: TechnicalHighlightIcon | null) => void
  label: string
}) {
  const pickerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])
  const listboxId = useId()
  const options = [{ key: null, label: 'No icon', Icon: Ban }, ...TECHNICAL_HIGHLIGHT_ICON_OPTIONS]
  const selectedIndex = Math.max(0, options.findIndex(option => option.key === value))
  const selected = options[selectedIndex]
  const [open, setOpen] = useState(false)
  const [opensUpward, setOpensUpward] = useState(false)
  const [menuMaxHeight, setMenuMaxHeight] = useState(288)
  const [focusedIndex, setFocusedIndex] = useState(selectedIndex)
  const SelectedIcon = selected.Icon

  const updateMenuPosition = () => {
    const trigger = triggerRef.current
    if (!trigger) return

    const collisionPadding = 12
    const maxHeight = 288
    const rect = trigger.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom - collisionPadding
    const spaceAbove = rect.top - collisionPadding
    const nextOpensUpward = spaceBelow < maxHeight && spaceAbove > spaceBelow
    const availableHeight = nextOpensUpward ? spaceAbove : spaceBelow

    setOpensUpward(nextOpensUpward)
    setMenuMaxHeight(Math.max(1, Math.min(maxHeight, availableHeight)))
  }

  useEffect(() => {
    if (!open) return

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) setOpen(false)
    }

    updateMenuPosition()
    document.addEventListener('pointerdown', closeOnOutsidePointer)
    window.addEventListener('resize', updateMenuPosition)
    window.addEventListener('scroll', updateMenuPosition, true)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer)
      window.removeEventListener('resize', updateMenuPosition)
      window.removeEventListener('scroll', updateMenuPosition, true)
    }
  }, [open])

  const closeAndRestoreFocus = () => {
    setOpen(false)
    requestAnimationFrame(() => triggerRef.current?.focus())
  }

  const focusOption = (index: number) => {
    setFocusedIndex(index)
    requestAnimationFrame(() => optionRefs.current[index]?.focus())
  }

  const selectOption = (index: number) => {
    onValueChange(options[index].key)
    closeAndRestoreFocus()
  }

  const openListbox = () => {
    updateMenuPosition()
    setFocusedIndex(selectedIndex)
    setOpen(true)
    requestAnimationFrame(() => optionRefs.current[selectedIndex]?.focus())
  }

  const handleOptionKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeAndRestoreFocus()
      return
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      focusOption((focusedIndex + direction + options.length) % options.length)
      return
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      focusOption(event.key === 'Home' ? 0 : options.length - 1)
      return
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectOption(focusedIndex)
    }
  }

  return (
    <div ref={pickerRef} className="relative w-full lg:w-48">
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        onClick={() => open ? closeAndRestoreFocus() : openListbox()}
        onKeyDown={event => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            openListbox()
          }
        }}
        className="flex min-h-10 w-full items-center gap-2 rounded-lg border border-white/[0.12] bg-white/[0.045] px-3 text-sm text-white/75 transition-colors hover:border-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
      >
        <SelectedIcon className={selected.key ? 'h-4 w-4 shrink-0 text-[#D4AF37]' : 'h-4 w-4 shrink-0 text-white/35'} aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-left">{selected.label}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-white/35 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={label}
          data-lenis-prevent
          style={{ maxHeight: `${menuMaxHeight}px` }}
          className={`technical-highlight-icon-scroll absolute right-0 z-[300] w-full min-w-[12rem] touch-pan-y overflow-x-hidden overflow-y-auto overscroll-contain rounded-lg border border-white/[0.12] bg-[#171717] p-1 shadow-[0_12px_32px_rgba(0,0,0,0.55)] ${
            opensUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          }`}
        >
          {options.map((option, index) => {
            const Icon = option.Icon
            const isSelected = option.key === value
            return (
              <button
                key={option.key ?? 'no-icon'}
                ref={element => { optionRefs.current[index] = element }}
                type="button"
                role="option"
                aria-selected={isSelected}
                tabIndex={index === focusedIndex ? 0 : -1}
                onClick={() => selectOption(index)}
                onFocus={() => setFocusedIndex(index)}
                onKeyDown={handleOptionKeyDown}
                className={`flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm outline-none transition-colors ${
                  isSelected
                    ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                    : 'text-white/70 hover:bg-white/[0.06] focus:bg-[#D4AF37]/10 focus:text-[#D4AF37]'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isSelected ? 'text-[#D4AF37]' : 'text-white/45'}`} aria-hidden="true" />
                <span className="flex-1">{option.label}</span>
                {isSelected && <Check className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

const EMPTY: ProjectRow = {
  title: '', slug: '',
  classification: 'personal',
  description: '',
  image_url: '', live_url: '', github_url: '',
  show_view_project: true, show_source: false,
  tech_stack: [],
  project_subtitle: '', organization: '',
  project_year: null, project_context: '', key_features: [], gallery_images: [],
  show_technical_highlights: false, technical_highlights: [],
  status: 'draft', sort_order: 0,
}

interface Props {
  initial?: ProjectRow
  initialSortOrder?: number   // max existing + 1, passed from manager
  onSaved: (msg: string) => void
  onCancel: () => void
}

// Convert a title into a URL-safe slug
const toSlug = (title: string) =>
  title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// Extract storage path from a Supabase public URL
const storagePathFromUrl = (url: string, bucket: string): string | null => {
  try {
    const marker = `/storage/v1/object/public/${bucket}/`
    const idx = url.indexOf(marker)
    return idx !== -1 ? decodeURIComponent(url.slice(idx + marker.length)) : null
  } catch {
    return null
  }
}

const inputCls = 'w-full bg-white/[0.05] border border-white/[0.10] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/25 transition-colors'
const inputErrCls = 'w-full bg-white/[0.05] border border-red-500/40 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-red-500/60 transition-colors'

const isValidHttpUrl = (value: string | null | undefined) => {
  if (!value?.trim()) return false
  try {
    const url = new URL(value.trim())
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export default function ProjectForm({ initial, initialSortOrder, onSaved, onCancel }: Props) {
  const isNew = !initial?.id

  const [form, setForm] = useState<ProjectRow>(() => {
    // Normalize all string fields from DB — null → "" so controlled inputs never receive null
    const base = initial ?? EMPTY
    return {
      ...base,
      title:             base.title             ?? '',
      slug:              base.slug              ?? '',
      classification:    base.classification === 'production' || base.classification === 'personal'
        ? base.classification
        : 'personal',
      description:       base.description       ?? '',
      image_url:         base.image_url         ?? '',
      live_url:          base.live_url          ?? '',
      github_url:        base.github_url        ?? '',
      show_view_project: base.show_view_project ?? true,
      show_source:       base.show_source ?? isValidHttpUrl(base.github_url),
      tech_stack:        Array.isArray(base.tech_stack) ? base.tech_stack : [],
      project_subtitle:  base.project_subtitle ?? '',
      organization:      base.organization ?? '',
      project_year:      typeof base.project_year === 'number' ? base.project_year : null,
      project_context:   base.project_context ?? '',
      key_features:      Array.isArray(base.key_features) ? base.key_features : [],
      gallery_images:    Array.isArray(base.gallery_images) ? base.gallery_images : [],
      show_technical_highlights: base.show_technical_highlights ?? false,
      technical_highlights: normalizeTechnicalHighlights(base.technical_highlights),
      status:            base.status            ?? 'draft',
      sort_order:        base.sort_order        ?? initialSortOrder ?? 0,
    }
  })
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ProjectRow, string>>>({})
  const [submitErr, setSubmitErr] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const set = (field: keyof ProjectRow, value: unknown) => {
    setForm(f => ({ ...f, [field]: value }))
    // Clear field error on change
    if (fieldErrors[field]) setFieldErrors(e => ({ ...e, [field]: undefined }))
  }

  const handleTitleChange = (value: string) => {
    set('title', value)
    if (!slugManuallyEdited) {
      setForm(f => ({ ...f, title: value, slug: toSlug(value) }))
    }
  }

  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true)
    set('slug', value)
  }

  const validate = (): boolean => {
    const errors: Partial<Record<keyof ProjectRow, string>> = {}
    if (!form.title.trim())             errors.title             = 'Title is required.'
    if (!form.slug.trim())              errors.slug              = 'Slug is required.'
    if (form.classification !== 'production' && form.classification !== 'personal') {
      errors.classification = 'Project type is required.'
    }
    if (isNew && !form.project_subtitle.trim()) errors.project_subtitle = 'Project subtitle is required for new projects.'
    if (form.show_source && !isValidHttpUrl(form.github_url)) {
      errors.github_url = 'A valid HTTP(S) source URL is required when Show Source is enabled.'
    }
    if (!form.description.trim())       errors.description       = 'Description is required.'
    if (!form.image_url.trim())         errors.image_url         = 'Image URL is required. Upload an image or enter a URL.'
    if (form.key_features.length > MAX_KEY_FEATURES) {
      errors.key_features = `Use up to ${MAX_KEY_FEATURES} key features.`
    }
    if (form.gallery_images.length > MAX_GALLERY_IMAGES) {
      errors.gallery_images = `Use up to ${MAX_GALLERY_IMAGES} gallery images.`
    }
    if (form.technical_highlights.length > MAX_TECHNICAL_HIGHLIGHTS) {
      errors.technical_highlights = `Use up to ${MAX_TECHNICAL_HIGHLIGHTS} technical highlights.`
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, galleryIndex?: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    const slug = form.slug.trim() || 'project'
    const ext = file.name.split('.').pop() ?? 'webp'
    const path = `projects/${slug}-${Date.now()}.${ext}`

    setUploading(true)
    setUploadMsg(null)

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setUploading(false)
      setUploadMsg({ text: uploadError.message, ok: false })
      return
    }

    const { data } = supabase.storage.from('project-images').getPublicUrl(path)
    if (galleryIndex === undefined) {
      set('image_url', data.publicUrl)
    } else {
      updateListValue('gallery_images', galleryIndex, data.publicUrl)
    }
    setUploading(false)
    setUploadMsg({ text: galleryIndex === undefined ? 'Image uploaded.' : 'Gallery image uploaded.', ok: true })
    if (fileInputRef.current) fileInputRef.current.value = ''
    e.target.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    setSubmitErr(null)

    // Strip id from payload for insert
    const { id, description, ...rest } = form
    const payload = {
      ...rest,
      slug: form.slug.trim(),
      full_description: description.trim(),
      github_url: form.github_url?.trim() || null,
      project_subtitle: form.project_subtitle.trim() || null,
      organization: form.organization.trim() || null,
      project_year: typeof form.project_year === 'number' ? form.project_year : null,
      project_context: form.project_context.trim() || null,
      key_features: form.key_features.map(value => value.trim()).filter(Boolean),
      gallery_images: form.gallery_images.map(value => value.trim()).filter(Boolean),
      technical_highlights: form.technical_highlights
        .map(({ text, icon }) => ({
          text: text.trim(),
          icon: TECHNICAL_HIGHLIGHT_ICON_KEYS.includes(icon as TechnicalHighlightIcon) ? icon : null,
        }))
        .filter((highlight) => Boolean(highlight.text)),
    }

    const { error } = id
      ? await supabase.from('projects').update(payload).eq('id', id)
      : await supabase.from('projects').insert(payload)

    setSaving(false)
    if (error) { setSubmitErr(error.message); return }
    onSaved(id ? 'Project updated.' : 'Project created.')
  }

  // ── Field helpers ──────────────────────────────────────────────────────────
  const fieldBlock = (
    label: string,
    key: keyof ProjectRow,
    type = 'text',
    placeholder = '',
    required = false,
  ) => (
    <div>
      <label className="block text-xs text-white/45 mb-1">
        {label}{required && <span className="text-red-400/70 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={(form[key] as string) ?? ''}
        onChange={e => set(key, e.target.value)}
        placeholder={placeholder}
        className={fieldErrors[key] ? inputErrCls : inputCls}
      />
      {fieldErrors[key] && <p className="text-xs text-red-400/75 mt-1">{fieldErrors[key]}</p>}
    </div>
  )

  const updateListValue = (field: ListField, index: number, value: string) => {
    const next = [...form[field]]
    next[index] = value
    set(field, next)
  }

  const addListValue = (field: ListField) => {
    if (form[field].length >= LIST_LIMITS[field]) return
    set(field, [...form[field], ''])
  }

  const removeListValue = (field: ListField, index: number) =>
    set(field, form[field].filter((_, itemIndex) => itemIndex !== index))

  const updateTechnicalHighlight = (
    index: number,
    field: keyof TechnicalHighlight,
    value: string | TechnicalHighlightIcon | null,
  ) => {
    const next = [...form.technical_highlights]
    next[index] = { ...next[index], [field]: value }
    set('technical_highlights', next)
  }

  const addTechnicalHighlight = () => {
    if (form.technical_highlights.length >= MAX_TECHNICAL_HIGHLIGHTS) return
    set('technical_highlights', [...form.technical_highlights, { text: '', icon: null }])
  }

  const removeTechnicalHighlight = (index: number) =>
    set('technical_highlights', form.technical_highlights.filter((_, itemIndex) => itemIndex !== index))

  const repeatableFields = (
    field: ListField,
    label: string,
    helper: string,
    placeholder: string,
    addLabel: string,
    type: 'text' | 'url' = 'text',
  ) => (
    <section className="rounded-lg border border-white/[0.09] bg-black/10 p-3.5 sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-white/80">{label}</label>
        <span className="rounded-full border border-white/[0.12] bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-white/50">
          {form[field].length} / {LIST_LIMITS[field]} {addLabel.toLowerCase().replace('add ', '')}{form[field].length === 1 ? '' : 's'}
        </span>
      </div>
      <p className="mt-1 text-xs leading-5 text-white/40">{helper}</p>
      <div className="space-y-2">
        {form[field].map((value, index) => (
          <div key={`${field}-${index}`} className="mt-3 flex min-w-0 flex-col gap-2 sm:flex-row">
            <input
              type={type}
              value={value}
              onChange={event => updateListValue(field, index, event.target.value)}
              placeholder={placeholder}
              className={inputCls}
            />
            {field === 'gallery_images' && (
              <label
                role="button"
                tabIndex={uploading ? -1 : 0}
                aria-disabled={uploading}
                onKeyDown={event => {
                  if (uploading || (event.key !== 'Enter' && event.key !== ' ')) return
                  event.preventDefault()
                  event.currentTarget.querySelector<HTMLInputElement>('input')?.click()
                }}
                className={`inline-flex min-h-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border px-3.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold ${
                uploading
                  ? 'cursor-not-allowed border-white/[0.07] text-white/25'
                  : 'border-white/[0.12] bg-white/[0.045] text-white/70 hover:border-brand-gold/45 hover:bg-brand-gold/10 hover:text-brand-gold'
                }`}
              >
                {uploading ? 'Uploading…' : 'Upload'}
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={event => handleImageUpload(event, index)}
                  className="hidden"
                />
              </label>
            )}
            <button
              type="button"
              onClick={() => removeListValue(field, index)}
              className="min-h-10 shrink-0 rounded-lg border border-white/[0.12] px-3.5 text-sm text-white/55 transition-colors hover:border-red-400/45 hover:bg-red-400/[0.06] hover:text-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      {fieldErrors[field] && <p className="mt-2 text-xs text-red-400/75">{fieldErrors[field]}</p>}
      <button
        type="button"
        onClick={() => addListValue(field)}
        disabled={form[field].length >= LIST_LIMITS[field]}
        className="mt-3 inline-flex min-h-10 items-center rounded-lg border border-white/[0.14] bg-white/[0.045] px-3.5 text-sm font-medium text-white/70 transition-colors hover:border-brand-gold/45 hover:bg-brand-gold/10 hover:text-brand-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold disabled:cursor-not-allowed disabled:border-white/[0.07] disabled:bg-transparent disabled:text-white/25"
      >
        + {addLabel}
      </button>
    </section>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Title + Slug */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-white/45 mb-1">
            Title<span className="text-red-400/70 ml-0.5">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={e => handleTitleChange(e.target.value)}
            placeholder="My Project"
            className={fieldErrors.title ? inputErrCls : inputCls}
          />
          {fieldErrors.title && <p className="text-xs text-red-400/75 mt-1">{fieldErrors.title}</p>}
        </div>
        <div>
          <label className="block text-xs text-white/45 mb-1">
            Slug<span className="text-red-400/70 ml-0.5">*</span>
            {isNew && !slugManuallyEdited && (
              <span className="ml-1.5 text-white/25 font-normal">(auto)</span>
            )}
          </label>
          <input
            type="text"
            value={form.slug}
            onChange={e => handleSlugChange(e.target.value)}
            placeholder="my-project"
            className={fieldErrors.slug ? inputErrCls : inputCls}
          />
          {fieldErrors.slug && <p className="text-xs text-red-400/75 mt-1">{fieldErrors.slug}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs text-white/45 mb-1">
          Project Subtitle{isNew && <span className="text-red-400/70 ml-0.5">*</span>}
        </label>
        <input
          type="text"
          value={form.project_subtitle}
          onChange={event => set('project_subtitle', event.target.value)}
          placeholder="Vehicle Rental & Booking Platform"
          className={fieldErrors.project_subtitle ? inputErrCls : inputCls}
        />
        {fieldErrors.project_subtitle && <p className="text-xs text-red-400/75 mt-1">{fieldErrors.project_subtitle}</p>}
      </div>

      {/* Project type / status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-white/45 mb-1">
            Project Type<span className="text-red-400/70 ml-0.5">*</span>
          </label>
          <DashboardSelect
            value={form.classification}
            onChange={v => set('classification', v as ProjectRow['classification'])}
            options={[
              { value: 'production', label: 'Production' },
              { value: 'personal',   label: 'Personal' },
            ]}
          />
          {fieldErrors.classification && <p className="text-xs text-red-400/75 mt-1">{fieldErrors.classification}</p>}
        </div>
        <div>
          <label className="block text-xs text-white/45 mb-1">Status</label>
          <DashboardSelect
            value={form.status}
            onChange={v => set('status', v as 'published' | 'draft')}
            options={[
              { value: 'draft',     label: 'Draft' },
              { value: 'published', label: 'Published' },
            ]}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs text-white/45 mb-1">
          Description<span className="text-red-400/70 ml-0.5">*</span>
        </label>
        <textarea
          value={form.description}
          onChange={e => set('description', e.target.value)}
          rows={4}
          placeholder="Detailed project description…"
          className={`${fieldErrors.description ? inputErrCls : inputCls} resize-none`}
        />
        {fieldErrors.description && <p className="text-xs text-red-400/75 mt-1">{fieldErrors.description}</p>}
      </div>

      {/* Image + Live URL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-white/45 mb-1">
            Image URL<span className="text-red-400/70 ml-0.5">*</span>
          </label>
          <input
            type="text"
            value={form.image_url ?? ''}
            onChange={e => set('image_url', e.target.value)}
            placeholder="/project.webp or https://…"
            className={fieldErrors.image_url ? inputErrCls : inputCls}
          />
          {fieldErrors.image_url && (
            <p className="text-xs text-red-400/75 mt-1">{fieldErrors.image_url}</p>
          )}
          {/* Upload */}
          <div className="mt-2 flex items-center gap-2">
            <label className={`cursor-pointer text-xs px-3 py-1.5 rounded-lg border transition-colors
              ${uploading
                ? 'border-white/[0.08] text-white/25 cursor-not-allowed'
                : 'border-white/[0.12] text-white/50 hover:text-white hover:border-white/25 bg-white/[0.04] hover:bg-white/[0.08]'
              }`}>
              {uploading ? 'Uploading…' : 'Upload image'}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            {uploadMsg && (
              <span className={`text-xs ${uploadMsg.ok ? 'text-green-400/80' : 'text-red-400/80'}`}>
                {uploadMsg.text}
              </span>
            )}
          </div>
          {/* Preview */}
          {form.image_url && (
            <div className="mt-2 w-full h-24 rounded-lg overflow-hidden border border-white/[0.08] bg-black/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.image_url} alt="preview" className="w-full h-full object-cover object-center" />
            </div>
          )}
        </div>
        {fieldBlock('Live URL', 'live_url', 'url', 'https://')}
      </div>

      {/* Tech stack */}
      <div>
        <label className="block text-xs text-white/45 mb-1">Tech Stack (comma-separated)</label>
        <input
          type="text"
          value={form.tech_stack.join(', ')}
          onChange={e =>
            set('tech_stack', e.target.value.split(',').map(s => s.trim()).filter(Boolean))
          }
          placeholder="React, Tailwind CSS, Node.js"
          className={inputCls}
        />
      </div>

      <div className="rounded-lg border border-white/[0.10] bg-white/[0.025] p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-white/45">Project Actions</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={form.show_view_project}
              onChange={e => set('show_view_project', e.target.checked)}
              className="h-4 w-4 accent-[#D4AF37]"
            />
            Show View Project
          </label>
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={form.show_source}
              onChange={e => set('show_source', e.target.checked)}
              className="h-4 w-4 accent-[#D4AF37]"
            />
            Show Source
          </label>
        </div>
      </div>

      {form.show_source && fieldBlock('Source URL', 'github_url', 'url', 'https://github.com/…')}

      {form.show_view_project && (
        <div className="space-y-5 rounded-xl border border-white/[0.14] bg-white/[0.035] p-4 sm:p-5">
          <div className="border-b border-white/[0.1] pb-4">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-white/85">Project Details</p>
            <p className="mt-1 text-xs leading-5 text-white/45">Optional information for the future View Project experience.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-white/45">Year</label>
              <input
                type="number"
                min="1900"
                max="2100"
                value={form.project_year ?? ''}
                onChange={event => {
                  const value = event.target.value
                  set('project_year', value === '' ? null : Number(value))
                }}
                placeholder="2026"
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/45">Project Context</label>
              <DashboardSelect
                value={form.project_context}
                onChange={value => set('project_context', value)}
                options={[
                  { value: '', label: 'Select context (optional)' },
                  { value: 'Personal Project', label: 'Personal Project' },
                  { value: 'Team Project', label: 'Team Project' },
                  { value: 'Client Project', label: 'Client Project' },
                  { value: 'Production Project', label: 'Production Project' },
                ]}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-white/45">Organization / Company <span className="text-white/25">(optional)</span></label>
            <input
              type="text"
              value={form.organization}
              onChange={event => set('organization', event.target.value)}
              placeholder="Rse Together"
              className={inputCls}
            />
          </div>

          {repeatableFields(
            'key_features',
            'Key Features',
            'Add the strongest product capabilities shown in the project.',
            'e.g. Payment integration',
            'Add Feature'
          )}
          {repeatableFields(
            'gallery_images',
            'Project Gallery',
            'Additional project visuals only; the main image remains the hero image.',
            'https://…',
            'Add Gallery Image',
            'url'
          )}

          <div className="rounded-lg border border-white/[0.09] bg-black/10 p-3.5 sm:p-4">
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                checked={form.show_technical_highlights}
                onChange={event => set('show_technical_highlights', event.target.checked)}
                className="h-4 w-4 accent-[#D4AF37]"
              />
              Show Technical Highlights
            </label>
            <p className="mt-1.5 text-xs leading-5 text-white/40">Use this only for implementation details worth calling out.</p>
          </div>

          {form.show_technical_highlights && (
            <section className="rounded-lg border border-white/[0.09] bg-black/10 p-3.5 sm:p-4">
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-medium text-white/80">Technical Highlights</label>
                <span className="rounded-full border border-white/[0.12] bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-white/50">
                  {form.technical_highlights.length} / {MAX_TECHNICAL_HIGHLIGHTS} {form.technical_highlights.length === 1 ? 'highlight' : 'highlights'}
                </span>
              </div>
              <p className="mt-1 text-xs leading-5 text-white/40">Optional implementation details that support the project story.</p>

              <div className="space-y-2">
                {form.technical_highlights.map((highlight, index) => {
                  return (
                    <div key={`technical-highlight-${index}`} className="mt-3 flex min-w-0 flex-col gap-2 lg:flex-row">
                      <input
                        type="text"
                        value={highlight.text}
                        onChange={event => updateTechnicalHighlight(index, 'text', event.target.value)}
                        placeholder="e.g. Role-based access control"
                        className={inputCls}
                      />
                      <TechnicalHighlightIconPicker
                        value={highlight.icon}
                        onValueChange={icon => updateTechnicalHighlight(index, 'icon', icon)}
                        label={`Icon for technical highlight ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeTechnicalHighlight(index)}
                        className="min-h-10 shrink-0 rounded-lg border border-white/[0.12] px-3.5 text-sm text-white/55 transition-colors hover:border-red-400/45 hover:bg-red-400/[0.06] hover:text-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  )
                })}
              </div>

              {fieldErrors.technical_highlights && (
                <p className="mt-2 text-xs text-red-400/75">{fieldErrors.technical_highlights}</p>
              )}
              <button
                type="button"
                onClick={addTechnicalHighlight}
                disabled={form.technical_highlights.length >= MAX_TECHNICAL_HIGHLIGHTS}
                className="mt-3 inline-flex min-h-10 items-center rounded-lg border border-white/[0.14] bg-white/[0.045] px-3.5 text-sm font-medium text-white/70 transition-colors hover:border-brand-gold/45 hover:bg-brand-gold/10 hover:text-brand-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold disabled:cursor-not-allowed disabled:border-white/[0.07] disabled:bg-transparent disabled:text-white/25"
              >
                + Add Highlight
              </button>
            </section>
          )}
        </div>
      )}

      {submitErr && <p className="text-xs text-red-400/80">{submitErr}</p>}

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={saving || uploading}
          className="px-5 py-2 bg-white/[0.09] hover:bg-white/[0.14] border border-white/[0.14] text-white text-sm rounded-lg transition-colors disabled:opacity-40"
        >
          {saving ? 'Saving…' : form.id ? 'Update' : 'Create'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 text-white/40 hover:text-white/70 text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

// Export helper so ProjectsManager can use it for delete cleanup
export { storagePathFromUrl }
