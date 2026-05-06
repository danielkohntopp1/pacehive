'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

const schema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  phone: z.string().optional(),
  wantsToBeGuide: z.boolean(),
})

type FormData = z.infer<typeof schema>

export default function CadastroPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { wantsToBeGuide: false },
  })

  const wantsGuide = watch('wantsToBeGuide')

  const onSubmit = async (data: FormData) => {
    setError(null)
    const supabase = createClient()

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { name: data.name } },
    })

    if (signUpError || !authData.user) {
      setError(signUpError?.message ?? 'Erro ao criar conta')
      return
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.wantsToBeGuide ? 'both' : 'runner',
    })

    if (profileError) {
      setError('Erro ao salvar perfil')
      return
    }

    if (data.wantsToBeGuide) {
      router.push('/cadastro/guia')
    } else {
      router.push('/dashboard')
    }
    router.refresh()
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Image
          src="/images/logo/pacehive-vertical-dark.svg"
          alt="PaceHive"
          width={80}
          height={100}
          className="mx-auto mb-4"
        />
        <h1 className="text-2xl font-extrabold text-[#1A1A1A]">Crie sua conta</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">Junte-se à comunidade PaceHive</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Nome completo *</label>
            <input
              type="text"
              {...register('name')}
              placeholder="Seu nome"
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">E-mail *</label>
            <input
              type="email"
              {...register('email')}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">WhatsApp (opcional)</label>
            <input
              type="tel"
              {...register('phone')}
              placeholder="+55 11 99999-9999"
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Senha *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 pr-11 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <label className="flex items-start gap-3 p-4 border border-[#E5E5E5] rounded-xl cursor-pointer hover:border-[#F5A623] transition-colors has-[:checked]:border-[#F5A623] has-[:checked]:bg-[#FEF3DC]">
            <input type="checkbox" {...register('wantsToBeGuide')} className="mt-0.5 accent-[#F5A623]" />
            <div>
              <p className="text-sm font-medium text-[#1A1A1A]">Quero ser guia também</p>
              <p className="text-xs text-[#6B6B6B] mt-0.5">Você vai criar seu perfil de guia no próximo passo.</p>
            </div>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? 'Criando conta...' : wantsGuide ? 'Criar conta e continuar →' : 'Criar conta'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6B6B6B]">
          Já tem conta?{' '}
          <Link href="/login" className="text-[#F5A623] font-semibold hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
