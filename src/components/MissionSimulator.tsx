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
          <div className="flex flex-col items-center justify-center h-full space-y-4 p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md h-32 sm:h-40 md:h-48 bg-gray-100 dark:bg-gray-800 rounded-lg border-4 border-gray-300 relative"
            >
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 h-6 sm:h-8 bg-white dark:bg-gray-700 rounded border-2 flex items-center px-2 sm:px-3">
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: currentStep >= 1 ? "auto" : 0 }}
                  className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 overflow-hidden"
                >
                  {currentStep >= 1 ? "www.exemplo.com" : ""}
                </motion.span>
                {currentStep >= 1 && currentStep < 2 && (
                  <motion.div
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-0.5 h-3 sm:h-4 bg-blue-500 ml-1"
                  />
                )}
              </div>
              {currentStep >= 2 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 w-12 sm:w-16 h-6 sm:h-8 bg-blue-500 rounded text-white flex items-center justify-center text-xs"
                >
                  Enter
                </motion.div>
              )}
            </motion.div>
          </div>
        );

      case 1: // DNS Resolution
        return (
          <div className="flex items-center justify-between h-full px-4 sm:px-8">
            <motion.div
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-blue-500 rounded-lg flex items-center justify-center text-white text-lg sm:text-xl md:text-2xl flex-shrink-0"
              animate={currentStep >= 1 ? { x: [0, 20, 0] } : {}}
              transition={{ duration: 1 }}
            >
              🌐
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: currentStep >= 1 ? 1 : 0 }}
              className="flex-1 flex justify-center mx-4"
            >
              <div className="w-2 h-16 sm:h-20 md:h-24 bg-gradient-to-r from-blue-500 to-green-500 rounded relative">
                <motion.div
                  className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 rounded-full absolute -left-0.5 sm:-left-1"
                  animate={{ y: [0, 48, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>

            <motion.div
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-green-500 rounded-lg flex items-center justify-center text-white text-lg sm:text-xl md:text-2xl flex-shrink-0"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: currentStep >= 1 ? 1 : 0.5 }}
            >
              📋
            </motion.div>

            {currentStep >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 bg-green-100 dark:bg-green-900 px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-sm"
              >
                IP: 192.168.1.1
              </motion.div>
            )}
          </div>
        );

      case 2: // TCP Handshake
        return (
          <div className="flex items-center justify-between h-full px-4 sm:px-8">
            <div className="text-center flex-shrink-0">
              <motion.div
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-blue-500 rounded-lg flex items-center justify-center text-white text-lg sm:text-xl md:text-2xl mb-2 sm:mb-4"
                animate={currentStep >= 0 ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, delay: 0 }}
              >
                💻
              </motion.div>
              <span className="text-xs sm:text-sm">Cliente</span>
            </div>

            <div className="flex-1 flex flex-col items-center space-y-2 sm:space-y-4 mx-4">
              {currentStep >= 0 && (
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="bg-blue-100 dark:bg-blue-900 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm whitespace-nowrap"
                >
                  SYN →
                </motion.div>
              )}
              {currentStep >= 1 && (
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="bg-yellow-100 dark:bg-yellow-900 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm whitespace-nowrap"
                >
                  ← SYN-ACK
                </motion.div>
              )}
              {currentStep >= 2 && (
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="bg-green-100 dark:bg-green-900 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm whitespace-nowrap"
                >
                  ACK →
                </motion.div>
              )}
            </div>

            <div className="text-center flex-shrink-0">
              <motion.div
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-green-500 rounded-lg flex items-center justify-center text-white text-lg sm:text-xl md:text-2xl mb-2 sm:mb-4"
                animate={currentStep >= 1 ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, delay: 1 }}
              >
                🖥️
              </motion.div>
              <span className="text-xs sm:text-sm">Servidor</span>
            </div>
          </div>
        );

      case 3: // HTTP Request
        return (
          <div className="flex flex-col items-center justify-center h-full p-4 space-y-4">
            <div className="flex items-center justify-between w-full max-w-lg">
              <motion.div
                className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-500 rounded-lg flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0"
                animate={currentStep >= 0 ? { scale: [1, 1.1, 1] } : {}}
              >
                💻
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: currentStep >= 1 ? 1 : 0, scale: currentStep >= 1 ? 1 : 0.8 }}
                className="flex-1 mx-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-3 sm:p-4"
              >
                <div className="text-xs sm:text-sm font-mono">
                  {currentStep >= 0 && <div className="text-blue-600 dark:text-blue-400">GET /index.html HTTP/1.1</div>}
                  {currentStep >= 1 && <div className="text-green-600 dark:text-green-400">Host: www.exemplo.com</div>}
                  {currentStep >= 1 && <div className="text-green-600 dark:text-green-400">User-Agent: Browser/1.0</div>}
                  {currentStep >= 2 && <div className="text-purple-600 dark:text-purple-400">Accept: text/html</div>}
                </div>
              </motion.div>
              
              <motion.div
                className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-lg flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0"
                animate={currentStep >= 2 ? { scale: [1, 1.1, 1] } : {}}
              >
                🖥️
              </motion.div>
            </div>
            
            {currentStep >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-100 dark:bg-blue-900 px-3 sm:px-4 py-2 rounded-lg text-sm"
              >
                Requisição enviada com sucesso!
              </motion.div>
            )}
          </div>
        );

      case 4: // Server Processing
        return (
          <div className="flex flex-col items-center justify-center h-full p-4 space-y-6">
            <motion.div
              className="w-20 h-20 sm:w-24 sm:h-24 bg-green-500 rounded-lg flex items-center justify-center text-white text-2xl sm:text-3xl"
              animate={currentStep >= 0 ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              🖥️
            </motion.div>
            
            <div className="flex flex-col space-y-3 w-full max-w-sm">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: currentStep >= 0 ? 1 : 0, x: currentStep >= 0 ? 0 : -20 }}
                className={`p-3 rounded-lg text-sm ${
                  currentStep >= 0 ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800'
                }`}
              >
                📥 Recebendo requisição...
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: currentStep >= 1 ? 1 : 0, x: currentStep >= 1 ? 0 : -20 }}
                className={`p-3 rounded-lg text-sm ${
                  currentStep >= 1 ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-gray-100 dark:bg-gray-800'
                }`}
              >
                ⚙️ Processando dados...
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: currentStep >= 2 ? 1 : 0, x: currentStep >= 2 ? 0 : -20 }}
                className={`p-3 rounded-lg text-sm ${
                  currentStep >= 2 ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-800'
                }`}
              >
                📦 Preparando resposta...
              </motion.div>
            </div>
          </div>
        );

      case 5: // HTTP Response
        return (
          <div className="flex flex-col items-center justify-center h-full p-4 space-y-4">
            <div className="flex items-center justify-between w-full max-w-lg">
              <motion.div
                className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-lg flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0"
                animate={currentStep >= 0 ? { scale: [1, 1.1, 1] } : {}}
              >
                🖥️
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: currentStep >= 1 ? 1 : 0, scale: currentStep >= 1 ? 1 : 0.8 }}
                className="flex-1 mx-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-3 sm:p-4"
              >
                <div className="text-xs sm:text-sm font-mono">
                  {currentStep >= 0 && <div className="text-green-600 dark:text-green-400">HTTP/1.1 200 OK</div>}
                  {currentStep >= 1 && <div className="text-blue-600 dark:text-blue-400">Content-Type: text/html</div>}
                  {currentStep >= 1 && <div className="text-blue-600 dark:text-blue-400">Content-Length: 1024</div>}
                  {currentStep >= 2 && <div className="text-purple-600 dark:text-purple-400">&lt;html&gt;&lt;body&gt;...&lt;/body&gt;&lt;/html&gt;</div>}
                </div>
              </motion.div>
              
              <motion.div
                className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-500 rounded-lg flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0"
                animate={currentStep >= 2 ? { scale: [1, 1.1, 1] } : {}}
              >
                💻
              </motion.div>
            </div>
            
            {currentStep >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-100 dark:bg-green-900 px-3 sm:px-4 py-2 rounded-lg text-sm"
              >
                Resposta recebida com sucesso!
              </motion.div>
            )}
          </div>
        );

      case 6: // Browser Rendering
        return (
          <div className="flex flex-col items-center justify-center h-full p-4 space-y-6">
            <motion.div
              className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-500 rounded-lg flex items-center justify-center text-white text-2xl sm:text-3xl"
              animate={currentStep >= 0 ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              🌐
            </motion.div>
            
            <div className="w-full max-w-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: currentStep >= 0 ? 1 : 0, scale: currentStep >= 0 ? 1 : 0.8 }}
                className="bg-white dark:bg-gray-800 border-4 border-gray-300 dark:border-gray-600 rounded-lg p-4 min-h-32"
              >
                {currentStep >= 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs sm:text-sm text-gray-500 mb-2"
                  >
                    Parsing HTML...
                  </motion.div>
                )}
                
                {currentStep >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <div className="h-4 bg-blue-200 dark:bg-blue-800 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </motion.div>
                )}
                
                {currentStep >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-2 bg-green-100 dark:bg-green-900 rounded text-xs sm:text-sm text-center"
                  >
                    🎉 Página renderizada!
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full p-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 sm:w-16 sm:h-16 border-3 sm:border-4 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex-1 relative min-h-0 overflow-hidden">
        {renderVisualization()}
        
        {/* Step indicator */}
        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-lg p-2 sm:p-3">
            <div className="text-xs sm:text-sm text-center mb-2">
              {currentStep > 0 && currentStep <= currentSimulation.steps.length
                ? currentSimulation.steps[currentStep - 1].text
                : "Pronto para começar"}
            </div>
            <div className="flex space-x-1 sm:space-x-2">
              {currentSimulation.steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 sm:h-2 flex-1 rounded ${
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

      <div className="flex justify-center gap-2 sm:gap-4 mt-2 sm:mt-4 p-2 sm:p-0">
        {!isPlaying && !isComplete && (
          <Button onClick={startSimulation} className="bg-gradient-to-r from-blue-500 to-purple-600 text-sm sm:text-base">
            <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Iniciar Simulação
          </Button>
        )}
        
        {(isComplete || currentStep > 0) && (
          <Button onClick={resetSimulation} variant="outline" className="text-sm sm:text-base">
            <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Reiniciar
          </Button>
        )}
      </div>
    </div>
  );
}