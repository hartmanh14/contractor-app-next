import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { deleteProject } from '@/app/actions/projects'
import { PHASE_COLORS, STATUS_COLORS } from '@/lib/constants'

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: project }, { data: budgetItems }, { data: tasks }] = await Promise.all([
    supabase.from('projects').select('*').eq('id', id).eq('user_id', user!.id).single(),
    supabase.from('budget_items').select('*').eq('project_id', id).eq('user_id', user!.id),
    supabase.from('tasks').select('*').eq('project_id', id).eq('user_id', user!.id).order('due_date'),
  ])

  if (!project) notFound()

  const totalBudgeted = (budgetItems ?? []).reduce((s, b) => s + (b.budgeted ?? 0), 0)
  const totalActual = (budgetItems ?? []).reduce((s, b) => s + (b.actual ?? 0), 0)
  const totalPaid = (budgetItems ?? []).filter(b => b.paid).reduce((s, b) => s + (b.actual ?? 0), 0)
  const upcomingTasks = (tasks ?? []).filter(t => t.status === 'upcoming')
  const doneTasks = (tasks ?? []).filter(t => t.status === 'done')

  return (
    <div className="p-8 space-y-6 max-w-4xl">
      {/* Back */}
      <Link href="/dashboard/projects" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Projects
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{project.name}</h1>
          {project.address && <p className="text-sm text-gray-500 mt-1">{project.address}</p>}
          <div className="flex items-center gap-2 mt-3">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[project.status] ?? 'bg-gray-100 text-gray-600'}`}>
              {project.status}
            </span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${PHASE_COLORS[project.phase] ?? 'bg-gray-100 text-gray-600'}`}>
              {project.phase}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/dashboard/projects/${id}/edit`}
            className="text-sm font-medium text-gray-700 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Edit
          </Link>
          <form action={deleteProject.bind(null, id)}>
            <button
              type="submit"
              className="text-sm font-medium text-red-600 bg-white border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
              onClick={() => {}}
            >
              Delete
            </button>
          </form>
        </div>
      </div>

      {/* Info cards row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-xs text-gray-500 mb-1">Budget</p>
          <p className="text-xl font-bold text-gray-900">${Number(project.budget).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-xs text-gray-500 mb-1">Spent</p>
          <p className={`text-xl font-bold ${totalActual > project.budget && project.budget > 0 ? 'text-red-600' : 'text-gray-900'}`}>
            ${totalActual.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-xs text-gray-500 mb-1">Tasks Done</p>
          <p className="text-xl font-bold text-gray-900">{doneTasks.length} / {(tasks ?? []).length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-xs text-gray-500 mb-1">Paid Out</p>
          <p className="text-xl font-bold text-gray-900">${totalPaid.toLocaleString()}</p>
        </div>
      </div>

      {/* Budget progress */}
      {project.budget > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Budget Progress</h2>
            <span className="text-xs text-gray-500">{Math.round((totalActual / project.budget) * 100)}% used</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${totalActual / project.budget > 0.9 ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.min((totalActual / project.budget) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>${totalActual.toLocaleString()} spent</span>
            <span>${(project.budget - totalActual).toLocaleString()} remaining</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming tasks */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Upcoming Tasks</h2>
            <Link href="/dashboard/schedule" className="text-xs text-blue-600 hover:underline">Manage</Link>
          </div>
          {upcomingTasks.length === 0 ? (
            <p className="text-sm text-gray-400">No upcoming tasks.</p>
          ) : (
            <div className="space-y-2">
              {upcomingTasks.slice(0, 5).map(t => (
                <div key={t.id} className="flex items-center justify-between py-1.5">
                  <p className="text-sm text-gray-800">{t.title}</p>
                  {t.due_date && (
                    <p className="text-xs text-gray-400 ml-2 shrink-0">
                      {new Date(t.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description / Notes */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          {project.description && (
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-1">Description</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>
            </div>
          )}
          {project.notes && (
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-1">Notes</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{project.notes}</p>
            </div>
          )}
          {!project.description && !project.notes && (
            <p className="text-sm text-gray-400">No description or notes.</p>
          )}
          {(project.start_date || project.end_date) && (
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-1">Timeline</h2>
              <p className="text-sm text-gray-600">
                {project.start_date && new Date(project.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                {project.start_date && project.end_date && ' → '}
                {project.end_date && new Date(project.end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick links to related sections */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Budget', href: '/dashboard/budget' },
          { label: 'Schedule', href: '/dashboard/schedule' },
          { label: 'Permits', href: '/dashboard/permits' },
          { label: 'Subs', href: '/dashboard/subs' },
        ].map(l => (
          <Link
            key={l.label}
            href={l.href}
            className="bg-white rounded-xl border border-gray-200 p-4 text-sm font-medium text-gray-700 hover:border-blue-300 hover:text-blue-700 transition-colors text-center"
          >
            {l.label} →
          </Link>
        ))}
      </div>
    </div>
  )
}
