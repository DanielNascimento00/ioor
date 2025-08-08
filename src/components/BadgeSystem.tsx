import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Trophy,
  Zap,
  Target,
  Lightbulb,
  Clock,
  Star,
  Award,
  Crown,
  Flame,
  ArrowLeft,
  Filter,
  Search
} from 'lucide-react';
import type { UserState } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

type Screen = 
  | "landing"
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

interface BadgeSystemProps {
  userState: UserState;
  onNavigate: (screen: Screen) => void;
}

interface CustomBadge {
  id: string;
  title: string;
  description: string;
  category: 'speed' | 'precision' | 'creativity' | 'consistency' | 'mastery';
  icon: React.ComponentType<{ className?: string }>;
  requirement: {
    type: 'time' | 'accuracy' | 'innovation' | 'streak' | 'completion';
    target: number;
    current: number;
  };
  reward: {
    xp: number;
    title: string;
    specialEffect?: string;
  };
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  unlocked: boolean;
  dateUnlocked?: Date;
  progress: number; // 0-100
}

const speedBadges: CustomBadge[] = [
  {
    id: 'lightning-fast',
    title: 'Relâmpago',
    description: 'Complete uma missão em menos de 60 segundos',
    category: 'speed',
    icon: Zap,
    requirement: {
      type: 'time',
      target: 60,
      current: 0
    },
    reward: {
      xp: 100,
      title: 'Velocista',
      specialEffect: 'Reduz tempo de carregamento em 10%'
    },
    rarity: 'bronze',
    unlocked: false,
    progress: 0
  },
  {
    id: 'speed-demon',
    title: 'Demônio da Velocidade',
    description: 'Complete 5 missões consecutivas em menos de 2 minutos cada',
    category: 'speed',
    icon: Flame,
    requirement: {
      type: 'streak',
      target: 5,
      current: 0
    },
    reward: {
      xp: 250,
      title: 'Demônio da Velocidade',
      specialEffect: 'Desbloqueia modo turbo'
    },
    rarity: 'gold',
    unlocked: false,
    progress: 0
  },
  {
    id: 'time-master',
    title: 'Mestre do Tempo',
    description: 'Complete 10 missões com tempo record',
    category: 'speed',
    icon: Clock,
    requirement: {
      type: 'completion',
      target: 10,
      current: 0
    },
    reward: {
      xp: 500,
      title: 'Senhor do Tempo',
      specialEffect: 'Cronômetro especial desbloqueado'
    },
    rarity: 'diamond',
    unlocked: false,
    progress: 0
  }
];

const precisionBadges: CustomBadge[] = [
  {
    id: 'sharpshooter',
    title: 'Atirador de Elite',
    description: 'Acerte 100% das questões em um quiz',
    category: 'precision',
    icon: Target,
    requirement: {
      type: 'accuracy',
      target: 100,
      current: 0
    },
    reward: {
      xp: 150,
      title: 'Precisão Cirúrgica',
      specialEffect: 'Dicas extras em quizzes'
    },
    rarity: 'silver',
    unlocked: false,
    progress: 0
  },
  {
    id: 'perfectionist-pro',
    title: 'Perfeccionista Pro',
    description: 'Mantenha 95%+ de precisão por 10 quizzes',
    category: 'precision',
    icon: Star,
    requirement: {
      type: 'streak',
      target: 10,
      current: 0
    },
    reward: {
      xp: 300,
      title: 'Perfeccionista',
      specialEffect: 'Modo de precisão avançado'
    },
    rarity: 'gold',
    unlocked: false,
    progress: 0
  },
  {
    id: 'flawless-master',
    title: 'Mestre Impecável',
    description: 'Complete 20 atividades sem nenhum erro',
    category: 'precision',
    icon: Crown,
    requirement: {
      type: 'completion',
      target: 20,
      current: 0
    },
    reward: {
      xp: 750,
      title: 'Impecável',
      specialEffect: 'Coroa dourada no perfil'
    },
    rarity: 'diamond',
    unlocked: false,
    progress: 0
  }
];

const creativityBadges: CustomBadge[] = [
  {
    id: 'innovator',
    title: 'Inovador',
    description: 'Crie uma API com funcionalidade única',
    category: 'creativity',
    icon: Lightbulb,
    requirement: {
      type: 'innovation',
      target: 1,
      current: 0
    },
    reward: {
      xp: 200,
      title: 'Mente Criativa',
      specialEffect: 'Templates exclusivos desbloqueados'
    },
    rarity: 'silver',
    unlocked: false,
    progress: 0
  },
  {
    id: 'creative-genius',
    title: 'Gênio Criativo',
    description: 'Desenvolva 5 soluções alternativas para o mesmo problema',
    category: 'creativity',
    icon: Award,
    requirement: {
      type: 'innovation',
      target: 5,
      current: 0
    },
    reward: {
      xp: 400,
      title: 'Gênio',
      specialEffect: 'Laboratório criativo desbloqueado'
    },
    rarity: 'gold',
    unlocked: false,
    progress: 0
  },
  {
    id: 'visionary',
    title: 'Visionário',
    description: 'Crie 10 APIs com conceitos revolucionários',
    category: 'creativity',
    icon: Trophy,
    requirement: {
      type: 'innovation',
      target: 10,
      current: 0
    },
    reward: {
      xp: 1000,
      title: 'Visionário',
      specialEffect: 'Galeria de criações especial'
    },
    rarity: 'diamond',
    unlocked: false,
    progress: 0
  }
];

const allBadges = [...speedBadges, ...precisionBadges, ...creativityBadges];

const rarityColors = {
  bronze: 'bg-amber-100 text-amber-800 border-amber-300',
  silver: 'bg-gray-100 text-gray-800 border-gray-300',
  gold: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  platinum: 'bg-purple-100 text-purple-800 border-purple-300',
  diamond: 'bg-blue-100 text-blue-800 border-blue-300'
};

const categoryColors = {
  speed: 'bg-red-50 border-red-200',
  precision: 'bg-blue-50 border-blue-200',
  creativity: 'bg-green-50 border-green-200',
  consistency: 'bg-purple-50 border-purple-200',
  mastery: 'bg-yellow-50 border-yellow-200'
};

export function BadgeSystem({ userState, onNavigate }: BadgeSystemProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Simular progresso baseado no estado do usuário
  const calculateBadgeProgress = (badge: CustomBadge): CustomBadge => {
    let current = 0;
    let progress = 0;

    switch (badge.requirement.type) {
      case 'time':
        // Simular tempos baseados em missões completadas
        current = userState.completedSteps.length > 0 ? Math.min(badge.requirement.target, 45) : 0;
        break;
      case 'accuracy': {
        // Calcular precisão média dos quizzes
        const totalQuizzes = Object.keys(userState.quizScores).length;
        if (totalQuizzes > 0) {
          const avgAccuracy = Object.values(userState.quizScores).reduce(
            (acc, quiz) => acc + (quiz.score / quiz.totalQuestions) * 100, 0
          ) / totalQuizzes;
          current = Math.round(avgAccuracy);
        }
        break;
      }
      case 'innovation':
        current = userState.apisCreated;
        break;
      case 'streak':
        current = userState.completedSteps.length;
        break;
      case 'completion':
        current = userState.completedSteps.length + userState.completedQuizzes.length;
        break;
    }

    progress = Math.min(100, (current / badge.requirement.target) * 100);
    const unlocked = current >= badge.requirement.target;

    return {
      ...badge,
      requirement: { ...badge.requirement, current },
      progress,
      unlocked
    };
  };

  const processedBadges = allBadges.map(calculateBadgeProgress);

  const filteredBadges = processedBadges.filter(badge => {
    const matchesCategory = selectedCategory === 'all' || badge.category === selectedCategory;
    const matchesSearch = badge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         badge.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const unlockedBadges = processedBadges.filter(badge => badge.unlocked);
  const totalBadges = processedBadges.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('achievements')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Sistema de Badges
              </h1>
              <p className="text-gray-600 mt-2">
                Conquistas personalizadas por categoria
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {unlockedBadges.length}/{totalBadges}
            </div>
            <div className="text-sm text-gray-500">Badges Desbloqueados</div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <Zap className="h-5 w-5" />
                <span>Velocidade</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {speedBadges.filter(b => calculateBadgeProgress(b).unlocked).length}/{speedBadges.length}
              </div>
              <p className="text-sm text-gray-600">Badges de velocidade</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-blue-600">
                <Target className="h-5 w-5" />
                <span>Precisão</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {precisionBadges.filter(b => calculateBadgeProgress(b).unlocked).length}/{precisionBadges.length}
              </div>
              <p className="text-sm text-gray-600">Badges de precisão</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-green-600">
                <Lightbulb className="h-5 w-5" />
                <span>Criatividade</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {creativityBadges.filter(b => calculateBadgeProgress(b).unlocked).length}/{creativityBadges.length}
              </div>
              <p className="text-sm text-gray-600">Badges de criatividade</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar badges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-auto">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="speed">Velocidade</TabsTrigger>
              <TabsTrigger value="precision">Precisão</TabsTrigger>
              <TabsTrigger value="creativity">Criatividade</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBadges.map((badge) => {
            const IconComponent = badge.icon;
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={`border-2 transition-all duration-300 hover:shadow-xl ${
                  badge.unlocked 
                    ? 'bg-gradient-to-br from-white to-gray-50 border-green-200 shadow-lg' 
                    : `${categoryColors[badge.category]} opacity-75`
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-full ${
                          badge.unlocked 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className={`text-lg ${
                            badge.unlocked ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {badge.title}
                          </CardTitle>
                          <Badge className={`mt-1 ${rarityColors[badge.rarity]}`}>
                            {badge.rarity.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      {badge.unlocked && (
                        <Trophy className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {badge.description}
                    </CardDescription>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progresso</span>
                        <span className="font-medium">
                          {badge.requirement.current}/{badge.requirement.target}
                        </span>
                      </div>
                      <Progress value={badge.progress} className="h-2" />
                      
                      {badge.unlocked ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center space-x-2 text-green-700">
                            <Trophy className="h-4 w-4" />
                            <span className="font-medium">Desbloqueado!</span>
                          </div>
                          <div className="text-sm text-green-600 mt-1">
                            +{badge.reward.xp} XP • Título: {badge.reward.title}
                          </div>
                          {badge.reward.specialEffect && (
                            <div className="text-xs text-green-500 mt-1">
                              🎁 {badge.reward.specialEffect}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="text-sm text-gray-600">
                            <strong>Recompensa:</strong> {badge.reward.xp} XP
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>Título:</strong> {badge.reward.title}
                          </div>
                          {badge.reward.specialEffect && (
                            <div className="text-xs text-gray-500 mt-1">
                              🎁 {badge.reward.specialEffect}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredBadges.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum badge encontrado
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros ou termo de busca
            </p>
          </div>
        )}
      </div>
    </div>
  );
}