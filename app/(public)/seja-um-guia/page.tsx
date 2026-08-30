import Link from 'next/link'
import { CheckCircle2, MapPin, Video, Heart, Shield, ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('becomeGuidePage')
  return { title: t('metaTitle'), description: t('metaDescription') }
}

export default async function SejaUmGuiaPage() {
  const t = await getTranslations('becomeGuidePage')
  const profileCards = t.raw('profile.cards') as { title: string; desc: string }[]
  const steps = t.raw('steps.items') as { title: string; desc: string }[]
  const presentialItems = t.raw('inPerson.items') as string[]
  const virtualItems = t.raw('remote.items') as string[]
  const profileIcons = [MapPin, Heart, Shield]

  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#0A0A0A] text-white py-24 px-4 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[#F5A623] opacity-10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm text-white/70 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#F5A623] animate-pulse flex-shrink-0" />
            {t('badge')}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            {t('titleLine1')}{' '}
            <span className="text-[#F5A623]">{t('titleLine2')}</span>
          </h1>
          <p className="text-white/60 text-lg mb-10 leading-relaxed max-w-xl mx-auto">
            {t('subtitle')}
          </p>
          <Link
            href="/cadastro?guide=true"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#F5A623] text-black font-bold rounded-full hover:bg-[#E09510] transition-colors text-base shadow-lg shadow-[#F5A623]/20"
          >
            {t('ctaHero')}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* O que é ser guia */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-bold text-[#F5A623] uppercase tracking-widest mb-3">{t('profile.eyebrow')}</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A]">
              {t('profile.title')}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {profileCards.map((item, i) => {
              const Icon = profileIcons[i]
              return (
                <div key={item.title} className="bg-[#F9F5EE] rounded-2xl p-8 text-center hover:shadow-md transition-shadow duration-200">
                  <div className="w-14 h-14 bg-[#F5A623] rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <Icon size={24} className="text-black" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{item.title}</h3>
                  <p className="text-[#6B6B6B] text-sm leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-24 px-4 bg-[#F9F5EE]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-bold text-[#F5A623] uppercase tracking-widest mb-3">{t('steps.eyebrow')}</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A]">
              {t('steps.title')}
            </h2>
          </div>
          <div className="space-y-0">
            {steps.map((step, i) => (
              <div key={step.title} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#F5A623] flex items-center justify-center text-black font-extrabold text-sm flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  {i < steps.length - 1 && <div className="w-0.5 h-12 bg-[#E5E5E5] mt-2" />}
                </div>
                <div className="pb-10">
                  <h3 className="font-bold text-[#1A1A1A] mb-1">{step.title}</h3>
                  <p className="text-sm text-[#6B6B6B] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modalidades */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-bold text-[#F5A623] uppercase tracking-widest mb-3">{t('flexibility')}</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A]">
              {t('operatingModels')}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border-2 border-[#F5A623] p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#FEF3DC] rounded-xl flex items-center justify-center">
                  <MapPin size={20} className="text-[#F5A623]" />
                </div>
                <span className="bg-[#F5A623] text-black text-sm font-bold rounded-full px-3 py-1">{t('inPerson.badge')}</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{t('inPerson.title')}</h3>
              <p className="text-[#6B6B6B] text-sm leading-relaxed mb-4">
                {t('inPerson.description')}
              </p>
              <ul className="space-y-2">
                {presentialItems.map((i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-[#6B6B6B]">
                    <CheckCircle2 size={14} className="text-[#F5A623]" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl border-2 border-[#0A0A0A] p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#F9F5EE] rounded-xl flex items-center justify-center">
                  <Video size={20} className="text-[#0A0A0A]" />
                </div>
                <span className="bg-[#0A0A0A] text-white text-sm font-bold rounded-full px-3 py-1">{t('remote.badge')}</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{t('remote.title')}</h3>
              <p className="text-[#6B6B6B] text-sm leading-relaxed mb-4">
                {t('remote.description')}
              </p>
              <ul className="space-y-2">
                {virtualItems.map((i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-[#6B6B6B]">
                    <CheckCircle2 size={14} className="text-[#0A0A0A]" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Voluntário ou remunerado */}
      <section className="py-24 px-4 bg-[#F9F5EE]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-bold text-[#F5A623] uppercase tracking-widest mb-3">{t('yourChoice')}</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A] mb-6">{t('volunteerOrPaid.title')}</h2>
          <p className="text-[#6B6B6B] leading-relaxed mb-4">
            {t('volunteerOrPaid.paragraph1')}
          </p>
          <p className="text-[#6B6B6B] leading-relaxed">
            {t.rich('volunteerOrPaid.paragraph2', { free: (chunks) => <strong className="text-[#1A1A1A]">{chunks}</strong> })}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F5A623] py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-bold text-black/40 uppercase tracking-widest mb-4">{t('joinNetwork')}</p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0A0A0A] mb-5 leading-tight">
            {t('ctaTitle')}
          </h2>
          <p className="text-[#0A0A0A]/65 text-lg mb-10 max-w-md mx-auto">
            {t('ctaSubtitle')}
          </p>
          <Link
            href="/cadastro?guide=true"
            className="inline-flex items-center gap-2 px-10 py-4 bg-[#0A0A0A] text-white font-bold rounded-full hover:bg-[#1A1A1A] transition-colors text-base"
          >
            {t('ctaButton')}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  )
}
