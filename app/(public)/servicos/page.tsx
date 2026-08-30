import Link from 'next/link'
import { CheckCircle2, MapPin, Video, ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('servicesPage')
  return { title: t('metaTitle'), description: t('metaDescription') }
}

export default async function ServicosPage() {
  const t = await getTranslations('servicesPage')
  const presentialItems = t.raw('presential.items') as string[]
  const virtualItems = t.raw('virtual.items') as string[]

  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#0A0A0A] text-white py-20 px-4 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[#F5A623] opacity-10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm text-white/70 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#F5A623] animate-pulse flex-shrink-0" />
            {t('badge')}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            {t.rich('title', { brand: (chunks) => <span className="text-[#F5A623]">{chunks}</span> })}
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="bg-[#F9F5EE] py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-bold text-[#F5A623] uppercase tracking-widest mb-3">{t('modalities')}</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A]">
              {t('howDoYouWantToRun')}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Guia Presencial — dark card */}
            <div className="bg-[#0A0A0A] rounded-2xl p-8 flex flex-col">
              <div className="w-14 h-14 bg-[#F5A623]/20 rounded-2xl flex items-center justify-center mb-6">
                <MapPin size={26} className="text-[#F5A623]" />
              </div>
              <span className="bg-[#F5A623] text-black text-xs font-bold rounded-full px-3 py-1 mb-5 inline-block w-fit">
                {t('presential.badge')}
              </span>
              <h2 className="text-2xl font-bold text-white mb-3">{t('presential.title')}</h2>
              <p className="text-white/60 text-sm leading-relaxed mb-6 flex-1">
                {t('presential.description')}
              </p>
              <ul className="space-y-2.5 mb-8">
                {presentialItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-white/60">
                    <CheckCircle2 size={15} className="text-[#F5A623] flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/guias"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#F5A623] hover:gap-3 transition-all"
              >
                {t('presential.cta')} <ArrowRight size={15} />
              </Link>
            </div>

            {/* Guia Virtual — light card */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 flex flex-col">
              <div className="w-14 h-14 bg-[#FEF3DC] rounded-2xl flex items-center justify-center mb-6">
                <Video size={26} className="text-[#F5A623]" />
              </div>
              <span className="bg-[#0A0A0A] text-white text-xs font-bold rounded-full px-3 py-1 mb-5 inline-block w-fit">
                {t('virtual.badge')}
              </span>
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-3">{t('virtual.title')}</h2>
              <p className="text-[#6B6B6B] text-sm leading-relaxed mb-6 flex-1">
                {t('virtual.description')}
              </p>
              <ul className="space-y-2.5 mb-8">
                {virtualItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#6B6B6B]">
                    <CheckCircle2 size={15} className="text-[#F5A623] flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/guias"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#F5A623] hover:gap-3 transition-all"
              >
                {t('virtual.cta')} <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F5A623] py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-bold text-black/40 uppercase tracking-widest mb-4">{t('forGuides')}</p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0A0A0A] mb-5 leading-tight">
            {t('ctaTitle')}
          </h2>
          <p className="text-[#0A0A0A]/65 text-lg mb-10 max-w-xl mx-auto">
            {t('ctaSubtitle')}
          </p>
          <Link
            href="/seja-um-guia"
            className="inline-block px-10 py-4 bg-[#0A0A0A] text-white font-bold rounded-full hover:bg-[#1A1A1A] transition-colors text-base"
          >
            {t('ctaButton')}
          </Link>
        </div>
      </section>
    </>
  )
}
