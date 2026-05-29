import Link from 'next/link'
import { CheckCircle2, MapPin, Video, Heart, Shield, Clock, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Seja um Guia — PaceHive',
  description: 'Compartilhe sua cidade correndo. Faça parte da rede de guias PaceHive e conecte-se com corredores de todo o mundo.',
}

export default function SejaUmGuiaPage() {
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
            Para guias de corrida
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Compartilhe seu caminho.{' '}
            <span className="text-[#F5A623]">Inspire outros a correr.</span>
          </h1>
          <p className="text-white/60 text-lg mb-10 leading-relaxed max-w-xl mx-auto">
            Para ser guia, você precisa conhecer a cidade, ter empatia com o próximo
            e responsabilidade com quem vai confiar na sua liderança.
          </p>
          <Link
            href="/cadastro?guide=true"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#F5A623] text-black font-bold rounded-full hover:bg-[#E09510] transition-colors text-base shadow-lg shadow-[#F5A623]/20"
          >
            Quero ser guia agora
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* O que é ser guia */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-bold text-[#F5A623] uppercase tracking-widest mb-3">O perfil ideal</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A]">
              O que é ser um guia PaceHive?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: MapPin,
                title: 'Conhece a cidade',
                desc: 'Você sabe os melhores percursos, parques, calçadas seguras e horários ideais para correr na sua cidade.',
              },
              {
                icon: Heart,
                title: 'Tem empatia',
                desc: 'Você consegue adaptar o ritmo e a experiência ao corredor visitante, tornando-a especial e acolhedora.',
              },
              {
                icon: Shield,
                title: 'Tem responsabilidade',
                desc: 'Você se compromete a responder pedidos em até 24h e a honrar o compromisso agendado.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-[#F9F5EE] rounded-2xl p-8 text-center hover:shadow-md transition-shadow duration-200">
                <div className="w-14 h-14 bg-[#F5A623] rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <item.icon size={24} className="text-black" />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{item.title}</h3>
                <p className="text-[#6B6B6B] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-24 px-4 bg-[#F9F5EE]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-bold text-[#F5A623] uppercase tracking-widest mb-3">Passo a passo</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A]">
              Como funciona a intermediação
            </h2>
          </div>
          <div className="space-y-0">
            {[
              { num: '01', title: 'Você se cadastra e cria seu perfil', desc: 'Informe sua cidade, modalidade (presencial/virtual), bio e disponibilidade.' },
              { num: '02', title: 'Corredor te encontra e faz um pedido', desc: 'Um corredor viajante vê seu perfil e solicita uma corrida com data, hora e preferências.' },
              { num: '03', title: 'Você recebe o pedido por e-mail', desc: 'Um e-mail com todos os detalhes chega para você. Você tem 24h para responder.' },
              { num: '04', title: 'Você aceita ou recusa', desc: 'Se aceitar, ambos recebem os dados de contato um do outro para acertar os detalhes finais.' },
              { num: '05', title: 'Após a corrida, ambos avaliam', desc: 'A avaliação é automática. Sua nota média aparece no seu perfil e atrai mais corredores.' },
            ].map((step, i) => (
              <div key={step.num} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#F5A623] flex items-center justify-center text-black font-extrabold text-sm flex-shrink-0">
                    {step.num}
                  </div>
                  {i < 4 && <div className="w-0.5 h-12 bg-[#E5E5E5] mt-2" />}
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
            <p className="text-sm font-bold text-[#F5A623] uppercase tracking-widest mb-3">Flexibilidade</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A]">
              Modelos de atuação
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border-2 border-[#F5A623] p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#FEF3DC] rounded-xl flex items-center justify-center">
                  <MapPin size={20} className="text-[#F5A623]" />
                </div>
                <span className="bg-[#F5A623] text-black text-sm font-bold rounded-full px-3 py-1">Presencial</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Guia no Terreno</h3>
              <p className="text-[#6B6B6B] text-sm leading-relaxed mb-4">
                Você corre junto com o visitante. Perfeito para quem quer proporcionar uma
                experiência humana e imersiva da cidade.
              </p>
              <ul className="space-y-2">
                {['Encontro presencial no ponto combinado', 'Rota adaptada ao ritmo do corredor', 'Compartilhamento de cultura local'].map((i) => (
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
                <span className="bg-[#0A0A0A] text-white text-sm font-bold rounded-full px-3 py-1">Virtual</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Guia Remoto</h3>
              <p className="text-[#6B6B6B] text-sm leading-relaxed mb-4">
                Você orienta o corredor remotamente antes e durante a visita, via WhatsApp,
                e-mail ou chamada de vídeo.
              </p>
              <ul className="space-y-2">
                {['Envio de rotas e mapas personalizados', 'Dicas de segurança e logística', 'Suporte em tempo real durante a corrida'].map((i) => (
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
          <p className="text-sm font-bold text-[#F5A623] uppercase tracking-widest mb-3">Sua escolha</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A] mb-6">Voluntário ou remunerado?</h2>
          <p className="text-[#6B6B6B] leading-relaxed mb-4">
            Na PaceHive, você decide. Muitos guias atuam como voluntários porque amam
            compartilhar sua cidade e fazer conexões genuínas. Outros optam por cobrar
            uma taxa pelo serviço — e isso é totalmente válido e transparente para o corredor.
          </p>
          <p className="text-[#6B6B6B] leading-relaxed">
            Independente do modelo, a plataforma é <strong className="text-[#1A1A1A]">100% gratuita</strong> para
            guias nesta versão. Cobrar ou não é sua escolha.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F5A623] py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-bold text-black/40 uppercase tracking-widest mb-4">Junte-se à rede</p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0A0A0A] mb-5 leading-tight">
            Pronto para ser guia?
          </h2>
          <p className="text-[#0A0A0A]/65 text-lg mb-10 max-w-md mx-auto">
            Leva menos de 5 minutos para criar seu perfil e começar a receber pedidos.
          </p>
          <Link
            href="/cadastro?guide=true"
            className="inline-flex items-center gap-2 px-10 py-4 bg-[#0A0A0A] text-white font-bold rounded-full hover:bg-[#1A1A1A] transition-colors text-base"
          >
            Criar meu perfil de guia
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  )
}
