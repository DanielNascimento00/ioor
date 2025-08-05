import type { UserState } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Trophy,
  Target,
  Clock,
  Zap,
  BookOpen,
  Code,
  TrendingUp,
  Award,
  Star,
  Activity
} from 'lucide-react';

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

interface DashboardScreenProps {
  userState: UserState;
  onNavigate: (screen: Screen, missionId?: number) => void;
}

export function DashboardScreen({ userState, onNavigate }: DashboardScreenProps) {
  const totalMissions = 4;
  const completionPercentage = (userState.completedSteps.length / totalMissions) * 100;
  const nextLevelXP = userState.level * 200;
  const currentLevelXP = (userState.level - 1) * 200;
  const progressToNextLevel = ((userState.score - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  
  const stats = [
    {
      title: 'Missões Completas',
      value: userState.completedSteps.length,
      total: totalMissions,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Quizzes Completos',
      value: userState.completedQuizzes.length,
      total: totalMissions,
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'APIs Criadas',
      value: userState.apisCreated,
      total: null,
      icon: Code,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Conquistas',
      value: userState.achievements.length,
      total: null,
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  const recentActivities = [
    {
      type: 'mission',
      title: 'Missão HTTP Request completada',
      time: '2 horas atrás',
      xp: 100,
    },
    {
      type: 'quiz',
      title: 'Quiz de Fundamentos concluído',
      time: '1 dia atrás',
      xp: 50,
    },
    {
      type: 'achievement',
      title: 'Conquista "Mestre do HTTP" desbloqueada',
      time: '2 dias atrás',
      xp: 75,
    },
  ];

  const quickActions = [
    {
      title: 'Continuar Missão',
      description: 'Continue de onde parou',
      action: () => onNavigate('mission', userState.currentStep),
      icon: Target,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'Laboratório',
      description: 'Experimente ferramentas de rede',
      action: () => onNavigate('lab'),
      icon: Activity,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      title: 'Criar API',
      description: 'Construa suas próprias APIs',
      action: () => onNavigate('api-creator'),
      icon: Code,
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      title: 'Desafios',
      description: 'Teste suas habilidades',
      action: () => onNavigate('challenge'),
      icon: Zap,
      color: 'bg-orange-600 hover:bg-orange-700',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Bem-vindo de volta! Aqui está seu progresso.
            </p>
          </div>
          <Button
            onClick={() => onNavigate('map')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            Ver Mapa
          </Button>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Level Progress */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Nível {userState.level}
              </CardTitle>
              <CardDescription>
                {userState.score} XP total • {Math.round(progressToNextLevel)}% para o próximo nível
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={progressToNextLevel} className="h-3" />
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Nível {userState.level}</span>
                  <span>{nextLevelXP - userState.score} XP restante</span>
                  <span>Nível {userState.level + 1}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mission Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Progresso Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.round(completionPercentage)}%
                </div>
                <Progress value={completionPercentage} className="h-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {userState.completedSteps.length} de {totalMissions} missões
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <div className="flex items-baseline gap-1">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                        {stat.total && (
                          <p className="text-sm text-gray-500">/{stat.total}</p>
                        )}
                      </div>
                    </div>
                    <div className={`p-2 rounded-lg ${stat.bgColor} dark:bg-opacity-20`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                Ações Rápidas
              </CardTitle>
              <CardDescription>
                Continue sua jornada de aprendizado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={index}
                      onClick={action.action}
                      className={`${action.color} text-white h-auto p-4 flex flex-col items-center gap-2`}
                    >
                      <Icon className="w-6 h-6" />
                      <div className="text-center">
                        <div className="font-medium text-sm">{action.title}</div>
                        <div className="text-xs opacity-90">{action.description}</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                Atividade Recente
              </CardTitle>
              <CardDescription>
                Suas conquistas mais recentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="flex-shrink-0">
                      {activity.type === 'mission' && (
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      )}
                      {activity.type === 'quiz' && (
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                      )}
                      {activity.type === 'achievement' && (
                        <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                          <Award className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.time}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      +{activity.xp} XP
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievement Showcase */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Conquistas Recentes
            </CardTitle>
            <CardDescription>
              Suas últimas conquistas desbloqueadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userState.achievements.slice(-6).map((achievement, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  {achievement}
                </Badge>
              ))}
              {userState.achievements.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Complete missões para desbloquear conquistas!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}