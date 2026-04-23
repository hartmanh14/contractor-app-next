'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase.from('projects').insert({
    user_id:     user.id,
    name:        formData.get('name') as string,
    address:     formData.get('address') as string || null,
    phase:       formData.get('phase') as string,
    budget:      parseFloat(formData.get('budget') as string) || 0,
    start_date:  formData.get('start_date') as string || null,
    end_date:    formData.get('end_date') as string || null,
    status:      formData.get('status') as string,
    description: formData.get('description') as string || null,
    notes:       formData.get('notes') as string || null,
  })

  if (error) redirect('/dashboard/projects/new?error=' + encodeURIComponent(error.message))
  revalidatePath('/dashboard/projects')
  revalidatePath('/dashboard')
  redirect('/dashboard/projects')
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase.from('projects').update({
    name:        formData.get('name') as string,
    address:     formData.get('address') as string || null,
    phase:       formData.get('phase') as string,
    budget:      parseFloat(formData.get('budget') as string) || 0,
    start_date:  formData.get('start_date') as string || null,
    end_date:    formData.get('end_date') as string || null,
    status:      formData.get('status') as string,
    description: formData.get('description') as string || null,
    notes:       formData.get('notes') as string || null,
  }).eq('id', id).eq('user_id', user.id)

  if (error) redirect(`/dashboard/projects/${id}/edit?error=` + encodeURIComponent(error.message))
  revalidatePath('/dashboard/projects')
  revalidatePath(`/dashboard/projects/${id}`)
  revalidatePath('/dashboard')
  redirect(`/dashboard/projects/${id}`)
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('projects').delete().eq('id', id).eq('user_id', user.id)
  revalidatePath('/dashboard/projects')
  revalidatePath('/dashboard')
  redirect('/dashboard/projects')
}
