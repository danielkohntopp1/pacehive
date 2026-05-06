import Image from 'next/image'
import Link from 'next/link'
import { Users, Map, Star, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="bg-[#0A0A0A] text-white py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-shrink-0 flex justify-center md:justify-start">
              <Image
                src="/images/logo/pacehive-vertical-white.svg"
                alt="PaceHive"
                width={180}
                height={220}
                priority
              />
            </div>
            <div className="max-w-2xl text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                Transforme cada destino em uma{' '}
                <span className="text-[#F5A623]">experiência de corrida</span>
              </h1>
              <p className="text-lg text-white/70 mb-10 leading-relaxed">
                Sua corrida continua, mesmo longe de casa. Explore guias e grupos com a PaceHive.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Link
                  href="/guias"
                  className="px-8 py-4 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors text-base"
                >
                  Encontrar um guia
                </Link>
                <Link
                  href="/seja-um-guia"
                  className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all text-base"
                >
                  Seja um guia
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVIÇOS ── */}
      <section className="bg-[#F9F5EE] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">Nossos serviços</h2>
            <p className="text-[#6B6B6B] text-lg max-w-xl mx-auto">
              Na PaceHive, transformamos viagens em experiências de corrida inesquecíveis.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: 'Corredores Guias',
                desc: 'Corra com quem conhece cada curva da cidade.',
                cta: 'Conheça →',
                href: '/guias',
              },
              {
                icon: Map,
                title: 'Grupos de Corrida',
                desc: 'Encontre grupos ativos onde quer que esteja.',
                cta: 'Conheça →',
                href: '/grupos',
              },
              {
                icon: Star,
                title: 'Seja um Guia',
                desc: 'Compartilhe sua cidade correndo com outros corredores.',
                cta: 'Saiba mais →',
                href: '/seja-um-guia',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm hover:shadow-md transition-all duration-200 p-8">
                <div className="w-12 h-12 bg-[#FEF3DC] rounded-xl flex items-center justify-center mb-4">
                  <item.icon size={22} className="text-[#F5A623]" />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{item.title}</h3>
                <p className="text-[#6B6B6B] text-sm mb-4 leading-relaxed">{item.desc}</p>
                <Link href={item.href} className="text-[#F5A623] font-semibold text-sm hover:underline">
                  {item.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">Como funciona</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                number: '1',
                title: 'Encontre o guia ideal',
                desc: 'Filtre por cidade e estilo de corrida para encontrar o guia perfeito para você.',
              },
              {
                number: '2',
                title: 'Solicite sua corrida',
                desc: 'Preencha o formulário com data, horário e preferências. É rápido e simples.',
              },
              {
                number: '3',
                title: 'Corra com confiança',
                desc: 'Receba a confirmação por e-mail e aproveite uma experiência única.',
              },
            ].map((step) => (
              <div key={step.number} className="text-center">
                <div className="text-7xl font-extrabold text-[#F5A623] mb-4 leading-none">{step.number}</div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{step.title}</h3>
                <p className="text-[#6B6B6B] text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/guias"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors"
            >
              Conhecer os guias
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA GUIA ── */}
      <section className="bg-[#F5A623] py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0A0A0A] mb-4">
            Conhece cada canto de sua cidade e quer compartilhar isso?
          </h2>
          <p className="text-[#0A0A0A]/80 text-lg mb-8">
            Faça parte da nossa rede de guias e vamos explorar juntos!
          </p>
          <Link
            href="/seja-um-guia"
            className="inline-block px-8 py-4 bg-[#0A0A0A] text-white font-semibold rounded-full hover:bg-[#1A1A1A] transition-colors"
          >
            Seja um guia PaceHive
          </Link>
        </div>
      </section>

      {/* ── SOBRE ── */}
      <section className="bg-[#0A0A0A] py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Conectando corredores com novas experiências
          </h2>
          <p className="text-white/60 text-lg leading-relaxed">
            O nome <span className="text-[#F5A623] font-semibold">PaceHive</span> nasceu da união de dois conceitos:{' '}
            <span className="text-white font-medium">Pace</span> — o ritmo único de cada corredor — e{' '}
            <span className="text-white font-medium">Hive</span> — a colmeia, uma comunidade viva e colaborativa.
            Assim como numa colmeia, cada corredor faz parte de um sistema conectado.
            Você não está sozinho. Há uma rede te esperando — e correndo com você!
          </p>
        </div>
      </section>

      {/* ── CONTATO ── */}
      <section className="bg-[#F9F5EE] py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-3">Fale com a equipe PaceHive</h2>
            <p className="text-[#6B6B6B]">
              Quer tirar dúvidas, sugerir algo ou colaborar com a comunidade? Manda um alô!
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  )
}

function ContactForm() {
  return (
    <form
      action="https://formsubmit.co/contato@pacehive.com"
      method="POST"
      className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-8 space-y-4"
    >
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_subject" value="Contato via PaceHive" />
      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Nome</label>
        <input
          type="text"
          name="name"
          required
          placeholder="Seu nome"
          className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">E-mail</label>
        <input
          type="email"
          name="email"
          required
          placeholder="seu@email.com"
          className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Mensagem</label>
        <textarea
          name="message"
          required
          rows={4}
          placeholder="Sua mensagem..."
          className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all resize-none"
        />
      </div>
      <button
        type="submit"
        className="w-full py-3.5 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors"
      >
        Enviar mensagem
      </button>
    </form>
  )
}
