import Link from 'next/link'
import { CheckCircle2, MapPin, Video, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Serviços — PaceHive',
  description: 'Conheça todos os serviços oferecidos pela PaceHive para corredores e guias.',
}

export default function ServicosPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0A0A0A] text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Explore os serviços da PaceHive
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Correndo em uma nova cidade ou guiando corredores por onde você vive,
            a gente conecta pessoas através da corrida.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Guia Presencial */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-8">
              <div className="w-14 h-14 bg-[#FEF3DC] rounded-2xl flex items-center justify-center mb-6">
                <MapPin size={26} className="text-[#F5A623]" />
              </div>
              <span className="bg-[#F5A623] text-black text-xs font-semibold rounded-full px-3 py-1 mb-4 inline-block">
                Presencial
              </span>
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-3">Guia Presencial</h2>
              <p className="text-[#6B6B6B] text-sm leading-relaxed mb-6">
                O guia local vai correr lado a lado com você pelas ruas da cidade, apresentando
                os melhores percursos, pontos turísticos e a cultura local. A experiência mais
                completa e imersiva para quem quer explorar um novo destino com confiança.
              </p>
              <ul className="space-y-2.5 mb-8">
                {[
                  'Rota personalizada ao seu ritmo',
                  'Conhecimento local privilegiado',
                  'Segurança nas ruas e atalhos',
                  'Dicas de restaurantes e pontos turísticos',
                  'Foto e vídeo da corrida (a combinar)',
                  'Conversa e troca cultural',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#6B6B6B]">
                    <CheckCircle2 size={16} className="text-[#F5A623] flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/guias"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors text-sm"
              >
                Encontrar guia presencial
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Guia Virtual */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-8">
              <div className="w-14 h-14 bg-[#FEF3DC] rounded-2xl flex items-center justify-center mb-6">
                <Video size={26} className="text-[#F5A623]" />
              </div>
              <span className="bg-[#0A0A0A] text-white text-xs font-semibold rounded-full px-3 py-1 mb-4 inline-block">
                Virtual
              </span>
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-3">Guia Virtual</h2>
              <p className="text-[#6B6B6B] text-sm leading-relaxed mb-6">
                Receba um plano detalhado de rotas, dicas e recomendações antes de chegar
                à cidade. O guia orienta você remotamente, via WhatsApp, call ou e-mail,
                para que você possa correr com autonomia e segurança.
              </p>
              <ul className="space-y-2.5 mb-8">
                {[
                  'Rota pré-planejada com mapa',
                  'Dicas de segurança por bairro',
                  'Horários ideais para correr',
                  'Recomendações de hidratação e pontos de parada',
                  'Suporte via WhatsApp durante a corrida',
                  'Indicações de grupos locais',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#6B6B6B]">
                    <CheckCircle2 size={16} className="text-[#F5A623] flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/guias"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors text-sm"
              >
                Encontrar guia virtual
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Seja um guia */}
      <section className="bg-[#0A0A0A] py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Quer ser um guia PaceHive?</h2>
          <p className="text-white/60 mb-8 text-lg">
            Compartilhe seu conhecimento da cidade e ajude corredores de todo o mundo.
          </p>
          <Link
            href="/seja-um-guia"
            className="inline-block px-8 py-4 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors"
          >
            Quero ser guia
          </Link>
        </div>
      </section>
    </>
  )
}
