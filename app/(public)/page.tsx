import Image from 'next/image'
import Link from 'next/link'
import { Users, Map, Star, ArrowRight, Route, Timer, Trophy, ShieldCheck, Clock, MessageSquare } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import GuideCard from '@/components/guides/GuideCard'
import type { Guide, Profile } from '@/types'

export default async function HomePage() {
  const supabase = await createClient()
  const t = await getTranslations('home')
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
      <section className="relative bg-[#0A0A0A] text-white pt-24 pb-20 px-4 overflow-hidden">
        {/* Dot grid background */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        {/* Orange glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#F5A623] opacity-10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm text-white/70 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#F5A623] animate-pulse flex-shrink-0" />
            {t('hero.badge')}
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.08] mb-6 tracking-tight">
            {t('hero.titleLine1')}{' '}
            <span className="text-[#F5A623]">{t('hero.titleHighlight')}</span>
            <br />{t('hero.titleLine2')}
          </h1>

          <p className="text-lg sm:text-xl text-white/55 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <Link
              href="/guias"
              className="px-8 py-4 bg-[#F5A623] text-black font-bold rounded-full hover:bg-[#E09510] transition-colors text-base shadow-lg shadow-[#F5A623]/20"
            >
              {t('hero.ctaFindGuide')}
            </Link>
            <Link
              href="/seja-um-guia"
              className="px-8 py-4 border border-white/20 text-white font-semibold rounded-full hover:border-white/50 hover:bg-white/5 transition-all text-base"
            >
              {t('hero.ctaBecomeGuide')}
            </Link>
          </div>

          {/* Value props */}
          <div className="border-t border-white/10 pt-10 flex flex-wrap justify-center gap-6">
            {[
              { icon: ShieldCheck, label: t('hero.valueVerified') },
              { icon: Clock, label: t('hero.valueResponse') },
              { icon: MessageSquare, label: t('hero.valueReviews') },
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
                <p className="text-sm font-bold text-[#F5A623] uppercase tracking-widest mb-2">{t('featuredGuides.eyebrow')}</p>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A]">{t('featuredGuides.title')}</h2>
              </div>
              <Link
                href="/guias"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#F5A623] hover:gap-3 transition-all"
              >
                {t('featuredGuides.viewAll')} <ArrowRight size={15} />
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
                {t('featuredGuides.viewAllMobile')} <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── COMO FUNCIONA ── */}
      <section className="bg-white py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-[#F5A623] uppercase tracking-widest mb-3">{t('howItWorks.eyebrow')}</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A]">
              {t('howItWorks.title')}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-10 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[calc(16.66%+40px)] right-[calc(16.66%+40px)] h-px bg-gradient-to-r from-transparent via-[#F5A623]/30 to-transparent" />

            {[
              {
                number: '1',
                icon: Route,
                title: t('howItWorks.step1Title'),
                desc: t('howItWorks.step1Desc'),
              },
              {
                number: '2',
                icon: Timer,
                title: t('howItWorks.step2Title'),
                desc: t('howItWorks.step2Desc'),
              },
              {
                number: '3',
                icon: Trophy,
                title: t('howItWorks.step3Title'),
                desc: t('howItWorks.step3Desc'),
              },
            ].map(({ number, icon: Icon, title, desc }) => (
              <div key={number} className="relative flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-white border border-[#E5E5E5] shadow-sm flex items-center justify-center">
                    <Icon size={28} className="text-[#F5A623]" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#F5A623] text-black text-xs font-extrabold flex items-center justify-center">
                    {number}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">{title}</h3>
                <p className="text-[#6B6B6B] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              href="/guias"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#1A1A1A] text-white font-semibold rounded-full hover:bg-[#0A0A0A] transition-colors"
            >
              {t('howItWorks.cta')}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SERVIÇOS ── */}
      <section className="bg-[#F9F5EE] py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-[#F5A623] uppercase tracking-widest mb-3">{t('services.eyebrow')}</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A] mb-4">
              {t('services.title')}
            </h2>
            <p className="text-[#6B6B6B] text-lg max-w-xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: t('services.guidesTitle'),
                desc: t('services.guidesDesc'),
                cta: t('services.guidesCta'),
                href: '/guias',
                accent: true,
              },
              {
                icon: Map,
                title: t('services.groupsTitle'),
                desc: t('services.groupsDesc'),
                cta: t('services.groupsCta'),
                href: '/grupos',
                accent: false,
              },
              {
                icon: Star,
                title: t('services.becomeGuideTitle'),
                desc: t('services.becomeGuideDesc'),
                cta: t('services.becomeGuideCta'),
                href: '/seja-um-guia',
                accent: false,
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`rounded-2xl border p-8 flex flex-col transition-all duration-200 hover:shadow-md ${
                  item.accent
                    ? 'bg-[#0A0A0A] border-[#0A0A0A] text-white'
                    : 'bg-white border-[#E5E5E5]'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                  item.accent ? 'bg-[#F5A623]/20' : 'bg-[#FEF3DC]'
                }`}>
                  <item.icon size={22} className="text-[#F5A623]" />
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
          <p className="text-sm font-bold text-black/40 uppercase tracking-widest mb-4">{t('guideCta.eyebrow')}</p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0A0A0A] mb-5 leading-tight">
            {t('guideCta.title')}
          </h2>
          <p className="text-[#0A0A0A]/65 text-lg mb-10 max-w-xl mx-auto">
            {t('guideCta.subtitle')}
          </p>
          <Link
            href="/seja-um-guia"
            className="inline-block px-10 py-4 bg-[#0A0A0A] text-white font-bold rounded-full hover:bg-[#1A1A1A] transition-colors text-base"
          >
            {t('guideCta.cta')}
          </Link>
        </div>
      </section>

      {/* ── SOBRE ── */}
      <section className="bg-[#0A0A0A] py-24 px-4">
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
              &ldquo;{t.rich('about.quote', {
                highlight: (chunks) => <span className="text-[#F5A623]">{chunks}</span>,
              })}&rdquo;
            </blockquote>
            <p className="text-white/45 text-base leading-relaxed max-w-xl mx-auto">
              {t.rich('about.body', {
                brand: (chunks) => <span className="text-white font-semibold">{chunks}</span>,
                pace: (chunks) => <span className="text-[#F5A623]">{chunks}</span>,
                hive: (chunks) => <span className="text-[#F5A623]">{chunks}</span>,
              })}
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTATO ── */}
      <section className="bg-[#F9F5EE] py-24 px-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-bold text-[#F5A623] uppercase tracking-widest mb-3">{t('contact.eyebrow')}</p>
            <h2 className="text-3xl font-extrabold text-[#1A1A1A] mb-3">
              {t('contact.title')}
            </h2>
            <p className="text-[#6B6B6B]">
              {t('contact.subtitle')}
            </p>
          </div>
          <ContactForm
            labels={{
              name: t('contact.formName'),
              namePlaceholder: t('contact.formNamePlaceholder'),
              email: t('contact.formEmail'),
              emailPlaceholder: t('contact.formEmailPlaceholder'),
              message: t('contact.formMessage'),
              messagePlaceholder: t('contact.formMessagePlaceholder'),
              submit: t('contact.formSubmit'),
            }}
          />
        </div>
      </section>
    </>
  )
}

interface ContactLabels {
  name: string
  namePlaceholder: string
  email: string
  emailPlaceholder: string
  message: string
  messagePlaceholder: string
  submit: string
}

function ContactForm({ labels }: { labels: ContactLabels }) {
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
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">{labels.name}</label>
          <input
            type="text"
            name="name"
            required
            placeholder={labels.namePlaceholder}
            className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">{labels.email}</label>
          <input
            type="email"
            name="email"
            required
            placeholder={labels.emailPlaceholder}
            className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">{labels.message}</label>
        <textarea
          name="message"
          required
          rows={4}
          placeholder={labels.messagePlaceholder}
          className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all resize-none"
        />
      </div>
      <button
        type="submit"
        className="w-full py-3.5 bg-[#F5A623] text-black font-bold rounded-full hover:bg-[#E09510] transition-colors"
      >
        {labels.submit}
      </button>
    </form>
  )
}
