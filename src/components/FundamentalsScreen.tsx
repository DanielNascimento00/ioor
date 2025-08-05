import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Globe,
  Layers,
  Network,
  Router,
  Shield,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { UserState } from "../App";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

interface FundamentalsScreenProps {
  userState: UserState;
  onNavigate: (screen: "welcome" | "map") => void;
  onUpdateProgress: (updates: Partial<UserState>) => void;
}

interface FundamentalTopic {
  id: string;
  title: string;
  category: string;
  icon: LucideIcon;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  content: {
    overview: string;
    keyPoints: string[];
    examples: string[];
    diagram?: string;
    relatedTopics: string[];
  };
}

const fundamentalTopics: FundamentalTopic[] = [
  // Conceitos Fundamentais
  {
    id: "osi-model",
    title: "Modelo OSI",
    category: "concepts",
    icon: Layers,
    description: "Os 7 camadas do modelo de referência OSI",
    difficulty: "beginner",
    estimatedTime: "15 min",
    content: {
      overview:
        "O modelo OSI (Open Systems Interconnection) é um modelo conceitual que padroniza as funções de um sistema de comunicação em 7 camadas abstratas.",
      keyPoints: [
        "7. Aplicação - Interface com o usuário (HTTP, FTP, SMTP)",
        "6. Apresentação - Criptografia e compressão",
        "5. Sessão - Estabelecimento e controle de sessões",
        "4. Transporte - Controle de fluxo e erro (TCP, UDP)",
        "3. Rede - Roteamento de pacotes (IP)",
        "2. Enlace - Detecção e correção de erros (Ethernet)",
        "1. Física - Transmissão de bits (cabos, sinais)",
      ],
      examples: [
        "Camada Física: Cabos de fibra ótica, sinais elétricos",
        "Camada de Rede: Endereçamento IP, roteamento",
        "Camada de Transporte: Estabelecimento de conexões TCP",
        "Camada de Aplicação: Navegador web usando HTTP",
      ],
      relatedTopics: [
        "tcp-ip-model",
        "networking-basics",
        "protocols-overview",
      ],
    },
  },
  {
    id: "tcp-ip-model",
    title: "Modelo TCP/IP",
    category: "concepts",
    icon: Globe,
    description: "O modelo de 4 camadas usado na Internet",
    difficulty: "beginner",
    estimatedTime: "12 min",
    content: {
      overview:
        "O modelo TCP/IP é o modelo prático usado na Internet, organizando protocolos em 4 camadas funcionais.",
      keyPoints: [
        "4. Aplicação - Protocolos de aplicação (HTTP, DNS, FTP)",
        "3. Transporte - Comunicação fim-a-fim (TCP, UDP)",
        "2. Internet - Roteamento entre redes (IP, ICMP)",
        "1. Acesso à Rede - Interface com hardware (Ethernet, Wi-Fi)",
      ],
      examples: [
        "Aplicação: HTTP para navegação web",
        "Transporte: TCP garantindo entrega confiável",
        "Internet: IP roteando pacotes pela rede",
        "Acesso à Rede: Ethernet conectando dispositivos",
      ],
      relatedTopics: ["osi-model", "ip-addressing", "routing-basics"],
    },
  },
  {
    id: "networking-basics",
    title: "Fundamentos de Rede",
    category: "concepts",
    icon: Network,
    description: "Conceitos básicos de comunicação em rede",
    difficulty: "beginner",
    estimatedTime: "20 min",
    content: {
      overview:
        "Conceitos fundamentais que formam a base de todas as comunicações em rede de computadores.",
      keyPoints: [
        "Largura de banda - Capacidade máxima de transmissão",
        "Latência - Tempo de propagação do sinal",
        "Throughput - Taxa real de transferência de dados",
        "Jitter - Variação no atraso de pacotes",
        "Perda de pacotes - Falha na entrega de dados",
        "Topologias - Estrela, anel, barramento, malha",
      ],
      examples: [
        "Largura de banda: 100 Mbps em uma conexão Ethernet",
        "Latência: 50ms para conexão intercontinental",
        "Topologia estrela: Hub central conectando todos os dispositivos",
        "Perda de pacotes: 0.1% em redes bem configuradas",
      ],
      relatedTopics: [
        "network-topologies",
        "performance-metrics",
        "qos-basics",
      ],
    },
  },

  // Protocolos
  {
    id: "http-https",
    title: "HTTP/HTTPS",
    category: "protocols",
    icon: Globe,
    description: "Protocolos de transferência de hipertexto",
    difficulty: "intermediate",
    estimatedTime: "25 min",
    content: {
      overview:
        "HTTP e HTTPS são protocolos fundamentais para comunicação web, sendo HTTPS a versão segura com criptografia.",
      keyPoints: [
        "HTTP - Protocolo stateless para transferência de hipertexto",
        "HTTPS - HTTP com camada de segurança TLS/SSL",
        "Métodos: GET, POST, PUT, DELETE, PATCH",
        "Status codes: 200 (OK), 404 (Not Found), 500 (Server Error)",
        "Headers: Content-Type, Authorization, Cache-Control",
        "Cookies e sessões para manter estado",
      ],
      examples: [
        "GET /api/users - Buscar lista de usuários",
        "POST /login - Autenticar usuário",
        "Status 301 - Redirecionamento permanente",
        "Header Authorization: Bearer token123",
      ],
      relatedTopics: ["tls-ssl", "web-security", "rest-apis"],
    },
  },
  {
    id: "tcp-udp",
    title: "TCP vs UDP",
    category: "protocols",
    icon: Zap,
    description: "Protocolos de transporte: confiável vs rápido",
    difficulty: "intermediate",
    estimatedTime: "18 min",
    content: {
      overview:
        "TCP e UDP são os principais protocolos da camada de transporte, cada um otimizado para diferentes necessidades.",
      keyPoints: [
        "TCP - Confiável, orientado à conexão, controle de fluxo",
        "UDP - Rápido, sem conexão, sem garantias",
        "TCP: 3-way handshake, acknowledgments, retransmissão",
        "UDP: Usado em streaming, DNS, jogos online",
        "TCP overhead vs UDP simplicidade",
        "Portas para multiplexação de aplicações",
      ],
      examples: [
        "TCP: Navegação web, email, transferência de arquivos",
        "UDP: Streaming de vídeo, jogos online, DNS",
        "Porta 80 para HTTP, porta 443 para HTTPS",
        "Porta 53 para DNS queries",
      ],
      relatedTopics: ["port-numbers", "network-sockets", "streaming-protocols"],
    },
  },
  {
    id: "dns-system",
    title: "Sistema DNS",
    category: "protocols",
    icon: BookOpen,
    description: "Domain Name System - traduzindo nomes em IPs",
    difficulty: "intermediate",
    estimatedTime: "22 min",
    content: {
      overview:
        "DNS é um sistema hierárquico e distribuído que traduz nomes de domínio em endereços IP.",
      keyPoints: [
        "Hierarquia: Root → TLD → Domínio → Subdomínio",
        "Tipos de servidores: Recursivo, Autoritativo, Root",
        "Tipos de registros: A, AAAA, CNAME, MX, NS, TXT",
        "Cache DNS para performance",
        "TTL (Time To Live) para controle de cache",
        "DNS over HTTPS (DoH) e DNS over TLS (DoT)",
      ],
      examples: [
        "exemplo.com → Registro A → 192.168.1.1",
        "mail.exemplo.com → MX → servidor de email",
        "www.exemplo.com → CNAME → exemplo.com",
        "Cache DNS local: 300 segundos TTL",
      ],
      relatedTopics: ["ip-addressing", "domain-management", "network-security"],
    },
  },

  // Tecnologias
  {
    id: "ethernet",
    title: "Tecnologia Ethernet",
    category: "technologies",
    icon: Router,
    description: "Padrão de rede local mais utilizado",
    difficulty: "intermediate",
    estimatedTime: "20 min",
    content: {
      overview:
        "Ethernet é a tecnologia de rede local mais amplamente utilizada, definindo padrões para camada física e de enlace.",
      keyPoints: [
        "Padrões: 10BASE-T, 100BASE-TX, 1000BASE-T, 10GBASE-T",
        "Frame Ethernet: Preâmbulo, endereços MAC, dados, FCS",
        "CSMA/CD - Carrier Sense Multiple Access with Collision Detection",
        "Switches vs Hubs: Domínios de colisão",
        "Full-duplex vs Half-duplex",
        "VLANs para segmentação lógica",
      ],
      examples: [
        "1000BASE-T: 1 Gbps sobre cabo Cat5e/Cat6",
        "Frame Ethernet: 64-1518 bytes",
        "MAC Address: 00:1B:44:11:3A:B7",
        "VLAN 10 para departamento de TI",
      ],
      relatedTopics: ["switching", "vlans", "mac-addressing"],
    },
  },
  {
    id: "wifi-wireless",
    title: "Wi-Fi e Redes Sem Fio",
    category: "technologies",
    icon: Network,
    description: "Tecnologias de rede sem fio",
    difficulty: "intermediate",
    estimatedTime: "25 min",
    content: {
      overview:
        "Wi-Fi é a tecnologia de rede sem fio baseada nos padrões IEEE 802.11, permitindo conectividade móvel.",
      keyPoints: [
        "Padrões: 802.11a/b/g/n/ac/ax (Wi-Fi 6)",
        "Frequências: 2.4 GHz e 5 GHz",
        "Segurança: WEP, WPA, WPA2, WPA3",
        "SSID e autenticação",
        "QoS em redes sem fio",
        "Roaming e handoff",
      ],
      examples: [
        "802.11ac: até 1.3 Gbps em 5 GHz",
        "WPA3: autenticação mais segura",
        'SSID: "Rede_Empresa_5G"',
        "Roaming: mudança automática entre APs",
      ],
      relatedTopics: ["wireless-security", "network-planning", "mobility"],
    },
  },

  // Segurança
  {
    id: "network-security",
    title: "Segurança de Rede",
    category: "security",
    icon: Shield,
    description: "Fundamentos de segurança em redes",
    difficulty: "advanced",
    estimatedTime: "30 min",
    content: {
      overview:
        "Segurança de rede envolve proteger dados, recursos e comunicações contra ameaças e acessos não autorizados.",
      keyPoints: [
        "CIA Triad: Confidencialidade, Integridade, Disponibilidade",
        "Firewalls: Packet filtering, stateful, application-layer",
        "IDS/IPS: Detecção e prevenção de intrusões",
        "VPN: Túneis seguros sobre redes públicas",
        "Autenticação: Something you know/have/are",
        "Criptografia: Simétrica, assimétrica, hashing",
      ],
      examples: [
        "Firewall: Bloquear porta 22 (SSH) externamente",
        "VPN IPSec: Conectar filiais com segurança",
        "IDS: Detectar scan de portas",
        "2FA: Senha + token do smartphone",
      ],
      relatedTopics: ["cryptography", "vpn-technologies", "threat-analysis"],
    },
  },
  {
    id: "tls-ssl",
    title: "TLS/SSL",
    category: "security",
    icon: Shield,
    description: "Protocolos de segurança para transporte",
    difficulty: "advanced",
    estimatedTime: "28 min",
    content: {
      overview:
        "TLS (Transport Layer Security) é o protocolo padrão para comunicações seguras na Internet.",
      keyPoints: [
        "Handshake TLS: Negociação de parâmetros de segurança",
        "Certificados digitais e PKI",
        "Cipher suites: Algoritmos de criptografia",
        "Perfect Forward Secrecy (PFS)",
        "TLS 1.2 vs TLS 1.3: Melhorias de performance e segurança",
        "HSTS: HTTP Strict Transport Security",
      ],
      examples: [
        "Handshake: ClientHello → ServerHello → Certificate → Finished",
        "Cipher suite: TLS_AES_256_GCM_SHA384",
        "Certificado: CN=exemplo.com, válido por 1 ano",
        "HSTS: Forçar HTTPS por 1 ano",
      ],
      relatedTopics: ["pki", "cryptography", "web-security"],
    },
  },

  // Performance
  {
    id: "qos-basics",
    title: "Quality of Service (QoS)",
    category: "performance",
    icon: Zap,
    description: "Garantindo qualidade na transmissão",
    difficulty: "advanced",
    estimatedTime: "25 min",
    content: {
      overview:
        "QoS é um conjunto de tecnologias para gerenciar e garantir a qualidade da transmissão de dados em redes.",
      keyPoints: [
        "Traffic shaping e policing",
        "Priority queuing e weighted fair queuing",
        "Differentiated Services (DiffServ)",
        "Traffic classification e marking",
        "Bandwidth allocation e rate limiting",
        "SLA (Service Level Agreement)",
      ],
      examples: [
        "Prioridade alta: Chamadas VoIP",
        "Prioridade média: Video streaming",
        "Prioridade baixa: Downloads de arquivos",
        "DSCP marking: AF31 para vídeo",
      ],
      relatedTopics: [
        "traffic-engineering",
        "network-monitoring",
        "sla-management",
      ],
    },
  },
];

const categories = [
  { id: "all", name: "Todos", icon: BookOpen, color: "text-blue-500" },
  { id: "concepts", name: "Conceitos", icon: Layers, color: "text-green-500" },
  {
    id: "protocols",
    name: "Protocolos",
    icon: Globe,
    color: "text-purple-500",
  },
  {
    id: "technologies",
    name: "Tecnologias",
    icon: Router,
    color: "text-orange-500",
  },
  { id: "security", name: "Segurança", icon: Shield, color: "text-red-500" },
  {
    id: "performance",
    name: "Performance",
    icon: Zap,
    color: "text-yellow-500",
  },
];

export function FundamentalsScreen({
  userState,
  onNavigate,
  onUpdateProgress,
}: FundamentalsScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState<FundamentalTopic | null>(
    null
  );

  const filteredTopics = fundamentalTopics.filter(
    (topic) => selectedCategory === "all" || topic.category === selectedCategory
  );

  const handleTopicRead = (topicId: string) => {
    if (!userState.fundamentalsRead.includes(topicId)) {
      const newFundamentalsRead = [...userState.fundamentalsRead, topicId];
      onUpdateProgress({
        fundamentalsRead: newFundamentalsRead,
        score: userState.score + 10, // Bonus XP for reading fundamentals
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500";
      case "intermediate":
        return "bg-yellow-500";
      case "advanced":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "Iniciante";
      case "intermediate":
        return "Intermediário";
      case "advanced":
        return "Avançado";
      default:
        return "Desconhecido";
    }
  };

  const getReadTopicsCount = () => {
    return userState.fundamentalsRead.length;
  };

  const getCategoryProgress = (categoryId: string) => {
    const categoryTopics = fundamentalTopics.filter(
      (t) => categoryId === "all" || t.category === categoryId
    );
    const readTopics = categoryTopics.filter((t) =>
      userState.fundamentalsRead.includes(t.id)
    );
    return Math.round((readTopics.length / categoryTopics.length) * 100);
  };

  if (selectedTopic) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => setSelectedTopic(null)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar aos Fundamentos
            </Button>

            <div className="text-center">
              <div className="flex items-center gap-3 justify-center mb-2">
                <selectedTopic.icon className="w-6 h-6 text-blue-500" />
                <h1 className="text-3xl">{selectedTopic.title}</h1>
              </div>
              <div className="flex justify-center gap-2">
                <Badge className={getDifficultyColor(selectedTopic.difficulty)}>
                  {getDifficultyText(selectedTopic.difficulty)}
                </Badge>
                <Badge variant="outline">{selectedTopic.estimatedTime}</Badge>
                {userState.fundamentalsRead.includes(selectedTopic.id) && (
                  <Badge className="bg-green-500 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Lido
                  </Badge>
                )}
              </div>
            </div>

            <div className="w-24"></div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8">
              <div className="space-y-8">
                {/* Overview */}
                <div>
                  <h3 className="mb-4">Visão Geral</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedTopic.content.overview}
                  </p>
                </div>

                {/* Key Points */}
                <div>
                  <h3 className="mb-4">Pontos Principais</h3>
                  <div className="space-y-3">
                    {selectedTopic.content.keyPoints.map((point, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-sm">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Examples */}
                {selectedTopic.content.examples.length > 0 && (
                  <div>
                    <h3 className="mb-4">Exemplos Práticos</h3>
                    <div className="space-y-3">
                      {selectedTopic.content.examples.map((example, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg"
                        >
                          <code className="text-sm">{example}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Topics */}
                {selectedTopic.content.relatedTopics.length > 0 && (
                  <div>
                    <h3 className="mb-4">Tópicos Relacionados</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTopic.content.relatedTopics.map((relatedId) => {
                        const relatedTopic = fundamentalTopics.find(
                          (t) => t.id === relatedId
                        );
                        return (
                          relatedTopic && (
                            <Badge
                              key={relatedId}
                              variant="outline"
                              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                              onClick={() => setSelectedTopic(relatedTopic)}
                            >
                              {relatedTopic.title}
                            </Badge>
                          )
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Mark as Read */}
              <div className="mt-8 pt-6 border-t">
                <Button
                  onClick={() => handleTopicRead(selectedTopic.id)}
                  disabled={userState.fundamentalsRead.includes(
                    selectedTopic.id
                  )}
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                >
                  {userState.fundamentalsRead.includes(selectedTopic.id) ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Concluído
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4 mr-2" />
                      Marcar como Lido (+10 XP)
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

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
            onClick={() => onNavigate("welcome")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Início
          </Button>

          <div className="text-center">
            <div className="flex items-center gap-2 justify-center mb-2">
              <Network className="w-6 h-6 text-blue-500" />
              <h1 className="text-3xl">Fundamentos de Redes</h1>
            </div>
            <p className="text-muted-foreground">
              Conceitos, protocolos e tecnologias essenciais
            </p>
          </div>

          <div className="text-right">
            <div className="text-sm text-muted-foreground">Lidos</div>
            <div className="text-2xl">
              {getReadTopicsCount()}/{fundamentalTopics.length}
            </div>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="p-6 text-center">
            <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl mb-1">{getReadTopicsCount()}</div>
            <div className="text-sm text-muted-foreground">
              Tópicos Estudados
            </div>
          </Card>
          <Card className="p-6 text-center">
            <Network className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl mb-1">
              {Math.round(
                (getReadTopicsCount() / fundamentalTopics.length) * 100
              )}
              %
            </div>
            <div className="text-sm text-muted-foreground">Progresso Total</div>
          </Card>
          <Card className="p-6 text-center">
            <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl mb-1">+{getReadTopicsCount() * 10}</div>
            <div className="text-sm text-muted-foreground">
              XP dos Fundamentos
            </div>
          </Card>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid grid-cols-2 lg:grid-cols-6 h-auto">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex flex-col items-center gap-2 p-4"
                >
                  <category.icon className={`w-5 h-5 ${category.color}`} />
                  <div className="text-xs">
                    <div>{category.name}</div>
                    <div className="text-muted-foreground">
                      {getCategoryProgress(category.id)}%
                    </div>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Topics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredTopics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <Card
                className="p-6 h-full hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => setSelectedTopic(topic)}
              >
                <div className="flex items-start justify-between mb-4">
                  <topic.icon className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
                  {userState.fundamentalsRead.includes(topic.id) && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>

                <h3 className="mb-2">{topic.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {topic.description}
                </p>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Badge
                      className={`${getDifficultyColor(
                        topic.difficulty
                      )} text-sm`}
                    >
                      {getDifficultyText(topic.difficulty)}
                    </Badge>
                    <Badge variant="outline" className="size-sm">
                      {topic.estimatedTime}
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <Button
            onClick={() => onNavigate("map")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Aplicar nos Desafios
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
