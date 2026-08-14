import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink, Mail } from 'lucide-react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/servicos', label: 'Serviços' },
  { href: '/guias', label: 'Guias' },
  { href: '/grupos', label: 'Grupos' },
  { href: '/seja-um-guia', label: 'Seja um guia' },
]

export default function Footer() {
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
              Conectando corredores com novas experiências ao redor do mundo.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/pacehiveoficial"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F5A623] hover:text-black transition-all duration-200"
                aria-label="Instagram"
              >
                <ExternalLink size={16} />
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
              Navegação
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
              Contato
            </h3>
            <ul className="space-y-2 text-[#6B6B6B] text-sm">
              <li>
                <a href="mailto:contato@pacehive.com" className="hover:text-[#F5A623] transition-colors">
                  contato@pacehive.com
                </a>
              </li>
              <li className="pt-4">
                <p className="text-xs text-[#6B6B6B]/70 leading-relaxed">
                  Feito com 🧡 para a comunidade de corredores.
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#6B6B6B] text-sm">
            Copyright &copy; 2026 PaceHive. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-[#6B6B6B]">
            <Link href="/privacidade" className="hover:text-[#F5A623] transition-colors">
              Privacidade
            </Link>
            <Link href="/termos" className="hover:text-[#F5A623] transition-colors">
              Termos de uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
