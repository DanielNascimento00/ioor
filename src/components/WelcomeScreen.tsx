import {
  Book,
  Brain,
  Clock,
  FlaskConical,
  Globe,
  Network,
  Settings,
  Trophy,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";
import type { UserState } from "../App";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface WelcomeScreenProps {
  onNavigate: (
    screen:
      | "map"
      | "progress"
      | "leaderboard"
      | "challenge"
      | "api-creator"
      | "glossary"
      | "lab"
      | "settings"
      | "fundamentals"
  ) => void;
  userState: UserState;
}

export function WelcomeScreen({ onNavigate, userState }: WelcomeScreenProps) {
  const features = [
    {
      icon: Globe,
      title: "Missões Interativas",
      description: "Acompanhe o pacote de dados em sua jornada pela web",
      action: () => onNavigate("map"),
    },
    {
      icon: Network,
      title: "Fundamentos de Redes",
      description: "Conceitos, protocolos e tecnologias essenciais",
      action: () => onNavigate('fundamentals'),
      badge: userState.fundamentalsRead.length > 0 ? `${userState.fundamentalsRead.length} estudados` : 'Novo!'
    },
    {
      icon: Brain,
      title: "IA Assistente",
      description: "Tire dúvidas com nosso DevBot inteligente",
      action: () => onNavigate("map"),
    },
    {
      icon: Clock,
      title: "Modo Desafio",
      description: "Teste suas habilidades contra o tempo",
      action: () => onNavigate("challenge"),
      badge:
        userState.challengesCompleted > 0
          ? `${userState.challengesCompleted} completos`
          : "Novo!",
    },
    {
      icon: Wrench,
      title: "Criador de APIs",
      description: "Monte e teste suas próprias rotas de API",
      action: () => onNavigate("api-creator"),
      badge:
        userState.apisCreated > 0 ? `${userState.apisCreated} APIs` : "Novo!",
    },
    {
      icon: Book,
      title: "Glossário",
      description: "Dicionário completo de termos web",
      action: () => onNavigate("glossary"),
    },
    {
      icon: FlaskConical,
      title: "Laboratório",
      description: "Experimente com diferentes protocolos",
      action: () => onNavigate("lab"),
    },
  ];

  const quickActions = [
    {
      title: "Continuar Jornada",
      description: `${userState.completedSteps.length}/7 missões completas`,
      action: () => onNavigate("map"),
      primary: true,
    },
    {
      title: "Ver Ranking",
      description: `${userState.score} XP • Nível ${userState.level}`,
      action: () => onNavigate("leaderboard"),
    },
    {
      title: "Seu Progresso",
      description: `${userState.achievements.length} conquistas`,
      action: () => onNavigate("progress"),
    },
  ];

  const isReturningUser = userState.completedSteps.length > 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 relative"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="w-12 h-12 text-white" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("settings")}
              className="absolute top-0 right-0"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-6xl mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            IOOR
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            {isReturningUser
              ? `Bem-vindo de volta! Continue sua jornada pelos mistérios das requisições web.`
              : `Desvende os mistérios das requisições web através de uma jornada interativa e gamificada.`}
          </motion.p>

          {isReturningUser && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center gap-4 mb-8"
            >
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {userState.score} XP Total
              </Badge>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              >
                Nível {userState.level}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
              >
                {userState.achievements.length} Conquistas
              </Badge>
            </motion.div>
          )}
        </div>

        {/* Quick Actions for returning users */}
        {isReturningUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="grid md:grid-cols-3 gap-4 mb-12"
          >
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className={`p-6 cursor-pointer hover:shadow-lg transition-all ${
                  action.primary
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 dark:from-blue-900/20 dark:to-purple-900/20"
                    : ""
                }`}
                onClick={action.action}
              >
                <h3 className="mb-2">{action.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {action.description}
                </p>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <Card
                className="p-6 h-full text-center hover:shadow-lg transition-all cursor-pointer group"
                onClick={feature.action}
              >
                <div className="relative">
                  <feature.icon className="w-8 h-8 text-blue-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  {feature.badge && (
                    <Badge className="absolute -top-2 -right-2 text-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                      {feature.badge}
                    </Badge>
                  )}
                </div>
                <h3 className="mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={() => onNavigate("map")}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3"
          >
            {isReturningUser ? "Continuar Jornada" : "Começar Jornada"}
          </Button>

          <Button
            variant="outline"
            onClick={() => onNavigate("leaderboard")}
            size="lg"
            className="px-8 py-3"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Ver Ranking
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
