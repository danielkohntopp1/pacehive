'use client'

import { X } from 'lucide-react'

interface Props {
  variant: 'runner' | 'guide'
  onAccept: () => void
  onClose: () => void
}

const runnerTerms = [
  {
    title: '1. Sobre a PaceHive',
    text: 'A PaceHive é uma plataforma de conexão entre corredores e guias locais. Somos intermediadores — não somos uma agência de turismo, empresa de transporte ou empregadora dos guias cadastrados.',
  },
  {
    title: '2. Responsabilidade sobre pagamentos',
    text: 'Quando um guia cobra pelo serviço, o pagamento é combinado e realizado diretamente entre você e o guia, fora da plataforma. A PaceHive não processa, intermedia, garante nem tem qualquer responsabilidade sobre transações financeiras entre corredores e guias. Avalie o guia e combine as condições antes de efetuar qualquer pagamento.',
  },
  {
    title: '3. Responsabilidade sobre a corrida',
    text: 'Você é responsável pela sua própria segurança durante a corrida. A PaceHive não se responsabiliza por acidentes, lesões, perdas materiais ou qualquer outro dano ocorrido durante ou após a atividade. Avalie suas condições físicas e o ambiente antes de correr.',
  },
  {
    title: '4. Conduta',
    text: 'Espera-se de todos os usuários respeito mútuo, pontualidade e comunicação honesta. Comportamentos abusivos, discriminatórios ou fraudulentos resultarão no cancelamento da conta.',
  },
  {
    title: '5. Cancelamentos',
    text: 'Cancelamentos devem ser comunicados ao guia com a maior antecedência possível. A política de cancelamento e eventuais reembolsos são definidos diretamente entre corredor e guia.',
  },
  {
    title: '6. Dados pessoais',
    text: 'Seus dados são usados exclusivamente para o funcionamento da plataforma. Não vendemos informações a terceiros. Consulte nossa Política de Privacidade em pacehive.com/privacidade.',
  },
]

const guideTerms = [
  {
    title: '1. Natureza do vínculo',
    text: 'Ao se cadastrar como guia, você atua como prestador de serviço independente. Não há vínculo empregatício, societário ou de qualquer natureza entre você e a PaceHive. Você é responsável pelas suas próprias obrigações fiscais e trabalhistas.',
  },
  {
    title: '2. Gratuidade da plataforma',
    text: 'O uso da PaceHive é 100% gratuito para guias nesta versão. Reservamo-nos o direito de introduzir planos pagos no futuro, com aviso prévio aos guias cadastrados.',
  },
  {
    title: '3. Responsabilidade sobre pagamentos',
    text: 'Quando você cobra pelo serviço, o pagamento é acordado e recebido diretamente de cada corredor, fora da plataforma. A PaceHive não processa, garante nem tem qualquer responsabilidade sobre recebimentos. Combine as condições de pagamento antes da corrida.',
  },
  {
    title: '4. Segurança e conduta',
    text: 'Você se compromete a oferecer um serviço seguro, honesto e respeitoso. Não prometa condições que não possa cumprir. Em caso de emergência durante a corrida, priorize a segurança do corredor e acione os serviços de emergência se necessário.',
  },
  {
    title: '5. Atualização de informações',
    text: 'Mantenha seu perfil (cidade, disponibilidade, preço, modalidades) sempre atualizado. Informações desatualizadas que gerem conflitos com corredores podem resultar em suspensão da conta.',
  },
  {
    title: '6. Tempo de resposta',
    text: 'Comprometa-se a responder pedidos em até 24 horas. Guias com tempo de resposta consistentemente alto poderão ter o perfil ocultado temporariamente.',
  },
  {
    title: '7. Dados pessoais',
    text: 'Seus dados são usados exclusivamente para o funcionamento da plataforma e para facilitar o contato com corredores confirmados. Consulte nossa Política de Privacidade em pacehive.com/privacidade.',
  },
]

export default function TermsModal({ variant, onAccept, onClose }: Props) {
  const terms = variant === 'runner' ? runnerTerms : guideTerms
  const title = variant === 'runner' ? 'Termos de Uso — Corredor' : 'Termos de Uso — Guia'

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E5E5] flex-shrink-0">
          <h2 className="text-lg font-bold text-[#1A1A1A]">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[#F9F5EE] transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          <p className="text-xs text-[#6B6B6B]">Última atualização: maio de 2026</p>
          {terms.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-bold text-[#1A1A1A] mb-1.5">{section.title}</h3>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">{section.text}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#E5E5E5] flex-shrink-0">
          <button
            onClick={onAccept}
            className="w-full py-3 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors text-sm"
          >
            Li e aceito os termos
          </button>
        </div>
      </div>
    </div>
  )
}
