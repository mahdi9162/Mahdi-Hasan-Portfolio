'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { isProjectRelationship, normalizeProjectGalleryItems, normalizeTechnicalHighlights } from '@/types/project'
import ProjectForm, { type ProjectRow, storagePathFromUrl } from './ProjectForm'
import Toast from './Toast'
import ConfirmDialog from './ConfirmDialog'
import { revalidateHomepage, revalidateProjectPages } from '@/lib/revalidate'

type ToastState = { message: string; type: 'success' | 'error' } | null
type ProjectClassification = ProjectRow['classification']

const QUERY_KEY = ['dashboard-projects'] as const

const hasValidSourceUrl = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) return false
  try {
    const url = new URL(value.trim())
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

const sortProjectsByOrder = <T extends { sort_order: number; created_at?: string }>(projectList: T[]) =>
  [...projectList].sort((a, b) => {
    const aOrder = Number.isFinite(a.sort_order) ? a.sort_order : Number.MAX_SAFE_INTEGER
    const bOrder = Number.isFinite(b.sort_order) ? b.sort_order : Number.MAX_SAFE_INTEGER
    return aOrder !== bOrder
      ? aOrder - bOrder
      : (a.created_at ?? '').localeCompare(b.created_at ?? '')
  })

async function fetchProjectsFromDB(): Promise<ProjectRow[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('id, title, slug, classification, full_description, image_url, live_url, github_url, show_view_project, show_source, tech_stack, project_subtitle, organization, project_year, project_context, project_relationship, my_role, contribution_summary, index_project_case_study, seo_title, seo_description, seo_og_image_url, key_features, gallery_images, gallery_items, show_technical_highlights, technical_highlights, status, sort_order, created_at')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []).map(({ full_description, ...project }) => ({
    ...project,
    description: full_description ?? '',
    classification: project.classification === 'production' || project.classification === 'personal'
      ? project.classification
      : 'personal',
    show_view_project: project.show_view_project ?? true,
    show_source: project.show_source ?? hasValidSourceUrl(project.github_url),
    project_subtitle: project.project_subtitle ?? '',
    organization: project.organization ?? '',
    project_year: typeof project.project_year === 'number' ? project.project_year : null,
    project_context: project.project_context ?? '',
    project_relationship: isProjectRelationship(project.project_relationship) ? project.project_relationship : '',
    my_role: project.my_role ?? '',
    contribution_summary: project.contribution_summary ?? '',
    index_project_case_study: project.index_project_case_study ?? false,
    seo_title: project.seo_title ?? '',
    seo_description: project.seo_description ?? '',
    seo_og_image_url: project.seo_og_image_url ?? '',
    key_features: Array.isArray(project.key_features) ? project.key_features : [],
    gallery_images: Array.isArray(project.gallery_images) ? project.gallery_images : [],
    gallery_items: normalizeProjectGalleryItems(project.gallery_items, project.gallery_images),
    show_technical_highlights: project.show_technical_highlights ?? false,
    technical_highlights: normalizeTechnicalHighlights(project.technical_highlights),
  })) as ProjectRow[]
}

export default function ProjectsManager() {
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: QUERY_KEY })

  const { data: projects = [], isLoading, isError, error: queryError } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchProjectsFromDB,
    staleTime: 2 * 60 * 1000,   // 2 minutes
    gcTime:   10 * 60 * 1000,   // 10 minutes
    placeholderData: (prev) => prev, // keep previous data while refetching
  })

  const [editing, setEditing] = useState<ProjectRow | null>(null)
  const [creating, setCreating] = useState(false)
  const [activeType, setActiveType] = useState<ProjectClassification>('production')
  const [toast, setToast] = useState<ToastState>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const showToast = (message: string, type: 'success' | 'error' = 'success') =>
    setToast({ message, type })

  const normalizeGroupOrder = async (classification: ProjectClassification) => {
    const { data, error } = await supabase
      .from('projects')
      .select('id, sort_order, created_at')
      .eq('classification', classification)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) return error

    const updates = sortProjectsByOrder(data ?? []).map((project, index) =>
      supabase.from('projects').update({ sort_order: index }).eq('id', project.id)
    )
    const results = await Promise.all(updates)
    return results.find(result => result.error)?.error ?? null
  }

  const appendProjectToGroup = async (id: string, classification: ProjectClassification) => {
    const { data, error } = await supabase
      .from('projects')
      .select('id, sort_order')
      .eq('classification', classification)

    if (error) return error

    const nextSortOrder = Math.max(-1, ...(data ?? [])
      .filter(project => project.id !== id)
      .map(project => typeof project.sort_order === 'number' ? project.sort_order : -1)) + 1
    const { error: updateError } = await supabase
      .from('projects')
      .update({ sort_order: nextSortOrder })
      .eq('id', id)
    return updateError
  }

  const handleSaved = async (msg: string, savedProject: { id: string; classification: ProjectClassification; slug: string }) => {
    const previousClassification = editing?.classification
    const previousSlug = editing?.slug
    const shouldAppendToGroup = !editing || previousClassification !== savedProject.classification
    const appendError = shouldAppendToGroup
      ? await appendProjectToGroup(savedProject.id, savedProject.classification)
      : null
    const newGroupError = shouldAppendToGroup && !appendError
      ? await normalizeGroupOrder(savedProject.classification)
      : appendError
    const oldGroupError = previousClassification && previousClassification !== savedProject.classification
      ? await normalizeGroupOrder(previousClassification)
      : null
    const orderingError = newGroupError ?? oldGroupError

    setEditing(null)
    setCreating(false)
    showToast(orderingError ? `${msg} Project order could not be normalized.` : msg, orderingError ? 'error' : 'success')
    invalidate()
    await revalidateProjectPages([previousSlug, savedProject.slug])
  }

  const handleDelete = async (id: string) => {
    setDeleting(true)
    const project = projects.find(p => p.id === id)
    if (project?.image_url) {
      const storagePath = storagePathFromUrl(project.image_url, 'project-images')
      if (storagePath) {
        await supabase.storage.from('project-images').remove([storagePath])
      }
    }
    const { error } = await supabase.from('projects').delete().eq('id', id)
    setDeleting(false)
    setConfirmDelete(null)
    if (error) showToast(error.message, 'error')
    else {
      const normalizeError = project ? await normalizeGroupOrder(project.classification) : null
      showToast(normalizeError ? 'Project deleted, but project order could not be normalized.' : 'Project deleted.', normalizeError ? 'error' : 'success')
      invalidate()
      await revalidateProjectPages([project?.slug])
    }
  }

  const toggleStatus = async (project: ProjectRow) => {
    const next = project.status === 'published' ? 'draft' : 'published'
    const { error } = await supabase
      .from('projects').update({ status: next }).eq('id', project.id!)
    if (error) showToast(error.message, 'error')
    else { showToast(`Marked as ${next}.`); invalidate(); await revalidateProjectPages([project.slug]) }
  }

  const moveProject = async (id: string, classification: ProjectClassification, dir: 'up' | 'down') => {
    const sorted = sortProjectsByOrder(projects.filter(project => project.classification === classification))
    const idx = sorted.findIndex(p => p.id === id)
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sorted.length) return

    const a = sorted[idx]
    const b = sorted[swapIdx]

    // Park the moved row at an unused position first. This avoids a transient
    // duplicate position if the database later enforces uniqueness per type.
    const temporarySortOrder = Math.min(...sorted.map(project => project.sort_order)) - 1
    const { error: parkError } = await supabase.from('projects').update({ sort_order: temporarySortOrder }).eq('id', a.id!)
    if (parkError) { showToast('Move failed.', 'error'); return }

    const { error: swapError } = await supabase.from('projects').update({ sort_order: a.sort_order }).eq('id', b.id!)
    if (swapError) {
      await supabase.from('projects').update({ sort_order: a.sort_order }).eq('id', a.id!)
      showToast('Move failed.', 'error')
      return
    }

    const { error: placeError } = await supabase.from('projects').update({ sort_order: b.sort_order }).eq('id', a.id!)
    if (placeError) {
      await supabase.from('projects').update({ sort_order: b.sort_order }).eq('id', b.id!)
      await supabase.from('projects').update({ sort_order: a.sort_order }).eq('id', a.id!)
      showToast('Move failed.', 'error')
      return
    }
    invalidate()
    revalidateHomepage()
  }

  const productionProjects = sortProjectsByOrder(projects.filter(project => project.classification === 'production'))
  const personalProjects = sortProjectsByOrder(projects.filter(project => project.classification === 'personal'))
  const activeProjects = activeType === 'production' ? productionProjects : personalProjects

  // ── Form view ──────────────────────────────────────────────────────────────
  if (creating || editing) {
    return (
      <div>
        <button
          onClick={() => { setCreating(false); setEditing(null) }}
          className="text-xs lg:text-sm text-white/40 hover:text-white/70 mb-6 transition-colors"
        >
          ← Back to projects
        </button>
        <h2 className="text-base lg:text-lg font-medium text-white mb-6">
          {editing ? 'Edit Project' : 'New Project'}
        </h2>
        <ProjectForm
          initial={editing ?? undefined}
          initialSortOrder={editing ? undefined : Math.max(-1, ...projects
            .filter(project => project.classification === 'personal')
            .map(project => project.sort_order)) + 1}
          onSaved={handleSaved}
          onCancel={() => { setCreating(false); setEditing(null) }}
        />
        {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
      </div>
    )
  }

  // ── List view ──────────────────────────────────────────────────────────────
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base lg:text-lg font-medium text-white">Projects</h2>
        <button
          onClick={() => setCreating(true)}
          className="text-xs lg:text-sm px-4 lg:px-5 py-2 lg:py-2.5 bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.12] text-white rounded-lg transition-colors"
        >
          + New Project
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
        </div>
      ) : isError ? (
        <p className="text-sm text-red-400/70 text-center py-16">{(queryError as Error)?.message ?? 'Failed to load projects.'}</p>
      ) : (
        <div>
          <div role="tablist" aria-label="Project type" className="mb-5 flex w-full gap-2 border-b border-white/[0.09] pb-3 sm:w-auto sm:justify-start">
            {([
              { value: 'production', label: 'Production', count: productionProjects.length },
              { value: 'personal', label: 'Personal', count: personalProjects.length },
            ] as const).map(({ value, label, count }) => {
              const isActive = activeType === value
              return (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveType(value)}
                  className={`inline-flex min-h-10 items-center gap-2 rounded-lg border px-3.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold ${
                    isActive
                      ? 'border-brand-gold/45 bg-brand-gold/10 text-brand-gold'
                      : 'border-white/[0.09] bg-white/[0.025] text-white/45 hover:border-white/[0.18] hover:text-white/70'
                  }`}
                >
                  <span>{label}</span>
                  <span className={`font-mono text-[11px] ${isActive ? 'text-brand-gold/75' : 'text-white/30'}`}>{count}</span>
                </button>
              )
            })}
          </div>

          <section role="tabpanel" aria-label={`${activeType} projects`}>
            {activeProjects.length === 0 ? (
              <div className="rounded-lg border border-dashed border-white/[0.08] px-4 py-5">
                <p className="text-sm text-white/30">No {activeType} projects yet.</p>
                <button onClick={() => setCreating(true)} className="mt-3 text-sm text-brand-gold/80 transition-colors hover:text-brand-gold">+ New Project</button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="hidden sm:grid grid-cols-[32px_1fr_100px_90px_auto] gap-3 px-4 pb-1 text-xs lg:text-[13px] uppercase tracking-wider text-white/30">
                  <span />
                  <span>Title</span>
                  <span>Type</span>
                  <span>Status</span>
                  <span />
                </div>

                {activeProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="grid grid-cols-1 items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-4 py-3 sm:grid-cols-[32px_1fr_100px_90px_auto] sm:gap-3 lg:py-4"
                  >
                    <div className="hidden flex-col gap-0.5 sm:flex">
                      <button
                        onClick={() => moveProject(project.id!, activeType, 'up')}
                        disabled={index === 0}
                        title="Move up"
                        className="flex h-5 w-6 items-center justify-center rounded border border-white/[0.08] text-[10px] text-white/30 transition-colors hover:border-white/20 hover:text-white/70 disabled:cursor-not-allowed disabled:opacity-20"
                      >↑</button>
                      <button
                        onClick={() => moveProject(project.id!, activeType, 'down')}
                        disabled={index === activeProjects.length - 1}
                        title="Move down"
                        className="flex h-5 w-6 items-center justify-center rounded border border-white/[0.08] text-[10px] text-white/30 transition-colors hover:border-white/20 hover:text-white/70 disabled:cursor-not-allowed disabled:opacity-20"
                      >↓</button>
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm text-white lg:text-base">{project.title}</p>
                      <p className="truncate text-xs text-white/30 lg:text-[13px]">{project.slug}</p>
                    </div>

                    <span className={`text-xs capitalize lg:text-sm ${activeType === 'production' ? 'text-brand-gold' : 'text-white/55'}`}>
                      {activeType}
                    </span>

                    <button
                      onClick={() => toggleStatus(project)}
                      className={`w-fit rounded-full border px-2.5 py-1 text-xs transition-colors lg:text-sm ${
                        project.status === 'published'
                          ? 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                          : 'border-white/15 text-white/35 hover:bg-white/[0.06]'
                      }`}
                    >
                      {project.status}
                    </button>

                    <div className="flex gap-2">
                      <button onClick={() => setEditing(project)} className="px-2 py-1 text-xs text-white/40 transition-colors hover:text-white/80 lg:text-sm">Edit</button>
                      <button onClick={() => setConfirmDelete(project.id!)} className="px-2 py-1 text-xs text-white/25 transition-colors hover:text-red-400 lg:text-sm">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}

      {confirmDelete && (
        <ConfirmDialog
          title="Delete project?"
          description={`"${projects.find(p => p.id === confirmDelete)?.title ?? 'This project'}" will be permanently removed.`}
          confirmLabel="Delete project"
          loading={deleting}
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )
}
