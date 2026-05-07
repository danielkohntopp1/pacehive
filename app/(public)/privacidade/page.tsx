const sections = [
  {
    title: '1. Quais dados coletamos',
    text: 'Coletamos os dados que você fornece ao se cadastrar: nome, e-mail, telefone (opcional), e informações de perfil (cidade, bio, etc.). Também coletamos dados de uso da plataforma de forma agregada e anônima para melhorar nossos serviços.',
  },
  {
    title: '2. Como usamos seus dados',
    text: 'Seus dados são usados para: (a) criar e gerenciar sua conta; (b) conectar corredores a guias; (c) enviar e-mails transacionais relacionados a pedidos de corrida; (d) melhorar a experiência na plataforma. Não usamos seus dados para fins publicitários de terceiros.',
  },
  {
    title: '3. Compartilhamento de dados',
    text: 'Não vendemos seus dados a terceiros. Seus dados de contato (e-mail e telefone) são compartilhados com a outra parte somente após a confirmação de uma corrida, para viabilizar o encontro. Podemos compartilhar dados com prestadores de serviço necessários ao funcionamento da plataforma (hospedagem, envio de e-mails), sempre sob acordo de confidencialidade.',
  },
  {
    title: '4. Armazenamento e segurança',
    text: 'Seus dados são armazenados em servidores seguros (Supabase/AWS) com criptografia em trânsito e em repouso. Adotamos boas práticas de segurança, mas nenhum sistema é 100% inviolável.',
  },
  {
    title: '5. Seus direitos (LGPD)',
    text: 'Conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a: acessar seus dados, corrigir informações incorretas, solicitar a exclusão da sua conta e dos seus dados, e revogar consentimentos a qualquer momento. Para exercer esses direitos, entre em contato pelo e-mail contato@pacehive.com.',
  },
  {
    title: '6. Cookies',
    text: 'Usamos cookies essenciais para autenticação e funcionamento básico da plataforma. Não usamos cookies de rastreamento de terceiros para fins publicitários.',
  },
  {
    title: '7. Retenção de dados',
    text: 'Seus dados são mantidos enquanto sua conta estiver ativa. Após a exclusão da conta, os dados são removidos em até 30 dias, exceto quando sua retenção for exigida por obrigação legal.',
  },
  {
    title: '8. Menores de idade',
    text: 'A PaceHive não é destinada a menores de 18 anos e não coleta conscientemente dados de menores. Se identificarmos tal situação, os dados serão removidos imediatamente.',
  },
  {
    title: '9. Alterações nesta política',
    text: 'Esta política pode ser atualizada periodicamente. Comunicaremos alterações relevantes por e-mail. O uso continuado da plataforma implica aceitação da versão vigente.',
  },
  {
    title: '10. Contato',
    text: 'Dúvidas sobre privacidade ou solicitações relacionadas aos seus dados: contato@pacehive.com.',
  },
]

export default function PrivacidadePage() {
  return (
    <section className="bg-[#F9F5EE] min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-sm font-bold text-[#F5A623] uppercase tracking-widest mb-2">Legal</p>
          <h1 className="text-3xl font-extrabold text-[#1A1A1A] mb-2">Política de Privacidade</h1>
          <p className="text-[#6B6B6B] text-sm">Última atualização: maio de 2026</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 space-y-7">
          <p className="text-sm text-[#6B6B6B] leading-relaxed">
            Esta política descreve como a PaceHive coleta, usa e protege seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018).
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
