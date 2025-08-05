import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Play, RotateCcw } from 'lucide-react';

interface MissionSimulatorProps {
  missionIndex: number;
  onComplete: () => void;
}

export function MissionSimulator({ missionIndex, onComplete }: MissionSimulatorProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const simulations = [
    // Missão 0: Digite a URL
    {
      steps: [
        { text: "Usuário abre o navegador", element: "browser" },
        { text: "Digita 'www.exemplo.com' na barra de endereço", element: "typing" },
        { text: "Pressiona Enter", element: "enter" }
      ],
      elements: ["browser", "typing", "enter"]
    },
    // Missão 1: DNS Resolution
    {
      steps: [
        { text: "Navegador precisa encontrar o IP", element: "browser" },
        { text: "Consulta o servidor DNS", element: "dns" },
        { text: "DNS retorna IP: 192.168.1.1", element: "ip" }
      ],
      elements: ["browser", "dns", "ip"]
    },
    // Missão 2: TCP Connection
    {
      steps: [
        { text: "Cliente envia SYN", element: "syn" },
        { text: "Servidor responde SYN-ACK", element: "synack" },
        { text: "Cliente confirma com ACK", element: "ack" }
      ],
      elements: ["syn", "synack", "ack"]
    },
    // Missão 3: HTTP Request
    {
      steps: [
        { text: "Monta requisição HTTP", element: "request" },
        { text: "Adiciona headers", element: "headers" },
        { text: "Envia para o servidor", element: "send" }
      ],
      elements: ["request", "headers", "send"]
    },
    // Missão 4: Server Processing
    {
      steps: [
        { text: "Servidor recebe requisição", element: "receive" },
        { text: "Processa a solicitação", element: "process" },
        { text: "Prepara resposta", element: "prepare" }
      ],
      elements: ["receive", "process", "prepare"]
    },
    // Missão 5: HTTP Response
    {
      steps: [
        { text: "Servidor monta resposta", element: "response" },
        { text: "Adiciona status code (200 OK)", element: "status" },
        { text: "Envia dados de volta", element: "return" }
      ],
      elements: ["response", "status", "return"]
    },
    // Missão 6: Browser Rendering
    {
      steps: [
        { text: "Navegador recebe HTML", element: "html" },
        { text: "Constrói DOM", element: "dom" },
        { text: "Renderiza página", element: "render" }
      ],
      elements: ["html", "dom", "render"]
    }
  ];

  const currentSimulation = simulations[missionIndex];

  useEffect(() => {
    if (isPlaying && currentStep < currentSimulation.steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (isPlaying && currentStep >= currentSimulation.steps.length) {
      setIsComplete(true);
      setIsPlaying(false);
      onComplete();
    }
  }, [isPlaying, currentStep, currentSimulation.steps.length, onComplete]);

  const startSimulation = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    setIsComplete(false);
  };

  const resetSimulation = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setIsComplete(false);
  };

  const renderVisualization = () => {
    switch (missionIndex) {
      case 0: // URL Input
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-80 h-48 bg-gray-100 dark:bg-gray-800 rounded-lg border-4 border-gray-300 relative"
            >
              <div className="absolute top-4 left-4 right-4 h-8 bg-white dark:bg-gray-700 rounded border-2 flex items-center px-3">
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: currentStep >= 1 ? "auto" : 0 }}
                  className="text-sm text-gray-600 dark:text-gray-300 overflow-hidden"
                >
                  {currentStep >= 1 ? "www.exemplo.com" : ""}
                </motion.span>
                {currentStep >= 1 && currentStep < 2 && (
                  <motion.div
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-0.5 h-4 bg-blue-500 ml-1"
                  />
                )}
              </div>
              {currentStep >= 2 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute bottom-4 right-4 w-16 h-8 bg-blue-500 rounded text-white flex items-center justify-center text-xs"
                >
                  Enter
                </motion.div>
              )}
            </motion.div>
          </div>
        );

      case 1: // DNS Resolution
        return (
          <div className="flex items-center justify-between h-full px-8">
            <motion.div
              className="w-24 h-24 bg-blue-500 rounded-lg flex items-center justify-center text-white text-2xl"
              animate={currentStep >= 1 ? { x: [0, 50, 0] } : {}}
              transition={{ duration: 1 }}
            >
              🌐
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: currentStep >= 1 ? 1 : 0 }}
              className="flex-1 flex justify-center"
            >
              <div className="w-2 h-24 bg-gradient-to-r from-blue-500 to-green-500 rounded">
                <motion.div
                  className="w-4 h-4 bg-yellow-500 rounded-full -ml-1"
                  animate={{ y: [0, 80, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>

            <motion.div
              className="w-24 h-24 bg-green-500 rounded-lg flex items-center justify-center text-white text-2xl"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: currentStep >= 1 ? 1 : 0.5 }}
            >
              📋
            </motion.div>

            {currentStep >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-green-100 dark:bg-green-900 px-4 py-2 rounded-lg"
              >
                IP: 192.168.1.1
              </motion.div>
            )}
          </div>
        );

      case 2: // TCP Handshake
        return (
          <div className="flex items-center justify-between h-full px-8">
            <div className="text-center">
              <motion.div
                className="w-24 h-24 bg-blue-500 rounded-lg flex items-center justify-center text-white text-2xl mb-4"
                animate={currentStep >= 0 ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, delay: 0 }}
              >
                💻
              </motion.div>
              <span className="text-sm">Cliente</span>
            </div>

            <div className="flex-1 flex flex-col items-center space-y-4">
              {currentStep >= 0 && (
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded text-sm"
                >
                  SYN →
                </motion.div>
              )}
              {currentStep >= 1 && (
                <motion.div
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="bg-yellow-100 dark:bg-yellow-900 px-3 py-1 rounded text-sm"
                >
                  ← SYN-ACK
                </motion.div>
              )}
              {currentStep >= 2 && (
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="bg-green-100 dark:bg-green-900 px-3 py-1 rounded text-sm"
                >
                  ACK →
                </motion.div>
              )}
            </div>

            <div className="text-center">
              <motion.div
                className="w-24 h-24 bg-green-500 rounded-lg flex items-center justify-center text-white text-2xl mb-4"
                animate={currentStep >= 1 ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, delay: 1 }}
              >
                🖥️
              </motion.div>
              <span className="text-sm">Servidor</span>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative">
        {renderVisualization()}
        
        {/* Step indicator */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-lg p-3">
            <div className="text-sm text-center mb-2">
              {currentStep > 0 && currentStep <= currentSimulation.steps.length
                ? currentSimulation.steps[currentStep - 1].text
                : "Pronto para começar"}
            </div>
            <div className="flex space-x-2">
              {currentSimulation.steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded ${
                    index < currentStep
                      ? "bg-green-500"
                      : index === currentStep
                      ? "bg-blue-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-4">
        {!isPlaying && !isComplete && (
          <Button onClick={startSimulation} className="bg-gradient-to-r from-blue-500 to-purple-600">
            <Play className="w-4 h-4 mr-2" />
            Iniciar Simulação
          </Button>
        )}
        
        {(isComplete || currentStep > 0) && (
          <Button onClick={resetSimulation} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reiniciar
          </Button>
        )}
      </div>
    </div>
  );
}