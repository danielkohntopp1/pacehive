import Image from 'next/image'
import Link from 'next/link'
import { Users, Map, Star, ArrowRight, Route, Timer, Trophy, ShieldCheck, Clock, MessageSquare } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import GuideCard from '@/components/guides/GuideCard'
import HiveField from '@/components/brand/HiveField'
import type { Guide, Profile } from '@/types'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: featuredGuides } = await supabase
    .from('guides')
    .select('*, profile:profiles(*)')
    .eq('is_active', true)
    .order('rating_avg', { ascending: false })
    .limit(3)

  const guides = (featuredGuides ?? []) as (Guide & { profile: Profile })[]

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative bg-hive-black text-white pt-24 pb-20 px-4 overflow-hidden">
        <HiveField />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm text-white/70 mb-8">
            <span className="hex-clip w-2.5 h-2.5 bg-[#F5A623] flex-shrink-0" />
            Marketplace de guias de corrida
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.08] mb-6 tracking-tight">
            Cada cidade tem{' '}
            <span className="text-[#F5A623]">seus segredos.</span>
            <br />Encontre quem os conhece.
          </h1>

          <p className="text-lg sm:text-xl text-white/55 mb-10 max-w-2xl mx-auto leading-relaxed">
            Conecte-se com guias locais e explore lugares que mapas não mostram.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <Link
              href="/guias"
              className="px-8 py-4 bg-[#F5A623] text-black font-bold rounded-full hover:bg-[#E09510] transition-colors text-base shadow-lg shadow-[#F5A623]/20"
            >
              Encontrar um guia
            </Link>
            <Link
              href="/seja-um-guia"
              className="px-8 py-4 border border-white/20 text-white font-semibold rounded-full hover:border-white/50 hover:bg-white/5 transition-all text-base"
            >
              Seja um guia →
            </Link>
          </div>

          {/* Value props */}
          <div className="border-t border-white/10 pt-10 flex flex-wrap justify-center gap-6">
            {[
              { icon: ShieldCheck, label: 'Guias verificados' },
              { icon: Clock, label: 'Resposta em até 24h' },
              { icon: MessageSquare, label: 'Avaliações reais' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-white/60 text-sm">
                <Icon size={15} className="text-[#F5A623] flex-shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GUIAS EM DESTAQUE ── */}
      {guides.length > 0 && (
        <section className="bg-[#F9F5EE] py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-sm font-bold text-[#F5A623] uppercase tracking-widest mb-2">Conheça os guias</p>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A]">Prontos para correr com você</h2>
              </div>
              <Link
                href="/guias"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#F5A623] hover:gap-3 transition-all"
              >
                Ver todos <ArrowRight size={15} />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide) => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/guias"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white font-semibold rounded-full text-sm"
              >
                Ver todos os guias <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── COMO FUNCIONA ── */}
      <section className="bg-white py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-[#F5A623] uppercase tracking-widest mb-3">Como funciona</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A]">
              Sua corrida em 3 passos
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-x-6 gap-y-12 md:gap-x-2">
            {[
              {
                icon: Route,
                title: 'Encontre o guia ideal',
                desc: 'Busque por cidade, modalidade e estilo de corrida. Veja avaliações reais de outros corredores.',
                lift: false,
              },
              {
                icon: Timer,
                title: 'Solicite sua corrida',
                desc: 'Escolha data, horário e preferências. O guia recebe sua solicitação e responde em até 24 horas.',
                lift: true,
              },
              {
                icon: Trophy,
                title: 'Corra com confiança',
                desc: 'Receba a confirmação por e-mail com todos os detalhes. Depois, avalie sua experiência.',
                lift: false,
              },
            ].map(({ icon: Icon, title, desc, lift }, i) => (
              <div
                key={title}
                className={`flex flex-col items-center text-center ${lift ? 'md:-translate-y-6' : ''}`}
              >
                <div className="relative mb-6">
                  <div className="hex-clip w-20 h-[86px] bg-hive-black flex items-center justify-center">
                    <Icon size={26} className="text-[#F5A623]" />
                  </div>
                  <div className="hex-clip absolute -bottom-2 -right-2 w-6 h-[26px] bg-[#F5A623] flex items-center justify-center">
                    <span className="text-[11px] font-mono font-bold text-black">{i + 1}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">{title}</h3>
                <p className="text-[#6B6B6B] text-sm leading-relaxed max-w-[240px]">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              href="/guias"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#1A1A1A] text-white font-semibold rounded-full hover:bg-hive-black transition-colors"
            >
              Ver guias disponíveis
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SERVIÇOS ── */}
      <section className="bg-[#F9F5EE] py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-[#F5A623] uppercase tracking-widest mb-3">O que oferecemos</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A] mb-4">
              Tudo para a sua corrida
            </h2>
            <p className="text-[#6B6B6B] text-lg max-w-xl mx-auto">
              Do guia local ao grupo de corrida, a PaceHive conecta você com a comunidade certa.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: 'Guias de Corrida',
                desc: 'Corredores locais que conhecem cada rua, trilha e atalho da cidade. Corra com confiança onde quer que esteja.',
                cta: 'Ver guias',
                href: '/guias',
                accent: true,
              },
              {
                icon: Map,
                title: 'Grupos de Corrida',
                desc: 'Encontre grupos ativos na sua cidade ou no seu próximo destino. Treine junto, evolua junto.',
                cta: 'Ver grupos',
                href: '/grupos',
                accent: false,
              },
              {
                icon: Star,
                title: 'Seja um Guia',
                desc: 'Compartilhe sua cidade correndo com viajantes do mundo todo. Transforme seu conhecimento local em experiência.',
                cta: 'Saiba mais',
                href: '/seja-um-guia',
                accent: false,
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`rounded-2xl border p-8 flex flex-col transition-all duration-200 hover:shadow-md ${
                  item.accent
                    ? 'bg-hive-black border-hive-black text-white'
                    : 'bg-white border-[#E5E5E5]'
                }`}
              >
                <div className={`hex-clip w-12 h-[52px] flex items-center justify-center mb-5 ${
                  item.accent ? 'bg-[#F5A623]/20' : 'bg-[#FEF3DC]'
                }`}>
                  <item.icon size={20} className="text-[#F5A623]" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${item.accent ? 'text-white' : 'text-[#1A1A1A]'}`}>
                  {item.title}
                </h3>
                <p className={`text-sm leading-relaxed flex-1 mb-6 ${item.accent ? 'text-white/60' : 'text-[#6B6B6B]'}`}>
                  {item.desc}
                </p>
                <Link
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold ${
                    item.accent ? 'text-[#F5A623]' : 'text-[#F5A623]'
                  } hover:gap-3 transition-all`}
                >
                  {item.cta} <ArrowRight size={15} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA GUIA ── */}
      <section className="bg-[#F5A623] py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-bold text-black/40 uppercase tracking-widest mb-4">Para guias</p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-hive-black mb-5 leading-tight">
            Você conhece cada canto da sua cidade?
          </h2>
          <p className="text-hive-black/65 text-lg mb-10 max-w-xl mx-auto">
            Faça parte da nossa rede de guias e compartilhe sua cidade com corredores do mundo todo.
            Você define seu ritmo, seu preço e sua disponibilidade.
          </p>
          <Link
            href="/seja-um-guia"
            className="inline-block px-10 py-4 bg-hive-black text-white font-bold rounded-full hover:bg-[#1A1A1A] transition-colors text-base"
          >
            Quero ser um guia PaceHive
          </Link>
        </div>
      </section>

      {/* ── SOBRE ── */}
      <section className="bg-hive-black py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <Image
              src="/images/logo/pacehive-vertical-white.svg"
              alt="PaceHive"
              width={64}
              height={80}
              className="mx-auto mb-8 opacity-80"
            />
            <blockquote className="text-2xl md:text-3xl font-bold text-white leading-snug mb-8">
              &ldquo;Cada corrida é uma nova forma de{' '}
              <span className="text-[#F5A623]">conhecer um lugar</span>.&rdquo;
            </blockquote>
            <p className="text-white/45 text-base leading-relaxed max-w-xl mx-auto">
              O nome <span className="text-white font-semibold">PaceHive</span> une{' '}
              <span className="text-[#F5A623]">Pace</span> — o ritmo único de cada corredor — e{' '}
              <span className="text-[#F5A623]">Hive</span> — a colmeia, uma comunidade viva e colaborativa.
              Assim como numa colmeia, cada corredor faz parte de algo maior.
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTATO ── */}
      <section className="bg-[#F9F5EE] py-24 px-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-bold text-[#F5A623] uppercase tracking-widest mb-3">Fale com a gente</p>
            <h2 className="text-3xl font-extrabold text-[#1A1A1A] mb-3">
              Alguma dúvida?
            </h2>
            <p className="text-[#6B6B6B]">
              Manda uma mensagem — respondemos rapidinho.
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
      <div className="grid sm:grid-cols-2 gap-4">
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
        className="w-full py-3.5 bg-[#F5A623] text-black font-bold rounded-full hover:bg-[#E09510] transition-colors"
      >
        Enviar mensagem
      </button>
    </form>
  )
}
