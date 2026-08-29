'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/servicos', label: 'Serviços' },
  { href: '/grupos', label: 'Grupos' },
  { href: '/guias', label: 'Guias' },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
          if (data) setProfile(data as Profile)
        })
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) setProfile(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setProfile(null)
    setDropdownOpen(false)
    router.push('/')
  }

  const dashboardHref = profile?.role === 'guide' || profile?.role === 'both'
    ? '/guia/dashboard'
    : '/dashboard'

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo/pacehive-horizontal-dark.svg"
              alt="PaceHive"
              width={140}
              height={36}
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative group ${
                  pathname === link.href
                    ? 'text-[#F5A623]'
                    : 'text-[#1A1A1A] hover:text-[#F5A623]'
                }`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-4 right-4 h-0.5 bg-[#F5A623] rounded-full transition-all duration-200 ${
                  pathname === link.href ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`} />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {profile ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-[#F9F5EE] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#F5A623] flex items-center justify-center text-black font-bold text-sm">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-[#1A1A1A]">{profile.name.split(' ')[0]}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#E5E5E5] py-1 z-50">
                    <Link
                      href={dashboardHref}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#1A1A1A] hover:bg-[#F9F5EE] transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <LayoutDashboard size={15} />
                      Meu painel
                    </Link>
                    <Link
                      href="/dashboard/perfil"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#1A1A1A] hover:bg-[#F9F5EE] transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User size={15} />
                      Meu perfil
                    </Link>
                    <hr className="my-1 border-[#E5E5E5]" />
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#EF4444] hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={15} />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-[#1A1A1A] hover:text-[#F5A623] transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/seja-um-guia"
                  className="px-5 py-2.5 bg-[#F5A623] text-black text-sm font-semibold rounded-full hover:bg-[#E09510] transition-colors"
                >
                  Seja um guia
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-[#F9F5EE] transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-[#E5E5E5] bg-white">
          <nav className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-[#FEF3DC] text-[#F5A623]'
                    : 'text-[#1A1A1A] hover:bg-[#F9F5EE]'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-[#E5E5E5]" />
            {profile ? (
              <>
                <Link
                  href={dashboardHref}
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-[#1A1A1A] hover:bg-[#F9F5EE]"
                  onClick={() => setIsOpen(false)}
                >
                  Meu painel
                </Link>
                <button
                  onClick={() => { handleSignOut(); setIsOpen(false) }}
                  className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-[#EF4444] hover:bg-red-50"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-[#1A1A1A] hover:bg-[#F9F5EE]"
                  onClick={() => setIsOpen(false)}
                >
                  Entrar
                </Link>
                <Link
                  href="/seja-um-guia"
                  className="block px-4 py-3 bg-[#F5A623] text-black text-sm font-semibold rounded-full text-center hover:bg-[#E09510] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Seja um guia
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
