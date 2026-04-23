import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PHASE_COLORS, STATUS_COLORS } from '@/lib/constants'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">{(projects ?? []).length} project{(projects ?? []).length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span className="text-base leading-none">+</span> New Project
        </Link>
      </div>

      {/* Empty state */}
      {(projects ?? []).length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center">
          <div className="text-4xl mb-4">🏗</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h2>
          <p className="text-sm text-gray-500 mb-6">Create your first project to get started.</p>
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>+</span> New Project
          </Link>
        </div>
      )}

      {/* Projects grid */}
      {(projects ?? []).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {(projects ?? []).map(p => (
            <Link
              key={p.id}
              href={`/dashboard/projects/${p.id}`}
              className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow space-y-4"
            >
              {/* Title row */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-semibold text-gray-900 leading-tight">{p.name}</h2>
                  {p.address && <p className="text-xs text-gray-500 mt-0.5">{p.address}</p>}
                </div>
                <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[p.status] ?? 'bg-gray-100 text-gray-600'}`}>
                  {p.status}
                </span>
              </div>

              {/* Phase */}
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${PHASE_COLORS[p.phase] ?? 'bg-gray-100 text-gray-600'}`}>
                  {p.phase}
                </span>
              </div>

              {/* Budget */}
              {p.budget > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Budget</p>
                  <p className="text-sm font-semibold text-gray-900">${Number(p.budget).toLocaleString()}</p>
                </div>
              )}

              {/* Dates */}
              {(p.start_date || p.end_date) && (
                <p className="text-xs text-gray-400">
                  {p.start_date && new Date(p.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  {p.start_date && p.end_date && ' → '}
                  {p.end_date && new Date(p.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
