/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Users, 
  Trophy, 
  Play, 
  Plus, 
  Trash2, 
  Shuffle, 
  Settings, 
  Pause, 
  RotateCcw, 
  Square,
  CheckCircle2, 
  Sun,
  SunMedium,
  Moon,
  ChevronRight,
  Shield,
  Timer,
  Clock,
  ClipboardPaste,
  Pencil,
  PenLine,
  Check,
  User,
  UserPlus,
  Medal,
  LayoutGrid,
  Activity,
  Zap,
  Info,
  AlertTriangle,
  RefreshCw,
  DollarSign,
  Camera,
  Printer,
  PieChart,
  Minus,
  X,
  AlertCircle,
  Menu,
  Heart,
  CircleDot,
  Footprints,
  UserCog,
  Swords,
  Wallet,
  ArrowLeftRight,
  MoveRight,
  Home,
  Eye,
  Award,
  LogOut,
  Contact
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { supabase } from './lib/supabase';
import { sounds } from './lib/sounds';

// --- Supabase Hooks ---
function useSupabaseArraySync<T extends { id: string }>(
  tableName: string,
  groupId: string,
  items: T[],
  mapToDb: (item: T, groupId: string) => any,
  isDataLoaded: boolean
) {
  const syncedIds = React.useRef<Set<string>>(new Set());

  // Use a stringified version of the mapping function so we don't need to put it in deps if it changes ref
  const mapToDbRef = React.useRef(mapToDb);
  React.useEffect(() => {
    mapToDbRef.current = mapToDb;
  }, [mapToDb]);

  React.useEffect(() => {
    if (!isDataLoaded) {
      syncedIds.current = new Set(items.map(i => i.id));
      return;
    }

    const currentIds = new Set(items.map(i => i.id));
    const deletedIds = [...syncedIds.current].filter(id => !currentIds.has(id));

    if (deletedIds.length > 0) {
      supabase.from(tableName).delete().in('id', deletedIds).then();
    }

    if (items.length > 0) {
      const payload = items.map(item => mapToDbRef.current(item, groupId));
      supabase.from(tableName).upsert(payload, { onConflict: 'id' }).then();
    }

    syncedIds.current = currentIds;
  }, [items, isDataLoaded, groupId, tableName]);
}

import { 

  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  Legend
} from 'recharts';

// --- Types ---

interface Player {
  id: string;
  name: string;
  goals: number;
  assists: number;
  isAvailable?: boolean;
  photo?: string;
  arrivedAt?: number;
}

interface Team {
  id: string;
  name: string;
  playerIds: string[];
  emoji?: string;
  color?: string;
  lastMatchStatus?: 'Vencedor' | 'Empate' | 'Derrota';
}

const TEAM_EMOJIS = ['🛡️', '⚔️', '🔰', '⚜️', '🔱', '🎖️', '🏅', '🥇', '🦅', '🦁', '⭐', '🔥', '🐉', '🌪️', '⚡', '🏆', '⚓', '👑', '🦈', '🐺'];
const TEAM_COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f97316', 
  '#eab308', '#14b8a6', '#06b6d4', '#84cc16', 
  '#f59e0b', '#10b981', '#0ea5e9', '#6b7280', 
  '#ffffff', '#1a1a1a'
];

const TutorialCarousel = () => {
  const [index, setIndex] = useState(0);

  // Imagens carregadas via URLs públicas (imgur) para não quebrar o build
  const items = [
    { image: "https://i.imgur.com/MEtEuf4.png", alt: "Crie Suas Partidas" },
    { image: "https://i.imgur.com/aQg9zs6.png", alt: "Gerencie Jogadores" },
    { image: "https://i.imgur.com/e1fa5xq.png", alt: "Tudo do Seu Jeito" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [items.length]);

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-2xl bg-transparent">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <img 
            src={items[index].image} 
            alt={items[index].alt} 
            className="w-full h-full object-cover rounded-2xl" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/600x400/1a1a1a/ffffff?text=${items[index].alt.replace(/ /g, '+')}\n(Faça+upload+da+imagem)`;
            }}
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {items.map((_, i) => (
          <div key={i} className={`w-2.5 h-2.5 rounded-full border-2 border-black transition-colors duration-500 ${i === index ? 'bg-black' : 'bg-white/50'}`} />
        ))}
      </div>
    </div>
  );
};

const getNextTeamColor = (existingTeams: Team[]) => {
  const usedColors = existingTeams.map(t => t.color).filter(Boolean);
  const availableColors = TEAM_COLORS.filter(c => !usedColors.includes(c));
  
  if (availableColors.length > 0) {
    // Pick a random color from available colors to avoid predictable patterns
    return availableColors[Math.floor(Math.random() * availableColors.length)];
  }
  
  // If no colors are available, pick a random color from the entire set
  return TEAM_COLORS[Math.floor(Math.random() * TEAM_COLORS.length)];
};

const FlipDigit = ({ value, size = 'normal', clockId = '', digitId = '' }: { value: string, size?: 'normal' | 'small' | 'xs', clockId?: string, digitId?: string }) => {
  const theme = 'light';
  const dimensions = {
    normal: 'w-10 h-14',
    small: 'w-7 h-10',
    xs: 'w-5 h-7'
  };
  
  const textSizes = {
    normal: 'text-3xl',
    small: 'text-xl',
    xs: 'text-sm'
  };

  return (
    <div className={`relative ${dimensions[size]} flex items-center justify-center overflow-hidden`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={`flip-${clockId}-${digitId}-${value}`}
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -25, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className={`${textSizes[size]} font-black text-black tracking-tighter`}
        >
          {value}
        </motion.span>
      </AnimatePresence>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/5 via-transparent to-black/5" />
    </div>
  );
};

const FlipClock = ({ time, size = 'normal', clockId = 'default' }: { time: number, size?: 'normal' | 'small' | 'xs', clockId?: string }) => {
  const theme = 'light';
  const minutes = Math.floor(time / 60).toString().padStart(2, '0');
  const seconds = (time % 60).toString().padStart(2, '0');
  
  return (
    <div className={`flex items-center ${size === 'xs' ? 'gap-0.5 p-1' : 'gap-1 p-2'} rounded-full border border-black/10`}>
      <div className="flex gap-0.5">
        <FlipDigit value={minutes[0]} size={size} clockId={clockId} digitId="min0" />
        <FlipDigit value={minutes[1]} size={size} clockId={clockId} digitId="min1" />
      </div>
      <span className={`${size === 'xs' ? 'text-sm' : size === 'small' ? 'text-lg' : 'text-2xl'} font-black text-black animate-pulse mx-0.5`}>:</span>
      <div className="flex gap-0.5">
        <FlipDigit value={seconds[0]} size={size} clockId={clockId} digitId="sec0" />
        <FlipDigit value={seconds[1]} size={size} clockId={clockId} digitId="sec1" />
      </div>
    </div>
  );
};

const AssistModal = ({ 
  isOpen, 
  onSelect, 
  teamPlayers, 
  goalPlayerId,
  players
}: { 
  isOpen: boolean, 
  onSelect: (id: string | null) => void, 
  teamPlayers: string[], 
  goalPlayerId: string,
  players: any[]
}) => {
  const theme = 'light';
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`w-full max-w-xs rounded-[24px] p-6 shadow-md border ${
          theme === 'light' 
            ? 'bg-zinc-100 border-zinc-200' 
            : 'bg-brand-card border-white/10'
        }`}
      >
        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-brand-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Medal className="text-brand-primary" size={24} />
          </div>
          <h3 className={`text-lg font-black uppercase tracking-tight text-zinc-900`}>Quem deu a assistência?</h3>
          <p className={`text-zinc-500 text-xs mt-1 font-bold uppercase tracking-widest`}>Selecione o jogador que ajudou no gol</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {teamPlayers.filter(id => id !== goalPlayerId).map((pid, idx) => (
            <button
              key={`assist-choice-${pid}-${idx}`}
              onClick={() => onSelect(pid)}
              className={`p-3 rounded-lg border transition-all text-left group ${
                theme === 'light' 
                  ? 'bg-white border-zinc-200 hover:border-brand-primary/50 hover:bg-brand-primary/5' 
                  : 'bg-black/20 border-white/5 hover:border-brand-primary/50 hover:bg-brand-primary/5'
              }`}
            >
              <div className="text-[8px] font-black uppercase tracking-widest text-brand-primary mb-1 opacity-60">Jogador</div>
              <div className={`text-xs font-black uppercase transition-colors ${
                theme === 'light' ? 'text-zinc-900 group-hover:text-brand-primary' : 'text-brand-text-primary group-hover:text-brand-primary'
              }`}>
                {players.find(p => p.id === pid)?.name}
              </div>
            </button>
          ))}
          
          <button
            onClick={() => onSelect(null)}
            className={`col-span-2 p-3 rounded-lg border transition-all text-center ${
              theme === 'light' 
                ? 'bg-white border-zinc-200 hover:bg-zinc-50' 
                : 'bg-black/20 border-white/5 hover:bg-white/5'
            }`}
          >
            <span className={`text-[10px] font-black uppercase tracking-widest text-zinc-500`}>Sem assistência</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ScorerModal = ({ 
  isOpen, 
  onSelect, 
  teamPlayers, 
  players,
  teamName
}: { 
  isOpen: boolean, 
  onSelect: (id: string) => void, 
  teamPlayers: string[], 
  players: any[],
  teamName: string
}) => {
  const theme = 'light';
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`w-full max-w-md rounded-[32px] p-8 shadow-md border ${
          theme === 'light' 
            ? 'bg-zinc-100 border-zinc-200' 
            : 'bg-brand-card border-white/10'
        }`}
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-brand-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Medal className="text-brand-primary" size={32} />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight text-zinc-900">Quem marcou o gol?</h3>
          <p className="text-zinc-500 text-sm mt-2 font-bold uppercase tracking-widest">Selecione o jogador do {teamName}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {teamPlayers.map((pid, idx) => (
            <button
              key={`scorer-choice-${pid}-${idx}`}
              onClick={() => onSelect(pid)}
              className={`p-4 rounded-lg border transition-all text-left group ${
                theme === 'light' 
                  ? 'bg-white border-zinc-200 hover:border-brand-primary/50 hover:bg-brand-primary/5' 
                  : 'bg-black/20 border-white/5 hover:border-brand-primary/50 hover:bg-brand-primary/5'
              }`}
            >
              <div className="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-1 opacity-60">Jogador</div>
              <div className={`text-sm font-black uppercase transition-colors text-zinc-900 group-hover:text-brand-primary`}>
                {players.find(p => p.id === pid)?.name}
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const GoalCelebration = ({ isOpen, scorerName, teamName, scorerPhoto }: { isOpen: boolean, scorerName: string, teamName: string, scorerPhoto?: string }) => {
  const theme = 'light';
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-md overflow-hidden"
    >
      {/* Root Camera Shake/Zoom Container */}
      <motion.div
        animate={{ 
          scale: [1, 1.02, 0.99, 1],
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="relative flex flex-col items-center w-full justify-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12 }}
          className="text-4xl sm:text-6xl font-black text-brand-primary uppercase tracking-tighter mb-6 z-10 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] italic"
        >
          GOL!
        </motion.div>
        
        {/* Compact & Rounded Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 150 }}
          className="z-20 bg-zinc-950 border-2 border-white/20 rounded-[40px] shadow-2xl overflow-hidden flex items-center p-2 pr-8 max-w-[90%] sm:max-w-md gap-4 min-h-[100px]"
        >
          {/* Photo Section - Round Circle */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-zinc-800 rounded-full border-2 border-brand-primary flex items-center justify-center relative shrink-0 overflow-hidden shadow-lg">
             {scorerPhoto ? (
               <img 
                 src={scorerPhoto} 
                 className="w-full h-full object-cover grayscale-[0.1] contrast-125" 
                 referrerPolicy="no-referrer" 
                 alt={scorerName}
               />
             ) : (
               <User size={40} className="text-zinc-600" />
             )}
             
             {/* Dynamic Light Sweep */}
             <motion.div 
               animate={{ x: [-150, 150] }}
               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-0 bottom-0 w-8 bg-white/20 skew-x-[25deg] z-10"
             />
          </div>

          {/* Info Section */}
          <div className="flex flex-col justify-center items-start min-w-0">
            <div className="text-brand-primary text-[8px] font-black uppercase tracking-[0.3em] mb-1">
              Goleador
            </div>
            <div className="text-xl sm:text-3xl font-black uppercase tracking-tighter text-white mb-0.5 truncate w-full italic">
              {scorerName}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 truncate">
                {teamName}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const PlayerManagementModalComponent = ({ 
  player, 
  isOpen, 
  onClose, 
  onUpdateName, 
  onUpdatePhoto,
  onRemove
}: { 
  player: Player | null, 
  isOpen: boolean, 
  onClose: () => void, 
  onUpdateName: (id: string, name: string) => void,
  onUpdatePhoto: (id: string, photo: string) => void,
  onRemove?: (id: string) => void
}) => {
  const theme = 'light';
  if (!isOpen || !player) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const resized = await resizeImage(reader.result as string);
        onUpdatePhoto(player.id, resized);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-3xl p-8 shadow-[2px_2px_0_0_rgba(0,0,0,1)] border-2 relative bg-zinc-100 border-black"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-brand-glass border border-brand-border rounded-xl text-zinc-500 hover:text-brand-primary active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all shadow-[1px_1px_0_0_var(--brand-border)]"
        >
          <Plus size={20} className="rotate-45" />
        </button>

        <div className="flex flex-col items-center gap-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 flex items-center justify-center relative bg-zinc-200 border-black">
              {player.photo ? (
                <img src={player.photo} alt={player.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="flex flex-col items-center justify-center text-brand-text-secondary opacity-40">
                  <User size={48} />
                  <span className="text-[10px] font-black uppercase mt-1 tracking-widest">Sem Foto</span>
                </div>
              )}
            </div>
            
            <label className="absolute -bottom-2 -right-2 w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center cursor-pointer shadow-[1px_1px_0_0_rgba(0,0,0,1)] hover:scale-105 active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-none transition-all border-2 border-black">
              <Camera size={20} />
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>

          <div className="w-full space-y-4">
            <div className="text-center group relative">
              <input 
                type="text" 
                defaultValue={player.name}
                onBlur={(e) => onUpdateName(player.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onUpdateName(player.id, e.currentTarget.value);
                    e.currentTarget.blur();
                  }
                }}
                className={`w-full bg-transparent text-2xl font-black uppercase tracking-tighter text-center outline-none border-b-4 border-transparent focus:border-brand-primary pb-1 transition-all ${
                  theme === 'light' ? 'text-black' : 'text-white'
                }`}
              />
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-brand-primary mt-1">Nome do Jogador</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-2xl flex flex-col items-center justify-center border-2 border-brand-border shadow-[4px_4px_0_0_var(--brand-border)] ${
                theme === 'light' ? 'bg-white' : 'bg-black/40'
              }`}>
                <div className="text-3xl font-black text-brand-primary leading-none mb-1">{player.goals}</div>
                <div className="text-[8px] font-black uppercase tracking-widest text-brand-text-secondary !normal-case">Gols</div>
              </div>
              <div className={`p-4 rounded-2xl flex flex-col items-center justify-center border-2 border-brand-border shadow-[4px_4px_0_0_var(--brand-border)] ${
                theme === 'light' ? 'bg-white' : 'bg-black/40'
              }`}>
                <div className="text-3xl font-black text-brand-primary leading-none mb-1">{player.assists}</div>
                <div className="text-[8px] font-black uppercase tracking-widest text-brand-text-secondary !normal-case">Assistências</div>
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-2">
              <button 
                onClick={onClose}
                className="w-full py-4 bg-brand-gradient text-black rounded-2xl font-black uppercase tracking-widest shadow-[1.5px_1.5px_0_0_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all text-xs glass-3d border border-black"
              >
                Confirmar
              </button>

              {onRemove && (
                <button 
                  onClick={() => {
                    onRemove(player.id);
                    onClose();
                  }}
                  className="w-full py-3 flex items-center justify-center gap-2 text-orange-600 bg-orange-900/10 hover:bg-orange-900/20 rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all border-2 border-orange-600/30 active:scale-95"
                >
                  <Trash2 size={12} />
                  Remover Jogador
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

interface MatchConfig {
  duration: number; // in minutes
  playersPerTeam: number;
  goalLimit: number;
}

interface MatchEvent {
  id: string;
  type: 'goal';
  team: 'A' | 'B';
  playerId: string;
  assistId?: string;
  timestamp: number; // match time in seconds
}

interface MatchState {
  isActive: boolean;
  isPaused: boolean;
  timeRemaining: number; // in seconds
  config: MatchConfig;
  scoreA: number;
  scoreB: number;
  events: MatchEvent[];
  startTime: number | null;
  hasEnded: boolean;
}

interface PaymentRecord {
  playerId: string;
  year: number;
  months: { [month: string]: number };
  monthlyFee: number;
}

type Screen = 'players' | 'teams' | 'ranking' | 'finance';

// --- Utils ---

const resizeImage = (base64Str: string, maxWidth = 150, maxHeight = 150): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onerror = () => resolve(base64Str); // Fallback to original if error
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
  });
};

const safeLocalStorage = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  },
  clear: () => {
    try {
      localStorage.clear();
    } catch (e) {}
  }
};

const generateId = () => {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }
  } catch (e) {}
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const formatPlayerName = (name: string) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) return name;
  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1][0].toUpperCase();
  return `${firstName} ${lastInitial}.`;
};

const SpinningBall = ({ 
  size = "md", 
  className = "", 
  spin = true,
  color = "#39FF14",
  patternColor = "#000000",
  isIcon = false
}: { 
  size?: 'xs' | 'sm' | 'md' | 'lg', 
  className?: string, 
  spin?: boolean,
  color?: string,
  patternColor?: string,
  isIcon?: boolean
}) => {
  const theme = 'light';
  const sizeClasses = {
    xs: "w-[18px] h-[18px]",
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-16 h-16"
  };

  return (
    <motion.div 
      animate={spin ? { rotate: 360 } : {}}
      transition={spin ? { 
        repeat: Infinity, 
        duration: 2, 
        ease: "linear" 
      } : {}}
      className={`${sizeClasses[size]} rounded-full relative flex items-center justify-center z-10 ${className}`}
      style={{ backgroundColor: color }}
    >
      {/* Ball pattern */}
      <div className="absolute inset-0 rounded-full border-2 overflow-hidden" style={{ borderColor: isIcon ? patternColor : 'rgba(0,0,0,0.2)' }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full" style={{ backgroundColor: patternColor, opacity: isIcon ? 0.8 : 0.1 }} />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-0.5" style={{ backgroundColor: patternColor, opacity: isIcon ? 0.8 : 0.1 }} />
        <div className="absolute inset-0 border-[6px] border-transparent rounded-full" style={{ borderTopColor: patternColor, opacity: isIcon ? 0.7 : 0.05 }} />
      </div>
    </motion.div>
  );
};

const FutQuinaLogo = ({ className = "", size = "md", colorClass: overrideColor, style }: { className?: string, size?: 'sm' | 'md' | 'lg', colorClass?: string, style?: React.CSSProperties }) => {
  const theme = 'light';
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-4xl"
  };

  const colorClass = overrideColor || 'text-zinc-500 font-bold';
  const shadowClass = '';

  return (
    <span className={`${sizeClasses[size]} uppercase tracking-tighter ${colorClass} ${shadowClass} ${className}`} style={style}>
      Fut Quina
    </span>
  );
};

const RouletteOverlay = () => {
  const theme = 'light';
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] bg-black/90 flex flex-col items-center justify-center p-6 backdrop-blur-md"
    >
      <div className="relative w-64 h-64 sm:w-80 sm:h-80">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-8 border-brand-primary/20 animate-[spin_3s_linear_infinite]" />
        
        {/* Roulette Wheel */}
        <div className="absolute inset-4 rounded-full border-4 border-brand-primary/40 flex items-center justify-center overflow-hidden animate-[spin_1s_linear_infinite]">
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
            {Array.from({ length: 64 }).map((_, i) => (
              <div 
                key={`roulette-grid-${i}`} 
                className={`border-[0.5px] border-brand-primary/10 ${i % 2 === 0 ? 'bg-brand-primary/5' : 'bg-transparent'}`}
              />
            ))}
          </div>
          {/* Spokes */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={`roulette-spoke-${i}`} 
              className="absolute w-full h-[1px] bg-brand-primary/20" 
              style={{ transform: `rotate(${i * 30}deg)` }}
            />
          ))}
        </div>

        {/* Inner Spinning Ball */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            animate={{ 
              rotate: -360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 0.5, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <SpinningBall size="lg" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-brand-primary font-black uppercase tracking-[0.3em] text-[10px] animate-pulse"
          >
            Sorteando Jogadores
          </motion.p>
        </div>

        {/* Indicator */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-12 bg-brand-primary z-20" 
             style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }} />
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Sorteando Times</h2>
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- App Component ---

function GroupApp({ groupId, onBackToHome }: { groupId: string, onBackToHome: () => void }) {
  const theme = 'light';
  const setTheme = (t: string) => {}; // No-op if needed elsewhere
  // --- State ---
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    const saved = safeLocalStorage.getItem(`futquina_current_screen_${groupId}`);
    return (saved as Screen) || 'players';
  });

  useEffect(() => {
    safeLocalStorage.setItem(`futquina_current_screen_${groupId}`, currentScreen);
  }, [currentScreen, groupId]);
  const [isInitialSetupFlow, setIsInitialSetupFlow] = useState(false);
  const [firstSetupDone, setFirstSetupDone] = useState(() => {
    const saved = safeLocalStorage.getItem(`futquina_first_setup_done_${groupId}`);
    return saved === 'true';
  });
  
  const [monthlyFee, setMonthlyFee] = useState<number>(() => {
    const saved = safeLocalStorage.getItem(`futquina_monthly_fee_${groupId}`);
    if (!saved) return 5;
    const val = parseFloat(saved);
    return isNaN(val) ? 5 : val;
  });
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    const saved = safeLocalStorage.getItem(`futquina_selected_year_${groupId}`);
    if (!saved) return 2026;
    const val = parseInt(saved);
    return isNaN(val) ? 2026 : val;
  });
  const [availableYears, setAvailableYears] = useState<number[]>(() => {
    const saved = safeLocalStorage.getItem(`futquina_available_years_${groupId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return [...new Set(parsed)].sort((a, b) => a - b);
        }
        return [2026];
      } catch (e) {
        return [2026];
      }
    }
    return [2026];
  });
  const [isEditingFee, setIsEditingFee] = useState(false);
  const [tempFee, setTempFee] = useState('');
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [isPrintPaymentsOnly, setIsPrintPaymentsOnly] = useState(false);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [financeSubScreen, setFinanceSubScreen] = useState<'mensalidade' | 'balanco' | 'menu'>(() => {
    const saved = safeLocalStorage.getItem(`futquina_finance_subscreen_${groupId}`);
    return (saved as 'mensalidade' | 'balanco' | 'menu') || 'balanco';
  });

  useEffect(() => {
    safeLocalStorage.setItem(`futquina_finance_subscreen_${groupId}`, financeSubScreen);
  }, [financeSubScreen, groupId]);
  const [manualAdjustment, setManualAdjustment] = useState<number>(() => {
    const saved = safeLocalStorage.getItem(`futquina_manual_adjustment_${groupId}`);
    return saved ? Number(saved) : 0;
  });
  const [isEditingTotal, setIsEditingTotal] = useState(false);
  const [totalInput, setTotalInput] = useState("");

  useEffect(() => {
    safeLocalStorage.setItem(`futquina_manual_adjustment_${groupId}`, manualAdjustment.toString());
  }, [manualAdjustment, groupId]);
  const [expenses, setExpenses] = useState<{ id: string, name: string, amount: number, date: number }[]>(() => {
    const saved = safeLocalStorage.getItem(`futquina_expenses_${groupId}`);
    try {
      return saved ? JSON.parse(saved) || [] : [];
    } catch (e) {
      return [];
    }
  });
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState({ name: '', amount: '' });

  useEffect(() => {
    safeLocalStorage.setItem(`futquina_expenses_${groupId}`, JSON.stringify(expenses));
  }, [expenses]);
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = safeLocalStorage.getItem(`futquina_players_${groupId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) return [];
        const uniquePlayers: Player[] = [];
        const seenIds = new Set<string>();
        for (const p of parsed) {
          if (!p || typeof p !== 'object') continue;
          const id = p.id || generateId();
          if (!seenIds.has(id)) {
            uniquePlayers.push({ ...p, id });
            seenIds.add(id);
          } else {
            uniquePlayers.push({ ...p, id: generateId() });
          }
        }
        return uniquePlayers;
      } catch (e) {
        console.error("Error parsing players from localStorage", e);
      }
    }
    return [];
  });
  const [sessionPlayerIds, setSessionPlayerIds] = useState<string[]>(() => {
    const saved = safeLocalStorage.getItem(`futquina_session_player_ids_${groupId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error("Error parsing session player ids", e);
      }
    }
    return [];
  });
  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = safeLocalStorage.getItem(`futquina_payments_${groupId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) return [];
        const uniquePayments: PaymentRecord[] = [];
        const seenKeys = new Set<string>();
        for (const p of parsed) {
          if (!p || typeof p !== 'object') continue;
          const key = `${p.playerId}-${p.year}`;
          if (!seenKeys.has(key)) {
            uniquePayments.push(p);
            seenKeys.add(key);
          } else {
            // Merge months if duplicate
            const existing = uniquePayments.find(up => up.playerId === p.playerId && up.year === p.year);
            if (existing) {
              existing.months = { ...existing.months, ...p.months };
            }
          }
        }
        return uniquePayments;
      } catch (e) {
        console.error("Error parsing payments from localStorage", e);
      }
    }
    return [];
  });
  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = safeLocalStorage.getItem(`futquina_teams_${groupId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) return [];
        const uniqueTeams: Team[] = [];
        const seenTeamIds = new Set<string>();
        
        for (const t of parsed) {
          if (!t || typeof t !== 'object') continue;
          const teamId = (t.id && !seenTeamIds.has(t.id)) ? t.id : generateId();
          seenTeamIds.add(teamId);
          
          const uniquePlayerIds: string[] = [];
          const seenPlayerIds = new Set<string>();
          const playerIds = Array.isArray(t.playerIds) ? t.playerIds : [];
          for (const pid of playerIds) {
            if (!seenPlayerIds.has(pid)) {
              uniquePlayerIds.push(pid);
              seenPlayerIds.add(pid);
            }
          }
          
          uniqueTeams.push({ ...t, id: teamId, playerIds: uniquePlayerIds, color: t.color || getNextTeamColor(uniqueTeams) });
        }
        return uniqueTeams;
      } catch (e) {
        console.error("Error parsing teams from localStorage", e);
      }
    }
    return [
      { id: generateId(), name: 'Time A', playerIds: [], emoji: '⚽', color: TEAM_COLORS[0] },
      { id: generateId(), name: 'Time B', playerIds: [], emoji: '🏆', color: TEAM_COLORS[1] }
    ];
  });

  // Clear teams when all players are deleted
  useEffect(() => {
    if (players.length === 0 && teams.length > 0) {
      setTeams([]);
    }
  }, [players.length, teams.length]);
  
  const [match, setMatch] = useState<MatchState & { teamAIndex: number, teamBIndex: number }>(() => {
    const saved = safeLocalStorage.getItem(`futquina_match_${groupId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed || typeof parsed !== 'object') throw new Error("Invalid match data");
        const uniqueEvents: MatchEvent[] = [];
        const seenEventIds = new Set<string>();
        const events = Array.isArray(parsed.events) ? parsed.events : [];
        for (const e of events) {
          if (!e || typeof e !== 'object') continue;
          const id = (e.id && !seenEventIds.has(e.id)) ? e.id : generateId();
          uniqueEvents.push({ ...e, id });
          seenEventIds.add(id);
        }
        return { 
          isActive: false,
          isPaused: true,
          timeRemaining: 600,
          config: { duration: 10, playersPerTeam: 5, goalLimit: 5 },
          scoreA: 0,
          scoreB: 0,
          startTime: null,
          hasEnded: false,
          teamAIndex: -1,
          teamBIndex: -1,
          ...parsed, 
          events: uniqueEvents 
        };
      } catch (e) {
        console.error("Error parsing match from localStorage", e);
      }
    }
    return {
      isActive: false,
      isPaused: true,
      timeRemaining: 600,
      config: { duration: 10, playersPerTeam: 5, goalLimit: 5 },
      scoreA: 0,
      scoreB: 0,
      events: [],
      startTime: null,
      hasEnded: false,
      teamAIndex: -1,
      teamBIndex: -1
    };
  });

  const [matchHistory, setMatchHistory] = useState<any[]>(() => {
    const saved = safeLocalStorage.getItem(`futquina_match_history_${groupId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) return [];
        const uniqueHistory: any[] = [];
        const seenHistoryIds = new Set<string>();
        for (const h of parsed) {
          if (!h || typeof h !== 'object') continue;
          const hId = (h.id && !seenHistoryIds.has(h.id)) ? h.id : generateId();
          uniqueHistory.push({ ...h, id: hId });
          seenHistoryIds.add(hId);
        }
        return uniqueHistory;
      } catch (e) {
        console.error("Error parsing match history from localStorage", e);
      }
    }
    return [];
  });
  const [hasRandomized, setHasRandomized] = useState(() => {
    const saved = safeLocalStorage.getItem(`futquina_has_randomized_${groupId}`);
    return saved === 'true';
  });
  const [pendingAssist, setPendingAssist] = useState<{ team: 'A' | 'B', goalPlayerId: string, eventId: string } | null>(null);
  const [showRandomizeModal, setShowRandomizeModal] = useState(false);
  const [showTeamWarningModal, setShowTeamWarningModal] = useState(false);

  const handlePlayerGoal = (playerId: string, team: 'A' | 'B') => {
    if (!match.isActive || match.isPaused) {
      setToast({ message: "A partida precisa estar ativa e rolando para marcar gols.", type: 'warning' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    const eventId = generateId();
    const newEvent: MatchEvent = {
      id: eventId,
      type: 'goal',
      team,
      playerId,
      timestamp: match.config.duration * 60 - match.timeRemaining
    };

    setMatch(prev => ({
      ...prev,
      scoreA: team === 'A' ? prev.scoreA + 1 : prev.scoreA,
      scoreB: team === 'B' ? prev.scoreB + 1 : prev.scoreB,
      events: [...prev.events, newEvent]
    }));

    setPendingAssist({ team, goalPlayerId: playerId, eventId });
    playWhistle(); 
  };

  const handleAssistSelection = (assistId: string | null) => {
    if (!pendingAssist) return;

    if (assistId) {
      setMatch(prev => ({
        ...prev,
        events: prev.events.map(e => 
          e.id === pendingAssist.eventId ? { ...e, assistId } : e
        )
      }));
      setToast({ message: "Gol e assistência registrados!", type: 'success' });
    } else {
      setToast({ message: "Gol registrado sem assistência.", type: 'info' });
    }

    setPendingAssist(null);
    setTimeout(() => setToast(null), 3000);
  };
  const [showFormationChoiceModal, setShowFormationChoiceModal] = useState(false);
  const [lastMatchResult, setLastMatchResult] = useState<{
    id: string;
    teamAIndex: number;
    teamBIndex: number;
    scoreA: number;
    scoreB: number;
    events: MatchEvent[];
    timestamp: number;
    teamAName?: string;
    teamBName?: string;
  } | null>(() => {
    const saved = safeLocalStorage.getItem(`futquina_last_result_${groupId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          // Migration for older data without events
          if (!parsed.events) parsed.events = [];
          return parsed;
        }
      } catch (e) {
        console.error("Error parsing last result from localStorage", e);
      }
    }
    return null;
  });
  const [showEqualizerModal, setShowEqualizerModal] = useState(false);
  const [equalizerData, setEqualizerData] = useState<{
    targetTeamIndex: number;
    requiredCount: number;
    otherTeamIndex: number;
  } | null>(null);
  const [showScorerModal, setShowScorerModal] = useState(false);
  const [scorerTeam, setScorerTeam] = useState<'A' | 'B' | null>(null);
  const [replacingPlayer, setReplacingPlayer] = useState<{ teamIndex: number, removedPlayerId: string } | null>(null);
  const [showMatchSettingsModal, setShowMatchSettingsModal] = useState(false);
  const [showConfigMenu, setShowConfigMenu] = useState(false);
  const [showTimeEditModal, setShowTimeEditModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState<{ team: 'A' | 'B' | number } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'warning' | 'gray' | 'success' } | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<number | null>(null);
  const [selectedScorerId, setSelectedScorerId] = useState<string | null>(null);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [swappingPlayerId, setSwappingPlayerId] = useState<string | null>(null);
  const [fillingVacancyForTeam, setFillingVacancyForTeam] = useState<number | null>(null);
  const [playersTab, setPlayersTab] = useState<'jogadores' | 'configuracao'>(() => {
    const saved = safeLocalStorage.getItem(`futquina_players_tab_${groupId}`);
    return (saved as 'jogadores' | 'configuracao') || 'jogadores';
  });

  useEffect(() => {
    safeLocalStorage.setItem(`futquina_players_tab_${groupId}`, playersTab);
  }, [playersTab, groupId]);

  const [teamsTab, setTeamsTab] = useState<'configuracao' | 'chegada' | 'historico' | 'proximos'>(() => {
    const savedTab = safeLocalStorage.getItem(`futquina_teams_tab_${groupId}`);
    if (savedTab) return savedTab as 'configuracao' | 'chegada' | 'historico' | 'proximos';

    const saved = safeLocalStorage.getItem(`futquina_match_${groupId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.isActive ? 'historico' : 'proximos';
      } catch (e) {}
    }
    return 'proximos';
  });

  useEffect(() => {
    safeLocalStorage.setItem(`futquina_teams_tab_${groupId}`, teamsTab);
  }, [teamsTab, groupId]);
  const [swipeDirection, setSwipeDirection] = useState(0);

  const navigateTeamsTab = (target: 'configuracao' | 'chegada' | 'historico' | 'proximos') => {
    const tabs = ['configuracao', 'chegada', 'historico', 'proximos'];
    const currentIndex = tabs.indexOf(teamsTab as any);
    const targetIndex = tabs.indexOf(target);
    if (currentIndex !== -1 && targetIndex !== -1) {
      setSwipeDirection(targetIndex > currentIndex ? -1 : 1);
    }
    setTeamsTab(target);
  };

  const [rankingTab, setRankingTab] = useState<'geral' | 'artilharia' | 'assistencias'>(() => {
    const saved = safeLocalStorage.getItem(`futquina_ranking_tab_${groupId}`);
    return (saved as 'geral' | 'artilharia' | 'assistencias') || 'geral';
  });

  useEffect(() => {
    safeLocalStorage.setItem(`futquina_ranking_tab_${groupId}`, rankingTab);
  }, [rankingTab, groupId]);
  const [showNotEnoughPlayersModal, setShowNotEnoughPlayersModal] = useState(false);
  const [showLogoAnimation, setShowLogoAnimation] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showCloseWarningModal, setShowCloseWarningModal] = useState(false);
  const [showBackToHomeConfirm, setShowBackToHomeConfirm] = useState(false);
  const [flashingTeamIds, setFlashingTeamIds] = useState<string[]>([]);

  const [showQuickAddPlayerModal, setShowQuickAddPlayerModal] = useState<number | null>(null);
  const [duplicatePlayerName, setDuplicatePlayerName] = useState<{ name: string, callback: (newName: string) => void } | null>(null);
  const [showPlayerActionsModal, setShowPlayerActionsModal] = useState<{ teamIndex: number, playerId: string } | null>(null);
  const [showQueuePlayerModal, setShowQueuePlayerModal] = useState<{ teamIndex: number, playerId: string, showMoveOptions?: boolean } | null>(null);
  const [movingPlayer, setMovingPlayer] = useState<{ teamId: string, playerId: string } | null>(null);
  const [showAssistSelection, setShowAssistSelection] = useState<{ teamIndex: number, scorerId: string } | null>(null);
  const [playerManagementModal, setPlayerManagementModal] = useState<Player | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetStatsConfirm, setShowResetStatsConfirm] = useState(false);
  const [showGoalAnimation, setShowGoalAnimation] = useState<{ scorerName: string, teamName: string, scorerPhoto?: string } | null>(null);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [highlightFirstPlayer, setHighlightFirstPlayer] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const teamRects = useRef<DOMRect[]>([]);

  const playWhistle = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  const playCheer = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  // --- Persistence ---
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  useEffect(() => {
    async function loadData() {
      setIsDataLoaded(false);
      try {
        const results = await Promise.allSettled([
          supabase.from('players').select('*').eq('group_id', groupId),
          supabase.from('teams').select('*').eq('group_id', groupId),
          supabase.from('payments').select('*').eq('group_id', groupId),
          supabase.from('match_history').select('*').eq('group_id', groupId),
          supabase.from('match_state').select('*').eq('group_id', groupId).maybeSingle()
        ]);

        const playersData = results[0].status === 'fulfilled' ? results[0].value?.data : null;
        const teamsData = results[1].status === 'fulfilled' ? results[1].value?.data : null;
        const paymentsData = results[2].status === 'fulfilled' ? results[2].value?.data : null;
        const matchHistoryData = results[3].status === 'fulfilled' ? results[3].value?.data : null;
        const matchStateData = results[4].status === 'fulfilled' ? results[4].value?.data : null;

        if (playersData && playersData.length > 0) {
          const uniquePlayersMap = new Map();
          playersData.forEach(p => {
            if (!uniquePlayersMap.has(p.id)) {
              uniquePlayersMap.set(p.id, {
                id: p.id,
                name: p.name,
                photo: p.photo || undefined,
                isAvailable: p.is_available,
                arrivedAt: p.arrived_at || undefined,
                goals: 0,
                assists: 0
              });
            }
          });
          setPlayers(Array.from(uniquePlayersMap.values()));
        }
        if (teamsData && teamsData.length > 0) {
          setTeams(teamsData.map(t => ({
            id: t.id,
            name: t.name,
            color: t.color || '#4ade80',
            playerIds: t.player_ids || []
          })));
        }
        if (paymentsData && paymentsData.length > 0) {
          setPayments(paymentsData.map(p => ({
            id: p.id,
            playerId: p.player_id,
            month: p.month,
            year: p.year,
            amount: p.amount,
            paidAt: p.paid_at,
            isHalf: p.is_half
          })));
        }
        if (matchHistoryData && matchHistoryData.length > 0) {
          setMatchHistory(matchHistoryData.map(h => ({
            id: h.id,
            teamAId: h.team_a_id || undefined,
            teamBId: h.team_b_id || undefined,
            teamAName: h.team_a_name,
            teamBName: h.team_b_name,
            scoreA: h.score_a,
            scoreB: h.score_b,
            winnerId: h.winner_id,
            loserId: h.loser_id,
            events: h.events || [],
            playedAt: h.played_at
          })));
        }
        if (matchStateData) {
          setMatch({
            scoreA: matchStateData.score_a,
            scoreB: matchStateData.score_b,
            teamAIndex: matchStateData.team_a_index,
            teamBIndex: matchStateData.team_b_index,
            timeRemaining: matchStateData.time_remaining,
            isActive: matchStateData.is_active,
            isPaused: matchStateData.is_paused,
            hasEnded: matchStateData.has_ended,
            events: matchStateData.events || [],
            config: matchStateData.config || { duration: 15, playersPerTeam: 5, scoreLimit: 10 }
          });
        }
      } catch (err) {
        console.error("Error loading data from Supabase", err);
      } finally {
        setIsDataLoaded(true);
      }
    }
    loadData();
  }, [groupId]);

  useSupabaseArraySync('players', groupId, players, (p: any, gid) => ({
    id: p.id, group_id: gid, name: p.name, photo: p.photo || null, is_available: p.isAvailable, arrived_at: p.arrivedAt || null
  }), isDataLoaded);

  useSupabaseArraySync('teams', groupId, teams, (t: any, gid) => ({
    id: t.id, group_id: gid, name: t.name, color: t.color, player_ids: t.playerIds
  }), isDataLoaded);

  useSupabaseArraySync('payments', groupId, payments, (p: any, gid) => ({
    id: p.id, group_id: gid, player_id: p.playerId, month: p.month, year: p.year, amount: p.amount, paid_at: p.paidAt, is_half: p.isHalf
  }), isDataLoaded);

  useSupabaseArraySync('match_history', groupId, matchHistory, (m: any, gid) => ({
    id: m.id, group_id: gid, team_a_id: m.teamAId || null, team_b_id: m.teamBId || null, team_a_name: m.teamAName, team_b_name: m.teamBName, score_a: m.scoreA, score_b: m.scoreB, winner_id: m.winnerId || null, loser_id: m.loserId || null, events: m.events, played_at: m.playedAt
  }), isDataLoaded);

  useEffect(() => {
    if (!isDataLoaded) return;
    supabase.from('match_state').upsert({
      group_id: groupId,
      score_a: match.scoreA,
      score_b: match.scoreB,
      team_a_index: match.teamAIndex,
      team_b_index: match.teamBIndex,
      time_remaining: match.timeRemaining,
      is_active: match.isActive,
      is_paused: match.isPaused,
      has_ended: match.hasEnded,
      events: match.events,
      config: match.config
    }).then();
  }, [match, isDataLoaded, groupId]);

  useEffect(() => {
    if (players.length > 0 && players.every(p => !p.isAvailable)) {
      setTeams([]);
    }
  }, [players]);

  useEffect(() => {
    safeLocalStorage.setItem(`futquina_players_${groupId}`, JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    safeLocalStorage.setItem(`futquina_teams_${groupId}`, JSON.stringify(teams));
    // Automatically remove empty teams
    if (teams.some(t => (t.playerIds?.length || 0) === 0)) {
      setTeams(prev => prev.filter(t => (t.playerIds?.length || 0) > 0));
    }
  }, [teams]);

  useEffect(() => {
    safeLocalStorage.setItem(`futquina_match_${groupId}`, JSON.stringify(match));
  }, [match]);

  useEffect(() => {
    safeLocalStorage.setItem(`futquina_last_result_${groupId}`, JSON.stringify(lastMatchResult));
  }, [lastMatchResult]);

  useEffect(() => {
    safeLocalStorage.setItem(`futquina_payments_${groupId}`, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    safeLocalStorage.setItem(`futquina_session_player_ids_${groupId}`, JSON.stringify(sessionPlayerIds));
  }, [sessionPlayerIds]);

  useEffect(() => {
    safeLocalStorage.setItem(`futquina_monthly_fee_${groupId}`, monthlyFee.toString());
  }, [monthlyFee]);

  useEffect(() => {
    safeLocalStorage.setItem(`futquina_selected_year_${groupId}`, selectedYear.toString());
  }, [selectedYear]);

  useEffect(() => {
    safeLocalStorage.setItem(`futquina_available_years_${groupId}`, JSON.stringify(availableYears));
  }, [availableYears]);

  useEffect(() => {
    safeLocalStorage.setItem(`futquina_match_history_${groupId}`, JSON.stringify(matchHistory));
  }, [matchHistory]);

  useEffect(() => {
    safeLocalStorage.setItem(`futquina_has_randomized_${groupId}`, String(hasRandomized));
  }, [hasRandomized]);

  useEffect(() => {
    if (currentScreen !== 'finance') {
      setFinanceSubScreen('menu');
    }
  }, [currentScreen]);



  useEffect(() => {
    // Auto-hide disabled, requires manual confirmation via OK button
  }, [toast]);

  // --- Initialization ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showEqualizerModal && equalizerData) {
      const targetTeam = teams[equalizerData.targetTeamIndex];
      const otherTeam = teams[equalizerData.otherTeamIndex];
      
      if (targetTeam && otherTeam && targetTeam.playerIds.length === otherTeam.playerIds.length) {
        setShowEqualizerModal(false);
      }
    }
  }, [teams, showEqualizerModal, equalizerData]);

  // --- Match Timer ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (match.isActive && !match.isPaused && match.timeRemaining > 0) {
      interval = setInterval(() => {
        setMatch(prev => {
          const nextTime = prev.timeRemaining - 1;
          if (nextTime <= 0) {
            return { ...prev, timeRemaining: 0, isPaused: true };
          }
          return { ...prev, timeRemaining: nextTime };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [match.isActive, match.isPaused, match.timeRemaining]);

  // --- Match End Detection ---
  useEffect(() => {
    if (match.isActive && !match.hasEnded) {
      const isTimeUp = match.timeRemaining === 0;
      const isGoalLimitReached = match.scoreA >= match.config.goalLimit || match.scoreB >= match.config.goalLimit;
      
      if (isTimeUp || isGoalLimitReached) {
        finishMatch();
      }
    }
  }, [match.timeRemaining, match.scoreA, match.scoreB, match.isActive, match.hasEnded, match.config.goalLimit, teams, match.teamAIndex, match.teamBIndex]);

  // --- Handlers ---

  useEffect(() => {
    localStorage.setItem(`futquina_match_history_${groupId}`, JSON.stringify(matchHistory));
  }, [matchHistory]);

  useEffect(() => {
    localStorage.setItem(`futquina_has_randomized_${groupId}`, String(hasRandomized));
  }, [hasRandomized]);

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'AGORA';
    if (minutes < 60) return `${minutes} MINUTOS ATRÁS`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} HORAS ATRÁS`;
    const days = Math.floor(hours / 24);
    if (days === 1) return '1 DIA ATRÁS';
    return `${days} DIAS ATRÁS`;
  };

  const addPlayer = (name: string, photo?: string) => {
    if (!name.trim()) return;
    const trimmedName = name.trim();
    
    if (players.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
      setDuplicatePlayerName({
        name: trimmedName,
        callback: (newName) => {
          const newPlayer: Player = {
            id: generateId(),
            name: newName.trim(),
            goals: 0,
            assists: 0,
            isAvailable: false,
            photo: photo,
            arrivedAt: undefined
          };
          setPlayers(prev => [...prev, newPlayer]);
        }
      });
      return;
    }

    const newPlayer: Player = {
      id: generateId(),
      name: trimmedName,
      goals: 0,
      assists: 0,
      isAvailable: false,
      photo: photo,
      arrivedAt: undefined
    };
    setPlayers(prev => [...prev, newPlayer]);
  };

  const handleImportContacts = async () => {
    if (!('contacts' in navigator && 'select' in (navigator as any).contacts)) {
      setToast({ message: "Seu dispositivo não suporta importação de contatos.", type: 'info' });
      return;
    }

    try {
      const props = ['name', 'icon'];
      const opts = { multiple: true };
      const contacts = await (navigator as any).contacts.select(props, opts);
      
      if (contacts && contacts.length > 0) {
        let addedCount = 0;
        for (const contact of contacts) {
          const contactName = contact.name && contact.name[0];
          if (contactName) {
            let photoUrl = undefined;
            if (contact.icon && contact.icon.length > 0) {
              const blob = contact.icon[0];
              const originalPhoto = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
              });
              photoUrl = await resizeImage(originalPhoto);
            }
            addPlayer(contactName, photoUrl);
            addedCount++;
          }
        }
        if (addedCount > 0) {
          setToast({ message: `${addedCount} contatos importados!`, type: 'success' });
        }
      }
    } catch (err) {
      console.error('Contact Picker Error:', err);
    }
  };

  const addBulkPlayers = (text: string) => {
    const lines = text.split('\n');
    const newPlayers: Player[] = [];
    
    // Patterns to ignore: dates (DD/MM, DD-MM), times (HH:MM), common titles/descriptions
    const ignorePatterns = [
      /\d{1,2}[\/\-]\d{1,2}/, // Dates
      /\d{1,2}:\d{2}/,        // Times
      /^(lista|jogadores|convocados|presença|confirmados|futebol|pelada|horário|data|local|valor)/i, // Titles
      /^\s*$/                 // Empty lines
    ];

    const existingNames = new Set(players.map(p => p.name.toLowerCase()));

    lines.forEach((line, i) => {
      // Remove common prefixes: "1.", "1-", "-", "*", "•" but keep numbers that are part of the name
      let name = line.replace(/^[\d\.\-\*\•\s]+(?=\s|[A-Z])/, '').trim();
      if (!name) name = line.replace(/^[\d\.\-\*\•\s]+/, '').trim();
      
      // Check if the line should be ignored
      const shouldIgnore = ignorePatterns.some(pattern => pattern.test(name));
      
      if (name && name.length > 1 && !shouldIgnore) {
        if (existingNames.has(name.toLowerCase())) return;
        existingNames.add(name.toLowerCase());
        
        newPlayers.push({
          id: generateId(),
          name,
          goals: 0,
          assists: 0,
          isAvailable: false,
          arrivedAt: undefined
        });
      }
    });

    if (newPlayers.length > 0) {
      setPlayers(prev => [...prev, ...newPlayers]);
    }
  };

  const finishQuickAddPlayer = (name: string, teamIndex: number) => {
    const newPlayer: Player = {
      id: generateId(),
      name: name.trim(),
      goals: 0,
      assists: 0,
      isAvailable: true,
      arrivedAt: Date.now()
    };
    setPlayers(prev => [...prev, newPlayer]);

    const team = teams[teamIndex];
    if (team && team.playerIds.length >= match.config.playersPerTeam) {
      const nextLetter = String.fromCharCode(65 + teams.length);
      const emoji = TEAM_EMOJIS[teams.length % TEAM_EMOJIS.length];
      const newTeam = { id: generateId(), name: `Time ${nextLetter}`, playerIds: [newPlayer.id], emoji, color: getNextTeamColor(teams) };
      setTeams(prev => [...prev, newTeam]);
      setToast({ message: `Time completo! Novo time criado: ${newTeam.name}`, type: 'info' });
      setShowQuickAddPlayerModal(teams.length);
    } else {
      setTeams(prev => prev.map((t, idx) => 
        idx === teamIndex ? { ...t, playerIds: [...t.playerIds, newPlayer.id] } : t
      ));
    }

    const input = document.getElementById('quick-player-name') as HTMLInputElement;
    if (input) input.value = '';
  };

  const quickAddPlayer = (name: string, teamIndex: number) => {
    if (!name.trim()) return;
    const trimmedName = name.trim();
    
    if (match.isActive && (teamIndex === match.teamAIndex || teamIndex === match.teamBIndex)) {
      setToast({ message: "Não é possível adicionar jogadores a times em campo. Finalize a partida primeiro.", type: 'gray' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    if (players.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
      setDuplicatePlayerName({
        name: trimmedName,
        callback: (newName) => finishQuickAddPlayer(newName, teamIndex)
      });
      return;
    }

    finishQuickAddPlayer(trimmedName, teamIndex);
  };

  const addPlayerToTeam = (playerId: string, teamIndex: number) => {
    if (match.isActive && (teamIndex === match.teamAIndex || teamIndex === match.teamBIndex)) {
      setToast({ message: "Não é possível adicionar jogadores a times em campo.", type: 'gray' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    const team = teams[teamIndex];
    if (team && team.playerIds.length >= match.config.playersPerTeam) {
      const nextLetter = String.fromCharCode(65 + teams.length);
      const emoji = TEAM_EMOJIS[teams.length % TEAM_EMOJIS.length];
    const newTeam = { id: generateId(), name: `Time ${nextLetter}`, playerIds: [playerId], emoji, color: getNextTeamColor(teams) };
    setTeams(prev => [...prev, newTeam]);
      setToast({ message: `Time completo! Novo time criado: ${newTeam.name}`, type: 'info' });
      setShowQuickAddPlayerModal(teams.length);
    } else {
      setTeams(prev => prev.map((t, idx) => 
        idx === teamIndex ? { ...t, playerIds: [...t.playerIds, playerId] } : t
      ));
    }
  };

  // Ensure match indices are always valid
  useEffect(() => {
    if (teams.length === 0) {
      setMatch(prev => ({ ...prev, teamAIndex: 0, teamBIndex: 0 }));
      return;
    }
    
    setMatch(prev => {
      let newA = prev.teamAIndex;
      let newB = prev.teamBIndex;
      
      if (newA >= teams.length) newA = 0;
      if (newB >= teams.length) newB = teams.length > 1 ? 1 : 0;
      
      if (newA === newB && teams.length > 1) {
        newB = (newA + 1) % teams.length;
      }
      
      if (newA !== prev.teamAIndex || newB !== prev.teamBIndex) {
        return { ...prev, teamAIndex: newA, teamBIndex: newB };
      }
      return prev;
    });
  }, [teams.length]);

  const removePlayer = (id: string) => {
    const playerToRemove = players.find(p => p.id === id);
    if (!playerToRemove) return;

    setPlayers(players.filter(p => p.id !== id));
    setSessionPlayerIds(prev => prev.filter(pid => pid !== id));
    setPayments(prev => prev.filter(p => p.playerId !== id));
    
    setTeams(prev => {
      // Regroup all players from all teams to maintain order and fill gap
      const allPlayerIds = prev.flatMap(t => t.playerIds).filter(pid => pid !== id);
      const limit = match.config.playersPerTeam;
      const newTeams = [];
      
      for (let i = 0; i < allPlayerIds.length; i += limit) {
        const chunk = allPlayerIds.slice(i, i + limit);
        newTeams.push({
          id: `team-${Date.now()}-${Math.floor(i/limit)}`,
          name: `Time ${String.fromCharCode(65 + Math.floor(i/limit))}`,
          playerIds: chunk,
          color: Math.floor(i/limit) === 0 ? 'border-brand-primary' : Math.floor(i/limit) === 1 ? 'border-brand-secondary' : 'border-zinc-800'
        });
      }
      return newTeams;
    });
  };

  const removePlayerFromTeam = (tIndex: number, playerId: string, cascade: boolean = true) => {
    const isWinner = lastMatchResult && (
      (tIndex === lastMatchResult.teamAIndex && lastMatchResult.scoreA > lastMatchResult.scoreB) ||
      (tIndex === lastMatchResult.teamBIndex && lastMatchResult.scoreB > lastMatchResult.scoreA)
    );

    if (isWinner && cascade) {
      setReplacingPlayer({ teamIndex: tIndex, removedPlayerId: playerId });
      return;
    }

    if (!cascade) {
      setTeams(prev => {
        const newTeams = [...prev].map(t => ({ ...t, playerIds: [...t.playerIds] }));
        if (newTeams[tIndex]) {
          newTeams[tIndex].playerIds = newTeams[tIndex].playerIds.filter(id => id !== playerId);
        }
        return newTeams.filter(t => t.playerIds.length > 0);
      });
      return;
    }

    setTeams(prev => {
      // For Ordem de Chegada, we always regroup from start to maintain the queue
      const allPlayerIds = prev.flatMap(t => t.playerIds).filter(id => id !== playerId);
      const limit = match.config.playersPerTeam;
      const newTeams = [];
      
      for (let i = 0; i < allPlayerIds.length; i += limit) {
        const chunk = allPlayerIds.slice(i, i + limit);
        newTeams.push({
          id: `team-${Date.now()}-${Math.floor(i/limit)}`,
          name: `Time ${String.fromCharCode(65 + Math.floor(i/limit))}`,
          playerIds: chunk,
          color: Math.floor(i/limit) === 0 ? 'border-brand-primary' : Math.floor(i/limit) === 1 ? 'border-brand-secondary' : 'border-zinc-800'
        });
      }
      return newTeams;
    });
  };

  const updatePlayerName = (id: string, newName: string) => {
    if (!newName.trim()) return;
    const trimmedName = newName.trim();
    const currentPlayer = players.find(p => p.id === id);
    if (!currentPlayer) return;

    if (trimmedName.toLowerCase() !== currentPlayer.name.toLowerCase() && 
        players.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
      setDuplicatePlayerName({
        name: trimmedName,
        callback: (finalName) => {
          setPlayers(prev => prev.map(p => p.id === id ? { ...p, name: finalName.trim() } : p));
        }
      });
      return;
    }

    setPlayers(prev => prev.map(p => p.id === id ? { ...p, name: trimmedName } : p));
    setEditingPlayerId(null);
  };

  const updatePlayerPhoto = (id: string, photo: string) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, photo } : p));
  };

  const addAvailablePlayersToTeams = () => {
    const availablePlayers = players.filter(p => !teams.some(t => t.playerIds.includes(p.id)));
    if (availablePlayers.length === 0) {
      setToast({ message: "Não há mais jogadores para adicionar.", type: 'warning' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setTeams(prevTeams => {
      let currentTeams = [...prevTeams].map(t => ({ ...t, playerIds: [...t.playerIds] }));
      const limit = match.config.playersPerTeam;

      availablePlayers.forEach(player => {
        let lastTeam = currentTeams[currentTeams.length - 1];
        if (lastTeam && lastTeam.playerIds.length < limit) {
          lastTeam.playerIds.push(player.id);
        } else {
          const nextLetter = String.fromCharCode(65 + currentTeams.length);
          const emoji = TEAM_EMOJIS[currentTeams.length % TEAM_EMOJIS.length];
          currentTeams.push({
            id: generateId(),
            name: `Time ${nextLetter}`,
            playerIds: [player.id],
            emoji
          });
        }
      });
      return currentTeams;
    });
    setToast({ message: `${availablePlayers.length} jogadores adicionados aos times!`, type: 'info' });
    setTimeout(() => setToast(null), 3000);
  };

  const addTeam = () => {
    const nextLetter = String.fromCharCode(65 + teams.length);
    const emoji = TEAM_EMOJIS[teams.length % TEAM_EMOJIS.length];
    setTeams([...teams, { id: generateId(), name: `Time ${nextLetter}`, playerIds: [], emoji, color: getNextTeamColor(teams) }]);
    
    setToast({ message: `Novo time criado: Time ${nextLetter}`, type: 'info' });

    // Scroll to bottom after state update
    setTimeout(() => {
      if (mainRef.current) {
        mainRef.current.scrollTo({
          top: mainRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const removeTeam = (index: number) => {
    if (match.isActive && (index === match.teamAIndex || index === match.teamBIndex)) {
      setToast({ message: "Não é possível remover um time que está em campo.", type: 'warning' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    
    setTeams(teams.filter((_, i) => i !== index));
  };

  const moveTeam = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === teams.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newTeams = [...teams];
    const [movedTeam] = newTeams.splice(index, 1);
    newTeams.splice(newIndex, 0, movedTeam);

    // Update match indices to follow the teams
    let newTeamAIndex = match.teamAIndex;
    let newTeamBIndex = match.teamBIndex;

    if (match.teamAIndex === index) newTeamAIndex = newIndex;
    else if (match.teamAIndex === newIndex) newTeamAIndex = index;

    if (match.teamBIndex === index) newTeamBIndex = newIndex;
    else if (match.teamBIndex === newIndex) newTeamBIndex = index;

    setTeams(newTeams);
    setMatch(prev => ({ ...prev, teamAIndex: newTeamAIndex, teamBIndex: newTeamBIndex }));
  };

  const randomizeTeams = (playersPerTeam: number) => {
    setFlashingTeamIds([]);
    const availablePlayers = players.filter(p => p.isAvailable);
    if (playersPerTeam <= 0 || availablePlayers.length === 0) return;
    
    const shuffled = [...availablePlayers].sort(() => 0.5 - Math.random());
    
    // Update arrivedAt timestamps to match shuffled order
    const now = Date.now();
    setPlayers(prev => prev.map(p => {
      const shuffleIdx = shuffled.findIndex(s => s.id === p.id);
      if (shuffleIdx !== -1) {
        return { ...p, arrivedAt: now + shuffleIdx };
      }
      return p;
    }));

    const newTeams: Team[] = [];
    
    // Create full teams
    let currentIndex = 0;
    let teamCount = 0;
    
    while (currentIndex + playersPerTeam <= shuffled.length) {
      const teamPlayers = shuffled.slice(currentIndex, currentIndex + playersPerTeam);
      const teamLetter = String.fromCharCode(65 + teamCount);
      const emoji = TEAM_EMOJIS[teamCount % TEAM_EMOJIS.length];
      newTeams.push({
        id: generateId(),
        name: `Time ${teamLetter}`,
        playerIds: teamPlayers.map(p => p.id),
        emoji,
        color: getNextTeamColor(newTeams)
      });
      currentIndex += playersPerTeam;
      teamCount++;
    }
    
    // Handle leftovers - "criará automaticamente outra caixa de time com o jogador que sobrou da divisão"
    if (currentIndex < shuffled.length) {
      const leftoverPlayers = shuffled.slice(currentIndex);
      const teamLetter = String.fromCharCode(65 + teamCount);
      const emoji = TEAM_EMOJIS[teamCount % TEAM_EMOJIS.length];
      newTeams.push({
        id: generateId(),
        name: `Time ${teamLetter}`,
        playerIds: leftoverPlayers.map(p => p.id),
        emoji,
        color: getNextTeamColor(newTeams)
      });
    }
    
    // Ensure at least 2 teams for the match
    while (newTeams.length < 2) {
      const teamLetter = String.fromCharCode(65 + newTeams.length);
      const emoji = TEAM_EMOJIS[newTeams.length % TEAM_EMOJIS.length];
      newTeams.push({
        id: generateId(),
        name: `Time ${teamLetter}`,
        playerIds: [],
        emoji,
        color: getNextTeamColor(newTeams)
      });
    }
    
    setTeams(newTeams);
    setMatch(prev => ({
      ...prev,
      teamAIndex: 0,
      teamBIndex: 1
    }));
    setShowRandomizeModal(false);
  };

  const resetAllStats = () => {
    setPlayers(prev => prev.map(p => ({ ...p, goals: 0, assists: 0 })));
    setToast({ message: "Estatísticas zeradas com sucesso!", type: 'info' });
    setShowResetStatsConfirm(false);
  };

  const registerGoal = (team: 'A' | 'B', playerId: string, assistId?: string) => {
    const newEvent: MatchEvent = {
      id: generateId(),
      type: 'goal',
      team,
      playerId,
      assistId,
      timestamp: (match.config.duration * 60) - match.timeRemaining
    };

    setMatch(prev => {
      const newScoreA = team === 'A' ? prev.scoreA + 1 : prev.scoreA;
      const newScoreB = team === 'B' ? prev.scoreB + 1 : prev.scoreB;
      
      // Check goal limit
      const isFinished = (team === 'A' && newScoreA >= prev.config.goalLimit) || 
                         (team === 'B' && newScoreB >= prev.config.goalLimit);

      return {
        ...prev,
        scoreA: newScoreA,
        scoreB: newScoreB,
        events: [...prev.events, newEvent],
        isPaused: isFinished ? true : prev.isPaused,
        timeRemaining: isFinished ? prev.timeRemaining : prev.timeRemaining
      };
    });

    // Update player stats
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) return { ...p, goals: p.goals + 1 };
      if (p.id === assistId) return { ...p, assists: p.assists + 1 };
      return p;
    }));

    playCheer();

    // Trigger Goal Animation
    const scorer = players.find(p => p.id === playerId);
    const teamName = team === 'A' ? teams[match.teamAIndex]?.name : teams[match.teamBIndex]?.name;
    
    if (scorer) {
      sounds.playGoal();
      setShowGoalAnimation({ 
        scorerName: scorer.name, 
        teamName: teamName || (team === 'A' ? 'Time A' : 'Time B'),
        scorerPhoto: scorer.photo
      });

      // Confetti burst
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 3000 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      setTimeout(() => {
        setShowGoalAnimation(null);
      }, 4000);
    }

    setShowEventModal(null);
    setSelectedScorerId(null);
  };

  function finishMatch() {
    sounds.playFinishMatch();
    const scoreA = match.scoreA;
    const scoreB = match.scoreB;
    const teamAIndex = match.teamAIndex;
    const teamBIndex = match.teamBIndex;

    // Determine winner and loser for stats/history
    let winnerIndex = teamAIndex;
    let loserIndex = teamBIndex;
    if (scoreB > scoreA) {
      winnerIndex = teamBIndex;
      loserIndex = teamAIndex;
    } else if (scoreA === scoreB) {
      // In case of draw, no clear winner/loser for colors
      winnerIndex = -1;
      loserIndex = -1;
    }

    // Determine who stays and who leaves for queue rotation
    let teamToStayIndex = teamAIndex;
    let teamToLeaveIndex = teamBIndex;
    if (scoreB > scoreA) {
      teamToStayIndex = teamBIndex;
      teamToLeaveIndex = teamAIndex;
    } else if (scoreA === scoreB) {
      teamToStayIndex = teamAIndex;
      teamToLeaveIndex = -1; // Draw: no one leaves automatically
    }

    const result = {
      id: generateId(),
      teamAName: teams[teamAIndex]?.name || 'Time A',
      teamBName: teams[teamBIndex]?.name || 'Time B',
      scoreA,
      scoreB,
      teamAIndex,
      teamBIndex,
      winnerIndex,
      loserIndex,
      winnerId: winnerIndex !== -1 ? teams[winnerIndex]?.id : null,
      loserId: loserIndex !== -1 ? teams[loserIndex]?.id : null,
      events: match.events,
      timestamp: Date.now()
    };

    setLastMatchResult(result);
    setMatchHistory(prev => [result, ...prev].slice(0, 10));

    setMatch(prev => ({ 
      ...prev, 
      isActive: false, 
      isPaused: true,
      hasEnded: true,
    }));
    
    // Move leaving team to the end of the queue
    if (teamToLeaveIndex !== -1) {
      setTeams(prevTeams => {
        let newTeams = [...prevTeams];
        const teamAId = newTeams[teamAIndex]?.id;
        const teamBId = newTeams[teamBIndex]?.id;
        
        newTeams = newTeams.map(t => {
          if (t.id === teamAId) return { ...t, lastMatchStatus: scoreA === scoreB ? 'Empate' : scoreA > scoreB ? 'Vencedor' : 'Derrota' };
          if (t.id === teamBId) return { ...t, lastMatchStatus: scoreA === scoreB ? 'Empate' : scoreB > scoreA ? 'Vencedor' : 'Derrota' };
          return t;
        });

        const leavingTeam = newTeams.splice(teamToLeaveIndex, 1)[0];
        newTeams.push(leavingTeam);
        return newTeams;
      });

      setMatch(prev => {
        const newStayIndex = teamToStayIndex > teamToLeaveIndex ? teamToStayIndex - 1 : teamToStayIndex;
        const nextTeamIndex = newStayIndex === 0 ? 1 : 0;
        return {
          ...prev,
          teamAIndex: newStayIndex,
          teamBIndex: nextTeamIndex
        };
      });
    } else {
      // Draw case, neither leaves automatically, but we still need to set their status
      setTeams(prevTeams => {
        let newTeams = [...prevTeams];
        const teamAId = newTeams[teamAIndex]?.id;
        const teamBId = newTeams[teamBIndex]?.id;
        
        newTeams = newTeams.map(t => {
          if (t.id === teamAId || t.id === teamBId) {
            return { ...t, lastMatchStatus: 'Empate' };
          }
          return t;
        });
        return newTeams;
      });
    }

    // Visual effects
    const winners: string[] = [];
    const teamA = teams[match.teamAIndex];
    const teamB = teams[match.teamBIndex];
    
    if (teamA && teamB) {
      if (scoreA > scoreB) {
        winners.push(teamA.id);
      } else if (scoreB > scoreA) {
        winners.push(teamB.id);
      }
      setFlashingTeamIds(winners);
      
      setTimeout(() => {
        setFlashingTeamIds([]);
      }, 10000);
    }

    // Scroll to teams list
    setTimeout(() => {
      const teamsList = document.getElementById('teams-list-section');
      if (teamsList) {
        teamsList.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (mainRef.current) {
        mainRef.current.scrollTo({ top: mainRef.current.scrollHeight, behavior: 'smooth' });
      }
    }, 300);
    
    setTeamsTab('proximos');
    playWhistle();
  };

  const resetMatch = () => {
    setFlashingTeamIds([]);
    setMatch(prev => ({
      ...prev,
      scoreA: 0,
      scoreB: 0,
      timeRemaining: prev.config.duration * 60,
      events: [],
      isPaused: true,
      isActive: true,
      hasEnded: false
    }));
    setToast({ message: "Partida reiniciada!", type: 'info' });
    setTimeout(() => setToast(null), 3000);
  };

  const startNextMatch = (teamAIdx: number, teamBIdx: number, force: boolean = false) => {
    setFlashingTeamIds([]);
    if (teamAIdx === -1 || teamBIdx === -1) {
      setToast({ message: "Selecione dois times para a próxima partida.", type: 'warning' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    if (teamAIdx === teamBIdx) {
      setToast({ message: "Os times devem ser diferentes.", type: 'warning' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    
    const teamA = teams[teamAIdx];
    const teamB = teams[teamBIdx];

    if (teamA.playerIds.length !== teamB.playerIds.length) {
      const targetIdx = teamA.playerIds.length < teamB.playerIds.length ? teamAIdx : teamBIdx;
      const otherIdx = targetIdx === teamAIdx ? teamBIdx : teamAIdx;
      setEqualizerData({
        targetTeamIndex: targetIdx,
        requiredCount: teams[otherIdx].playerIds.length,
        otherTeamIndex: otherIdx
      });
      setShowEqualizerModal(true);
      return;
    }

    setTeams(prev => prev.map(team => {
      const { lastMatchStatus, ...rest } = team;
      return rest;
    }));

    setMatch(prev => ({
      ...prev,
      isActive: true,
      isPaused: true,
      hasEnded: false,
      timeRemaining: prev.config.duration * 60,
      scoreA: 0,
      scoreB: 0,
      events: [],
      startTime: Date.now(),
      teamAIndex: teamAIdx,
      teamBIndex: teamBIdx
    }));
    setShowMatchSettingsModal(false);
    setCurrentScreen('teams');
    setTeamsTab('historico');
  };

  const togglePayment = (playerId: string, field: string, amount: number) => {
    setPayments(prev => {
      const existing = prev.find(p => p.playerId === playerId && p.year === selectedYear);
      if (existing) {
        const newPayments = [...prev];
        const index = prev.indexOf(existing);
        const newMonths = { ...existing.months };
        newMonths[field] = newMonths[field] === amount ? 0 : amount;
        newPayments[index] = { ...existing, months: newMonths, monthlyFee: amount };
        return newPayments;
      } else {
        const newRecord: PaymentRecord = {
          playerId,
          year: selectedYear,
          months: { [field]: amount },
          monthlyFee: amount
        };
        return [...prev, newRecord];
      }
    });
  };

  const seedFinanceData = () => {
    const data = [
      { name: "Anastácio", ref2025: 0, Jan: 5, Fev: 5, Mar: 5 },
      { name: "Anderson", ref2025: 0, Jan: 5, Fev: 5, Mar: 5 },
      { name: "Bahia", ref2025: 0, Jan: 0, Fev: 0, Mar: 5 },
      { name: "Fabiano", ref2025: 0, Jan: 0, Fev: 5, Mar: 5 },
      { name: "Fiuza", ref2025: 0, Jan: 5, Fev: 5, Mar: 5 },
      { name: "Gabriel Silva", ref2025: 0, Jan: 0, Fev: 0, Mar: 5 },
      { name: "Gabriel Alves", ref2025: 0, Jan: 0, Fev: 0, Mar: 5 },
      { name: "Guilherme", ref2025: 0, Jan: 5, Fev: 5, Mar: 5 },
      { name: "Gustavo Gralha", ref2025: 0, Jan: 0, Fev: 0, Mar: 5 },
      { name: "Henrique", ref2025: 0, Jan: 5, Fev: 5, Mar: 5 },
      { name: "Isaac", ref2025: 0, Jan: 5, Fev: 5, Mar: 5 },
      { name: "Jadiel", ref2025: 0, Jan: 0, Fev: 0, Mar: 5 },
      { name: "Leonardo", ref2025: 0, Jan: 0, Fev: 0, Mar: 5 },
      { name: "Lenadro", ref2025: 0, Jan: 0, Fev: 0, Mar: 5 },
      { name: "Lucas Silva", ref2025: 0, Jan: 0, Fev: 0, Mar: 5 },
      { name: "Luiz", ref2025: 0, Jan: 0, Fev: 0, Mar: 5 },
      { name: "Lukinhas", ref2025: 0, Jan: 5, Fev: 5, Mar: 5 },
      { name: "Maranhão", ref2025: 0, Jan: 5, Fev: 5, Mar: 5 },
      { name: "Marcelo", ref2025: 0, Jan: 5, Fev: 5, Mar: 5 },
      { name: "Matheus Vieira", ref2025: 0, Jan: 5, Fev: 5, Mar: 5 },
      { name: "Neto", ref2025: 25, Jan: 5, Fev: 5, Mar: 5 },
      { name: "PH", ref2025: 0, Jan: 5, Fev: 5, Mar: 5 },
      { name: "Rodri", ref2025: 0, Jan: 0, Fev: 0, Mar: 5 },
      { name: "Renato", ref2025: 0, Jan: 0, Fev: 5, Mar: 5 },
      { name: "Reni", ref2025: 0, Jan: 0, Fev: 0, Mar: 5 },
      { name: "Rodolfo", ref2025: 0, Jan: 0, Fev: 0, Mar: 5 },
      { name: "Sales", ref2025: 0, Jan: 0, Fev: 5, Mar: 5 },
      { name: "Wanderson", ref2025: 0, Jan: 5, Fev: 5, Mar: 5 }
    ];

    const newPlayers = [...players];
    const newPayments = [...payments];

    data.forEach(item => {
      let fPlayer = newPlayers.find(p => p.name === item.name);
      if (!fPlayer) {
        fPlayer = {
          id: generateId(),
          name: item.name,
          level: 3,
          isGoalkeeper: false,
          goals: 0,
          assists: 0,
          isAvailable: true
        };
        newPlayers.push(fPlayer);
      }

      const existingPaymentIdx = newPayments.findIndex(p => p.playerId === fPlayer!.id);
      const paymentRecord: PaymentRecord = {
        playerId: fPlayer.id,
        year: 2026,
        monthlyFee: 5,
        months: {
          "Jan": item.Jan,
          "Fev": item.Fev,
          "Mar": item.Mar
        }
      };

      if (existingPaymentIdx >= 0) {
        newPayments[existingPaymentIdx] = paymentRecord;
      } else {
        newPayments.push(paymentRecord);
      }
    });

    setPlayers(newPlayers);
    setPayments(newPayments);
    setToast({ message: "Dados da imagem importados com sucesso!", type: 'info' });
    setTimeout(() => setToast(null), 3000);
  };

  const addYear = () => {
    const nextYear = Math.max(...availableYears) + 1;
    setAvailableYears(prev => [...prev, nextYear]);
    setSelectedYear(nextYear);
    setToast({ message: `Ano ${nextYear} adicionado!`, type: 'info' });
    setTimeout(() => setToast(null), 2000);
  };

  // --- UI Components ---

  const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  const NavItem = ({ screen, icon: Icon, label }: { screen: Screen, icon: any, label: string }) => {
    const isActive = currentScreen === screen;
    const screens: Screen[] = ['players', 'teams', 'ranking', 'finance'];
    return (
              <button 
                onClick={() => {
                  const currentIndex = screens.indexOf(currentScreen);
                  const targetIndex = screens.indexOf(screen);
                  if (currentIndex !== -1 && targetIndex !== -1) {
                    setSwipeDirection(targetIndex > currentIndex ? -1 : 1);
                  }
                  setCurrentScreen(screen);
                }}
                className="flex flex-col items-center justify-center flex-1 py-1 transition-all duration-300 relative group"
              >
                <motion.div
                  animate={isActive ? { scale: 1.1, y: -2 } : { scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'text-white' 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>
                <div className="flex justify-center w-full">
                  <span className={`text-[7px] uppercase tracking-[0.2em] mt-1 font-black transition-all duration-300 relative z-10 text-center ${
                    isActive 
                      ? 'text-white opacity-100' 
                      : 'text-white opacity-60 group-hover:opacity-100'
                  }`}>
                    {label}
                  </span>
                </div>
              </button>
    );
  };

  return (
    <div className="h-screen bg-brand-dark text-brand-text-primary font-sans overflow-hidden flex flex-col">
      
      {/* Logo Animation Overlay */}
      <AnimatePresence>
        {showLogoAnimation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[2000] bg-white flex flex-col items-center justify-center p-6`}
          >
            <SpinningBall size="lg" />
            <div className="mt-8 text-center flex flex-col items-center">
              <h1 className={`text-4xl font-black uppercase tracking-tighter mb-2 text-zinc-500`}>Sorteando</h1>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expense Modal */}
      <AnimatePresence>
        {showExpenseModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-zinc-100 rounded-[32px] p-6 w-full max-w-sm border border-zinc-200 shadow-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900">Nova Despesa</h3>
                <button onClick={() => setShowExpenseModal(false)} className="p-2 hover:bg-zinc-200 rounded-full transition-colors"><X size={20} /></button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1.5 block">Nome da Despesa</label>
                  <input 
                    autoFocus
                    value={newExpense.name}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Aluguel da quadra"
                    className="w-full p-4 bg-zinc-200 rounded-2xl outline-none focus:ring-2 ring-[#1E3D2F]/20 font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1.5 block">Valor (R$)</label>
                  <input 
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="00"
                    className="w-full p-4 bg-zinc-200 rounded-2xl outline-none focus:ring-2 ring-[#1E3D2F]/20 font-black text-xl"
                  />
                </div>
                
                <button 
                  onClick={() => {
                    if (!newExpense.name || !newExpense.amount) return;
                    setExpenses(prev => [...prev, {
                      id: generateId(),
                      name: newExpense.name,
                      amount: parseInt(newExpense.amount),
                      date: Date.now()
                    }]);
                    setNewExpense({ name: '', amount: '' });
                    setShowExpenseModal(false);
                  }}
                  className="w-full py-4 bg-[#1E3D2F] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:opacity-90 transition-all active:scale-95"
                >
                  Confirmar Despesa
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showGoalAnimation && (
          <GoalCelebration 
            isOpen={!!showGoalAnimation} 
            scorerName={showGoalAnimation.scorerName} 
            teamName={showGoalAnimation.teamName} 
            scorerPhoto={showGoalAnimation.scorerPhoto}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isInitializing && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 flex flex-col items-center justify-center p-6"
          >
            <SpinningBall size="lg" />
            <div className="mt-8 text-center flex flex-col items-center">
              <FutQuinaLogo size="lg" className="mb-2" colorClass="text-white font-black" />
              <p className="text-sm font-bold uppercase tracking-widest text-zinc-300">Gestão de peladas</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Not Enough Players Modal */}
      <AnimatePresence>
        {showNotEnoughPlayersModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md p-8 rounded-lg bg-brand-card border border-brand-primary/20 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-brand-gradient rounded-lg flex items-center justify-center mb-6 shadow shadow-black/20">
                <Users size={40} className="text-black" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tighter mb-4 text-brand-primary">Jogadores Insuficientes</h3>
              <p className="text-sm text-brand-text-secondary mb-8 leading-relaxed">
                Você não tem jogadores suficientes criados para formar no mínimo dois times com a quantidade configurada.
              </p>
              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => setShowNotEnoughPlayersModal(false)}
                  className={`flex-1 py-4 font-black uppercase tracking-widest text-xs rounded-md transition-all ${
                    theme === 'light' 
                      ? 'bg-zinc-200 text-black hover:bg-zinc-300' 
                      : 'bg-brand-dark text-white hover:bg-white/5'
                  }`}
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    setShowNotEnoughPlayersModal(false);
                    setCurrentScreen('players');
                  }}
                  className="flex-1 py-4 bg-brand-gradient text-black font-black uppercase tracking-widest text-xs rounded-md shadow shadow-black/20 hover:opacity-90 transition-all active:scale-95"
                >
                  Criar mais jogadores
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="p-6 rounded-3xl shadow-md flex flex-col items-center gap-6 border w-full max-w-xs bg-zinc-100 border-zinc-300"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-brand-primary/20`}>
                <Info size={24} className="text-brand-primary" />
              </div>
              <p className="text-sm font-black tracking-widest leading-tight text-center text-zinc-500">
                {toast.message}
              </p>
              <button 
                onClick={() => setToast(null)}
                className="w-full py-3 bg-brand-gradient text-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-sm hover:opacity-90 transition-all active:scale-95 text-center mt-2"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        className="h-full flex flex-col overflow-hidden"
      >
        {/* Sticky Header and Tabs Container */}
        <div className={`sticky top-0 z-50 bg-brand-dark border-b border-brand-border/10 ${isPrintMode ? 'hidden' : ''}`}>
        {/* Header */}
        <header className="px-6 py-4 flex justify-start items-center">
          <div className="flex items-center gap-3">
            <SpinningBall size="sm" spin={false} />
            <FutQuinaLogo size="md" style={{ color: '#ffffff' }} colorClass="" />
          </div>
        </header>

        {/* Tabs for Teams */}
        {currentScreen === 'teams' && (
          <div className="px-6 pb-4">
            <div className="flex bg-brand-dark p-1 rounded-[24px] border border-brand-border">
              <button 
                onClick={() => navigateTeamsTab('configuracao')}
                className={`w-12 py-2 flex items-center justify-center rounded-[20px] transition-all ${teamsTab === 'configuracao' ? 'bg-brand-surface-light text-brand-text-primary shadow-sm' : 'text-zinc-500 hover:text-brand-text-primary'}`}
              >
                <Settings size={14} className="text-zinc-500" />
              </button>
              <button 
                onClick={() => navigateTeamsTab('chegada')}
                className={`flex-1 py-2 flex items-center justify-center rounded-[20px] transition-all ${teamsTab === 'chegada' ? 'bg-gradient-to-t from-brand-surface-light to-brand-surface/50 text-brand-text-primary shadow-sm' : 'text-brand-text-secondary hover:text-brand-text-primary'}`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-center w-full">Chegada</span>
              </button>
              <button 
                onClick={() => navigateTeamsTab('historico')}
                className={`flex-1 py-2 flex items-center justify-center rounded-[20px] transition-all ${teamsTab === 'historico' ? 'bg-gradient-to-t from-brand-surface-light to-brand-surface/50 text-brand-text-primary shadow-sm' : 'text-brand-text-secondary hover:text-brand-text-primary'}`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-center w-full">Confrontos</span>
              </button>
              <button 
                onClick={() => navigateTeamsTab('proximos')}
                className={`flex-1 py-2 flex items-center justify-center rounded-[20px] transition-all ${teamsTab === 'proximos' ? 'bg-gradient-to-t from-brand-surface-light to-brand-surface/50 text-brand-text-primary shadow-sm' : 'text-brand-text-secondary hover:text-brand-text-primary'}`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-center w-full">Próximos</span>
              </button>
            </div>
          </div>
        )}

        {/* Tabs for Finance */}
        {currentScreen === 'finance' && !isPrintMode && (
          <div className="px-6 pb-4">
            <div className="flex bg-brand-dark p-1 rounded-[24px] border border-brand-border">
              <button 
                onClick={() => setFinanceSubScreen('mensalidade')} 
                className={`flex-1 py-2 flex items-center justify-center rounded-[20px] transition-all ${financeSubScreen === 'mensalidade' ? 'bg-gradient-to-t from-brand-surface-light to-brand-surface/50 text-brand-text-primary shadow-sm' : 'text-brand-text-secondary hover:text-brand-text-primary'}`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-center w-full">Mensalidade</span>
              </button>
              <button 
                onClick={() => setFinanceSubScreen('balanco')} 
                className={`flex-1 py-2 flex items-center justify-center rounded-[20px] transition-all ${financeSubScreen === 'balanco' ? 'bg-gradient-to-t from-brand-surface-light to-brand-surface/50 text-brand-text-primary shadow-sm' : 'text-brand-text-secondary hover:text-brand-text-primary'}`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-center w-full">Balanço</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main 
        ref={mainRef} 
        className={`flex-1 overflow-y-auto pb-24 ${isPrintMode ? 'p-0 pb-0 bg-white text-black' : ''}`}
      >
        <AnimatePresence mode="wait">
          {currentScreen === 'players' && !isPrintMode && (
            <motion.div 
              key="players"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={(_, info) => {
                if (info.offset.x < -100) {
                  setCurrentScreen('teams');
                  setTeamsTab(match.isActive ? 'historico' : 'proximos');
                }
              }}
              className="p-6 space-y-6"
            >
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="space-y-6">
                    <section className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-[#464656]">Gerenciar jogadores</h2>
                        <div className="flex gap-2 w-full sm:w-auto">
                          {players.length >= 2 && (
                            <button 
                              onClick={() => {
                                setCurrentScreen('teams');
                                setTeamsTab('configuracao');
                                if (!firstSetupDone) {
                                  setIsInitialSetupFlow(true);
                                }
                              }}
                              className="flex-1 sm:flex-none px-4 py-2.5 bg-brand-gradient text-black text-[10px] font-black uppercase tracking-widest rounded-2xl shadow shadow-black/20 hover:opacity-90 transition-all active:scale-95 glass-3d flex items-center justify-center gap-2"
                            >
                              Configurar Partida
                            </button>
                          )}
                        </div>
                      </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Nome do jogador..."
                      className={`flex-1 px-4 py-2 rounded-2xl border-none outline-none transition-all bg-brand-card focus:ring-2 ring-brand-primary/50 text-sm`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addPlayer(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <button 
                      onClick={handleImportContacts}
                      className="p-2 bg-brand-card text-brand-text-primary rounded-2xl shadow hover:opacity-90 transition-all active:scale-95 flex items-center justify-center aspect-square"
                      title="Importar dos Contatos"
                    >
                      <Contact size={18} />
                    </button>
                    <button 
                      onClick={() => {
                        const input = document.querySelector('input') as HTMLInputElement;
                        addPlayer(input.value);
                        input.value = '';
                      }}
                      className="p-2 bg-brand-gradient text-black rounded-2xl shadow  hover:opacity-90 transition-all active:scale-95 glass-3d flex items-center justify-center aspect-square"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <textarea 
                    placeholder="Cole aqui sua lista do WhatsApp (ex: 1. João, 2. Maria...)"
                    className={`w-full h-24 px-4 py-3 rounded-2xl border-none outline-none transition-all text-xs resize-none bg-brand-card/50 text-brand-text-secondary focus:ring-2 ring-brand-primary/30`}
                    onChange={(e) => {
                      if (e.target.value.includes('\n') || e.target.value.length > 10) {
                        addBulkPlayers(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <div 
                    className={`absolute right-4 bottom-3 text-brand-text-secondary cursor-pointer hover:text-brand-primary transition-colors flex items-center gap-1`}
                    onClick={async () => {
                      try {
                        const text = await navigator.clipboard.readText();
                        if (text) {
                          addBulkPlayers(text);
                          setToast({ message: "Lista colada com sucesso!", type: 'success' });
                          setTimeout(() => setToast(null), 2000);
                        }
                      } catch (err) {
                        setToast({ message: "Permissão de área de transferência negada.", type: 'warning' });
                        setTimeout(() => setToast(null), 3000);
                      }
                    }}
                  >
                    <ClipboardPaste size={14} />
                    <span className="text-[10px] font-bold uppercase">Caixa Inteligente</span>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl overflow-hidden bg-brand-card/50 border border-brand-border">
                {players.length === 0 ? (
                  <div className="text-center py-12 opacity-50 text-brand-text-secondary text-xs normal-case">Nenhum jogador adicionado ainda.</div>
                ) : (
                  <div className="divide-y divide-brand-border">
                    {players.map((player) => (
                      <motion.div 
                        layout
                        key={`player-list-${player.id}`}
                        className={`flex items-center justify-between p-4 transition-all cursor-pointer hover:from-brand-primary/10 hover:to-transparent active:bg-brand-primary/15 bg-transparent`}
                        onClick={() => {
                          if (editingPlayerId !== player.id) {
                            setPlayerManagementModal(player);
                          }
                        }}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#2F5D50]/10 text-[#2F5D50] border border-[#2F5D50] overflow-hidden">
                            {player.photo ? (
                              <img src={player.photo} alt={player.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <User size={16} />
                            )}
                          </div>
                          {editingPlayerId === player.id ? (
                            <input 
                              autoFocus
                              defaultValue={player.name}
                              className={`flex-1 bg-brand-surface/30 border-b border-brand-primary outline-none text-sm font-medium py-1 px-2 rounded-t-sm`}
                              onClick={(e) => e.stopPropagation()}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') updatePlayerName(player.id, e.currentTarget.value);
                                if (e.key === 'Escape') setEditingPlayerId(null);
                              }}
                              onBlur={(e) => updatePlayerName(player.id, e.target.value)}
                            />
                          ) : (
                            <div className="flex flex-col flex-1">
                              <span className="text-xs font-medium">{player.name}</span>
                            </div>
                          )}
                        </div>
                        {editingPlayerId !== player.id && (
                          <div className="flex items-center gap-1 opacity-40">
                            <ChevronRight size={16} />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </section>

              {players.length > 5 && (
                <div className="flex justify-center pb-4 w-full">
                  {!showClearConfirm ? (
                    <button 
                      onClick={() => setShowClearConfirm(true)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-orange-900/20 text-orange-600 rounded-2xl border border-orange-600/30 hover:bg-orange-900/30 transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest glass-3d"
                    >
                      <Trash2 size={14} className="text-orange-600" />
                      Apagar todos os jogadores
                    </button>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto animate-in fade-in zoom-in duration-200">
                      <button 
                        onClick={() => {
                          setPlayers([]);
                          setSessionPlayerIds([]);
                          setShowClearConfirm(false);
                        }}
                        className="w-full sm:w-auto px-6 py-3 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow shadow-red-500/20 active:scale-95 transition-all"
                      >
                        Confirmar Exclusão
                      </button>
                      <button 
                        onClick={() => setShowClearConfirm(false)}
                        className="w-full sm:w-auto px-6 py-3 bg-black/10 text-brand-text-primary rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

          {currentScreen === 'teams' && !isPrintMode && (
            <motion.div 
              key={`teams-${teamsTab}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={(_, info) => {
                const tabs = ['configuracao', 'chegada', 'historico', 'proximos'];
                const currentIndex = tabs.indexOf(teamsTab as any);
                if (info.offset.x > 100) {
                  if (currentIndex > 0) {
                    navigateTeamsTab(tabs[currentIndex - 1] as any);
                  } else {
                    setCurrentScreen('players');
                  }
                } else if (info.offset.x < -100) {
                  if (currentIndex < tabs.length - 1) {
                    navigateTeamsTab(tabs[currentIndex + 1] as any);
                  } else {
                    setCurrentScreen('ranking');
                  }
                }
              }}
              className="px-6 pb-6 pt-4 space-y-4 min-h-full bg-brand-dark flex flex-col"
            >
                  <div id="teams-list-section" className="max-w-5xl mx-auto w-full space-y-4">
                    {teamsTab === 'configuracao' ? (
                      <div className="space-y-6 bg-zinc-100 p-6 rounded-3xl border border-zinc-200">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900">Configuração</h3>
                        </div>
                        
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Tempo (Minutos)</label>
                              <input 
                                type="number" 
                                defaultValue={match.config.duration}
                                min={1}
                                id="tab-match-duration"
                                className="w-full p-4 rounded-2xl outline-none font-bold bg-white text-zinc-900 border border-zinc-200 focus:border-black transition-all text-sm"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Limite de Gols</label>
                              <input 
                                type="number" 
                                defaultValue={match.config.goalLimit}
                                min={1}
                                id="tab-match-goals"
                                className="w-full p-4 rounded-2xl outline-none font-bold bg-white text-zinc-900 border border-zinc-200 focus:border-black transition-all text-sm"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Jogadores por Time</label>
                              <input 
                                type="number" 
                                defaultValue={match.config.playersPerTeam}
                                min={1}
                                id="tab-match-players"
                                className="w-full p-4 rounded-2xl outline-none font-bold bg-white text-zinc-900 border border-zinc-200 focus:border-black transition-all text-sm"
                              />
                            </div>
                          </div>

                          <button 
                            onClick={() => {
                              const duration = parseInt((document.getElementById('tab-match-duration') as HTMLInputElement).value) || 10;
                              const goals = parseInt((document.getElementById('tab-match-goals') as HTMLInputElement).value) || 5;
                              const playersCount = parseInt((document.getElementById('tab-match-players') as HTMLInputElement).value) || 5;
                              
                              if (duration <= 0 || goals <= 0 || playersCount <= 0) {
                                setToast({ message: "As configurações devem ser maiores que zero.", type: 'warning' });
                                setTimeout(() => setToast(null), 3000);
                                return;
                              }

                              const playersPerTeamChanged = playersCount !== match.config.playersPerTeam;

                              if (playersPerTeamChanged || isInitialSetupFlow) {
                                if (players.length < playersCount * 2) {
                                  setShowNotEnoughPlayersModal(true);
                                  return;
                                }

                                if (isInitialSetupFlow) {
                                  // For first time setup, ensure everyone is absent
                                  setPlayers(prev => prev.map(p => ({ ...p, isAvailable: false, arrivedAt: undefined })));
                                  setTeams([]); // Clear teams since everyone is now absent
                                  setIsInitialSetupFlow(false);
                                  setFirstSetupDone(true);
                                  safeLocalStorage.setItem(`futquina_first_setup_done_${groupId}`, 'true');
                                  setShowSetupGuide(true);
                                }

                                // Reset teams and match if size changed
                                if (playersPerTeamChanged) {
                                  setTeams([]);
                                }
                                
                                setMatch(prev => ({ 
                                  ...prev, 
                                  config: { duration, goalLimit: goals, playersPerTeam: playersCount },
                                  timeRemaining: duration * 60,
                                  isActive: false,
                                  isPaused: true,
                                  hasEnded: false,
                                  teamAIndex: -1,
                                  teamBIndex: -1,
                                  scoreA: 0,
                                  scoreB: 0,
                                  events: []
                                }));
                                setTeamsTab('chegada');
                              } else {
                                // Only duration or goal limit changed
                                setMatch(prev => ({
                                  ...prev,
                                  config: { ...prev.config, duration, goalLimit: goals },
                                  timeRemaining: (!prev.isActive || prev.hasEnded) ? duration * 60 : prev.timeRemaining
                                }));
                                setToast({ message: "Configurações aplicadas!", type: 'success' });
                                setTimeout(() => setToast(null), 3000);
                              }
                              
                              // Sync session players without resetting isAvailable
                              setSessionPlayerIds(players.map(p => p.id));
                            }}
                            className="w-full py-4 bg-brand-gradient text-black font-black uppercase tracking-widest text-xs rounded-2xl shadow hover:opacity-90 transition-all active:scale-95 glass-3d"
                          >
                            Aplicar Configurações
                          </button>
                        </div>
                      </div>
                    ) : teamsTab === 'chegada' ? (
                      <div className="space-y-6 bg-zinc-100 p-6 rounded-3xl border border-zinc-200">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900">Ordem de Chegada</h3>
                          <div className="flex flex-col sm:flex-row items-center gap-3">
                            {players.filter(p => p.isAvailable).length < match.config.playersPerTeam * 2 && (
                                <button
                                  onClick={() => {
                                    const now = Date.now();
                                    setPlayers(prev => prev.map((pl, idx) => ({ ...pl, isAvailable: true, arrivedAt: now + idx })));
                                    
                                    setTeams(prevTeams => {
                                      // Gather all current session players in random or current string order, maybe just use all session players
                                      const allPlayerIds = players.filter(p => sessionPlayerIds.includes(p.id)).map(p => p.id);
                                      const newTeams: Team[] = [];
                                      const playersPerTeam = match.config.playersPerTeam;
                                      for (let i = 0; i < allPlayerIds.length; i += playersPerTeam) {
                                        const teamPlayers = allPlayerIds.slice(i, i + playersPerTeam);
                                        const teamIndex = Math.floor(i / playersPerTeam);
                                        const teamLetter = String.fromCharCode(65 + teamIndex);
                                        newTeams.push({
                                          id: generateId(),
                                          name: `Time ${teamLetter}`,
                                          playerIds: teamPlayers,
                                          emoji: TEAM_EMOJIS[teamIndex % TEAM_EMOJIS.length],
                                          color: TEAM_COLORS[teamIndex % TEAM_COLORS.length]
                                        });
                                      }
                                      return newTeams;
                                    });
                                  }}
                                  className="px-3 py-1.5 text-[8px] sm:px-4 sm:py-2 sm:text-[10px] bg-gradient-to-b from-green-700 to-green-900 text-white font-black uppercase tracking-widest rounded-full shadow shadow-black/20 hover:opacity-90 transition-all active:scale-95 flex items-center gap-1.5"
                                >
                                  <CheckCircle2 size={12} />
                                  Todos Presentes
                                </button>
                            )}
                            {players.filter(p => p.isAvailable).length >= match.config.playersPerTeam * 2 && (
                              <button
                                onClick={() => {
                                  // Ensure teams are generated from all available players in arrival order
                                  const availablePlayers = [...players]
                                    .filter(p => p.isAvailable)
                                    .sort((a, b) => (a.arrivedAt || 0) - (b.arrivedAt || 0));
                                  
                                  const updatedPlayerIds = availablePlayers.map(p => p.id);
                                  const uniquePlayerIds: string[] = [];
                                  const seenIds = new Set<string>();
                                  updatedPlayerIds.forEach(id => {
                                    if (!seenIds.has(id)) {
                                      uniquePlayerIds.push(id);
                                      seenIds.add(id);
                                    }
                                  });

                                  const newTeams: Team[] = [];
                                  const playersPerTeam = match.config.playersPerTeam;
                                  
                                  for (let i = 0; i < uniquePlayerIds.length; i += playersPerTeam) {
                                    const teamPlayers = uniquePlayerIds.slice(i, i + playersPerTeam);
                                    const teamIndex = Math.floor(i / playersPerTeam);
                                    const teamLetter = String.fromCharCode(65 + teamIndex);
                                    newTeams.push({
                                      id: generateId(),
                                      name: `Time ${teamLetter}`,
                                      playerIds: teamPlayers,
                                      emoji: TEAM_EMOJIS[teamIndex % TEAM_EMOJIS.length],
                                      color: TEAM_COLORS[teamIndex % TEAM_COLORS.length]
                                    });
                                  }
                                  
                                  setTeams(newTeams);
                                  
                                  // Pre-select first two complete teams for a match
                                  if (newTeams.length >= 2) {
                                    setMatch(prev => ({ 
                                      ...prev, 
                                      teamAIndex: 0, 
                                      teamBIndex: 1,
                                      scoreA: 0,
                                      scoreB: 0,
                                      timeRemaining: prev.config.duration * 60,
                                      isActive: false,
                                      isPaused: true,
                                      hasEnded: false,
                                      events: []
                                    }));
                                  }
                                  
                                  setTeamsTab('proximos');
                                }}
                                className="px-4 py-2 bg-gradient-to-b from-green-700 to-green-900 text-white font-black uppercase tracking-widest text-[10px] rounded-full shadow shadow-black/20 hover:opacity-90 transition-all active:scale-95 flex items-center gap-1.5"
                              >
                                <CheckCircle2 size={12} />
                                Pronto
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {players.filter(p => sessionPlayerIds.includes(p.id)).length === 0 ? (
                            <div className="col-span-full py-12 text-center border border-dashed border-white/5 rounded-xl flex flex-col items-center gap-4">
                              <p className="text-base text-brand-text-secondary normal-case">Nenhum jogador na sessão</p>
                              <button 
                                onClick={() => {
                                  if (players.length < 2) {
                                    setCurrentScreen('players');
                                    setPlayersTab('jogadores');
                                  } else {
                                    setCurrentScreen('teams');
                                    setTeamsTab('configuracao');
                                  }
                                }}
                                className="px-6 py-3 bg-brand-gradient text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow shadow-black/20 hover:opacity-90 transition-all active:scale-95"
                              >
                                {players.length < 2 ? 'Criar Jogadores' : 'Configurar Partida'}
                              </button>
                            </div>
                          ) : (
                            players.filter(p => sessionPlayerIds.includes(p.id)).sort((a, b) => {
                              if (a.isAvailable && !b.isAvailable) return -1;
                              if (!a.isAvailable && b.isAvailable) return 1;
                              if (a.isAvailable && b.isAvailable) return (a.arrivedAt || 0) - (b.arrivedAt || 0);
                              return a.name.localeCompare(b.name);
                            }).map((p) => (
                              <button 
                                key={`arrival-player-below-${p.id}`}
                                onClick={() => {
                                  const isNowAvailable = !p.isAvailable;
                                  setPlayers(prev => prev.map(pl => pl.id === p.id ? { ...pl, isAvailable: isNowAvailable, arrivedAt: isNowAvailable ? Date.now() : undefined } : pl));

                                  if (isNowAvailable) {
                                    setTeams(prevTeams => {
                                      // 1. Get all players currently in teams, deduplicated
                                      const allPlayerIds = prevTeams.flatMap(t => t.playerIds);
                                      if (allPlayerIds.includes(p.id)) return prevTeams;
                                      
                                      // 2. Add new player to the end
                                      const updatedPlayerIds = [...allPlayerIds, p.id];
                                      // 3. Re-group into teams of N
                                      const newTeams: Team[] = [];
                                      const playersPerTeam = match.config.playersPerTeam;
                                      for (let i = 0; i < updatedPlayerIds.length; i += playersPerTeam) {
                                        const teamPlayers = updatedPlayerIds.slice(i, i + playersPerTeam);
                                        const teamIndex = Math.floor(i / playersPerTeam);
                                        const teamLetter = String.fromCharCode(65 + teamIndex);
                                        newTeams.push({
                                          id: generateId(),
                                          name: `Time ${teamLetter}`,
                                          playerIds: teamPlayers,
                                          emoji: TEAM_EMOJIS[teamIndex % TEAM_EMOJIS.length],
                                          color: TEAM_COLORS[teamIndex % TEAM_COLORS.length]
                                        });
                                      }
                                      return newTeams;
                                    });
                                  } else {
                                    setTeams(prevTeams => {
                                      // 1. Get all players currently in teams
                                      const allPlayerIds = prevTeams.flatMap(t => t.playerIds);
                                      // 2. Remove player
                                      const updatedPlayerIds = allPlayerIds.filter(id => id !== p.id);
                                      // 3. Re-group into teams of N
                                      const newTeams: Team[] = [];
                                      const playersPerTeam = match.config.playersPerTeam;
                                      for (let i = 0; i < updatedPlayerIds.length; i += playersPerTeam) {
                                        const teamPlayers = updatedPlayerIds.slice(i, i + playersPerTeam);
                                        const teamIndex = Math.floor(i / playersPerTeam);
                                        const teamLetter = String.fromCharCode(65 + teamIndex);
                                        newTeams.push({
                                          id: generateId(),
                                          name: `Time ${teamLetter}`,
                                          playerIds: teamPlayers,
                                          emoji: TEAM_EMOJIS[teamIndex % TEAM_EMOJIS.length],
                                          color: TEAM_COLORS[teamIndex % TEAM_COLORS.length]
                                        });
                                      }
                                      return newTeams;
                                    });
                                  }
                                }}
                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                  p.isAvailable 
                                    ? 'bg-brand-primary border-brand-primary text-black' 
                                    : 'bg-zinc-200 border-zinc-300 opacity-100'
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-full ${p.isAvailable ? 'bg-black/10' : 'bg-zinc-100'} flex items-center justify-center overflow-hidden border ${p.isAvailable ? 'border-black/20' : 'border-zinc-300'}`}>
                                  {p.photo ? (
                                    <img src={p.photo} alt="P" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  ) : (
                                    <User size={14} className={p.isAvailable ? 'text-black' : 'text-zinc-600'} />
                                  )}
                                </div>
                                <div className="flex-1 text-left">
                                  <div className={`text-[11px] sm:text-xs font-black uppercase tracking-tight ${p.isAvailable ? 'text-black' : 'text-zinc-500'}`}>{p.name}</div>
                                  <div className={`text-[8px] font-bold uppercase ${p.isAvailable ? 'text-black/60' : 'text-zinc-400'}`}>{p.isAvailable ? 'Presente' : 'Ausente'}</div>
                                </div>
                                {p.isAvailable && <CheckCircle2 size={16} className="text-black" />}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    ) : teamsTab === 'historico' ? (
                      <div className="space-y-6 bg-zinc-100 p-6 rounded-3xl border border-zinc-200">
                        {!match.isActive ? (
                          <div className="py-12 text-center border border-dashed border-white/5 rounded-3xl flex flex-col items-center gap-4">
                            {players.filter(p => p.isAvailable).length === 0 ? (
                              <>
                                <p className="text-base text-zinc-500 normal-case">
                                  Nenhum jogador presente
                                </p>
                                <button
                                  onClick={() => {
                                    if (players.length < 2) {
                                      setCurrentScreen('players');
                                      setPlayersTab('jogadores');
                                    } else {
                                      setTeamsTab('configuracao');
                                      if (!firstSetupDone) {
                                        setIsInitialSetupFlow(true);
                                      }
                                    }
                                  }}
                                  className="px-4 py-2 bg-brand-gradient text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg hover:opacity-90 transition-all active:scale-95"
                                >
                                  {players.length < 2 ? 'Criar Jogadores' : 'Configurar Partida'}
                                </button>
                              </>
                            ) : players.filter(p => p.isAvailable).length < match.config.playersPerTeam * 2 ? (
                              <>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                                  Faltam {match.config.playersPerTeam * 2 - players.filter(p => p.isAvailable).length} jogadores para iniciar
                                </p>
                                <button
                                  onClick={() => setTeamsTab('chegada')}
                                  className="px-4 py-2 bg-brand-gradient text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg hover:opacity-90 transition-all active:scale-95"
                                >
                                  Confirmar Chegada
                                </button>
                              </>
                            ) : (
                              <>
                                {lastMatchResult ? (
                                  <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto mb-2 space-y-4 bg-zinc-200/50 p-6 rounded-[32px] border border-zinc-300">
                                    <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Última Partida</p>
                                    <div className="flex items-center justify-between gap-4 px-2 py-2 w-full">
                                      <div className="flex-1 flex flex-col items-center text-center space-y-1">
                                        <div className="w-10 h-10 flex items-center justify-center shrink-0">
                                          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                                            <defs>
                                              <linearGradient id="shield-grad-A-last" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor={teams[lastMatchResult.teamAIndex]?.color || TEAM_COLORS[0]} />
                                                <stop offset="100%" stopColor={teams[lastMatchResult.teamAIndex]?.color || TEAM_COLORS[0]} stopOpacity="0.85" />
                                              </linearGradient>
                                            </defs>
                                            <path fill="url(#shield-grad-A-last)" d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                                            <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" fill="white" opacity="0.15" />
                                          </svg>
                                        </div>
                                        <div className="text-4xl font-black text-black tabular-nums tracking-tighter leading-none mt-2">
                                          {lastMatchResult.scoreA}
                                        </div>
                                      </div>
                                      
                                      <div className="text-sm font-black text-brand-text-secondary opacity-50 uppercase tracking-widest">vs</div>
                                      
                                      <div className="flex-1 flex flex-col items-center text-center space-y-1">
                                        <div className="w-10 h-10 flex items-center justify-center shrink-0">
                                          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                                            <defs>
                                              <linearGradient id="shield-grad-B-last" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor={teams[lastMatchResult.teamBIndex]?.color || TEAM_COLORS[1]} />
                                                <stop offset="100%" stopColor={teams[lastMatchResult.teamBIndex]?.color || TEAM_COLORS[1]} stopOpacity="0.85" />
                                              </linearGradient>
                                            </defs>
                                            <path fill="url(#shield-grad-B-last)" d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                                            <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" fill="white" opacity="0.15" />
                                          </svg>
                                        </div>
                                        <div className="text-4xl font-black text-black tabular-nums tracking-tighter leading-none mt-2">
                                          {lastMatchResult.scoreB}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Scorers display */}
                                    <div className="w-full space-y-2 mt-2 pt-4 border-t border-zinc-300">
                                      {(lastMatchResult.events || []).map((event, idx) => {
                                        const p = players.find(pl => pl.id === event.playerId);
                                        const a = event.assistId ? players.find(pl => pl.id === event.assistId) : null;
                                        if (!p) return null;
                                        return (
                                          <div 
                                            key={`last-game-event-${event.id || idx}`} 
                                            className="flex items-center justify-between gap-2 p-1.5 rounded-lg border border-black/5"
                                            style={{ 
                                              backgroundColor: (event.team === 'A' ? teams[lastMatchResult.teamAIndex]?.color : teams[lastMatchResult.teamBIndex]?.color) === '#1a1a1a' 
                                                ? '#00000010' 
                                                : (event.team === 'A' ? teams[lastMatchResult.teamAIndex]?.color : teams[lastMatchResult.teamBIndex]?.color || TEAM_COLORS[0]) + '15'
                                            }}
                                          >
                                            <div className="flex items-center gap-1.5 overflow-hidden">
                                              <div className="w-4 h-4 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 border border-zinc-300">
                                                {p.photo ? <img src={p.photo} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" /> : <User size={8} className="text-black" />}
                                              </div>
                                              <span className="text-[9px] font-black uppercase truncate text-zinc-800">{p.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                              {a && (
                                                <div className="flex items-center gap-1 text-[8px] font-bold text-emerald-800" title={`Assistência: ${a.name}`}>
                                                  <Footprints size={8} /> <span>{a.name.split(' ')[0]}</span>
                                                </div>
                                              )}
                                              <div className="px-1.5 py-0.5 rounded-sm bg-black text-white text-[8px] font-black uppercase tracking-widest">GOL</div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-xs font-medium text-zinc-400">
                                    Agora você está pronto para iniciar uma partida
                                  </p>
                                )}
                                <button
                                  onClick={() => {
                                    // Select first two teams if available
                                    if (teams.length >= 2) {
                                      setMatch(prev => ({ ...prev, teamAIndex: 0, teamBIndex: 1 }));
                                    }
                                    setTeamsTab('proximos');
                                  }}
                                  className="px-4 py-2 bg-brand-gradient text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg hover:opacity-90 transition-all active:scale-95"
                                >
                                  Ir para Próximos
                                </button>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-8 relative">
                            {match.hasEnded && (
                              <div className="absolute inset-0 z-40 bg-black/10 backdrop-blur-[1px] rounded-2xl pointer-events-auto cursor-default" />
                            )}
                            <div className="flex flex-row items-center justify-between gap-2 sm:gap-6 px-4 py-8 bg-zinc-200/50 rounded-[40px] border border-zinc-300 shadow-sm w-full max-w-2xl mx-auto relative overflow-hidden">
                              <div className="flex-1 flex flex-col items-center text-center space-y-2 sm:space-y-4">
                                  <button 
                                    className="w-10 h-10 sm:w-20 sm:h-20 transition-transform hover:scale-110 active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed drop-shadow-sm"
                                    disabled={match.hasEnded}
                                    onClick={() => {
                                      if (match.teamAIndex === -1) return;
                                      setTeams(prev => {
                                        const newTeams = [...prev];
                                        const currentTeam = newTeams[match.teamAIndex];
                                        if (!currentTeam) return prev;
                                        currentTeam.color = TEAM_COLORS[(TEAM_COLORS.indexOf(currentTeam.color || TEAM_COLORS[0]) + 1) % TEAM_COLORS.length];
                                        return newTeams;
                                      });
                                    }}
                                  >
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                                      <defs>
                                        <linearGradient id="shield-grad-A-main" x1="0%" y1="0%" x2="0%" y2="100%">
                                          <stop offset="0%" stopColor={teams[match.teamAIndex]?.color || TEAM_COLORS[0]} />
                                          <stop offset="100%" stopColor={teams[match.teamAIndex]?.color || TEAM_COLORS[0]} stopOpacity="0.85" />
                                        </linearGradient>
                                      </defs>
                                      <path fill="url(#shield-grad-A-main)" d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" stroke="rgba(0,0,0,0.1)" strokeWidth="1" strokeLinejoin="round" />
                                      <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" fill="white" opacity="0.15" />
                                    </svg>
                                  </button>
                                  <div 
                                    className={`text-4xl sm:text-7xl font-black origin-center text-black ${(!match.isActive || match.isPaused) ? 'opacity-50' : ''} tabular-nums tracking-tighter leading-none flex items-center justify-center w-14 h-14 sm:w-24 sm:h-24 rounded-[20px] bg-white border-b-4 border-zinc-300 shadow-sm`}
                                  >
                                    {match.scoreA}
                                  </div>
                                  <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-widest text-[#1E3D2F] opacity-60 truncate max-w-[80px] sm:max-w-[120px] px-1 text-center">{teams[match.teamAIndex]?.name}</span>
                              </div>
                              
                              <div className="flex flex-col items-center justify-center gap-2 sm:gap-6 min-w-[70px] sm:min-w-[140px]">
                                <FlipClock clockId="scoreboard-primary" time={match.timeRemaining} size="xs" />
                                <div className="flex flex-col gap-2">
                                  <div className="flex gap-2 sm:gap-3">
                                    <button 
                                      disabled={!((match.teamAIndex !== -1 && match.teamBIndex !== -1 && 
                                        teams[match.teamAIndex]?.playerIds?.length === match.config.playersPerTeam && 
                                        teams[match.teamBIndex]?.playerIds?.length === match.config.playersPerTeam)) || 
                                        (match.scoreA >= match.config.goalLimit || match.scoreB >= match.config.goalLimit)}
                                      onClick={() => {
                                        setMatch(prev => {
                                          const nextIsPaused = !prev.isPaused;
                                          if (nextIsPaused) {
                                            sounds.playPause();
                                          } else {
                                            sounds.playStartMatch();
                                          }
                                          return { ...prev, isPaused: nextIsPaused, isActive: true };
                                        });
                                      }}
                                      className={`w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center rounded-full transition-all shadow-md ${match.isPaused ? 'bg-[#1E3D2F] text-white hover:opacity-90' : 'bg-zinc-300 text-zinc-600 hover:bg-zinc-400'} disabled:opacity-20 disabled:cursor-not-allowed`}
                                    >
                                      {match.isPaused ? <Play size={16} className="sm:w-5 sm:h-5" fill="currentColor" /> : <Pause size={16} className="sm:w-5 sm:h-5" fill="currentColor" />}
                                    </button>
                                    <AnimatePresence>
                                      {match.isActive && (
                                        <motion.button 
                                          initial={{ opacity: 0, scale: 0.5, x: -20 }}
                                          animate={{ opacity: 1, scale: 1, x: 0 }}
                                          exit={{ opacity: 0, scale: 0.5, x: -20 }}
                                          disabled={!((match.teamAIndex !== -1 && match.teamBIndex !== -1 && 
                                            teams[match.teamAIndex]?.playerIds?.length === match.config.playersPerTeam && 
                                            teams[match.teamBIndex]?.playerIds?.length === match.config.playersPerTeam)) || 
                                            (match.scoreA >= match.config.goalLimit || match.scoreB >= match.config.goalLimit)}
                                          onClick={finishMatch}
                                          className="p-3 rounded-full transition-all bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-20 disabled:cursor-not-allowed"
                                          title="Finalizar Partida"
                                        >
                                          <Square size={16} className="sm:w-5 sm:h-5" fill="currentColor" />
                                        </motion.button>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                  <button 
                                    disabled={!match.isActive || !((match.teamAIndex !== -1 && match.teamBIndex !== -1 && 
                                      teams[match.teamAIndex]?.playerIds?.length === match.config.playersPerTeam && 
                                      teams[match.teamBIndex]?.playerIds?.length === match.config.playersPerTeam)) || 
                                      (match.scoreA >= match.config.goalLimit || match.scoreB >= match.config.goalLimit)}
                                    onClick={finishMatch}
                                    className="px-2 sm:px-4 py-1 rounded-full bg-red-500/10 text-red-600 text-[6px] sm:text-[8px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all disabled:opacity-20 disabled:cursor-not-allowed border border-red-500/10"
                                  >
                                    Encerrar
                                  </button>
                                </div>
                              </div>

                              <div className="flex-1 flex flex-col items-center text-center space-y-2 sm:space-y-4">
                                  <button 
                                    className="w-10 h-10 sm:w-20 sm:h-20 transition-transform hover:scale-110 active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed drop-shadow-sm"
                                    disabled={match.hasEnded}
                                    onClick={() => {
                                      if (match.teamBIndex === -1) return;
                                      setTeams(prev => {
                                        const newTeams = [...prev];
                                        const currentTeam = newTeams[match.teamBIndex];
                                        currentTeam.color = TEAM_COLORS[(TEAM_COLORS.indexOf(currentTeam.color || TEAM_COLORS[1]) + 1) % TEAM_COLORS.length];
                                        return newTeams;
                                      });
                                    }}
                                  >
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                                      <defs>
                                        <linearGradient id="shield-grad-B-main" x1="0%" y1="0%" x2="0%" y2="100%">
                                          <stop offset="0%" stopColor={teams[match.teamBIndex]?.color || TEAM_COLORS[1]} />
                                          <stop offset="100%" stopColor={teams[match.teamBIndex]?.color || TEAM_COLORS[1]} stopOpacity="0.85" />
                                        </linearGradient>
                                      </defs>
                                      <path fill="url(#shield-grad-B-main)" d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" stroke="rgba(0,0,0,0.1)" strokeWidth="1" strokeLinejoin="round" />
                                      <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" fill="white" opacity="0.15" />
                                    </svg>
                                  </button>
                                  <div 
                                    className={`text-4xl sm:text-7xl font-black origin-center text-black ${(!match.isActive || match.isPaused) ? 'opacity-50' : ''} tabular-nums tracking-tighter leading-none flex items-center justify-center w-14 h-14 sm:w-24 sm:h-24 rounded-[20px] bg-white border-b-4 border-zinc-300 shadow-sm`}
                                  >
                                    {match.scoreB}
                                  </div>
                                  <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-widest text-[#1E3D2F] opacity-60 truncate max-w-full px-1">{teams[match.teamBIndex]?.name}</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                {[...(teams[match.teamAIndex]?.playerIds || [])].sort((a, b) => {
                                  const playerA = players.find(p => p.id === a);
                                  const playerB = players.find(p => p.id === b);
                                  return (playerA?.arrivedAt || 0) - (playerB?.arrivedAt || 0);
                                }).map((pid, idx) => {
                                  const p = players.find(pl => pl.id === pid);
                                  if (!p) return null;
                                  const matchGoals = match.events.filter(e => e.type === 'goal' && e.playerId === pid).length;
                                  const matchAssists = match.events.filter(e => e.type === 'goal' && e.assistId === pid).length;
                                  return (
                                      <button 
                                        key={`partida-p-a-${pid}-${idx}`} 
                                        disabled={match.scoreA >= match.config.goalLimit || match.scoreB >= match.config.goalLimit}
                                        onClick={() => {
                                          if (swappingPlayerId) {
                                            if (swappingPlayerId === pid) {
                                              setSwappingPlayerId(null);
                                              setToast({ message: "Troca cancelada.", type: 'info' });
                                              return;
                                            }
                                            
                                            setTeams(prev => {
                                              const newTeams = [...prev].map(team => ({ ...team, playerIds: [...team.playerIds] }));
                                              let swapTeamIdx = -1;
                                              let currentTeamIdx = match.teamAIndex;
                                              
                                              for (let i = 0; i < newTeams.length; i++) {
                                                if (newTeams[i].playerIds.includes(swappingPlayerId)) swapTeamIdx = i;
                                              }
                                              
                                              if (swapTeamIdx !== -1 && currentTeamIdx !== -1) {
                                                const pAId = swappingPlayerId;
                                                const pBId = pid;
                                                if (swapTeamIdx === currentTeamIdx) {
                                                  newTeams[swapTeamIdx].playerIds = newTeams[swapTeamIdx].playerIds.map(id => {
                                                    if (id === pAId) return pBId;
                                                    if (id === pBId) return pAId;
                                                    return id;
                                                  });
                                                } else {
                                                  newTeams[swapTeamIdx].playerIds = newTeams[swapTeamIdx].playerIds.map(id => id === pAId ? pBId : id);
                                                  newTeams[currentTeamIdx].playerIds = newTeams[currentTeamIdx].playerIds.map(id => id === pBId ? pAId : id);
                                                }
                                                setToast({ message: "Jogadores trocados!", type: 'success' });
                                              }
                                              return newTeams;
                                            });
                                            setSwappingPlayerId(null);
                                            return;
                                          }
                                          setShowPlayerActionsModal({ teamIndex: match.teamAIndex, playerId: pid });
                                        }}
                                        className={`w-full flex items-center p-2 sm:p-1.5 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                                          swappingPlayerId === pid
                                            ? 'bg-brand-primary/40 text-black border-2 border-brand-primary shadow-lg scale-105'
                                            : 'text-black border border-black/5 hover:border-black/20 group'
                                        }`}
                                        style={{ 
                                          backgroundColor: swappingPlayerId !== pid
                                            ? ((teams[match.teamAIndex]?.color === '#1a1a1a' ? '#00000010' : (teams[match.teamAIndex]?.color || TEAM_COLORS[0]) + '15')) 
                                            : undefined 
                                        }}
                                      >
                                      <div className="flex items-center gap-1">
                                        {matchAssists > 0 && (
                                          <div className={`flex items-center gap-0.5 text-[10px] font-bold ${theme === 'light' ? 'text-green-800' : 'text-brand-primary'}`}>
                                            <Footprints size={10} /> {matchAssists}
                                          </div>
                                        )}
                                        {matchGoals > 0 && (
                                          <div className={`flex items-center gap-0.5 text-[10px] font-bold ${theme === 'light' ? 'text-green-800' : 'text-brand-primary'}`}>
                                            <CircleDot size={10} /> {matchGoals}
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2 ml-auto overflow-hidden">
                                        <span className="text-[11px] sm:text-[10px] font-bold uppercase truncate text-black">{p.name}</span>
                                        <div className="w-5 h-5 sm:w-4 sm:h-4 rounded-full bg-zinc-300 flex items-center justify-center shrink-0 border border-zinc-400">
                                          {p.photo ? <img src={p.photo} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" /> : <User size={10} className="text-black" />}
                                        </div>
                                      </div>
                                    </button>
                                  );
                                })}
                                {Array.from({ length: Math.max(0, match.config.playersPerTeam - (teams[match.teamAIndex]?.playerIds?.length || 0)) }).map((_, i) => (
                                  <button 
                                    key={`empty-a-${i}`}
                                    onClick={() => {
                                      if (movingPlayer) {
                                        const sourceTeamIdx = teams.findIndex(team => team.id === movingPlayer.teamId);
                                        if (sourceTeamIdx === match.teamAIndex) {
                                          setToast({ message: "O jogador já está neste time.", type: 'info' });
                                          setMovingPlayer(null);
                                          return;
                                        }
                                        setTeams(prev => {
                                          const newTeams = [...prev].map(team => ({ ...team, playerIds: [...team.playerIds] }));
                                          const sTeam = newTeams.find(team => team.id === movingPlayer.teamId);
                                          if (sTeam) {
                                            sTeam.playerIds = sTeam.playerIds.filter(id => id !== movingPlayer.playerId);
                                          }
                                          if (newTeams[match.teamAIndex]) {
                                            newTeams[match.teamAIndex].playerIds.push(movingPlayer.playerId);
                                          }
                                          return newTeams.filter(team => team.playerIds.length > 0);
                                        });
                                        setMovingPlayer(null);
                                        setToast({ message: "Jogador movido para o Time A!", type: 'success' });
                                      }
                                    }}
                                    className={`w-full flex items-center justify-center p-2 sm:p-1.5 rounded-xl border border-dashed transition-all active:scale-95 ${
                                      theme === 'light' ? 'border-zinc-300 bg-zinc-50 text-zinc-300 hover:bg-zinc-100' : 'border-white/10 bg-white/5 text-white/5 hover:bg-white/10'
                                    } ${movingPlayer ? 'animate-pulse border-brand-primary' : ''}`}
                                  >
                                    <Plus size={12} />
                                  </button>
                                ))}
                              </div>
                              <div className="space-y-2">
                                {[...(teams[match.teamBIndex]?.playerIds || [])].sort((a, b) => {
                                  const playerA = players.find(p => p.id === a);
                                  const playerB = players.find(p => p.id === b);
                                  return (playerA?.arrivedAt || 0) - (playerB?.arrivedAt || 0);
                                }).map((pid, idx) => {
                                  const p = players.find(pl => pl.id === pid);
                                  if (!p) return null;
                                  const matchGoals = match.events.filter(e => e.type === 'goal' && e.playerId === pid).length;
                                  const matchAssists = match.events.filter(e => e.type === 'goal' && e.assistId === pid).length;
                                  return (
                                      <button 
                                        key={`partida-p-b-${pid}-${idx}`} 
                                        disabled={match.scoreA >= match.config.goalLimit || match.scoreB >= match.config.goalLimit}
                                        onClick={() => {
                                          if (swappingPlayerId) {
                                            if (swappingPlayerId === pid) {
                                              setSwappingPlayerId(null);
                                              setToast({ message: "Troca cancelada.", type: 'info' });
                                              return;
                                            }
                                            
                                            setTeams(prev => {
                                              const newTeams = [...prev].map(team => ({ ...team, playerIds: [...team.playerIds] }));
                                              let swapTeamIdx = -1;
                                              let currentTeamIdx = match.teamBIndex;
                                              
                                              for (let i = 0; i < newTeams.length; i++) {
                                                if (newTeams[i].playerIds.includes(swappingPlayerId)) swapTeamIdx = i;
                                              }
                                              
                                              if (swapTeamIdx !== -1 && currentTeamIdx !== -1) {
                                                const pAId = swappingPlayerId;
                                                const pBId = pid;
                                                if (swapTeamIdx === currentTeamIdx) {
                                                  newTeams[swapTeamIdx].playerIds = newTeams[swapTeamIdx].playerIds.map(id => {
                                                    if (id === pAId) return pBId;
                                                    if (id === pBId) return pAId;
                                                    return id;
                                                  });
                                                } else {
                                                  newTeams[swapTeamIdx].playerIds = newTeams[swapTeamIdx].playerIds.map(id => id === pAId ? pBId : id);
                                                  newTeams[currentTeamIdx].playerIds = newTeams[currentTeamIdx].playerIds.map(id => id === pBId ? pAId : id);
                                                }
                                                setToast({ message: "Jogadores trocados!", type: 'success' });
                                              }
                                              return newTeams;
                                            });
                                            setSwappingPlayerId(null);
                                            return;
                                          }
                                          setShowPlayerActionsModal({ teamIndex: match.teamBIndex, playerId: pid });
                                        }}
                                        className={`w-full flex items-center gap-2 p-2 sm:p-1.5 rounded-xl transition-all active:scale-95 text-left disabled:opacity-50 disabled:cursor-not-allowed ${
                                          swappingPlayerId === pid
                                            ? 'bg-brand-primary/40 text-black border-2 border-brand-primary shadow-lg scale-105'
                                            : 'text-black border border-black/5 hover:border-black/20 group'
                                        }`}
                                        style={{ 
                                          backgroundColor: swappingPlayerId !== pid
                                            ? ((teams[match.teamBIndex]?.color === '#1a1a1a' ? '#00000010' : (teams[match.teamBIndex]?.color || TEAM_COLORS[1]) + '15')) 
                                            : undefined 
                                        }}
                                      >
                                      <div className="w-5 h-5 sm:w-4 sm:h-4 rounded-full bg-zinc-300 flex items-center justify-center shrink-0 border border-zinc-400">
                                        {p.photo ? <img src={p.photo} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" /> : <User size={10} className="text-black" />}
                                      </div>
                                      <span className="text-[11px] sm:text-[10px] font-bold uppercase truncate text-black">{p.name}</span>
                                      <div className="flex items-center gap-1 ml-auto">
                                        {matchGoals > 0 && (
                                          <div className={`flex items-center gap-0.5 text-[10px] font-bold ${theme === 'light' ? 'text-green-800' : 'text-brand-primary'}`}>
                                            <CircleDot size={10} /> {matchGoals}
                                          </div>
                                        )}
                                        {matchAssists > 0 && (
                                          <div className={`flex items-center gap-0.5 text-[10px] font-bold ${theme === 'light' ? 'text-green-800' : 'text-brand-primary'}`}>
                                            <Footprints size={10} /> {matchAssists}
                                          </div>
                                        )}
                                      </div>
                                    </button>
                                  );
                                })}
                                {Array.from({ length: Math.max(0, match.config.playersPerTeam - (teams[match.teamBIndex]?.playerIds?.length || 0)) }).map((_, i) => (
                                  <button 
                                    key={`empty-b-${i}`}
                                    onClick={() => {
                                      if (movingPlayer) {
                                        const sourceTeamIdx = teams.findIndex(team => team.id === movingPlayer.teamId);
                                        if (sourceTeamIdx === match.teamBIndex) {
                                          setToast({ message: "O jogador já está neste time.", type: 'info' });
                                          setMovingPlayer(null);
                                          return;
                                        }
                                        setTeams(prev => {
                                          const newTeams = [...prev].map(team => ({ ...team, playerIds: [...team.playerIds] }));
                                          const sTeam = newTeams.find(team => team.id === movingPlayer.teamId);
                                          if (sTeam) {
                                            sTeam.playerIds = sTeam.playerIds.filter(id => id !== movingPlayer.playerId);
                                          }
                                          if (newTeams[match.teamBIndex]) {
                                            newTeams[match.teamBIndex].playerIds.push(movingPlayer.playerId);
                                          }
                                          return newTeams.filter(team => team.playerIds.length > 0);
                                        });
                                        setMovingPlayer(null);
                                        setToast({ message: "Jogador movido para o Time B!", type: 'success' });
                                      }
                                    }}
                                    className={`w-full flex items-center justify-center p-2 sm:p-1.5 rounded-xl border border-dashed transition-all active:scale-95 ${
                                      theme === 'light' ? 'border-zinc-300 bg-zinc-50 text-zinc-300 hover:bg-zinc-100' : 'border-white/10 bg-white/5 text-white/5 hover:bg-white/10'
                                    } ${movingPlayer ? 'animate-pulse border-brand-primary' : ''}`}
                                  >
                                    <Plus size={12} />
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : teamsTab === 'proximos' ? (
                      <div className="space-y-6 relative overflow-hidden bg-gradient-to-br from-zinc-50 to-zinc-200 p-6 rounded-3xl border border-zinc-300 shadow-inner">
                        
                        <div className="flex justify-between items-center relative z-10">
                          <button 
                            onClick={() => setTeamsTab('configuracao')}
                            className="p-2 rounded-lg transition-all active:scale-90 hover:bg-zinc-200"
                            title="Configurações"
                          >
                            <Settings size={20} className="text-brand-text-primary" />
                          </button>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  if (match.isActive && !match.hasEnded) return;
                                  if (teams.filter(t => t.playerIds.length === match.config.playersPerTeam).length < 2) return;
                                  
                                  setShowLogoAnimation(true);
                                  setTimeout(() => {
                                  randomizeTeams(match.config.playersPerTeam);
                                    setShowLogoAnimation(false);
                                    sounds.playDrawFinished();
                                    setToast({ message: "Times sorteados com sucesso!", type: 'success' });
                                  }, 3000);
                                }}
                                disabled={(match.isActive && !match.hasEnded) || teams.filter(t => t.playerIds.length === match.config.playersPerTeam).length < 2}
                                className="p-2 rounded-lg transition-all active:scale-90 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                              >
                                <Shuffle size={20} className="text-brand-text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-text-primary">Sortear</span>
                              </button>
                              <button
                                onClick={() => {
                                  if (match.teamAIndex !== -1 && match.teamBIndex !== -1 && 
                                      (teams[match.teamAIndex]?.playerIds?.length === match.config.playersPerTeam && 
                                      teams[match.teamBIndex]?.playerIds?.length === match.config.playersPerTeam)) {
                                    startNextMatch(match.teamAIndex, match.teamBIndex);
                                  }
                                }}
                                disabled={!((match.teamAIndex !== -1 && match.teamBIndex !== -1 && 
                                  (teams[match.teamAIndex]?.playerIds?.length === match.config.playersPerTeam && 
                                   teams[match.teamBIndex]?.playerIds?.length === match.config.playersPerTeam)))}
                                className="p-2 rounded-lg transition-all active:scale-90 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                              >
                                <Play size={20} fill="currentColor" className="text-brand-text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-text-primary">Iniciar</span>
                              </button>
                            </div>
                        </div>
                        <div className="space-y-4">
                          {teams.length < 2 ? (
                            <div className="py-12 text-center border border-dashed border-zinc-200 rounded-xl flex flex-col items-center gap-4">
                              <p className="text-base text-zinc-500 normal-case">Crie mais times para ver a fila</p>
                              <button
                                onClick={() => {
                                  if (players.filter(p => sessionPlayerIds.includes(p.id)).length > 0) {
                                    setTeamsTab('chegada');
                                  } else if (players.length < 2) {
                                    setCurrentScreen('players');
                                    setPlayersTab('jogadores');
                                  } else {
                                    setTeamsTab('configuracao');
                                    if (!firstSetupDone) {
                                      setIsInitialSetupFlow(true);
                                    }
                                  }
                                }}
                                className="px-4 py-2 bg-brand-gradient text-black font-black uppercase tracking-widest text-[10px] rounded shadow-lg hover:opacity-90 transition-all active:scale-95"
                              >
                                {players.filter(p => sessionPlayerIds.includes(p.id)).length > 0 
                                  ? 'Confirmar Chegada'
                                  : (players.length < 2 ? 'Criar Jogadores' : 'Configurar Partida')}
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {teams.map((t, tIdx) => {
                                const isCurrent = tIdx === match.teamAIndex || tIdx === match.teamBIndex;
                                const isFlashing = flashingTeamIds.includes(t.id);
                                return (
                                  <div 
                                    key={t.id} 
                                    id={`team-card-${tIdx}`}
                                    onClick={(e) => {
                                      if (swappingPlayerId) return;
                                      if (movingPlayer) {
                                        e.stopPropagation();
                                        if (t.playerIds.length >= match.config.playersPerTeam) {
                                          setToast({ message: "Este time já está completo.", type: 'warning' });
                                          return;
                                        }
                                        setTeams(prev => {
                                          const newTeams = [...prev].map(team => ({ ...team, playerIds: [...team.playerIds] }));
                                          const sourceTeam = newTeams.find(team => team.id === movingPlayer.teamId);
                                          if (sourceTeam) {
                                            sourceTeam.playerIds = sourceTeam.playerIds.filter(id => id !== movingPlayer.playerId);
                                          }
                                          const targetTeam = newTeams.find(team => team.id === t.id);
                                          if (targetTeam) {
                                            targetTeam.playerIds.push(movingPlayer.playerId);
                                          }
                                          return newTeams.filter(team => team.playerIds.length > 0);
                                        });
                                        setMovingPlayer(null);
                                        setToast({ message: "Jogador movido com sucesso!", type: 'success' });
                                        return;
                                      }

                                      if (match.isActive && !match.hasEnded && !match.isPaused) return; // Cannot change if timer is running
                                      
                                      if (isCurrent) {
                                        if (t.lastMatchStatus === 'Empate') {
                                          setTeams(prevTeams => {
                                              const newTeams = [...prevTeams];
                                              const deselectedTeam = newTeams.splice(tIdx, 1)[0];
                                              newTeams.push(deselectedTeam);
                                              
                                              setMatch(prevMatch => {
                                                let newTeamAIndex = prevMatch.teamAIndex;
                                                let newTeamBIndex = prevMatch.teamBIndex;
                                                
                                                if (prevMatch.teamAIndex === tIdx) {
                                                  newTeamAIndex = -1;
                                                } else if (prevMatch.teamAIndex > tIdx) {
                                                  newTeamAIndex--;
                                                }
                                                
                                                if (prevMatch.teamBIndex === tIdx) {
                                                  newTeamBIndex = -1;
                                                } else if (prevMatch.teamBIndex > tIdx) {
                                                  newTeamBIndex--;
                                                }
                                                
                                                return {
                                                  ...prevMatch,
                                                  teamAIndex: newTeamAIndex,
                                                  teamBIndex: newTeamBIndex
                                                };
                                              });
                                              return newTeams;
                                          });
                                        } else {
                                          // Deselect normally
                                          if (match.teamAIndex === tIdx) setMatch(prev => ({ ...prev, teamAIndex: -1 }));
                                          else if (match.teamBIndex === tIdx) setMatch(prev => ({ ...prev, teamBIndex: -1 }));
                                        }
                                      } else {
                                        // Select
                                        if (match.teamAIndex === -1) {
                                          setMatch(prev => ({ ...prev, teamAIndex: tIdx }));
                                        } else if (match.teamBIndex === -1) {
                                          const teamA = teams[match.teamAIndex];
                                          const teamB = teams[tIdx];
                                          if (teamA && teamB && teamA.playerIds.some(id => teamB.playerIds.includes(id))) {
                                            setToast({ message: "Estes times possuem jogadores em comum.", type: 'warning' });
                                            return;
                                          }
                                          setMatch(prev => ({ ...prev, teamBIndex: tIdx }));
                                        } else {
                                          // Both selected, prioritize keeping the winner and removing the loser
                                          const isTeamALoser = lastMatchResult && teams[match.teamAIndex]?.id === lastMatchResult.loserId;
                                          const isTeamBLoser = lastMatchResult && teams[match.teamBIndex]?.id === lastMatchResult.loserId;
                                          
                                          let teamToReplaceIndex = match.teamAIndex;
                                          if (isTeamBLoser) {
                                            teamToReplaceIndex = match.teamBIndex;
                                          } else if (isTeamALoser) {
                                            teamToReplaceIndex = match.teamAIndex;
                                          }
                                          
                                          setTeams(prevTeams => {
                                            const newTeams = [...prevTeams];
                                            const replacedTeam = newTeams[teamToReplaceIndex];
                                            const selectedTeam = newTeams[tIdx];
                                            
                                            const filteredTeams = newTeams.filter((_, i) => i !== teamToReplaceIndex && i !== tIdx);
                                            filteredTeams.splice(teamToReplaceIndex, 0, selectedTeam);
                                            filteredTeams.push(replacedTeam);
                                            
                                            const otherTeamIndex = teamToReplaceIndex === match.teamAIndex ? match.teamBIndex : match.teamAIndex;
                                            const otherTeam = prevTeams[otherTeamIndex];
                                            
                                            const newSelectedTeamIndex = filteredTeams.findIndex(team => team.id === selectedTeam.id);
                                            const newOtherTeamIndex = filteredTeams.findIndex(team => team.id === otherTeam.id);
                                            
                                            setMatch(prev => ({
                                              ...prev,
                                              teamAIndex: teamToReplaceIndex === match.teamAIndex ? newSelectedTeamIndex : newOtherTeamIndex,
                                              teamBIndex: teamToReplaceIndex === match.teamBIndex ? newSelectedTeamIndex : newOtherTeamIndex,
                                              scoreA: 0, scoreB: 0, timeRemaining: prev.config.duration * 60, isActive: false, isPaused: true, hasEnded: false, events: []
                                            }));
                                            
                                            return filteredTeams;
                                          });
                                        }
                                      }
                                      // Reset match state when changing teams (handled inside setTeams for the replacement case)
                                      if (match.teamAIndex === -1 || match.teamBIndex === -1 || isCurrent) {
                                        setMatch(prev => ({ ...prev, scoreA: 0, scoreB: 0, timeRemaining: prev.config.duration * 60, isActive: false, isPaused: true, hasEnded: false, events: [] }));
                                      }
                                    }}
                                    className={`p-4 rounded-xl border-2 transition-all relative cursor-pointer min-h-[100px] flex flex-col justify-center overflow-hidden ${
                                      isCurrent 
                                        ? `bg-emerald-500/10 border-emerald-500` 
                                        : theme === 'light'
                                          ? 'bg-gradient-to-br from-zinc-100 to-zinc-200 border-zinc-300 hover:border-emerald-500/50'
                                          : 'bg-brand-glass border-brand-border hover:border-emerald-500/50'
                                    } ${isFlashing || (movingPlayer && t.playerIds.length < match.config.playersPerTeam) ? 'animate-pulse bg-emerald-500/30 border-emerald-500' : ''}`}
                                  >
                                    
                                    {/* Status Top Right (Winner/Loser/Draw) */}
                                    {t.lastMatchStatus && (
                                      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                                        {t.lastMatchStatus === 'Vencedor' ? (
                                          <div className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1">
                                            <Trophy size={8} fill="currentColor" />
                                            Venceu
                                          </div>
                                        ) : t.lastMatchStatus === 'Empate' ? (
                                          <div className="px-2 py-0.5 rounded-full bg-zinc-500 text-white text-[8px] font-black uppercase tracking-widest shadow-sm">
                                            Empate
                                          </div>
                                        ) : (
                                          <div className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[8px] font-black uppercase tracking-widest shadow-sm">
                                            Perdeu
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Jersey Icon Top Left */}
                                    <div className="absolute top-3 left-3 w-8 h-8 rounded-xl border flex items-center justify-center transition-all bg-white border-zinc-200">
                                      {(() => {
                                        const teamColor = t.color || TEAM_COLORS[0];
                                        const strokeColor = teamColor === '#1a1a1a' ? '#ffffff40' : (teamColor === '#ffffff' ? '#e4e4e7' : 'white');
                                        return (
                                          <svg viewBox="0 0 24 24" stroke={strokeColor} strokeWidth="0.5" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                                            <defs>
                                              <linearGradient id={`shield-grad-${tIdx}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor={teamColor} />
                                                <stop offset="100%" stopColor={teamColor} stopOpacity="0.85" />
                                              </linearGradient>
                                            </defs>
                                            <path 
                                              fill={`url(#shield-grad-${tIdx})`}
                                              d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z"
                                              stroke={strokeColor === '#ffffff40' ? '#ffffff' : (strokeColor === '#e4e4e7' ? '#000000' : strokeColor)}
                                              strokeWidth="1.5"
                                              strokeLinejoin="round"
                                            />
                                            {/* Subtle texture overlay */}
                                            <path 
                                              d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z"
                                              fill="white" opacity="0.15"
                                            />

                                          </svg>
                                        );
                                      })()}
                                    </div>

                                    {/* Status Top Right removed */}
                                    <div className="absolute top-2 right-2">
                                    </div>

                                    {isCurrent && t.playerIds.length < match.config.playersPerTeam && (
                                      <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-red-600/95 backdrop-blur-md">
                                        <div className="flex flex-col items-center gap-2 relative z-10">
                                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-bounce">
                                            <Info className="text-white" size={20} />
                                          </div>
                                          <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Time Incompleto!</h3>
                                          <p className="text-[10px] font-bold uppercase tracking-widest text-white/90 leading-tight px-4 text-center">
                                            Times devem estar equilibrados.<br/>
                                            <span className="text-yellow-300">Toque em um jogador de outro time</span> para completar esta vaga.
                                          </p>
                                        </div>
                                      </div>
                                    )}

                                    <div className="pt-14">
                                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                        {[...t.playerIds].sort((a, b) => {
                                          const playerA = players.find(p => p.id === a);
                                          const playerB = players.find(p => p.id === b);
                                          return (playerA?.arrivedAt || 0) - (playerB?.arrivedAt || 0);
                                        }).map((pid, idx) => {
                                          const p = players.find(pl => pl.id === pid);
                                          if (!p) return null;
                                          return (
                                                <button
                                                  key={`queue-player-${t.id}-${pid}-${idx}`}
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (swappingPlayerId) {
                                                      if (swappingPlayerId === pid) {
                                                        setSwappingPlayerId(null);
                                                        setToast({ message: "Troca cancelada.", type: 'info' });
                                                        return;
                                                      }
                                                      // Swap logic
                                                      setTeams(prev => {
                                                        const newTeams = [...prev].map(team => ({ ...team, playerIds: [...team.playerIds] }));
                                                        let swapTeamIdx = -1;
                                                        let currentTeamIdx = -1;
                                                        
                                                        // Find teams of both players
                                                        for (let i = 0; i < newTeams.length; i++) {
                                                          if (newTeams[i].playerIds.includes(swappingPlayerId)) swapTeamIdx = i;
                                                          if (newTeams[i].playerIds.includes(pid)) currentTeamIdx = i;
                                                        }
                                                        
                                                        if (swapTeamIdx !== -1 && currentTeamIdx !== -1) {
                                                          const pAId = swappingPlayerId;
                                                          const pBId = pid;
                                                          
                                                          if (swapTeamIdx === currentTeamIdx) {
                                                            newTeams[swapTeamIdx].playerIds = newTeams[swapTeamIdx].playerIds.map(id => {
                                                              if (id === pAId) return pBId;
                                                              if (id === pBId) return pAId;
                                                              return id;
                                                            });
                                                          } else {
                                                            newTeams[swapTeamIdx].playerIds = newTeams[swapTeamIdx].playerIds.map(id => id === pAId ? pBId : id);
                                                            newTeams[currentTeamIdx].playerIds = newTeams[currentTeamIdx].playerIds.map(id => id === pBId ? pAId : id);
                                                          }
                                                        }
                                                        return newTeams;
                                                      });
                                                      setSwappingPlayerId(null);
                                                      setToast({ message: "Jogadores trocados com sucesso!", type: 'success' });
                                                    } else if (fillingVacancyForTeam !== null) {
                                                      // Move logic
                                                      setTeams(prev => {
                                                        const newTeams = [...prev].map(team => ({ ...team, playerIds: [...team.playerIds] }));
                                                        newTeams[tIdx].playerIds = newTeams[tIdx].playerIds.filter(id => id !== pid);
                                                        newTeams[fillingVacancyForTeam].playerIds.push(pid);
                                                        return newTeams;
                                                      });
                                                      setFillingVacancyForTeam(null);
                                                      setToast({ message: "Jogador movido com sucesso!", type: 'success' });
                                                    } else {
                                                      // Check if there's an incomplete selected team
                                                      const incompleteSelectedTeamIdx = [match.teamAIndex, match.teamBIndex].find(teamIdx => 
                                                        teamIdx !== -1 && 
                                                        teamIdx !== tIdx && // Not the current team
                                                        (teams[teamIdx]?.playerIds?.length || 0) < match.config.playersPerTeam
                                                      );

                                                      if (incompleteSelectedTeamIdx !== undefined) {
                                                        // Move player to the incomplete selected team
                                                        setTeams(prev => {
                                                          const newTeams = [...prev].map(team => ({ ...team, playerIds: [...team.playerIds] }));
                                                          newTeams[tIdx].playerIds = newTeams[tIdx].playerIds.filter(id => id !== pid);
                                                          newTeams[incompleteSelectedTeamIdx].playerIds.push(pid);
                                                          return newTeams.filter(team => team.playerIds.length > 0);
                                                        });
                                                        setToast({ message: `Jogador movido para o ${teams[incompleteSelectedTeamIdx].name}`, type: 'success' });
                                                      } else {
                                                        setShowQueuePlayerModal({ teamIndex: tIdx, playerId: pid });
                                                      }
                                                    }
                                                  }}
                                                  className={`w-full flex items-center p-2 sm:p-1.5 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                                                    (swappingPlayerId && swappingPlayerId !== pid) || 
                                                    fillingVacancyForTeam !== null || 
                                                    (movingPlayer && movingPlayer.playerId === pid) ||
                                                    ([match.teamAIndex, match.teamBIndex].some(targetTIdx => targetTIdx !== -1 && targetTIdx !== tIdx && (teams[targetTIdx]?.playerIds?.length || 0) < match.config.playersPerTeam))
                                                      ? 'bg-brand-primary/20 text-brand-primary animate-pulse shadow-sm shadow-brand-primary/10'
                                                      : swappingPlayerId === pid
                                                        ? 'bg-brand-primary/40 text-black border-2 border-brand-primary shadow-lg scale-105'
                                                        : 'text-black border border-black/5 hover:border-black/20 group'
                                                  }`}
                                                  style={{ 
                                                    backgroundColor: !((swappingPlayerId && swappingPlayerId !== pid) || 
                                                                       fillingVacancyForTeam !== null || 
                                                                       (movingPlayer && movingPlayer.playerId === pid) ||
                                                                       ([match.teamAIndex, match.teamBIndex].some(targetTIdx => targetTIdx !== -1 && targetTIdx !== tIdx && (teams[targetTIdx]?.playerIds?.length || 0) < match.config.playersPerTeam)) ||
                                                                       swappingPlayerId === pid)
                                                      ? (t.color === '#1a1a1a' ? '#00000010' : (t.color || TEAM_COLORS[0]) + '15') 
                                                      : undefined 
                                                  }}
                                                >
                                                <div className="flex items-center gap-2 ml-auto overflow-hidden">
                                                  <span className="text-[11px] sm:text-[10px] font-bold truncate text-black capitalize">{p.name.toLowerCase()}</span>
                                                  <div className="w-5 h-5 sm:w-4 sm:h-4 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 border border-zinc-300">
                                                    {p.photo ? <img src={p.photo} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" /> : <User size={10} className="text-black" />}
                                                  </div>
                                                </div>
                                                </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 sm:gap-4">
                        {teams.map((team, tIndex) => (
                      <motion.div 
                        key={`scoreboard-team-${team.id}-${tIndex}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -5 }}
                        className={`group p-3 sm:p-4 rounded-xl transition-all relative cursor-pointer flex flex-col border ${
                          match.teamAIndex === tIndex || match.teamBIndex === tIndex
                            ? 'bg-[#004d1a] border-brand-primary shadow-[0_0_30px_rgba(198,255,0,0.1)]' 
                            : 'bg-transparent border-white/10 hover:border-brand-primary/50'
                        } ${flashingTeamIds.includes(team.id) ? 'animate-flash' : ''}`}
                        onClick={() => {
                          if (swappingPlayerId) return;
                          setFlashingTeamIds([]);
                          setMatch(prev => {
                            if (prev.teamAIndex === tIndex) return { ...prev, teamAIndex: -1 };
                            if (prev.teamBIndex === tIndex) return { ...prev, teamBIndex: -1 };
                            if (prev.teamAIndex === -1) return { ...prev, teamAIndex: tIndex };
                            if (prev.teamBIndex === -1) return { ...prev, teamBIndex: tIndex };
                            return { ...prev, teamBIndex: tIndex };
                          });
                        }}
                      >
                        {/* Selection Indicator */}
                        <div className="absolute top-6 right-6">
                          <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-500 ${
                            match.teamAIndex === tIndex ? 'bg-brand-primary border-brand-primary' : 
                            match.teamBIndex === tIndex ? 'bg-brand-primary border-brand-primary' : 
                            'bg-transparent border-white/20'
                          }`}>
                            {(match.teamAIndex === tIndex || match.teamBIndex === tIndex) && (
                              <div className="w-2 h-2 rounded-full bg-black" />
                            )}
                          </div>
                        </div>

                        <div className="mb-6">
                          <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${
                            (match.teamAIndex === tIndex || match.teamBIndex === tIndex)
                              ? 'text-white/60'
                              : 'text-brand-primary'
                          }`}>Club {tIndex + 1}</div>
                          <input 
                            value={team.name}
                            placeholder="NOME DO CLUB"
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              if (match.isActive && !match.isPaused && (tIndex === match.teamAIndex || tIndex === match.teamBIndex)) {
                                setToast({ message: "Não é possível renomear times com o cronômetro rodando.", type: 'gray' });
                                setTimeout(() => setToast(null), 3000);
                                return;
                              }
                              const newTeams = [...teams];
                              newTeams[tIndex].name = e.target.value;
                              setTeams(newTeams);
                            }}
                            className={`bg-transparent font-black text-xl uppercase tracking-tight outline-none w-full placeholder:opacity-20 ${
                              (match.teamAIndex === tIndex || match.teamBIndex === tIndex)
                                ? 'text-white'
                                : 'text-white'
                            }`}
                          />
                        </div>
                        
                        <div className="flex-1 space-y-2 pr-1 custom-scrollbar">
                          {team.playerIds.map((pid, idx) => {
                            const p = players.find(pl => pl.id === pid);
                            return p ? (
                              <div 
                                key={`scoreboard-player-${team.id}-${pid}-${idx}`} 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (swappingPlayerId && swappingPlayerId !== pid) {
                                    // Complete swap logic
                                    setTeams(prev => {
                                      const newTeams = [...prev].map(team => ({ ...team, playerIds: [...team.playerIds] }));
                                      let teamAIdx = -1;
                                      let teamBIdx = -1;
                                      
                                      for (let i = 0; i < newTeams.length; i++) {
                                        if (newTeams[i].playerIds.includes(swappingPlayerId)) teamAIdx = i;
                                        if (newTeams[i].playerIds.includes(pid)) teamBIdx = i;
                                      }
                                      
                                      if (teamAIdx !== -1 && teamBIdx !== -1) {
                                        const pAId = swappingPlayerId;
                                        const pBId = pid;
                                        if (teamAIdx === teamBIdx) {
                                          newTeams[teamAIdx].playerIds = newTeams[teamAIdx].playerIds.map(id => {
                                            if (id === pAId) return pBId;
                                            if (id === pBId) return pAId;
                                            return id;
                                          });
                                        } else {
                                          newTeams[teamAIdx].playerIds = newTeams[teamAIdx].playerIds.map(id => id === pAId ? pBId : id);
                                          newTeams[teamBIdx].playerIds = newTeams[teamBIdx].playerIds.map(id => id === pBId ? pAId : id);
                                        }
                                      }
                                      return newTeams;
                                    });
                                    setSwappingPlayerId(null);
                                    setToast({ message: "Jogadores trocados com sucesso!", type: 'success' });
                                  } else {
                                    setShowPlayerActionsModal({ teamIndex: tIndex, playerId: pid });
                                  }
                                }}
                                className={`flex justify-between items-center py-2 px-1 transition-all group/player cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                                swappingPlayerId === pid 
                                  ? 'bg-brand-primary/20 rounded-lg' 
                                  : (swappingPlayerId && swappingPlayerId !== pid)
                                    ? 'bg-brand-primary/10 rounded-lg animate-pulse'
                                    : 'bg-transparent border-transparent'
                              }`}>
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <div className="w-6 h-6 rounded-full bg-zinc-300 flex items-center justify-center overflow-hidden border border-zinc-400 shrink-0">
                                    {p.photo ? (
                                      <img src={p.photo} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    ) : (
                                      <User size={10} className="text-zinc-700" />
                                    )}
                                  </div>
                                  <span className={`text-[11px] sm:text-xs font-bold tracking-tight transition-colors truncate ${
                                    swappingPlayerId === pid 
                                      ? 'text-brand-primary' 
                                      : 'text-zinc-800'
                                  }`}>{p.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  {swappingPlayerId === pid && (
                                    <div className="px-2 py-1 text-black bg-brand-primary/20 border border-brand-primary/50 rounded-sm text-[8px] font-black uppercase">
                                      Selecionado
                                    </div>
                                  )}
                                  {swappingPlayerId && swappingPlayerId !== pid && (
                                    <div className="px-2 py-1 bg-brand-primary text-black rounded-sm text-[8px] font-black uppercase animate-pulse">
                                      Trocar
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : null;
                          })}
                          {team.playerIds.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center opacity-20 py-8">
                              <Users size={32} />
                              <span className="text-[10px] font-bold mt-2">SEM JOGADORES</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-3 mt-6">
                          <div className="flex gap-3">
                            {teams.length > 2 && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeTeam(tIndex);
                                }} 
                                className="p-3 rounded-md text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center"
                                title="Excluir Time"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (match.isActive && (tIndex === match.teamAIndex || tIndex === match.teamBIndex)) {
                                  setToast({ message: "Não é possível adicionar jogadores a times em campo.", type: 'gray' });
                                  setTimeout(() => setToast(null), 3000);
                                  return;
                                }
                                setShowQuickAddPlayerModal(tIndex);
                              }}
                              className={`flex-[2] py-3 rounded-md text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                                (match.teamAIndex === tIndex || match.teamBIndex === tIndex)
                                  ? 'bg-transparent text-black hover:bg-black/20'
                                  : 'bg-transparent text-brand-text-primary hover:bg-black/10'
                              }`}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    <button 
                      onClick={addTeam}
                      className="p-6 rounded-xl border border-dashed border-white/10 hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all flex flex-col items-center justify-center gap-3 group"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-black transition-all">
                        <Plus size={24} />
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
        )}



          {currentScreen === 'ranking' && !isPrintMode && (
            <motion.div 
              key="ranking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={(_, info) => {
                if (info.offset.x > 100) {
                  setCurrentScreen('teams');
                  setTeamsTab(match.isActive ? 'historico' : 'proximos');
                }
              }}
              className="p-6 space-y-6 pb-24"
            >
              <div className="flex bg-brand-dark p-1 rounded-2xl border border-brand-border mb-4">
                <button
                  onClick={() => setRankingTab('geral')}
                  className={`flex-1 py-2 text-[10px] uppercase font-black tracking-widest rounded-xl transition-all ${rankingTab === 'geral' ? 'bg-brand-surface-light text-brand-text-primary shadow-sm' : 'text-zinc-500 hover:text-brand-text-primary'}`}
                >
                  Geral
                </button>
                <button
                  onClick={() => setRankingTab('artilharia')}
                  className={`flex-1 py-2 text-[10px] uppercase font-black tracking-widest rounded-xl transition-all ${rankingTab === 'artilharia' ? 'bg-brand-surface-light text-brand-text-primary shadow-sm' : 'text-zinc-500 hover:text-brand-text-primary'}`}
                >
                  Artilharia
                </button>
                <button
                  onClick={() => setRankingTab('assistencias')}
                  className={`flex-1 py-2 text-[10px] uppercase font-black tracking-widest rounded-xl transition-all ${rankingTab === 'assistencias' ? 'bg-brand-surface-light text-brand-text-primary shadow-sm' : 'text-zinc-500 hover:text-brand-text-primary'}`}
                >
                  Assistências
                </button>
              </div>
              
              <motion.div 
                className={`rounded-2xl overflow-hidden border bg-brand-card/50 border-brand-border p-4`}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(event, info) => {
                  if (Math.abs(info.offset.x) > 50) {
                    const tabs = ['geral', 'artilharia', 'assistencias'];
                    const currentIndex = tabs.indexOf(rankingTab);
                    if (info.offset.x > 0 && currentIndex > 0) setRankingTab(tabs[currentIndex - 1]);
                    else if (info.offset.x < 0 && currentIndex < tabs.length - 1) setRankingTab(tabs[currentIndex + 1]);
                  }
                }}
              >
                <div className="flex items-center justify-between pb-2 border-b border-dashed border-brand-border mb-4 px-2">
                  <button onClick={() => setIsPrintMode(true)} className="text-zinc-400 p-2 hover:bg-zinc-800 rounded-full transition-colors">
                    <Eye size={20} />
                  </button>
                  <div className="text-zinc-500 text-xs font-bold font-mono tracking-tighter">Ranking</div>
                  <div className={`flex gap-4 sm:gap-8 text-[10px] font-black uppercase tracking-widest text-brand-text-secondary ${rankingTab === 'artilharia' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-12 text-center flex items-center justify-center gap-1 ${rankingTab !== 'assistencias' ? '' : 'opacity-0'}`}><Trophy size={14} /> Gols</div>
                    <div className={`w-12 text-center flex items-center justify-center gap-1 ${rankingTab !== 'artilharia' ? '' : 'opacity-0'}`}><Award size={14} /> Ass</div>
                  </div>
                </div>

                {[...players]
                  .sort((a, b) => {
                    if (rankingTab === 'geral') return (b.goals + b.assists) - (a.goals + a.assists);
                    if (rankingTab === 'artilharia') return b.goals - a.goals;
                    if (rankingTab === 'assistencias') return b.assists - a.assists;
                    return 0;
                  })
                  .map((player, index) => (
                  <div 
                    key={`ranking-player-${player.id}`}
                    className={`flex items-center py-3 px-2 transition-colors rounded-xl ${index !== 0 ? `border-t border-brand-border/50` : ''}`}
                  >
                    <div className="w-8 text-sm font-black text-brand-text-secondary text-center shrink-0">
                      {index + 1}
                    </div>
                    
                    <div className="relative ml-2 mr-4 shrink-0">
                      {index === 0 && (
                        <div className="absolute -inset-1 border-2 border-[#FFD700] rounded-full border-dashed animate-[spin_10s_linear_infinite]" />
                      )}
                      
                      <div className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-zinc-200 border border-zinc-300`}>
                        {player.photo ? (
                          <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
                        ) : (
                          <User size={20} className="text-zinc-500" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 text-xs text-brand-text-primary tracking-tight truncate mr-4">
                      {player.name}
                    </div>

                    <div className={`flex gap-4 sm:gap-8 shrink-0 ${rankingTab === 'artilharia' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-12 text-center text-sm font-black text-brand-text-primary ${rankingTab === 'assistencias' ? 'opacity-0' : ''}`}>{player.goals}</div>
                      <div className={`w-12 text-center text-sm font-black text-brand-text-primary ${rankingTab === 'artilharia' ? 'opacity-0' : ''}`}>{player.assists}</div>
                    </div>
                  </div>
                ))}
                {players.length === 0 && (
                  <div className="p-8 text-center text-brand-text-secondary text-sm font-bold normal-case">
                    Nenhum jogador registrado ainda.
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}

          {currentScreen === 'finance' && (
            <motion.div 
              key="finance"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={(_, info) => {
                if (info.offset.x > 100) {
                  setCurrentScreen('ranking');
                }
              }}
              className={`space-y-4 ${isPrintMode ? 'space-y-0' : ''}`}
            >
              {financeSubScreen === 'balanco' && (() => {
                const totalRevenue = (payments || []).reduce((acc: number, p: PaymentRecord) => acc + Object.values(p?.months || {}).reduce((mAcc: number, mVal) => mAcc + Number(mVal || 0), 0), 0) + manualAdjustment;
                const totalExpenses = (expenses || []).reduce((acc: number, e) => acc + (e.amount || 0), 0);
                const netBalance = totalRevenue - totalExpenses;

                return (
                  <motion.div
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(event, info) => {
                      if (info.offset.x < -50) setFinanceSubScreen('mensalidade');
                    }}
                    className={`space-y-6 ${isPrintMode ? 'bg-white min-h-screen text-black p-4 pb-12 font-mono' : 'font-mono'}`}
                  >
                    {!isPrintMode && (
                      <div className="flex justify-end px-4">
                        <button 
                          onClick={() => setIsPrintMode(true)}
                          className="text-zinc-400 p-2 hover:bg-zinc-800 rounded-full transition-colors"
                          title="Gerar Print"
                        >
                          <Eye size={20} />
                        </button>
                      </div>
                    )}

                    {isPrintMode && (
                      <div className="pt-8 pb-4 text-center border-b border-zinc-300 mb-6">
                        <div className="flex justify-center mb-4 opacity-20 invert">
                          <FutQuinaLogo size="md" />
                        </div>
                        <h2 className="text-2xl font-bold uppercase mb-1">
                          {isPrintPaymentsOnly ? 'Planilha de Pagamentos' : 'Relatório Financeiro'}
                        </h2>
                        <p className="text-xs uppercase opacity-60">Competência: {MONTHS[new Date().getMonth()]} / {new Date().getFullYear()}</p>
                        <button 
                          onClick={() => {
                            setIsPrintMode(false);
                            setIsPrintPaymentsOnly(false);
                          }} 
                          className="absolute top-4 right-4 p-2 text-zinc-400 hover:bg-zinc-100 rounded-full transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    )}

                    <div className={`px-4 space-y-6 ${isPrintMode ? 'max-w-4xl mx-auto' : ''}`}>
                      {/* Summary Cards */}
                      {!isPrintPaymentsOnly && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Arrecadação Card */}
                        <div 
                          onClick={() => {
                            if (!isPrintMode && !isEditingTotal) {
                              setTotalInput(manualAdjustment.toString());
                              setIsEditingTotal(true);
                            }
                          }}
                          className={`p-5 transition-all ${isPrintMode ? 'bg-white border-zinc-300 border rounded-none' : 'rounded-lg border bg-zinc-100 border-zinc-200 cursor-pointer hover:bg-zinc-200 shadow-sm'}`}>
                          <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${isPrintMode ? 'text-zinc-600' : 'text-zinc-500'}`}>Arrecadação</p>
                          <div className="flex items-baseline gap-2 mb-4">
                            {isEditingTotal ? (
                              <div className="flex items-center gap-1 w-full">
                                <span className="text-sm font-bold opacity-60">R$</span>
                                <input 
                                  autoFocus
                                  type="number"
                                  value={totalInput}
                                  onChange={(e) => setTotalInput(e.target.value)}
                                  onBlur={() => {
                                    setManualAdjustment(Number(totalInput));
                                    setIsEditingTotal(false);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      setManualAdjustment(Number(totalInput));
                                      setIsEditingTotal(false);
                                    }
                                  }}
                                  className={`w-full bg-transparent border-b-2 border-brand-primary outline-none text-2xl font-black text-zinc-900`}
                                />
                              </div>
                            ) : (
                              <div className="flex flex-col">
                                <p className={`text-3xl font-black ${isPrintMode ? 'text-black' : 'text-[#1E3D2F]'}`}>
                                  R$ {totalRevenue},00
                                </p>
                                {!isPrintMode && (
                                  <button 
                                    onClick={() => {
                                      setTotalInput(manualAdjustment.toString());
                                      setIsEditingTotal(true);
                                    }}
                                    className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1 hover:underline w-fit mt-1"
                                  >
                                    Ajustar Manual (R$ {manualAdjustment})
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="space-y-1.5">
                            <div className="h-2 w-full bg-zinc-200/50 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 transition-all duration-1000" 
                                style={{ width: `${Math.min(100, (totalRevenue / Math.max(1, (players.length * (monthlyFee || 30)))) * 100)}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[8px] font-bold uppercase tracking-wider opacity-60">
                              <span>Meta {players.length} jogs</span>
                              <span>R$ {players.length * (monthlyFee || 30)},00</span>
                            </div>
                          </div>
                        </div>

                        {/* Despesas Card */}
                        <div className={`p-5 transition-all ${isPrintMode ? 'bg-white border-zinc-300 border rounded-none' : 'rounded-lg border bg-red-50/50 border-red-100'}`}>
                          <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${isPrintMode ? 'text-zinc-600' : 'text-zinc-500'}`}>Despesas</p>
                          <p className={`text-3xl font-black mb-4 ${isPrintMode ? 'text-black' : 'text-red-700'}`}>R$ {totalExpenses},00</p>
                          <div className="space-y-1.5">
                            <div className="h-2 w-full bg-zinc-200/50 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-red-500 transition-all duration-1000" 
                                style={{ width: `${Math.min(100, (totalExpenses / Math.max(1, totalRevenue)) * 100)}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[8px] font-bold uppercase tracking-wider opacity-60">
                              <span>Gasto Total</span>
                              <span>{totalRevenue > 0 ? Math.round((totalExpenses / totalRevenue) * 100) : 0}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Saldo Líquido Card */}
                        <div className={`p-5 transition-all ${
                          isPrintMode ? 'bg-white border-zinc-300 border rounded-none' :
                          netBalance >= 0
                            ? 'rounded-lg border bg-emerald-500/10 border-emerald-500/20'
                            : 'rounded-lg border bg-red-500/10 border-red-500/20'
                        }`}>
                          <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${isPrintMode ? 'text-zinc-600' : 'opacity-60'}`}>Saldo em Caixa</p>
                          <p className={`text-3xl font-black mb-4 ${
                            isPrintMode ? 'text-black' :
                            netBalance >= 0
                              ? 'text-emerald-700'
                              : 'text-red-700'
                          }`}>R$ {netBalance},00</p>

                          <div className="space-y-1.5">
                            <div className="h-2 w-full bg-zinc-200/50 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-1000 ${netBalance >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`} 
                                style={{ width: `${Math.min(100, (Math.abs(netBalance) / Math.max(1, totalRevenue)) * 100)}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[8px] font-bold uppercase tracking-wider opacity-60">
                              <span>{netBalance >= 0 ? 'Lucro' : 'Prejuízo'}</span>
                              <span>{totalRevenue > 0 ? Math.round((Math.abs(netBalance) / totalRevenue) * 100) : 0}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Expenses List */}
                    {!isPrintPaymentsOnly && (
                      <div className={`transition-all overflow-hidden ${isPrintMode ? 'bg-white border border-zinc-300 rounded-none' : 'rounded-lg border bg-white border-zinc-200 shadow-sm'}`}>
                        <div className={`flex justify-between items-center ${isPrintMode ? 'border-b border-zinc-300 bg-zinc-100 p-2' : 'p-4 border-b bg-zinc-50 border-zinc-200'}`}>
                          <h3 className={`text-[10px] sm:text-xs font-black uppercase tracking-widest flex items-center gap-2 ${isPrintMode ? 'text-zinc-800' : 'text-zinc-500'}`}>
                            {isPrintMode ? 'DESPESAS DETALHADAS' : <><ClipboardPaste size={14} /> Despesas Detalhadas</>}
                          </h3>
                          {!isPrintMode && (
                            <button 
                              onClick={() => setShowExpenseModal(true)}
                              className="p-1.5 bg-[#1E3D2F] text-white rounded-lg hover:opacity-90 transition-all active:scale-90"
                            >
                              <Plus size={16} />
                            </button>
                          )}
                        </div>
                        <div className={`divide-y ${isPrintMode ? 'divide-zinc-200' : 'divide-zinc-100'}`}>
                          {(expenses || []).length === 0 ? (
                            <div className={`text-center text-zinc-400 text-xs uppercase tracking-widest ${isPrintMode ? 'p-2' : 'p-8'}`}>Nenhuma despesa registrada</div>
                          ) : (
                            [...(expenses || [])].sort((a, b) => b.date - a.date).map((expense) => (
                              <div key={`expense-${expense.id}`} className={`flex items-center justify-between group ${isPrintMode ? 'p-2 bg-white' : 'p-4'}`}>
                                <div>
                                  <p className={`text-xs uppercase tracking-tight ${isPrintMode ? 'font-mono text-zinc-800' : 'text-sm font-black text-zinc-800 font-mono'}`}>{expense.name}</p>
                                  <p className={`text-[8px] font-bold uppercase tracking-widest ${isPrintMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{new Date(expense.date).toLocaleDateString('pt-BR')}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                  <p className={`text-xs font-bold ${isPrintMode ? 'text-zinc-900' : 'text-md font-black text-red-600'}`}>R$ {expense.amount},00</p>
                                  {!isPrintMode && (
                                    <button 
                                      onClick={() => setExpenses(prev => prev.filter(e => e.id !== expense.id))}
                                      className="p-1.5 text-zinc-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Em Dia */}
                      <div className={`transition-all overflow-hidden ${isPrintMode ? 'bg-white border border-zinc-300 rounded-none' : 'p-5 rounded-lg border bg-emerald-50/50 border-emerald-100'}`}>
                        <div className={`flex justify-between items-center ${isPrintMode ? 'border-b border-zinc-300 bg-zinc-100 p-2 text-zinc-900' : 'mb-4'}`}>
                          <h3 className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${isPrintMode ? 'text-zinc-800' : 'text-emerald-600'}`}>
                            {isPrintMode ? 'PAGOS' : <><CheckCircle2 size={14} /> Jogadores em Dia</>} ({MONTHS[new Date().getMonth()]})
                          </h3>
                          {!isPrintMode && (
                            <button 
                              onClick={() => {
                                setIsPrintMode(true);
                                setIsPrintPaymentsOnly(true);
                              }}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-full transition-colors"
                              title="Gerar Print desta lista"
                            >
                              <Eye size={14} />
                            </button>
                          )}
                        </div>
                        <div className={`${isPrintMode ? 'divide-y divide-zinc-200' : 'space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1'}`}>
                          {(players.filter(p => {
                            const currentMonth = MONTHS[new Date().getMonth()];
                            const record = payments.find(pay => pay.playerId === p.id && pay.year === selectedYear);
                            return record && (record.months[currentMonth] || 0) > 0;
                          }) || []).map((p) => (
                            <div key={`em-dia-${p.id}`} className={`flex items-center justify-between ${isPrintMode ? 'p-2 bg-white' : 'p-3 rounded-md bg-white border border-emerald-100 shadow-sm'}`}>
                              <span className={`text-xs uppercase tracking-tight ${isPrintMode ? 'font-mono text-zinc-800' : 'font-bold text-zinc-800 font-mono'}`}>{p.name}</span>
                              {isPrintMode ? (
                                <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-widest">Pago</span>
                              ) : (
                                <Check size={14} className="text-emerald-500" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Em Débito */}
                      <div className={`transition-all overflow-hidden ${isPrintMode ? 'bg-white border border-zinc-300 rounded-none' : 'p-5 rounded-lg border bg-red-50/50 border-red-100'}`}>
                        <div className={`flex justify-between items-center ${isPrintMode ? 'border-b border-zinc-300 bg-zinc-100 p-2 text-zinc-900' : 'mb-4'}`}>
                          <h3 className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${isPrintMode ? 'text-zinc-800' : 'text-red-500'}`}>
                            {isPrintMode ? 'DEVENDO' : <><AlertCircle size={14} /> Pendentes</>} ({MONTHS[new Date().getMonth()]})
                          </h3>
                          {!isPrintMode && (
                            <button 
                              onClick={() => {
                                setIsPrintMode(true);
                                setIsPrintPaymentsOnly(true);
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                              title="Gerar Print desta lista"
                            >
                              <Eye size={14} />
                            </button>
                          )}
                        </div>
                        <div className={`${isPrintMode ? 'divide-y divide-zinc-200' : 'space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1'}`}>
                          {(players.filter(p => {
                            const currentMonth = MONTHS[new Date().getMonth()];
                            const record = payments.find(pay => pay.playerId === p.id && pay.year === selectedYear);
                            return !record || (record.months[currentMonth] || 0) <= 0;
                          }) || []).map((p) => (
                            <div key={`em-debito-${p.id}`} className={`flex items-center justify-between ${isPrintMode ? 'p-2 bg-white' : 'p-3 rounded-md bg-white border border-red-100 shadow-sm'}`}>
                              <span className={`text-xs uppercase tracking-tight ${isPrintMode ? 'font-mono text-zinc-800' : 'font-bold text-zinc-800 font-mono'}`}>{p.name}</span>
                              {isPrintMode ? (
                                <span className="text-[10px] uppercase font-bold text-red-600 tracking-widest">Pendente</span>
                              ) : (
                                <span className="text-[8px] font-black bg-red-500 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">Pendente</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {isPrintMode && (
                      <div className="pt-8 text-center opacity-40">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Gerado via App FutQuina • {new Date().toLocaleDateString('pt-BR')}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })()}
              {financeSubScreen === 'mensalidade' && (
                <motion.div
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(event, info) => {
                    if (info.offset.x > 50) setFinanceSubScreen('balanco');
                  }}
                >
                  {!isPrintMode && (
                    <div className="flex justify-end px-4">
                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => setIsPrintMode(true)}
                          className="text-zinc-400 p-2 hover:bg-zinc-800 rounded-full transition-colors"
                        >
                          <Eye size={20} />
                        </button>
                      </div>
                    </div>
                  )}

                  {!isPrintMode && (
                    <div className="grid grid-cols-2 gap-2 px-4">
                      <div className="p-2 rounded-md bg-brand-dark border border-brand-border flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-bold text-brand-text-secondary uppercase tracking-widest">Mensalidade</span>
                          {isEditingFee ? (
                            <input 
                              autoFocus
                              type="number"
                              value={tempFee}
                              onChange={(e) => setTempFee(e.target.value)}
                              onBlur={() => {
                                const val = parseInt(tempFee);
                                if (!isNaN(val)) setMonthlyFee(val);
                                setIsEditingFee(false);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const val = parseInt(tempFee);
                                  if (!isNaN(val)) setMonthlyFee(val);
                                  setIsEditingFee(false);
                                }
                              }}
                              className="w-16 bg-brand-dark border border-brand-primary/50 text-brand-primary font-black text-sm rounded px-1 outline-none"
                            />
                          ) : (
                            <div 
                              onClick={() => {
                                setTempFee(monthlyFee.toString());
                                setIsEditingFee(true);
                              }}
                              className="text-base font-black text-[#1E3D2F] cursor-pointer hover:opacity-80 transition-opacity"
                            >
                              R$ {monthlyFee},00
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <button onClick={() => setMonthlyFee(prev => prev + 1)} className="p-1 bg-brand-glass rounded hover:bg-brand-surface-light"><Plus size={10} /></button>
                          <button onClick={() => setMonthlyFee(prev => Math.max(0, prev - 1))} className="p-1 bg-brand-glass rounded hover:bg-brand-surface-light"><Minus size={10} /></button>
                        </div>
                      </div>

                      <div className="p-2 rounded-md bg-brand-dark border border-brand-border flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-bold text-brand-text-secondary uppercase tracking-widest">Ano Selecionado</span>
                          <select 
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            className="bg-transparent text-base font-black text-[#1E3D2F] outline-none cursor-pointer"
                          >
                            {availableYears.map(y => (
                              <option key={y} value={y} className="bg-brand-card text-brand-text-primary">{y}</option>
                            ))}
                          </select>
                        </div>
                        <button 
                          onClick={addYear}
                          className="w-7 h-7 rounded-sm bg-[#1E3D2F]/20 text-[#1E3D2F] flex items-center justify-center hover:bg-[#1E3D2F]/30 transition-all active:scale-90"
                          title="Adicionar Novo Ano"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  )}

                  {isPrintMode && (
                    <div className="p-3 bg-emerald-600 text-white flex justify-between items-center">
                      <FutQuinaLogo size="sm" />
                      <button 
                        onClick={() => setIsPrintMode(false)}
                        className="p-1.5 bg-white/20 rounded-sm"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}

                  <div className={`${isPrintMode ? 'overflow-visible' : 'overflow-x-auto -mx-4 px-4 pb-2 custom-scrollbar'}`}>
                    <div className={`${isPrintMode ? 'w-full' : 'min-w-[800px]'}`}>
                      <table className={`w-full border-collapse ${isPrintMode ? 'text-[10px]' : 'text-[9px]'}`}>
                        <thead>
                          <tr className={`${isPrintMode ? 'bg-zinc-100 text-zinc-900' : 'bg-emerald-200 text-emerald-900'} font-black uppercase tracking-tighter`}>
                            <th className={`p-1.5 text-left border ${isPrintMode ? 'border-zinc-300' : 'border-emerald-300 rounded-tl-xl sticky left-0 z-10 bg-emerald-200'}`}>Nome</th>
                            <th className={`p-1.5 text-center border ${isPrintMode ? 'border-zinc-300' : 'border-emerald-300'}`} colSpan={12}>{selectedYear} (R$ {monthlyFee},00)</th>
                            <th className={`p-1.5 text-center border ${isPrintMode ? 'border-zinc-300' : 'border-emerald-300 rounded-tr-xl'}`}>Dívida</th>
                          </tr>
                          <tr className={`${isPrintMode ? 'bg-zinc-50 text-zinc-700' : 'bg-emerald-100 text-emerald-800'} font-bold uppercase tracking-tighter`}>
                            <th className={`border ${isPrintMode ? 'border-zinc-300' : 'border-emerald-300 sticky left-0 z-10 bg-emerald-100'}`}></th>
                            {MONTHS.map(month => (
                              <th key={month} className={`p-0.5 border ${isPrintMode ? 'border-zinc-300' : 'border-emerald-300'}`}>{month}</th>
                            ))}
                            <th className={`border ${isPrintMode ? 'border-zinc-300' : 'border-emerald-300'}`}></th>
                          </tr>
                        </thead>
                        <tbody className={`${isPrintMode ? 'bg-white text-black' : 'bg-white text-zinc-800'}`}>
                          {players.map((player, index) => {
                            const record = payments.find(p => p.playerId === player.id && p.year === selectedYear) || { playerId: player.id, year: selectedYear, months: {}, monthlyFee: monthlyFee };
                            
                            const totalDebt = 12 * monthlyFee;
                            const paidMonths = MONTHS.reduce((acc, month) => acc + (record?.months?.[month] ? monthlyFee : 0), 0);
                            const remaining = totalDebt - paidMonths;

                            return (
                              <tr key={`finance-row-${player.id}`} className={`${index % 2 === 0 ? (isPrintMode ? 'bg-zinc-50' : 'bg-zinc-50') : 'bg-white'} ${!isPrintMode ? 'hover:bg-emerald-50 transition-colors' : ''}`}>
                                <td className={`p-1 border ${isPrintMode ? 'border-zinc-200' : 'border-zinc-200 font-bold sticky left-0 z-10 bg-inherit'}`}>
                                  <span className="p-0.5 font-bold">{player.name}</span>
                                </td>
                                {MONTHS.map(month => {
                                  const isPaid = (record?.months?.[month] || 0) > 0;
                                  return (
                                    <td key={`month-cell-${player.id}-${month}`} className={`p-0.5 border border-zinc-200 text-center`}>
                                      {isPrintMode ? (
                                        <span className={`font-bold ${isPaid ? 'text-emerald-600' : 'text-red-400 opacity-30'}`}>
                                          {isPaid ? 'OK' : '-'}
                                        </span>
                                      ) : (
                                        <button 
                                          onClick={() => togglePayment(player.id, month, monthlyFee)} 
                                          className={`w-full h-full py-0.5 rounded transition-all ${isPaid ? 'bg-emerald-500 text-white font-black' : 'text-zinc-400 font-bold'}`}
                                        >
                                          {isPaid ? 'PAGO' : `R$ ${monthlyFee}`}
                                        </button>
                                      )}
                                    </td>
                                  );
                                })}
                                <td className={`p-1 border border-zinc-200 text-center font-black ${remaining > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                                  R$ {remaining}
                                </td>
                              </tr>
                            );
                          })}
                          {players.length === 0 && (
                            <tr>
                              <td colSpan={14} className="p-4 text-center text-zinc-400 italic normal-case">
                                Nenhum jogador cadastrado.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {!isPrintMode && (
                    <div className="p-3 rounded-md bg-white/5 border border-white/10 space-y-1">
                      <div className="flex items-center gap-1.5 text-brand-primary">
                        <Info size={12} />
                        <span className="text-[8px] font-bold uppercase tracking-widest">Dica</span>
                      </div>
                      <p className="text-[8px] text-brand-text-secondary leading-relaxed">
                        Clique no valor da mensalidade para editar. Use o botão "+" para criar um novo ano de controle.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}

          {currentScreen === 'ranking' && isPrintMode && (
            <div key="ranking-print" className="p-8 bg-white min-h-screen text-black space-y-8">
              <div className="flex items-center justify-between border-b border-black/10 pb-3">
                <div className="flex items-center gap-2">
                  <Trophy size={16} className="text-black" />
                  <FutQuinaLogo size="sm" />
                  <span className="text-sm font-black opacity-10">|</span>
                  <span className="text-sm font-black tracking-tighter">Ranking</span>
                </div>
                <button 
                  onClick={() => setIsPrintMode(false)}
                  className="print:hidden px-3 py-1.5 bg-brand-primary text-black rounded-sm text-[9px] font-bold uppercase hover:opacity-80 transition-colors"
                >
                  Sair do Print
                </button>
              </div>

              <div className="space-y-4">
                <h2 className="text-base font-bold uppercase tracking-widest border-l-4 border-black pl-3">Top Jogadores</h2>
                <div className="border border-black rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-brand-primary text-black">
                        <th className="p-2 text-[10px] font-black uppercase">Pos</th>
                        <th className="p-2 text-[10px] font-black uppercase">Jogador</th>
                        <th className="p-2 text-[10px] font-black text-center !normal-case">Gols</th>
                        <th className="p-2 text-[10px] font-black text-center !normal-case">Assistências</th>
                        <th className="p-2 text-[10px] font-black uppercase text-center">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...players]
                        .sort((a, b) => (b.goals + b.assists) - (a.goals + a.assists))
                        .slice(0, 15)
                        .map((player, index) => (
                        <tr key={`ranking-row-print-${player.id}`} className="border-b border-black/10">
                          <td className="p-2 text-xs font-black">{index + 1}</td>
                          <td className="p-2 text-xs font-bold">{player.name}</td>
                          <td className="p-2 text-xs text-center">{player.goals}</td>
                          <td className="p-2 text-xs text-center">{player.assists}</td>
                          <td className="p-2 text-xs text-center font-black">{player.goals + player.assists}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="text-[8px] text-center opacity-50 uppercase font-bold">
                Gerado em {new Date().toLocaleDateString('pt-BR')} • Fut Quina App
              </div>
            </div>
          )}
        </AnimatePresence>
        {showEqualizerModal && equalizerData && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className={`w-full max-w-md p-8 rounded-lg bg-brand-card space-y-6`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black uppercase tracking-tighter">Completar Times</h3>
                <button onClick={() => setShowEqualizerModal(false)} className="p-2 glass-3d rounded-md">
                  <Plus size={20} className="rotate-45" />
                </button>
              </div>
              
              <p className="text-xs text-brand-text-secondary uppercase font-bold tracking-widest leading-relaxed">
                A partida só pode iniciar com times equilibrados. Selecione jogadores de <span className="text-brand-primary">outros times</span> para completar o <span className="text-brand-primary">{teams[equalizerData.targetTeamIndex].name}</span>.
                <br />
                <span className="text-[10px] opacity-60 mt-1 block">
                  Faltam {equalizerData.requiredCount - (teams[equalizerData.targetTeamIndex]?.playerIds?.length || 0)} jogador(es) para igualar ao {teams[equalizerData.otherTeamIndex]?.name || 'outro time'}.
                </span>
              </p>

              <div className="max-h-60 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {players
                  .filter(p => {
                    // Only show players who are NOT in the two selected teams AND are available
                    const isSelected = (match.teamAIndex !== -1 && teams[match.teamAIndex]?.playerIds?.includes(p.id)) || 
                                     (match.teamBIndex !== -1 && teams[match.teamBIndex]?.playerIds?.includes(p.id));
                    return !isSelected && p.isAvailable;
                  })
                  .map(player => {
                    const currentTeam = teams.find(t => t.playerIds.includes(player.id));
                    const isInOtherTeam = equalizerData.otherTeamIndex !== -1 && teams[equalizerData.otherTeamIndex]?.playerIds?.includes(player.id);
                    const isInAnyOtherTeam = teams.some((t, idx) => idx !== equalizerData.targetTeamIndex && t.playerIds?.includes(player.id));
                    
                    return (
                      <button 
                        key={`equalizer-player-choice-${player.id}`}
                        onClick={() => {
                          const newTeams = [...teams];
                          
                          // Remove from any other team first
                          newTeams.forEach(t => {
                            t.playerIds = t.playerIds.filter(id => id !== player.id);
                          });
                          
                          // Add to target team
                          if (newTeams[equalizerData.targetTeamIndex]) {
                            newTeams[equalizerData.targetTeamIndex].playerIds.push(player.id);
                          }
                          setTeams(newTeams);
                        }}
                        className={`w-full p-4 rounded-lg text-left font-bold transition-all flex justify-between items-center glass-3d ${
                          isInOtherTeam ? 'bg-brand-primary/10 border border-brand-primary/20' : 
                          isInAnyOtherTeam ? 'bg-zinc-500/5 opacity-60' :
                          'bg-brand-dark hover:bg-brand-primary/20'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className={isInOtherTeam ? 'text-brand-primary' : ''}>{player.name}</span>
                          <span className="text-[8px] uppercase opacity-60">
                            {currentTeam ? `Time: ${currentTeam.name}` : 'Sem Time'}
                          </span>
                        </div>
                        {isInOtherTeam ? <Shuffle size={16} className="text-brand-primary" /> : <Plus size={16} className="text-brand-primary" />}
                      </button>
                    );
                  })}
                {players.filter(p => p.isAvailable && !(match.teamAIndex !== -1 && teams[match.teamAIndex]?.playerIds?.includes(p.id)) && !(match.teamBIndex !== -1 && teams[match.teamBIndex]?.playerIds?.includes(p.id))).length === 0 && (
                  <div className="text-center py-8 opacity-50 text-xs">
                    Não há jogadores disponíveis em outros times. <br/>
                    Crie novos jogadores para equilibrar a partida.
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                {(teams[equalizerData.targetTeamIndex]?.playerIds?.length || 0) === equalizerData.requiredCount ? (
                  <div className="w-full py-4" />
                ) : (
                  <button 
                    disabled
                    className="w-full py-4 bg-white/5 text-white/20 rounded-lg font-black uppercase tracking-tighter cursor-not-allowed border border-white/5 flex items-center justify-center gap-2"
                  >
                    Completar Times para Iniciar
                  </button>
                )}

                <button 
                  onClick={() => setShowEqualizerModal(false)}
                  className="w-full py-3 text-brand-text-secondary text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

      </main>
    </div>

    {/* Modals */}
      <AnimatePresence>
        {isRandomizing && <RouletteOverlay />}
        {showPlayerActionsModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4"
            onClick={() => setShowPlayerActionsModal(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-xs p-6 rounded-xl bg-brand-card border border-white/10 shadow-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-brand-primary/20 flex items-center justify-center mb-3 border border-brand-primary/30 overflow-hidden">
                  {players.find(p => p.id === showPlayerActionsModal.playerId)?.photo ? (
                    <img 
                      src={players.find(p => p.id === showPlayerActionsModal.playerId)?.photo} 
                      alt="Player" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <User size={32} className="text-brand-primary" />
                  )}
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-center text-black">
                  {players.find(p => p.id === showPlayerActionsModal.playerId)?.name}
                </h3>
                <p className="text-[10px] text-brand-text-secondary uppercase font-bold tracking-widest mt-1">
                  {teams[showPlayerActionsModal.teamIndex]?.name}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {/* Swap Confirmation */}
                {swappingPlayerId && swappingPlayerId !== showPlayerActionsModal.playerId && (
                  <button 
                    onClick={() => {
                      const playerAId = swappingPlayerId;
                      const playerBId = showPlayerActionsModal.playerId;
                      
                      setTeams(prev => {
                        const newTeams = prev.map(t => ({ ...t, playerIds: [...t.playerIds] }));
                        let teamAIdx = -1;
                        let teamBIdx = -1;
                        
                        newTeams.forEach((team, idx) => {
                          if (team.playerIds.includes(playerAId)) teamAIdx = idx;
                          if (team.playerIds.includes(playerBId)) teamBIdx = idx;
                        });

                        if (teamAIdx !== -1 && teamBIdx !== -1) {
                          if (teamAIdx === teamBIdx) {
                            newTeams[teamAIdx].playerIds = newTeams[teamAIdx].playerIds.map(id => {
                              if (id === playerAId) return playerBId;
                              if (id === playerBId) return playerAId;
                              return id;
                            });
                          } else {
                            newTeams[teamAIdx].playerIds = newTeams[teamAIdx].playerIds.map(id => id === playerAId ? playerBId : id);
                            newTeams[teamBIdx].playerIds = newTeams[teamBIdx].playerIds.map(id => id === playerBId ? playerAId : id);
                          }
                        }
                        
                        return newTeams;
                      });
                      setSwappingPlayerId(null);
                      setShowPlayerActionsModal(null);
                    }}
                    className="w-full py-3 px-4 bg-brand-primary text-black rounded-lg font-black uppercase text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow shadow-brand-primary/20"
                  >
                    <RefreshCw size={16} />
                    Confirmar Troca
                  </button>
                )}

                {/* Goal Option - Only if team is in current match */}
                {!swappingPlayerId && (showPlayerActionsModal.teamIndex === match.teamAIndex || showPlayerActionsModal.teamIndex === match.teamBIndex) && (
                  <button 
                    onClick={() => {
                      if (!match.isActive || match.isPaused || match.scoreA >= match.config.goalLimit || match.scoreB >= match.config.goalLimit) return;
                      setShowAssistSelection({ teamIndex: showPlayerActionsModal.teamIndex, scorerId: showPlayerActionsModal.playerId });
                      setShowPlayerActionsModal(null);
                    }}
                    disabled={!match.isActive || match.isPaused || match.scoreA >= match.config.goalLimit || match.scoreB >= match.config.goalLimit}
                    className="w-full py-3 px-4 bg-brand-primary text-black rounded-lg font-black uppercase text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trophy size={16} />
                    Marcar Gol
                  </button>
                )}

                {/* Cancel Swap */}
                {swappingPlayerId === showPlayerActionsModal.playerId && (
                  <button 
                    onClick={() => {
                      setSwappingPlayerId(null);
                      setShowPlayerActionsModal(null);
                    }}
                    className="w-full py-3 px-4 bg-red-500/10 text-red-400 rounded-lg font-black uppercase text-xs flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all active:scale-95 border border-red-500/20"
                  >
                    <RefreshCw size={16} />
                    Cancelar Troca
                  </button>
                )}

                {/* Replace (Substituir) */}
                {swappingPlayerId !== showPlayerActionsModal.playerId && (
                  <button 
                    onClick={() => {
                      setSwappingPlayerId(showPlayerActionsModal.playerId);
                      setTeamsTab('proximos');
                      setShowPlayerActionsModal(null);
                      setToast({ message: "Selecione outro jogador para trocar de posição.", type: 'info' });
                    }}
                    className={`w-full py-3 px-4 rounded-lg font-black uppercase text-xs flex items-center justify-center gap-2 transition-all active:scale-95 border ${
                      theme === 'light' ? 'bg-zinc-200 text-zinc-800 border-zinc-300 hover:bg-zinc-300' : 'bg-white/5 text-white border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <ArrowLeftRight size={16} />
                    Substituir
                  </button>
                )}

                {/* Move (Mover) */}
                {!swappingPlayerId && (
                  <button 
                    onClick={() => {
                      setMovingPlayer({ teamId: teams[showPlayerActionsModal.teamIndex].id, playerId: showPlayerActionsModal.playerId });
                      setTeamsTab('proximos');
                      setShowPlayerActionsModal(null);
                      setToast({ message: "Selecione o time de destino (apenas times incompletos).", type: 'info' });
                    }}
                    className={`w-full py-3 px-4 rounded-lg font-black uppercase text-xs flex items-center justify-center gap-2 transition-all active:scale-95 border ${
                      theme === 'light' ? 'bg-sky-100 text-sky-700 border-sky-200 hover:bg-sky-200' : 'bg-sky-500/10 text-sky-400 border-sky-500/20 hover:bg-sky-500/20'
                    }`}
                  >
                    <MoveRight size={16} />
                    Mover
                  </button>
                )}

                {/* Absent (Ausente) */}
                {!swappingPlayerId && (
                  <button 
                    onClick={() => {
                      setTeams(prev => {
                        return prev.map(t => ({
                          ...t,
                          playerIds: t.playerIds.filter(id => id !== showPlayerActionsModal.playerId)
                        })).filter(t => t.playerIds.length > 0);
                      });
                      setPlayers(prev => prev.map(p => p.id === showPlayerActionsModal.playerId ? { ...p, isAvailable: false, arrivedAt: undefined } : p));
                      setShowPlayerActionsModal(null);
                      setToast({ message: "Jogador movido para ausentes.", type: 'info' });
                    }}
                    className="w-full py-3 px-4 bg-red-500/10 text-red-400 rounded-lg font-black uppercase text-xs flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all active:scale-95 border border-red-500/20"
                  >
                    <X size={16} />
                    Ausente
                  </button>
                )}

                <button 
                  onClick={() => setShowPlayerActionsModal(null)}
                  className="w-full py-3 text-brand-text-secondary text-[10px] font-bold uppercase mt-2"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showQueuePlayerModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-xs p-6 rounded-xl bg-brand-card border border-brand-primary/20 shadow-md"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-brand-dark flex items-center justify-center overflow-hidden border border-brand-primary mb-4">
                  {players.find(p => p.id === showQueuePlayerModal.playerId)?.photo ? (
                    <img src={players.find(p => p.id === showQueuePlayerModal.playerId)?.photo} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User size={32} className="text-brand-primary" />
                  )}
                </div>
                <h3 className="text-xl font-black tracking-tighter text-black capitalize">
                  {players.find(p => p.id === showQueuePlayerModal.playerId)?.name?.toLowerCase()}
                </h3>
                <p className="text-xs uppercase mt-1 text-zinc-800">Ações do Jogador</p>
              </div>

              <div className="space-y-2">
                {!showQueuePlayerModal.showMoveOptions ? (
                  <>
                    <button 
                      onClick={() => {
                        setSwappingPlayerId(showQueuePlayerModal.playerId);
                        setShowQueuePlayerModal(null);
                        setToast({ message: "Selecione outro jogador para trocar de posição.", type: 'info' });
                      }}
                      className={`w-full py-3 px-4 rounded-lg font-black uppercase text-xs flex items-center justify-center gap-2 transition-all active:scale-95 border bg-zinc-200 text-zinc-800 border-zinc-300 hover:bg-zinc-300`}
                    >
                      <ArrowLeftRight size={16} />
                      Substituir
                    </button>

                    <button 
                      onClick={() => {
                        setMovingPlayer({ teamId: teams[showQueuePlayerModal.teamIndex].id, playerId: showQueuePlayerModal.playerId });
                        setShowQueuePlayerModal(null);
                        setToast({ message: "Selecione o time de destino (apenas times incompletos).", type: 'info' });
                      }}
                      className={`w-full py-3 px-4 rounded-lg font-black uppercase text-xs flex items-center justify-center gap-2 transition-all active:scale-95 border bg-sky-100 text-sky-700 border-sky-200 hover:bg-sky-200`}
                    >
                      <MoveRight size={16} />
                      Mover
                    </button>

                    <button 
                      onClick={() => {
                        setTeams(prev => {
                          return prev.map(t => ({
                            ...t,
                            playerIds: t.playerIds.filter(id => id !== showQueuePlayerModal.playerId)
                          })).filter(t => t.playerIds.length > 0);
                        });
                        setPlayers(prev => prev.map(p => p.id === showQueuePlayerModal.playerId ? { ...p, isAvailable: false, arrivedAt: undefined } : p));
                        setShowQueuePlayerModal(null);
                        setToast({ message: "Jogador movido para ausentes.", type: 'info' });
                      }}
                      className="w-full py-3 px-4 bg-red-500/10 text-red-400 rounded-lg font-black uppercase text-xs flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all active:scale-95 border border-red-500/20"
                    >
                      <X size={16} />
                      Ausente
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-brand-text-secondary uppercase px-2 py-1 text-center">Selecione o time de destino:</div>
                    <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-1">
                      {teams.map((t, idx) => {
                        if (idx === showQueuePlayerModal.teamIndex) return null;
                        return (
                          <button
                            key={`move-to-${t.id}`}
                            onClick={() => {
                              setTeams(prev => {
                                const newTeams = [...prev].map(team => ({ ...team, playerIds: [...team.playerIds] }));
                                if (newTeams[showQueuePlayerModal.teamIndex]) {
                                  newTeams[showQueuePlayerModal.teamIndex].playerIds = newTeams[showQueuePlayerModal.teamIndex].playerIds.filter(id => id !== showQueuePlayerModal.playerId);
                                }
                                if (newTeams[idx]) {
                                  newTeams[idx].playerIds.push(showQueuePlayerModal.playerId);
                                }
                                return newTeams.filter(team => team.playerIds.length > 0);
                              });
                              setShowQueuePlayerModal(null);
                              setToast({ message: "Jogador movido com sucesso!", type: 'success' });
                            }}
                            className="w-full text-left px-4 py-3 text-xs font-bold text-white bg-white/5 hover:bg-brand-primary/20 hover:text-brand-primary rounded-lg transition-colors border border-white/5"
                          >
                            {t.name}
                          </button>
                        );
                      })}
                    </div>
                    <button 
                      onClick={() => setShowQueuePlayerModal({ ...showQueuePlayerModal, showMoveOptions: false })}
                      className="w-full py-2 text-brand-text-secondary text-[10px] font-bold uppercase mt-2"
                    >
                      Voltar
                    </button>
                  </div>
                )}

                <button 
                  onClick={() => setShowQueuePlayerModal(null)}
                  className="w-full py-3 text-brand-text-secondary text-[10px] font-bold uppercase mt-2"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showAssistSelection && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[160] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-xs rounded-xl border shadow-md overflow-hidden bg-zinc-100 border-zinc-200"
            >
              <div className="bg-brand-primary p-6 text-center">
                <h3 className="text-sm font-black uppercase tracking-tighter text-black">Quem deu a assistência?</h3>
                <p className="text-[10px] text-black/70 font-bold mt-1 uppercase tracking-widest">
                  Gol de <span className="text-black underline decoration-2 underline-offset-2">{players.find(p => p.id === showAssistSelection.scorerId)?.name}</span>
                </p>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar mb-4">
                  <button 
                    onClick={() => {
                      const team = showAssistSelection.teamIndex === match.teamAIndex ? 'A' : 'B';
                      registerGoal(team, showAssistSelection.scorerId);
                      setShowAssistSelection(null);
                    }}
                    className="w-full p-2.5 rounded-lg border transition-all text-left group bg-white border-zinc-200 hover:border-brand-primary hover:bg-brand-primary/5"
                  >
                    <div className="text-xs font-black uppercase transition-colors text-zinc-900 group-hover:text-brand-primary">Sem Assistência</div>
                  </button>

                  {teams[showAssistSelection.teamIndex].playerIds
                    .filter(pid => pid !== showAssistSelection.scorerId)
                    .map((pid) => (
                      <button
                        key={`assist-choice-modal-${pid}`}
                        onClick={() => {
                          const team = showAssistSelection.teamIndex === match.teamAIndex ? 'A' : 'B';
                          registerGoal(team, showAssistSelection.scorerId, pid);
                          setShowAssistSelection(null);
                        }}
                        className="w-full p-2.5 rounded-lg border transition-all text-left group flex items-center gap-2 bg-white border-zinc-200 hover:border-brand-primary hover:bg-brand-primary/5"
                      >
                        <div className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden border shrink-0 bg-zinc-100 border-zinc-200">
                          {players.find(p => p.id === pid)?.photo ? (
                            <img src={players.find(p => p.id === pid)?.photo} alt="P" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <User size={10} className="text-zinc-400" />
                          )}
                        </div>
                        <div className={`text-xs font-black uppercase transition-colors text-zinc-900 group-hover:text-brand-primary`}>
                          {players.find(p => p.id === pid)?.name}
                        </div>
                      </button>
                    ))}
                </div>

                <button 
                  onClick={() => setShowAssistSelection(null)}
                  className="w-full py-3 text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95 rounded-lg border-zinc-400 text-zinc-600 hover:bg-zinc-200"
                >
                  Cancelar Gol
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {showCloseWarningModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[110] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md p-8 rounded-lg bg-brand-card border border-red-500/20 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-red-500 rounded-md flex items-center justify-center mb-6 shadow shadow-red-500/20">
                <AlertTriangle size={40} className="text-white" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 text-brand-primary">Atenção!</h3>
              <p className="text-sm text-brand-text-secondary mb-8">
                Se você fechar esta janela, todas as partidas terão que ser criadas novamente. Deseja continuar?
              </p>
              <button 
                onClick={() => {
                  setShowCloseWarningModal(false);
                  setCurrentScreen('teams');
                  setTeamsTab(match.isActive ? 'historico' : 'proximos');
                }}
                className="w-full py-4 bg-red-500 text-white rounded-md font-black uppercase tracking-tighter shadow shadow-red-500/20 hover:bg-red-600 transition-all active:scale-95"
              >
                Continuar
              </button>
              <button 
                onClick={() => setShowCloseWarningModal(false)}
                className="w-full py-4 mt-2 text-brand-text-secondary text-xs font-bold uppercase"
              >
                Voltar
              </button>
            </motion.div>
          </motion.div>
        )}



        {showMatchSettingsModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className={`w-full max-w-md p-6 rounded-lg bg-brand-card max-h-[90vh] flex flex-col`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black uppercase tracking-tighter">Ajustes da Partida</h3>
                <button 
                  onClick={() => setShowMatchSettingsModal(false)}
                  className="p-2 glass-3d rounded-md"
                >
                  <Plus size={20} className="rotate-45" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
                {/* Team Selection */}
                <section className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-text-secondary">Confronto Atual</h4>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
                    {teams.map((t, idx) => (
                      <div key={`settings-team-select-${t.id}-${idx}`} className={`p-[1px] rounded-md ${(match.teamAIndex === idx || match.teamBIndex === idx) ? 'bg-team-gradient' : 'bg-transparent'}`}>
                        <motion.button 
                          animate={(match.teamAIndex === idx || match.teamBIndex === idx) ? { 
                            scale: [1, 1.03, 1],
                            y: [0, -2, 0],
                          } : {}}
                          onClick={() => {
                            if (match.teamAIndex === idx) {
                              setMatch(prev => ({ ...prev, teamAIndex: -1 }));
                            } else if (match.teamBIndex === idx) {
                              setMatch(prev => ({ ...prev, teamBIndex: -1 }));
                            } else if (match.teamAIndex === -1) {
                              setMatch(prev => ({ ...prev, teamAIndex: idx }));
                            } else if (match.teamBIndex === -1) {
                              setMatch(prev => ({ ...prev, teamBIndex: idx }));
                            } else {
                              setMatch(prev => ({ ...prev, teamBIndex: idx }));
                            }
                          }}
                          className={`w-full p-3 rounded-[15px] text-xs font-black transition-all flex flex-col items-center gap-1 relative ${
                            (match.teamAIndex === idx || match.teamBIndex === idx) ? 
                              'bg-[#0D0D0D] border border-brand-primary text-white shadow-xl' : 
                              'bg-[#0D0D0D] border border-white/5 text-white/60'
                          }`}
                        >
                          <div className="absolute top-2 left-2 z-10">
                            <div className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all duration-500 ${
                              (match.teamAIndex === idx || match.teamBIndex === idx) ? 'bg-brand-primary border-[#0D0D0D]' : 'bg-black/5 border-black/20'
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                (match.teamAIndex === idx || match.teamBIndex === idx) ? 'bg-[#0D0D0D]' : 'bg-black/10'
                              }`} />
                            </div>
                          </div>
                          <span className="truncate w-full text-center">{t.name}</span>
                          <div className="flex flex-wrap justify-center gap-0.5 mt-1">
                            {t.playerIds.slice(0, 3).map((pid, pidx) => (
                              <span key={`settings-team-player-badge-${t.id}-${pid}-${pidx}`} className="text-[6px] opacity-60 bg-black/5 px-1 rounded-sm">
                                {players.find(p => p.id === pid)?.name.split(' ')[0]}
                              </span>
                            ))}
                          </div>
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Manage Teams & Players */}
                <section className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-text-secondary">Gerenciar Times e Jogadores</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <AnimatePresence mode="popLayout">
                      {teams.map((team, tIdx) => (
                        <motion.div 
                          key={`settings-team-manage-${team.id}-${tIdx}`} 
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className={`p-4 rounded-lg border bg-brand-dark/50 transition-all duration-300 ${
                            (tIdx === match.teamAIndex || tIdx === match.teamBIndex) 
                              ? 'border-brand-primary shadow-[0_0_15px_rgba(198,255,0,0.15)]' 
                              : 'border-white/5'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black uppercase tracking-widest text-[#0D0D0D]">{team.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-sm border border-white/10">
                                <button 
                                  onClick={() => moveTeam(tIdx, 'up')}
                                  disabled={tIdx === 0}
                                  className="p-1.5 text-[#0D0D0D] hover:text-brand-primary disabled:opacity-20 transition-colors"
                                >
                                  <ChevronRight size={18} className="-rotate-90" strokeWidth={3} />
                                </button>
                                <div className="w-[1px] h-4 bg-black/10 mx-0.5" />
                                <button 
                                  onClick={() => moveTeam(tIdx, 'down')}
                                  disabled={tIdx === teams.length - 1}
                                  className="p-1.5 text-[#0D0D0D] hover:text-brand-primary disabled:opacity-20 transition-colors"
                                >
                                  <ChevronRight size={18} className="rotate-90" strokeWidth={3} />
                                </button>
                              </div>
                              <button 
                                onClick={() => setShowQuickAddPlayerModal(tIdx)}
                                className="flex items-center gap-1 px-2 py-1 bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/30 rounded-lg transition-all group ml-2"
                              >
                                <UserPlus size={10} className="text-brand-primary group-hover:scale-110 transition-transform" />
                                <span className="text-[8px] font-black uppercase text-brand-primary tracking-widest">Adicionar ou Criar</span>
                              </button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {team.playerIds.map((pid, idx) => {
                              const player = players.find(p => p.id === pid);
                              if (!player) return null;
                              return (
                                <div key={`settings-player-item-${team.id}-${pid}-${idx}`} className={`flex items-center justify-between p-2 rounded-md bg-brand-card/50`}>
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    {editingPlayerId === pid ? (
                                      <input 
                                        autoFocus
                                        defaultValue={player.name}
                                        className="bg-transparent border-b border-brand-primary outline-none text-xs font-bold py-0.5 w-full"
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') updatePlayerName(pid, e.currentTarget.value);
                                          if (e.key === 'Escape') setEditingPlayerId(null);
                                        }}
                                        onBlur={(e) => updatePlayerName(pid, e.target.value)}
                                      />
                                    ) : (
                                      <span className="text-xs font-bold truncate text-[#0D0D0D]">{player.name}</span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {swappingPlayerId === pid ? (
                                      <div className="flex items-center gap-1 bg-brand-primary/20 p-1 rounded-sm border border-brand-primary/30">
                                        <button 
                                          onClick={() => setSwappingPlayerId(null)}
                                          className="p-1 text-xs font-bold text-[#0D0D0D] hover:text-brand-primary"
                                        >
                                          Cancelar
                                        </button>
                                      </div>
                                    ) : (
                                      <button 
                                        onClick={() => setSwappingPlayerId(pid)}
                                        className="p-1.5 text-brand-text-secondary hover:text-brand-primary flex items-center gap-1"
                                      >
                                        <RefreshCw size={12} className={swappingPlayerId ? 'animate-spin' : ''} />
                                        <span className="text-[8px] font-black uppercase">Sub</span>
                                      </button>
                                    )}
                                    
                                    {swappingPlayerId && swappingPlayerId !== pid && (
                                      <button 
                                        onClick={() => {
                                          const playerAId = swappingPlayerId;
                                          const playerBId = pid;
                                          
                                          setTeams(prev => {
                                            const newTeams = prev.map(t => ({ ...t, playerIds: [...t.playerIds] }));
                                            let teamAIdx = -1;
                                            let teamBIdx = -1;
                                            
                                            newTeams.forEach((team, idx) => {
                                              if (team.playerIds.includes(playerAId)) teamAIdx = idx;
                                              if (team.playerIds.includes(playerBId)) teamBIdx = idx;
                                            });

                                            if (teamAIdx !== -1 && teamBIdx !== -1) {
                                              if (teamAIdx === teamBIdx) {
                                                newTeams[teamAIdx].playerIds = newTeams[teamAIdx].playerIds.map(id => {
                                                  if (id === playerAId) return playerBId;
                                                  if (id === playerBId) return playerAId;
                                                  return id;
                                                });
                                              } else {
                                                newTeams[teamAIdx].playerIds = newTeams[teamAIdx].playerIds.map(id => id === playerAId ? playerBId : id);
                                                newTeams[teamBIdx].playerIds = newTeams[teamBIdx].playerIds.map(id => id === playerBId ? playerAId : id);
                                              }
                                            }
                                            
                                            return newTeams;
                                          });
                                          setSwappingPlayerId(null);
                                        }}
                                        className="p-1.5 bg-brand-primary text-[#0D0D0D] rounded-sm text-[8px] font-black uppercase animate-pulse"
                                      >
                                        Trocar
                                      </button>
                                    )}


                                    <button 
                                      onClick={() => {
                                        setTeams(prev => {
                                          const newTeams = prev.map(t => ({ ...t, playerIds: [...t.playerIds] }));
                                          newTeams[tIdx].playerIds = newTeams[tIdx].playerIds.filter(id => id !== pid);
                                          return newTeams;
                                        });
                                      }}
                                      className="p-1.5 text-brand-text-secondary hover:text-red-400"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </section>

                {/* Bench Players */}
                <section className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-text-secondary">Banco de Reservas</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {players.filter(p => p.isAvailable && !teams.some(t => t.playerIds.includes(p.id))).length === 0 ? (
                      <p className="text-[10px] text-brand-text-secondary italic opacity-50">Nenhum reserva disponível</p>
                    ) : (
                      players.filter(p => p.isAvailable && !teams.some(t => t.playerIds.includes(p.id))).map((player) => (
                        <div key={`quick-add-player-${player.id}`} className="flex items-center justify-between p-2 rounded-md bg-brand-dark/30 border border-white/5">
                          <span className="text-xs font-bold truncate text-[#0D0D0D]">{player.name}</span>
                          <div className="flex items-center gap-1">
                            {swappingPlayerId && (
                              <button 
                                onClick={() => {
                                  const playerInTeamId = swappingPlayerId;
                                  const playerFromBenchId = player.id;
                                  
                                  setTeams(prev => {
                                    const newTeams = prev.map(t => ({ ...t, playerIds: [...t.playerIds] }));
                                    const teamIdx = newTeams.findIndex(t => t.playerIds.includes(playerInTeamId));
                                    
                                    if (teamIdx !== -1) {
                                      newTeams[teamIdx].playerIds = newTeams[teamIdx].playerIds.map(id => 
                                        id === playerInTeamId ? playerFromBenchId : id
                                      );
                                    }
                                    return newTeams;
                                  });
                                  setSwappingPlayerId(null);
                                }}
                                className="px-3 py-1 bg-brand-primary text-[#0D0D0D] rounded-sm text-[8px] font-black uppercase animate-pulse"
                              >
                                Entrar
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>

              <button 
                onClick={() => {
                  if (match.hasEnded || match.timeRemaining === 0 || match.scoreA >= match.config.goalLimit || match.scoreB >= match.config.goalLimit) {
                    setMatch(prev => ({
                      ...prev,
                      scoreA: 0,
                      scoreB: 0,
                      timeRemaining: prev.config.duration * 60,
                      events: [],
                      hasEnded: false,
                      isPaused: true,
                      isActive: true
                    }));
                  }
                  setShowMatchSettingsModal(false);
                }}
                className="w-full py-4 mt-6 bg-brand-gradient text-black rounded-lg font-black uppercase tracking-tighter shadow-xl  glass-3d"
              >
                salvar
              </button>
            </motion.div>
          </motion.div>
        )}

        {showConfigMenu && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
            onClick={() => setShowConfigMenu(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className={`w-full max-w-sm p-6 rounded-lg bg-brand-card space-y-4`}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-black uppercase tracking-tighter text-center">Configuração</h3>
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => {
                    setShowConfigMenu(false);
                    setShowTimeEditModal(true);
                  }}
                  className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all bg-brand-dark hover:bg-brand-primary/20`}
                >
                  <Timer size={20} className="text-brand-primary" />
                  <span>Tempo da Partida</span>
                </button>
                <button 
                  onClick={() => {
                    setShowConfigMenu(false);
                    setShowMatchSettingsModal(true);
                  }}
                  className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all bg-brand-dark hover:bg-brand-primary/20`}
                >
                  <Settings size={20} className="text-zinc-500" />
                  <span>Ajuste de Partida</span>
                </button>
              </div>
              <button 
                onClick={() => setShowConfigMenu(false)}
                className={`w-full py-4 rounded-2xl font-bold glass-3d bg-brand-dark text-brand-text-secondary`}
              >
                Fechar
              </button>
            </motion.div>
          </motion.div>
        )}

        {showTimeEditModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className={`w-full max-w-sm p-8 rounded-lg bg-brand-card space-y-6 relative`}
            >
              <button 
                onClick={() => setShowTimeEditModal(false)}
                className="absolute top-6 right-6 p-2 glass-3d rounded-xl text-brand-text-secondary hover:text-brand-primary transition-colors"
              >
                <Plus size={20} className="rotate-45" />
              </button>

              <h3 className="text-2xl font-black uppercase tracking-tighter">Tempo da Partida</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-brand-text-secondary">Duração (Minutos)</label>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={match.config.duration === 0 ? '' : match.config.duration}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                      if (!isNaN(val)) {
                        setMatch(prev => ({
                          ...prev,
                          config: { ...prev.config, duration: val },
                          timeRemaining: val * 60
                        }));
                      }
                    }}
                    className={`w-full p-4 rounded-lg outline-none font-bold bg-brand-dark`}
                  />
                </div>
              </div>
              <button 
                onClick={() => setShowTimeEditModal(false)}
                className="w-full py-4 bg-brand-gradient text-black rounded-md font-black uppercase tracking-tighter shadow-xl  glass-3d"
              >
                Confirmar
              </button>
            </motion.div>
          </motion.div>
        )}

        {showEmojiPicker !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
            onClick={() => setShowEmojiPicker(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className={`w-full max-w-sm p-6 rounded-lg bg-brand-card space-y-6`}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-black uppercase tracking-tighter text-center">Escolher Emoji</h3>
              <div className="grid grid-cols-5 gap-3">
                {TEAM_EMOJIS.map(emoji => (
                  <button 
                    key={`emoji-${emoji}`}
                    onClick={() => {
                      const newTeams = [...teams];
                      newTeams[showEmojiPicker].emoji = emoji;
                      setTeams(newTeams);
                      setShowEmojiPicker(null);
                    }}
                    className={`text-2xl p-3 rounded-lg transition-all hover:scale-110 active:scale-90 bg-brand-dark hover:bg-brand-primary/20`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setShowEmojiPicker(null)}
                className={`w-full py-4 rounded-md font-bold glass-3d bg-brand-dark text-brand-text-secondary`}
              >
                Cancelar
              </button>
            </motion.div>
          </motion.div>
        )}

        {showTeamWarningModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className={`w-full max-w-sm p-8 rounded-lg bg-brand-card space-y-6 text-center`}
            >
              <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={40} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter">Times Incompletos</h3>
              <p className={`text-sm text-brand-text-secondary`}>
                Para iniciar uma partida, você precisa ter pelo menos 2 times com jogadores escalados.
              </p>
              
              <div className="space-y-3 pt-4">
                <button 
                  onClick={() => {
                    setShowTeamWarningModal(false);
                    setShowFormationChoiceModal(true);
                  }}
                  className="w-full py-4 bg-brand-gradient text-black rounded-md font-bold shadow-xl  flex items-center justify-center gap-2 glass-3d"
                >
                  <Plus size={18} /> Formar Times
                </button>
                <button 
                  onClick={() => setShowTeamWarningModal(false)}
                  className={`w-full py-4 rounded-lg font-bold glass-3d bg-brand-dark text-brand-text-secondary`}
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showFormationChoiceModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className={`w-full max-w-sm p-8 rounded-lg bg-brand-card space-y-6 text-center`}
            >
              <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <LayoutGrid size={40} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter">Como deseja formar?</h3>
              <p className={`text-sm text-brand-text-secondary`}>
                Escolha o método de escalação para os seus times.
              </p>
              
              <div className="space-y-3 pt-4">
                <button 
                  onClick={() => {
                    setShowFormationChoiceModal(false);
                    setShowRandomizeModal(true);
                  }}
                  className={`w-full py-4 rounded-lg font-bold shadow-xl flex items-center justify-center gap-2 glass-3d bg-brand-gradient text-[#0D0D0D] `}
                >
                  <Shuffle size={18} /> Aleatório
                </button>
                <button 
                  onClick={() => {
                    setShowFormationChoiceModal(false);
                    setCurrentScreen('teams');
                    setTeamsTab(match.isActive ? 'historico' : 'proximos');
                  }}
                  className={`w-full py-4 rounded-lg font-bold glass-3d bg-brand-dark text-brand-text-secondary flex items-center justify-center gap-2`}
                >
                  <Plus size={18} /> Manual
                </button>
                <button 
                  onClick={() => setShowFormationChoiceModal(false)}
                  className="w-full py-2 text-xs font-bold uppercase tracking-widest text-brand-text-secondary mt-2"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showRandomizeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className={`w-full max-w-sm p-8 rounded-lg bg-brand-card space-y-6`}
            >
              <h3 className="text-2xl font-black uppercase tracking-tighter">Sortear Jogadores</h3>
              <p className="text-xs text-brand-text-secondary uppercase font-bold tracking-widest">Quantos jogadores por time?</p>
              
              <input 
                type="number" 
                defaultValue={5}
                id="players-per-team-input"
                className={`w-full p-4 rounded-lg outline-none bg-brand-dark`}
              />

              <div className="flex gap-2">
                <button 
                  onClick={() => setShowRandomizeModal(false)}
                  className="flex-1 py-4 bg-brand-dark text-brand-text-secondary rounded-lg font-bold glass-3d"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    const val = parseInt((document.getElementById('players-per-team-input') as HTMLInputElement).value);
                    randomizeTeams(val);
                  }}
                  className="flex-1 py-4 bg-brand-gradient text-black rounded-lg font-bold shadow-xl  glass-3d"
                >
                  Sortear
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showEventModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-end justify-center"
            onClick={() => {
              setShowEventModal(null);
              setSelectedScorerId(null);
            }}
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`w-full max-w-lg p-8 rounded-t-2xl bg-brand-card max-h-[80vh] overflow-y-auto`}
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-brand-dark rounded-full mx-auto mb-6" />
              
              {currentScreen === 'teams' ? (
                <>
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-6">Adicionar ao {teams[showEventModal.team as any]?.name || 'Time'}</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {players
                      .filter(p => p.isAvailable && !teams.some(t => t.playerIds.includes(p.id)))
                      .map((player) => (
                        <button 
                          key={`event-scorer-list-${player.id}`}
                          onClick={() => {
                            const teamIdx = showEventModal.team as any;
                            const currentTeam = teams[teamIdx];
                            
                            if (currentTeam.playerIds.length >= match.config.playersPerTeam) {
                              // Team is full, create new team
                              const nextLetter = String.fromCharCode(65 + teams.length);
                              const emoji = TEAM_EMOJIS[teams.length % TEAM_EMOJIS.length];
          const newTeam: Team = { id: generateId(), name: `Time ${nextLetter}`, playerIds: [player.id], emoji, color: getNextTeamColor(teams) };
                              
                              setTeams([...teams, newTeam]);
                              setToast({ 
                                message: `O ${currentTeam.name} já está lotado. Criamos o ${newTeam.name} para este jogador.`, 
                                type: 'warning' 
                              });
                              setTimeout(() => setToast(null), 4000);
                            } else {
                              const newTeams = [...teams];
                              newTeams[teamIdx].playerIds.push(player.id);
                              setTeams(newTeams);
                            }
                            setShowEventModal(null);
                          }}
                          className={`p-4 rounded-md text-left font-bold transition-all glass-3d bg-brand-dark`}
                        >
                          {player.name}
                        </button>
                      ))}
                    {players.filter(p => p.isAvailable && !teams.some(t => t.playerIds.includes(p.id))).length === 0 && (
                      <div className="text-center py-8 opacity-50">Todos os jogadores já estão em times.</div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {!selectedScorerId ? (
                    <>
                      <h3 className="text-xl font-black uppercase tracking-tighter mb-6">Quem marcou o gol?</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {(showEventModal.team === 'A' ? (teams[match.teamAIndex]?.playerIds || []) : (teams[match.teamBIndex]?.playerIds || [])).map((pid) => {
                          const player = players.find(p => p.id === pid);
                          return player ? (
                            <button 
                              key={`event-scorer-select-${showEventModal.team}-${pid}`}
                              onClick={() => setSelectedScorerId(pid)}
                              className={`w-full p-4 rounded-lg text-left font-bold transition-all flex justify-between items-center glass-3d bg-brand-dark`}
                            >
                              <span>{player.name}</span>
                              <ChevronRight size={18} className="text-brand-text-secondary" />
                            </button>
                          ) : null;
                        })}
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-black uppercase tracking-tighter mb-2 text-brand-primary">Assistência?</h3>
                      <p className="text-xs text-brand-text-secondary mb-6 uppercase font-bold tracking-widest">GOL DE: {players.find(p => p.id === selectedScorerId)?.name}</p>
                      <div className="grid grid-cols-1 gap-2">
                        <button 
                          onClick={() => registerGoal(showEventModal.team, selectedScorerId)}
                          className={`w-full p-4 rounded-lg text-left font-bold transition-all border-2 border-dashed border-white/10 glass-3d hover:bg-brand-dark`}
                        >
                          Sem Assistência
                        </button>
                        {(showEventModal.team === 'A' ? (teams[match.teamAIndex]?.playerIds || []) : (teams[match.teamBIndex]?.playerIds || []))
                          .filter(id => id !== selectedScorerId)
                          .map((aid) => {
                            const assistPlayer = players.find(p => p.id === aid);
                            return (
                              <button 
                                key={`event-assist-select-${showEventModal.team}-${aid}`}
                                onClick={() => registerGoal(showEventModal.team, selectedScorerId, aid)}
                                className={`p-4 rounded-lg text-left font-bold transition-all glass-3d bg-brand-dark`}
                              >
                                {assistPlayer?.name}
                              </button>
                            );
                          })}
                        <button 
                          onClick={() => setSelectedScorerId(null)}
                          className="w-full py-4 text-brand-text-secondary text-xs font-bold uppercase mt-4 glass-3d rounded-lg"
                        >
                          Voltar
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
        {duplicatePlayerName && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm p-8 rounded-lg bg-brand-card space-y-6 relative border border-white/10 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-black text-center uppercase tracking-tighter">Nome Duplicado</h3>
              <p className="text-center text-brand-text-secondary text-sm">
                Já existe um jogador com o nome <strong className="text-black">"{duplicatePlayerName.name}"</strong>. 
                Por favor, altere o nome para continuar.
              </p>
              
              <div className="space-y-4">
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Novo nome..."
                  id="new-duplicate-name"
                  defaultValue={duplicatePlayerName.name}
                  className="w-full p-4 rounded-lg outline-none font-bold bg-brand-dark border border-white/5 focus:border-brand-primary/30 transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const newName = e.currentTarget.value.trim();
                      if (newName && newName.toLowerCase() !== duplicatePlayerName.name.toLowerCase()) {
                        duplicatePlayerName.callback(newName);
                        setDuplicatePlayerName(null);
                      } else {
                        setToast({ message: "Por favor, escolha um nome diferente.", type: 'warning' });
                      }
                    }
                  }}
                />
                <div className="flex gap-3">
                  <button 
                    onClick={() => setDuplicatePlayerName(null)}
                    className="flex-1 py-3 bg-white/5 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={() => {
                      const input = document.getElementById('new-duplicate-name') as HTMLInputElement;
                      const newName = input.value.trim();
                      if (newName && newName.toLowerCase() !== duplicatePlayerName.name.toLowerCase()) {
                        duplicatePlayerName.callback(newName);
                        setDuplicatePlayerName(null);
                      } else {
                        setToast({ message: "Por favor, escolha um nome diferente.", type: 'warning' });
                      }
                    }}
                    className="flex-1 py-3 bg-brand-gradient text-black rounded-xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all shadow-lg shadow-brand-primary/20"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showQuickAddPlayerModal !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className={`w-full max-w-sm p-8 rounded-lg bg-brand-card space-y-6 relative`}
            >
              <button 
                onClick={() => setShowQuickAddPlayerModal(null)}
                className="absolute top-6 right-6 p-2 glass-3d rounded-xl text-brand-text-secondary hover:text-brand-primary transition-colors"
              >
                <Plus size={20} className="rotate-45" />
              </button>

              <h3 className="text-2xl font-black uppercase tracking-tighter">Adicionar Jogador</h3>
              <p className="text-xs text-brand-text-secondary uppercase font-bold tracking-widest">Adicionar ao {teams[showQuickAddPlayerModal].name}</p>
              
              <div className="space-y-6">
                {/* Existing Players List */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Jogadores Disponíveis</p>
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {players.filter(p => p.isAvailable && !teams.flatMap(t => t.playerIds).includes(p.id)).length === 0 ? (
                      <div className="py-4 text-center border border-dashed border-white/10 rounded-lg opacity-40">
                        <p className="text-xs font-bold normal-case">Nenhum jogador livre</p>
                      </div>
                    ) : (
                      players.filter(p => p.isAvailable && !teams.flatMap(t => t.playerIds).includes(p.id)).map((p) => (
                        <button
                          key={`randomize-player-list-${p.id}`}
                          onClick={() => addPlayerToTeam(p.id, showQuickAddPlayerModal)}
                          className="w-full p-3 flex items-center justify-between rounded-lg bg-brand-dark border border-white/5 hover:border-brand-primary/50 transition-all group"
                        >
                          <span className="text-sm font-bold text-[#0D0D0D]">{p.name}</span>
                          <Plus size={14} className="text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/5"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-brand-card px-2 text-[8px] font-black text-brand-text-secondary uppercase tracking-widest">Ou crie um novo</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Nome do novo jogador..."
                    id="quick-player-name"
                    className={`w-full p-4 rounded-lg outline-none font-bold bg-brand-dark border border-white/5 focus:border-brand-primary/30 transition-all`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        quickAddPlayer(e.currentTarget.value, showQuickAddPlayerModal);
                      }
                    }}
                  />
                  <button 
                    onClick={() => {
                      const input = document.getElementById('quick-player-name') as HTMLInputElement;
                      quickAddPlayer(input.value, showQuickAddPlayerModal);
                    }}
                    className="w-full py-4 bg-brand-gradient text-black rounded-lg font-black uppercase tracking-tighter shadow-xl  glass-3d"
                  >
                    Criar e Adicionar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showCloseWarningModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md p-8 rounded-lg bg-brand-card border border-brand-primary/20 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
                <Info size={40} className="text-orange-500" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tighter mb-4 text-orange-500">Atenção!</h3>
              <p className="text-sm text-brand-text-secondary mb-8 leading-relaxed">
                Se você fechar esta janela, todas as partidas terão que ser criadas novamente. Deseja continuar?
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setShowCloseWarningModal(false)}
                  className="flex-1 py-4 bg-white/5 text-white rounded-md font-black uppercase tracking-tighter hover:bg-white/10 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    setShowCloseWarningModal(false);
                    setCurrentScreen('scoreboard');
                  }}
                  className="flex-1 py-4 bg-brand-gradient text-black rounded-md font-black uppercase tracking-tighter shadow-xl  hover:opacity-90 transition-all"
                >
                  Sim, Sair
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {replacingPlayer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md p-8 rounded-lg bg-brand-card border border-brand-primary/20 flex flex-col items-center"
            >
              <p className="text-xs text-brand-text-secondary mb-6 text-center">O time vencedor teve um jogador removido. Escolha um jogador de outro time para substituí-lo:</p>
              
              <div className="w-full max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar mb-6">
                {teams.map((t, tIdx) => (
                  tIdx !== (replacingPlayer?.teamIndex ?? -1) && (
                    <div key={`summary-team-select-${t.id}-${tIdx}`} className="space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-widest text-brand-text-secondary ml-2">{t.name}</p>
                      {t.playerIds.map((pid, idx) => (
                        <button
                          key={`summary-player-replace-${t.id}-${pid}-${idx}`}
                          onClick={() => {
                            setTeams(prev => {
                              const newTeams = prev.map(team => ({ ...team, playerIds: [...team.playerIds] }));
                              // Remove from source team
                              newTeams[tIdx].playerIds = newTeams[tIdx].playerIds.filter(id => id !== pid);
                              // Replace in target team
                              newTeams[replacingPlayer.teamIndex].playerIds = newTeams[replacingPlayer.teamIndex].playerIds.map(id => 
                                id === replacingPlayer.removedPlayerId ? pid : id
                              );
                              return newTeams.filter(team => team.playerIds.length > 0);
                            });
                            setReplacingPlayer(null);
                          }}
                          className="w-full p-3 flex items-center justify-between rounded-md bg-brand-dark border border-white/5 hover:border-brand-primary/50 transition-all group"
                        >
                          <span className="text-sm font-bold text-[#0D0D0D]">{players.find(p => p.id === pid)?.name}</span>
                          <Plus size={14} className="text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  )
                ))}
              </div>

              <button 
                onClick={() => {
                  // If cancelled, just remove the player without replacement
                  setTeams(prev => {
                    const newTeams = prev.map(team => ({ ...team, playerIds: [...team.playerIds] }));
                    newTeams[replacingPlayer.teamIndex].playerIds = newTeams[replacingPlayer.teamIndex].playerIds.filter(id => id !== replacingPlayer.removedPlayerId);
                    return newTeams.filter(team => team.playerIds.length > 0);
                  });
                  setReplacingPlayer(null);
                }}
                className="w-full py-4 bg-white/5 text-white rounded-lg font-black uppercase tracking-tighter hover:bg-white/10 transition-all"
              >
                Remover sem substituir
              </button>
            </motion.div>
          </motion.div>
        )}

        <AssistModal 
          isOpen={!!pendingAssist}
          onSelect={handleAssistSelection}
          teamPlayers={pendingAssist ? (pendingAssist.team === 'A' ? (match.teamAIndex !== -1 ? (teams[match.teamAIndex]?.playerIds || []) : []) : (match.teamBIndex !== -1 ? (teams[match.teamBIndex]?.playerIds || []) : [])) : []}
          goalPlayerId={pendingAssist?.goalPlayerId || ''}
          players={players}
        />

        {/* Scorer Selection Modal */}
        <ScorerModal 
          isOpen={showScorerModal}
          onSelect={(playerId) => {
            if (scorerTeam) {
              handlePlayerGoal(playerId, scorerTeam);
              setShowScorerModal(false);
              setScorerTeam(null);
            }
          }}
          teamPlayers={scorerTeam ? (scorerTeam === 'A' ? (match.teamAIndex !== -1 ? (teams[match.teamAIndex]?.playerIds || []) : []) : (match.teamBIndex !== -1 ? (teams[match.teamBIndex]?.playerIds || []) : [])) : []}
          players={players}
          teamName={scorerTeam ? (scorerTeam === 'A' ? (match.teamAIndex !== -1 ? teams[match.teamAIndex]?.name : 'Time A') : (match.teamBIndex !== -1 ? teams[match.teamBIndex]?.name : 'Time B')) : ''}
        />

        <PlayerManagementModalComponent 
          player={playerManagementModal ? (players.find(p => p.id === playerManagementModal.id) || playerManagementModal) : null}
          isOpen={!!playerManagementModal}
          onClose={() => setPlayerManagementModal(null)}
          onUpdateName={updatePlayerName}
          onUpdatePhoto={updatePlayerPhoto}
          onRemove={removePlayer}
        />

        {/* Bottom Navigation */}
        <nav className="bg-[#1E3D2F] z-50 fixed bottom-0 left-0 right-0 pt-1 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.4)] border-t border-white/5">
          <div className="flex px-2 py-2 gap-2">
            <button 
              onClick={() => {
                const screens: Screen[] = ['players', 'teams', 'ranking', 'finance'];
                const targetIndex = screens.indexOf('players');
                const currentIndex = screens.indexOf(currentScreen);
                setSwipeDirection(targetIndex > currentIndex ? -1 : 1);
                setCurrentScreen('players');
              }}
              className={`flex-1 flex flex-col items-center justify-center py-2 transition-none rounded-2xl ${
                currentScreen === 'players' 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users size={18} className="mb-1" />
              <span className="text-[10px] font-black lowercase first-letter:uppercase tracking-wider leading-none">Gerenciar</span>
            </button>
            <button 
              onClick={() => {
                const screens: Screen[] = ['players', 'teams', 'ranking', 'finance'];
                const targetIndex = screens.indexOf('teams');
                const currentIndex = screens.indexOf(currentScreen);
                setSwipeDirection(targetIndex > currentIndex ? -1 : 1);
                setCurrentScreen('teams');
                // Open 'Confrontos' if match is active, otherwise 'Próximos'
                setTeamsTab(match.isActive ? 'historico' : 'proximos');
              }}
              className={`flex-1 flex flex-col items-center justify-center py-2 transition-none rounded-2xl ${
                currentScreen === 'teams' 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <SpinningBall 
                size="xs" 
                spin={false} 
                color="transparent"
                patternColor="currentColor"
                isIcon={true}
                className="mb-1" 
              />
              <span className="text-[10px] font-black lowercase first-letter:uppercase tracking-wider leading-none">Partida</span>
            </button>
            <button 
              onClick={() => {
                const screens: Screen[] = ['players', 'teams', 'ranking', 'finance'];
                const targetIndex = screens.indexOf('ranking');
                const currentIndex = screens.indexOf(currentScreen);
                setSwipeDirection(targetIndex > currentIndex ? -1 : 1);
                setCurrentScreen('ranking');
              }}
              className={`flex-1 flex flex-col items-center justify-center py-2 transition-none rounded-2xl ${
                currentScreen === 'ranking' 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Medal size={18} className="mb-1" />
              <span className="text-[10px] font-black lowercase first-letter:uppercase tracking-wider leading-none">Ranking</span>
            </button>
            <button 
              onClick={() => {
                const screens: Screen[] = ['players', 'teams', 'ranking', 'finance'];
                const targetIndex = screens.indexOf('finance');
                const currentIndex = screens.indexOf(currentScreen);
                setSwipeDirection(targetIndex > currentIndex ? -1 : 1);
                setCurrentScreen('finance');
                setFinanceSubScreen('balanco');
              }}
              className={`flex-1 flex flex-col items-center justify-center py-2 transition-none rounded-2xl ${
                currentScreen === 'finance' 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Wallet size={18} className="mb-1" />
              <span className="text-[10px] font-black lowercase first-letter:uppercase tracking-wider leading-none">Financeiro</span>
            </button>
            <button 
              onClick={() => setShowBackToHomeConfirm(true)}
              className={`flex-1 flex flex-col items-center justify-center py-2 transition-none rounded-2xl text-white/70 hover:text-white hover:bg-white/5`}
            >
              <LogOut size={18} className="mb-1" />
              <span className="text-[10px] font-black lowercase first-letter:uppercase tracking-wider leading-none">Sair</span>
            </button>
          </div>
        </nav>

        {/* Reset Stats Confirm Modal */}
        {showResetStatsConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[300] flex items-center justify-center p-4"
            onClick={() => setShowResetStatsConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-brand-dark border border-emerald-500/30 rounded-lg p-6 max-w-sm w-full shadow-2xl shadow-emerald-500/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-4">
                <RotateCcw size={32} />
              </div>
              <h2 className="text-xl font-black text-center mb-2 uppercase tracking-tighter text-white">Zerar Estatísticas?</h2>
              <p className="text-center text-brand-text-secondary mb-6 text-sm">
                Deseja zerar todos os gols e assistências de todos os jogadores? Esta ação não pode ser desfeita.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowResetStatsConfirm(false)}
                  className="flex-1 py-3 bg-white/5 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={resetAllStats}
                  className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  Zerar Agora
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Back To Home Confirm Modal */}
        {showBackToHomeConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[300] flex items-center justify-center p-4"
            onClick={() => setShowBackToHomeConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-brand-dark border border-orange-500/30 rounded-lg p-6 max-w-sm w-full shadow-2xl shadow-orange-500/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-orange-500 flex justify-center mb-4">
              </div>
              <h2 className="text-xl font-black text-center mb-2 uppercase tracking-tighter text-[#464656]">Sair da Partida?</h2>
              <p className="text-center text-[#464656] mb-6 text-sm opacity-90 lowercase">
                tem certeza que deseja sair desta partida e voltar para o menu principal?
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowBackToHomeConfirm(false)}
                  className="flex-1 py-3 bg-zinc-200 text-zinc-900 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-zinc-300 transition-colors"
                >
                  Não
                </button>
                <button 
                  onClick={() => {
                    setShowBackToHomeConfirm(false);
                    onBackToHome();
                  }}
                  className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                >
                  Sim
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showSetupGuide && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm p-8 rounded-[40px] shadow-md border-2 bg-white border-black"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 bg-brand-primary/20 rounded-full flex items-center justify-center text-brand-primary shadow-sm">
                  <Play size={32} fill="currentColor" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-black uppercase tracking-tighter text-black">Tudo Pronto!</h3>
                  <p className="text-xs font-medium leading-relaxed text-zinc-600">
                    Siga estes passos simples para organizar suas partidas:
                  </p>
                </div>

                <div className="w-full space-y-3 text-left">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-primary text-black text-[10px] font-black flex items-center justify-center shrink-0 shadow-sm">1</div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-700">Confirme a presença dos jogadores tocando em seus nomes (Verde = Confirmado).</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-primary text-black text-[10px] font-black flex items-center justify-center shrink-0 shadow-sm">2</div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-700">O app organiza os times automaticamente com base na ordem de entrada.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-primary text-black text-[10px] font-black flex items-center justify-center shrink-0 shadow-sm">3</div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-700">Toque em "Pronto" para ir à tela de confrontos e iniciar o sorteio ou o jogo.</p>
                  </div>
                </div>

                <button 
                  onClick={() => setShowSetupGuide(false)}
                  className="w-full py-4 bg-brand-gradient text-black rounded-3xl font-black uppercase tracking-widest text-xs shadow active:scale-95 transition-all text-center border border-black"
                >
                  Entendi, vamos lá!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}


function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = isSignUp 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else if (isSignUp && !data?.session) {
      setError('Cadastro realizado com sucesso! Se necessário, verifique sua caixa de entrada/spam para confirmar o e-mail antes de entrar.');
      setIsSignUp(false);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen font-sans transition-colors duration-300 flex items-center justify-center p-6 bg-zinc-100 text-zinc-900">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center relative">
          <SpinningBall size="lg" />
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Futquina</h1>
            <p className="text-sm font-medium tracking-widest uppercase opacity-50">Sua conta, suas peladas</p>
          </div>
        </div>
        
        <form onSubmit={handleAuth} className="p-8 rounded-2xl shadow-md flex flex-col gap-4 bg-white">
          <div className="flex p-1 bg-black/5 rounded-2xl mb-4">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${!isSignUp ? 'bg-white shadow-sm text-black' : 'text-zinc-500 hover:text-black'}`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${isSignUp ? 'bg-white shadow-sm text-black' : 'text-zinc-500 hover:text-black'}`}
            >
              Cadastrar
            </button>
          </div>
          
          {error && <div className="p-3 rounded-2xl bg-red-500/10 text-red-500 text-xs font-bold text-center">{error}</div>}

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1 block">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-black/5 border border-black/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary transition-colors"
              placeholder="seu@email.com"
            />
          </div>
          
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1 block">Senha</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-black/5 border border-black/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 mt-2 rounded-[30px] bg-brand-gradient text-black font-black uppercase tracking-widest text-xs hover:opacity-90 transition-opacity disabled:opacity-50 shadow shadow-brand-primary/20"
          >
            {loading ? 'Aguarde...' : (isSignUp ? 'Criar Conta' : 'Acessar')}
          </button>
        </form>
      </div>
    </div>
  );
}

// --- Main App Component ---
export default function App() {
  const [session, setSession] = useState<any>(null);

  const [groups, setGroups] = useState<{ id: string, name: string, createdAt: number }[]>(() => {
    const saved = safeLocalStorage.getItem('futquina_groups_offline');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Clean all previous unused hooks required for syncing
  
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(() => {
    const saved = safeLocalStorage.getItem('futquina_current_group_id_offline');
    if (saved) {
      const savedGroups = safeLocalStorage.getItem('futquina_groups_offline');
      if (savedGroups && JSON.parse(savedGroups).find((g: any) => g.id === saved)) {
        return saved;
      }
    }
    return null;
  });

  useEffect(() => {
    if (currentGroupId) {
      safeLocalStorage.setItem('futquina_current_group_id_offline', currentGroupId);
    } else {
      safeLocalStorage.removeItem('futquina_current_group_id_offline');
    }
  }, [currentGroupId]);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroupOptions, setSelectedGroupOptions] = useState<{ id: string, name: string } | null>(null);
  const [groupToRename, setGroupToRename] = useState<{ id: string, name: string } | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<{ id: string, name: string } | null>(null);
  const [renameValue, setRenameValue] = useState('');
  // Remove theme state and use a constant for logic cleanup or just remove completely
  const theme = 'light';

  // Keep offline logic purely local
  useEffect(() => {
    safeLocalStorage.setItem('futquina_groups_offline', JSON.stringify(groups));
  }, [groups]);

  if (currentGroupId) {
    return <GroupApp groupId={currentGroupId} onBackToHome={() => setCurrentGroupId(null)} />;
  }

  return (
    <div className="min-h-screen font-sans transition-colors duration-300 flex flex-col justify-center" style={{ background: '#14301F', color: '#FFFFFF' }}>
      <div className="w-full max-w-md mx-auto p-8 space-y-12">
        <div className="flex items-center justify-center mb-4">
          <div className="flex flex-col items-center gap-4 text-center">
            <SpinningBall size="lg" spin={true} />
            <FutQuinaLogo size="lg" colorClass="" style={{ color: '#ffffff', fontStyle: 'normal', fontFamily: 'system-ui', fontWeight: '900' }} />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-center" style={{ color: '#FFFFFF', opacity: 0.9, fontWeight: 'bold', fontFamily: '"Silkscreen", monospace' }}>Futebol mais competitivo e organizado.</h2>
          
          {groups.length === 0 ? (
            <TutorialCarousel />
          ) : (
            <div className="space-y-3">
              {groups.map((group, index) => (
                <div key={`${group.id}-${index}`} className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedGroupOptions({ id: group.id, name: group.name })}
                    className="flex-1 p-4 transition-all flex items-center justify-center relative group rounded-full border border-zinc-300 bg-gradient-to-br from-zinc-100 to-zinc-300"
                    style={{ color: '#1E3D2F' }}
                  >
                    <span className="text-lg font-normal text-center w-full px-8" style={{ fontFamily: 'system-ui' }}>{group.name}</span>
                    <ChevronRight size={20} className="absolute right-4 transition-colors opacity-70 group-hover:opacity-100" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowNewGroupModal(true)}
            className="w-full p-4 rounded-full font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: '#A3D900', color: '#1E3D2F' }}
          >
            <Plus size={16} />
            Criar Partida
          </button>
        </div>
      </div>

      {/* Group Options Modal */}
      {selectedGroupOptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedGroupOptions(null)}>
          <div className="w-full max-w-sm p-6 rounded-2xl shadow-md bg-white" onClick={e => e.stopPropagation()}>
            <h3 className="text-[18px] font-bold font-[system-ui] tracking-tighter mb-6 text-center text-[#464656]">{selectedGroupOptions.name}</h3>
            <div className="flex flex-col gap-3 items-center">
              <button
                onClick={() => {
                  setCurrentGroupId(selectedGroupOptions.id);
                  setSelectedGroupOptions(null);
                }}
                className="w-full flex items-center justify-center gap-3 p-4 rounded-[30px] bg-brand-gradient text-black font-normal font-[system-ui] tracking-widest text-xs hover:opacity-90 transition-opacity"
              >
                <Play size={16} />
                Partida
              </button>
              <button
                onClick={() => {
                  setGroupToRename(selectedGroupOptions);
                  setRenameValue(selectedGroupOptions.name);
                  setSelectedGroupOptions(null);
                }}
                className="w-full flex items-center justify-center gap-3 p-4 rounded-[30px] font-normal font-[system-ui] tracking-widest text-xs transition-colors bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
              >
                <Pencil size={16} />
                Renomear
              </button>
              <button
                onClick={() => {
                  setGroupToDelete(selectedGroupOptions);
                  setSelectedGroupOptions(null);
                }}
                className="w-full flex items-center justify-center gap-3 p-4 rounded-[30px] bg-red-500/10 text-red-500 font-normal font-[system-ui] tracking-widest text-xs hover:bg-red-500/20 transition-colors"
              >
                <Trash2 size={16} />
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {groupToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-brand-dark border border-orange-500/30 rounded-lg p-6 max-w-sm w-full shadow-2xl shadow-orange-500/20">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-2 text-[#464656] text-center">Excluir Partida</h3>
            <p className="text-center text-[#464656] mb-6 text-sm opacity-90 lowercase first-letter:uppercase">
              Tem certeza que deseja excluir a partida <strong className="text-[#464656] font-black">{groupToDelete.name}</strong>? Todos os dados serão perdidos e esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setGroupToDelete(null)}
                className="flex-1 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors bg-zinc-200 text-black hover:bg-zinc-300"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setGroups(prev => prev.filter(g => g.id !== groupToDelete.id));
                  [
                    `futquina_finance_players_${groupToDelete.id}`,
                    `futquina_monthly_fee_${groupToDelete.id}`,
                    `futquina_selected_year_${groupToDelete.id}`,
                    `futquina_available_years_${groupToDelete.id}`,
                    `futquina_players_${groupToDelete.id}`,
                    `futquina_session_player_ids_${groupToDelete.id}`,
                    `futquina_payments_${groupToDelete.id}`,
                    `futquina_teams_${groupToDelete.id}`,
                    `futquina_match_${groupToDelete.id}`,
                    `futquina_match_history_${groupToDelete.id}`,
                    `futquina_has_randomized_${groupToDelete.id}`,
                    `futquina_last_result_${groupToDelete.id}`
                  ].forEach(k => safeLocalStorage.removeItem(k));
                  setGroupToDelete(null);
                }}
                className="flex-1 py-3 rounded-xl font-black uppercase tracking-widest text-xs bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {groupToRename && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm p-6 rounded-2xl shadow-md bg-zinc-100">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-4 text-zinc-500">Renomear Partida</h3>
            <input
              type="text"
              value={renameValue}
              onChange={e => setRenameValue(e.target.value)}
              placeholder="Novo nome"
              className="w-full p-4 rounded-xl mb-6 outline-none font-bold bg-white text-zinc-800 placeholder:text-zinc-400"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setGroupToRename(null);
                  setRenameValue('');
                }}
                className="flex-1 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors bg-zinc-200 text-black hover:bg-zinc-300"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (renameValue.trim()) {
                    setGroups(prev => prev.map(g => g.id === groupToRename.id ? { ...g, name: renameValue.trim() } : g));
                    setGroupToRename(null);
                    setRenameValue('');
                  }
                }}
                disabled={!renameValue.trim()}
                className="flex-1 py-3 rounded-xl font-black uppercase tracking-widest text-xs bg-brand-gradient text-black hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Group Modal */}
      {showNewGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm p-6 rounded-2xl shadow-md bg-zinc-100">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-4 text-zinc-500">Nome da Partida</h3>
            <input
              type="text"
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
              placeholder="Ex: Futebol de Quinta"
              className="w-full p-4 rounded-xl mb-6 outline-none font-bold bg-white text-zinc-800 placeholder:text-zinc-400"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowNewGroupModal(false);
                  setNewGroupName('');
                }}
                className="flex-1 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors bg-zinc-200 text-black hover:bg-zinc-300"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (newGroupName.trim()) {
                    const newGroup = {
                      id: Math.random().toString(36).substr(2, 9),
                      name: newGroupName.trim(),
                      createdAt: Date.now()
                    };
                    
                    if (session?.user?.id) {
                      supabase.from('groups').insert({
                        id: newGroup.id,
                        name: newGroup.name,
                        created_at: newGroup.createdAt,
                        user_id: session.user.id
                      }).then();
                    }
                    
                    setGroups(prev => [...prev, newGroup]);
                    setShowNewGroupModal(false);
                    setNewGroupName('');
                  }
                }}
                disabled={!newGroupName.trim()}
                className="flex-1 py-3 rounded-xl font-black uppercase tracking-widest text-xs bg-brand-gradient text-black hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
