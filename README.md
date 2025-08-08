# IOOR - Descontruindo a Web 🌐

> Uma jornada interativa e gamificada para aprender os fundamentos das requisições web

## 📖 Sobre o Projeto

IOOR é uma aplicação educacional interativa que ensina os conceitos fundamentais de como a web funciona, desde o momento em que você digita uma URL até a renderização da página no navegador. Através de uma experiência gamificada, os usuários podem explorar cada etapa do processo de requisição HTTP de forma visual e envolvente.

## ✨ Funcionalidades Principais

### 🎯 Sistema de Missões
- **7 Missões Progressivas**: Cada etapa do processo de requisição web
  1. Digite a URL
  2. Resolução DNS
  3. Conexão TCP
  4. Requisição HTTP
  5. Processamento no Servidor
  6. Resposta HTTP
  7. Renderização no Navegador

### 📚 Módulos Educacionais
- **Fundamentos**: Biblioteca completa de conceitos de rede
  - Modelo OSI e TCP/IP
  - Protocolos (HTTP/HTTPS, DNS, TCP/UDP)
  - Segurança de rede e TLS/SSL
  - Performance e otimização
- **Glossário Interativo**: Dicionário técnico com explicações detalhadas
- **Quizzes**: Avaliações para testar conhecimentos adquiridos

### 🛠️ Ferramentas Práticas
- **Laboratório de Experimentos**: Simulações práticas de conceitos
- **Criador de APIs**: Ferramenta para criar e testar APIs REST
- **Chat Educacional**: Assistente para tirar dúvidas
- **Modo Desafio**: Testes cronometrados para diferentes níveis

### 🎮 Sistema de Gamificação
- **Sistema de XP e Níveis**: Progressão baseada em conquistas
- **Conquistas e Badges**: Reconhecimento por marcos alcançados
- **Leaderboard**: Ranking de usuários
- **Histórico de Performance**: Acompanhamento do progresso

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool e dev server
- **Tailwind CSS 4** - Framework CSS utilitário
- **Framer Motion** - Animações e transições

### UI/UX
- **Radix UI** - Componentes acessíveis e customizáveis
  - Progress, Scroll Area, Select, Slider, Switch, Tabs
- **Lucide React** - Ícones modernos e consistentes
- **Class Variance Authority** - Gerenciamento de variantes de componentes
- **Tailwind Merge** - Otimização de classes CSS

### Desenvolvimento
- **ESLint** - Linting e qualidade de código
- **TypeScript ESLint** - Regras específicas para TypeScript

## 📁 Estrutura do Projeto

```
ioor/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── ui/                    # Componentes base (shadcn/ui)
│   │   ├── utils/                 # Utilitários e constantes
│   │   ├── APICreator.tsx         # Criador de APIs
│   │   ├── ChallengeMode.tsx      # Modo desafio
│   │   ├── ChatScreen.tsx         # Chat educacional
│   │   ├── FundamentalsScreen.tsx # Biblioteca de fundamentos
│   │   ├── GlossaryScreen.tsx     # Glossário técnico
│   │   ├── LabScreen.tsx          # Laboratório de experimentos
│   │   ├── LeaderboardScreen.tsx  # Ranking de usuários
│   │   ├── MissionScreen.tsx      # Tela de missões
│   │   ├── PerformanceHistory.tsx # Histórico de performance
│   │   ├── ProgressMap.tsx        # Mapa de progresso
│   │   ├── QuizScreen.tsx         # Sistema de quizzes
│   │   ├── SettingsScreen.tsx     # Configurações
│   │   ├── UserProgress.tsx       # Progresso do usuário
│   │   └── WelcomeScreen.tsx      # Tela de boas-vindas
│   ├── lib/                       # Utilitários gerais
│   ├── App.tsx                    # Componente principal
│   ├── main.tsx                   # Ponto de entrada
│   └── index.css                  # Estilos globais
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Passos para instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/ioor.git
   cd ioor
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o projeto em modo de desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Acesse a aplicação**
   - Abra seu navegador em `http://localhost:5173`

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Gera build de produção
npm run preview      # Preview do build de produção

# Qualidade de código
npm run lint         # Executa ESLint
```

## 🎯 Como Usar

### Para Iniciantes
1. **Comece pela Tela de Boas-vindas**: Entenda o propósito da aplicação
2. **Explore os Fundamentos**: Leia sobre conceitos básicos de rede
3. **Inicie as Missões**: Siga a sequência progressiva de aprendizado
4. **Faça os Quizzes**: Teste seus conhecimentos após cada missão

### Para Usuários Avançados
1. **Modo Desafio**: Teste seus conhecimentos com tempo limitado
2. **Laboratório**: Experimente com simulações práticas
3. **Criador de APIs**: Pratique criando e testando APIs
4. **Leaderboard**: Compare seu progresso com outros usuários

## 🎮 Sistema de Progressão

### Pontuação XP
- **Missão Completa**: 100 XP
- **Quiz Perfeito (90-100%)**: 200 XP
- **Quiz Excelente (80-89%)**: 150 XP
- **Quiz Bom (70-79%)**: 100 XP
- **Desafio Completo**: 150 XP
- **API Criada**: 25 XP
- **Experimento Executado**: 15 XP

### Conquistas
- Completar todas as missões
- Obter pontuação perfeita em quizzes
- Completar desafios em tempo recorde
- Criar múltiplas APIs
- Explorar todos os fundamentos

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Daniel Nascimento**
- GitHub: [@DanielNascimento00](https://github.com/DanielNascimento00)
- Email: danielsnascimento00@gmail.com

## 🙏 Agradecimentos

- [Radix UI](https://www.radix-ui.com/) pelos componentes acessíveis
- [Tailwind CSS](https://tailwindcss.com/) pelo framework CSS
- [Framer Motion](https://www.framer.com/motion/) pelas animações
- [Lucide](https://lucide.dev/) pelos ícones
- [Vite](https://vitejs.dev/) pela ferramenta de build

---

<div align="center">
  <p>Feito com ❤️ para democratizar o conhecimento sobre a web</p>
  <p>⭐ Se este projeto te ajudou, considere dar uma estrela!</p>
</div>

Este projeto serviu de base para as conquistas do github
