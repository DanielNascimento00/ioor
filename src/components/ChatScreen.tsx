import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { ArrowLeft, Send, Bot, User } from 'lucide-react';

interface ChatScreenProps {
  onNavigate: (screen: 'mission' | 'map') => void;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const predefinedResponses: Record<string, string> = {
  'dns': 'O DNS (Domain Name System) é como uma agenda telefônica da internet! Quando você digita "google.com", o DNS traduz isso para um endereço IP como "172.217.14.196" que os computadores conseguem entender. É um sistema distribuído com vários níveis de servidores.',
  'tcp': 'O TCP é um protocolo de transporte confiável. O "3-way handshake" funciona assim: 1) Cliente envia SYN (vamos conversar?), 2) Servidor responde SYN-ACK (ok, vamos!), 3) Cliente confirma com ACK (perfeito!). Só depois disso os dados podem fluir.',
  'http': 'HTTP é o protocolo da web! É como uma linguagem que navegadores e servidores usam para conversar. Uma requisição HTTP tem método (GET, POST), URL, headers (metadados) e às vezes um body (dados). A resposta tem status code (200 = sucesso, 404 = não encontrado) e os dados solicitados.',
  'servidor': 'O servidor web é como um garçom super eficiente! Ele recebe seu pedido (requisição), vai buscar na cozinha (banco de dados), processa tudo e traz exatamente o que você pediu. Pode servir arquivos estáticos (HTML, CSS) ou gerar conteúdo dinamicamente.',
  'renderização': 'A renderização é o show final! O navegador pega o HTML e constrói uma árvore (DOM), aplica os estilos (CSS), executa o JavaScript, e pinta tudo na tela. É como montar um quebra-cabeças onde cada peça tem sua função.',
  'default': 'Essa é uma ótima pergunta! 🤖 Como DevBot, posso explicar qualquer conceito de desenvolvimento web. Tente perguntar sobre: DNS, TCP, HTTP, servidores, renderização, APIs, cookies, HTTPS, ou qualquer outro tópico relacionado!'
};

export function ChatScreen({ onNavigate }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Eu sou o DevBot, seu assistente para questões sobre desenvolvimento web! 🤖 Como posso ajudar você hoje?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    'Como funciona o DNS?',
    'O que é o handshake TCP?',
    'Explique uma requisição HTTP',
    'Como o servidor processa dados?',
    'O que acontece na renderização?'
  ];

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (key !== 'default' && lowerMessage.includes(key)) {
        return response;
      }
    }
    
    return predefinedResponses.default;
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateBotResponse(content),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => onNavigate('map')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Mapa
          </Button>

          <div className="text-center">
            <div className="flex items-center gap-2 justify-center mb-2">
              <Bot className="w-6 h-6 text-blue-500" />
              <h1 className="text-2xl">DevBot Assistant</h1>
            </div>
            <p className="text-muted-foreground">
              Tire suas dúvidas sobre desenvolvimento web
            </p>
          </div>

          <div className="w-24"></div>
        </motion.div>

        {/* Chat Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 lg:grid-cols-4 gap-6"
        >
          {/* Messages */}
          <Card className="lg:col-span-3 p-6 h-[600px] flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.sender === 'bot' && (
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>

                    {message.sender === 'user' && (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="mt-4 flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Digite sua pergunta..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                className="flex-1"
              />
              <Button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Quick Questions */}
          <Card className="p-6">
            <h3 className="mb-4">Perguntas Rápidas</h3>
            <div className="space-y-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleQuickQuestion(question)}
                  className="w-full text-left text-sm p-3 h-auto justify-start"
                  disabled={isTyping}
                >
                  {question}
                </Button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                💡 <strong>Dica:</strong> Faça perguntas específicas para obter explicações mais detalhadas!
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}