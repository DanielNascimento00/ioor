import { BookOpen, Code } from 'lucide-react';
import { Card } from './ui/card';

interface Mission {
  id: number;
  title: string;
  description: string;
  character: string;
  color: string;
  hasQuiz: boolean;
}

interface MissionExplanationProps {
  mission: Mission;
}

const explanations = [
  {
    simple: "Quando você quer visitar um site, primeiro precisa dizer ao navegador qual site você quer ver. É como dizer para alguém: 'Me leve para a casa do João'.",
    technical: "O usuário insere uma URL (Uniform Resource Locator) na barra de endereços do navegador. A URL contém o protocolo (http/https), domínio, porta (opcional) e caminho do recurso desejado.",
    example: "https://www.exemplo.com/pagina"
  },
  {
    simple: "O navegador não sabe onde fica 'www.google.com', então pergunta para o DNS, que é como uma agenda telefônica gigante da internet.",
    technical: "O DNS (Domain Name System) traduz nomes de domínio legíveis em endereços IP numéricos. O navegador consulta servidores DNS em uma hierarquia até encontrar o endereço IP correto.",
    example: "www.google.com → 172.217.14.196"
  },
  {
    simple: "Antes de começar a conversar, o navegador e o servidor fazem um 'aperto de mãos' triplo para confirmar que ambos estão prontos.",
    technical: "O TCP (Transmission Control Protocol) estabelece uma conexão confiável através do 3-way handshake: SYN (sincronização), SYN-ACK (sincronização-confirmação) e ACK (confirmação).",
    example: "Cliente → SYN → Servidor\nCliente ← SYN-ACK ← Servidor\nCliente → ACK → Servidor"
  },
  {
    simple: "Agora o navegador envia uma carta bem educada pedindo a página que você quer ver, com todos os detalhes necessários.",
    technical: "Uma requisição HTTP é enviada contendo método (GET, POST, etc.), headers com metadados, e opcionalmente um body com dados. O servidor interpreta essa requisição.",
    example: "GET /index.html HTTP/1.1\nHost: www.exemplo.com\nUser-Agent: Mozilla/5.0..."
  },
  {
    simple: "O servidor é como um chef que recebe seu pedido, vai na cozinha (banco de dados), prepara exatamente o que você pediu.",
    technical: "O servidor web processa a requisição, podemos ter autenticação, consultas ao banco de dados, processamento de lógica de negócio, e preparação da resposta apropriada.",
    example: "1. Validar requisição\n2. Consultar banco de dados\n3. Processar dados\n4. Gerar resposta"
  },
  {
    simple: "Depois de preparar tudo, o servidor envia de volta sua 'comida' junto com a conta e informações sobre como está tudo.",
    technical: "O servidor retorna uma resposta HTTP com status code (200, 404, 500, etc.), headers de resposta e o body contendo os dados solicitados (HTML, JSON, etc.).",
    example: "HTTP/1.1 200 OK\nContent-Type: text/html\nContent-Length: 1234\n\n<html>...</html>"
  },
  {
    simple: "O navegador recebe tudo e trabalha como um artista, transformando o código em uma página bonita que você pode ver e usar.",
    technical: "O navegador constrói o DOM (Document Object Model), aplica CSS, executa JavaScript, e renderiza a página final. Pode também fazer requisições adicionais para recursos como imagens.",
    example: "HTML → DOM → Aplicar CSS → Executar JS → Renderizar → Página final"
  }
];

export function MissionExplanation({ mission }: MissionExplanationProps) {
  const explanation = explanations[mission.id];

  return (
    <div className="space-y-4">
      {/* Explicação Simples */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-blue-800 dark:text-blue-200 mb-2">
              Explicação Simples
            </h4>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              {explanation.simple}
            </p>
          </div>
        </div>
      </Card>

      {/* Explicação Técnica */}
      <Card className="p-4 bg-purple-50 dark:bg-purple-900/20 border-purple-200">
        <div className="flex items-start gap-3">
          <Code className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-purple-800 dark:text-purple-200 mb-2">
              Detalhes Técnicos
            </h4>
            <p className="text-purple-700 dark:text-purple-300 text-sm mb-3">
              {explanation.technical}
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 rounded p-3">
              <p className="text-xs font-mono text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {explanation.example}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}