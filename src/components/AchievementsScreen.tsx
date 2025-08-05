import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Globe,
  Lock,
  Shield,
  Star,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { UserState } from "../App";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

interface AchievementsScreenProps {
  userState: UserState;
  onNavigate: (screen: "welcome" | "map") => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: "progress" | "skill" | "exploration" | "mastery" | "special";
  icon: React.ComponentType<{ className?: string }>;
  requirement: {
    type:
      | "score"
      | "missions"
      | "quizzes"
      | "experiments"
      | "streak"
      | "special";
    target: number;
    current?: number;
  };
  reward: {
    xp: number;
    title?: string;
  };
  rarity: "common" | "rare" | "epic" | "legendary";
  unlocked: boolean;
}

const achievements: Achievement[] = [
  {
    id: "first-steps",
    title: "Primeiros Passos",
    description: "Complete sua primeira missão",
    category: "progress",
    icon: Target,
    requirement: {
      type: "missions",
      target: 1,
    },
    reward: {
      xp: 50,
      title: "Iniciante",
    },
    rarity: "common",
    unlocked: false,
  },
  {
    id: "web-explorer",
    title: "Explorador da Web",
    description: "Complete 3 missões consecutivas",
    category: "progress",
    icon: Globe,
    requirement: {
      type: "missions",
      target: 3,
    },
    reward: {
      xp: 100,
      title: "Explorador",
    },
    rarity: "common",
    unlocked: false,
  },
  {
    id: "http-master",
    title: "Mestre do HTTP",
    description: "Complete todas as missões básicas de HTTP",
    category: "mastery",
    icon: Zap,
    requirement: {
      type: "missions",
      target: 5,
    },
    reward: {
      xp: 200,
      title: "Mestre HTTP",
    },
    rarity: "rare",
    unlocked: false,
  },
  {
    id: "quiz-champion",
    title: "Campeão dos Quizzes",
    description: "Acerte 90% ou mais em 5 quizzes",
    category: "skill",
    icon: Star,
    requirement: {
      type: "quizzes",
      target: 5,
    },
    reward: {
      xp: 150,
      title: "Gênio",
    },
    rarity: "rare",
    unlocked: false,
  },
  {
    id: "security-expert",
    title: "Especialista em Segurança",
    description: "Complete todos os experimentos de segurança",
    category: "mastery",
    icon: Shield,
    requirement: {
      type: "experiments",
      target: 2,
    },
    reward: {
      xp: 300,
      title: "Guardião",
    },
    rarity: "epic",
    unlocked: false,
  },
  {
    id: "speed-runner",
    title: "Velocista",
    description: "Complete uma missão em menos de 2 minutos",
    category: "special",
    icon: Clock,
    requirement: {
      type: "special",
      target: 1,
    },
    reward: {
      xp: 100,
      title: "Relâmpago",
    },
    rarity: "rare",
    unlocked: false,
  },
  {
    id: "perfectionist",
    title: "Perfeccionista",
    description: "Obtenha pontuação máxima em 3 quizzes consecutivos",
    category: "skill",
    icon: Trophy,
    requirement: {
      type: "streak",
      target: 3,
    },
    reward: {
      xp: 250,
      title: "Perfeito",
    },
    rarity: "epic",
    unlocked: false,
  },
  {
    id: "network-ninja",
    title: "Ninja das Redes",
    description: "Complete todos os experimentos de rede",
    category: "mastery",
    icon: Globe,
    requirement: {
      type: "experiments",
      target: 4,
    },
    reward: {
      xp: 400,
      title: "Ninja",
    },
    rarity: "epic",
    unlocked: false,
  },
  {
    id: "legend",
    title: "Lenda do IOOR",
    description: "Alcance 2000 pontos de experiência",
    category: "mastery",
    icon: Trophy,
    requirement: {
      type: "score",
      target: 2000,
    },
    reward: {
      xp: 500,
      title: "Lenda",
    },
    rarity: "legendary",
    unlocked: false,
  },
  {
    id: "social-butterfly",
    title: "Borboleta Social",
    description: "Compartilhe seu progresso 5 vezes",
    category: "special",
    icon: Users,
    requirement: {
      type: "special",
      target: 5,
    },
    reward: {
      xp: 75,
      title: "Social",
    },
    rarity: "common",
    unlocked: false,
  },
];

export function AchievementsScreen({
  userState,
  onNavigate,
}: AchievementsScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-500";
      case "rare":
        return "bg-blue-500";
      case "epic":
        return "bg-purple-500";
      case "legendary":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-300";
      case "rare":
        return "border-blue-300";
      case "epic":
        return "border-purple-300";
      case "legendary":
        return "border-yellow-300";
      default:
        return "border-gray-300";
    }
  };

  const calculateProgress = (achievement: Achievement): number => {
    const { requirement } = achievement;
    let current = 0;

    switch (requirement.type) {
      case "score":
        current = userState.score;
        break;
      case "missions":
        current = userState.completedSteps.length;
        break;
      case "quizzes":
        current = Object.keys(userState.completedQuizzes).filter(
          (id) => userState.completedQuizzes[parseInt(id)]
        ).length;
        break;
      case "experiments":
        // Simulated based on category
        if (achievement.id === "security-expert") {
          current = Math.min(2, Math.floor(userState.score / 200));
        } else if (achievement.id === "network-ninja") {
          current = Math.min(4, Math.floor(userState.score / 150));
        }
        break;
      case "streak":
        // Simulated perfect quiz streak
        current = Math.min(
          requirement.target,
          Math.floor(userState.score / 300)
        );
        break;
      case "special":
        // Simulated special achievements
        current = Math.min(
          requirement.target,
          Math.floor(userState.score / 100)
        );
        break;
    }

    return Math.min(current, requirement.target);
  };

  const isAchievementUnlocked = (achievement: Achievement): boolean => {
    return (
      userState.achievements.includes(achievement.id) ||
      calculateProgress(achievement) >= achievement.requirement.target
    );
  };

  const getFilteredAchievements = () => {
    let filtered = achievements.map((achievement) => ({
      ...achievement,
      unlocked: isAchievementUnlocked(achievement),
      requirement: {
        ...achievement.requirement,
        current: calculateProgress(achievement),
      },
    }));

    if (selectedCategory !== "all") {
      if (selectedCategory === "unlocked") {
        filtered = filtered.filter((a) => a.unlocked);
      } else if (selectedCategory === "locked") {
        filtered = filtered.filter((a) => !a.unlocked);
      } else {
        filtered = filtered.filter((a) => a.category === selectedCategory);
      }
    }

    return filtered.sort((a, b) => {
      if (a.unlocked && !b.unlocked) return -1;
      if (!a.unlocked && b.unlocked) return 1;
      return 0;
    });
  };

  const unlockedCount = achievements.filter((a) =>
    isAchievementUnlocked(a)
  ).length;
  const totalXpFromAchievements = achievements
    .filter((a) => isAchievementUnlocked(a))
    .reduce((sum, a) => sum + a.reward.xp, 0);

  const categories = [
    { id: "all", label: "Todas", count: achievements.length },
    { id: "unlocked", label: "Desbloqueadas", count: unlockedCount },
    {
      id: "locked",
      label: "Bloqueadas",
      count: achievements.length - unlockedCount,
    },
    {
      id: "progress",
      label: "Progresso",
      count: achievements.filter((a) => a.category === "progress").length,
    },
    {
      id: "skill",
      label: "Habilidade",
      count: achievements.filter((a) => a.category === "skill").length,
    },
    {
      id: "mastery",
      label: "Maestria",
      count: achievements.filter((a) => a.category === "mastery").length,
    },
    {
      id: "special",
      label: "Especiais",
      count: achievements.filter((a) => a.category === "special").length,
    },
  ];

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
            onClick={() => onNavigate("map")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Mapa
          </Button>

          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">🏆 Conquistas</h1>
            <p className="text-muted-foreground">
              Desbloqueie conquistas e ganhe recompensas especiais
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {unlockedCount}/{achievements.length}
            </Badge>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="p-6 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <h3 className="text-2xl font-bold">{unlockedCount}</h3>
            <p className="text-muted-foreground">Conquistas Desbloqueadas</p>
          </Card>

          <Card className="p-6 text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <h3 className="text-2xl font-bold">{totalXpFromAchievements}</h3>
            <p className="text-muted-foreground">XP de Conquistas</p>
          </Card>

          <Card className="p-6 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <h3 className="text-2xl font-bold">
              {Math.round((unlockedCount / achievements.length) * 100)}%
            </h3>
            <p className="text-muted-foreground">Progresso Total</p>
          </Card>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid grid-cols-4 lg:grid-cols-7 w-full">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="text-xs"
                >
                  {category.label}
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Achievements Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {getFilteredAchievements().map((achievement) => {
            const IconComponent = achievement.icon;
            const progress =
              ((achievement.requirement.current || 0) /
                achievement.requirement.target) *
              100;

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                className={`relative overflow-hidden ${
                  achievement.unlocked ? "" : "opacity-75"
                }`}
              >
                <Card
                  className={`p-6 border-2 ${getRarityBorder(
                    achievement.rarity
                  )} ${
                    achievement.unlocked
                      ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950"
                      : ""
                  }`}
                >
                  {/* Rarity indicator */}
                  <div
                    className={`absolute top-2 right-2 w-3 h-3 rounded-full ${getRarityColor(
                      achievement.rarity
                    )}`}
                  />

                  {/* Achievement status */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg ${getRarityColor(
                        achievement.rarity
                      )} flex items-center justify-center text-white`}
                    >
                      {achievement.unlocked ? (
                        <IconComponent className="w-6 h-6" />
                      ) : (
                        <Lock className="w-6 h-6" />
                      )}
                    </div>
                    {achievement.unlocked && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>

                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      achievement.unlocked ? "" : "text-muted-foreground"
                    }`}
                  >
                    {achievement.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4">
                    {achievement.description}
                  </p>

                  {/* Progress bar */}
                  {!achievement.unlocked && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progresso</span>
                        <span>
                          {achievement.requirement.current || 0}/
                          {achievement.requirement.target}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`${getRarityColor(
                          achievement.rarity
                        )} text-white`}
                      >
                        {achievement.rarity}
                      </Badge>
                      <Badge variant="outline">{achievement.category}</Badge>
                    </div>
                    <Badge variant="secondary">
                      +{achievement.reward.xp} XP
                    </Badge>
                  </div>

                  {achievement.reward.title && achievement.unlocked && (
                    <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                      <p className="text-xs text-yellow-700 dark:text-yellow-300 text-center">
                        🎖️ Título desbloqueado: "{achievement.reward.title}"
                      </p>
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {getFilteredAchievements().length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">
              Nenhuma conquista encontrada
            </h3>
            <p className="text-muted-foreground">
              Tente alterar os filtros ou continue jogando para desbloquear mais
              conquistas!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
