import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, Search, Book, Globe, Lock, Zap, Server, Code } from 'lucide-react';

interface GlossaryScreenProps {
  onNavigate: (screen: 'welcome' | 'map') => void;
}

interface GlossaryTerm {
  id: string;
  term: string;
  category: 'protocols' | 'http' | 'security' | 'performance' | 'general';
  definition: string;
  explanation: string;
  example?: string;
  relatedTerms: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const glossaryTerms: GlossaryTerm[] = [
  {
    id: 'http',
    term: 'HTTP',
    category: 'protocols',
    definition: 'HyperText Transfer Protocol',
    explanation: 'Protocolo de comunicação usado para transferir dados na World Wide Web. É a base da comunicação de dados para a web.',
    example: 'Quando você acessa um site, seu navegador faz uma requisição HTTP para o servidor.',
    relatedTerms: ['HTTPS', 'TCP', 'URL'],
    difficulty: 'beginner'
  },
  {
    id: 'https',
    term: 'HTTPS',
    category: 'security',
    definition: 'HTTP Secure',
    explanation: 'Versão segura do HTTP que usa criptografia TLS/SSL para proteger os dados em trânsito.',
    example: 'Sites de banco sempre usam HTTPS para proteger informações financeiras.',
    relatedTerms: ['HTTP', 'SSL', 'TLS'],
    difficulty: 'beginner'
  },
  {
    id: 'dns',
    term: 'DNS',
    category: 'protocols',
    definition: 'Domain Name System',
    explanation: 'Sistema que traduz nomes de domínio legíveis (como google.com) em endereços IP que os computadores entendem.',
    example: 'google.com → 172.217.14.196',
    relatedTerms: ['IP', 'Domínio', 'URL'],
    difficulty: 'beginner'
  },
  {
    id: 'tcp',
    term: 'TCP',
    category: 'protocols',
    definition: 'Transmission Control Protocol',
    explanation: 'Protocolo de transporte confiável que garante que os dados sejam entregues corretamente e na ordem certa.',
    example: 'O famoso "3-way handshake": SYN → SYN-ACK → ACK',
    relatedTerms: ['HTTP', 'IP', 'UDP'],
    difficulty: 'intermediate'
  },
  {
    id: 'status-code',
    term: 'Status Code',
    category: 'http',
    definition: 'Código de resposta HTTP',
    explanation: 'Números de 3 dígitos que indicam o resultado de uma requisição HTTP.',
    example: '200 = sucesso, 404 = não encontrado, 500 = erro do servidor',
    relatedTerms: ['HTTP', 'Response', 'Headers'],
    difficulty: 'beginner'
  },
  {
    id: 'cors',
    term: 'CORS',
    category: 'security',
    definition: 'Cross-Origin Resource Sharing',
    explanation: 'Mecanismo que permite que recursos sejam solicitados de um domínio diferente do que está servindo o primeiro recurso.',
    example: 'Um site em exemplo.com fazendo requisições para api.outrosite.com',
    relatedTerms: ['Headers', 'Security', 'Browser'],
    difficulty: 'intermediate'
  },
  {
    id: 'cache',
    term: 'Cache',
    category: 'performance',
    definition: 'Armazenamento temporário de dados',
    explanation: 'Técnica para armazenar dados frequentemente acessados em locais de acesso rápido.',
    example: 'Browser cache, CDN cache, server cache',
    relatedTerms: ['CDN', 'Performance', 'Headers'],
    difficulty: 'intermediate'
  },
  {
    id: 'cdn',
    term: 'CDN',
    category: 'performance',
    definition: 'Content Delivery Network',
    explanation: 'Rede de servidores distribuídos geograficamente que entregam conteúdo web de forma mais eficiente.',
    example: 'Cloudflare, AWS CloudFront, Google Cloud CDN',
    relatedTerms: ['Cache', 'Performance', 'Latência'],
    difficulty: 'intermediate'
  },
  {
    id: 'api',
    term: 'API',
    category: 'general',
    definition: 'Application Programming Interface',
    explanation: 'Conjunto de regras e protocolos que permite que diferentes softwares se comuniquem.',
    example: 'REST API, GraphQL API, WebSocket API',
    relatedTerms: ['REST', 'JSON', 'HTTP'],
    difficulty: 'beginner'
  },
  {
    id: 'rest',
    term: 'REST',
    category: 'general',
    definition: 'Representational State Transfer',
    explanation: 'Estilo arquitetural para sistemas distribuídos, especialmente para web services.',
    example: 'GET /users, POST /users, PUT /users/1, DELETE /users/1',
    relatedTerms: ['API', 'HTTP', 'JSON'],
    difficulty: 'intermediate'
  },
  {
    id: 'json',
    term: 'JSON',
    category: 'general',
    definition: 'JavaScript Object Notation',
    explanation: 'Formato leve de intercâmbio de dados, fácil de ler e escrever.',
    example: '{"name": "João", "age": 30, "city": "São Paulo"}',
    relatedTerms: ['API', 'REST', 'XML'],
    difficulty: 'beginner'
  },
  {
    id: 'ssl',
    term: 'SSL',
    category: 'security',
    definition: 'Secure Sockets Layer',
    explanation: 'Protocolo de segurança que criptografa dados transmitidos entre cliente e servidor.',
    example: 'Certificados SSL em sites HTTPS',
    relatedTerms: ['TLS', 'HTTPS', 'Certificado'],
    difficulty: 'advanced'
  }
];

const categories = [
  { id: 'all', name: 'Todos', icon: Book },
  { id: 'protocols', name: 'Protocolos', icon: Globe },
  { id: 'http', name: 'HTTP', icon: Zap },
  { id: 'security', name: 'Segurança', icon: Lock },
  { id: 'performance', name: 'Performance', icon: Server },
  { id: 'general', name: 'Geral', icon: Code }
];

export function GlossaryScreen({ onNavigate }: GlossaryScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);

  const filteredTerms = glossaryTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.explanation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Iniciante';
      case 'intermediate': return 'Intermediário';
      case 'advanced': return 'Avançado';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => onNavigate('welcome')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>

          <div className="text-center">
            <div className="flex items-center gap-2 justify-center mb-2">
              <Book className="w-6 h-6 text-blue-500" />
              <h1 className="text-3xl">Glossário Web</h1>
            </div>
            <p className="text-muted-foreground">
              Dicionário completo de termos de desenvolvimento web
            </p>
          </div>

          <div className="text-right">
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="text-2xl">{glossaryTerms.length}</div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Terms List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filters */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar termos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                  <TabsList className="grid grid-cols-3 lg:grid-cols-6">
                    {categories.map((category) => (
                      <TabsTrigger key={category.id} value={category.id} className="text-xs">
                        <category.icon className="w-3 h-3 mr-1" />
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </Card>

            {/* Terms Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {filteredTerms.map((term, index) => (
                <motion.div
                  key={term.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className="p-4 hover:shadow-lg transition-all cursor-pointer h-full"
                    onClick={() => setSelectedTerm(term)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-medium">{term.term}</h3>
                      <Badge className={getDifficultyColor(term.difficulty)}>
                        {getDifficultyText(term.difficulty)}
                      </Badge>
                    </div>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                      {term.definition}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {term.explanation}
                    </p>
                    {term.relatedTerms.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {term.relatedTerms.slice(0, 3).map((related) => (
                          <Badge key={related} variant="outline">
                            {related}
                          </Badge>
                        ))}
                        {term.relatedTerms.length > 3 && (
                          <Badge variant="outline">
                            +{term.relatedTerms.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredTerms.length === 0 && (
              <Card className="p-12 text-center">
                <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg mb-2">Nenhum termo encontrado</h3>
                <p className="text-muted-foreground">
                  Tente ajustar sua busca ou filtros
                </p>
              </Card>
            )}
          </div>

          {/* Term Detail */}
          <div className="space-y-6">
            {selectedTerm ? (
              <motion.div
                key={selectedTerm.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-2xl">{selectedTerm.term}</h2>
                    <Badge className={getDifficultyColor(selectedTerm.difficulty)}>
                      {getDifficultyText(selectedTerm.difficulty)}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="mb-2 text-blue-600 dark:text-blue-400">
                        Definição
                      </h4>
                      <p className="text-sm">{selectedTerm.definition}</p>
                    </div>

                    <div>
                      <h4 className="mb-2">Explicação</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedTerm.explanation}
                      </p>
                    </div>

                    {selectedTerm.example && (
                      <div>
                        <h4 className="mb-2">Exemplo</h4>
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm">
                          {selectedTerm.example}
                        </div>
                      </div>
                    )}

                    {selectedTerm.relatedTerms.length > 0 && (
                      <div>
                        <h4 className="mb-2">Termos Relacionados</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedTerm.relatedTerms.map((related) => (
                            <Badge 
                              key={related} 
                              variant="outline" 
                              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                              onClick={() => {
                                const relatedTerm = glossaryTerms.find(t => t.term === related);
                                if (relatedTerm) setSelectedTerm(relatedTerm);
                              }}
                            >
                              {related}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ) : (
              <Card className="p-6 text-center">
                <Book className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="mb-2">Selecione um Termo</h3>
                <p className="text-muted-foreground text-sm">
                  Clique em qualquer termo da lista para ver detalhes completos
                </p>
              </Card>
            )}

            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="mb-4">Estatísticas</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total de Termos</span>
                  <span>{glossaryTerms.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Iniciante</span>
                  <span>{glossaryTerms.filter(t => t.difficulty === 'beginner').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Intermediário</span>
                  <span>{glossaryTerms.filter(t => t.difficulty === 'intermediate').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avançado</span>
                  <span>{glossaryTerms.filter(t => t.difficulty === 'advanced').length}</span>
                </div>
              </div>
            </Card>

            {/* Quick Access */}
            <Card className="p-6">
              <h3 className="mb-4">Acesso Rápido</h3>
              <div className="space-y-2">
                {['HTTP', 'HTTPS', 'DNS', 'API', 'JSON'].map((term) => (
                  <Button
                    key={term}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      const foundTerm = glossaryTerms.find(t => t.term === term);
                      if (foundTerm) setSelectedTerm(foundTerm);
                    }}
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}