import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Clock,
  Globe,
  Info,
  Network,
  Play,
  RotateCcw,
  Shield,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { UserState } from "../App";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface LabScreenProps {
  userState: UserState;
  onNavigate: (screen: "welcome" | "map") => void;
  onUpdateProgress: (updates: Partial<UserState>) => void;
}

interface Experiment {
  id: string;
  title: string;
  description: string;
  category: "network" | "http" | "security" | "performance";
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  xpReward: number;
  icon: React.ComponentType<{ className?: string }>;
}

interface ExperimentResult {
  success: boolean;
  message: string;
  details: string[];
  executionTime: number;
}

const experiments: Experiment[] = [
  {
    id: "ping-test",
    title: "Teste de Ping",
    description: "Simule um teste de ping para verificar conectividade",
    category: "network",
    difficulty: "beginner",
    estimatedTime: "2 min",
    xpReward: 15,
    icon: Network,
  },
  {
    id: "dns-lookup",
    title: "Resolução DNS",
    description: "Teste a resolução de nomes de domínio",
    category: "network",
    difficulty: "beginner",
    estimatedTime: "3 min",
    xpReward: 20,
    icon: Globe,
  },
  {
    id: "http-headers",
    title: "Análise de Headers HTTP",
    description: "Examine headers de requisições e respostas HTTP",
    category: "http",
    difficulty: "intermediate",
    estimatedTime: "5 min",
    xpReward: 25,
    icon: Info,
  },
  {
    id: "ssl-check",
    title: "Verificação SSL/TLS",
    description: "Analise certificados SSL e configurações de segurança",
    category: "security",
    difficulty: "intermediate",
    estimatedTime: "4 min",
    xpReward: 30,
    icon: Shield,
  },
  {
    id: "load-test",
    title: "Teste de Carga",
    description: "Simule múltiplas requisições para testar performance",
    category: "performance",
    difficulty: "advanced",
    estimatedTime: "8 min",
    xpReward: 40,
    icon: Zap,
  },
  {
    id: "traceroute",
    title: "Rastreamento de Rota",
    description: "Trace o caminho dos pacotes até o destino",
    category: "network",
    difficulty: "advanced",
    estimatedTime: "6 min",
    xpReward: 35,
    icon: Network,
  },
];

export function LabScreen({
  userState,
  onNavigate,
  onUpdateProgress,
}: LabScreenProps) {
  const [selectedExperiment, setSelectedExperiment] =
    useState<Experiment | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ExperimentResult | null>(null);
  const [experimentParams, setExperimentParams] = useState<
    Record<string, string>
  >({});
  const [completedExperiments, setCompletedExperiments] = useState<string[]>(
    []
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "network":
        return "bg-blue-500";
      case "http":
        return "bg-green-500";
      case "security":
        return "bg-red-500";
      case "performance":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const runExperiment = async (experiment: Experiment) => {
    setIsRunning(true);
    setResult(null);

    // Simulate experiment execution
    const startTime = Date.now();

    // Simulate different execution times based on experiment
    const executionTime = Math.random() * 2000 + 1000;

    await new Promise((resolve) => setTimeout(resolve, executionTime));

    const endTime = Date.now();
    const actualExecutionTime = endTime - startTime;

    // Generate mock results based on experiment type
    const mockResult = generateMockResult(experiment, experimentParams);

    setResult({
      ...mockResult,
      executionTime: actualExecutionTime,
    });

    setIsRunning(false);

    // Award XP if experiment completed successfully
    if (mockResult.success && !completedExperiments.includes(experiment.id)) {
      setCompletedExperiments((prev) => [...prev, experiment.id]);
      onUpdateProgress({
        score: userState.score + experiment.xpReward,
      });
    }
  };

  const generateMockResult = (
    experiment: Experiment,
    params: Record<string, string>
  ): Omit<ExperimentResult, "executionTime"> => {
    const success = Math.random() > 0.2; // 80% success rate

    switch (experiment.id) {
      case "ping-test":
        return {
          success,
          message: success
            ? "Ping executado com sucesso!"
            : "Falha na conectividade",
          details: success
            ? [
                `Host: ${params.host || "google.com"}`,
                "Tempo de resposta: 23ms",
                "TTL: 64",
                "Pacotes enviados: 4",
                "Pacotes recebidos: 4",
                "Perda de pacotes: 0%",
              ]
            : [
                `Host: ${params.host || "google.com"}`,
                "Timeout na conexão",
                "Possível problema de rede",
              ],
        };

      case "dns-lookup":
        return {
          success,
          message: success
            ? "Resolução DNS concluída!"
            : "Falha na resolução DNS",
          details: success
            ? [
                `Domínio: ${params.domain || "example.com"}`,
                "IP: 93.184.216.34",
                "Tipo: A",
                "TTL: 3600",
                "Servidor DNS: 8.8.8.8",
              ]
            : [
                `Domínio: ${params.domain || "example.com"}`,
                "NXDOMAIN - Domínio não encontrado",
              ],
        };

      case "http-headers":
        return {
          success,
          message: success
            ? "Headers analisados com sucesso!"
            : "Erro na requisição HTTP",
          details: success
            ? [
                `URL: ${params.url || "https://httpbin.org/get"}`,
                "Status: 200 OK",
                "Content-Type: application/json",
                "Server: nginx/1.18.0",
                "Cache-Control: no-cache",
                "X-Powered-By: Express",
              ]
            : [
                `URL: ${params.url || "https://httpbin.org/get"}`,
                "Status: 404 Not Found",
                "Recurso não encontrado",
              ],
        };

      case "ssl-check":
        return {
          success,
          message: success
            ? "Certificado SSL válido!"
            : "Problema no certificado SSL",
          details: success
            ? [
                `Host: ${params.host || "google.com"}`,
                "Certificado válido",
                "Emissor: Google Trust Services",
                "Válido até: 2024-12-31",
                "Algoritmo: RSA 2048 bits",
                "TLS 1.3 suportado",
              ]
            : [
                `Host: ${params.host || "google.com"}`,
                "Certificado expirado",
                "Conexão insegura",
              ],
        };

      case "load-test":
        return {
          success,
          message: success
            ? "Teste de carga concluído!"
            : "Servidor sobrecarregado",
          details: success
            ? [
                `URL: ${params.url || "https://httpbin.org/get"}`,
                `Requisições: ${params.requests || "100"}`,
                "Tempo médio: 245ms",
                "Taxa de sucesso: 98%",
                "RPS: 45.2",
                "Tempo total: 2.2s",
              ]
            : [
                `URL: ${params.url || "https://httpbin.org/get"}`,
                "Muitas requisições falharam",
                "Servidor pode estar sobrecarregado",
              ],
        };

      case "traceroute":
        return {
          success,
          message: success
            ? "Rota traçada com sucesso!"
            : "Falha no rastreamento",
          details: success
            ? [
                `Destino: ${params.host || "google.com"}`,
                "1. 192.168.1.1 (2ms)",
                "2. 10.0.0.1 (15ms)",
                "3. 172.16.1.1 (28ms)",
                "4. 8.8.8.8 (45ms)",
                `5. ${params.host || "google.com"} (52ms)`,
              ]
            : [
                `Destino: ${params.host || "google.com"}`,
                "Timeout em alguns hops",
                "Rota pode estar bloqueada",
              ],
        };

      default:
        return {
          success: false,
          message: "Experimento não implementado",
          details: ["Este experimento ainda não foi implementado"],
        };
    }
  };

  const renderExperimentForm = (experiment: Experiment) => {
    switch (experiment.id) {
      case "ping-test":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Host/IP de destino
              </label>
              <Input
                placeholder="google.com"
                value={experimentParams.host || ""}
                onChange={(e) =>
                  setExperimentParams((prev) => ({
                    ...prev,
                    host: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        );

      case "dns-lookup":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Domínio</label>
              <Input
                placeholder="example.com"
                value={experimentParams.domain || ""}
                onChange={(e) =>
                  setExperimentParams((prev) => ({
                    ...prev,
                    domain: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        );

      case "http-headers":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">URL</label>
              <Input
                placeholder="https://httpbin.org/get"
                value={experimentParams.url || ""}
                onChange={(e) =>
                  setExperimentParams((prev) => ({
                    ...prev,
                    url: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        );

      case "ssl-check":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Host</label>
              <Input
                placeholder="google.com"
                value={experimentParams.host || ""}
                onChange={(e) =>
                  setExperimentParams((prev) => ({
                    ...prev,
                    host: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        );

      case "load-test":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">URL</label>
              <Input
                placeholder="https://httpbin.org/get"
                value={experimentParams.url || ""}
                onChange={(e) =>
                  setExperimentParams((prev) => ({
                    ...prev,
                    url: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Número de requisições
              </label>
              <Select
                value={experimentParams.requests || "100"}
                onValueChange={(value) =>
                  setExperimentParams((prev) => ({ ...prev, requests: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="500">500</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "traceroute":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Host de destino
              </label>
              <Input
                placeholder="google.com"
                value={experimentParams.host || ""}
                onChange={(e) =>
                  setExperimentParams((prev) => ({
                    ...prev,
                    host: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        );

      default:
        return null;
    }
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
            <h1 className="text-3xl font-bold mb-2">
              🧪 Laboratório de Experimentos
            </h1>
            <p className="text-muted-foreground">
              Execute experimentos práticos de rede e web
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {completedExperiments.length}/{experiments.length} Completos
            </Badge>
          </div>
        </motion.div>

        {!selectedExperiment ? (
          /* Experiment List */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {experiments.map((experiment) => {
              const isCompleted = completedExperiments.includes(experiment.id);
              const IconComponent = experiment.icon;

              return (
                <motion.div
                  key={experiment.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                      isCompleted
                        ? "border-green-500 bg-green-50 dark:bg-green-950"
                        : ""
                    }`}
                    onClick={() => setSelectedExperiment(experiment)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-lg ${getCategoryColor(
                          experiment.category
                        )} flex items-center justify-center text-white`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>
                      {isCompleted && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>

                    <h3 className="text-lg font-semibold mb-2">
                      {experiment.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {experiment.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={getDifficultyColor(experiment.difficulty)}
                        >
                          {experiment.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          {experiment.estimatedTime}
                        </Badge>
                      </div>
                      <Badge variant="secondary">
                        +{experiment.xpReward} XP
                      </Badge>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          /* Experiment Detail */
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedExperiment(null);
                    setResult(null);
                    setExperimentParams({});
                  }}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar aos Experimentos
                </Button>

                <div className="flex items-center gap-2">
                  <Badge
                    className={getDifficultyColor(
                      selectedExperiment.difficulty
                    )}
                  >
                    {selectedExperiment.difficulty}
                  </Badge>
                  <Badge variant="secondary">
                    +{selectedExperiment.xpReward} XP
                  </Badge>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div
                  className={`w-16 h-16 rounded-lg ${getCategoryColor(
                    selectedExperiment.category
                  )} flex items-center justify-center text-white`}
                >
                  <selectedExperiment.icon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {selectedExperiment.title}
                  </h2>
                  <p className="text-muted-foreground mb-2">
                    {selectedExperiment.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Tempo estimado: {selectedExperiment.estimatedTime}
                    </span>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="setup" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="setup">Configuração</TabsTrigger>
                  <TabsTrigger value="results">Resultados</TabsTrigger>
                </TabsList>

                <TabsContent value="setup" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Parâmetros do Experimento
                    </h3>
                    {renderExperimentForm(selectedExperiment)}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => runExperiment(selectedExperiment)}
                      disabled={isRunning}
                      className="flex items-center gap-2"
                    >
                      {isRunning ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Executando...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Executar Experimento
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setResult(null);
                        setExperimentParams({});
                      }}
                      disabled={isRunning}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Limpar
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="results" className="space-y-6">
                  {result ? (
                    <div className="space-y-4">
                      <div
                        className={`p-4 rounded-lg border ${
                          result.success
                            ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                            : "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {result.success ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          )}
                          <span
                            className={`font-semibold ${
                              result.success
                                ? "text-green-700 dark:text-green-300"
                                : "text-red-700 dark:text-red-300"
                            }`}
                          >
                            {result.message}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Tempo de execução: {result.executionTime}ms
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Detalhes:</h4>
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                          <pre className="text-sm font-mono whitespace-pre-wrap">
                            {result.details.join("\n")}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Info className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Execute o experimento para ver os resultados aqui</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
