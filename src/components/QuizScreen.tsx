import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react';
import type { UserState } from '../App';

interface QuizScreenProps {
  missionIndex: number;
  userState: UserState;
  onNavigate: (screen: 'map' | 'mission') => void;
  onUpdateProgress: (updates: Partial<UserState>) => void;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Expanded quiz database with comprehensive questions for each mission
const QUIZ_DATABASE: Record<number, Question[]> = {
  0: [
    {
      question: "O que acontece quando você digita uma URL no navegador?",
      options: [
        "O navegador conecta diretamente ao servidor",
        "O navegador primeiro precisa resolver o DNS",
        "A página é carregada do cache automaticamente",
        "O navegador faz download de todos os arquivos"
      ],
      correctAnswer: 1,
      explanation: "Antes de conectar ao servidor, o navegador precisa resolver o nome do domínio em um endereço IP através do DNS.",
      difficulty: 'easy'
    },
    {
      question: "Qual é o primeiro protocolo envolvido ao acessar uma URL?",
      options: ["HTTP", "TCP", "DNS", "IP"],
      correctAnswer: 2,
      explanation: "DNS (Domain Name System) é o primeiro protocolo usado para resolver o nome do domínio em um endereço IP.",
      difficulty: 'easy'
    },
    {
      question: "O que significa URL?",
      options: [
        "Universal Resource Locator",
        "Uniform Resource Locator", 
        "Universal Reference Link",
        "Uniform Reference Locator"
      ],
      correctAnswer: 1,
      explanation: "URL significa Uniform Resource Locator - um endereço padrão para localizar recursos na web.",
      difficulty: 'easy'
    }
  ],
  1: [
    {
      question: "O que o DNS faz exatamente?",
      options: [
        "Criptografa os dados da conexão",
        "Traduz nomes de domínio em endereços IP",
        "Transfere arquivos entre servidores",
        "Autentica usuários na rede"
      ],
      correctAnswer: 1,
      explanation: "DNS (Domain Name System) é responsável por traduzir nomes de domínio legíveis como 'google.com' em endereços IP como '172.217.14.196'.",
      difficulty: 'easy'
    },
    {
      question: "Qual é a ordem hierárquica da resolução DNS?",
      options: [
        "Servidor local → Servidor raiz → TLD → Autoritativo",
        "Servidor raiz → TLD → Autoritativo → Local",
        "Cache local → Servidor recursivo → Raiz → TLD → Autoritativo",
        "TLD → Raiz → Autoritativo → Cache"
      ],
      correctAnswer: 2,
      explanation: "A resolução DNS segue: Cache local → Servidor recursivo → Servidor raiz → TLD (Top Level Domain) → Servidor autoritativo.",
      difficulty: 'medium'
    },
    {
      question: "Qual tipo de registro DNS retorna o endereço IP?",
      options: ["CNAME", "MX", "A", "TXT"],
      correctAnswer: 2,
      explanation: "O registro A (Address) retorna o endereço IPv4 associado ao nome do domínio.",
      difficulty: 'medium'
    },
    {
      question: "Por que o DNS usa cache?",
      options: [
        "Para melhorar a segurança",
        "Para reduzir latência e carga nos servidores",
        "Para criptografar consultas",
        "Para balancear carga"
      ],
      correctAnswer: 1,
      explanation: "O cache DNS reduz a latência das consultas e diminui a carga nos servidores DNS, melhorando a performance geral.",
      difficulty: 'easy'
    }
  ],
  2: [
    {
      question: "O que é o TCP 3-way handshake?",
      options: [
        "Um protocolo de criptografia",
        "Um processo de estabelecimento de conexão",
        "Um método de compressão de dados",
        "Um sistema de autenticação"
      ],
      correctAnswer: 1,
      explanation: "O 3-way handshake é o processo usado pelo TCP para estabelecer uma conexão confiável entre cliente e servidor.",
      difficulty: 'medium'
    },
    {
      question: "Qual é a sequência correta do 3-way handshake?",
      options: [
        "SYN → ACK → SYN-ACK",
        "SYN → SYN-ACK → ACK", 
        "ACK → SYN → SYN-ACK",
        "SYN-ACK → SYN → ACK"
      ],
      correctAnswer: 1,
      explanation: "A sequência correta é: 1) Cliente envia SYN, 2) Servidor responde SYN-ACK, 3) Cliente confirma com ACK.",
      difficulty: 'medium'
    },
    {
      question: "Por que o TCP é considerado um protocolo confiável?",
      options: [
        "Porque é mais rápido que UDP",
        "Porque garante entrega e ordem dos dados",
        "Porque usa menos largura de banda",
        "Porque é mais seguro"
      ],
      correctAnswer: 1,
      explanation: "TCP garante que todos os dados sejam entregues corretamente e na ordem correta, diferente do UDP.",
      difficulty: 'medium'
    },
    {
      question: "O que acontece se um pacote TCP se perder?",
      options: [
        "A conexão é encerrada",
        "O pacote é ignorado",
        "O TCP retransmite automaticamente",
        "O usuário deve tentar novamente"
      ],
      correctAnswer: 2,
      explanation: "TCP detecta pacotes perdidos e os retransmite automaticamente, garantindo a confiabilidade da comunicação.",
      difficulty: 'medium'
    },
    {
      question: "Qual porta padrão o TCP usa para HTTP?",
      options: ["443", "80", "8080", "21"],
      correctAnswer: 1,
      explanation: "A porta padrão para HTTP sobre TCP é 80. HTTPS usa a porta 443.",
      difficulty: 'easy'
    }
  ],
  3: [
    {
      question: "Qual é a estrutura básica de uma requisição HTTP?",
      options: [
        "Apenas headers e body",
        "Method, URL, headers e body opcional",
        "Apenas method e URL",
        "URL, body e status code"
      ],
      correctAnswer: 1,
      explanation: "Uma requisição HTTP contém: método (GET, POST, etc.), URL, headers e opcionalmente um body.",
      difficulty: 'medium'
    },
    {
      question: "Qual é a diferença principal entre GET e POST?",
      options: [
        "GET é mais rápido que POST",
        "POST é mais seguro que GET",
        "GET não deve ter body, POST pode ter",
        "Não há diferença significativa"
      ],
      correctAnswer: 2,
      explanation: "GET é usado para recuperar dados e não deve ter body. POST é usado para enviar dados e pode ter body.",
      difficulty: 'medium'
    },
    {
      question: "O que significa 'idempotente' em métodos HTTP?",
      options: [
        "Que pode ser executado várias vezes com o mesmo resultado",
        "Que é mais rápido",
        "Que é mais seguro",
        "Que não precisa de autenticação"
      ],
      correctAnswer: 0,
      explanation: "Um método idempotente pode ser executado múltiplas vezes sem alterar o resultado. GET, PUT e DELETE são idempotentes.",
      difficulty: 'hard'
    },
    {
      question: "Qual header indica o tipo de conteúdo sendo enviado?",
      options: ["Content-Length", "Content-Type", "Accept", "User-Agent"],
      correctAnswer: 1,
      explanation: "Content-Type especifica o tipo MIME do conteúdo sendo enviado (ex: application/json, text/html).",
      difficulty: 'medium'
    },
    {
      question: "O que é o header 'User-Agent'?",
      options: [
        "Identifica o usuário logado",
        "Identifica o navegador e sistema operacional",
        "Contém a senha do usuário",
        "Define o idioma da página"
      ],
      correctAnswer: 1,
      explanation: "User-Agent identifica o navegador, versão e sistema operacional do cliente fazendo a requisição.",
      difficulty: 'easy'
    },
    {
      question: "Quando usar PUT vs PATCH?",
      options: [
        "PUT para criar, PATCH para atualizar",
        "PUT substitui completamente, PATCH atualiza parcialmente",
        "Não há diferença",
        "PATCH é mais rápido que PUT"
      ],
      correctAnswer: 1,
      explanation: "PUT substitui o recurso inteiro, enquanto PATCH faz atualizações parciais apenas dos campos especificados.",
      difficulty: 'hard'
    }
  ],
  4: [
    {
      question: "O que acontece no servidor quando recebe uma requisição HTTP?",
      options: [
        "Responde imediatamente com erro",
        "Processa a requisição e prepara uma resposta",
        "Encaminha para outro servidor",
        "Ignora a requisição"
      ],
      correctAnswer: 1,
      explanation: "O servidor analisa a requisição, executa a lógica necessária (consultas ao banco, processamento) e prepara uma resposta apropriada.",
      difficulty: 'easy'
    },
    {
      question: "O que é um middleware no contexto de servidores web?",
      options: [
        "Um tipo de banco de dados",
        "Software que processa requisições entre cliente e servidor",
        "Um protocolo de rede",
        "Um tipo de cache"
      ],
      correctAnswer: 1,
      explanation: "Middleware é software que fica entre o cliente e o servidor, processando requisições (autenticação, logging, etc.).",
      difficulty: 'medium'
    },
    {
      question: "Como servidores lidam com múltiplas requisições simultâneas?",
      options: [
        "Processam uma por vez",
        "Usam threads, processos ou programação assíncrona",
        "Rejeitam requisições extras",
        "Redirecionam para outros servidores"
      ],
      correctAnswer: 1,
      explanation: "Servidores modernos usam threading, multiprocessing ou programação assíncrona para lidar com múltiplas requisições.",
      difficulty: 'medium'
    },
    {
      question: "O que é load balancing?",
      options: [
        "Distribuir requisições entre múltiplos servidores",
        "Comprimir dados da resposta",
        "Criptografar comunicações",
        "Fazer cache de páginas"
      ],
      correctAnswer: 0,
      explanation: "Load balancing distribui requisições entre vários servidores para melhorar performance e disponibilidade.",
      difficulty: 'medium'
    },
    {
      question: "O que são microserviços?",
      options: [
        "Servidores muito pequenos",
        "Arquitetura onde aplicação é dividida em serviços independentes",
        "Um tipo de banco de dados",
        "Protocolo de comunicação"
      ],
      correctAnswer: 1,
      explanation: "Microserviços é uma arquitetura onde a aplicação é dividida em serviços pequenos, independentes e especializados.",
      difficulty: 'hard'
    },
    {
      question: "Como o servidor determina qual código executar para uma URL?",
      options: [
        "Através de roteamento/routing",
        "Aleatoriamente",
        "Sempre executa o mesmo código",
        "Baseado no IP do cliente"
      ],
      correctAnswer: 0,
      explanation: "O servidor usa sistemas de roteamento que mapeiam URLs para funções ou controladores específicos.",
      difficulty: 'medium'
    }
  ],
  5: [
    {
      question: "O que uma resposta HTTP sempre contém?",
      options: [
        "Apenas o body com dados",
        "Status code, headers e opcionalmente body",
        "Apenas headers",
        "Apenas status code"
      ],
      correctAnswer: 1,
      explanation: "Toda resposta HTTP contém um status code, headers e opcionalmente um body com os dados.",
      difficulty: 'easy'
    },
    {
      question: "O que significa o status code 404?",
      options: [
        "Servidor com erro interno",
        "Acesso negado",
        "Recurso não encontrado",
        "Requisição inválida"
      ],
      correctAnswer: 2,
      explanation: "404 Not Found indica que o recurso solicitado não foi encontrado no servidor.",
      difficulty: 'easy'
    },
    {
      question: "Qual a diferença entre 401 e 403?",
      options: [
        "Não há diferença",
        "401 = não autenticado, 403 = não autorizado",
        "401 = erro do cliente, 403 = erro do servidor",
        "403 = não autenticado, 401 = não autorizado"
      ],
      correctAnswer: 1,
      explanation: "401 Unauthorized significa que o usuário não está autenticado. 403 Forbidden significa que está autenticado mas não autorizado.",
      difficulty: 'medium'
    },
    {
      question: "O que significa o status code 204?",
      options: [
        "Erro interno do servidor",
        "Sucesso sem conteúdo no body",
        "Redirecionamento permanente",
        "Requisição inválida"
      ],
      correctAnswer: 1,
      explanation: "204 No Content indica sucesso na operação, mas sem conteúdo para retornar no body da resposta.",
      difficulty: 'medium'
    },
    {
      question: "Quando usar status code 201 vs 200?",
      options: [
        "201 para GET, 200 para POST",
        "200 para sucesso, 201 para recurso criado",
        "Não há diferença",
        "201 é mais rápido que 200"
      ],
      correctAnswer: 1,
      explanation: "200 OK para operações bem-sucedidas gerais. 201 Created especificamente quando um novo recurso foi criado.",
      difficulty: 'medium'
    },
    {
      question: "O que é CORS e quando ocorre erro de CORS?",
      options: [
        "Erro de compressão de dados",
        "Cross-Origin Resource Sharing - quando domínios diferentes tentam comunicar",
        "Erro de cache do navegador",
        "Problema de DNS"
      ],
      correctAnswer: 1,
      explanation: "CORS é uma política de segurança que controla requisições entre domínios diferentes. Erro de CORS ocorre quando não configurado adequadamente.",
      difficulty: 'hard'
    },
    {
      question: "Para que serve o header 'Cache-Control'?",
      options: [
        "Autenticação do usuário",
        "Controlar como e por quanto tempo respostas são cacheadas",
        "Definir charset da resposta",
        "Redirecionar requisições"
      ],
      correctAnswer: 1,
      explanation: "Cache-Control define políticas de cache, como max-age, no-cache, no-store, etc.",
      difficulty: 'medium'
    }
  ],
  6: [
    {
      question: "O que o navegador faz ao receber uma resposta HTML?",
      options: [
        "Exibe o código fonte",
        "Parseia e constrói o DOM",
        "Salva em um arquivo",
        "Encaminha para outro servidor"
      ],
      correctAnswer: 1,
      explanation: "O navegador parseia o HTML e constrói o DOM (Document Object Model) para renderizar a página.",
      difficulty: 'easy'
    },
    {
      question: "Qual é a diferença entre DOM e CSSOM?",
      options: [
        "Não há diferença",
        "DOM é para HTML, CSSOM é para CSS",
        "DOM é mais rápido que CSSOM",
        "CSSOM é opcional"
      ],
      correctAnswer: 1,
      explanation: "DOM representa a estrutura HTML da página, CSSOM representa as regras de estilo CSS aplicadas.",
      difficulty: 'medium'
    },
    {
      question: "O que acontece quando o navegador encontra uma tag <script>?",
      options: [
        "Ignora completamente",
        "Para o parsing do HTML e executa o JavaScript",
        "Executa em paralelo sem parar o parsing",
        "Salva para executar depois"
      ],
      correctAnswer: 1,
      explanation: "Por padrão, quando encontra <script>, o navegador para o parsing do HTML para baixar e executar o JavaScript (blocking).",
      difficulty: 'medium'
    },
    {
      question: "Como otimizar o carregamento de recursos?",
      options: [
        "Carregar tudo ao mesmo tempo",
        "Usar técnicas como lazy loading, async, defer",
        "Não carregar CSS",
        "Usar apenas texto"
      ],
      correctAnswer: 1,
      explanation: "Técnicas como lazy loading para imagens, async/defer para scripts e minificação de recursos otimizam o carregamento.",
      difficulty: 'hard'
    },
    {
      question: "O que é Critical Rendering Path?",
      options: [
        "O caminho do servidor para o cliente",
        "Sequência de passos para renderizar a página",
        "Um protocolo de rede",
        "Um tipo de cache"
      ],
      correctAnswer: 1,
      explanation: "Critical Rendering Path é a sequência de passos que o navegador executa para renderizar uma página: HTML → DOM, CSS → CSSOM, Render Tree → Layout → Paint.",
      difficulty: 'hard'
    },
    {
      question: "Quando usar 'async' vs 'defer' em scripts?",
      options: [
        "Não há diferença",
        "async executa quando baixado, defer espera o DOM estar pronto",
        "defer é mais rápido",
        "async é só para CSS"
      ],
      correctAnswer: 1,
      explanation: "async executa o script assim que for baixado, potencialmente interrompendo o parsing. defer espera o DOM estar completo.",
      difficulty: 'hard'
    },
    {
      question: "O que são Web Vitals?",
      options: [
        "Protocolos de segurança",
        "Métricas de performance da web (LCP, FID, CLS)",
        "Tipos de cache",
        "Versões do HTTP"
      ],
      correctAnswer: 1,
      explanation: "Core Web Vitals são métricas que medem experiência do usuário: LCP (carregamento), FID (interatividade), CLS (estabilidade visual).",
      difficulty: 'hard'
    }
  ]
};

export function QuizScreen({ missionIndex, userState, onNavigate, onUpdateProgress }: QuizScreenProps) {
  const questions = QUIZ_DATABASE[missionIndex] || [];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);


  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const finishQuiz = () => {
    setShowResult(true);

    // Calculate score
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    // Calculate XP based on performance
    const percentage = (correctAnswers / questions.length) * 100;
    let xpEarned = 0;
    if (percentage >= 90) xpEarned = 200;
    else if (percentage >= 80) xpEarned = 150;
    else if (percentage >= 70) xpEarned = 100;
    else if (percentage >= 60) xpEarned = 75;
    else xpEarned = 50;

    // Update user progress
    const newCompletedQuizzes = [...userState.completedQuizzes];
    if (!newCompletedQuizzes.includes(missionIndex)) {
      newCompletedQuizzes.push(missionIndex);
    }

    const previousAttempts = userState.quizScores[missionIndex]?.attempts || 0;

    onUpdateProgress({
      score: userState.score + xpEarned,
      completedQuizzes: newCompletedQuizzes,
      quizScores: {
        ...userState.quizScores,
        [missionIndex]: {
          score: correctAnswers,
          totalQuestions: questions.length,
          attempts: previousAttempts + 1
        }
      }
    });
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResult(false);
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  // No questions available for this mission
  if (questions.length === 0) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="mb-4">Quiz Não Disponível</h2>
          <p className="text-muted-foreground mb-6">
            Este quiz ainda não foi implementado para esta missão.
          </p>
          <Button onClick={() => onNavigate('map')}>
            Voltar ao Mapa
          </Button>
        </Card>
      </div>
    );
  }

  // Show results
  if (showResult) {
    const correctAnswers = questions.reduce((count, question, index) => {
      return count + (selectedAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
    const percentage = Math.round((correctAnswers / questions.length) * 100);

    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <Card className="p-8 text-center">
            <Trophy className={`w-16 h-16 mx-auto mb-4 ${getScoreColor(percentage)}`} />
            <h1 className="text-3xl mb-2">Quiz Completo!</h1>
            <p className="text-muted-foreground mb-6">
              Missão {missionIndex + 1} - Quiz finalizado
            </p>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className={`text-3xl mb-1 ${getScoreColor(percentage)}`}>
                  {correctAnswers}
                </div>
                <div className="text-sm text-muted-foreground">Acertos</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl mb-1 ${getScoreColor(percentage)}`}>
                  {percentage}%
                </div>
                <div className="text-sm text-muted-foreground">Precisão</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-blue-500 mb-1">
                  +{percentage >= 90 ? 200 : percentage >= 80 ? 150 : percentage >= 70 ? 100 : percentage >= 60 ? 75 : 50}
                </div>
                <div className="text-sm text-muted-foreground">XP</div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="text-left mb-8 max-h-64 overflow-y-auto">
              <h3 className="mb-4 text-center">Revisão das Questões</h3>
              {questions.map((question, index) => {
                const isCorrect = selectedAnswers[index] === question.correctAnswer;
                return (
                  <div key={index} className="mb-4 p-4 border rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm mb-2">{question.question}</p>
                        <p className="text-xs text-green-600">
                          ✓ {question.options[question.correctAnswer]}
                        </p>
                        {!isCorrect && selectedAnswers[index] !== undefined && (
                          <p className="text-xs text-red-600">
                            ✗ Sua resposta: {question.options[selectedAnswers[index]]}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {question.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={resetQuiz} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </Button>
              <Button onClick={() => onNavigate('map')}>
                Voltar ao Mapa
              </Button>
              <Button 
                onClick={() => onNavigate('mission')}
                className="bg-gradient-to-r from-blue-500 to-purple-600"
              >
                Revisar Missão
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Quiz interface
  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const hasAnswered = selectedAnswers[currentQuestion] !== undefined;

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
            onClick={() => onNavigate('map')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Mapa
          </Button>

          <div className="text-center">
            <h1 className="text-2xl mb-1">Quiz - Missão {missionIndex + 1}</h1>
            <div className="flex items-center gap-4 justify-center">
              <Badge>
                Questão {currentQuestion + 1} de {questions.length}
              </Badge>
              <Badge variant="outline" className={
                currentQ.difficulty === 'easy' ? 'border-green-500 text-green-600' :
                currentQ.difficulty === 'medium' ? 'border-yellow-500 text-yellow-600' :
                'border-red-500 text-red-600'
              }>
                {currentQ.difficulty === 'easy' ? 'Fácil' :
                 currentQ.difficulty === 'medium' ? 'Médio' : 'Difícil'}
              </Badge>
            </div>
          </div>

          <div className="w-24"></div>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <Progress value={progress} className="h-2" />
        </motion.div>

        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Card className="p-8">
            <h2 className="text-xl mb-6">{currentQ.question}</h2>
            
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswers[currentQuestion] === index ? "default" : "outline"}
                  onClick={() => handleAnswerSelect(index)}
                  className="w-full text-left p-4 h-auto justify-start"
                >
                  <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center mr-3 flex-shrink-0">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </Button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-between"
        >
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            ← Anterior
          </Button>

          <Button
            onClick={handleNext}
            disabled={!hasAnswered}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {currentQuestion === questions.length - 1 ? 'Finalizar Quiz' : 'Próxima →'}
          </Button>
        </motion.div>

        {/* Help text */}
        {!hasAnswered && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted-foreground text-sm mt-4"
          >
            Selecione uma resposta para continuar
          </motion.p>
        )}
      </div>
    </div>
  );
}