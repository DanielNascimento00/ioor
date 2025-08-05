import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, Play, Pause, RotateCcw, Trophy, Clock, Zap, Target } from 'lucide-react';
import type { UserState, AppSettings } from '../App';

interface ChallengeModeProps {
  userState: UserState;
  settings: AppSettings;
  onNavigate: (screen: 'welcome' | 'map') => void;
  onUpdateProgress: (updates: Partial<UserState>) => void;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  timeLimit: number; // in seconds
  difficulty: 'easy' | 'medium' | 'hard';
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

const challenges: Challenge[] = [
  {
    id: 'speed-basic',
    title: 'Velocidade Básica',
    description: 'Responda questões sobre conceitos básicos no menor tempo possível',
    timeLimit: 120,
    difficulty: 'easy',
    questions: [
      {
        question: 'O que significa HTTP?',
        options: ['HyperText Transfer Protocol', 'High Transfer Text Protocol', 'Hyper Transfer Technology Protocol', 'Home Transfer Text Protocol'],
        correctAnswer: 0
      },
      {
        question: 'Qual porta padrão do HTTP?',
        options: ['443', '80', '8080', '21'],
        correctAnswer: 1
      },
      {
        question: 'O que o DNS faz?',
        options: ['Criptografa dados', 'Traduz domínios em IPs', 'Transfere arquivos', 'Autentica usuários'],
        correctAnswer: 1
      },
      {
        question: 'Qual status code indica sucesso?',
        options: ['404', '500', '200', '302'],
        correctAnswer: 2
      },
      {
        question: 'O que é TCP?',
        options: ['Um protocolo de transporte', 'Um tipo de navegador', 'Uma linguagem de programação', 'Um sistema operacional'],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'speed-intermediate',
    title: 'Desafio Intermediário',
    description: 'Questões mais complexas sobre requisições HTTP',
    timeLimit: 180,
    difficulty: 'medium',
    questions: [
      {
        question: 'Qual header indica o tipo de conteúdo?',
        options: ['Content-Length', 'Content-Type', 'Content-Disposition', 'Content-Encoding'],
        correctAnswer: 1
      },
      {
        question: 'O que é CORS?',
        options: ['Cross-Origin Resource Sharing', 'Common Origin Request System', 'Cross-Origin Request Security', 'Common Origin Resource System'],
        correctAnswer: 0
      },
      {
        question: 'Diferença entre GET e POST?',
        options: ['GET é mais rápido', 'POST é só para formulários', 'GET não tem body, POST tem', 'Não há diferença'],
        correctAnswer: 2
      },
      {
        question: 'O que é um cookie?',
        options: ['Um tipo de cache', 'Dados armazenados no navegador', 'Um protocolo de segurança', 'Um tipo de servidor'],
        correctAnswer: 1
      },
      {
        question: 'Para que serve o cache?',
        options: ['Segurança', 'Velocidade e economia de banda', 'Autenticação', 'Backup'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'speed-expert',
    title: 'Mestre do Tempo',
    description: 'Desafio extremo para verdadeiros experts',
    timeLimit: 90,
    difficulty: 'hard',
    questions: [
      {
        question: 'Qual é a diferença entre HTTP/1.1 e HTTP/2?',
        options: ['HTTP/2 usa multiplexing', 'HTTP/2 é mais lento', 'Não há diferença', 'HTTP/2 não usa TCP'],
        correctAnswer: 0
      },
      {
        question: 'O que é um CDN?',
        options: ['Content Delivery Network', 'Central Data Network', 'Code Distribution Network', 'Common Domain Network'],
        correctAnswer: 0
      },
      {
        question: 'Como funciona HTTPS?',
        options: ['Usa FTP', 'HTTP + TLS/SSL', 'É igual ao HTTP', 'Usa UDP'],
        correctAnswer: 1
      }
    ]
  }
];

export function ChallengeMode({ userState, onNavigate, onUpdateProgress }: ChallengeModeProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'select' | 'playing' | 'paused' | 'finished'>('select');
  const [answers, setAnswers] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Timer effect
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            setGameState('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPlaying, timeLeft]);

  const startChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setTimeLeft(challenge.timeLimit);
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setStartTime(new Date());
    setGameState('playing');
    setIsPlaying(true);
  };

  const pauseChallenge = () => {
    setIsPlaying(false);
    setGameState('paused');
  };

  const resumeChallenge = () => {
    setIsPlaying(true);
    setGameState('playing');
  };

  const restartChallenge = () => {
    if (selectedChallenge) {
      startChallenge(selectedChallenge);
    }
  };

  const submitAnswer = (answerIndex: number) => {
    if (!selectedChallenge) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);

    if (answerIndex === selectedChallenge.questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }

    if (currentQuestion < selectedChallenge.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Challenge completed
      setIsPlaying(false);
      setGameState('finished');
      
      // Calculate final time and update progress
      const finalTime = startTime ? (new Date().getTime() - startTime.getTime()) / 1000 : 0;
      const earnedXP = score * 25 + (timeLeft * 2); // Bonus for remaining time
      
      onUpdateProgress({
        challengesCompleted: userState.challengesCompleted + 1,
        score: userState.score + earnedXP,
        bestTimes: {
          ...userState.bestTimes,
          [selectedChallenge.id]: Math.min(Number((userState.bestTimes as Record<string, number>)[selectedChallenge.id]) || Infinity, finalTime)
        }
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (gameState === 'select') {
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
              onClick={() => onNavigate('welcome')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>

            <div className="text-center">
              <div className="flex items-center gap-2 justify-center mb-2">
                <Clock className="w-6 h-6 text-orange-500" />
                <h1 className="text-3xl">Modo Desafio</h1>
              </div>
              <p className="text-muted-foreground">
                Teste suas habilidades contra o tempo
              </p>
            </div>

            <div className="text-right">
              <div className="text-sm text-muted-foreground">Completos</div>
              <div className="text-2xl">{userState.challengesCompleted}</div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mb-8"
          >
            <Card className="p-6 text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl mb-1">{userState.challengesCompleted}</div>
              <div className="text-sm text-muted-foreground">Desafios Completos</div>
            </Card>
            <Card className="p-6 text-center">
              <Zap className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl mb-1">
                {Object.keys(userState.bestTimes).length > 0 
                  ? `${Math.min(...Object.values(userState.bestTimes))}s`
                  : '--'
                }
              </div>
              <div className="text-sm text-muted-foreground">Melhor Tempo</div>
            </Card>
            <Card className="p-6 text-center">
              <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl mb-1">{Math.round((userState.challengesCompleted / challenges.length) * 100)}%</div>
              <div className="text-sm text-muted-foreground">Taxa de Conclusão</div>
            </Card>
          </motion.div>

          {/* Challenges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <h2 className="text-xl mb-4">Escolha seu Desafio</h2>
            
            {challenges.map((challenge) => (
              <Card 
                key={challenge.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => startChallenge(challenge)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3>{challenge.title}</h3>
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty === 'easy' ? 'Fácil' :
                         challenge.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                      </Badge>
                      <Badge variant="outline">
                        {challenge.questions.length} questões
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">
                      {challenge.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>🕒 {formatTime(challenge.timeLimit)}</span>
                      <span>🎯 {challenge.questions.length} questões</span>
                      {userState.bestTimes && (userState.bestTimes as Record<string, number>)[challenge.id] && (
                        <span>⭐ Melhor: {(userState.bestTimes as Record<string, number>)[challenge.id]}s</span>
                      )}
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar
                  </Button>
                </div>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    const totalTime = selectedChallenge ? selectedChallenge.timeLimit - timeLeft : 0;
    const accuracy = selectedChallenge ? Math.round((score / selectedChallenge.questions.length) * 100) : 0;
    
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full text-center"
        >
          <Card className="p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-3xl mb-2">Desafio Completo!</h1>
              <p className="text-muted-foreground">{selectedChallenge?.title}</p>
            </motion.div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl text-blue-500 mb-1">{score}</div>
                <div className="text-sm text-muted-foreground">Acertos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-green-500 mb-1">{accuracy}%</div>
                <div className="text-sm text-muted-foreground">Precisão</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-orange-500 mb-1">{formatTime(totalTime)}</div>
                <div className="text-sm text-muted-foreground">Tempo</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={restartChallenge} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </Button>
              <Button onClick={() => setGameState('select')}>
                Escolher Outro
              </Button>
              <Button 
                onClick={() => onNavigate('map')}
                className="bg-gradient-to-r from-blue-500 to-purple-600"
              >
                Voltar às Missões
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Playing/Paused state
  const question = selectedChallenge?.questions[currentQuestion];
  const progress = selectedChallenge ? ((currentQuestion + 1) / selectedChallenge.questions.length) * 100 : 0;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setGameState('select')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            
            {gameState === 'playing' ? (
              <Button onClick={pauseChallenge} variant="outline">
                <Pause className="w-4 h-4 mr-2" />
                Pausar
              </Button>
            ) : (
              <Button onClick={resumeChallenge} className="bg-green-500 hover:bg-green-600">
                <Play className="w-4 h-4 mr-2" />
                Continuar
              </Button>
            )}
          </div>

          <div className="text-center">
            <h1 className="text-xl mb-1">{selectedChallenge?.title}</h1>
            <div className="flex items-center gap-4 justify-center">
              <Badge>
                Questão {currentQuestion + 1}/{selectedChallenge?.questions.length}
              </Badge>
              <Badge variant="outline">
                {score} acertos
              </Badge>
            </div>
          </div>

          <div className="text-right">
            <div className={`text-3xl ${timeLeft < 30 ? 'text-red-500' : 'text-blue-500'}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-muted-foreground">Tempo restante</div>
          </div>
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
        {question && (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Card className="p-8">
              {gameState === 'paused' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <div className="text-white text-center">
                    <Pause className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl mb-2">Jogo Pausado</h3>
                    <Button onClick={resumeChallenge} className="bg-green-500 hover:bg-green-600">
                      <Play className="w-4 h-4 mr-2" />
                      Continuar
                    </Button>
                  </div>
                </div>
              )}
              
              <h2 className="text-xl mb-6">{question.question}</h2>
              
              <div className="grid gap-3">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => submitAnswer(index)}
                    disabled={gameState === 'paused'}
                    className="text-left p-4 h-auto justify-start"
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
        )}
      </div>
    </div>
  );
}