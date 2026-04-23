import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PHASE_COLORS } from '@/lib/constants'

export default async function OverviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [
    { data: projects },
    { data: tasks },
    { data: subs },
    { data: budgetItems },
  ] = await Promise.all([
    supabase.from('projects').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }),
    supabase.from('tasks').select('*').eq('user_id', user!.id).eq('status', 'upcoming').order('due_date'),
    supabase.from('subs').select('*').eq('user_id', user!.id).eq('status', 'active'),
    supabase.from('budget_items').select('budgeted, actual').eq('user_id', user!.id),
  ])

  const activeProjects = (projects ?? []).filter(p => p.status === 'active')
  const totalBudget = (budgetItems ?? []).reduce((s, b) => s + (b.budgeted ?? 0), 0)
  const totalSpent = (budgetItems ?? []).reduce((s, b) => s + (b.actual ?? 0), 0)
  const upcomingTasks = (tasks ?? []).slice(0, 5)
  const recentProjects = (projects ?? []).slice(0, 3)

  const stats = [
    { label: 'Active Projects', value: activeProjects.length, href: '/dashboard/projects', color: 'text-blue-600' },
    { label: 'Total Budget', value: '$' + totalBudget.toLocaleString(), href: '/dashboard/budget', color: 'text-emerald-600' },
    { label: 'Upcoming Tasks', value: (tasks ?? []).length, href: '/dashboard/schedule', color: 'text-amber-600' },
    { label: 'Active Subs', value: (subs ?? []).length, href: '/dashboard/subs', color: 'text-purple-600' },
  ]

  const isEmpty = (projects ?? []).length === 0

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back — here's what's happening.</p>
      </div>

      {/* Empty state */}
      {isEmpty && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
          <div className="text-4xl mb-4">🏗</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Start your first project</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            Add a project to start tracking your build — budget, schedule, subs, and permits all live here.
          </p>
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>+</span> New Project
          </Link>
        </div>
      )}

      {/* Stat cards */}
      {!isEmpty && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map(s => (
            <Link key={s.label} href={s.href} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-500 mb-1">{s.label}</p>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Budget progress */}
      {!isEmpty && totalBudget > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Budget (all projects)</h2>
            <span className="text-sm text-gray-500">
              ${totalSpent.toLocaleString()} <span className="text-gray-400">of</span> ${totalBudget.toLocaleString()}
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${totalSpent / totalBudget > 0.9 ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {Math.round((totalSpent / totalBudget) * 100)}% spent
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent projects */}
        {recentProjects.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900">Recent Projects</h2>
              <Link href="/dashboard/projects" className="text-xs text-blue-600 hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {recentProjects.map(p => (
                <Link key={p.id} href={`/dashboard/projects/${p.id}`} className="flex items-center justify-between py-2 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.name}</p>
                    {p.address && <p className="text-xs text-gray-500">{p.address}</p>}
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${PHASE_COLORS[p.phase] ?? 'bg-gray-100 text-gray-600'}`}>
                    {p.phase}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming tasks */}
        {upcomingTasks.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900">Upcoming Tasks</h2>
              <Link href="/dashboard/schedule" className="text-xs text-blue-600 hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {upcomingTasks.map(t => (
                <div key={t.id} className="flex items-center justify-between py-2">
                  <p className="text-sm text-gray-800">{t.title}</p>
                  {t.due_date && (
                    <p className="text-xs text-gray-400">
                      {new Date(t.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
