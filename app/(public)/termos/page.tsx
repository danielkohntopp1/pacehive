const sections = [
  {
    title: '1. Sobre a PaceHive',
    text: 'A PaceHive é uma plataforma digital que conecta corredores a guias locais de corrida. Atuamos como intermediadores — não somos agência de turismo, empresa de transporte nem empregadora dos guias cadastrados.',
  },
  {
    title: '2. Uso da plataforma',
    text: 'O uso da PaceHive é permitido a maiores de 18 anos. Ao se cadastrar, você concorda com estes termos e com nossa Política de Privacidade. É proibido usar a plataforma para fins ilícitos, fraudulentos ou que causem dano a terceiros.',
  },
  {
    title: '3. Responsabilidade sobre pagamentos',
    text: 'Quando um guia cobra pelo serviço, o pagamento é acordado e realizado diretamente entre corredor e guia, fora da plataforma. A PaceHive não processa, intermedia, garante nem tem qualquer responsabilidade sobre transações financeiras entre seus usuários.',
  },
  {
    title: '4. Responsabilidade sobre as atividades',
    text: 'A PaceHive não se responsabiliza por acidentes, lesões, perdas materiais ou quaisquer outros danos ocorridos durante ou após as corridas. Cada usuário é responsável por avaliar suas condições físicas e o ambiente antes de realizar qualquer atividade.',
  },
  {
    title: '5. Guias independentes',
    text: 'Os guias cadastrados são prestadores de serviço independentes. Não há vínculo empregatício, societário ou de qualquer natureza entre os guias e a PaceHive. A plataforma não garante a qualidade, segurança ou veracidade das informações fornecidas pelos guias.',
  },
  {
    title: '6. Conduta dos usuários',
    text: 'Espera-se de todos os usuários respeito mútuo, honestidade e boa-fé. A PaceHive se reserva o direito de suspender ou cancelar contas que apresentem comportamento abusivo, discriminatório, fraudulento ou que violem estes termos.',
  },
  {
    title: '7. Disponibilidade do serviço',
    text: 'A PaceHive se esforça para manter a plataforma disponível 24 horas por dia, mas não garante disponibilidade ininterrupta. Podemos realizar manutenções, atualizações ou encerrar funcionalidades sem aviso prévio.',
  },
  {
    title: '8. Modificações dos termos',
    text: 'Estes termos podem ser atualizados a qualquer momento. Alterações relevantes serão comunicadas por e-mail. O uso continuado da plataforma após alterações implica aceitação dos novos termos.',
  },
  {
    title: '9. Foro e lei aplicável',
    text: 'Estes termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca de São Paulo/SP para dirimir quaisquer controvérsias.',
  },
  {
    title: '10. Contato',
    text: 'Para dúvidas sobre estes termos, entre em contato pelo e-mail contato@pacehive.com.',
  },
]

export default function TermosPage() {
  return (
    <section className="bg-[#F9F5EE] min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-sm font-bold text-[#F5A623] uppercase tracking-widest mb-2">Legal</p>
          <h1 className="text-3xl font-extrabold text-[#1A1A1A] mb-2">Termos de Uso</h1>
          <p className="text-[#6B6B6B] text-sm">Última atualização: maio de 2026</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 space-y-7">
          <p className="text-sm text-[#6B6B6B] leading-relaxed">
            Ao usar a PaceHive, você concorda com os termos abaixo. Leia com atenção antes de continuar.
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
