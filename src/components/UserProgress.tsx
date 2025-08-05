import { ArrowLeft, Award, Star, Target, Trophy, Zap } from "lucide-react";
import { motion } from "motion/react";
import type { UserState } from "../App";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";

interface UserProgressProps {
  userState: UserState;
  onNavigate: (screen: "welcome" | "map") => void;
}

const achievements = [
  {
    id: "first-mission",
    title: "Primeira Missão",
    description: "Complete sua primeira missão",
    icon: Star,
    condition: (state: UserState) => state.completedSteps.length >= 1,
  },
  {
    id: "half-way",
    title: "Meio Caminho",
    description: "Complete 50% das missões",
    icon: Target,
    condition: (state: UserState) => state.completedSteps.length >= 4,
  },
  {
    id: "speed-runner",
    title: "Velocista",
    description: "Complete 3 missões em sequência",
    icon: Zap,
    condition: (state: UserState) => {
      const sorted = [...state.completedSteps].sort((a, b) => a - b);
      for (let i = 0; i <= sorted.length - 3; i++) {
        if (
          sorted[i + 1] === sorted[i] + 1 &&
          sorted[i + 2] === sorted[i] + 2
        ) {
          return true;
        }
      }
      return false;
    },
  },
  {
    id: "master",
    title: "Mestre da Web",
    description: "Complete todas as missões",
    icon: Award,
    condition: (state: UserState) => state.completedSteps.length >= 7,
  },
];

const stats = [
  {
    label: "Missões Completas",
    getValue: (state: UserState) => `${state.completedSteps.length}/7`,
    color: "text-blue-500",
  },
  {
    label: "Experiência Total",
    getValue: (state: UserState) => `${state.score} XP`,
    color: "text-green-500",
  },
  {
    label: "Nível Atual",
    getValue: (state: UserState) => `${state.level}`,
    color: "text-purple-500",
  },
  {
    label: "Conquistas",
    getValue: (state: UserState) =>
      `${achievements.filter((a) => a.condition(state)).length}/${
        achievements.length
      }`,
    color: "text-orange-500",
  },
];

export function UserProgress({ userState, onNavigate }: UserProgressProps) {
  const completionPercentage = (userState.completedSteps.length / 7) * 100;
  const unlockedAchievements = achievements.filter((a) =>
    a.condition(userState)
  );
  const lockedAchievements = achievements.filter(
    (a) => !a.condition(userState)
  );

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
            <h1 className="text-3xl mb-2">Seu Progresso</h1>
            <p className="text-muted-foreground">
              Acompanhe suas conquistas na jornada web
            </p>
          </div>

          <Button
            onClick={() => onNavigate("map")}
            className="bg-gradient-to-r from-blue-500 to-purple-600"
          >
            Continuar Jornada
          </Button>
        </motion.div>

        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">
                {Math.round(completionPercentage)}%
              </div>
              <p className="text-muted-foreground">Progresso Geral</p>
            </div>
            <Progress value={completionPercentage} className="h-4 mb-4" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Início da Jornada</span>
              <span>Mestre da Web</span>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center">
              <div className={`text-2xl mb-2 ${stat.color}`}>
                {stat.getValue(userState)}
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </motion.div>

        {/* Achievements */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Unlocked Achievements */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h3>Conquistas Desbloqueadas</h3>
                <Badge className="bg-green-500">
                  {unlockedAchievements.length}
                </Badge>
              </div>

              <div className="space-y-4">
                {unlockedAchievements.length > 0 ? (
                  unlockedAchievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200"
                    >
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <achievement.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-green-800 dark:text-green-200 mb-1">
                          {achievement.title}
                        </h4>
                        <p className="text-green-600 dark:text-green-300 text-sm">
                          {achievement.description}
                        </p>
                      </div>
                      <Badge className="bg-green-500 text-white">
                        Completa ✓
                      </Badge>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma conquista desbloqueada ainda.</p>
                    <p className="text-sm">
                      Complete missões para ganhar conquistas!
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Locked Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 text-gray-400" />
                <h3>Próximas Conquistas</h3>
                <Badge variant="outline">{lockedAchievements.length}</Badge>
              </div>

              <div className="space-y-4">
                {lockedAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 opacity-75"
                  >
                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <achievement.icon className="w-6 h-6 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-600 dark:text-gray-300 mb-1">
                        {achievement.title}
                      </h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {achievement.description}
                      </p>
                    </div>
                    <Badge variant="outline">Bloqueada</Badge>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center mt-12"
        >
          {userState.completedSteps.length < 7 ? (
            <div>
              <h3 className="text-xl mb-4">Continue sua jornada!</h3>
              <p className="text-muted-foreground mb-6">
                Você ainda tem {7 - userState.completedSteps.length} missão(ões)
                para completar.
              </p>
              <Button
                onClick={() => onNavigate("map")}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3"
              >
                Voltar às Missões
              </Button>
            </div>
          ) : (
            <div>
              <h3 className="text-xl mb-4">🎉 Parabéns, Mestre da Web!</h3>
              <p className="text-muted-foreground mb-6">
                Você completou todas as missões e dominou o fluxo de requisições
                web!
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => onNavigate("map")}
                  variant="outline"
                  size="lg"
                >
                  Revisar Missões
                </Button>
                <Button
                  onClick={() => onNavigate("welcome")}
                  size="lg"
                  className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white"
                >
                  Recomeçar Jornada
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
