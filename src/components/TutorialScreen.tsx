import React, { useState } from 'react';
import type { UserState } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Target,
  BookOpen,
  Trophy,
  Code,
  Activity,
  Users,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Screen =
  | "welcome"
  | "tutorial"
  | "dashboard"
  | "map"
  | "mission"
  | "chat"
  | "quiz"
  | "progress"
  | "leaderboard"
  | "challenge"
  | "api-creator"
  | "glossary"
  | "lab"
  | "settings"
  | "history"
  | "fundamentals"
  | "achievements";

interface TutorialScreenProps {
  userState: UserState;
  onNavigate: (screen: Screen, missionId?: number) => void;
  onUpdateProgress: (updates: Partial<UserState>) => void;
}

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function TutorialScreen({ userState, onNavigate, onUpdateProgress }: TutorialScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const markStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps(prev => [...prev, stepId]);
    }
  };

  const tutorialSteps: TutorialStep[] = [
    {
      id: 'welcome',
      title: 'Bem-vindo ao IOOR!',
      description: 'Sua jornada de aprendizado sobre redes e protocolos web começa aqui.',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Internet Operations & Optimization Research
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Uma plataforma interativa para aprender como a internet funciona através de missões práticas e experimentos.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white">Missões</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Acompanhe pacotes de dados</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white">Laboratório</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Experimente ferramentas</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Trophy className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white">Conquistas</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Desbloqueie recompensas</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'navigation',
      title: 'Navegação',
      description: 'Aprenda a navegar pela plataforma e acessar diferentes seções.',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Sua central de controle com estatísticas, progresso e ações rápidas.
                </p>
                <Button 
                  size="sm" 
                  onClick={() => onNavigate('dashboard')}
                  className="w-full"
                >
                  Visitar Dashboard
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  Mapa de Missões
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Visualize seu progresso e acesse missões disponíveis.
                </p>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onNavigate('map')}
                  className="w-full"
                >
                  Ver Mapa
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Dica de Navegação</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Use os botões de navegação em cada tela para voltar ao menu principal ou acessar outras seções.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'missions',
      title: 'Sistema de Missões',
      description: 'Entenda como funcionam as missões e como progredir.',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-full">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800 dark:text-blue-200">4 Missões Disponíveis</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">Estrutura das Missões:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Simulação interativa</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Quiz de conhecimento</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Recompensas XP</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Conquistas especiais</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">Progressão:</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="text-sm">Missão 0</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="text-sm">Missão 1</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="text-sm">Missão 2</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900 rounded border border-blue-200 dark:border-blue-700">
                  <span className="text-sm font-semibold">Missão 3</span>
                  <Badge variant="secondary">Disponível</Badge>
                </div>
              </div>
            </div>
          </div>

          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Pronto para começar?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Continue sua jornada na Missão 3</p>
                </div>
                <Button onClick={() => onNavigate('mission', 3)} className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Iniciar Missão
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
      action: {
        label: 'Ir para Missão 3',
        onClick: () => onNavigate('mission', 3)
      }
    },
    {
      id: 'features',
      title: 'Recursos Avançados',
      description: 'Descubra todas as funcionalidades disponíveis.',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5 text-purple-600" />
                  Laboratório
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Experimente ferramentas de rede como ping, DNS lookup, e análise de headers HTTP.
                </p>
                <Button size="sm" variant="outline" onClick={() => onNavigate('lab')} className="w-full">
                  Explorar Lab
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Code className="w-5 h-5 text-green-600" />
                  API Creator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Crie e teste suas próprias APIs REST com interface visual intuitiva.
                </p>
                <Button size="sm" variant="outline" onClick={() => onNavigate('api-creator')} className="w-full">
                  Criar API
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  Conquistas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Desbloqueie conquistas especiais e acompanhe seu progresso detalhado.
                </p>
                <Button size="sm" variant="outline" onClick={() => onNavigate('achievements')} className="w-full">
                  Ver Conquistas
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="w-5 h-5 text-orange-600" />
                  Desafios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Teste suas habilidades com desafios cronometrados e competitivos.
                </p>
                <Button size="sm" variant="outline" onClick={() => onNavigate('challenge')} className="w-full">
                  Aceitar Desafio
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Fundamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Estude conceitos teóricos de redes, protocolos e arquiteturas web.
                </p>
                <Button size="sm" variant="outline" onClick={() => onNavigate('fundamentals')} className="w-full">
                  Estudar
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-indigo-600" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Compare seu progresso com outros usuários e veja rankings globais.
                </p>
                <Button size="sm" variant="outline" onClick={() => onNavigate('leaderboard')} className="w-full">
                  Ver Ranking
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'completion',
      title: 'Tutorial Concluído!',
      description: 'Você está pronto para começar sua jornada de aprendizado.',
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Parabéns! 🎉
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              Você completou o tutorial e está pronto para explorar o mundo das redes e protocolos web.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Próximos Passos Recomendados:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-blue-600" />
                <span>Complete a Missão 3 para continuar sua jornada</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-blue-600" />
                <span>Explore o Laboratório para experimentar ferramentas</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-blue-600" />
                <span>Leia os Fundamentos para aprofundar conhecimentos</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => onNavigate('mission', 3)} className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Continuar Missão 3
            </Button>
            <Button variant="outline" onClick={() => onNavigate('dashboard')} className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Ir para Dashboard
            </Button>
          </div>
        </div>
      ),
      action: {
        label: 'Finalizar Tutorial',
        onClick: () => {
          // Mark tutorial as completed
          onUpdateProgress({
            achievements: [...userState.achievements, 'tutorial-complete'],
            score: userState.score + 100
          });
          onNavigate('dashboard');
        }
      }
    }
  ];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      markStepComplete(tutorialSteps[currentStep].id);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentTutorialStep = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Tutorial Interativo
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Aprenda a usar todas as funcionalidades do IOOR
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Passo {currentStep + 1} de {tutorialSteps.length}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(progress)}% concluído
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {tutorialSteps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-blue-600'
                    : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Tutorial Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">{currentTutorialStep.title}</CardTitle>
                <CardDescription className="text-lg">
                  {currentTutorialStep.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentTutorialStep.content}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>

          <div className="flex gap-2">
            {currentTutorialStep.action && (
              <Button
                onClick={currentTutorialStep.action.onClick}
                variant="outline"
                className="flex items-center gap-2"
              >
                {currentTutorialStep.action.label}
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}

            {currentStep < tutorialSteps.length - 1 ? (
              <Button onClick={nextStep} className="flex items-center gap-2">
                Próximo
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={() => {
                  markStepComplete(currentTutorialStep.id);
                  onUpdateProgress({
                    achievements: [...userState.achievements, 'tutorial-complete'],
                    score: userState.score + 100
                  });
                  onNavigate('dashboard');
                }}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4" />
                Finalizar Tutorial
              </Button>
            )}
          </div>
        </div>

        {/* Skip Tutorial */}
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => onNavigate('dashboard')}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Pular tutorial
          </Button>
        </div>
      </div>
    </div>
  );
}