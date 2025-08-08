import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Flame,
  Trophy,
  Gift,
  Star,
  Zap,
  Crown,
  ArrowLeft,
  CheckCircle,
  Clock
} from 'lucide-react';
import type { UserState } from '../App';

// Importar o tipo Screen do App.tsx para evitar conflitos
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
  | "achievements"
  | "badges"
  | "daily-streaks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface DailyStreaksProps {
  userState: UserState;
  onNavigate: (screen: Screen) => void;
  onUpdateProgress: (updates: Partial<UserState>) => void;
}

interface StreakReward {
  day: number;
  type: 'xp' | 'badge' | 'special';
  value: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface DailyActivity {
  date: string;
  completed: boolean;
  activities: string[];
  xpEarned: number;
}

const streakRewards: StreakReward[] = [
  {
    day: 3,
    type: 'xp',
    value: 50,
    title: 'Primeiro Passo',
    description: 'Bônus por 3 dias consecutivos',
    icon: Star,
    rarity: 'common'
  },
  {
    day: 7,
    type: 'badge',
    value: 100,
    title: 'Semana Completa',
    description: 'Badge de dedicação semanal',
    icon: Trophy,
    rarity: 'rare'
  },
  {
    day: 14,
    type: 'xp',
    value: 200,
    title: 'Duas Semanas',
    description: 'Bônus de consistência',
    icon: Flame,
    rarity: 'rare'
  },
  {
    day: 30,
    type: 'special',
    value: 500,
    title: 'Mestre da Consistência',
    description: 'Acesso a conteúdo exclusivo',
    icon: Crown,
    rarity: 'epic'
  },
  {
    day: 60,
    type: 'badge',
    value: 750,
    title: 'Lenda dos Streaks',
    description: 'Badge lendário de dedicação',
    icon: Zap,
    rarity: 'legendary'
  },
  {
    day: 100,
    type: 'special',
    value: 1000,
    title: 'Centenário',
    description: 'Título especial e benefícios únicos',
    icon: Crown,
    rarity: 'legendary'
  }
];

const rarityColors = {
  common: 'bg-gray-100 text-gray-800 border-gray-300',
  rare: 'bg-blue-100 text-blue-800 border-blue-300',
  epic: 'bg-purple-100 text-purple-800 border-purple-300',
  legendary: 'bg-yellow-100 text-yellow-800 border-yellow-300'
};

const rarityGradients = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-yellow-600'
};

export function DailyStreaks({ userState, onNavigate, onUpdateProgress }: DailyStreaksProps) {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [dailyActivities, setDailyActivities] = useState<DailyActivity[]>([]);
  const [todayCompleted, setTodayCompleted] = useState(false);
 
  // Simular dados baseados no estado do usuário
  useEffect(() => {
    // Calcular streak baseado na atividade do usuário
    const totalActivity = userState.completedSteps.length + userState.completedQuizzes.length + userState.apisCreated;
    const simulatedStreak = Math.min(Math.floor(totalActivity / 3), 15); // Máximo 15 para demonstração
    const simulatedLongest = Math.max(simulatedStreak, Math.floor(totalActivity / 2));
    
    setCurrentStreak(simulatedStreak);
    setLongestStreak(simulatedLongest);
    setTodayCompleted(totalActivity > 0);
    
    // Gerar atividades dos últimos 7 dias
    const activities: DailyActivity[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const completed = i < simulatedStreak;
      activities.push({
        date: dateStr,
        completed,
        activities: completed ? ['Quizz completado', 'Missão realizada'] : [],
        xpEarned: completed ? Math.floor(Math.random() * 50) + 25 : 0
      });
    }
    setDailyActivities(activities);
  }, [userState]);

  const getNextReward = () => {
    return streakRewards.find(reward => reward.day > currentStreak);
  };

  const getEarnedRewards = () => {
    return streakRewards.filter(reward => reward.day <= currentStreak);
  };

  const claimDailyReward = () => {
    if (!todayCompleted) {
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      setTodayCompleted(true);
      
      // Verificar se ganhou uma recompensa
      const reward = streakRewards.find(r => r.day === newStreak);
      if (reward) {
        onUpdateProgress({
          score: userState.score + reward.value,
          achievements: [...userState.achievements, reward.title]
        });
      }
    }
  };

  const nextReward = getNextReward();
  const earnedRewards = getEarnedRewards();
  const progressToNext = nextReward ? (currentStreak / nextReward.day) * 100 : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('dashboard')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Streaks Diários
              </h1>
              <p className="text-gray-600 mt-2">
                Recompensas por dias consecutivos de uso
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-orange-600 flex items-center space-x-2">
              <Flame className="h-8 w-8" />
              <span>{currentStreak}</span>
            </div>
            <div className="text-sm text-gray-500">Streak Atual</div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-orange-600">
                <Flame className="h-5 w-5" />
                <span>Streak Atual</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-700">{currentStreak}</div>
              <p className="text-sm text-orange-600">dias consecutivos</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <Trophy className="h-5 w-5" />
                <span>Melhor Streak</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-700">{longestStreak}</div>
              <p className="text-sm text-red-600">recorde pessoal</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-yellow-600">
                <Gift className="h-5 w-5" />
                <span>Recompensas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-700">{earnedRewards.length}</div>
              <p className="text-sm text-yellow-600">desbloqueadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Daily Check-in */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Check-in Diário</span>
            </CardTitle>
            <CardDescription>
              Faça login todos os dias para manter seu streak!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-4 rounded-full ${
                  todayCompleted 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {todayCompleted ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <Clock className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">
                    {todayCompleted ? 'Check-in Realizado!' : 'Faça seu Check-in'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {todayCompleted 
                      ? 'Você já fez atividades hoje. Continue assim!' 
                      : 'Complete uma atividade para manter seu streak'}
                  </p>
                </div>
              </div>
              {!todayCompleted && (
                <Button 
                  onClick={claimDailyReward}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  Fazer Check-in
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress to Next Reward */}
        {nextReward && (
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gift className="h-5 w-5" />
                <span>Próxima Recompensa</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${rarityGradients[nextReward.rarity]} text-white`}>
                      <nextReward.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{nextReward.title}</h3>
                      <p className="text-sm text-gray-600">{nextReward.description}</p>
                    </div>
                  </div>
                  <Badge className={rarityColors[nextReward.rarity]}>
                    {nextReward.rarity.toUpperCase()}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span>{currentStreak}/{nextReward.day} dias</span>
                  </div>
                  <Progress value={progressToNext} className="h-3" />
                  <p className="text-xs text-gray-500">
                    Faltam {nextReward.day - currentStreak} dias para desbloquear
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Weekly Calendar */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Atividade da Semana</CardTitle>
            <CardDescription>
              Visualize sua consistência nos últimos 7 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {dailyActivities.map((activity, index) => {
                const date = new Date(activity.date);
                const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
                const dayNumber = date.getDate();
                
                return (
                  <motion.div
                    key={activity.date}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-3 rounded-lg text-center border-2 transition-all ${
                      activity.completed
                        ? 'bg-gradient-to-br from-green-100 to-green-200 border-green-300'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="text-xs text-gray-600 mb-1">{dayName}</div>
                    <div className="text-lg font-bold mb-1">{dayNumber}</div>
                    {activity.completed ? (
                      <div className="space-y-1">
                        <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                        <div className="text-xs text-green-600">+{activity.xpEarned} XP</div>
                      </div>
                    ) : (
                      <div className="h-6 flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Earned Rewards */}
        {earnedRewards.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Recompensas Conquistadas</span>
              </CardTitle>
              <CardDescription>
                Suas conquistas por manter streaks consistentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {earnedRewards.map((reward) => {
                  const IconComponent = reward.icon;
                  return (
                    <motion.div
                      key={reward.day}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg border-2 bg-gradient-to-br from-white to-gray-50 border-green-200"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`p-2 rounded-full bg-gradient-to-r ${rarityGradients[reward.rarity]} text-white`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{reward.title}</h3>
                          <Badge className={`text-xs ${rarityColors[reward.rarity]}`}>
                            {reward.day} dias
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{reward.description}</p>
                      <div className="text-xs text-green-600 font-medium">
                        +{reward.value} {reward.type === 'xp' ? 'XP' : 'Pontos'}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}