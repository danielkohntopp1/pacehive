import Link from 'next/link'
import Image from 'next/image'
import { Mail } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import LanguageSwitcher from './LanguageSwitcher'

export default async function Footer() {
  const t = await getTranslations('footer')
  const tHeader = await getTranslations('header')

  const links = [
    { href: '/', label: tHeader('nav.home') },
    { href: '/servicos', label: tHeader('nav.services') },
    { href: '/guias', label: tHeader('nav.guides') },
    { href: '/grupos', label: tHeader('nav.groups') },
    { href: '/seja-um-guia', label: tHeader('becomeGuide') },
  ]

  return (
    <footer className="bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Image
              src="/images/logo/pacehive-horizontal-white.svg"
              alt="PaceHive"
              width={150}
              height={40}
            />
            <p className="text-[#6B6B6B] text-sm leading-relaxed">
              {t('tagline')}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/pacehiveoficial"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F5A623] transition-all duration-200"
                aria-label="Instagram"
              >
                <Image
                  src="/images/icons/instagram.webp"
                  alt="Instagram"
                  width={16}
                  height={16}
                  className="invert group-hover:invert-0 transition-all duration-200"
                />
              </a>
              <a
                href="mailto:contato@pacehive.com"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F5A623] hover:text-black transition-all duration-200"
                aria-label="E-mail"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t('navigation')}
            </h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#6B6B6B] text-sm hover:text-[#F5A623] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t('contact')}
            </h3>
            <ul className="space-y-2 text-[#6B6B6B] text-sm">
              <li>
                <a href="mailto:contato@pacehive.com" className="hover:text-[#F5A623] transition-colors">
                  contato@pacehive.com
                </a>
              </li>
              <li className="pt-4">
                <p className="text-xs text-[#6B6B6B]/70 leading-relaxed">
                  {t('madeWith')}
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#6B6B6B] text-sm">
            {t('rights')}
          </p>
          <div className="flex items-center gap-4 text-xs text-[#6B6B6B]">
            <Link href="/privacidade" className="hover:text-[#F5A623] transition-colors">
              {t('privacy')}
            </Link>
            <Link href="/termos" className="hover:text-[#F5A623] transition-colors">
              {t('terms')}
            </Link>
            <LanguageSwitcher variant="dark" />
          </div>
        </div>
      </div>
    </footer>
  )
}
