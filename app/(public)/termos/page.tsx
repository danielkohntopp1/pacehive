import { getTranslations } from 'next-intl/server'

export default async function TermosPage() {
  const t = await getTranslations('termsPage')
  const sections = t.raw('sections') as { title: string; text: string }[]

  return (
    <section className="bg-[#F9F5EE] min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-sm font-bold text-[#F5A623] uppercase tracking-widest mb-2">{t('legal')}</p>
          <h1 className="text-3xl font-extrabold text-[#1A1A1A] mb-2">{t('title')}</h1>
          <p className="text-[#6B6B6B] text-sm">{t('lastUpdated')}</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 space-y-7">
          <p className="text-sm text-[#6B6B6B] leading-relaxed">
            {t('intro')}
          </p>

          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-base font-bold text-[#1A1A1A] mb-2">{section.title}</h2>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">{section.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
