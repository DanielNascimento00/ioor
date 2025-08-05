export const MISSIONS = [
  {
    id: 0,
    title: "1. Digite a URL",
    description: "O usuário digita uma URL no navegador",
    character: "🌐",
    color: "from-green-400 to-green-600",
    hasQuiz: false
  },
  {
    id: 1,
    title: "2. Resolução DNS",
    description: "DNS resolve o nome do domínio para um endereço IP",
    character: "📋",
    color: "from-blue-400 to-blue-600",
    hasQuiz: false
  },
  {
    id: 2,
    title: "3. Conexão TCP",
    description: "Estabelece conexão TCP com o servidor (3-way handshake)",
    character: "🤝",
    color: "from-purple-400 to-purple-600",
    hasQuiz: true
  },
  {
    id: 3,
    title: "4. Requisição HTTP",
    description: "Envia a requisição HTTP para o servidor",
    character: "📦",
    color: "from-orange-400 to-orange-600",
    hasQuiz: true
  },
  {
    id: 4,
    title: "5. Processamento",
    description: "Servidor processa a requisição e prepara resposta",
    character: "⚙️",
    color: "from-red-400 to-red-600",
    hasQuiz: true
  },
  {
    id: 5,
    title: "6. Resposta HTTP",
    description: "Servidor envia resposta de volta para o navegador",
    character: "📨",
    color: "from-indigo-400 to-indigo-600",
    hasQuiz: true
  },
  {
    id: 6,
    title: "7. Renderização",
    description: "Navegador renderiza o conteúdo da página",
    character: "🎨",
    color: "from-pink-400 to-pink-600",
    hasQuiz: true
  }
];

export const DIFFICULTY_COLORS = {
  easy: 'bg-green-500',
  medium: 'bg-yellow-500',
  hard: 'bg-red-500',
  beginner: 'bg-green-500',
  intermediate: 'bg-yellow-500',
  advanced: 'bg-red-500'
};

export const METHOD_COLORS = {
  GET: 'bg-blue-500',
  POST: 'bg-green-500',
  PUT: 'bg-yellow-500',
  DELETE: 'bg-red-500'
};

export const CATEGORY_COLORS = {
  performance: 'bg-blue-500',
  security: 'bg-red-500',
  protocols: 'bg-green-500',
  errors: 'bg-yellow-500',
  http: 'bg-orange-500',
  general: 'bg-purple-500'
};

export const XP_REWARDS = {
  MISSION_COMPLETE: 100,
  QUIZ_PERFECT: 200,      // 90-100%
  QUIZ_EXCELLENT: 150,    // 80-89%
  QUIZ_GOOD: 100,         // 70-79%
  QUIZ_FAIR: 75,          // 60-69%
  QUIZ_PASS: 50,          // Below 60%
  CHALLENGE_COMPLETE: 150,
  API_CREATED: 25,
  EXPERIMENT_RUN: 15
};

export const QUIZ_REQUIREMENTS = {
  // Missions that require quiz completion to unlock next mission
  REQUIRED_FOR_PROGRESSION: [2, 3, 4, 5, 6],
  // Minimum score required to pass (percentage)
  PASSING_SCORE: 60,
  // Missions that have quizzes available
  AVAILABLE_QUIZZES: [0, 1, 2, 3, 4, 5, 6]
};