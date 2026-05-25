import { useState, useEffect } from 'react';
import { GameLayout } from '../components/templates/GameLayout';
import { GameHeader } from '../components/organisms/GameHeader';
import { Scoreboard } from '../components/organisms/Scoreboard';
import { BoardGrid } from '../components/organisms/BoardGrid';
import { SidebarChallenges } from '../components/organisms/SidebarChallenges';
import { RobotDialog } from '../components/organisms/RobotDialog';
import { TipPanel } from '../components/molecules/TipPanel';
import { Button } from '../components/atoms/Button';
import { Slider } from '../components/atoms/Slider';
import { conceptsData, codingTips } from '../data/concepts';
import { sound } from '../services/sound';
import { HelpCircle, Lightbulb, Search } from 'lucide-react';

export const GamePage = () => {
  // -------------------------------------------------------------
  // ESTADOS DEL JUEGO GENERAL
  // -------------------------------------------------------------
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState('basic');
  const [pairsCount, setPairsCount] = useState(12);
  const [playerNames, setPlayerNames] = useState(['PEPITO', 'JUANITA']);
  
  // Jugadores y Turnos
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [leaderId, setLeaderId] = useState(null);

  // Tablero de Cartas
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [lockBoard, setLockBoard] = useState(false);
  const [globalMatches, setGlobalMatches] = useState(0);
  
  // Desafíos alcanzados
  const [challengesState, setChallengesState] = useState({ ch3: false, chHalf: false, chAll: false });
  const [showVictoryModal, setShowVictoryModal] = useState(false);

  // Ayudas/Comodines
  const [hintsLeft, setHintsLeft] = useState(5);
  const [tipsLeft, setTipsLeft] = useState(3);

  // Mascota Robot Estado
  const [robotDialog, setRobotDialog] = useState({
    title: '¡Hola! 🤖',
    message: 'Escribí el nombre de los jugadores, elegí el nivel y cuántas parejas querés buscar para empezar.',
    expression: 'happy'
  });

  // Audio Config
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [sfxEnabled, setSfxEnabled] = useState(true);

  // Tip de código rotativo
  const [tipIndex, setTipIndex] = useState(0);

  // Accesibilidad: Tema Claro/Sensorial
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('codememory_theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  // -------------------------------------------------------------
  // PERFIL DEL USUARIO E HISTORIAL (Persistente en localStorage)
  // -------------------------------------------------------------
  // Lazy load initial stats from localStorage to prevent synchronous setState inside useEffect
  const [playerXP, setPlayerXP] = useState(() => {
    try {
      const saved = localStorage.getItem('codememory_stats');
      return saved ? JSON.parse(saved).xp || 0 : 0;
    } catch {
      return 0;
    }
  });

  const [playerLevel, setPlayerLevel] = useState(() => {
    try {
      const saved = localStorage.getItem('codememory_stats');
      return saved ? JSON.parse(saved).level || 1 : 1;
    } catch {
      return 1;
    }
  });

  const [streakCount, setStreakCount] = useState(() => {
    try {
      const saved = localStorage.getItem('codememory_stats');
      return saved ? JSON.parse(saved).streak || 0 : 0;
    } catch {
      return 0;
    }
  });

  const [weeklyActivity, setWeeklyActivity] = useState(() => {
    try {
      const saved = localStorage.getItem('codememory_stats');
      return saved ? JSON.parse(saved).weeklyActivity || [false, false, false, false, false, false, false] : [false, false, false, false, false, false, false];
    } catch {
      return [false, false, false, false, false, false, false];
    }
  });

  const avatars = ['😎', '🦄', '👾', '🦊'];

  // Cargar estadísticas locales al montar el componente
  useEffect(() => {
    // Inicializar sonido por defecto
    sound.setSoundEnabled(sfxEnabled);
    sound.setMusicEnabled(musicEnabled);
  }, [sfxEnabled, musicEnabled]);

  // Accesibilidad: Sincronizar tema con body de HTML
  useEffect(() => {
    try {
      document.body.classList.toggle('light-theme', theme === 'light');
      localStorage.setItem('codememory_theme', theme);
    } catch (e) {
      console.error("Error guardando tema:", e);
    }
  }, [theme]);

  // Rotador de tips automático cada 8 segundos
  useEffect(() => {
    if (!gameStarted) return;
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % codingTips.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [gameStarted]);

  // Calcular racha en victoria
  const updateStreakAndXP = (xpEarned) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Obtener información previa
    let currentStreak = streakCount;
    let activity = [...weeklyActivity];
    
    // Buscar fecha del último juego guardada
    let lastPlayed = '';
    try {
      const savedStats = localStorage.getItem('codememory_stats');
      if (savedStats) {
        const stats = JSON.parse(savedStats);
        lastPlayed = stats.lastPlayedDate || '';
      }
    } catch {
      // Ignorar error de carga
    }

    // Calcular racha
    if (lastPlayed !== todayStr) {
      // Si jugó ayer, incrementamos
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastPlayed === yesterdayStr) {
        currentStreak += 1;
      } else if (lastPlayed === '') {
        currentStreak = 1;
      } else {
        currentStreak = 1; // Racha rota, reinicia a 1
      }
      
      // Marcar día actual de la semana en la UI (0 = Domingo, 1 = Lunes, etc.)
      const dayIndex = (today.getDay() + 6) % 7; // Lunes = 0, ..., Domingo = 6
      activity[dayIndex] = true;
    }

    setStreakCount(currentStreak);
    setWeeklyActivity(activity);

    // Sumar XP
    let newXP = playerXP + xpEarned;
    let newLvl = playerLevel;
    let nextLevelXP = playerLevel * 500;
    let leveledUp = false;

    while (newXP >= nextLevelXP) {
      newXP -= nextLevelXP;
      newLvl += 1;
      nextLevelXP = newLvl * 500;
      leveledUp = true;
    }

    setPlayerXP(newXP);
    setPlayerLevel(newLvl);

    // Guardar todo
    try {
      const statsObj = { 
        xp: newXP, 
        level: newLvl, 
        streak: currentStreak, 
        weeklyActivity: activity,
        lastPlayedDate: todayStr
      };
      localStorage.setItem('codememory_stats', JSON.stringify(statsObj));
    } catch {
      // Ignorar error de guardado
    }

    if (leveledUp) {
      setTimeout(() => {
        sound.playLevelUp();
        setRobotDialog({
          title: '¡Subiste de nivel! 🎉',
          message: `¡Buenísimo! Pasaste al nivel ${newLvl}. ¡Seguí así!`,
          expression: 'happy'
        });
      }, 1500);
    }
  };

  // -------------------------------------------------------------
  // MANEJO DE CONFIGURACIÓN DE JUGADORES
  // -------------------------------------------------------------
  const handleAddPlayer = () => {
    if (playerNames.length >= 4) {
      alert("¡El máximo es 4 jugadores!");
      return;
    }
    setPlayerNames([...playerNames, `JUGADOR ${playerNames.length + 1}`]);
  };

  const handleRemovePlayer = () => {
    if (playerNames.length > 1) {
      setPlayerNames(playerNames.slice(0, -1));
    }
  };

  const handleNameChange = (index, value) => {
    const updated = [...playerNames];
    updated[index] = value.toUpperCase();
    setPlayers(updated);
    setPlayerNames(updated);
  };

  // -------------------------------------------------------------
  // LÓGICA DE INICIO Y REINICIO DEL JUEGO
  // -------------------------------------------------------------
  const handleStartGame = () => {
    // Configurar jugadores
    const initialPlayers = playerNames.map((name, index) => ({
      id: index,
      name: name.trim() || `JUGADOR ${index + 1}`,
      score: 0,
      avatar: avatars[index],
      colorClass: `p-color-${index}`
    }));

    setPlayers(initialPlayers);
    setCurrentPlayerIndex(0);
    setLeaderId(null);
    setGlobalMatches(0);
    setFlippedIndices([]);
    setLockBoard(false);
    setChallengesState({ ch3: false, chHalf: false, chAll: false });
    setHintsLeft(5);
    setTipsLeft(3);
    setShowVictoryModal(false);

    // Seleccionar y barajar cartas de forma dinámica
    const pool = conceptsData[difficulty];
    const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
    const selectedConcepts = shuffledPool.slice(0, pairsCount);

    // Crear las parejas (Card A y Card B) según nivel
    const deck = [];
    selectedConcepts.forEach((concept) => {
      // Carta A: El Concepto siempre (emoji + título)
      deck.push({
        uniqueId: `A-${concept.id}`,
        conceptId: concept.id,
        icon: concept.icon,
        text: concept.text, // ej: "Variable"
        description: concept.description,
        isFlipped: false,
        isMatched: false,
        isConceptType: true
      });

      // Carta B: Idéntica a Carta A (como en el prototipo de backup)
      let cardBText = concept.text;
      let cardBIcon = concept.icon;

      deck.push({
        uniqueId: `B-${concept.id}`,
        conceptId: concept.id,
        icon: cardBIcon,
        text: cardBText,
        description: concept.description,
        isFlipped: false,
        isMatched: false,
        isConceptType: false
      });
    });

    // Mezclar el mazo final
    const shuffledDeck = deck.sort(() => Math.random() - 0.5);
    setCards(shuffledDeck);
    
    // Activar estados
    setGameStarted(true);
    setRobotDialog({
      title: `¡Empezamos! 🚀`,
      message: `Dificultad: ${difficulty === 'basic' ? 'Básico' : difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}. Juega primero ${initialPlayers[0].name}. ¡Mucha suerte!`,
      expression: 'happy'
    });

    // Iniciar sonido y reproducir música si corresponde
    sound.init();
    if (musicEnabled) {
      sound.startMusic();
    }
  };

  const handleRestart = () => {
    handleStartGame();
  };

  const handleExitToSetup = () => {
    setGameStarted(false);
    setShowVictoryModal(false);
    sound.stopMusic();
    setRobotDialog({
      title: '¡Hola! 🤖',
      message: 'Ingresá el nombre de los jugadores, elegí el nivel y cuántas parejas querés buscar para empezar.',
      expression: 'happy'
    });
  };

  // -------------------------------------------------------------
  // LÓGICA DE CLICKS Y VOLTEO DE CARTAS (MOTOR PRINCIPAL)
  // -------------------------------------------------------------
  const handleCardClick = (index) => {
    if (lockBoard) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;

    sound.playClick();
    
    // Voltear carta
    const updatedCards = [...cards];
    updatedCards[index].isFlipped = true;
    setCards(updatedCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    // Si es la primera carta volteada
    if (newFlipped.length === 1) {
      setRobotDialog({
        title: `Buscando pareja... 🧠`,
        message: `${players[currentPlayerIndex].name} dio vuelta "${cards[index].text}". ¿Dónde estará la otra?`,
        expression: 'thinking'
      });
      return;
    }

    // Si es la segunda carta volteada
    if (newFlipped.length === 2) {
      setLockBoard(true);
      checkForMatch(newFlipped[0], newFlipped[1]);
    }
  };

  // Comprobar coincidencia
  const checkForMatch = (idx1, idx2) => {
    const card1 = cards[idx1];
    const card2 = cards[idx2];
    const isMatch = card1.conceptId === card2.conceptId;

    if (isMatch) {
      setTimeout(() => {
        handleMatchSuccess(idx1, idx2);
      }, 600);
    } else {
      setTimeout(() => {
        handleMatchFailure(idx1, idx2);
      }, 1200);
    }
  };

  // Coincidencia Exitosa
  const handleMatchSuccess = (idx1, idx2) => {
    sound.playMatch();

    const updatedCards = [...cards];
    updatedCards[idx1].isMatched = true;
    updatedCards[idx2].isMatched = true;
    setCards(updatedCards);

    // Sumar puntaje al jugador actual
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex].score += 5;
    
    // Incrementar parejas encontradas
    const newGlobalMatches = globalMatches + 1;
    setGlobalMatches(newGlobalMatches);

    // Verificar y otorgar bonificaciones por desafíos
    const ch3Req = 3;
    const chHalfReq = Math.floor(pairsCount / 2);
    const chAllReq = pairsCount;
    
    const updatedChallenges = { ...challengesState };

    let challengeMsg = '';

    if (newGlobalMatches === ch3Req && !challengesState.ch3) {
      updatedPlayers[currentPlayerIndex].score += 10;
      updatedChallenges.ch3 = true;
      challengeMsg = ` ¡Y completó el desafío de 3 parejas (+10 pts)!`;
    }
    if (newGlobalMatches === chHalfReq && !challengesState.chHalf) {
      updatedPlayers[currentPlayerIndex].score += 20;
      updatedChallenges.chHalf = true;
      challengeMsg = ` ¡Y completó el desafío de la mitad (+20 pts)!`;
    }
    if (newGlobalMatches === chAllReq && !challengesState.chAll) {
      updatedPlayers[currentPlayerIndex].score += 50;
      updatedChallenges.chAll = true;
      challengeMsg = ` ¡Y completó el desafío maestro (+50 pts)!`;
    }

    setChallengesState(updatedChallenges);
    setPlayers(updatedPlayers);

    // Recalcular líder de la partida
    let highestScore = 0;
    let leader = null;
    updatedPlayers.forEach((p) => {
      if (p.score > highestScore) {
        highestScore = p.score;
        leader = p.id;
      }
    });
    setLeaderId(leader);

    // Obtener concepto y descripción para el robot
    const matchedConcept = conceptsData[difficulty].find(c => c.id === cards[idx1].conceptId);
    
    setRobotDialog({
      title: `¡Excelente acierto! 😍${challengeMsg}`,
      message: `Encontraste la pareja: ${matchedConcept.title} = ${matchedConcept.description}`,
      expression: 'happy'
    });

    setFlippedIndices([]);
    setLockBoard(false);

    // Comprobar si ganó la partida
    if (newGlobalMatches === pairsCount) {
      setTimeout(() => {
        handleVictory();
      }, 1000);
    }
  };

  // Coincidencia Fallida (Turno del siguiente)
  const handleMatchFailure = (idx1, idx2) => {
    sound.playMismatch();

    const updatedCards = [...cards];
    updatedCards[idx1].isFlipped = false;
    updatedCards[idx2].isFlipped = false;
    setCards(updatedCards);

    // Cambiar de turno al siguiente jugador
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextPlayerIndex);

    setRobotDialog({
      title: `¡No coincide! 😢`,
      message: `Las cartas no son iguales. Ahora juega ${players[nextPlayerIndex].name}. ¡Prestá mucha atención!`,
      expression: 'sad'
    });

    setFlippedIndices([]);
    setLockBoard(false);
  };

  // -------------------------------------------------------------
  // LÓGICA DE VICTORIA
  // -------------------------------------------------------------
  const handleVictory = () => {
    sound.playVictory();
    setShowVictoryModal(true);

    const baseXP = difficulty === 'basic' ? 150 : difficulty === 'intermediate' ? 250 : 400;
    const sorted = [...players].sort((a, b) => b.score - a.score);
    const winningScore = sorted[0].score;
    const totalXPEarned = baseXP + winningScore;

    updateStreakAndXP(totalXPEarned);
  };

  // -------------------------------------------------------------
  // COMODINES Y AYUDAS
  // -------------------------------------------------------------
  // Pista (revelar una pareja por un momento)
  const handleUseHint = () => {
    if (lockBoard || hintsLeft <= 0 || cards.length === 0) return;

    sound.playHint();
    setHintsLeft(prev => prev - 1);
    setLockBoard(true);

    let idx1 = -1;
    let idx2 = -1;

    if (flippedIndices.length === 1) {
      idx1 = flippedIndices[0];
      const targetConceptId = cards[idx1].conceptId;
      idx2 = cards.findIndex((c, idx) => c.conceptId === targetConceptId && idx !== idx1 && !c.isMatched);
    } else {
      const unmatchedGroup = cards.filter(c => !c.isMatched);
      if (unmatchedGroup.length > 0) {
        const randomCard = unmatchedGroup[Math.floor(Math.random() * unmatchedGroup.length)];
        idx1 = cards.findIndex(c => c.uniqueId === randomCard.uniqueId);
        idx2 = cards.findIndex(c => c.conceptId === randomCard.conceptId && c.uniqueId !== randomCard.uniqueId);
      }
    }

    if (idx1 !== -1 && idx2 !== -1) {
      const updatedCards = [...cards];
      updatedCards[idx1].isFlipped = true;
      updatedCards[idx2].isFlipped = true;
      setCards(updatedCards);

      setRobotDialog({
        title: '¡Una ayudita! 🔍',
        message: `Te muestro las cartas por un segundo. ¡Memorizá dónde están!`,
        expression: 'happy'
      });

      setTimeout(() => {
        const cleanCards = [...cards];
        if (!cleanCards[idx1].isMatched) {
          cleanCards[idx1].isFlipped = false;
          cleanCards[idx2].isFlipped = false;
        }
        setCards(cleanCards);
        setFlippedIndices([]);
        setLockBoard(false);
      }, 1500);
    } else {
      setLockBoard(false);
    }
  };

  // Consejos/Tip conceptual rápido
  const handleUseTip = () => {
    if (tipsLeft <= 0) return;

    sound.playHint();
    setTipsLeft(prev => prev - 1);

    const unmatched = cards.filter(c => !c.isMatched);
    if (unmatched.length > 0) {
      const randomCard = unmatched[Math.floor(Math.random() * unmatched.length)];
      const concept = conceptsData[difficulty].find(c => c.id === randomCard.conceptId);

      setRobotDialog({
        title: `Una pista 💡 (${tipsLeft - 1} restantes)`,
        message: `El concepto "${concept.title}" significa: "${concept.description}". ¡Búscalo en el tablero!`,
        expression: 'thinking'
      });
    }
  };

  // -------------------------------------------------------------
  // AUDIO CONTROLS
  // -------------------------------------------------------------
  const handleToggleMusic = () => {
    const nextVal = !musicEnabled;
    setMusicEnabled(nextVal);
    sound.setMusicEnabled(nextVal);
  };

  const handleToggleSFX = () => {
    const nextVal = !sfxEnabled;
    setSfxEnabled(nextVal);
    sound.setSoundEnabled(nextVal);
  };

  // -------------------------------------------------------------
  // RENDER PANTALLAS
  // -------------------------------------------------------------
  
  // A. PANTALLA DE CONFIGURACIÓN (SETUP SCREEN)
  if (!gameStarted) {
    return (
      <div id="setup-screen" className="fullscreen-modal flex justify-center items-center min-h-screen bg-[#060814]">
        <div className="glass-panel p-5 sm:p-6 max-w-md w-full text-center m-4 max-h-[95vh] overflow-y-auto relative">
          {/* Selector de Tema Accesible */}
          <div className="flex justify-end mb-2">
            <button 
              type="button"
              onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
              className="px-2.5 py-1 bg-slate-900/60 border border-slate-700/35 rounded-xl text-xs font-black tracking-wide hover:bg-slate-900 transition flex items-center gap-1.5 cursor-pointer text-indigo-300"
            >
              {theme === 'light' ? '🌙 Modo Oscuro' : '☀️ Modo Sensorial (Claro)'}
            </button>
          </div>
          
          {/* Logo y Título */}
          <h1 className="text-2xl sm:text-3.5xl text-white mb-1 font-title text-center block">
            🎮 Concéntrese de <span className="text-glow-cyan">Código</span>
          </h1>
          <p className="text-indigo-200 mb-4 font-bold text-xs tracking-wider uppercase">
            CONFIGURA LA PARTIDA
          </p>

          {/* Inputs de Jugadores */}
          <div className="space-y-2 mb-4 text-left">
            <label className="block text-slate-400 text-[0.65rem] font-black uppercase tracking-wider mb-0.5">
              Nombre de los Jugadores (Máx 4):
            </label>
            
            {playerNames.map((name, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 bg-slate-900/80 p-2.5 rounded-xl border border-indigo-950/70 shadow-inner"
              >
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-xl border border-slate-700 select-none">
                  {avatars[index]}
                </div>
                <input 
                  type="text" 
                  className="flex-1 bg-transparent text-sm sm:text-base font-extrabold outline-none text-white placeholder-slate-500 uppercase tracking-wide" 
                  placeholder={`Jugador ${index + 1}`} 
                  value={name} 
                  onChange={(e) => handleNameChange(index, e.target.value)} 
                  maxLength={10}
                />
              </div>
            ))}
          </div>

          {/* Controles para Añadir/Remover jugadores */}
          <div className="flex justify-center gap-2.5 mb-4">
            <Button variant="danger" onClick={handleRemovePlayer} disabled={playerNames.length <= 1}>
              ➖ Quitar Jugador
            </Button>
            <Button variant="success" onClick={handleAddPlayer} disabled={playerNames.length >= 4}>
              ➕ Agregar (Max 4)
            </Button>
          </div>

          {/* Selector de Nivel */}
          <div className="mb-4 text-left bg-slate-900/60 border border-indigo-950 p-3 rounded-xl shadow-inner">
            <label className="block text-indigo-300 font-black text-[0.65rem] uppercase tracking-wider mb-2 text-center">
              Selecciona el Nivel de Dificultad:
            </label>
            <div className="grid grid-cols-3 gap-2">
              
              {/* Básico */}
              <label className="cursor-pointer">
                <input 
                  type="radio" 
                  name="difficulty" 
                  value="basic" 
                  checked={difficulty === 'basic'} 
                  onChange={() => setDifficulty('basic')} 
                  className="hidden peer"
                />
                <div className="h-full border-2 border-slate-800 rounded-lg p-2 text-center peer-checked:border-cyan-400 peer-checked:bg-cyan-950/20 transition bg-slate-950/40 hover:bg-slate-900/80">
                  <div className="text-lg mb-0.5 select-none">🌱</div>
                  <div className="text-[0.65rem] text-slate-200 font-black tracking-wide">Básico</div>
                  <div className="text-[0.5rem] text-slate-500 mt-0.5 uppercase font-bold">Fundamentos</div>
                </div>
              </label>

              {/* Intermedio */}
              <label className="cursor-pointer">
                <input 
                  type="radio" 
                  name="difficulty" 
                  value="intermediate" 
                  checked={difficulty === 'intermediate'} 
                  onChange={() => setDifficulty('intermediate')} 
                  className="hidden peer"
                />
                <div className="h-full border-2 border-slate-800 rounded-lg p-2 text-center peer-checked:border-pink-400 peer-checked:bg-pink-950/20 transition bg-slate-950/40 hover:bg-slate-900/80">
                  <div className="text-lg mb-0.5 select-none">🏗️</div>
                  <div className="text-[0.65rem] text-slate-200 font-black tracking-wide">Intermedio</div>
                  <div className="text-[0.5rem] text-slate-500 mt-0.5 uppercase font-bold">POO y Clases</div>
                </div>
              </label>

              {/* Avanzado */}
              <label className="cursor-pointer">
                <input 
                  type="radio" 
                  name="difficulty" 
                  value="advanced" 
                  checked={difficulty === 'advanced'} 
                  onChange={() => setDifficulty('advanced')} 
                  className="hidden peer"
                />
                <div className="h-full border-2 border-slate-800 rounded-lg p-2 text-center peer-checked:border-emerald-400 peer-checked:bg-emerald-950/20 transition bg-slate-950/40 hover:bg-slate-900/80">
                  <div className="text-lg mb-0.5 select-none">🚀</div>
                  <div className="text-[0.65rem] text-slate-200 font-black tracking-wide">Avanzado</div>
                  <div className="text-[0.5rem] text-slate-500 mt-0.5 uppercase font-bold">Git y Web</div>
                </div>
              </label>

            </div>
          </div>

          {/* Configuración del Tutor */}
          <div className="mb-5 text-left bg-slate-900/60 border border-indigo-950 p-3 rounded-xl shadow-inner">
            <label className="block text-indigo-300 font-black text-[0.65rem] uppercase tracking-wider mb-1.5 text-center">
              ⚙️ CONFIGURACIÓN DEL PROFESOR
            </label>
            <Slider 
              min={7} 
              max={16} 
              value={pairsCount} 
              onChange={setPairsCount}
              label="Parejas a encontrar"
            />
            <p className="text-[0.6rem] text-slate-400 text-center mt-1 font-medium">
              Elige entre 7 y 16 parejas. El tablero se ajusta automáticamente.
            </p>
          </div>

          {/* Botón Start */}
          <Button 
            variant="neon" 
            className="w-full text-lg py-2.5 rounded-xl tracking-widest font-title"
            onClick={handleStartGame}
          >
            ¡A Jugar! 🚀
          </Button>

        </div>
      </div>
    );
  }

  // B. PANTALLA PRINCIPAL DEL JUEGO
  const maxXP = playerLevel * 500;
  const levelNames = { basic: 'Básico', intermediate: 'Intermedio (POO)', advanced: 'Avanzado' };

  return (
    <div className="relative w-full min-h-screen bg-[#060814]">
      <GameLayout
        header={
          <GameHeader 
            levelName={levelNames[difficulty]} 
            playerXP={playerXP} 
            maxXP={maxXP} 
            musicEnabled={musicEnabled} 
            sfxEnabled={sfxEnabled} 
            theme={theme}
            onToggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
            onToggleMusic={handleToggleMusic} 
            onToggleSFX={handleToggleSFX} 
            onRestart={handleRestart} 
            onExitToSetup={handleExitToSetup}
          />
        }
        scoreboard={
          <Scoreboard 
            players={players} 
            currentPlayerIndex={currentPlayerIndex} 
            leaderId={leaderId} 
          />
        }
        leftSidebar={
          <>
            <TipPanel tipText={codingTips[tipIndex]} />
            <Button 
              variant="secondary" 
              onClick={() => {
                alert("¿Cómo jugar?\n\n1. Por turnos, cada jugador voltea dos cartas.\n2. Si las cartas coinciden (según el nivel), el jugador suma +5 pts y juega de nuevo.\n3. Si no coinciden, se voltean de regreso y pasa el turno.\n4. ¡El jugador con más puntos cuando se encuentren todas las parejas gana la partida!\n\nConsejo: ¡Usa las pistas del robot si te quedas atascado!");
              }}
              className="w-full py-3.5 border border-indigo-950/60 shadow-lg text-indigo-300"
            >
              <HelpCircle size={16} />
              <span>¿Cómo jugar?</span>
            </Button>
          </>
        }
        boardProgress={
          <div className="bg-[#0f172a]/95 border border-indigo-500/25 rounded-full py-2 px-6 sm:py-2.5 sm:px-8 flex items-center gap-3 sm:gap-4 shadow-[0_6px_20px_rgba(0,0,0,0.4)] mb-3 z-20 select-none backdrop-blur-md">
            <span className="text-cyan-400 text-base sm:text-xl drop-shadow-[0_0_6px_rgba(34,211,238,0.3)]">🧩</span>
            <span className="text-xs sm:text-sm font-black text-slate-300 uppercase tracking-wider">
              Parejas encontradas:{' '}
              <span className="text-cyan-400 font-title text-base sm:text-2xl ml-1 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                {globalMatches}
              </span>{' '}
              <span className="text-slate-500 font-black text-[11px] sm:text-base">/ {pairsCount}</span>
            </span>
            <div className="w-24 sm:w-44 md:w-56 bg-slate-950 rounded-full h-2.5 overflow-hidden ml-2 border border-slate-900 shadow-inner">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full rounded-full shadow-[0_0_8px_rgba(34,211,238,0.6)] transition-all duration-500" 
                style={{ width: `${(globalMatches / pairsCount) * 100}%` }}
              />
            </div>
          </div>
        }
        boardGrid={
          <BoardGrid 
            cards={cards} 
            onCardClick={handleCardClick} 
            lockBoard={lockBoard} 
            pairsCount={pairsCount} 
          />
        }
        rightSidebar={
          <SidebarChallenges 
            pairsCount={pairsCount} 
            completedMatchesCount={globalMatches} 
            playerLevel={playerLevel}
            playerXP={playerXP} 
            maxXP={maxXP} 
            streakCount={streakCount} 
            weeklyActivity={weeklyActivity} 
            challengesState={challengesState} 
          />
        }
        bottomDialog={
          <RobotDialog 
            title={robotDialog.title} 
            message={robotDialog.message} 
            expression={robotDialog.expression} 
          />
        }
        bottomControls={
          <div className="flex gap-2 justify-end items-center mt-1 md:mt-0 select-none w-full md:w-auto">
            {/* Help tip button */}
            <Button 
              variant="secondary" 
              onClick={handleUseTip} 
              disabled={tipsLeft <= 0 || lockBoard}
              className="flex-1 md:flex-none py-2 px-4 border border-indigo-900/40 text-slate-200 text-xs sm:text-sm"
            >
              <Lightbulb size={14} className="text-yellow-400" />
              <span>Dica {tipsLeft}</span>
            </Button>

            {/* Hint reveal button */}
            <Button 
              variant="secondary" 
              onClick={handleUseHint} 
              disabled={hintsLeft <= 0 || lockBoard}
              className="flex-1 md:flex-none py-2 px-4 border border-indigo-900/40 text-slate-200 text-xs sm:text-sm"
            >
              <Search size={14} className="text-cyan-400" />
              <span>Pistas {hintsLeft}</span>
            </Button>
          </div>
        }
      />

      {/* C. MODAL DE VICTORIA */}
      {showVictoryModal && (
        <div id="victory-modal" className="fullscreen-modal flex justify-center items-center bg-[#020621]/90 z-50">
          <div className="glass-panel p-8 max-w-md w-full text-center m-4 border-t-4 border-emerald-400 animate-bounce-custom">
            
            <div className="text-6xl sm:text-7xl mb-4 drop-shadow-[0_0_20px_rgba(234,179,8,0.7)] select-none">🏆</div>
            
            <h2 className="text-3xl sm:text-4xl text-emerald-400 mb-2 font-title text-glow-cyan">
              ¡Partida Terminada!
            </h2>
            <p className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-5">
              ¡Encontraron todas las parejas!
            </p>

            {/* Resultados y Podio */}
            <div className="my-6 space-y-3 text-lg font-bold text-white text-left">
              
              <div className="text-center mb-4">
                {(() => {
                  const sorted = [...players].sort((a, b) => b.score - a.score);
                  const highest = sorted[0].score;
                  const winners = sorted.filter(p => p.score === highest);
                  
                  if (winners.length > 1) {
                    return (
                      <p className="text-xl text-cyan-400 font-title">
                        ¡Hubo un empate! 💻
                      </p>
                    );
                  }
                  return (
                    <p className="text-2xl text-emerald-400 font-title">
                      ¡{winners[0].name} ganó la partida!
                    </p>
                  );
                })()}
              </div>

              <div className="bg-slate-950/60 rounded-2xl p-4 border border-indigo-950/80 shadow-inner">
                {[...players]
                  .sort((a, b) => b.score - a.score)
                  .map((p, index, arr) => {
                    const highest = arr[0].score;
                    const isWinner = p.score === highest;
                    const medal = isWinner ? '🥇' : (index === 1 ? '🥈' : (index === 2 ? '🥉' : '💻'));
                    
                    return (
                      <div 
                        key={p.id} 
                        className={`flex justify-between items-center py-2.5 ${
                          index !== arr.length - 1 ? 'border-b border-indigo-950/30' : ''
                        }`}
                      >
                        <span className="text-sm sm:text-base flex items-center gap-2 font-bold text-slate-200">
                          <span className="text-lg select-none">{medal}</span> 
                          <span>{p.avatar}</span> 
                          <span className="uppercase tracking-wide">{p.name}</span>
                        </span>
                        <span className="text-xl font-title text-glow-cyan">
                          {p.score} <span className="text-slate-400 text-xs font-bold">pts</span>
                        </span>
                      </div>
                    );
                  })}
              </div>

              <div className="text-center pt-3 select-none">
                <span className="bg-indigo-950/70 border border-indigo-900/40 text-indigo-300 text-xs px-3 py-1.5 rounded-xl font-black">
                  🔥 +{difficulty === 'basic' ? 150 : difficulty === 'intermediate' ? 250 : 400} XP para tu perfil
                </span>
              </div>
            </div>

            {/* Controles del Modal de Victoria */}
            <div className="flex flex-col gap-2.5 mt-6">
              <Button variant="neon" className="w-full py-3" onClick={handleRestart}>
                Jugar de nuevo 🔄
              </Button>
              <Button variant="secondary" className="w-full py-3" onClick={handleExitToSetup}>
                Cambiar opciones ⚙️
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
export default GamePage;
