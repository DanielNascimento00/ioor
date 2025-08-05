import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  MessageCircle,
  Play,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { UserState } from "../App";
import { ChatScreen } from "./ChatScreen";
import { MissionExplanation } from "./MissionExplanation";
import { MissionSimulator } from "./MissionSimulator";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { MISSIONS } from "./utils/constants";

interface MissionScreenProps {
  missionIndex: number;
  userState: UserState;
  onNavigate: (screen: "map" | "quiz") => void;
  onUpdateProgress: (updates: Partial<UserState>) => void;
}

export function MissionScreen({
  missionIndex,
  userState,
  onNavigate,
  onUpdateProgress,
}: MissionScreenProps) {
  const [completedSimulation, setCompletedSimulation] = useState(false);

  const mission = MISSIONS[missionIndex];
  const isMissionCompleted = userState.completedSteps.includes(missionIndex);
  const isQuizCompleted = userState.completedQuizzes.includes(missionIndex);
  const hasQuiz = missionIndex >= 2; // Missions 2+ have quizzes
  const needsQuiz = hasQuiz && isMissionCompleted && !isQuizCompleted;

  const handleCompleteSimulation = () => {
    setCompletedSimulation(true);

    if (!isMissionCompleted) {
      // Complete the mission
      const newCompletedSteps = [...userState.completedSteps, missionIndex];
      const xpEarned = 100; // Base XP for completing mission

      onUpdateProgress({
        completedSteps: newCompletedSteps,
        score: userState.score + xpEarned,
        currentStep: Math.max(userState.currentStep, missionIndex + 1),
      });
    }
  };

  const getQuizScore = () => {
    const score = userState.quizScores[missionIndex];
    return score ? Math.round((score.score / score.totalQuestions) * 100) : 0;
  };

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
            <div className="flex items-center gap-3 justify-center mb-2">
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-r ${mission.color} flex items-center justify-center text-xl`}
              >
                {mission.character}
              </div>
              <div>
                <h1 className="text-2xl">{mission.title}</h1>
                <p className="text-muted-foreground text-sm">
                  {mission.description}
                </p>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex justify-center gap-2 mt-4">
              {isMissionCompleted ? (
                <Badge className="bg-green-500 text-white">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Missão Completa
                </Badge>
              ) : completedSimulation ? (
                <Badge className="bg-blue-500 text-white">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Simulação Completa
                </Badge>
              ) : (
                <Badge variant="outline">Em Progresso</Badge>
              )}

              {hasQuiz && (
                <Badge
                  className={
                    isQuizCompleted
                      ? "bg-green-500 text-white"
                      : needsQuiz
                      ? "bg-yellow-500 text-white"
                      : "border-blue-500 text-blue-600"
                  }
                >
                  <BookOpen className="w-3 h-3 mr-1" />
                  {isQuizCompleted
                    ? `Quiz: ${getQuizScore()}%`
                    : needsQuiz
                    ? "Quiz Pendente"
                    : "Quiz Disponível"}
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {hasQuiz && (
              <Button
                onClick={() => onNavigate("quiz")}
                variant={needsQuiz ? "default" : "outline"}
                className={
                  needsQuiz
                    ? "bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 text-white"
                    : ""
                }
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {isQuizCompleted ? "Refazer Quiz" : "Fazer Quiz"}
              </Button>
            )}
          </div>
        </motion.div>

        {/* Quiz Requirement Notice */}
        {needsQuiz && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="p-4 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                    Quiz Obrigatório
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Complete o quiz desta missão para desbloquear a próxima
                    etapa da jornada.
                  </p>
                </div>
                <Button
                  onClick={() => onNavigate("quiz")}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  Fazer Quiz Agora
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="explanation" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="explanation">Explicação</TabsTrigger>
              <TabsTrigger value="simulator">
                <Play className="w-4 h-4 mr-2" />
                Simulador
              </TabsTrigger>
              <TabsTrigger value="chat">
                <MessageCircle className="w-4 h-4 mr-2" />
                IA Assistant
              </TabsTrigger>
            </TabsList>

            <TabsContent value="explanation">
              <MissionExplanation mission={mission} />
            </TabsContent>

            <TabsContent value="simulator">
              <MissionSimulator
                missionIndex={missionIndex}
                onComplete={handleCompleteSimulation}
              />
            </TabsContent>

            <TabsContent value="chat">
              <div className="bg-white dark:bg-gray-900 rounded-lg border">
                <ChatScreen onNavigate={() => {}} />
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Progress Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          {!isMissionCompleted && !completedSimulation && (
            <p className="text-muted-foreground text-sm">
              Complete a simulação para finalizar esta missão
            </p>
          )}

          {(completedSimulation || isMissionCompleted) && !needsQuiz && (
            <div className="space-y-2">
              <p className="text-green-600 font-medium">
                ✓ Missão completa!{" "}
                {hasQuiz && isQuizCompleted && "Quiz finalizado!"}
              </p>
              {!hasQuiz && (
                <p className="text-muted-foreground text-sm">
                  Você pode prosseguir para a próxima missão
                </p>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
