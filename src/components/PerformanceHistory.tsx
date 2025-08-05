import {
  ArrowLeft,
  Award,
  BarChart3,
  Calendar,
  Clock,
  Target,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  generateLearningPath,
  generateMockHistory,
  generateWeeklyStats,
} from "./utils/mockData";

interface PerformanceHistoryProps {
  onNavigate: (screen: "welcome" | "progress") => void;
}

export function PerformanceHistory({ onNavigate }: PerformanceHistoryProps) {
  const sessionHistory = generateMockHistory();
  const weeklyStats = generateWeeklyStats();
  const learningPath = generateLearningPath();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
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
            onClick={() => onNavigate("welcome")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>

          <div className="text-center">
            <div className="flex items-center gap-2 justify-center mb-2">
              <BarChart3 className="w-6 h-6 text-blue-500" />
              <h1 className="text-3xl">Histórico de Performance</h1>
            </div>
            <p className="text-muted-foreground">
              Acompanhe sua evolução e estatísticas detalhadas
            </p>
          </div>

          <Button
            onClick={() => onNavigate("progress")}
            className="bg-gradient-to-r from-blue-500 to-purple-600"
          >
            Ver Conquistas
          </Button>
        </motion.div>

        {/* Weekly Stats Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl mb-1">{weeklyStats.totalXP}</div>
            <div className="text-sm text-muted-foreground">XP Esta Semana</div>
          </Card>
          <Card className="p-6 text-center">
            <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl mb-1">{weeklyStats.totalMissions}</div>
            <div className="text-sm text-muted-foreground">
              Missões Completas
            </div>
          </Card>
          <Card className="p-6 text-center">
            <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl mb-1">{weeklyStats.averageAccuracy}%</div>
            <div className="text-sm text-muted-foreground">Precisão Média</div>
          </Card>
          <Card className="p-6 text-center">
            <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl mb-1">
              {Math.floor(weeklyStats.totalTime / 60)}h
            </div>
            <div className="text-sm text-muted-foreground">Tempo de Estudo</div>
          </Card>
        </motion.div>

        {/* Detailed Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs defaultValue="sessions" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sessions">
                <Calendar className="w-4 h-4 mr-2" />
                Sessões
              </TabsTrigger>
              <TabsTrigger value="learning">
                <Target className="w-4 h-4 mr-2" />
                Progresso
              </TabsTrigger>
              <TabsTrigger value="insights">
                <BarChart3 className="w-4 h-4 mr-2" />
                Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sessions" className="space-y-4">
              <Card className="p-6">
                <h3 className="mb-4">Histórico de Sessões</h3>
                <div className="space-y-3">
                  {sessionHistory.map((session, index) => (
                    <motion.div
                      key={session.date}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-sm font-medium">
                            {formatDate(session.date)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {index === 0
                              ? "Hoje"
                              : index === 1
                              ? "Ontem"
                              : `${index} dias atrás`}
                          </div>
                        </div>
                        <div className="text-sm">
                          <div>
                            {session.missionsCompleted} missões •{" "}
                            {session.timeSpent}min
                          </div>
                          <div className="text-muted-foreground">
                            Precisão: {session.accuracy}%
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-medium text-green-600">
                          +{session.xpEarned}
                        </div>
                        <div className="text-xs text-muted-foreground">XP</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="learning" className="space-y-4">
              <Card className="p-6">
                <h3 className="mb-4">Trilha de Aprendizado</h3>
                <div className="space-y-4">
                  {learningPath.map((item, index) => (
                    <motion.div
                      key={item.topic}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{item.topic}</h4>
                          <Badge
                            variant={item.completed ? "default" : "outline"}
                          >
                            {item.progress}%
                          </Badge>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              item.completed ? "bg-green-500" : "bg-blue-500"
                            }`}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="mb-4">Pontos Fortes</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Conceitos HTTP</span>
                      <Badge className="bg-green-500">Excelente</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Resolução DNS</span>
                      <Badge className="bg-blue-500">Muito Bom</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Protocolos TCP</span>
                      <Badge className="bg-green-500">Excelente</Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="mb-4">Áreas para Melhoria</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Segurança HTTPS</span>
                      <Badge variant="outline">Precisa Praticar</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Performance</span>
                      <Badge className="bg-yellow-500">Bom</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">APIs REST</span>
                      <Badge variant="outline">Iniciante</Badge>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="mb-4">Recomendações Personalizadas</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <p>
                      Foque em conceitos de segurança HTTPS para melhorar seu
                      conhecimento geral
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <p>
                      Continue praticando com desafios de performance para
                      manter o ritmo
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <p>
                      Experimente criar mais APIs no laboratório para ganhar
                      experiência prática
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
