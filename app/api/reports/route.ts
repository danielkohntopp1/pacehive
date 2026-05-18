import { NextResponse } from 'next/server'
import { createAdminClient, createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const { booking_id, reported_id, reason, description } = await req.json()
    if (!reported_id || !reason) return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })

    const admin = await createAdminClient()
    const { error } = await admin.from('reports').insert({
      reporter_id: user.id,
      reported_id,
      booking_id: booking_id || null,
      reason,
      description: description?.trim() || null,
    })

    if (error) return NextResponse.json({ error: 'Erro ao salvar denúncia' }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
