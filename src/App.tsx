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
  ChevronDown,
  ChevronUp,
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
  Database,
  Wifi,
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
  ArrowLeft,
  MoveRight,
  Home,
  Eye,
  Award,
  LogOut,
  Contact,
  Rocket,
  Globe,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { IoPersonOutline, IoFootballOutline, IoCheckmarkCircle } from 'react-icons/io5';
import { IoIosTrophy, IoIosWallet, IoIosFootball } from 'react-icons/io';
import { PiUserCirclePlusThin, PiUserCirclePlusLight, PiUserCirclePlus } from 'react-icons/pi';
import { ImSpinner9 } from 'react-icons/im';
import { GiGoalKeeper, GiSoccerKick, GiSoccerField, GiTrophy, GiPodiumWinner, GiRunningShoe, GiLaurelsTrophy, GiSocks, GiAbstract042, GiSoccerBall, GiCrown, GiQueenCrown } from 'react-icons/gi';
import { 
  PiUsersBold,
  PiUsers,
  PiSwordBold,
  PiSword,
  PiShieldFill,
  PiTrophyBold,
  PiTrophy,
  PiWalletBold,
  PiWallet,
  PiPlayBold,
  PiPlay,
  PiPauseBold,
  PiPause,
  PiPlusBold,
  PiPlus,
  PiClockCounterClockwiseBold,
  PiClockCounterClockwise,
  PiGearBold,
  PiGear,
  PiXBold,
  PiX,
  PiListBold,
  PiCheckCircleBold,
  PiCheckCircle,
  PiWarningCircleBold,
  PiWarningCircle,
  PiCalendarBlankBold,
  PiCalendarBlank,
  PiHouseBold,
  PiHouse,
  PiMagnifyingGlassBold,
  PiMagnifyingGlass,
  PiFunnelBold,
  PiFunnel,
  PiArrowClockwiseBold,
  PiArrowClockwise,
  PiChartPieBold,
  PiChartPie,
  PiUserPlusBold,
  PiUserPlus,
  PiRocketBold,
  PiRocket,
  PiArrowLeftBold,
  PiArrowLeft,
  PiArrowRightBold,
  PiArrowRight,
  PiCaretDownBold,
  PiCaretDown,
  PiCaretRightBold,
  PiCaretRight,
  PiPencilSimpleBold,
  PiPencilSimple,
  PiTrashBold,
  PiTrash,
  PiCheckBold,
  PiCheck,
  PiHandPointingBold,
  PiLockFill,
  PiShieldCheckFill
} from 'react-icons/pi';
import { supabase } from './lib/supabase';
import { sounds } from './lib/sounds';

// --- Supabase Hooks ---
function useSupabaseArraySync<T extends { id: string }>(
  tableName: string,
  groupId: string,
  items: T[],
  mapToDb: (item: T, groupId: string) => any,
  isDataLoaded: boolean,
  isReadOnly: boolean = false,
  isEnabled: boolean = true
) {
  const syncedIds = React.useRef<Set<string>>(new Set());
  const prevEnabled = React.useRef(isEnabled);

  const mapToDbRef = React.useRef(mapToDb);
  React.useEffect(() => {
    mapToDbRef.current = mapToDb;
  }, [mapToDb]);

  React.useEffect(() => {
    if (!isDataLoaded || !isEnabled) {
      if (!isDataLoaded) {
        syncedIds.current = new Set(items.map(i => i.id));
      }
      prevEnabled.current = isEnabled;
      return;
    }

    // If we just enabled, we should probably force a sync of everything to be sure
    const forceSync = isEnabled && !prevEnabled.current;
    prevEnabled.current = isEnabled;

    if (isReadOnly) return;

    const currentIds = new Set(items.map(i => i.id));
    const deletedIds = forceSync ? [] : [...syncedIds.current].filter(id => !currentIds.has(id));

    if (deletedIds.length > 0) {
      supabase.from(tableName).delete().in('id', deletedIds).then();
    }

    if (items.length > 0) {
      const payload = items.map(item => mapToDbRef.current(item, groupId));
      supabase.from(tableName).upsert(payload, { onConflict: 'id' }).then();
    }

    syncedIds.current = currentIds;
  }, [items, isDataLoaded, groupId, tableName, isReadOnly, isEnabled]);
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
  absences?: number;
  stars?: number;
}

interface Team {
  id: string;
  name: string;
  playerIds: string[];
  emoji?: string;
  color?: string;
  lastMatchStatus?: 'Vencedor' | 'Empate' | 'Derrota' | 'Subiu';
}

interface PenaltyShot {
  playerId: string;
  success: boolean | null;
}

interface TieBreakerState {
  showSelection: boolean;
  type: 'penalties' | 'lottery' | 'none';
  penalties: {
    teamA: PenaltyShot[];
    teamB: PenaltyShot[];
    isFinished: boolean;
    winnerId: string | null;
  };
  lottery: {
    isSpinning: boolean;
    winnerId: string | null;
  };
}

const TEAM_EMOJIS = ['🛡️', '⚔️', '🔰', '⚜️', '🔱', '🎖️', '🏅', '🥇', '🦅', '🦁', '⭐', '🔥', '🐉', '🌪️', '⚡', '🏆', '⚓', '👑', '🦈', '🐺'];
const TEAM_COLORS = [
  '#2563EB', '#DC2626', '#16A34A', '#EA580C', 
  '#CA8A04', '#0D9488', '#65A30D', '#0284C7', 
  '#059669', '#D97706', '#475569', '#ffffff',
  '#000000'
];

const TutorialCarousel = () => {
  const [index, setIndex] = useState(0);

  // Imagens carregadas via URLs públicas (imgur) para não quebrar o build
  const items = [
    { image: "https://i.imgur.com/e1fa5xq.png", alt: "Tudo do Seu Jeito" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [items.length]);

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-[2rem] bg-zinc-900 border border-zinc-800 shadow-[0_0_50px_-12px_rgba(57,255,20,0.15)] group">
      {/* High-tech border glow overlay */}
      <div className="absolute inset-0 rounded-[2rem] border-[1px] border-white/5 z-20 pointer-events-none" />
      <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] z-10 pointer-events-none" />

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 50, filter: "blur(5px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: -50, filter: "blur(5px)" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-screen"
        >
          <img 
            src={items[index].image} 
            alt={items[index].alt} 
            className="w-full h-full object-cover rounded-[2rem] opacity-90 contrast-125 saturate-150" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/600x400/1a1a1a/ffffff?text=${items[index].alt.replace(/ /g, '+')}\n(Faça+upload+da+imagem)`;
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Inner tech scanline effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-10 opacity-30"></div>

      <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-3 z-20">
        {items.map((_, i) => (
          <div 
            key={i} 
            className={`transition-all duration-700 ease-out flex items-center justify-center ${
              i === index ? 'w-8' : 'w-2'
            } h-1 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm`}
          >
            {i === index && (
              <motion.div 
                layoutId="activeSlideIndicator"
                className="w-full h-full bg-[#E3D39E] shadow-[0_0_10px_rgba(227,211,158,0.8)]"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const getNextTeamColor = (existingTeams: Team[]) => {
  const usedColors = existingTeams.map(t => t.color).filter(Boolean);
  const availableColors = TEAM_COLORS.filter(c => !usedColors.includes(c));
  
  if (availableColors.length > 0) {
    // Pick the first available color to ensure stable, sequential variety
    return availableColors[0];
  }
  
  // If no colors are available, pick sequentially based on length
  return TEAM_COLORS[existingTeams.length % TEAM_COLORS.length];
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

const ColorPickerModal = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  currentColor, 
  teamName,
  isFixed,
  onToggleFixed
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSelect: (color: string) => void,
  currentColor: string,
  teamName: string,
  isFixed: boolean,
  onToggleFixed: (enabled: boolean) => void
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white w-full max-w-sm rounded-[32px] shadow-2xl p-6 overflow-hidden border border-black/10"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <h3 className="text-xl font-black uppercase tracking-tighter text-zinc-900">Cor do Escudo</h3>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{teamName}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <X size={20} className="text-zinc-500" />
          </button>
        </div>

        <div className="grid grid-cols-5 gap-3 mb-8">
          {TEAM_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => onSelect(color)}
              className={`aspect-square rounded-2xl transition-all relative ${color === currentColor ? 'ring-4 ring-black/5 scale-110 shadow-lg' : 'hover:scale-105'}`}
              style={{ backgroundColor: color, border: color === '#ffffff' ? '1px solid #e4e4e7' : 'none' }}
            >
              {color === currentColor && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check size={16} className={color === '#ffffff' ? 'text-black' : 'text-white'} />
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="p-4 bg-zinc-50 rounded-2xl border border-black/5 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-zinc-900 uppercase tracking-wider mb-0.5">Manter cor fixa?</span>
              <p className="text-[9px] text-zinc-500 font-medium leading-relaxed">
                A cor será mantida para esta posição nos próximos jogos.
              </p>
            </div>
            <button 
              onClick={() => onToggleFixed(!isFixed)}
              className={`w-12 h-6 rounded-full p-1 transition-colors relative ${isFixed ? 'bg-brand-primary' : 'bg-zinc-300'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isFixed ? 'translate-x-6' : 'translate-x-0'} shadow-sm`} />
            </button>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-4 bg-brand-gradient text-black font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl active:scale-95 transition-all"
        >
          Confirmar
        </button>
      </motion.div>
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className={`w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl border ${
          theme === 'light' 
            ? 'bg-zinc-50 border-zinc-200' 
            : 'bg-brand-card border-white/10'
        }`}
      >
        <div className="bg-brand-primary p-8 text-center relative overflow-hidden">
          {/* Decorative Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mb-16 blur-3xl" />
          </div>

          <motion.div 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-lg"
          >
            <span className="text-black"><GiTrophy size={32} /></span>
          </motion.div>
          <h3 className="text-xl font-black uppercase tracking-tighter text-black leading-tight">Quem deu a assistência?</h3>
          <p className="text-[10px] text-black/60 font-medium mt-1 uppercase tracking-[0.2em] max-w-[200px] mx-auto leading-relaxed">
            Selecione o craque que serviu o <span className="text-zinc-500">garçom</span> no gol
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-2.5 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar mb-6">
            <motion.button 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={() => onSelect(null)}
              className="w-full p-4 rounded-2xl border-2 border-dashed transition-all text-center flex items-center justify-center gap-2 bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 group"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200 transition-colors">
                <PiXBold size={16} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-zinc-500 group-hover:text-zinc-600">Sem Assistência</span>
            </motion.button>

            {teamPlayers
              .filter(id => id !== goalPlayerId)
              .map((pid, idx) => {
                const player = players.find(p => p.id === pid);
                return (
                  <motion.button
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + (idx * 0.05) }}
                    key={`assist-choice-${pid}-${idx}`}
                    onClick={() => onSelect(pid)}
                    className="w-full p-3.5 rounded-2xl border border-zinc-200 transition-all text-left flex items-center gap-4 bg-white hover:border-brand-primary hover:shadow-lg hover:shadow-brand-primary/10 group relative overflow-hidden"
                  >
                    <div className="absolute inset-y-0 left-0 w-1 bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden border border-zinc-100 bg-zinc-50 shrink-0 group-hover:border-brand-primary/20 transition-colors shadow-inner">
                      {player?.photo ? (
                        <img src={player.photo} alt={player.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100">
                          <span className="text-zinc-400"><IoPersonOutline size={20} /></span>
                        </div>
                      )}
                    </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">Garçom</div>
                        <div className="text-sm font-black uppercase truncate text-zinc-800 transition-colors group-hover:text-brand-primary">
                          {player?.name}
                        </div>
                      </div>

                    <div className="w-8 h-8 rounded-full border border-zinc-100 flex items-center justify-center bg-zinc-50 group-hover:bg-brand-primary/10 group-hover:border-brand-primary/20 text-zinc-300 group-hover:text-brand-primary transition-all">
                      <PiArrowRightBold size={14} />
                    </div>
                  </motion.button>
                );
              })}
          </div>

          <button 
            onClick={() => onSelect(null)}
            className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:bg-zinc-100 rounded-2xl text-zinc-400 hover:text-zinc-600"
          >
            Fecar Janela
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

const TieBreakerModal = ({ 
  state, 
  onTypeSelect, 
  onPenaltyToggle, 
  onLotterySpin, 
  onConfirm,
  onBothLeave,
  teamA,
  teamB,
  players,
  colorA,
  colorB,
  queueCount = 0
}: { 
  state: TieBreakerState, 
  onTypeSelect: (type: 'penalties' | 'lottery' | 'none') => void, 
  onPenaltyToggle: (team: 'A' | 'B', index: number) => void,
  onLotterySpin: () => void,
  onConfirm: () => void,
  onBothLeave: (firstToQueue: 'A' | 'B') => void,
  teamA: Team | undefined,
  teamB: Team | undefined,
  players: Player[],
  colorA?: string,
  colorB?: string,
  queueCount?: number
}) => {
  const [showQueueOrder, setShowQueueOrder] = useState(false);

  if (!state.showSelection || !teamA || !teamB) return null;

  const resolvedColorA = colorA || teamA.color || TEAM_COLORS[0];
  const resolvedColorB = colorB || teamB.color || TEAM_COLORS[1];

  const teamAGoals = state.penalties.teamA.filter(p => p.success === true).length;
  const teamBGoals = state.penalties.teamB.filter(p => p.success === true).length;
  
  const isPenaltiesOngoing = state.type === 'penalties';
  const isLotteryOngoing = state.type === 'lottery';

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-0 sm:p-4 bg-brand-dark/20 backdrop-blur-xl">
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full h-full sm:h-auto sm:max-w-md bg-[#112F24] sm:rounded-[40px] overflow-hidden border-t sm:border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative"
      >
        <div className="absolute inset-0 pointer-events-none opacity-10 z-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, #ffffff 20px, #ffffff 21px), repeating-linear-gradient(-45deg, transparent, transparent 20px, #ffffff 20px, #ffffff 21px)`,
        }}></div>

        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-[80px] -ml-32 -mb-32" />

        {/* Header Section */}
        <div className="pt-10 pb-4 px-6 relative z-10">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-brand-primary rounded-full shadow-[0_0_15px_rgba(183,217,108,0.6)]" />
              <span className="text-xs font-black text-brand-primary uppercase tracking-[0.4em]">Desempate</span>
            </div>
            {state.type === 'penalties' && (
              <span className="text-white/80 text-xs font-medium ml-5 mt-[-4px]">Disputa de pênaltis</span>
            )}
          </div>
          {state.type !== 'none' && (
            <button 
              onClick={() => onTypeSelect('none')}
              className="absolute right-6 top-10 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-90"
            >
              <ArrowLeft size={18} />
            </button>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 pt-0 relative z-10">
          {state.type === 'none' && !showQueueOrder && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/10 p-5 rounded-[28px] border border-white/10 mb-6 backdrop-blur-sm">
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center drop-shadow-lg mb-2">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                      <defs>
                        <linearGradient id="shield-tie-A-none" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor={resolvedColorA} />
                          <stop offset="100%" stopColor={resolvedColorA} stopOpacity="0.85" />
                        </linearGradient>
                      </defs>
                      <path fill="url(#shield-tie-A-none)" d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinejoin="round" />
                      <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" fill="white" opacity="0.1" />
                    </svg>
                  </div>
                  <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">{teamA.name}</div>
                  <div className="mt-2 flex flex-wrap justify-center gap-1 px-2">
                    {teamA.playerIds.map((pid, idx) => {
                      const p = players.find(player => player.id === pid);
                      return (
                        <span key={pid} className="text-[7px] font-bold text-white/30 uppercase tracking-tighter">
                          {p?.name}{idx < teamA.playerIds.length - 1 ? ' •' : ''}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="text-white/20 font-black text-xl">VS</div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center drop-shadow-lg mb-2">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                      <defs>
                        <linearGradient id="shield-tie-B-none" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor={resolvedColorB} />
                          <stop offset="100%" stopColor={resolvedColorB} stopOpacity="0.85" />
                        </linearGradient>
                      </defs>
                      <path fill="url(#shield-tie-B-none)" d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinejoin="round" />
                      <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" fill="white" opacity="0.1" />
                    </svg>
                  </div>
                  <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">{teamB.name}</div>
                  <div className="mt-2 flex flex-wrap justify-center gap-1 px-2">
                    {teamB.playerIds.map((pid, idx) => {
                      const p = players.find(player => player.id === pid);
                      return (
                        <span key={pid} className="text-[7px] font-bold text-white/30 uppercase tracking-tighter">
                          {p?.name}{idx < teamB.playerIds.length - 1 ? ' •' : ''}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {queueCount >= 2 && (
                  <button 
                    onClick={() => setShowQueueOrder(true)}
                    className="group w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 transition-all duration-400 transform active:scale-95 text-left border border-white/5 shadow-2xl"
                  >
                    <div className="w-12 h-12 text-brand-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <LogOut size={28} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-normal uppercase tracking-widest text-[11px] text-brand-primary">Os dois times deixam a partida</span>
                      <span className="text-[10px] text-brand-primary/60 font-medium tracking-tight mt-0.5">Ambos vão para o final da fila</span>
                    </div>
                    <ChevronRight size={18} className="ml-auto text-brand-primary/40 group-hover:text-brand-primary transition-colors" />
                  </button>
                )}

                <button 
                  onClick={() => onTypeSelect('penalties')}
                  className="group w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 transition-all duration-400 transform active:scale-95 text-left border border-white/5 shadow-2xl"
                >
                  <div className="w-12 h-12 text-brand-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <GiSoccerKick size={28} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-normal uppercase tracking-widest text-[11px] text-brand-primary">Disputa de Pênaltis</span>
                    <span className="text-[10px] text-brand-primary/60 font-medium tracking-tight mt-0.5">Marcar acertos e erros</span>
                  </div>
                  <ChevronRight size={18} className="ml-auto text-brand-primary/40 group-hover:text-brand-primary transition-colors" />
                </button>

                <button 
                  onClick={() => onTypeSelect('lottery')}
                  className="group w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 transition-all duration-400 transform active:scale-95 text-left border border-white/5 shadow-2xl"
                >
                  <div className="w-12 h-12 text-brand-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <RefreshCw size={28} strokeWidth={2} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-normal uppercase tracking-widest text-[11px] text-brand-primary">Sorteio Aleatório</span>
                    <span className="text-[10px] text-brand-primary/60 font-medium tracking-tight mt-0.5">Roleta da sorte</span>
                  </div>
                  <ChevronRight size={18} className="ml-auto text-brand-primary/40 group-hover:text-brand-primary transition-colors" />
                </button>

                <div className="pt-4">
                  <button 
                    onClick={() => onConfirm()}
                    className="w-full p-4 rounded-[20px] bg-gradient-to-br from-zinc-100 to-zinc-300 border border-white/20 text-[#112F24] text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:from-white hover:to-zinc-200 shadow-xl active:scale-95"
                  >
                    Manter o resultado atual
                  </button>
                </div>
              </div>
            </div>
          )}

          {state.type === 'none' && showQueueOrder && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-black text-white uppercase tracking-tighter">Posição na Fila</h3>
                <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Quem entra primeiro na fila?</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => onBothLeave('A')}
                  className="group w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-zinc-500/80 via-zinc-600/80 to-zinc-700/80 hover:scale-[1.01] transition-all duration-400 transform active:scale-95 text-left border border-white/5"
                >
                  <div className="w-14 h-14 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <svg viewBox="0 0 24 24" stroke="white" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                      <defs>
                        <linearGradient id={`shield-grad-modal-q-A`} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor={resolvedColorA} />
                          <stop offset="100%" stopColor={resolvedColorA} stopOpacity="0.85" />
                        </linearGradient>
                      </defs>
                      <path 
                        fill={`url(#shield-grad-modal-q-A)`}
                        d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z"
                        strokeLinejoin="round"
                      />
                      <path 
                        d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z"
                        fill="white" opacity="0.1"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-normal uppercase tracking-widest text-xs text-brand-primary truncate">{teamA.name} primeiro</span>
                    <div className="flex flex-wrap gap-x-1.5 mt-1">
                      {(teamA.playerIds || []).map((pid, idx) => (
                        <span key={pid} className="text-[8px] text-brand-primary/60 font-bold tracking-tight">
                          {players.find(p => p.id === pid)?.name}{idx < (teamA.playerIds?.length || 0) - 1 ? ' •' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => onBothLeave('B')}
                  className="group w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-zinc-500/80 via-zinc-600/80 to-zinc-700/80 hover:scale-[1.01] transition-all duration-400 transform active:scale-95 text-left border border-white/5"
                >
                  <div className="w-14 h-14 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <svg viewBox="0 0 24 24" stroke="white" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                      <defs>
                        <linearGradient id={`shield-grad-modal-q-B`} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor={resolvedColorB} />
                          <stop offset="100%" stopColor={resolvedColorB} stopOpacity="0.85" />
                        </linearGradient>
                      </defs>
                      <path 
                        fill={`url(#shield-grad-modal-q-B)`}
                        d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z"
                        strokeLinejoin="round"
                      />
                      <path 
                        d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z"
                        fill="white" opacity="0.1"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-normal uppercase tracking-widest text-xs text-brand-primary truncate">{teamB.name} primeiro</span>
                    <div className="flex flex-wrap gap-x-1.5 mt-1">
                      {(teamB.playerIds || []).map((pid, idx) => (
                        <span key={pid} className="text-[8px] text-brand-primary/60 font-bold tracking-tight">
                          {players.find(p => p.id === pid)?.name}{idx < (teamB.playerIds?.length || 0) - 1 ? ' •' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => setShowQueueOrder(false)}
                  className="w-full p-4 mt-4 rounded-[20px] bg-zinc-800 text-white/60 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-zinc-700 active:scale-95 text-center"
                >
                  Voltar
                </button>
              </div>
            </div>
          )}

          {isPenaltiesOngoing && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white/10 p-6 rounded-[32px] border border-white/10 backdrop-blur-sm">
                <div className="text-center flex-1 flex flex-col items-center">
                  <div className="w-16 h-16 flex items-center justify-center drop-shadow-md mb-3">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                      <defs>
                        <linearGradient id="shield-tie-A-pen" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor={teamA.color || TEAM_COLORS[0]} />
                          <stop offset="100%" stopColor={teamA.color || TEAM_COLORS[0]} stopOpacity="0.85" />
                        </linearGradient>
                      </defs>
                      <path fill="url(#shield-tie-A-pen)" d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinejoin="round" />
                      <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" fill="white" opacity="0.1" />
                    </svg>
                  </div>
                  <div className="text-4xl font-black text-white tracking-tighter">{teamAGoals}</div>
                </div>
                <div className="text-white/10 font-black text-2xl tracking-tighter uppercase mx-4">VS</div>
                <div className="text-center flex-1 flex flex-col items-center">
                  <div className="w-16 h-16 flex items-center justify-center drop-shadow-md mb-3">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                      <defs>
                        <linearGradient id="shield-tie-B-pen" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor={teamB.color || TEAM_COLORS[1]} />
                          <stop offset="100%" stopColor={teamB.color || TEAM_COLORS[1]} stopOpacity="0.85" />
                        </linearGradient>
                      </defs>
                      <path fill="url(#shield-tie-B-pen)" d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinejoin="round" />
                      <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" fill="white" opacity="0.1" />
                    </svg>
                  </div>
                  <div className="text-4xl font-black text-white tracking-tighter">{teamBGoals}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {/* Team A Penalties */}
                <div className="space-y-2">
                  <div className="text-[9px] font-normal text-brand-primary/40 uppercase tracking-[0.2em] mb-3 sticky top-0 bg-[#112F24] py-1">Time A</div>
                  {state.penalties.teamA.map((shot, idx) => {
                    const p = players.find(player => player.id === shot.playerId);
                    return (
                      <div key={`pen-a-${idx}`} className="p-3 bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border border-white/5 rounded-2xl space-y-3 relative overflow-hidden group shadow-xl">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                            {p?.photo ? (
                              <img src={p.photo} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <span className="text-white/30"><IoPersonOutline size={16} /></span>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-normal text-brand-primary truncate uppercase tracking-tight leading-none">{p?.name}</span>
                            <span className="text-[7px] text-white/30 font-bold uppercase tracking-widest mt-0.5">Batedor {idx + 1}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => onPenaltyToggle('A', idx)}
                            className={`flex-1 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${shot.success === true ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-emerald-500/30 hover:bg-white/10'}`}
                          >
                            <PiCheckCircleBold size={18} />
                          </button>
                          <button 
                            onClick={() => onPenaltyToggle('A', idx)}
                            className={`flex-1 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${shot.success === false ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/5 text-red-500/30 hover:bg-white/10'}`}
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Team B Penalties */}
                <div className="space-y-2">
                  <div className="text-[9px] font-normal text-brand-primary/40 uppercase tracking-[0.2em] mb-3 sticky top-0 bg-[#112F24] py-1">Time B</div>
                  {state.penalties.teamB.map((shot, idx) => {
                    const p = players.find(player => player.id === shot.playerId);
                    return (
                      <div key={`pen-b-${idx}`} className="p-3 bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border border-white/5 rounded-2xl space-y-3 relative overflow-hidden group shadow-xl">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                            {p?.photo ? (
                              <img src={p.photo} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <span className="text-white/30"><IoPersonOutline size={16} /></span>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-normal text-brand-primary truncate uppercase tracking-tight leading-none">{p?.name}</span>
                            <span className="text-[7px] text-white/30 font-bold uppercase tracking-widest mt-0.5">Batedor {idx + 1}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => onPenaltyToggle('B', idx)}
                            className={`flex-1 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${shot.success === true ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-emerald-500/30 hover:bg-white/10'}`}
                          >
                            <PiCheckCircleBold size={18} />
                          </button>
                          <button 
                            onClick={() => onPenaltyToggle('B', idx)}
                            className={`flex-1 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${shot.success === false ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/5 text-red-500/30 hover:bg-white/10'}`}
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button 
                disabled={teamAGoals === teamBGoals}
                onClick={() => onConfirm()}
                className="w-full py-5 bg-brand-primary text-brand-text-primary rounded-[24px] font-black uppercase tracking-widest text-xs shadow-lg shadow-brand-primary/20 active:scale-95 transition-all disabled:opacity-20 disabled:grayscale"
              >
                {teamAGoals === teamBGoals ? 'Placar Empatado' : 'Finalizar e Salvar'}
              </button>
            </div>
          )}

          {isLotteryOngoing && (
            <div className="flex flex-col items-center gap-6 py-4">
              <div className="relative">
                <motion.div 
                  animate={state.lottery.isSpinning ? { 
                    rotate: [0, 3600],
                    transition: { duration: 3, ease: [0.45, 0.05, 0.55, 0.95] }
                  } : { 
                    rotate: state.lottery.winnerId ? (state.lottery.winnerId === teamA.id ? 0 : 180) : 0 
                  }}
                  className="w-56 h-56 rounded-full bg-white/5 border-[10px] border-[#1a3a2e] relative shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center"
                >
                  <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-white/10 -translate-x-1/2" />
                  
                  {/* Result Indicators */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-12 h-12">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                      <defs>
                        <linearGradient id="shield-tie-A-lot" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor={teamA.color || TEAM_COLORS[0]} />
                          <stop offset="100%" stopColor={teamA.color || TEAM_COLORS[0]} stopOpacity="0.85" />
                        </linearGradient>
                      </defs>
                      <path fill="url(#shield-tie-A-lot)" d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 rotate-180">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                      <defs>
                        <linearGradient id="shield-tie-B-lot" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor={teamB.color || TEAM_COLORS[1]} />
                          <stop offset="100%" stopColor={teamB.color || TEAM_COLORS[1]} stopOpacity="0.85" />
                        </linearGradient>
                      </defs>
                      <path fill="url(#shield-tie-B-lot)" d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinejoin="round" />
                    </svg>
                  </div>

                  {/* Marker */}
                  <div className="w-24 h-24 bg-[#112F24] rounded-full border-4 border-brand-primary/30 shadow-inner flex items-center justify-center z-10">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                      <div className="w-2 h-10 bg-brand-primary rounded-full absolute top-4 shadow-[0_0_10px_rgba(183,217,108,0.5)]" />
                      <SpinningBall size="sm" spin={state.lottery.isSpinning} />
                    </div>
                  </div>
                </motion.div>

                {/* Arrow Pointer */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[20px] border-t-brand-primary drop-shadow-[0_0_10px_rgba(183,217,108,0.5)]" />
              </div>

              {!state.lottery.winnerId && !state.lottery.isSpinning && (
                <div className="w-full space-y-6">
                  <div className="flex items-center gap-4 bg-white/10 p-5 rounded-[24px] border border-white/10 backdrop-blur-sm">
                    <div className="flex-1 flex flex-col items-center">
                      <div className="w-10 h-10 flex items-center justify-center drop-shadow-lg mb-2">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                          <defs>
                            <linearGradient id="shield-lot-A" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor={teamA.color || TEAM_COLORS[0]} />
                              <stop offset="100%" stopColor={teamA.color || TEAM_COLORS[0]} stopOpacity="0.85" />
                            </linearGradient>
                          </defs>
                          <path fill="url(#shield-lot-A)" d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="text-[8px] font-black text-white/40 uppercase tracking-widest">{teamA.name}</div>
                      <div className="mt-1 flex flex-wrap justify-center gap-0.5">
                        {teamA.playerIds.map((pid, idx) => {
                          const p = players.find(player => player.id === pid);
                          return (
                            <span key={pid} className="text-[6px] font-bold text-white/20 uppercase">
                              {p?.name}{idx < teamA.playerIds.length - 1 ? ',' : ''}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <div className="text-white/10 font-bold text-xs uppercase">VS</div>
                    <div className="flex-1 flex flex-col items-center">
                      <div className="w-10 h-10 flex items-center justify-center drop-shadow-lg mb-2">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                          <defs>
                            <linearGradient id="shield-lot-B" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor={teamB.color || TEAM_COLORS[1]} />
                              <stop offset="100%" stopColor={teamB.color || TEAM_COLORS[1]} stopOpacity="0.85" />
                            </linearGradient>
                          </defs>
                          <path fill="url(#shield-lot-B)" d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="text-[8px] font-black text-white/40 uppercase tracking-widest">{teamB.name}</div>
                      <div className="mt-1 flex flex-wrap justify-center gap-0.5">
                        {teamB.playerIds.map((pid, idx) => {
                          const p = players.find(player => player.id === pid);
                          return (
                            <span key={pid} className="text-[6px] font-bold text-white/20 uppercase">
                              {p?.name}{idx < teamB.playerIds.length - 1 ? ',' : ''}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={onLotterySpin}
                    className="w-full py-5 bg-brand-primary text-brand-text-primary rounded-[24px] font-black uppercase tracking-widest text-xs shadow-lg shadow-brand-primary/20 active:scale-95 transition-all"
                  >
                    Girar Roleta
                  </button>
                </div>
              )}

              {state.lottery.winnerId && !state.lottery.isSpinning && (
                <div className="w-full space-y-6 text-center">
                  <div className="bg-white/10 p-6 rounded-[32px] border border-white/10 animate-in fade-in zoom-in duration-500 backdrop-blur-sm">
                    <div className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mb-4">Vencedor Sorteado</div>
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-20 h-20 flex items-center justify-center drop-shadow-xl">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                          <defs>
                            <linearGradient id="shield-tie-winner-lot" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor={(state.lottery.winnerId === teamA.id ? teamA.color : teamB.color) || TEAM_COLORS[0]} />
                              <stop offset="100%" stopColor={(state.lottery.winnerId === teamA.id ? teamA.color : teamB.color) || TEAM_COLORS[0]} stopOpacity="0.85" />
                            </linearGradient>
                          </defs>
                          <path fill="url(#shield-tie-winner-lot)" d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinejoin="round" />
                          <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" fill="white" opacity="0.1" />
                        </svg>
                      </div>
                      <div className="text-xl font-black text-white uppercase tracking-tighter">
                        {state.lottery.winnerId === teamA.id ? teamA.name : teamB.name}
                      </div>

                      {/* Display winning team players */}
                      <div className="mt-2 flex flex-wrap justify-center gap-1.5 px-4">
                        {(state.lottery.winnerId === teamA.id ? teamA.playerIds : teamB.playerIds).map((pid, idx, arr) => {
                          const p = players.find(player => player.id === pid);
                          return (
                            <span key={pid} className="text-[8px] font-bold text-white/40 uppercase tracking-widest">
                              {p?.name}{idx < arr.length - 1 ? ' •' : ''}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => onConfirm()}
                    className="w-full py-5 bg-brand-primary text-brand-text-primary rounded-[24px] font-black uppercase tracking-widest text-xs shadow-lg shadow-brand-primary/20 active:scale-95 transition-all"
                  >
                    Confirmar Resultado
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="pb-8 px-8 flex justify-center opacity-20">
           <span className="text-[8px] font-black text-white uppercase tracking-[0.3em]">FutQuina Engine</span>
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
               <span className="text-zinc-600 flex items-center shrink-0"><IoPersonOutline size={40} /></span>
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
  onUpdateStars,
  onRemove
}: { 
  player: Player | null, 
  isOpen: boolean, 
  onClose: () => void, 
  onUpdateName: (id: string, name: string) => void,
  onUpdatePhoto: (id: string, photo: string) => void,
  onUpdateStars?: (id: string, stars: number) => void,
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
        className="w-full max-w-[300px] rounded-3xl p-6 shadow-[2px_2px_0_0_rgba(0,0,0,1)] border-2 relative bg-zinc-100 border-black"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-brand-glass border border-brand-border rounded-xl text-zinc-500 hover:text-brand-primary active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all shadow-[1px_1px_0_0_var(--brand-border)]"
        >
          <Plus size={16} className="rotate-45" />
        </button>

        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 flex items-center justify-center relative bg-zinc-200 border-black">
              {player.photo ? (
                <img src={player.photo} alt={player.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="flex flex-col items-center justify-center text-brand-text-secondary opacity-40">
                  <IoPersonOutline size={40} />
                  <span className="text-[9px] font-black uppercase mt-1 tracking-widest">Sem Foto</span>
                </div>
              )}
            </div>
            
            <label className="absolute -bottom-1 -right-1 w-10 h-10 bg-white text-black rounded-2xl flex items-center justify-center cursor-pointer shadow-[1px_1px_0_0_rgba(0,0,0,1)] hover:scale-105 active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-none transition-all border-2 border-black">
              <Camera size={16} />
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
                className={`w-full bg-transparent text-xl font-black uppercase tracking-tighter text-center outline-none border-b-2 border-transparent focus:border-brand-primary pb-1 transition-all ${
                  theme === 'light' ? 'text-black' : 'text-white'
                }`}
              />
              <p className="text-[7px] font-black uppercase tracking-[0.3em] text-brand-primary mt-1">Nome do Jogador</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className={`p-3 rounded-2xl flex flex-col items-center justify-center border-2 border-brand-border shadow-[3px_3px_0_0_var(--brand-border)] ${
                theme === 'light' ? 'bg-white' : 'bg-black/40'
              }`}>
                <div className="text-xl font-black text-brand-primary leading-none mb-1">{player.goals}</div>
                <div className="text-[7px] font-black uppercase tracking-widest text-brand-text-secondary !normal-case text-center">Gols</div>
              </div>
              <div className={`p-3 rounded-2xl flex flex-col items-center justify-center border-2 border-brand-border shadow-[3px_3px_0_0_var(--brand-border)] ${
                theme === 'light' ? 'bg-white' : 'bg-black/40'
              }`}>
                <div className="text-xl font-black text-brand-primary leading-none mb-1">{player.assists}</div>
                <div className="text-[7px] font-black uppercase tracking-widest text-brand-text-secondary !normal-case text-center">Assistências</div>
              </div>
              <div className={`p-2 rounded-2xl flex flex-col items-center justify-center border-2 border-brand-primary/20 shadow-[3px_3px_0_0_rgba(56,189,248,0.2)] ${
                theme === 'light' ? 'bg-brand-primary/5' : 'bg-brand-primary/10'
              } relative group transition-all`}>
                <div className="flex items-center justify-center gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => onUpdateStars && onUpdateStars(player.id, star)}
                      className="transition-all active:scale-95"
                    >
                      <Star 
                        size={12} 
                        className={`${(player.stars || 0) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-300'}`} 
                      />
                    </button>
                  ))}
                </div>
                <div className="text-[7px] font-black uppercase tracking-widest text-brand-primary text-center !normal-case">Nível</div>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button 
                onClick={onClose}
                className="w-full py-3 bg-brand-gradient text-black rounded-2xl font-black uppercase tracking-widest shadow-[1.5px_1.5px_0_0_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all text-[10px] glass-3d border border-black"
              >
                Confirmar
              </button>

              {onRemove && (
                <button 
                  onClick={() => {
                    onRemove(player.id);
                    onClose();
                  }}
                  className="w-full py-2.5 flex items-center justify-center gap-2 text-orange-600 bg-orange-900/10 hover:bg-orange-900/20 rounded-2xl font-black uppercase tracking-widest text-[8px] transition-all border border-orange-600/30 active:scale-95"
                >
                  <Trash2 size={10} />
                  Remover
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
  id: string;
  playerId: string;
  year: number;
  months: { [month: string]: number };
  monthlyFee: number;
}

type Screen = 'players' | 'teams' | 'ranking' | 'finance' | 'org-pro';

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
    <span className={`${sizeClasses[size]} uppercase tracking-tighter ${colorClass} ${shadowClass} ${className} font-megrim`} style={style}>
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
  
  // -- Presence Mode --
  const urlParams = new URLSearchParams(window.location.search);
  const [isPresenceMode, setIsPresenceMode] = useState<boolean>(urlParams.get('presence') === 'true');
  const [presencePlayerId, setPresencePlayerId] = useState<string>('');
  const [presenceCode, setPresenceCode] = useState<string>('');
  
  // --- State ---
  const [isOrgProAuthorized, setIsOrgProAuthorized] = useState<boolean>(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [adminPin, setAdminPin] = useState<string>('');

  useEffect(() => {
    safeLocalStorage.setItem(`futquina_org_pro_authorized_${groupId}`, isOrgProAuthorized ? 'true' : 'false');
  }, [isOrgProAuthorized, groupId]);

  useEffect(() => {
    const fetchGroupData = async () => {
      const { data } = await supabase.from('groups').select('admin_pin').eq('id', groupId).maybeSingle();
      if (data?.admin_pin) {
        setAdminPin(data.admin_pin);
      }
    };
    fetchGroupData();
  }, [groupId]);

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
  const [orgProTab, setOrgProTab] = useState<'painel' | 'acesso' | 'confirmados' | 'admins' | 'supabase'>('painel');
  const [authMode, setAuthMode] = useState<'pin' | 'email' | 'signup'>('pin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authPin, setAuthPin] = useState('');
  const [appAdmins, setAppAdmins] = useState<any[]>([]);
  const [jogadoresExternos, setJogadoresExternos] = useState<any[]>([]);
  const [presencasExternas, setPresencasExternas] = useState<any[]>([]);

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
  const [panelModal, setPanelModal] = useState<'cadastrados' | 'externos' | 'assist' | 'confirmados' | 'admins' | null>(null);

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
  const [orgProData, setOrgProData] = useState<{ [playerId: string]: { code: string } }>(() => {
    const saved = safeLocalStorage.getItem(`futquina_org_pro_${groupId}`);
    return saved ? JSON.parse(saved) : {};
  });
  useEffect(() => {
    safeLocalStorage.setItem(`futquina_org_pro_${groupId}`, JSON.stringify(orgProData));
  }, [orgProData, groupId]);

  const [orgProSettings, setOrgProSettings] = useState<{
    maxAbsences: number | null;
    requirePaymentUpToDate: boolean;
    matchDayOfWeek: number | null;
    matchTime: string;
    appliedDate: number | null;
  }>(() => {
    const saved = safeLocalStorage.getItem(`futquina_org_settings_${groupId}`);
    return saved ? JSON.parse(saved) : {
      maxAbsences: null,
      requirePaymentUpToDate: false,
      matchDayOfWeek: null,
      matchTime: "",
      appliedDate: null
    };
  });
  
  const [tempOrgProSettings, setTempOrgProSettings] = useState(orgProSettings);

  useEffect(() => {
    safeLocalStorage.setItem(`futquina_org_settings_${groupId}`, JSON.stringify(orgProSettings));
    setTempOrgProSettings(orgProSettings);
  }, [orgProSettings, groupId]);

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
            uniquePayments.push({
              ...p,
              id: p.id || key
            });
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
        
        const allSameGreen = parsed.length > 1 && parsed.every((t: any) => t && t.color === '#4ade80');
        const allSameBlack = parsed.length > 1 && parsed.every((t: any) => t && t.color === '#1a1a1a');
        const forceRecolor = allSameGreen || allSameBlack;
        
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
          
          let parsedColor = t.color;
          if (forceRecolor || !parsedColor || parsedColor === '#1a1a1a') {
            parsedColor = getNextTeamColor(uniqueTeams);
          }
          
          uniqueTeams.push({ ...t, id: teamId, playerIds: uniquePlayerIds, color: parsedColor });
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
      setToast({ message: "⏱️ O cronômetro precisa estar rodando!", type: 'warning' });
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
      setToast({ message: "⚽️ GOL! Assistência registrada", type: 'success' });
    } else {
      setToast({ message: "⚽️ GOL! Placar atualizado", type: 'info' });
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
    teamAColor?: string;
    teamBColor?: string;
    teamAId?: string;
    teamBId?: string;
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
  const [showColorPicker, setShowColorPicker] = useState<{ teamIdx: number; color: string } | null>(null);
  const [fixedColors, setFixedColors] = useState<{ teamA: string | null; teamB: string | null; enabled: boolean }>(() => {
    const saved = safeLocalStorage.getItem(`futquina_fixed_colors_${groupId}`);
    return saved ? JSON.parse(saved) : { teamA: null, teamB: null, enabled: false };
  });

  useEffect(() => {
    if (groupId) {
      safeLocalStorage.setItem(`futquina_fixed_colors_${groupId}`, JSON.stringify(fixedColors));
    }
  }, [fixedColors, groupId]);

  const [showEventModal, setShowEventModal] = useState<{ team: 'A' | 'B' | number } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'warning' | 'gray' | 'success' } | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<number | null>(null);
  const [selectedScorerId, setSelectedScorerId] = useState<string | null>(null);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [swappingPlayerId, setSwappingPlayerId] = useState<string | null>(null);
  const [fillingVacancyForTeam, setFillingVacancyForTeam] = useState<number | null>(null);
  const [showStartMatchConfirm, setShowStartMatchConfirm] = useState(false);
  const [tieBreaker, setTieBreaker] = useState<TieBreakerState>({
    showSelection: false,
    type: 'none',
    penalties: { teamA: [], teamB: [], isFinished: false, winnerId: null },
    lottery: { isSpinning: false, winnerId: null }
  });
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
  const [movingPlayers, setMovingPlayers] = useState<{ teamId: string, playerIds: string[] } | null>(null);
  const [isSelectingDestination, setIsSelectingDestination] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const [showAssistSelection, setShowAssistSelection] = useState<{ teamIndex: number, scorerId: string } | null>(null);
  const [playerManagementModal, setPlayerManagementModal] = useState<Player | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetStatsConfirm, setShowResetStatsConfirm] = useState(false);
  const [showGoalAnimation, setShowGoalAnimation] = useState<{ scorerName: string, teamName: string, scorerPhoto?: string } | null>(null);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(false);
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
          supabase.from('players').select('*').eq('group_id', groupId).order('name'),
          supabase.from('teams').select('*').eq('group_id', groupId),
          supabase.from('payments').select('*').eq('group_id', groupId),
          supabase.from('match_history').select('*').eq('group_id', groupId),
          supabase.from('match_state').select('*').eq('group_id', groupId).maybeSingle(),
          supabase.from('transactions').select('*').eq('group_id', groupId),
          supabase.from('groups').select('*').eq('id', groupId).maybeSingle()
        ]);

        const playersData = results[0].status === 'fulfilled' ? results[0].value?.data : null;
        const teamsData = results[1].status === 'fulfilled' ? results[1].value?.data : null;
        const paymentsData = results[2].status === 'fulfilled' ? results[2].value?.data : null;
        const matchHistoryData = results[3].status === 'fulfilled' ? results[3].value?.data : null;
        const matchStateData = results[4].status === 'fulfilled' ? results[4].value?.data : null;
        const transactionsData = results[5].status === 'fulfilled' ? results[5].value?.data : null;
        const groupData = results[6].status === 'fulfilled' ? results[6].value?.data : null;

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
          const loadedTeams: Team[] = [];
          
          const allSameGreen = teamsData.length > 1 && teamsData.every(t => t.color === '#4ade80');
          const allSameBlack = teamsData.length > 1 && teamsData.every(t => t.color === '#1a1a1a');
          const forceRecolor = allSameGreen || allSameBlack;
          
          for (const t of teamsData) {
            let parsedColor = t.color;
            if (forceRecolor || !parsedColor || parsedColor === '#1a1a1a') {
              parsedColor = getNextTeamColor(loadedTeams);
            }
            loadedTeams.push({
              id: t.id,
              name: t.name,
              color: parsedColor,
              playerIds: t.player_ids || []
            });
          }
          setTeams(loadedTeams);
        }
        if (paymentsData && paymentsData.length > 0) {
          setPayments(paymentsData.map(p => ({
            id: p.id || `${p.player_id}-${p.year}`,
            playerId: p.player_id,
            year: p.year,
            months: p.months || {},
            monthlyFee: p.monthly_fee || 0
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
        if (transactionsData && transactionsData.length > 0) {
          setExpenses(transactionsData.map(t => ({
            id: t.id,
            name: t.name,
            amount: t.amount,
            date: t.date
          })));
        }
        if (groupData) {
          if (groupData.admin_pin) setAdminPin(groupData.admin_pin);
          if (groupData.monthly_fee) setMonthlyFee(Number(groupData.monthly_fee));
          if (groupData.selected_year) setSelectedYear(groupData.selected_year);
          if (groupData.manual_adjustment) setManualAdjustment(Number(groupData.manual_adjustment));
          if (groupData.available_years && Array.isArray(groupData.available_years)) {
            setAvailableYears(groupData.available_years);
          }
        }
      } catch (err) {
        console.error("Error loading data from Supabase", err);
      } finally {
        setIsDataLoaded(true);
      }
    }
    loadData();
  }, [groupId]);

  useEffect(() => {
    if (!groupId || isPresenceMode || !isDataLoaded) return;
    
    const playersChannel = supabase.channel(`public:players:${groupId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'players', filter: `group_id=eq.${groupId}` }, (payload) => {
        const updatedPlayer = payload.new;
        setPlayers(prev => prev.map(p => p.id === updatedPlayer.id ? { 
          ...p, 
          isAvailable: updatedPlayer.is_available,
          arrivedAt: updatedPlayer.arrived_at
        } : p));
      })
      .subscribe();

    const paymentsChannel = supabase.channel(`public:payments:${groupId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments', filter: `group_id=eq.${groupId}` }, (payload) => {
        // Just reload all payments data to keep it simple when it changes
        supabase.from('payments').select('*').eq('group_id', groupId).then(({ data }) => {
          if (data) {
            setPayments(data.map(p => ({
              id: p.id,
              playerId: p.player_id,
              month: p.month,
              year: p.year,
              amount: p.amount,
              paidAt: p.paid_at,
              isHalf: p.is_half
            })));
          }
        });
      })
      .subscribe();
      
    return () => { 
      supabase.removeChannel(playersChannel);
      supabase.removeChannel(paymentsChannel);
    };
  }, [groupId, isPresenceMode, isDataLoaded]);

  useSupabaseArraySync('players', groupId, players, (p: any, gid) => ({
    id: p.id, group_id: gid, name: p.name, photo: p.photo || null, is_available: p.isAvailable, arrived_at: p.arrivedAt || null
  }), isDataLoaded, isPresenceMode, isOrgProAuthorized);

  useSupabaseArraySync('teams', groupId, teams, (t: any, gid) => ({
    id: t.id, group_id: gid, name: t.name, color: t.color, player_ids: t.playerIds
  }), isDataLoaded, isPresenceMode, isOrgProAuthorized);

  useSupabaseArraySync('payments', groupId, payments, (p: any, gid) => ({
    id: p.id || `${p.playerId}-${p.year}`, 
    group_id: gid, 
    player_id: p.playerId, 
    year: p.year, 
    months: p.months, 
    monthly_fee: p.monthlyFee
  }), isDataLoaded, isPresenceMode, isOrgProAuthorized);

  useSupabaseArraySync('match_history', groupId, matchHistory, (m: any, gid) => ({
    id: m.id, group_id: gid, team_a_id: m.teamAId || null, team_b_id: m.teamBId || null, team_a_name: m.teamAName, team_b_name: m.teamBName, score_a: m.scoreA, score_b: m.scoreB, winner_id: m.winnerId || null, loser_id: m.loserId || null, events: m.events, played_at: m.playedAt
  }), isDataLoaded, isPresenceMode, isOrgProAuthorized);

  useSupabaseArraySync('transactions', groupId, expenses, (e: any, gid) => ({
    id: e.id, group_id: gid, name: e.name, amount: e.amount, date: e.date
  }), isDataLoaded, isPresenceMode, isOrgProAuthorized);

  useEffect(() => {
    if (!isDataLoaded || isPresenceMode || !isOrgProAuthorized) return;
    supabase.from('groups').upsert({
      id: groupId,
      monthly_fee: monthlyFee,
      selected_year: selectedYear,
      manual_adjustment: manualAdjustment,
      available_years: availableYears,
      admin_pin: adminPin
    }, { onConflict: 'id' }).then();
  }, [monthlyFee, selectedYear, manualAdjustment, availableYears, adminPin, isDataLoaded, groupId, isPresenceMode, isOrgProAuthorized]);

  useEffect(() => {
    if (!isDataLoaded || isPresenceMode || !isOrgProAuthorized) return;
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
  }, [match, isDataLoaded, groupId, isPresenceMode, isOrgProAuthorized]);

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
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Sync com tabelas externas (jogadores e presencas)
  useEffect(() => {
    const fetchExternos = async () => {
      const { data: jogs } = await supabase.from('jogadores').select('*').order('created_at', { ascending: false });
      const { data: pres } = await supabase.from('presencas').select('*').order('created_at', { ascending: false });
      
      if (jogs) setJogadoresExternos(jogs);
      if (pres) setPresencasExternas(pres);
    };

    fetchExternos();

    // Realtime subscriptions
    const jogsChannel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jogadores' }, (payload) => {
        fetchExternos();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'presencas' }, (payload) => {
        fetchExternos();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(jogsChannel);
    };
  }, []);

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
      setToast({ message: `✅ Time formado! Próximo: ${newTeam.name}`, type: 'info' });
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
      setToast({ message: `✅ Time formado! Próximo: ${newTeam.name}`, type: 'info' });
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
      const newTeams: Team[] = [];
      
      for (let i = 0; i < allPlayerIds.length; i += limit) {
        const chunk = allPlayerIds.slice(i, i + limit);
        const teamIndex = Math.floor(i/limit);
        const existingTeam = prev[teamIndex];

        newTeams.push({
          id: existingTeam?.id || `team-regrouped-${teamIndex}-${generateId()}`,
          name: `Time ${String.fromCharCode(65 + teamIndex)}`,
          playerIds: chunk,
          emoji: existingTeam?.emoji || TEAM_EMOJIS[teamIndex % TEAM_EMOJIS.length],
          color: existingTeam?.color || TEAM_COLORS[teamIndex % TEAM_COLORS.length]
        });
      }

      // Update match indices
      setMatch(prevMatch => {
        let newA = prevMatch.teamAIndex;
        let newB = prevMatch.teamBIndex;
        if (newA >= newTeams.length) newA = -1;
        if (newB >= newTeams.length) newB = -1;
        return { ...prevMatch, teamAIndex: newA, teamBIndex: newB };
      });

      return newTeams;
    });
  };

  const removePlayerFromTeam = (tIndex: number, playerId: string, cascade: boolean = true) => {
    const isWinner = lastMatchResult && (
      (teams[tIndex]?.id === lastMatchResult.teamAId && lastMatchResult.scoreA > lastMatchResult.scoreB) ||
      (teams[tIndex]?.id === lastMatchResult.teamBId && lastMatchResult.scoreB > lastMatchResult.scoreA)
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
      const newTeams: Team[] = [];
      
      for (let i = 0; i < allPlayerIds.length; i += limit) {
        const chunk = allPlayerIds.slice(i, i + limit);
        const teamIndex = Math.floor(i/limit);
        const existingTeam = prev[teamIndex];

        newTeams.push({
          id: existingTeam?.id || `team-cascade-${teamIndex}-${generateId()}`,
          name: `Time ${String.fromCharCode(65 + teamIndex)}`,
          playerIds: chunk,
          emoji: existingTeam?.emoji || TEAM_EMOJIS[teamIndex % TEAM_EMOJIS.length],
          color: existingTeam?.color || TEAM_COLORS[teamIndex % TEAM_COLORS.length]
        });
      }

      // Update match indices
      setMatch(prevMatch => {
        let newA = prevMatch.teamAIndex;
        let newB = prevMatch.teamBIndex;
        if (newA >= newTeams.length) newA = -1;
        if (newB >= newTeams.length) newB = -1;
        return { ...prevMatch, teamAIndex: newA, teamBIndex: newB };
      });

      return newTeams;
    });
  };

  const updatePlayerAbsences = (id: string, absences: number) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, absences } : p));
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

  const updatePlayerStars = (id: string, stars: number) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, stars } : p));
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
    setToast({ message: "🔄 Histórico resetado", type: 'info' });
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

      setTimeout(() => {
        setShowGoalAnimation(null);
      }, 3000);
    }

    setShowEventModal(null);
    setSelectedScorerId(null);
  };

  function finalizeMatch(sA: number, sB: number, tAIdx: number, tBIdx: number, tieBreakerWinnerIndex?: number) {
    const scoreA = sA;
    const scoreB = sB;
    const teamAIndex = tAIdx;
    const teamBIndex = tBIdx;

    // Determine winner and loser for stats/history
    let winnerIndex = teamAIndex;
    let loserIndex = teamBIndex;
    
    if (tieBreakerWinnerIndex !== undefined) {
      winnerIndex = tieBreakerWinnerIndex;
      loserIndex = tieBreakerWinnerIndex === teamAIndex ? teamBIndex : teamAIndex;
    } else if (scoreB > scoreA) {
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
    
    if (tieBreakerWinnerIndex !== undefined) {
      teamToStayIndex = tieBreakerWinnerIndex;
      teamToLeaveIndex = tieBreakerWinnerIndex === teamAIndex ? teamBIndex : teamAIndex;
    } else if (scoreB > scoreA) {
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
      teamAColor: (fixedColors.enabled && fixedColors.teamA) || teams[teamAIndex]?.color || TEAM_COLORS[0],
      teamBColor: (fixedColors.enabled && fixedColors.teamB) || teams[teamBIndex]?.color || TEAM_COLORS[1],
      teamAId: teams[teamAIndex]?.id,
      teamBId: teams[teamBIndex]?.id,
      scoreA,
      scoreB,
      teamAIndex,
      teamBIndex,
      winnerIndex,
      loserIndex,
      winnerId: winnerIndex !== -1 ? teams[winnerIndex]?.id : null,
      loserId: loserIndex !== -1 ? teams[loserIndex]?.id : null,
      events: match.events,
      timestamp: Date.now(),
      tieBreakerWinnerId: tieBreakerWinnerIndex !== undefined ? teams[tieBreakerWinnerIndex]?.id : null
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

        // Set status based on tie breaker if it happened
        if (tieBreakerWinnerIndex !== undefined) {
           const winnerId = teams[tieBreakerWinnerIndex]?.id;
           const loserId = teams[tieBreakerWinnerIndex === teamAIndex ? teamBIndex : teamAIndex]?.id;
           newTeams = newTeams.map(t => {
             if (t.id === winnerId) return { ...t, lastMatchStatus: 'Vencedor' };
             if (t.id === loserId) return { ...t, lastMatchStatus: 'Derrota' };
             return t;
           });
        }

        const leavingTeam = newTeams.splice(teamToLeaveIndex, 1)[0];
        newTeams.push(leavingTeam);

        // Identify which team just "subiu" to the match selection
        const finalStayIndex = teamToStayIndex > teamToLeaveIndex ? teamToStayIndex - 1 : teamToStayIndex;
        const nextTeamIndex = finalStayIndex === 0 ? 1 : 0;
        const joinedTeamId = newTeams[nextTeamIndex]?.id;

        if (joinedTeamId) {
          newTeams = newTeams.map(t => {
            if (t.id === joinedTeamId && t.id !== teamAId && t.id !== teamBId) {
              return { ...t, lastMatchStatus: 'Subiu' };
            }
            return t;
          });
        }

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
      if (tieBreakerWinnerIndex !== undefined) {
        winners.push(teams[tieBreakerWinnerIndex].id);
      } else if (scoreA > scoreB) {
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
  }

  function finishMatch() {
    sounds.playFinishMatch();
    const scoreA = match.scoreA;
    const scoreB = match.scoreB;
    const teamAIndex = match.teamAIndex;
    const teamBIndex = match.teamBIndex;

    // Check for draw to initiate tie breaker
    if (scoreA === scoreB) {
      setTieBreaker({
        showSelection: true,
        type: 'none',
        penalties: {
          teamA: (teams[teamAIndex]?.playerIds || []).map(pid => ({ playerId: pid, success: null })),
          teamB: (teams[teamBIndex]?.playerIds || []).map(pid => ({ playerId: pid, success: null })),
          isFinished: false,
          winnerId: null
        },
        lottery: {
          isSpinning: false,
          winnerId: null
        }
      });
      return;
    }

    finalizeMatch(scoreA, scoreB, teamAIndex, teamBIndex);
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
    setToast({ message: "🔄 Partida reiniciada", type: 'info' });
    setTimeout(() => setToast(null), 3000);
  };

  const startNextMatch = (teamAIdx: number, teamBIdx: number, force: boolean = false) => {
    setFlashingTeamIds([]);
    if (teamAIdx === -1 || teamBIdx === -1) {
      setToast({ message: "📋 Selecione os times do confronto", type: 'warning' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    if (teamAIdx === teamBIdx) {
      setToast({ message: "❌ Escolha times diferentes!", type: 'warning' });
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

  const handleTieBreakerTypeSelect = (type: 'penalties' | 'lottery' | 'none') => {
    setTieBreaker(prev => ({ ...prev, type }));
  };

  const handlePenaltyToggle = (team: 'A' | 'B', index: number) => {
    setTieBreaker(prev => {
      const nextPenalties = { ...prev.penalties };
      const list = team === 'A' ? [...nextPenalties.teamA] : [...nextPenalties.teamB];
      
      // Cycle: null -> true -> false -> null
      const current = list[index].success;
      let next: boolean | null = null;
      if (current === null) next = true;
      else if (current === true) next = false;
      else next = null;

      list[index] = { ...list[index], success: next };
      
      if (team === 'A') nextPenalties.teamA = list;
      else nextPenalties.teamB = list;

      return { ...prev, penalties: nextPenalties };
    });
  };

  const handleLotterySpin = () => {
    if (tieBreaker.lottery.isSpinning) return;
    
    setTieBreaker(prev => ({ ...prev, lottery: { ...prev.lottery, isSpinning: true } }));
    
    setTimeout(() => {
      const winnerIdx = Math.random() > 0.5 ? match.teamAIndex : match.teamBIndex;
      const winnerId = teams[winnerIdx]?.id;
      setTieBreaker(prev => ({ 
        ...prev, 
        lottery: { isSpinning: false, winnerId: winnerId || null } 
      }));
    }, 3000);
  };

  const handleTieBreakerConfirm = () => {
    const scoreA = match.scoreA;
    const scoreB = match.scoreB;
    const teamAIndex = match.teamAIndex;
    const teamBIndex = match.teamBIndex;

    let winnerIndex: number | undefined = undefined;

    if (tieBreaker.type === 'penalties') {
      const teamAGoals = tieBreaker.penalties.teamA.filter(p => p.success === true).length;
      const teamBGoals = tieBreaker.penalties.teamB.filter(p => p.success === true).length;
      if (teamAGoals > teamBGoals) winnerIndex = teamAIndex;
      else if (teamBGoals > teamAGoals) winnerIndex = teamBIndex;
      // If still equal, we don't finalize or let user decide?
      // The button is disabled if equal in the UI
    } else if (tieBreaker.type === 'lottery') {
      if (tieBreaker.lottery.winnerId === teams[teamAIndex]?.id) winnerIndex = teamAIndex;
      else if (tieBreaker.lottery.winnerId === teams[teamBIndex]?.id) winnerIndex = teamBIndex;
    }

    setTieBreaker(prev => ({ ...prev, showSelection: false }));
    finalizeMatch(scoreA, scoreB, teamAIndex, teamBIndex, winnerIndex);
  };

  const handleBothLeaveMatch = (firstToQueue: 'A' | 'B') => {
    const scoreA = match.scoreA;
    const scoreB = match.scoreB;
    const teamAIndex = match.teamAIndex;
    const teamBIndex = match.teamBIndex;

    const teamAId = teams[teamAIndex]?.id;
    const teamBId = teams[teamBIndex]?.id;

    if (!teamAId || !teamBId) return;

    // Create draw result
    const result = {
      id: generateId(),
      teamAName: teams[teamAIndex]?.name || 'Time A',
      teamBName: teams[teamBIndex]?.name || 'Time B',
      teamAColor: (fixedColors.enabled && fixedColors.teamA) || teams[teamAIndex]?.color || TEAM_COLORS[0],
      teamBColor: (fixedColors.enabled && fixedColors.teamB) || teams[teamBIndex]?.color || TEAM_COLORS[1],
      teamAId: teams[teamAIndex]?.id,
      teamBId: teams[teamBIndex]?.id,
      scoreA,
      scoreB,
      teamAIndex,
      teamBIndex,
      winnerIndex: -1,
      loserIndex: -1,
      winnerId: null,
      loserId: null,
      events: match.events,
      timestamp: Date.now(),
      tieBreakerWinnerId: null
    };

    setLastMatchResult(result);
    setMatchHistory(prev => [result, ...prev].slice(0, 10));

    setMatch(prev => ({ 
      ...prev, 
      isActive: false, 
      isPaused: true,
      hasEnded: true,
    }));

    setTeams(prevTeams => {
      let newTeams = [...prevTeams];
      const tA = newTeams.find(t => t.id === teamAId);
      const tB = newTeams.find(t => t.id === teamBId);
      
      if (!tA || !tB) return prevTeams;

      // Update statuses
      newTeams = newTeams.map(t => {
        if (t.id === teamAId || t.id === teamBId) {
          return { ...t, lastMatchStatus: 'Empate' };
        }
        return t;
      });

      // Remove both
      newTeams = newTeams.filter(t => t.id !== teamAId && t.id !== teamBId);
      
      // Add both to the end in the chosen order
      if (firstToQueue === 'A') {
        newTeams.push(tA);
        newTeams.push(tB);
      } else {
        newTeams.push(tB);
        newTeams.push(tA);
      }

      // Mark the ones who moved up
      const joinedTeamAId = newTeams[0]?.id;
      const joinedTeamBId = newTeams[1]?.id;

      newTeams = newTeams.map(t => {
        if ((t.id === joinedTeamAId || t.id === joinedTeamBId) && (t.id !== teamAId && t.id !== teamBId)) {
          return { ...t, lastMatchStatus: 'Subiu' };
        }
        return t;
      });

      return newTeams;
    });

    setMatch(prev => ({
      ...prev,
      teamAIndex: 0,
      teamBIndex: 1
    }));

    setTieBreaker(prev => ({ ...prev, showSelection: false }));
    setToast({ message: "Ambos os times foram para o fim da fila.", type: 'success' });
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
          id: `${playerId}-${selectedYear}`,
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
        id: `${fPlayer.id}-2026`,
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

  const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  const isMatchTimePassed = useMemo(() => {
    if (orgProSettings.matchDayOfWeek === null || !orgProSettings.appliedDate) return false;
    const now = new Date();
    
    const applied = new Date(orgProSettings.appliedDate);
    const expirationDate = new Date(applied);
    
    let daysToAdd = orgProSettings.matchDayOfWeek - applied.getDay();
    if (daysToAdd < 0) {
      daysToAdd += 7;
    }
    
    // Expiration is at 23:59:59 of the match day
    expirationDate.setDate(expirationDate.getDate() + daysToAdd);
    expirationDate.setHours(23, 59, 59, 999);
    
    return now.getTime() > expirationDate.getTime();
  }, [orgProSettings.matchDayOfWeek, orgProSettings.appliedDate]);

  useEffect(() => {
    if (isMatchTimePassed) {
      setOrgProSettings({
        maxAbsences: null,
        requirePaymentUpToDate: false,
        matchDayOfWeek: null,
        matchTime: "",
        appliedDate: null
      });
      setOrgProData({});
      setToast({ message: 'A data da pelada passou! As exigências e presenças foram redefinidas.', type: 'info' });
      setTimeout(() => setToast(null), 3000);
    }
  }, [isMatchTimePassed]);

  const visiblePlayers = useMemo(() => {
    const timePassed = isMatchTimePassed;
    const currentMonth = MONTHS[new Date().getMonth()];
    const currentYear = new Date().getFullYear();

    return players.filter(player => {
      const isOrgPro = !!orgProData[player.id];

      if (isOrgPro && timePassed) return false;

      if (orgProSettings.maxAbsences !== null && (player.absences || 0) > orgProSettings.maxAbsences) {
        return false;
      }

      if (orgProSettings.requirePaymentUpToDate) {
        const record = payments.find(p => p.playerId === player.id && p.year === currentYear);
        const isUpToDate = record && record.months[currentMonth] > 0;
        if (!isUpToDate) return false;
      }

      return true;
    });
  }, [players, orgProSettings, orgProData, payments, isMatchTimePassed]);

  // --- UI Components ---

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

  if (isPresenceMode) {
    const orgParam = urlParams.get('org');
    let orgData: any = {};
    if (orgParam) {
      try {
        orgData = JSON.parse(atob(orgParam));
      } catch (e) {
        // ignore
      }
    }

    return (
      <div className="h-screen bg-brand-dark text-white font-sans overflow-y-auto flex flex-col p-6 items-center justify-center">
        <AnimatePresence>
          {toast && (
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-12 left-0 right-0 z-[200] flex justify-center px-6 pointer-events-none"
            >
              <motion.div
                className={`pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.3)] border backdrop-blur-xl transition-all ${
                  toast.type === 'success' ? 'bg-emerald-500/90 border-emerald-400/50 text-white' :
                  toast.type === 'warning' ? 'bg-amber-500/90 border-amber-400/50 text-white' :
                  'bg-[#1E3D2F]/95 border-white/10 text-white'
                }`}
              >
                <div className="shrink-0">
                  {toast.type === 'success' && <PiCheckCircleBold size={18} />}
                  {toast.type === 'warning' && <PiWarningCircleBold size={18} />}
                  {toast.type === 'gray' && <PiGearBold size={18} />}
                  {toast.type === 'info' && <PiRocketBold size={18} />}
                </div>
                <span className="text-xs font-bold leading-tight max-w-[200px]">{toast.message}</span>
                <button 
                  onClick={() => setToast(null)}
                  className="ml-2 w-6 h-6 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-colors shrink-0"
                >
                  <PiXBold size={14} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="bg-[#1E3D2F] w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
             <GiCrown size={120} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter mb-2 relative z-10">Marcar Presença</h1>
          <p className="text-[10px] uppercase tracking-widest text-[#E3D39E]/80 font-bold mb-8 relative z-10">Confirme sua participação na pelada</p>

          {!presencePlayerId ? (
            <div className="space-y-4 relative z-10">
               <label className="text-[10px] font-black uppercase tracking-widest text-white/50">Selecione seu nome</label>
               <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                  {[...players].sort((a,b)=>a.name.localeCompare(b.name)).map(p => (
                     <button
                        key={`pres-${p.id}`}
                        onClick={() => {
                          setPresencePlayerId(p.id);
                          setPresenceCode('');
                        }}
                        className="p-3 bg-white/5 rounded-xl border border-white/10 text-left hover:bg-white/10 transition-colors flex justify-between items-center"
                     >
                       <span className="font-bold text-sm tracking-tight">{p.name}</span>
                       {p.isAvailable && <span className="text-[8px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full uppercase font-black tracking-widest ml-2">Confirmado</span>}
                     </button>
                  ))}
               </div>
            </div>
          ) : (
            <div className="space-y-6 relative z-10">
               <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                 <button onClick={() => { setPresencePlayerId(''); setPresenceCode(''); }} className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-all text-white/60">
                   <ChevronRight size={16} className="rotate-180" />
                 </button>
                 <div className="flex-1">
                   <label className="text-[9px] font-black uppercase tracking-widest text-white/50 block">Jogador selecionado</label>
                   <span className="font-bold text-lg leading-tight uppercase tracking-tight">{players.find(p=>p.id === presencePlayerId)?.name}</span>
                 </div>
               </div>

               {(() => {
                 const currentMonth = MONTHS[new Date().getMonth()];
                 const currentYear = new Date().getFullYear();
                 const playerPayment = payments.find(p => p.playerId === presencePlayerId && p.year === currentYear);
                 const isUpToDate = playerPayment && (playerPayment.months[currentMonth] || 0) > 0;
                 const requiresCode = !isUpToDate;
                 const playerOrgCode = (orgData && orgData[presencePlayerId]) ? orgData[presencePlayerId] : null;

                 return (
                   <div className="space-y-4">
                     {requiresCode ? (
                       <div className="space-y-4">
                         <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
                           <label className="text-[9px] font-black uppercase tracking-widest text-amber-300 block mb-1">Acesso Restrito</label>
                           <p className="text-[10px] font-medium text-amber-200/80 leading-relaxed">
                             Parece que você não possui pagamentos recentes. Digite sua Chave de Acesso para confirmar presença.
                           </p>
                         </div>
                         <div className="space-y-2">
                           <input
                             type="text"
                             placeholder="Telefone ou PIN"
                             value={presenceCode}
                             onChange={e => setPresenceCode(e.target.value)}
                             className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-4 text-sm font-bold text-white focus:border-[#E3D39E] focus:ring-1 focus:ring-[#E3D39E] outline-none transition-all placeholder:font-normal placeholder:opacity-50"
                           />
                         </div>
                         <button
                           onClick={() => {
                             if (!playerOrgCode) {
                               setToast({ message: 'Organização não definiu sua chave. Fale com um admin.', type: 'warning' });
                               return;
                             }
                             if (presenceCode.trim() !== playerOrgCode) {
                               setToast({ message: 'Chave incorreta!', type: 'warning' });
                               return;
                             }
                             const now = Date.now();
                             supabase.from('players').update({ is_available: true, arrived_at: now }).eq('id', presencePlayerId).then(() => {
                               setPlayers(prev => prev.map(p => p.id === presencePlayerId ? { ...p, isAvailable: true, arrivedAt: now } : p));
                               setToast({ message: 'Presença confirmada com sucesso!', type: 'success' });
                               setTimeout(() => setPresencePlayerId(''), 2000);
                             });
                           }}
                           className="w-full bg-[#E3D39E] text-black font-black uppercase tracking-widest py-4 rounded-xl shadow-lg hover:bg-white active:scale-95 transition-all text-xs"
                         >
                           Verificar e Confirmar
                         </button>
                       </div>
                     ) : (
                       <div className="space-y-6 text-center py-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                         <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner shadow-emerald-500/20">
                           <IoCheckmarkCircle size={32} />
                         </div>
                         <div>
                           <p className="text-emerald-400 font-black uppercase tracking-widest text-[10px] mb-1">Status Liberado</p>
                           <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Mensalidade em Dia</p>
                         </div>
                         <div className="px-4 pb-4">
                         <button
                           onClick={() => {
                             const now = Date.now();
                             supabase.from('players').update({ is_available: true, arrived_at: now }).eq('id', presencePlayerId).then(() => {
                               setPlayers(prev => prev.map(p => p.id === presencePlayerId ? { ...p, isAvailable: true, arrivedAt: now } : p));
                               setToast({ message: 'Presença confirmada!', type: 'success' });
                               setTimeout(() => setPresencePlayerId(''), 2000);
                             });
                           }}
                           className="w-full bg-emerald-500 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all text-xs"
                         >
                           Confirmar Presença
                         </button>
                         </div>
                       </div>
                     )}
                   </div>
                 );
               })()}
            </div>
          )}
        </div>
      </div>
    );
  }

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

      <TieBreakerModal 
        state={tieBreaker}
        onTypeSelect={handleTieBreakerTypeSelect}
        onPenaltyToggle={handlePenaltyToggle}
        onLotterySpin={handleLotterySpin}
        onConfirm={handleTieBreakerConfirm}
        onBothLeave={handleBothLeaveMatch}
        teamA={teams[match.teamAIndex]}
        teamB={teams[match.teamBIndex]}
        colorA={(fixedColors.enabled && fixedColors.teamA) || teams[match.teamAIndex]?.color}
        colorB={(fixedColors.enabled && fixedColors.teamB) || teams[match.teamBIndex]?.color}
        players={players}
        queueCount={teams.length - 2}
      />

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
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 left-0 right-0 z-[200] flex justify-center px-6 pointer-events-none"
          >
            <motion.div
              className={`pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.3)] border backdrop-blur-xl transition-all ${
                toast.type === 'success' ? 'bg-emerald-500/90 border-emerald-400/50 text-white' :
                toast.type === 'warning' ? 'bg-amber-500/90 border-amber-400/50 text-white' :
                'bg-[#1E3D2F]/95 border-white/10 text-white'
              }`}
            >
              <div className="shrink-0">
                {toast.type === 'success' && <PiCheckCircleBold size={18} />}
                {toast.type === 'warning' && <PiWarningCircleBold size={18} />}
                {toast.type === 'gray' && <PiGearBold size={18} />}
                {toast.type === 'info' && <PiRocketBold size={18} />}
              </div>
              <p className="text-[11px] font-black uppercase tracking-widest leading-none drop-shadow-sm">
                {toast.message}
              </p>
              <button 
                onClick={() => setToast(null)}
                className="ml-2 hover:opacity-70 transition-opacity"
              >
                <PiXBold size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        className="h-full flex flex-col overflow-hidden"
      >
        {/* Sticky Header and Tabs Container */}
        <div className={`sticky top-0 z-50 bg-[#1E3D2F]/95 backdrop-blur-2xl border-white/10 border-b ${isPrintMode ? 'hidden' : ''}`}>
        {/* Header */}
        <header className="px-6 py-4 flex justify-between items-center bg-transparent relative transition-colors duration-300">
          <div className="flex items-center gap-3 overflow-hidden relative z-10">
            <motion.div
              initial={false}
              animate={{ rotate: match.isActive ? 360 : 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <SpinningBall size="sm" spin={match.isActive && !match.isPaused} />
            </motion.div>
            
            <AnimatePresence mode="popLayout" initial={false}>
              {!match.isActive || match.hasEnded ? (
                <motion.div
                  key="logo"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                >
                  <FutQuinaLogo 
                    size="md" 
                    style={{ color: '#E2E8F0' }} 
                    colorClass="" 
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          
          {/* Centralized Scoreboard */}
          <div 
            onClick={() => {
              setCurrentScreen('teams');
              setTeamsTab('historico');
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 hidden sm:flex items-center justify-center w-full max-w-[200px] cursor-pointer"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {(match.isActive && !match.isPaused && !match.hasEnded) && (
                <motion.div
                  key="scoreboard"
                  initial={{ y: -40, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -40, opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', damping: 20 }}
                  className="flex items-center justify-center gap-2 bg-brand-primary px-4 py-1.5 rounded-full border border-black/10 shadow-lg backdrop-blur-md pointer-events-auto transition-colors"
                >
                  {match.teamAIndex !== -1 && match.teamBIndex !== -1 ? (
                    <>
                      <div className="flex items-center gap-1.5">
                        <span className="text-emerald-950 text-[10px] font-black uppercase truncate max-w-[40px] hidden sm:block">{teams[match.teamAIndex]?.name.substring(0, 3)}</span>
                        <div className="drop-shadow-sm" style={{ color: teams[match.teamAIndex]?.color || '#ffffff' }}>
                          <PiShieldFill size={14} />
                        </div>
                        <span className="text-emerald-950 font-black text-sm ml-1">{match.scoreA}</span>
                      </div>
                      
                      <span className="text-emerald-950/40 text-[10px] font-bold mx-1">x</span>
                      
                      <div className="flex items-center gap-1.5">
                        <span className="text-emerald-950 font-black text-sm mr-1">{match.scoreB}</span>
                        <div className="drop-shadow-sm" style={{ color: teams[match.teamBIndex]?.color || '#ffffff' }}>
                          <PiShieldFill size={14} />
                        </div>
                        <span className="text-emerald-950 text-[10px] font-black uppercase truncate max-w-[40px] hidden sm:block">{teams[match.teamBIndex]?.name.substring(0, 3)}</span>
                      </div>
                      
                      <span className={`ml-3 flex items-center justify-center text-[10px] sm:text-xs font-black tracking-widest bg-emerald-950/20 text-emerald-950 px-2 py-0.5 rounded-lg ${match.timeRemaining <= 60 && !match.isPaused ? 'text-red-600 animate-pulse' : ''}`}>
                        {Math.floor(match.timeRemaining / 60).toString().padStart(2, '0')}:{(match.timeRemaining % 60).toString().padStart(2, '0')}
                      </span>
                    </>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Centralized Scoreboard For Mobile */}
          <div 
            onClick={() => {
              setCurrentScreen('teams');
              setTeamsTab('historico');
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 sm:hidden flex items-center justify-center w-auto pl-6 pr-10 cursor-pointer"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {(match.isActive && !match.isPaused && !match.hasEnded) && (
                <motion.div
                  key="scoreboard"
                  initial={{ y: -40, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -40, opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', damping: 20 }}
                  className="flex items-center justify-center gap-1.5 bg-brand-primary px-3 py-1 rounded-full border border-black/10 shadow-lg backdrop-blur-md pointer-events-auto transition-colors"
                >
                  {match.teamAIndex !== -1 && match.teamBIndex !== -1 ? (
                    <>
                      <div className="flex items-center gap-1">
                        <div className="drop-shadow-sm" style={{ color: teams[match.teamAIndex]?.color || '#ffffff' }}>
                          <PiShieldFill size={12} />
                        </div>
                        <span className="text-emerald-950 font-black text-xs ml-0.5">{match.scoreA}</span>
                      </div>
                      <span className="text-emerald-950/40 text-[9px] font-bold mx-0.5">x</span>
                      <div className="flex items-center gap-1">
                        <span className="text-emerald-950 font-black text-xs mr-0.5">{match.scoreB}</span>
                        <div className="drop-shadow-sm" style={{ color: teams[match.teamBIndex]?.color || '#ffffff' }}>
                          <PiShieldFill size={12} />
                        </div>
                      </div>
                      
                      <div className="w-[1px] h-3 bg-emerald-950/20 mx-0.5" />
                      <span className={`flex items-center justify-center text-[9px] font-black tracking-widest bg-emerald-950/20 px-2 py-0.5 rounded-lg ${match.timeRemaining <= 60 && !match.isPaused ? 'text-red-600 animate-pulse' : 'text-emerald-950'}`}>
                        {Math.floor(match.timeRemaining / 60).toString().padStart(2, '0')}:{(match.timeRemaining % 60).toString().padStart(2, '0')}
                      </span>
                    </>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setShowMainMenu(true)}
            className="p-2 text-white/90 hover:bg-white/10 rounded-full transition-all relative z-10"
          >
            <PiListBold size={24} />
          </button>
        </header>

        {/* Tabs for Teams */}
        {currentScreen === 'teams' && (
          <div className="px-6 pb-4">
            <div className="flex bg-white/5 backdrop-blur-md p-1 rounded-[24px] border border-white/10 shadow-sm">
              <button 
                onClick={() => navigateTeamsTab('configuracao')}
                className={`w-12 py-2 flex items-center justify-center rounded-[20px] transition-all ${teamsTab === 'configuracao' ? 'bg-white text-zinc-900 shadow-sm' : 'text-white/40 hover:text-white/80'}`}
              >
                <motion.div
                  animate={{ rotate: [0, 180, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 8.5,
                    ease: "easeInOut"
                  }}
                >
                  <PiGearBold size={18} />
                </motion.div>
              </button>
              <button 
                onClick={() => navigateTeamsTab('chegada')}
                className={`flex-1 py-2 flex items-center justify-center rounded-[20px] transition-all ${teamsTab === 'chegada' ? 'bg-white text-zinc-900 shadow-sm' : 'text-white/40 hover:text-white/80'}`}
              >
                <span className={`text-[10px] font-black uppercase tracking-widest text-center w-full transition-colors ${teamsTab === 'chegada' ? 'text-zinc-900' : 'text-white/70'}`}>Chegada</span>
              </button>
              <button 
                onClick={() => navigateTeamsTab('historico')}
                className={`flex-1 py-2 flex items-center justify-center rounded-[20px] transition-all ${teamsTab === 'historico' ? 'bg-white text-zinc-900 shadow-sm' : 'text-white/40 hover:text-white/80'}`}
              >
                <span className={`text-[10px] font-black uppercase tracking-widest text-center w-full transition-colors ${teamsTab === 'historico' ? 'text-zinc-900' : 'text-white/70'}`}>Confrontos</span>
              </button>
              <button 
                onClick={() => navigateTeamsTab('proximos')}
                className={`flex-1 py-2 flex items-center justify-center rounded-[20px] transition-all ${teamsTab === 'proximos' ? 'bg-white text-zinc-900 shadow-sm' : 'text-white/40 hover:text-white/80'}`}
              >
                <span className={`text-[10px] font-black uppercase tracking-widest text-center w-full transition-colors ${teamsTab === 'proximos' ? 'text-zinc-900' : 'text-white/70'}`}>Próximos</span>
              </button>
            </div>
          </div>
        )}

        {/* Tabs for Ranking */}
        {currentScreen === 'ranking' && (
          <div className="px-6 pb-4">
            <div className="flex bg-white/5 backdrop-blur-md p-1 rounded-[24px] border border-white/10 shadow-sm">
              <button
                onClick={() => setRankingTab('geral')}
                className={`flex-1 py-2 flex items-center justify-center rounded-[20px] transition-all ${rankingTab === 'geral' ? 'bg-white text-zinc-900 shadow-sm' : 'text-white/40 hover:text-white/80'}`}
              >
                <span className={`text-[10px] font-black uppercase tracking-widest text-center w-full transition-colors ${rankingTab === 'geral' ? 'text-zinc-900' : 'text-white/70'}`}>Geral</span>
              </button>
              <button
                onClick={() => setRankingTab('artilharia')}
                className={`flex-1 py-2 flex items-center justify-center rounded-[20px] transition-all ${rankingTab === 'artilharia' ? 'bg-white text-zinc-900 shadow-sm' : 'text-white/40 hover:text-white/80'}`}
              >
                <span className={`text-[10px] font-black uppercase tracking-widest text-center w-full transition-colors ${rankingTab === 'artilharia' ? 'text-zinc-900' : 'text-white/70'}`}>Artilharia</span>
              </button>
              <button
                onClick={() => setRankingTab('assistencias')}
                className={`flex-1 py-2 flex items-center justify-center rounded-[20px] transition-all ${rankingTab === 'assistencias' ? 'bg-white text-zinc-900 shadow-sm' : 'text-white/40 hover:text-white/80'}`}
              >
                <span className={`text-[10px] font-black uppercase tracking-widest text-center w-full transition-colors ${rankingTab === 'assistencias' ? 'text-zinc-900' : 'text-white/70'}`}>Assistências</span>
              </button>
            </div>
          </div>
        )}

        {/* Tabs for Finance */}
        {currentScreen === 'finance' && !isPrintMode && (
          <div className="px-6 pb-4">
            <div className="flex bg-white/5 backdrop-blur-md p-1 rounded-[24px] border border-white/10 shadow-sm">
              <button 
                onClick={() => setFinanceSubScreen('mensalidade')} 
                className={`flex-1 py-2 flex items-center justify-center rounded-[20px] transition-all ${financeSubScreen === 'mensalidade' ? 'bg-white text-zinc-900 shadow-sm' : 'text-white/40 hover:text-white/80'}`}
              >
                <span className={`text-[10px] font-black uppercase tracking-widest text-center w-full transition-colors ${financeSubScreen === 'mensalidade' ? 'text-zinc-900' : 'text-white/70'}`}>Mensalidade</span>
              </button>
              <button 
                onClick={() => setFinanceSubScreen('balanco')} 
                className={`flex-1 py-2 flex items-center justify-center rounded-[20px] transition-all ${financeSubScreen === 'balanco' ? 'bg-white text-zinc-900 shadow-sm' : 'text-white/40 hover:text-white/80'}`}
              >
                <span className={`text-[10px] font-black uppercase tracking-widest text-center w-full transition-colors ${financeSubScreen === 'balanco' ? 'text-zinc-900' : 'text-white/70'}`}>Balanço</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main 
        ref={mainRef} 
        className={`flex-1 overflow-y-auto pb-24 ${isPrintMode ? 'p-0 pb-0 bg-white text-black' : (['players', 'teams', 'ranking', 'finance'].includes(currentScreen) ? 'bg-white' : '')}`}
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
                        <div className="flex items-center gap-2">
                          <h2 className="text-sm font-bold uppercase tracking-widest text-[#464656]">Gerenciar jogadores</h2>
                          {!isOrgProAuthorized && (
                            <div 
                              onClick={() => setShowAuthModal(true)}
                              className="flex items-center gap-1 bg-zinc-100 text-zinc-400 px-2 py-0.5 rounded-full text-[9px] font-black uppercase cursor-pointer hover:bg-zinc-200 transition-colors"
                            >
                              <PiLockFill size={10} /> Local
                            </div>
                          )}
                        </div>
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
                      className={`flex-1 px-4 py-2 rounded-2xl border-none outline-none transition-all bg-gradient-to-br from-zinc-100 to-zinc-200 focus:ring-2 ring-brand-primary/50 text-sm border border-zinc-200`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addPlayer(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <button 
                      onClick={handleImportContacts}
                      className="p-2 bg-gradient-to-br from-zinc-100 to-zinc-200 text-brand-text-primary rounded-2xl shadow-sm hover:opacity-90 transition-all active:scale-95 flex items-center justify-center aspect-square border border-zinc-200"
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
                    placeholder=" "
                    className={`w-full h-24 px-4 py-3 rounded-2xl border-none outline-none transition-all text-xs resize-none bg-gradient-to-br from-zinc-50 to-zinc-100 text-brand-text-secondary focus:ring-2 ring-brand-primary/30 border border-zinc-200 peer`}
                    onChange={(e) => {
                      if (e.target.value.includes('\n') || e.target.value.length > 10) {
                        addBulkPlayers(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <div className="absolute top-3 left-4 pointer-events-none transition-all peer-focus:hidden peer-[:not(:placeholder-shown)]:hidden">
                    <span className="text-xs bg-gradient-to-br from-[#1E3D2F] to-[#2F5D4B] bg-clip-text text-transparent opacity-70">
                      Cole aqui sua lista do WhatsApp (ex: 1. João, 2. Maria...)
                    </span>
                  </div>
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

              <button 
                onClick={() => {
                  setCurrentScreen('org-pro');
                  setOrgProTab('painel');
                }}
                className="w-full p-4 bg-gradient-to-br from-[#1E3D2F] to-[#14301F] text-white rounded-2xl shadow-lg flex items-center justify-between text-left group hover:opacity-90 transition-all active:scale-95 border border-[#E3D39E]/20"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#E3D39E]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner border border-[#E3D39E]/20">
                    <GiCrown size={24} color="#E3D39E" />
                  </div>
                  <div>
                    <h3 className="font-black uppercase tracking-widest text-sm text-[#E3D39E]">Organização Pro</h3>
                    <p className="text-[10px] text-white/70 uppercase tracking-widest mt-1 font-bold">Painel de Controle e Acesso</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-[#E3D39E]/50 group-hover:text-[#E3D39E] transition-colors" />
              </button>

              <section className="rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-50 to-zinc-100 border border-zinc-200 shadow-sm">
                {visiblePlayers.length === 0 ? (
                  <div className="text-center py-12 opacity-50 text-brand-text-secondary text-xs normal-case flex flex-col items-center justify-center gap-2">
                    <span className="opacity-50 text-brand-text-secondary"><GiLaurelsTrophy size={48} /></span>
                    <span>Nenhum jogador adicionado ainda.</span>
                  </div>
                ) : (
                  <div className="divide-y divide-brand-border">
                    {visiblePlayers.map((player) => (
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
                              <IoPersonOutline size={16} />
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
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="text-xs font-medium truncate text-left">{player.name}</span>
                              {orgProData[player.id] && <div className="shrink-0"><GiCrown size={16} color="#E3D39E" /></div>}
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
              className="px-6 pb-6 pt-4 space-y-4 min-h-full bg-white flex flex-col"
            >
                  <div id="teams-list-section" className="max-w-5xl mx-auto w-full space-y-4">
                    {teamsTab === 'configuracao' ? (
                      <div className="space-y-6 bg-gradient-to-br from-zinc-100 to-zinc-200 p-6 rounded-3xl border border-zinc-300 shadow-sm">
                        <div className="sticky top-[-1px] z-40 bg-gradient-to-br from-zinc-100 to-zinc-200 py-4 -mx-6 px-6 border-b border-zinc-300 flex justify-between items-center rounded-t-3xl">
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

                          <div className="p-5 bg-white rounded-2xl border border-zinc-200 space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="text-[11px] font-black uppercase tracking-widest text-zinc-900">Fixar Cores nos Confrontos?</span>
                                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Define cores permanentes para o Time A e Time B</p>
                              </div>
                              <button 
                                onClick={() => setFixedColors(prev => ({ ...prev, enabled: !prev.enabled }))}
                                className={`w-12 h-6 rounded-full p-1 transition-colors relative ${fixedColors.enabled ? 'bg-brand-primary' : 'bg-zinc-300'}`}
                              >
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${fixedColors.enabled ? 'translate-x-6' : 'translate-x-0'} shadow-sm`} />
                              </button>
                            </div>

                            {fixedColors.enabled && (
                              <div className="grid grid-cols-2 gap-4 pt-2 animate-in fade-in slide-in-from-top-1 duration-300">
                                <div className="space-y-2">
                                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Cor Time A</label>
                                  <button
                                    onClick={() => setShowColorPicker({ teamIdx: -1, color: fixedColors.teamA || TEAM_COLORS[0] })}
                                    className="w-full h-12 rounded-xl flex items-center justify-between px-4 bg-zinc-50 border border-zinc-100 hover:border-zinc-300 transition-all"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="w-5 h-5 rounded-md shadow-sm border border-black/5" style={{ backgroundColor: fixedColors.teamA || TEAM_COLORS[0] }} />
                                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Escudo A</span>
                                    </div>
                                    <PenLine size={14} className="text-zinc-400" />
                                  </button>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Cor Time B</label>
                                  <button
                                    onClick={() => setShowColorPicker({ teamIdx: -2, color: fixedColors.teamB || TEAM_COLORS[1] })}
                                    className="w-full h-12 rounded-xl flex items-center justify-between px-4 bg-zinc-50 border border-zinc-100 hover:border-zinc-300 transition-all"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="w-5 h-5 rounded-md shadow-sm border border-black/5" style={{ backgroundColor: fixedColors.teamB || TEAM_COLORS[1] }} />
                                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Escudo B</span>
                                    </div>
                                    <PenLine size={14} className="text-zinc-400" />
                                  </button>
                                </div>
                              </div>
                            )}
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
                      <div className="space-y-6 bg-gradient-to-br from-zinc-100 to-zinc-200 p-6 rounded-3xl border border-zinc-300 shadow-sm">
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
                                  className="p-2 rounded-lg transition-all active:scale-90 hover:bg-zinc-200 flex items-center gap-1.5 bg-white/95 backdrop-blur shadow-sm border border-zinc-200"
                                >
                                  <span className="text-brand-text-primary"><CheckCircle2 size={20} /></span>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-text-primary">Todos Presentes</span>
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
                                className="p-2 rounded-lg transition-all active:scale-90 hover:bg-zinc-200 flex items-center gap-1.5 bg-white/95 backdrop-blur shadow-sm border border-zinc-200"
                              >
                                <span className="text-brand-text-primary"><CheckCircle2 size={20} /></span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-text-primary">Pronto</span>
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {players.filter(p => sessionPlayerIds.includes(p.id)).length === 0 ? (
                            <div className="col-span-full py-12 text-center border border-dashed border-white/5 rounded-xl flex flex-col items-center gap-4">
                              <span className="opacity-50 text-brand-text-secondary"><GiSocks size={48} /></span>
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
                                    <span className={p.isAvailable ? 'text-black' : 'text-zinc-600' + ' flex items-center shrink-0'}><IoPersonOutline size={14} /></span>
                                  )}
                                </div>
                                <div className="flex-1 text-left">
                                  <div className={`text-[11px] sm:text-xs font-normal capitalize tracking-tight ${p.isAvailable ? 'text-black' : 'text-zinc-500'}`}>{p.name.toLowerCase()}</div>
                                  <div className={`text-[8px] font-bold uppercase ${p.isAvailable ? 'text-black/60' : 'text-zinc-400'}`}>{p.isAvailable ? 'Presente' : 'Ausente'}</div>
                                </div>
                                {p.isAvailable && <CheckCircle2 size={16} className="text-black" />}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    ) : teamsTab === 'historico' ? (
                      <div className="space-y-6 bg-gradient-to-br from-zinc-100 to-zinc-200 p-6 rounded-3xl border border-zinc-300 shadow-sm">
                        {!match.isActive ? (
                          <div className="py-12 text-center border border-dashed border-white/5 rounded-3xl flex flex-col items-center gap-4">
                            {players.filter(p => p.isAvailable).length === 0 ? (
                              <>
                                <span className="opacity-50 text-zinc-500"><GiAbstract042 size={48} /></span>
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
                                  <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto mb-2 space-y-4 bg-gradient-to-br from-zinc-100 to-zinc-200 p-6 rounded-[32px] border border-zinc-300 shadow-sm">
                                    <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.2em] opacity-60">Última Partida</p>
                                    <div className="flex items-center justify-between gap-4 px-2 py-2 w-full">
                                      <div className="flex-1 flex flex-col items-center text-center space-y-1">
                                        <div className="w-10 h-10 flex items-center justify-center shrink-0">
                                          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                                            <defs>
                                              <linearGradient id="shield-grad-A-last" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor={lastMatchResult.teamAColor || teams[lastMatchResult.teamAIndex]?.color || TEAM_COLORS[0]} />
                                                <stop offset="100%" stopColor={lastMatchResult.teamAColor || teams[lastMatchResult.teamAIndex]?.color || TEAM_COLORS[0]} stopOpacity="0.85" />
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
                                                <stop offset="0%" stopColor={lastMatchResult.teamBColor || teams[lastMatchResult.teamBIndex]?.color || TEAM_COLORS[1]} />
                                                <stop offset="100%" stopColor={lastMatchResult.teamBColor || teams[lastMatchResult.teamBIndex]?.color || TEAM_COLORS[1]} stopOpacity="0.85" />
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
                                              backgroundColor: (event.team === 'A' ? (lastMatchResult.teamAColor || teams[lastMatchResult.teamAIndex]?.color) : (lastMatchResult.teamBColor || teams[lastMatchResult.teamBIndex]?.color)) === '#1a1a1a' 
                                                ? '#00000010' 
                                                : (event.team === 'A' ? (lastMatchResult.teamAColor || teams[lastMatchResult.teamAIndex]?.color) : (lastMatchResult.teamBColor || teams[lastMatchResult.teamBIndex]?.color || TEAM_COLORS[0])) + '15'
                                            }}
                                          >
                                            <div className="flex items-center gap-1.5 overflow-hidden">
                                              <div className="w-4 h-4 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 border border-zinc-300">
                                                {p.photo ? <img src={p.photo} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" /> : <span className="text-black flex items-center shrink-0"><IoPersonOutline size={8} /></span>}
                                              </div>
                                              <span className="text-[9px] font-normal capitalize truncate text-zinc-800">{p.name.toLowerCase()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                              {a && (
                                                <div className="flex items-center gap-1 text-[8px] font-normal text-emerald-800" title={`Assistência: ${a.name}`}>
                                                  <Footprints size={8} /> <span>{a.name.toLowerCase().split(' ')[0]}</span>
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
                            <div className="sticky top-[-1px] z-40 bg-gradient-to-br from-zinc-100 to-zinc-200 backdrop-blur-md py-6 -mx-6 px-6 flex flex-row items-center justify-between gap-2 sm:gap-6 rounded-[32px] border border-zinc-300 shadow-sm w-full max-w-2xl mx-auto relative overflow-hidden">
                              <div className="flex-1 flex flex-col items-center text-center space-y-2 sm:space-y-4">
                                  <button 
                                    className="w-10 h-10 sm:w-20 sm:h-20 transition-transform hover:scale-110 active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed drop-shadow-sm"
                                    disabled={match.hasEnded}
                                    onClick={() => {
                                      if (match.teamAIndex === -1) return;
                                      setShowColorPicker({ 
                                        teamIdx: match.teamAIndex, 
                                        color: (fixedColors.enabled && fixedColors.teamA) || teams[match.teamAIndex]?.color || TEAM_COLORS[0]
                                      });
                                    }}
                                  >
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                                      <defs>
                                        <linearGradient id="shield-grad-A-main" x1="0%" y1="0%" x2="0%" y2="100%">
                                          <stop offset="0%" stopColor={(fixedColors.enabled && fixedColors.teamA) || teams[match.teamAIndex]?.color || TEAM_COLORS[0]} />
                                          <stop offset="100%" stopColor={(fixedColors.enabled && fixedColors.teamA) || teams[match.teamAIndex]?.color || TEAM_COLORS[0]} stopOpacity="0.85" />
                                        </linearGradient>
                                      </defs>
                                      <path fill="url(#shield-grad-A-main)" d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" stroke="rgba(0,0,0,0.1)" strokeWidth="1" strokeLinejoin="round" />
                                      <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" fill="white" opacity="0.15" />
                                    </svg>
                                  </button>
                                  <div 
                                    className={`text-4xl sm:text-7xl font-black origin-center text-zinc-800 ${(!match.isActive || match.isPaused) ? 'opacity-50' : ''} tabular-nums tracking-tighter leading-none flex items-center justify-center w-14 h-14 sm:w-24 sm:h-24 rounded-xl bg-white border-b-4 border-zinc-200 shadow-sm`}
                                  >
                                    {match.scoreA}
                                  </div>
                                  <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-600 truncate max-w-[80px] sm:max-w-[120px] px-1 text-center">{teams[match.teamAIndex]?.name}</span>
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
                                      setShowColorPicker({ 
                                        teamIdx: match.teamBIndex, 
                                        color: (fixedColors.enabled && fixedColors.teamB) || teams[match.teamBIndex]?.color || TEAM_COLORS[1]
                                      });
                                    }}
                                  >
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                                      <defs>
                                        <linearGradient id="shield-grad-B-main" x1="0%" y1="0%" x2="0%" y2="100%">
                                          <stop offset="0%" stopColor={(fixedColors.enabled && fixedColors.teamB) || teams[match.teamBIndex]?.color || TEAM_COLORS[1]} />
                                          <stop offset="100%" stopColor={(fixedColors.enabled && fixedColors.teamB) || teams[match.teamBIndex]?.color || TEAM_COLORS[1]} stopOpacity="0.85" />
                                        </linearGradient>
                                      </defs>
                                      <path fill="url(#shield-grad-B-main)" d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" stroke="rgba(0,0,0,0.1)" strokeWidth="1" strokeLinejoin="round" />
                                      <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" fill="white" opacity="0.15" />
                                    </svg>
                                  </button>
                                  <div 
                                    className={`text-4xl sm:text-7xl font-black origin-center text-zinc-800 ${(!match.isActive || match.isPaused) ? 'opacity-50' : ''} tabular-nums tracking-tighter leading-none flex items-center justify-center w-14 h-14 sm:w-24 sm:h-24 rounded-xl bg-white border-b-4 border-zinc-200 shadow-sm`}
                                  >
                                    {match.scoreB}
                                  </div>
                                  <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-600 truncate max-w-full px-1">{teams[match.teamBIndex]?.name}</span>
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
                  className={`w-full flex items-center p-2 sm:p-1.5 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-br from-zinc-100 to-zinc-200 ${
                    swappingPlayerId === pid
                      ? 'border-2 border-brand-primary shadow-lg scale-105'
                      : 'border group'
                  }`}
                  style={{ 
                    borderColor: swappingPlayerId !== pid ? ((fixedColors.enabled && fixedColors.teamA) || teams[match.teamAIndex]?.color || TEAM_COLORS[0]) + '40' : undefined,
                    backgroundColor: swappingPlayerId === pid ? undefined : undefined
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
                  <span className="text-[11px] sm:text-[10px] font-normal capitalize truncate text-black">{p.name.toLowerCase()}</span>
                  <div className="w-5 h-5 sm:w-4 sm:h-4 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 border border-zinc-200">
                                          {p.photo ? <img src={p.photo} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" /> : <span className="text-black flex items-center shrink-0"><IoPersonOutline size={10} /></span>}
                                        </div>
                                      </div>
                                    </button>
                                  );
                                })}
                                {Array.from({ length: Math.max(0, match.config.playersPerTeam - (teams[match.teamAIndex]?.playerIds?.length || 0)) }).map((_, i) => (
                                  <button 
                                    key={`empty-a-${i}`}
                                    onClick={() => {
                                      if (movingPlayers && isSelectingDestination) {
                                        const sourceTeamIdx = teams.findIndex(team => team.id === movingPlayers.teamId);
                                        if (sourceTeamIdx === match.teamAIndex) {
                                          setToast({ message: "Os jogadores já estão neste time.", type: 'info' });
                                          setMovingPlayers(null);
                                          setIsSelectingDestination(false);
                                          return;
                                        }
                                        const availableSlots = match.config.playersPerTeam - (teams[match.teamAIndex]?.playerIds?.length || 0);
                                        if (availableSlots <= 0) {
                                          setToast({ message: "Este time já está completo.", type: 'warning' });
                                          return;
                                        }
                                        const playersToMove = movingPlayers.playerIds.slice(0, availableSlots);
                                        setTeams(prev => {
                                          const newTeams = [...prev].map(team => ({ ...team, playerIds: [...team.playerIds] }));
                                          const sTeam = newTeams.find(team => team.id === movingPlayers.teamId);
                                          if (sTeam) {
                                            sTeam.playerIds = sTeam.playerIds.filter(id => !playersToMove.includes(id));
                                          }
                                          if (newTeams[match.teamAIndex]) {
                                            newTeams[match.teamAIndex].playerIds.push(...playersToMove);
                                          }
                                          return newTeams.filter(team => team.playerIds.length > 0);
                                        });

                                        if (playersToMove.length < movingPlayers.playerIds.length) {
                                          setMovingPlayers(prev => prev ? { ...prev, playerIds: prev.playerIds.slice(availableSlots) } : null);
                                          setToast({ message: `Apenas ${availableSlots} jogador(es) movido(s). Selecione outro time para o(s) restante(s).`, type: 'info' });
                                        } else {
                                          setMovingPlayers(null);
                                          setIsSelectingDestination(false);
                                          setToast({ message: "Jogador(es) movido(s) para o Time A!", type: 'success' });
                                        }
                                      }
                                    }}
                                    className={`w-full flex items-center justify-center p-2 sm:p-1.5 rounded-xl border border-dashed transition-all active:scale-95 ${
                                      theme === 'light' ? 'border-zinc-300 bg-zinc-50 text-zinc-300 hover:bg-zinc-100' : 'border-white/10 bg-white/5 text-white/5 hover:bg-white/10'
                                    } ${movingPlayers && isSelectingDestination ? 'animate-pulse border-brand-primary' : ''}`}
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
                  className={`w-full flex items-center gap-2 p-2 sm:p-1.5 rounded-xl transition-all active:scale-95 text-left disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-br from-zinc-100 to-zinc-200 ${
                    swappingPlayerId === pid
                      ? 'border-2 border-brand-primary shadow-lg scale-105'
                      : 'border group'
                  }`}
                  style={{ 
                    borderColor: swappingPlayerId !== pid ? ((fixedColors.enabled && fixedColors.teamB) || teams[match.teamBIndex]?.color || TEAM_COLORS[1]) + '40' : undefined,
                    backgroundColor: swappingPlayerId === pid ? undefined : undefined
                  }}
                >
                <div className="w-5 h-5 sm:w-4 sm:h-4 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 border border-zinc-200">
                  {p.photo ? <img src={p.photo} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" /> : <span className="text-black flex items-center shrink-0"><IoPersonOutline size={10} /></span>}
                </div>
                <span className="text-[11px] sm:text-[10px] font-normal capitalize truncate text-black">{p.name.toLowerCase()}</span>
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
                                      if (movingPlayers && isSelectingDestination) {
                                        const sourceTeamIdx = teams.findIndex(team => team.id === movingPlayers.teamId);
                                        if (sourceTeamIdx === match.teamBIndex) {
                                          setToast({ message: "Os jogadores já estão neste time.", type: 'info' });
                                          setMovingPlayers(null);
                                          setIsSelectingDestination(false);
                                          return;
                                        }
                                        const availableSlots = match.config.playersPerTeam - (teams[match.teamBIndex]?.playerIds?.length || 0);
                                        if (availableSlots <= 0) {
                                          setToast({ message: "Este time já está completo.", type: 'warning' });
                                          return;
                                        }
                                        const playersToMove = movingPlayers.playerIds.slice(0, availableSlots);
                                        setTeams(prev => {
                                          const newTeams = [...prev].map(team => ({ ...team, playerIds: [...team.playerIds] }));
                                          const sTeam = newTeams.find(team => team.id === movingPlayers.teamId);
                                          if (sTeam) {
                                            sTeam.playerIds = sTeam.playerIds.filter(id => !playersToMove.includes(id));
                                          }
                                          if (newTeams[match.teamBIndex]) {
                                            newTeams[match.teamBIndex].playerIds.push(...playersToMove);
                                          }
                                          return newTeams.filter(team => team.playerIds.length > 0);
                                        });
                                        if (playersToMove.length < movingPlayers.playerIds.length) {
                                          setMovingPlayers(prev => prev ? { ...prev, playerIds: prev.playerIds.slice(availableSlots) } : null);
                                          setToast({ message: `Apenas ${availableSlots} jogador(es) movido(s). Selecione outro time para o(s) restante(s).`, type: 'info' });
                                        } else {
                                          setMovingPlayers(null);
                                          setIsSelectingDestination(false);
                                          setToast({ message: "Jogador(es) movido(s) para o Time B!", type: 'success' });
                                        }
                                      }
                                    }}
                                    className={`w-full flex items-center justify-center p-2 sm:p-1.5 rounded-xl border border-dashed transition-all active:scale-95 ${
                                      theme === 'light' ? 'border-zinc-300 bg-zinc-50 text-zinc-300 hover:bg-zinc-100' : 'border-white/10 bg-white/5 text-white/5 hover:bg-white/10'
                                    } ${movingPlayers && isSelectingDestination ? 'animate-pulse border-brand-primary' : ''}`}
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
                        <div className="absolute inset-0 pointer-events-none opacity-10 z-0" style={{
                          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 15px, #cccccc 15px, #cccccc 16px), repeating-linear-gradient(-45deg, transparent, transparent 15px, #cccccc 15px, #cccccc 16px)`,
                        }}></div>
                        
                        <div className="flex justify-between items-center relative z-10">
                          <button 
                            onClick={() => setTeamsTab('configuracao')}
                            className="p-2 rounded-lg transition-all active:scale-90 hover:bg-zinc-200 bg-white/95 backdrop-blur shadow-sm border border-zinc-200"
                            title="Configurações"
                          >
                            <motion.div
                              animate={{ rotate: [0, 180, 0] }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                repeatDelay: 8.5,
                                ease: "easeInOut"
                              }}
                            >
                              <Settings size={20} className="text-brand-text-primary" />
                            </motion.div>
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
                                className="p-2 rounded-lg transition-all active:scale-90 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 bg-white/95 backdrop-blur shadow-sm border border-zinc-200"
                              >
                                <span className="text-brand-text-primary"><ImSpinner9 size={20} /></span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-text-primary">Sortear</span>
                              </button>
                              <button
                                onClick={() => {
                                  if (match.isActive && !match.hasEnded) {
                                    setShowStartMatchConfirm(true);
                                    return;
                                  }

                                  if (match.teamAIndex !== -1 && match.teamBIndex !== -1 && 
                                      (teams[match.teamAIndex]?.playerIds?.length === match.config.playersPerTeam && 
                                      teams[match.teamBIndex]?.playerIds?.length === match.config.playersPerTeam)) {
                                    startNextMatch(match.teamAIndex, match.teamBIndex);
                                  }
                                }}
                                disabled={!((match.teamAIndex !== -1 && match.teamBIndex !== -1 && 
                                  (teams[match.teamAIndex]?.playerIds?.length === match.config.playersPerTeam && 
                                   teams[match.teamBIndex]?.playerIds?.length === match.config.playersPerTeam)))}
                                className="p-2 rounded-lg transition-all active:scale-90 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 bg-white/95 backdrop-blur shadow-sm border border-zinc-200"
                              >
                                <span className="text-brand-text-primary"><IoFootballOutline size={20} /></span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-text-primary">Iniciar</span>
                              </button>
                            </div>
                        </div>
                        <div className="space-y-4">
                          {teams.length < 2 ? (
                            <div className="py-12 text-center border border-dashed border-zinc-200 rounded-xl flex flex-col items-center gap-4">
                              <span className="opacity-50 text-zinc-500"><GiSoccerBall size={48} /></span>
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
                              {/* Tie resolution info */}
                              {teams.some(t => t.lastMatchStatus === 'Empate') && (
                                <motion.div 
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="p-4 bg-zinc-900 border border-white/10 rounded-2xl flex items-start gap-3 shadow-xl mb-4 cursor-pointer hover:bg-zinc-800 transition-colors group"
                                  onClick={() => {
                                    setTeams(prev => prev.map(team => team.lastMatchStatus === 'Empate' ? { ...team, lastMatchStatus: undefined } : team));
                                  }}
                                >
                                  <div className="w-8 h-8 rounded-xl bg-brand-primary/20 flex items-center justify-center shrink-0">
                                    <Info size={16} className="text-brand-primary" />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-1">Empate Resolvido Manualmente</span>
                                    <p className="text-[9px] text-white/50 font-bold uppercase leading-relaxed tracking-wider">
                                      Desmarque o time que deve <span className="text-white">descer na fila</span>. O time que permanecer selecionado jogará a próxima partida.
                                    </p>
                                  </div>
                                </motion.div>
                              )}

                              {teams.map((t, tIdx) => {
                                const isCurrent = tIdx === match.teamAIndex || tIdx === match.teamBIndex;
                                const isFlashing = flashingTeamIds.includes(t.id);
                                return (
                                  <div 
                                    key={`team-card-${t.id}-${tIdx}`} 
                                    id={`team-card-${tIdx}`}
                                    onClick={(e) => {
                                      if (swappingPlayerId) return;
                                      if (movingPlayers && isSelectingDestination) {
                                        e.stopPropagation();
                                        const availableSlots = match.config.playersPerTeam - t.playerIds.length;
                                        if (availableSlots <= 0) {
                                          setToast({ message: "Este time já está completo.", type: 'warning' });
                                          return;
                                        }
                                        const playersToMove = movingPlayers.playerIds.slice(0, availableSlots);
                                        setTeams(prev => {
                                          const newTeams = [...prev].map(team => ({ ...team, playerIds: [...team.playerIds] }));
                                          const sourceTeam = newTeams.find(team => team.id === movingPlayers.teamId);
                                          if (sourceTeam) {
                                            sourceTeam.playerIds = sourceTeam.playerIds.filter(id => !playersToMove.includes(id));
                                          }
                                          const targetTeam = newTeams.find(team => team.id === t.id);
                                          if (targetTeam) {
                                            targetTeam.playerIds.push(...playersToMove);
                                          }
                                          return newTeams.filter(team => team.playerIds.length > 0);
                                        });
                                        if (playersToMove.length < movingPlayers.playerIds.length) {
                                          setMovingPlayers(prev => prev ? { ...prev, playerIds: prev.playerIds.slice(availableSlots) } : null);
                                          setToast({ message: `Apenas ${availableSlots} jogador(es) movido(s). Selecione outro time para o(s) restante(s).`, type: 'info' });
                                        } else {
                                          setMovingPlayers(null);
                                          setIsSelectingDestination(false);
                                          setToast({ message: "Jogador(es) movido(s) com sucesso!", type: 'success' });
                                        }
                                        return;
                                      }
                                    }}
                                    className={`p-4 rounded-xl border-2 transition-all relative min-h-[100px] flex flex-col justify-center overflow-hidden ${
                                      (movingPlayers && isSelectingDestination) ? 'cursor-pointer hover:opacity-90' : 'cursor-default'
                                    } ${
                                      isCurrent 
                                        ? 'shadow-lg z-10 border-brand-primary bg-[linear-gradient(to_right,rgba(183,217,108,0.4),rgba(163,217,0,0.4))] ring-2 ring-brand-primary/20 backdrop-blur-sm'
                                        : 'shadow-sm opacity-80 border-zinc-300 bg-transparent'
                                    } ${isFlashing || (movingPlayers && isSelectingDestination && t.playerIds.length < match.config.playersPerTeam) ? 'animate-pulse bg-brand-primary/20 !border-brand-primary' : ''}`}
                                    style={{
                                      borderColor: (movingPlayers?.teamId === t.id || (swappingPlayerId && t.playerIds.includes(swappingPlayerId))) ? '#22c55e' : undefined
                                    }}
                                  >
                                    
                                    {/* Status Top Right (Winner/Loser/Draw) */}
                                    {t.lastMatchStatus && (
                                      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                                        {t.lastMatchStatus === 'Vencedor' ? (
                                          <div className="px-2 py-0.5 rounded-full bg-[#39FF14] text-black text-[8px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1">
                                            <Trophy size={8} fill="currentColor" />
                                            Venceu
                                          </div>
                                        ) : t.lastMatchStatus === 'Empate' ? (
                                          <div className="px-2 py-0.5 rounded-full bg-zinc-500 text-white text-[8px] font-black uppercase tracking-widest shadow-sm">
                                            Empate
                                          </div>
                                        ) : t.lastMatchStatus === 'Derrota' ? (
                                          <div className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[8px] font-black uppercase tracking-widest shadow-sm">
                                            Perdeu
                                          </div>
                                        ) : (
                                          <div className="px-2 py-0.5 rounded-full bg-sky-500 text-white text-[8px] font-black uppercase tracking-widest shadow-sm animate-bounce">
                                            Subiu
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Jersey Icon Top Left */}
                                    <div 
                                      className={`absolute top-2 left-2 w-10 h-10 rounded-xl border flex items-center justify-center transition-all bg-white cursor-pointer z-50 ${isCurrent ? 'border-brand-primary shadow-[0_0_8px_rgba(183,217,108,0.5)]' : 'border-zinc-200 hover:scale-110'}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (match.isActive && !match.hasEnded && !match.isPaused) {
                                          setToast({ message: "Não é possível trocar times durante uma partida ativa.", type: 'warning' });
                                          return;
                                        }
                                        
                                        if (isCurrent) {
                                          if (t.lastMatchStatus === 'Empate') {
                                            setTeams(prevTeams => {
                                                const newTeams = prevTeams.map(team => ({
                                                  ...team,
                                                  lastMatchStatus: team.lastMatchStatus === 'Empate' ? undefined : team.lastMatchStatus
                                                }));
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
                                    >
                                      {(() => {
                                        let teamColor = t.color || TEAM_COLORS[0];
                                        if (fixedColors.enabled) {
                                          if (match.teamAIndex === tIdx && fixedColors.teamA) teamColor = fixedColors.teamA;
                                          else if (match.teamBIndex === tIdx && fixedColors.teamB) teamColor = fixedColors.teamB;
                                        }
                                        const strokeColor = teamColor === '#000000' || teamColor === '#1a1a1a' ? '#ffffff40' : (teamColor === '#ffffff' ? '#e4e4e7' : 'white');
                                        return (
                                          <svg viewBox="0 0 24 24" stroke={strokeColor} strokeWidth="0.5" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                                            <defs>
                                              <linearGradient id={`shield-grad-${t.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor={teamColor || '#2563EB'} />
                                                <stop offset="100%" stopColor={teamColor || '#1E3A8A'} stopOpacity="0.85" />
                                              </linearGradient>
                                            </defs>
                                            <path 
                                              fill={`url(#shield-grad-${t.id})`}
                                              d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z"
                                              stroke={isCurrent ? '#B7D96C' : (strokeColor === '#ffffff40' ? '#ffffff' : (strokeColor === '#e4e4e7' ? '#000000' : strokeColor))}
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
                                                  onTouchStart={(e) => {
                                                    if (swappingPlayerId || fillingVacancyForTeam || (movingPlayers && isSelectingDestination)) return;
                                                    if (movingPlayers && movingPlayers.teamId !== t.id) return;
                                                    if (longPressTimer.current) clearTimeout(longPressTimer.current);
                                                    longPressTimer.current = setTimeout(() => {
                                                      navigator.vibrate?.(50);
                                                      setMovingPlayers(prev => {
                                                        if (!prev) return { teamId: t.id, playerIds: [pid] };
                                                        if (!prev.playerIds.includes(pid)) return { ...prev, playerIds: [...prev.playerIds, pid] };
                                                        return prev;
                                                      });
                                                    }, 500);
                                                  }}
                                                  onTouchEnd={() => { if (longPressTimer.current) clearTimeout(longPressTimer.current); }}
                                                  onTouchCancel={() => { if (longPressTimer.current) clearTimeout(longPressTimer.current); }}
                                                  onMouseDown={(e) => {
                                                    if (swappingPlayerId || fillingVacancyForTeam || (movingPlayers && isSelectingDestination)) return;
                                                    if (movingPlayers && movingPlayers.teamId !== t.id) return;
                                                    if (longPressTimer.current) clearTimeout(longPressTimer.current);
                                                    longPressTimer.current = setTimeout(() => {
                                                      setMovingPlayers(prev => {
                                                        if (!prev) return { teamId: t.id, playerIds: [pid] };
                                                        if (!prev.playerIds.includes(pid)) return { ...prev, playerIds: [...prev.playerIds, pid] };
                                                        return prev;
                                                      });
                                                    }, 500);
                                                  }}
                                                  onMouseUp={() => { if (longPressTimer.current) clearTimeout(longPressTimer.current); }}
                                                  onMouseLeave={() => { if (longPressTimer.current) clearTimeout(longPressTimer.current); }}
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (movingPlayers && movingPlayers.teamId === t.id) {
                                                      setMovingPlayers(prev => {
                                                        if (!prev) return null;
                                                        const pIds = prev.playerIds.includes(pid) 
                                                          ? prev.playerIds.filter(id => id !== pid)
                                                          : [...prev.playerIds, pid];
                                                        if (pIds.length === 0) return null;
                                                        return { ...prev, playerIds: pIds };
                                                      });
                                                      return;
                                                    }
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
                                                      const isMatchActive = match.isActive && (fillingVacancyForTeam === match.teamAIndex || fillingVacancyForTeam === match.teamBIndex);
                                                      setFillingVacancyForTeam(null);
                                                      
                                                      if (isMatchActive) {
                                                        setTeamsTab('historico');
                                                        setToast({ message: "✅ Jogador substituído! A partida pode continuar.", type: 'success' });
                                                      } else {
                                                        setToast({ message: "Jogador movido com sucesso!", type: 'success' });
                                                      }
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
                                                    swappingPlayerId === pid || movingPlayers?.playerIds.includes(pid)
                                                      ? 'bg-brand-primary/20 text-black border-2 border-brand-primary shadow-lg scale-105'
                                                      : (swappingPlayerId && swappingPlayerId !== pid) || fillingVacancyForTeam !== null || ([match.teamAIndex, match.teamBIndex].some(targetTIdx => targetTIdx !== -1 && targetTIdx !== tIdx && (teams[targetTIdx]?.playerIds?.length || 0) < match.config.playersPerTeam))
                                                        ? 'bg-brand-primary/20 text-brand-primary animate-pulse shadow-sm shadow-brand-primary/10'
                                                        : `text-black border group bg-white/60 shadow-sm ${isCurrent ? 'border-brand-primary ring-1 ring-brand-primary' : 'border-black/5 hover:border-black/20'}`
                                                  }`}
                                                  style={{ 
                                                    backgroundColor: !((swappingPlayerId && swappingPlayerId !== pid) || 
                                                                       fillingVacancyForTeam !== null || 
                                                                       (movingPlayers?.playerIds.includes(pid)) ||
                                                                       ([match.teamAIndex, match.teamBIndex].some(targetTIdx => targetTIdx !== -1 && targetTIdx !== tIdx && (teams[targetTIdx]?.playerIds?.length || 0) < match.config.playersPerTeam)) ||
                                                                       swappingPlayerId === pid)
                                                      ? undefined 
                                                      : undefined 
                                                  }}
                                                >
                                                <div className="flex items-center gap-2 ml-auto overflow-hidden">
                                                  <span className="text-sm sm:text-[13px] font-normal truncate text-black capitalize">{p.name.toLowerCase()}</span>
                                                  <div className="w-5 h-5 sm:w-4 sm:h-4 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 border border-zinc-300">
                                                    {p.photo ? <img src={p.photo} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" /> : <span className="text-black flex items-center shrink-0"><IoPersonOutline size={10} /></span>}
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
                            ? 'bg-emerald-900 border-brand-primary shadow-[0_0_30px_rgba(163,230,53,0.2)]' 
                            : 'bg-gradient-to-br from-zinc-50 to-zinc-100 border-zinc-200 hover:border-zinc-400'
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
                            className={`bg-transparent font-black text-xl uppercase tracking-tight outline-none w-full placeholder:opacity-40 ${
                              (match.teamAIndex === tIndex || match.teamBIndex === tIndex)
                                ? 'text-white'
                                : 'text-zinc-900'
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
                                  <div className={`w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden border shrink-0 ${match.teamAIndex === tIndex || match.teamBIndex === tIndex ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-zinc-200'}`}>
                                    {p.photo ? (
                                      <img src={p.photo} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    ) : (
                                      <span className="text-zinc-700 flex items-center shrink-0"><IoPersonOutline size={10} /></span>
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
                        className="p-6 rounded-xl border border-dashed border-zinc-300 hover:border-zinc-500 hover:bg-zinc-100 transition-all flex flex-col items-center justify-center gap-3 group"
                      >
                        <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-black transition-all">
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
              <motion.div 
                className={`bg-gradient-to-br from-zinc-100 to-zinc-200 p-6 rounded-3xl border border-zinc-300 overflow-hidden shadow-sm`}
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
                <div className="flex items-center justify-between pb-2 border-b border-dashed border-zinc-300 mb-4 px-2">
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setIsPrintMode(true)} 
                      className="flex items-center gap-2 p-2 px-3 rounded-xl border border-zinc-300 bg-white/50 hover:bg-white transition-colors shadow-sm"
                    >
                      <span className="text-[#1E3D2F]">
                        <GiPodiumWinner size={20} />
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#1E3D2F]">Ranking</span>
                    </button>
                  </div>
                  <div className="text-zinc-500 text-xs font-bold font-mono tracking-tighter uppercase"></div>
                  <div className={`flex gap-4 sm:gap-8 text-[10px] font-black uppercase tracking-widest text-[#1E3D2F]/60 ${rankingTab === 'artilharia' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-12 text-center flex items-center justify-center gap-1 ${rankingTab !== 'assistencias' ? '' : 'opacity-0'}`}><IoFootballOutline size={14} /> Gols</div>
                    <div className={`w-12 text-center flex items-center justify-center gap-1 ${rankingTab !== 'artilharia' ? '' : 'opacity-0'}`}><GiRunningShoe size={14} /> Ass</div>
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
                    className={`flex items-center py-3 px-2 transition-colors rounded-xl ${index !== 0 ? `border-t border-zinc-200` : ''}`}
                  >
                    <div className="w-8 text-sm font-black text-brand-text-secondary text-center shrink-0">
                      {index + 1}
                    </div>
                    
                    <div className="relative ml-2 mr-4 shrink-0">
                      <div className={`w-10 h-10 rounded-3xl overflow-hidden flex items-center justify-center bg-zinc-200 border border-zinc-300 relative z-10`}>
                        {player.photo ? (
                          <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-zinc-500 flex items-center shrink-0"><IoPersonOutline size={20} /></span>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 text-xs text-brand-text-primary tracking-tight truncate mr-4 font-normal capitalize">
                      {player.name.toLowerCase()}
                    </div>

                    <div className={`flex gap-4 sm:gap-8 shrink-0 ${rankingTab === 'artilharia' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-12 text-center text-sm font-black text-brand-text-primary ${rankingTab === 'assistencias' ? 'opacity-0' : ''}`}>{player.goals}</div>
                      <div className={`w-12 text-center text-sm font-black text-brand-text-primary ${rankingTab === 'artilharia' ? 'opacity-0' : ''}`}>{player.assists}</div>
                    </div>
                  </div>
                ))}
                {players.length === 0 && (
                  <div className="p-8 text-center text-brand-text-secondary text-sm font-bold normal-case flex flex-col items-center justify-center gap-2">
                    <span className="opacity-50 text-brand-text-secondary"><GiCrown size={48} /></span>
                    <span>Nenhum jogador registrado ainda.</span>
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
                          className={`p-5 transition-all ${isPrintMode ? 'bg-white border-zinc-300 border rounded-none' : 'rounded-[2rem] border bg-gradient-to-br from-zinc-100 to-zinc-200 border-zinc-300 cursor-pointer hover:from-zinc-50 hover:to-zinc-100 shadow-sm'}`}>
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
                                <p className={`text-3xl font-black ${isPrintMode ? 'text-black' : 'text-zinc-900'}`}>
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
                        <div className={`p-5 transition-all ${isPrintMode ? 'bg-white border-zinc-300 border rounded-none' : 'rounded-[2rem] border bg-gradient-to-br from-red-50 to-red-100 border-red-200'}`}>
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
                            ? 'rounded-[2rem] border bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200'
                            : 'rounded-[2rem] border bg-gradient-to-br from-red-50 to-red-100 border-red-200'
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
                      <div className={`transition-all overflow-hidden ${isPrintMode ? 'bg-white border border-zinc-300 rounded-none' : 'rounded-[2rem] border bg-white border-zinc-200 shadow-sm'}`}>
                        <div className={`flex justify-between items-center ${isPrintMode ? 'border-b border-zinc-300 bg-zinc-100 p-2' : 'p-4 border-b bg-gradient-to-br from-zinc-50 to-zinc-100 border-zinc-200'}`}>
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
                      <div className={`transition-all overflow-hidden ${isPrintMode ? 'bg-white border border-zinc-300 rounded-none' : 'p-5 rounded-[2rem] border bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200'}`}>
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
                      <div className={`transition-all overflow-hidden ${isPrintMode ? 'bg-white border border-zinc-300 rounded-none' : 'p-5 rounded-[2rem] border bg-gradient-to-br from-red-50 to-red-100 border-red-200'}`}>
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
                      <div className="p-3 shadow-sm rounded-3xl bg-gradient-to-br from-zinc-100 to-zinc-200 border border-zinc-300 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Mensalidade</span>
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
                              className="w-16 bg-white border border-zinc-300 text-zinc-900 font-black text-sm rounded px-1 outline-none"
                            />
                          ) : (
                            <div 
                              onClick={() => {
                                setTempFee(monthlyFee.toString());
                                setIsEditingFee(true);
                              }}
                              className="text-base font-black text-zinc-900 cursor-pointer hover:opacity-80 transition-opacity"
                            >
                              R$ {monthlyFee},00
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <button onClick={() => setMonthlyFee(prev => prev + 1)} className="p-1 bg-white text-zinc-800 border border-zinc-300 rounded shadow-sm hover:bg-zinc-50 transition-all"><Plus size={10} /></button>
                          <button onClick={() => setMonthlyFee(prev => Math.max(0, prev - 1))} className="p-1 bg-white text-zinc-800 border border-zinc-300 rounded shadow-sm hover:bg-zinc-50 transition-all"><Minus size={10} /></button>
                        </div>
                      </div>

                      <div className="p-3 shadow-sm rounded-3xl bg-gradient-to-br from-zinc-100 to-zinc-200 border border-zinc-300 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Ano Selecionado</span>
                          <select 
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            className="bg-transparent text-base font-black text-zinc-900 outline-none cursor-pointer"
                          >
                            {availableYears.map(y => (
                              <option key={y} value={y} className="bg-white text-zinc-900">{y}</option>
                            ))}
                          </select>
                        </div>
                        <button 
                          onClick={addYear}
                          className="w-7 h-7 rounded-lg bg-[#1E3D2F] text-white flex items-center justify-center hover:bg-[#2F5D4B] transition-all active:scale-90"
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
                          <tr className={`${isPrintMode ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-200 text-zinc-900'} font-black uppercase tracking-tighter`}>
                            <th className={`p-1.5 text-left border ${isPrintMode ? 'border-zinc-300' : 'border-zinc-300 rounded-tl-xl sticky left-0 z-10 bg-zinc-200'}`}>Nome</th>
                            <th className={`p-1.5 text-center border ${isPrintMode ? 'border-zinc-300' : 'border-zinc-300'}`} colSpan={12}>{selectedYear} (R$ {monthlyFee},00)</th>
                            <th className={`p-1.5 text-center border ${isPrintMode ? 'border-zinc-300' : 'border-zinc-300 rounded-tr-xl'}`}>Dívida</th>
                          </tr>
                          <tr className={`${isPrintMode ? 'bg-zinc-50 text-zinc-700' : 'bg-zinc-100 text-zinc-800'} font-bold uppercase tracking-tighter`}>
                            <th className={`border ${isPrintMode ? 'border-zinc-300' : 'border-zinc-300 sticky left-0 z-10 bg-zinc-100'}`}></th>
                            {MONTHS.map(month => (
                              <th key={month} className={`p-0.5 border ${isPrintMode ? 'border-zinc-300' : 'border-zinc-300'}`}>{month}</th>
                            ))}
                            <th className={`border ${isPrintMode ? 'border-zinc-300' : 'border-zinc-300'}`}></th>
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

          {currentScreen === 'org-pro' && (
            <motion.div 
              key="org-pro"
              initial={{ opacity: 0, x: swipeDirection * 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: swipeDirection * -20 }}
              transition={{ duration: 0.2 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={(_, info) => {
                if (info.offset.x > 100) {
                  const screens: Screen[] = ['players', 'teams', 'ranking', 'finance', 'org-pro'];
                  const currentIndex = screens.indexOf(currentScreen);
                  setSwipeDirection(-1);
                  setCurrentScreen(screens[currentIndex - 1]);
                }
              }}
              className="px-6 pb-24 pt-4 space-y-6 min-h-full bg-white flex flex-col"
            >
              <div className="max-w-5xl mx-auto w-full space-y-6">
                  <div className="bg-gradient-to-br from-[#1E3D2F] to-[#14301F] p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      {orgProTab === 'painel' ? <PiUsersBold size={120} /> : <GiCrown size={120} />}
                    </div>
                    
                    <div className="flex bg-white/10 p-1 rounded-2xl mb-6 w-full sm:w-fit backdrop-blur-md relative z-10 border border-white/10 overflow-x-auto custom-scrollbar no-scrollbar">
                      <button 
                        onClick={() => setOrgProTab('painel')}
                        className={`shrink-0 sm:px-6 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${orgProTab === 'painel' ? 'bg-[#E3D39E] text-emerald-950 shadow-sm' : 'text-white/70 hover:text-white'}`}
                      >
                        Painel Geral
                      </button>
                      <button 
                        onClick={() => setOrgProTab('acesso')}
                        className={`shrink-0 sm:px-6 px-4 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${orgProTab === 'acesso' ? 'bg-[#E3D39E] text-emerald-950 shadow-sm' : 'text-white/70 hover:text-white'}`}
                      >
                        Acesso & Links
                      </button>
                      <button 
                        onClick={() => setOrgProTab('confirmados')}
                        className={`shrink-0 sm:px-6 px-4 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${orgProTab === 'confirmados' ? 'bg-[#E3D39E] text-emerald-950 shadow-sm' : 'text-white/70 hover:text-white'}`}
                      >
                        Confirmados
                      </button>
                      <button 
                        onClick={() => setOrgProTab('admins')}
                        className={`shrink-0 sm:px-6 px-4 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${orgProTab === 'admins' ? 'bg-[#E3D39E] text-emerald-950 shadow-sm' : 'text-white/70 hover:text-white'}`}
                      >
                        Admins
                      </button>
                      <button 
                        onClick={() => setOrgProTab('supabase')}
                        className={`shrink-0 sm:px-6 px-4 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${orgProTab === 'supabase' ? 'bg-[#E3D39E] text-emerald-950 shadow-sm' : 'text-white/70 hover:text-white'}`}
                      >
                        Supabase
                      </button>
                    </div>


                  {orgProTab === 'acesso' && (
                    <>
                      <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-2 mb-2 relative z-10">
                        <span className="text-[#E3D39E]">
                          <GiCrown size={24} />
                        </span>
                        Organização Pro
                      </h2>
                      <p className="text-xs text-white/60 mb-6 max-w-[80%] uppercase tracking-widest font-bold leading-relaxed relative z-10">
                        Gerencie o acesso à pelada e gere o link de presença para o grupo de WhatsApp.
                      </p>
                      
                      <button
                        onClick={() => {
                          const baseUrl = window.location.origin + window.location.pathname;
                          const authObj = Object.fromEntries(
                            Object.entries(orgProData).map(([pid, data]: [string, any]) => [pid, data.code])
                          );
                          const authStr = btoa(JSON.stringify(authObj));
                          const link = `${baseUrl}?group=${groupId}&presence=true&org=${authStr}`;
                          navigator.clipboard.writeText(link);
                          setToast({ message: 'Link de presença copiado!', type: 'success' });
                          setTimeout(() => setToast(null), 3000);
                        }}
                        className="w-full bg-[#E3D39E] text-black font-black uppercase tracking-widest py-4 rounded-xl shadow-lg hover:bg-white active:scale-95 transition-all text-xs flex items-center justify-center gap-2 relative z-10"
                      >
                        <ClipboardPaste size={18} />
                        Copiar Link do Formulário
                      </button>

                      <div className="mt-8 pt-8 border-t border-white/10 relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                          <UserPlus size={16} className="text-[#E3D39E]" />
                          <h3 className="text-[11px] font-black uppercase tracking-widest text-[#E3D39E]">Cadastrar Novo Administrador</h3>
                        </div>
                        <div className="flex gap-2">
                          <input 
                            type="email" 
                            placeholder="E-mail do administrador..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#E3D39E] transition-colors"
                            onKeyDown={async (e) => {
                              if (e.key === 'Enter') {
                                const email = e.currentTarget.value;
                                if (email.includes('@')) {
                                  const { error } = await supabase.from('app_admins').insert({ email, group_id: groupId });
                                  if (error) {
                                    setToast({ message: "Erro ao cadastrar admin", type: 'warning' });
                                  } else {
                                    setToast({ message: "Administrador cadastrado!", type: 'success' });
                                    e.currentTarget.value = '';
                                  }
                                  setTimeout(() => setToast(null), 3000);
                                }
                              }
                            }}
                          />
                        </div>
                        <p className="text-[9px] font-bold text-white/30 uppercase mt-2 tracking-widest">
                          Apenas e-mails válidos podem ser administradores.
                        </p>
                      </div>
                    </>
                  )}

                  {orgProTab === 'painel' && (
                    <>
                      <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-2 mb-2 relative z-10">
                        <span className="text-[#E3D39E]">
                          <PiUsersBold size={24} />
                        </span>
                        Painel de Controle
                      </h2>
                      <p className="text-xs text-white/60 mb-6 max-w-[80%] uppercase tracking-widest font-bold leading-relaxed relative z-10">
                        Visão geral das estatísticas e presença dos jogadores.
                      </p>

                      <AnimatePresence>
                        {panelModal && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                            onClick={() => setPanelModal(null)}
                          >
                            <motion.div 
                              initial={{ scale: 0.9, opacity: 0, y: 20 }}
                              animate={{ scale: 1, opacity: 1, y: 0 }}
                              exit={{ scale: 0.9, opacity: 0, y: 20 }}
                              className="bg-zinc-900 border border-white/10 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden text-white"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <div>
                                  <h3 className="text-xl font-black uppercase tracking-widest text-[#E3D39E]">
                                    {panelModal === 'cadastrados' && 'Jogadores Cadastrados'}
                                    {panelModal === 'externos' && 'Cadastros Externos'}
                                    {panelModal === 'assist' && 'Assistências'}
                                    {panelModal === 'confirmados' && 'Confirmados'}
                                    {panelModal === 'admins' && 'Administradores'}
                                  </h3>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1">Detalhes do Grupo {groupId}</p>
                                </div>
                                <button 
                                  onClick={() => setPanelModal(null)}
                                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                                >
                                  <PiXBold size={20} />
                                </button>
                              </div>

                              <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                <div className="space-y-3">
                                  {panelModal === 'cadastrados' && players.map(p => (
                                    <div key={p.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                                      <div className="w-10 h-10 rounded-full bg-black border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                                        {p.photo ? <img src={p.photo} className="w-full h-full object-cover" /> : <User size={20} className="text-white/20" />}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm font-black text-white uppercase truncate">{p.name}</div>
                                        <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest">ID: {p.id.split('-')[0]}</div>
                                      </div>
                                    </div>
                                  ))}

                                  {panelModal === 'externos' && jogadoresExternos.map(item => (
                                    <div key={item.id} className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 space-y-2">
                                      <div className="flex items-center justify-between">
                                        <div className="text-sm font-black text-purple-400 uppercase">{item.full_name}</div>
                                        <span className="text-[9px] font-black bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full uppercase tracking-widest">Externo</span>
                                      </div>
                                      <div className="text-[10px] font-bold text-white/50">EMAIL: {item.email}</div>
                                      <div className="text-[10px] font-bold text-white/40 uppercase">DATA: {new Date(item.created_at).toLocaleDateString()}</div>
                                    </div>
                                  ))}

                                  {panelModal === 'assist' && [...players].sort((a, b) => (b.assists || 0) - (a.assists || 0)).map((p, idx) => (
                                    <div key={p.id} className="flex items-center gap-4 p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                      <div className="w-8 h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center text-[11px] font-black shrink-0">
                                        #{idx + 1}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm font-black text-white uppercase truncate">{p.name}</div>
                                      </div>
                                      <div className="text-base font-black text-blue-400">{p.assists || 0}</div>
                                    </div>
                                  ))}

                                  {panelModal === 'confirmados' && (
                                    <>
                                      <div className="text-[10px] font-black uppercase tracking-widest text-[#E3D39E]/40 mb-2">Fixos ({players.filter(p => p.isAvailable).length})</div>
                                      {players.filter(p => p.isAvailable).map(p => (
                                        <div key={p.id} className="flex items-center gap-4 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                          <div className="w-8 h-8 rounded-full bg-black border border-emerald-500/30 overflow-hidden shrink-0 flex items-center justify-center">
                                            {p.photo ? <img src={p.photo} className="w-full h-full object-cover" /> : <User size={16} className="text-emerald-500/50" />}
                                          </div>
                                          <div className="text-sm font-black text-emerald-400 uppercase flex-1 truncate">{p.name}</div>
                                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        </div>
                                      ))}
                                      
                                      {presencasExternas.length > 0 && (
                                        <>
                                          <div className="text-[10px] font-black uppercase tracking-widest text-[#E3D39E]/40 mt-4 mb-2">Convidados ({presencasExternas.length})</div>
                                          {presencasExternas.map(p => (
                                            <div key={p.id} className="flex items-center gap-4 p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                                              <div className="w-8 h-8 rounded-full bg-black border border-purple-500/30 flex items-center justify-center shrink-0 text-purple-400">
                                                <PiUserCirclePlus size={20} />
                                              </div>
                                              <div className="text-sm font-black text-purple-400 uppercase flex-1 truncate">{p.player_name}</div>
                                              <div className="text-[9px] font-black bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full uppercase tracking-widest font-mono">OK</div>
                                            </div>
                                          ))}
                                        </>
                                      )}
                                    </>
                                  )}

                                  {panelModal === 'admins' && appAdmins.map(admin => (
                                    <div key={admin.id} className="flex items-center gap-4 p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                                      <div className="w-10 h-10 rounded-full bg-black border border-rose-500/30 flex items-center justify-center shrink-0">
                                        <div className="text-rose-400">
                                          <PiShieldCheckFill size={20} />
                                        </div>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm font-black text-rose-400 uppercase truncate">{admin.email}</div>
                                        <div className="text-[9px] font-bold text-rose-400/40 uppercase tracking-widest">ADMINISTRADOR</div>
                                      </div>
                                    </div>
                                  ))}

                                  {((panelModal === 'cadastrados' && players.length === 0) || 
                                    (panelModal === 'externos' && jogadoresExternos.length === 0) ||
                                    (panelModal === 'admins' && appAdmins.length === 0)) && (
                                    <div className="text-center py-12">
                                      <div className="text-white/10 mb-4 flex justify-center">
                                        <PiUsersBold size={48} />
                                      </div>
                                      <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Nenhum registro encontrado</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="p-8 bg-white/[0.02] border-t border-white/5">
                                <button 
                                  onClick={() => setPanelModal(null)}
                                  className="w-full py-4 bg-[#E3D39E] text-emerald-950 font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl hover:bg-[#D4C38E] transition-all active:scale-95"
                                >
                                  Fechar Detalhes
                                </button>
                              </div>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-6 relative z-10">
                        <button 
                          onClick={() => setPanelModal('cadastrados')}
                          className="bg-white/10 hover:bg-white/20 transition-all backdrop-blur-md rounded-2xl p-4 border border-white/10 text-left group"
                        >
                          <div className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1 group-hover:text-white transition-colors">Cadastrados</div>
                          <div className="text-3xl font-black">{players.length}</div>
                        </button>

                        <button 
                          onClick={() => setPanelModal('confirmados')}
                          className="bg-emerald-500/20 hover:bg-emerald-500/30 transition-all backdrop-blur-md rounded-2xl p-4 border border-emerald-500/20 text-left group"
                        >
                          <div className="text-emerald-300/70 text-[10px] font-black uppercase tracking-widest mb-1 group-hover:text-emerald-300 transition-colors">Confirmados</div>
                          <div className="text-3xl font-black text-emerald-400">
                            {players.filter(p => p.isAvailable).length + presencasExternas.length}
                          </div>
                        </button>

                        <button 
                          onClick={() => setPanelModal('externos')}
                          className="bg-purple-500/20 hover:bg-purple-500/30 transition-all backdrop-blur-md rounded-2xl p-4 border border-purple-500/20 text-left group"
                        >
                          <div className="text-purple-300/70 text-[10px] font-black uppercase tracking-widest mb-1 group-hover:text-purple-300 transition-colors">Cadastros Externos</div>
                          <div className="text-3xl font-black text-purple-400">{jogadoresExternos.length}</div>
                        </button>

                        <button 
                          onClick={() => setPanelModal('assist')}
                          className="bg-blue-500/20 hover:bg-blue-500/30 transition-all backdrop-blur-md rounded-2xl p-4 border border-blue-500/20 text-left group"
                        >
                          <div className="text-blue-300/70 text-[10px] font-black uppercase tracking-widest mb-1 group-hover:text-blue-300 transition-colors">Total Assist.</div>
                          <div className="text-3xl font-black text-blue-400">{players.reduce((acc, p) => acc + (p.assists || 0), 0)}</div>
                        </button>

                        <button 
                          onClick={() => setPanelModal('admins')}
                          className="bg-rose-500/20 hover:bg-rose-500/30 transition-all backdrop-blur-md rounded-2xl p-4 border border-rose-500/20 text-left group"
                        >
                          <div className="text-rose-300/70 text-[10px] font-black uppercase tracking-widest mb-1 group-hover:text-rose-300 transition-colors">Administrador</div>
                          <div className="text-3xl font-black text-rose-400">{appAdmins.length}</div>
                        </button>

                        <div className="bg-amber-500/20 backdrop-blur-md rounded-2xl p-4 border border-amber-500/20 col-span-2 sm:col-span-1">
                          <div className="text-amber-300/70 text-[10px] font-black uppercase tracking-widest mb-1">PIN Master</div>
                          <input 
                            type="text" 
                            maxLength={6}
                            value={adminPin}
                            onChange={(e) => setAdminPin(e.target.value.replace(/\D/g, ''))}
                            onBlur={async () => {
                              if (adminPin && adminPin.length === 6) {
                                const { error } = await supabase.from('groups').update({ admin_pin: adminPin }).eq('id', groupId);
                                if (!error) {
                                  setToast({ message: "PIN do Administrador salvo!", type: 'success' });
                                } else {
                                  setToast({ message: "Erro ao salvar PIN", type: 'warning' });
                                }
                                setTimeout(() => setToast(null), 2000);
                              }
                            }}
                            placeholder="------"
                            className="w-full bg-transparent text-2xl font-black text-amber-400 font-mono tracking-widest focus:outline-none placeholder:text-amber-400/20"
                          />
                        </div>
                        <div className="bg-blue-500/20 backdrop-blur-md rounded-2xl p-4 border border-blue-500/20">
                          <div className="text-blue-300/70 text-[10px] font-black uppercase tracking-widest mb-1">Total Assist.</div>
                          <div className="text-3xl font-black text-blue-400">{players.reduce((acc, p) => acc + (p.assists || 0), 0)}</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {orgProTab === 'acesso' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-black uppercase tracking-widest text-[#1E3D2F] flex items-center gap-2">
                         <PiUsersBold size={16} /> Chaves de Acesso
                      </h3>
                    </div>

                    <p className="text-[10px] uppercase font-bold text-zinc-500 mb-4 bg-zinc-100 p-3 rounded-xl border border-zinc-200">
                      Jogadores com a <span className="text-emerald-700">Mensalidade em Dia</span> marcam presença diretamente. Os demais precisarão confirmar seu acesso digitando a chave abaixo no momento da inscrição.
                    </p>

                    <div className="space-y-4 bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
                      <h4 className="text-sm font-bold text-[#1E3D2F] uppercase">Cadastrar Jogador e Telefone</h4>
                      <form 
                        className="flex flex-col sm:flex-row gap-3"
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const form = e.target as HTMLFormElement;
                          const nameInput = form.elements.namedItem('name') as HTMLInputElement;
                          const phoneInput = form.elements.namedItem('phone') as HTMLInputElement;
                          const isGuestInput = form.elements.namedItem('isGuest') as HTMLInputElement;
                          
                          const name = nameInput.value.trim();
                          let phone = phoneInput.value.trim();
                          const isGuest = isGuestInput.checked;
                          
                          if (!name) {
                            setToast({ message: 'Preencha o nome do jogador.', type: 'warning' });
                            return;
                          }

                          if (isGuest) {
                            phone = Math.floor(1000 + Math.random() * 9000).toString();
                          } else if (!phone) {
                            setToast({ message: 'Preencha o telefone ou marque como convidado.', type: 'warning' });
                            return;
                          }
                          
                          const newPlayerId = crypto.randomUUID();
                          setPlayers(prev => [...prev, { 
                            id: newPlayerId, 
                            name, 
                            photo: null, 
                            isAvailable: isGuest, // Set available if guest to add directly to Confirmados
                            arrivedAt: isGuest ? Date.now() : null 
                          }]);
                          
                          setOrgProData(prev => ({
                            ...prev,
                            [newPlayerId]: { code: phone, isGuest } // Store guest status
                          }));
                          
                          setToast({ message: isGuest ? `Convidado cadastrado! Chave PIN: ${phone}` : 'Jogador cadastrado!', type: 'success' });
                          form.reset();
                        }}
                      >
                        <div className="flex flex-col flex-1 gap-2">
                          <input 
                            type="text" 
                            name="name"
                            placeholder="Nome do Jogador" 
                            className="bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm font-bold focus:border-[#1E3D2F] outline-none"
                          />
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-500">
                            <input type="checkbox" name="isGuest" className="rounded" />
                            Marcar como Temporário (Convidado)
                          </label>
                        </div>
                        <input 
                          type="text" 
                          name="phone"
                          placeholder="Telefone (Chave)" 
                          className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm font-bold focus:border-[#1E3D2F] outline-none max-h-[38px]"
                        />
                        <button 
                          type="submit" 
                          className="bg-[#1E3D2F] text-white px-4 py-2 rounded-lg font-bold uppercase text-xs hover:bg-[#1E3D2F]/90 transition-all shrink-0 max-h-[38px]"
                        >
                          Cadastrar
                        </button>
                      </form>
                    </div>

                    <div className="space-y-3">
                      {players.filter(player => orgProData[player.id]).map(player => {
                        const isUpToDate = payments.find(p => p.playerId === player.id && p.year === (new Date().getFullYear()))?.months[MONTHS[new Date().getMonth()]] > 0;
                        return (
                          <div key={`org-pro-${player.id}`} className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4 group hover:border-[#1E3D2F]/20 transition-all">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center shrink-0">
                                {player.photo ? <img src={player.photo} className="w-full h-full object-cover" /> : <div className="text-black"><IoPersonOutline size={16}/></div>}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold truncate text-[#1E3D2F] uppercase">{player.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  {isUpToDate ? (
                                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest">Acesso Direto</span>
                                  ) : (
                                    <span className="bg-amber-100 text-amber-800 text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest">Exige Chave</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex-1 w-full sm:max-w-[200px] shrink-0 mt-2 sm:mt-0">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Telefone ou PIN</label>
                              <input
                                type="text"
                                placeholder="Ex: 8299999999"
                                value={orgProData[player.id]?.code || ''}
                                onChange={(e) => {
                                  setOrgProData(prev => ({ ...prev, [player.id]: { code: e.target.value } }));
                                }}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm font-bold focus:border-[#1E3D2F] focus:ring-1 focus:ring-[#1E3D2F] outline-none transition-all placeholder:font-normal placeholder:opacity-50"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {orgProTab === 'painel' && (
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                      <h3 className="text-sm font-black uppercase tracking-widest text-[#1E3D2F] flex items-center gap-2 mb-4">
                        Configurações de Exigência
                      </h3>
                      <p className="text-[10px] uppercase font-bold text-zinc-500 mb-6 bg-zinc-100 p-3 rounded-xl border border-zinc-200">
                        Defina os critérios para que os jogadores adicionados apareçam na lista de "Gerenciar Jogadores".
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Quantidade Máx. Ausências</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="Ilimitado"
                            value={tempOrgProSettings.maxAbsences ?? ''}
                            onChange={(e) => setTempOrgProSettings(prev => ({ ...prev, maxAbsences: e.target.value ? parseInt(e.target.value) : null }))}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm font-bold focus:border-[#1E3D2F] outline-none transition-all"
                          />
                        </div>

                        <div className="space-y-2 flex flex-col justify-end">
                          <label className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 cursor-pointer hover:bg-zinc-100 transition-colors h-full">
                            <input
                              type="checkbox"
                              checked={tempOrgProSettings.requirePaymentUpToDate}
                              onChange={(e) => setTempOrgProSettings(prev => ({ ...prev, requirePaymentUpToDate: e.target.checked }))}
                              className="w-4 h-4 text-[#1E3D2F] rounded focus:ring-[#1E3D2F]"
                            />
                            <span className="text-xs font-bold text-[#1E3D2F] uppercase tracking-tight">Exigir Mensalidade em Dia</span>
                          </label>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Dia da Pelada</label>
                          <select
                            value={tempOrgProSettings.matchDayOfWeek ?? ''}
                            onChange={(e) => setTempOrgProSettings(prev => ({ ...prev, matchDayOfWeek: e.target.value ? parseInt(e.target.value) : null }))}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm font-bold focus:border-[#1E3D2F] outline-none transition-all"
                          >
                            <option value="">Não definido</option>
                            <option value="0">Domingo</option>
                            <option value="1">Segunda-feira</option>
                            <option value="2">Terça-feira</option>
                            <option value="3">Quarta-feira</option>
                            <option value="4">Quinta-feira</option>
                            <option value="5">Sexta-feira</option>
                            <option value="6">Sábado</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Horário da Pelada</label>
                          <input
                            type="time"
                            value={tempOrgProSettings.matchTime || ''}
                            onChange={(e) => setTempOrgProSettings(prev => ({ ...prev, matchTime: e.target.value }))}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm font-bold focus:border-[#1E3D2F] outline-none transition-all"
                          />
                        </div>

                        <div className="col-span-1 sm:col-span-2 pt-2">
                          <button
                            onClick={() => {
                              setOrgProSettings({ ...tempOrgProSettings, appliedDate: Date.now() });
                              setToast({ message: 'Exigências aplicadas com sucesso!', type: 'success' });
                            }}
                            className="w-full py-4 bg-[#1E3D2F] text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg hover:bg-[#14301F] transition-all active:scale-95 flex items-center justify-center gap-2"
                          >
                            <IoCheckmarkCircle size={18} />
                            Aplicar Exigências
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                      <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                          <tr className="bg-zinc-50 border-b border-zinc-200">
                            <th className="p-4 text-xs font-black uppercase tracking-widest text-[#1E3D2F]">Jogador</th>
                            <th className="p-4 text-xs font-black uppercase tracking-widest text-[#1E3D2F] text-center">Status</th>
                            <th className="p-4 text-xs font-black uppercase tracking-widest text-[#1E3D2F] text-center">Ranking</th>
                            <th className="p-4 text-xs font-black uppercase tracking-widest text-[#1E3D2F] text-center">Gols</th>
                            <th className="p-4 text-xs font-black uppercase tracking-widest text-[#1E3D2F] text-center">Assist.</th>
                            <th className="p-4 text-xs font-black uppercase tracking-widest text-[#1E3D2F] text-center">Mensalidade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...players]
                            .sort((a,b) => {
                              // Sort by ranking (goals + assists) descending, then name
                              const aScore = (a.goals || 0) + (a.assists || 0);
                              const bScore = (b.goals || 0) + (b.assists || 0);
                              if (bScore !== aScore) return bScore - aScore;
                              return a.name.localeCompare(b.name);
                            })
                            .map((player, index) => {
                              const isUpToDate = payments.find(p => p.playerId === player.id && p.year === (new Date().getFullYear()))?.months[MONTHS[new Date().getMonth()]] > 0;
                              
                              return (
                                <tr key={`dash-${player.id}`} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50 transition-colors">
                                  <td className="p-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center shrink-0">
                                        {player.photo ? <img src={player.photo} className="w-full h-full object-cover" /> : <div className="text-zinc-400"><IoPersonOutline size={14}/></div>}
                                      </div>
                                      <span className="font-bold text-sm text-[#1E3D2F] uppercase">{player.name}</span>
                                    </div>
                                  </td>
                                  <td className="p-4 text-center">
                                    {player.isAvailable ? (
                                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2 py-1 rounded-md tracking-widest border border-emerald-200">
                                        Presente
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 bg-zinc-100 text-zinc-500 text-[10px] font-black uppercase px-2 py-1 rounded-md tracking-widest border border-zinc-200">
                                        Ausente
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-4 text-center">
                                    <span className="font-black text-[#1E3D2F]">
                                      {index + 1}º
                                    </span>
                                  </td>
                                  <td className="p-4 text-center">
                                    <span className="font-bold text-amber-600">{player.goals || 0}</span>
                                  </td>
                                  <td className="p-4 text-center">
                                    <span className="font-bold text-blue-600">{player.assists || 0}</span>
                                  </td>
                                  <td className="p-4 text-center">
                                    {isUpToDate ? (
                                      <span className="inline-flex items-center gap-1 text-emerald-600 font-black text-xs uppercase tracking-widest">
                                        <IoCheckmarkCircle size={14} /> Em Dia
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-red-500 font-bold text-xs uppercase tracking-widest">
                                        <PiWarningCircleBold size={14} /> Pendente
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                          })}
                          {players.length === 0 && (
                            <tr>
                              <td colSpan={6} className="p-8 text-center text-zinc-500 text-sm font-bold">
                                Nenhum jogador cadastrado.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                )}
                
                {orgProTab === 'supabase' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-black uppercase tracking-widest text-[#1E3D2F] flex items-center gap-2">
                        <Database size={16} /> Status da Conexão Cloud
                      </h3>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-zinc-200 p-8 shadow-sm space-y-8">
                      <div className="flex items-center justify-between p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                            <Wifi size={24} />
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-[#1E3D2F] uppercase tracking-tighter">Supabase Ativo</h4>
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Sincronização em tempo real</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Online</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">URL do Projeto</label>
                          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 flex items-center justify-between">
                            <span className="text-xs font-mono text-zinc-500 truncate mr-4">
                              {import.meta.env.VITE_SUPABASE_URL?.replace(/(.{10}).*(.{5})/, '$1***$2') || 'Definido no Ambiente'}
                            </span>
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Chave Anon (Token)</label>
                          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 flex items-center justify-between">
                            <span className="text-xs font-mono text-zinc-500">
                              ********************************{import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(-5) || '****'}
                            </span>
                            <div className="text-zinc-300">
                              <PiLockFill size={16} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-zinc-100">
                        <div className="bg-zinc-900 text-white p-6 rounded-3xl space-y-4 shadow-xl">
                          <div className="flex items-center gap-3">
                            <div className="text-emerald-400">
                              <PiShieldCheckFill size={24} />
                            </div>
                            <h4 className="text-sm font-black uppercase tracking-widest">Segurança de Dados</h4>
                          </div>
                          <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
                            Seus dados estão protegidos por criptografia de ponta a ponta e regras de segurança (RLS) que garantem que apenas administradores autorizados do grupo <span className="text-white font-bold">{groupId}</span> possam acessar ou modificar as informações.
                          </p>
                          <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                              <div className="text-[10px] font-black text-emerald-400 uppercase mb-1">Backup</div>
                              <div className="text-[10px] font-bold text-white uppercase">Automático</div>
                            </div>
                            <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                              <div className="text-[10px] font-black text-amber-400 uppercase mb-1">Sync</div>
                              <div className="text-[10px] font-bold text-white uppercase">Pritioritário</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <button 
                          onClick={() => {
                            setToast({ message: "Sincronização forçada iniciada...", type: 'info' });
                            setTimeout(() => {
                              window.location.reload();
                            }, 1000);
                          }}
                          className="w-full py-4 bg-zinc-100 text-[#1E3D2F] font-black uppercase tracking-widest text-[11px] rounded-[20px] transition-all hover:bg-zinc-200 active:scale-95"
                        >
                          Sincronizar Manualmente
                        </button>
                        <p className="text-[9px] font-bold text-zinc-400 text-center uppercase tracking-widest">
                          A sincronização ocorre automaticamente a cada alteração.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {orgProTab === 'admins' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-black uppercase tracking-widest text-[#1E3D2F] flex items-center gap-2">
                        <UserPlus size={16} /> Gestão de Administradores
                      </h3>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-zinc-200 p-6 shadow-sm space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">E-mail do Novo Admin</label>
                        <div className="flex gap-2">
                          <input 
                            type="email" 
                            id="new-admin-email"
                            placeholder="exemplo@email.com"
                            className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1E3D2F] transition-colors"
                          />
                          <button 
                            onClick={async () => {
                              const input = document.getElementById('new-admin-email') as HTMLInputElement;
                              const email = input?.value;
                              if (email && email.includes('@')) {
                                const { error } = await supabase.from('app_admins').insert({ email, group_id: groupId });
                                if (error) {
                                  setToast({ message: "Erro ao cadastrar admin", type: 'warning' });
                                } else {
                                  setToast({ message: "Administrador cadastrado!", type: 'success' });
                                  input.value = '';
                                  // Refresh list
                                  const { data } = await supabase.from('app_admins').select('*').eq('group_id', groupId);
                                  if (data) setAppAdmins(data);
                                }
                                setTimeout(() => setToast(null), 3000);
                              }
                            }}
                            className="bg-[#1E3D2F] text-white px-6 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#14301F] transition-colors"
                          >
                            Cadastrar
                          </button>
                        </div>
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1 ml-1">
                          Apenas usuários com este e-mail poderão acessar via login.
                        </p>
                      </div>

                      <div className="pt-4 border-t border-zinc-100">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">Admins Cadastrados</h4>
                        <div className="space-y-2">
                          {appAdmins.map((admin) => (
                            <div key={admin.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                              <span className="text-sm font-bold text-[#1E3D2F]">{admin.email}</span>
                              <button 
                                onClick={async () => {
                                  const { error } = await supabase.from('app_admins').delete().eq('id', admin.id);
                                  if (!error) {
                                    setAppAdmins(prev => prev.filter(a => a.id !== admin.id));
                                    setToast({ message: "Admin removido", type: 'success' });
                                  }
                                  setTimeout(() => setToast(null), 3000);
                                }}
                                className="text-zinc-300 hover:text-red-500 transition-colors"
                              >
                                <PiTrash size={16} />
                              </button>
                            </div>
                          ))}
                          {appAdmins.length === 0 && (
                            <div className="text-center py-4 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                              Nenhum administrador cadastrado.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {orgProTab === 'confirmados' && (
                  <div className="space-y-4">

                    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden mb-8">
                      <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                          <thead>
                            <tr className="bg-zinc-50 border-b border-zinc-200">
                              <th colSpan={4} className="p-4 text-xs font-black uppercase tracking-widest text-[#1E3D2F]">
                                Jogadores Internos (App)
                              </th>
                            </tr>
                            <tr className="border-b border-zinc-200">
                              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 w-12 text-center">#</th>
                              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Jogador</th>
                              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Tipo</th>
                              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Horário</th>
                            </tr>
                          </thead>
                          <tbody>
                            {players
                              .filter(player => player.isAvailable)
                              .sort((a, b) => (a.arrivedAt || 0) - (b.arrivedAt || 0))
                              .map((player, index) => {
                                const isGuest = orgProData[player.id]?.isGuest;
                                const code = orgProData[player.id]?.code;
                                
                                return (
                                  <tr key={`confirmed-${player.id}`} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50 transition-colors">
                                    <td className="p-4 text-center">
                                      <span className="text-xs font-black text-zinc-400">{index + 1}</span>
                                    </td>
                                    <td className="p-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center shrink-0">
                                          {player.photo ? <img src={player.photo} className="w-full h-full object-cover" /> : <div className="text-zinc-400"><IoPersonOutline size={14}/></div>}
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="font-bold text-sm text-[#1E3D2F] uppercase">{player.name}</span>
                                          {isGuest && code && (
                                            <span className="text-[10px] font-bold text-zinc-500">PIN Original: {code}</span>
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="p-4 text-center">
                                      {isGuest ? (
                                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-black uppercase px-2 py-1 rounded-md tracking-widest border border-amber-200">
                                          Convidado
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2 py-1 rounded-md tracking-widest border border-emerald-200">
                                          Mensalista
                                        </span>
                                      )}
                                    </td>
                                    <td className="p-4 text-right">
                                      {player.arrivedAt ? (
                                        <span className="text-xs font-bold text-zinc-600">
                                          {new Date(player.arrivedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                      ) : (
                                        <span className="text-xs font-bold text-zinc-400">-</span>
                                      )}
                                    </td>
                                  </tr>
                                );
                            })}
                            {players.filter(p => p.isAvailable).length === 0 && (
                              <tr>
                                <td colSpan={4} className="p-8 text-center text-zinc-500 text-sm font-bold">
                                  Nenhum jogador confirmado no App ainda.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Presenças Externas (Tabela do Formulário) */}
                    <div className="bg-white rounded-2xl border border-purple-200 shadow-sm overflow-hidden mb-8">
                      <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                          <thead>
                            <tr className="bg-purple-50 border-b border-purple-200">
                              <th colSpan={4} className="p-4 text-xs font-black uppercase tracking-widest text-purple-900 flex items-center gap-2">
                                <Globe size={14} /> Presenças (Formulário Externo)
                              </th>
                            </tr>
                            <tr className="border-b border-purple-100">
                              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-purple-500 w-12 text-center">#</th>
                              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-purple-500">Nome</th>
                              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-purple-500 text-center">Status</th>
                              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-purple-500 text-right">Confirmado em</th>
                            </tr>
                          </thead>
                          <tbody>
                            {presencasExternas.map((p, idx) => (
                              <tr key={`pres-ext-${p.id}`} className="border-b border-zinc-50 last:border-0 hover:bg-purple-50/20 transition-colors">
                                <td className="p-4 text-center">
                                  <span className="text-xs font-black text-purple-300">{idx + 1}</span>
                                </td>
                                <td className="p-4">
                                  <div className="flex flex-col">
                                    <span className="font-bold text-sm text-purple-900 uppercase">{p.nome}</span>
                                    <span className="text-[10px] text-purple-400 font-mono">{p.telefone}</span>
                                  </div>
                                </td>
                                <td className="p-4 text-center">
                                  {p.mensalidade_em_dia ? (
                                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase px-2 py-1 rounded-md tracking-widest border border-emerald-200">Pago</span>
                                  ) : (
                                    <span className="bg-amber-100 text-amber-800 text-[9px] font-black uppercase px-2 py-1 rounded-md tracking-widest border border-amber-200">Pendente</span>
                                  )}
                                </td>
                                <td className="p-4 text-right font-bold text-purple-600 text-xs">
                                  {new Date(p.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </td>
                              </tr>
                            ))}
                            {presencasExternas.length === 0 && (
                              <tr>
                                <td colSpan={4} className="p-8 text-center text-purple-300 text-sm font-bold">Nenhuma presença externa confirmada.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Jogadores Cadastrados Externamente */}
                    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                      <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                          <thead>
                            <tr className="bg-zinc-100 border-b border-zinc-200">
                              <th colSpan={4} className="p-4 text-xs font-black uppercase tracking-widest text-zinc-900 flex items-center gap-2">
                                <Users size={14} /> Cadastros Totais (Link Externo)
                              </th>
                            </tr>
                            <tr className="border-b border-zinc-100">
                              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 w-12 text-center">#</th>
                              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Jogador</th>
                              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Situação</th>
                              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Data Cadastro</th>
                            </tr>
                          </thead>
                          <tbody>
                            {jogadoresExternos.map((j, idx) => (
                              <tr key={`jog-ext-${j.id}`} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 transition-colors">
                                <td className="p-4 text-center">
                                  <span className="text-xs font-black text-zinc-300">{idx + 1}</span>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center shrink-0">
                                      {j.foto_url ? <img src={j.foto_url} className="w-full h-full object-cover" /> : <div className="text-zinc-400"><IoPersonOutline size={14}/></div>}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="font-bold text-sm text-zinc-900 uppercase">{j.nome}</span>
                                      <span className="text-[10px] text-zinc-400 font-mono">{j.telefone}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4 text-center">
                                  {j.mensalidade_em_dia ? 
                                    <span className="text-emerald-600 font-black text-[9px] uppercase">Liberado</span> : 
                                    <span className="text-amber-600 font-bold text-[9px] uppercase">Bloqueado</span>
                                  }
                                </td>
                                <td className="p-4 text-right text-zinc-400 text-xs">
                                  {new Date(j.created_at).toLocaleDateString('pt-BR')}
                                </td>
                              </tr>
                            ))}
                            {jogadoresExternos.length === 0 && (
                              <tr>
                                <td colSpan={4} className="p-8 text-center text-zinc-400 text-sm font-bold">Nenhum jogador cadastrado externamente.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
          </motion.div>
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

        {/* Floating Multi-select Bar */}
        <AnimatePresence>
          {movingPlayers && !isSelectingDestination && movingPlayers.playerIds.length > 0 && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-24 left-0 right-0 px-4 z-[100] flex justify-center pointer-events-none"
            >
              <div className="bg-brand-card/95 backdrop-blur-md border border-brand-primary/50 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-full p-2 flex items-center gap-3 pointer-events-auto">
                <div className="px-4 text-sm font-bold text-brand-text-primary">
                  {movingPlayers.playerIds.length} selecionado{movingPlayers.playerIds.length > 1 ? 's' : ''}
                </div>
                <button
                  onClick={() => {
                    setIsSelectingDestination(true);
                    setToast({ message: "Selecione o time de destino (apenas times incompletos).", type: 'info' });
                  }}
                  className="px-6 py-2 bg-brand-primary text-black rounded-full font-black uppercase text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow shadow-brand-primary/20"
                >
                  <MoveRight size={16} /> Mover
                </button>
                <button
                  onClick={() => { setMovingPlayers(null); setIsSelectingDestination(false); }}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
            className="fixed inset-0 bg-black/0 backdrop-blur-none z-[200] flex items-center justify-center p-4"
            onClick={() => setShowPlayerActionsModal(null)}
          >
              <motion.div 
                initial={{ scale: 0.9, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 30, opacity: 0 }}
                className="w-full max-w-[320px] rounded-[32px] overflow-hidden shadow-2xl bg-zinc-50 border border-zinc-200"
                onClick={e => e.stopPropagation()}
              >
                {/* Header */}
                <div className="bg-gradient-to-br from-zinc-300 via-zinc-400 to-zinc-600 p-10 text-center relative overflow-hidden">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-10 -mt-10 blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-10 -mb-10 blur-xl" />
                  
                  <div className="w-20 h-20 mx-auto rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-black/5 shadow-xl relative z-10 mb-6">
                      {players.find(p => p.id === showPlayerActionsModal.playerId)?.photo ? (
                        <img 
                          src={players.find(p => p.id === showPlayerActionsModal.playerId)?.photo} 
                          alt="Player" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-zinc-200 flex items-center shrink-0"><User size={40} /></span>
                      )}
                  </div>

                  <h3 className="text-2xl font-black uppercase tracking-tighter text-black leading-none">
                    {players.find(p => p.id === showPlayerActionsModal.playerId)?.name}
                  </h3>
                  <p className="text-[10px] text-black/60 font-black mt-2 uppercase tracking-[0.2em]">
                    AÇÕES DO JOGADOR
                  </p>
                </div>
  
                {/* Actions Section */}
                <div className="p-3">
                  <div className="space-y-1.5">
                    {/* Primary Success Actions (Goal) */}
                    {!swappingPlayerId && (showPlayerActionsModal.teamIndex === match.teamAIndex || showPlayerActionsModal.teamIndex === match.teamBIndex) && (
                        <button 
                          onClick={() => {
                            if (!match.isActive || match.isPaused || match.scoreA >= match.config.goalLimit || match.scoreB >= match.config.goalLimit) return;
                            setShowAssistSelection({ teamIndex: showPlayerActionsModal.teamIndex, scorerId: showPlayerActionsModal.playerId });
                            setShowPlayerActionsModal(null);
                          }}
                          disabled={!match.isActive || match.isPaused || match.scoreA >= match.config.goalLimit || match.scoreB >= match.config.goalLimit}
                          className="w-full h-10 bg-emerald-600 text-white rounded-xl font-black uppercase text-[10px] flex items-center justify-between px-4 transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-500/10 group"
                        >
                          <div className="flex items-center gap-2">
                            <Trophy size={14} className="text-emerald-200 group-hover:scale-110 transition-transform" />
                            <span className="tracking-widest">Registrar Gol</span>
                          </div>
                          <Plus size={12} className="opacity-50" />
                        </button>
                    )}
  
                    {/* Swap Confirmation (Contextual) */}
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
                        className="w-full h-10 bg-amber-500 text-black rounded-xl font-black uppercase text-[10px] flex items-center justify-between px-4 transition-all hover:bg-amber-600 active:scale-[0.98] shadow-md shadow-amber-500/10 group"
                      >
                        <div className="flex items-center gap-2">
                          <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                          <span className="tracking-widest">Confirmar Troca</span>
                        </div>
                        <Check size={12} className="opacity-50" />
                      </button>
                    )}
  
                    {/* Action Grid */}
                    <div className="grid grid-cols-2 gap-1.5 mt-2">
                      {/* Substituir */}
                      {swappingPlayerId !== showPlayerActionsModal.playerId && (
                        <button 
                          onClick={() => {
                            setSwappingPlayerId(showPlayerActionsModal.playerId);
                            setTeamsTab('proximos');
                            setShowPlayerActionsModal(null);
                            setToast({ message: "Selecione outro jogador para trocar de posição.", type: 'info' });
                          }}
                          className="py-2.5 px-2 bg-white text-zinc-900 rounded-xl font-black uppercase text-[7px] flex flex-col items-center justify-center gap-1 transition-all hover:bg-zinc-50 active:scale-95 border border-zinc-200 hover:border-zinc-300 shadow-sm group"
                        >
                          <ArrowLeftRight size={14} className="text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                          Trocar
                        </button>
                      )}
  
                      {/* Mover */}
                      {!swappingPlayerId && (
                        <button 
                          onClick={() => {
                            setMovingPlayers({ teamId: teams[showPlayerActionsModal.teamIndex].id, playerIds: [showPlayerActionsModal.playerId] });
                            setIsSelectingDestination(true);
                            setTeamsTab('proximos');
                            setShowPlayerActionsModal(null);
                            setToast({ message: "Selecione o time de destino (apenas times incompletos).", type: 'info' });
                          }}
                          className="py-2.5 px-2 bg-white text-zinc-900 rounded-xl font-black uppercase text-[7px] flex flex-col items-center justify-center gap-1 transition-all hover:bg-zinc-50 active:scale-95 border border-zinc-200 hover:border-zinc-300 shadow-sm group"
                        >
                          <MoveRight size={14} className="text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                          Mover
                        </button>
                      )}
  
                      {/* Ausente */}
                      {!swappingPlayerId && (
                        <button 
                          onClick={() => {
                            const isPlayerInActiveMatch = match.isActive && [match.teamAIndex, match.teamBIndex].includes(showPlayerActionsModal.teamIndex);
                            
                            if (isPlayerInActiveMatch && !match.isPaused) {
                              setMatch(prev => ({ ...prev, isPaused: true }));
                            }
  
                            setTeams(prev => {
                              return prev.map(t => ({
                                ...t,
                                playerIds: t.playerIds.filter(id => id !== showPlayerActionsModal.playerId)
                              })).filter(t => t.playerIds.length > 0);
                            });
                            setPlayers(prev => prev.map(p => p.id === showPlayerActionsModal.playerId ? { ...p, isAvailable: false, arrivedAt: undefined } : p));
                            
                            if (isPlayerInActiveMatch) {
                              setFillingVacancyForTeam(showPlayerActionsModal.teamIndex);
                              setTeamsTab('proximos');
                              setToast({ message: "Selecione o jogador que entrará no lugar.", type: 'info' });
                            } else {
                              setToast({ message: "Jogador movido para ausentes.", type: 'info' });
                            }
                            
                            setShowPlayerActionsModal(null);
                          }}
                          className="py-2.5 px-2 bg-white text-red-600 rounded-xl font-black uppercase text-[7px] flex flex-col items-center justify-center gap-1 transition-all hover:bg-red-50 active:scale-95 border border-red-100 hover:border-red-200 shadow-sm group"
                        >
                          <LogOut size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                          Ausente
                        </button>
                      )}
  
                      {/* Cancel Swap Call */}
                      {swappingPlayerId === showPlayerActionsModal.playerId && (
                        <button 
                          onClick={() => {
                            setSwappingPlayerId(null);
                            setShowPlayerActionsModal(null);
                          }}
                          className="py-2.5 px-2 bg-white text-red-600 rounded-xl font-black uppercase text-[7px] flex flex-col items-center justify-center gap-1 transition-all hover:bg-red-50 active:scale-95 border border-red-100 hover:border-red-200 shadow-sm"
                        >
                          <X size={14} />
                          Cancelar
                        </button>
                      )}
  
                      <button 
                        onClick={() => setShowPlayerActionsModal(null)}
                        className="py-2.5 px-2 bg-zinc-200 text-zinc-600 rounded-xl font-black uppercase text-[7px] flex flex-col items-center justify-center gap-1 transition-all hover:bg-zinc-300 active:scale-95 border border-transparent shadow-sm"
                      >
                        <X size={14} />
                        Fechar
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

        {showQueuePlayerModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/0 backdrop-blur-none z-[200] flex items-center justify-center p-4"
            onClick={() => setShowQueuePlayerModal(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              className="w-full max-w-[320px] rounded-[32px] overflow-hidden shadow-2xl bg-zinc-50 border border-zinc-200"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-br from-zinc-300 via-zinc-400 to-zinc-600 p-10 text-center relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-10 -mt-10 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-10 -mb-10 blur-xl" />

                <div className="w-20 h-20 mx-auto rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-black/5 shadow-xl relative z-10 mb-6">
                    {players.find(p => p.id === showQueuePlayerModal.playerId)?.photo ? (
                      <img 
                        src={players.find(p => p.id === showQueuePlayerModal.playerId)?.photo} 
                        alt="Player" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-zinc-200 flex items-center shrink-0"><User size={40} /></span>
                    )}
                </div>

                <h3 className="text-2xl font-black uppercase tracking-tighter text-black leading-none">
                  {players.find(p => p.id === showQueuePlayerModal.playerId)?.name}
                </h3>
                <p className="text-[10px] text-black/60 font-black mt-2 uppercase tracking-[0.2em]">
                  AÇÕES DO JOGADOR
                </p>
              </div>

              <div className="p-4">
                <div className="space-y-2.5">
                  {!showQueuePlayerModal.showMoveOptions ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => {
                          setSwappingPlayerId(showQueuePlayerModal.playerId);
                          setShowQueuePlayerModal(null);
                          setToast({ message: "Selecione outro jogador para trocar de posição.", type: 'info' });
                        }}
                        className="p-4 bg-zinc-50 text-zinc-900 rounded-2xl font-bold uppercase text-[9px] flex flex-col items-center justify-center gap-1.5 transition-all hover:bg-zinc-100 active:scale-95 border border-zinc-100 hover:border-zinc-300 group"
                      >
                        <ArrowLeftRight size={18} className="text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                        Substituir
                      </button>

                      <button 
                        onClick={() => {
                          setMovingPlayers({ teamId: teams[showQueuePlayerModal.teamIndex].id, playerIds: [showQueuePlayerModal.playerId] });
                          setIsSelectingDestination(true);
                          setShowQueuePlayerModal(null);
                          setToast({ message: "Selecione o time de destino (apenas times incompletos).", type: 'info' });
                        }}
                        className="p-4 bg-zinc-50 text-zinc-900 rounded-2xl font-bold uppercase text-[9px] flex flex-col items-center justify-center gap-1.5 transition-all hover:bg-zinc-100 active:scale-95 border border-zinc-100 hover:border-zinc-300 group"
                      >
                        <MoveRight size={18} className="text-zinc-400 group-hover:text-zinc-900 transition-colors" />
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
                        className="p-4 bg-red-50 text-red-600 rounded-2xl font-bold uppercase text-[9px] flex flex-col items-center justify-center gap-1.5 transition-all hover:bg-red-100 active:scale-95 border border-red-100 hover:border-red-200 group"
                      >
                        <LogOut size={18} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                        Ausente
                      </button>

                      <button 
                        onClick={() => setShowQueuePlayerModal(null)}
                        className="p-4 bg-zinc-100 text-zinc-500 rounded-2xl font-bold uppercase text-[9px] flex flex-col items-center justify-center gap-1.5 transition-all hover:bg-zinc-200 active:scale-95"
                      >
                        <X size={18} />
                        Fechar
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center px-4">Destino:</div>
                      <div className="max-h-60 overflow-y-auto px-1 space-y-2 custom-scrollbar">
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
                              className="w-full text-left px-5 py-4 text-xs font-black text-zinc-900 bg-zinc-50 hover:bg-brand-primary hover:text-black rounded-2xl transition-all border border-zinc-100 flex items-center justify-between group"
                            >
                              <span className="uppercase tracking-tight">{t.name}</span>
                              <ChevronRight size={16} className="opacity-30 group-hover:opacity-100 transition-opacity" />
                            </button>
                          );
                        })}
                      </div>
                      <button 
                        onClick={() => setShowQueuePlayerModal({ ...showQueuePlayerModal, showMoveOptions: false })}
                        className="w-full py-4 text-zinc-400 text-[10px] font-black uppercase tracking-widest"
                      >
                        Voltar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showAssistSelection && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[160] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl bg-zinc-50 border border-zinc-200"
            >
              <div className="bg-brand-primary p-10 text-center relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-10 -mt-10 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-10 -mb-10 blur-xl" />
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl border-4 border-black/5"
                >
                  <span className="text-black"><IoIosFootball size={32} /></span>
                </motion.div>

                <h3 className="text-xl font-black uppercase tracking-tighter text-black leading-none">Quem deu a assistência?</h3>
                <p className="text-[10px] text-black/60 font-black mt-2 uppercase tracking-[0.2em]">
                  GOL DE <span className="bg-white/30 px-2 py-0.5 rounded text-black">{players.find(p => p.id === showAssistSelection.scorerId)?.name}</span>
                </p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 gap-2.5 max-h-72 overflow-y-auto pr-1 custom-scrollbar mb-6">
                  <motion.button 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={() => {
                      const team = showAssistSelection.teamIndex === match.teamAIndex ? 'A' : 'B';
                      registerGoal(team, showAssistSelection.scorerId);
                      setShowAssistSelection(null);
                    }}
                    className="w-full p-4 rounded-2xl border-2 border-dashed transition-all text-center flex items-center justify-center gap-3 bg-white border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 group"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200 transition-colors">
                      <PiXBold size={16} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-500 group-hover:text-zinc-700">Sem Assistência</span>
                  </motion.button>

                  <div className="h-4 flex items-center gap-2">
                    <div className="h-px flex-1 bg-zinc-200"></div>
                    <span className="text-[8px] font-black text-zinc-300 uppercase tracking-widest">Jogadores do Time</span>
                    <div className="h-px flex-1 bg-zinc-200"></div>
                  </div>

                  {teams[showAssistSelection.teamIndex].playerIds
                    .filter(pid => pid !== showAssistSelection.scorerId)
                    .map((pid, idx) => {
                      const player = players.find(p => p.id === pid);
                      return (
                        <motion.button
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.4 + (idx * 0.05) }}
                          key={`assist-choice-modal-${pid}`}
                          onClick={() => {
                            const team = showAssistSelection.teamIndex === match.teamAIndex ? 'A' : 'B';
                            registerGoal(team, showAssistSelection.scorerId, pid);
                            setShowAssistSelection(null);
                          }}
                          className="w-full p-3 rounded-2xl border border-zinc-200 transition-all text-left group flex items-center gap-3 bg-white hover:border-brand-primary hover:shadow-lg hover:shadow-brand-primary/10"
                        >
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden border border-zinc-100 bg-zinc-50 shrink-0 shadow-inner group-hover:border-brand-primary/20">
                            {player?.photo ? (
                              <img src={player.photo} alt={player.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-zinc-100">
                                <span className="text-zinc-400"><IoPersonOutline size={16} /></span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Garçom</div>
                            <div className="text-xs font-black uppercase truncate text-zinc-900 group-hover:text-brand-primary">
                              {player?.name}
                            </div>
                          </div>
                          <div className="w-7 h-7 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center group-hover:bg-brand-primary/10 group-hover:border-brand-primary/20 text-zinc-300 group-hover:text-brand-primary transition-all">
                            <PiPlusBold size={12} />
                          </div>
                        </motion.button>
                      );
                    })}
                </div>

                <button 
                  onClick={() => setShowAssistSelection(null)}
                  className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:bg-red-50 rounded-2xl text-zinc-400 hover:text-red-500 text-center"
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
                  <motion.div
                    animate={{ rotate: [0, 180, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 8.5,
                      ease: "easeInOut"
                    }}
                  >
                    <Settings size={20} className="text-zinc-500" />
                  </motion.div>
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

        {showStartMatchConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm rounded-[40px] shadow-2xl border bg-zinc-50 border-zinc-200 overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-brand-primary p-10 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-12 -mt-12 blur-2xl" />
                <div className="flex w-16 h-16 mx-auto rounded-3xl bg-white items-center justify-center mb-4 shadow-xl border-4 border-black/5">
                  <span className="text-black"><IoFootballOutline size={32} /></span>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-black">Partida em Andamento</h3>
                <p className="text-[10px] text-black/40 font-black uppercase tracking-[0.2em] mt-1">O que deseja fazer?</p>
              </div>

              <div className="p-8 space-y-3">
                <button 
                  onClick={() => {
                    setShowStartMatchConfirm(false);
                    setTeamsTab('historico');
                  }}
                  className="w-full py-4 px-4 bg-brand-primary text-black rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 hover:scale-[1.02] transition-all active:scale-95 shadow-lg shadow-brand-primary/20"
                >
                  <PiPlay size={20} />
                  Continuar Partida
                </button>
                
                <button 
                  onClick={() => {
                    setShowStartMatchConfirm(false);
                    if (match.teamAIndex !== -1 && match.teamBIndex !== -1 && 
                        (teams[match.teamAIndex]?.playerIds?.length === match.config.playersPerTeam && 
                        teams[match.teamBIndex]?.playerIds?.length === match.config.playersPerTeam)) {
                      startNextMatch(match.teamAIndex, match.teamBIndex);
                    }
                  }}
                  className="w-full py-4 px-4 bg-white text-zinc-800 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 hover:bg-zinc-50 transition-all border border-zinc-200"
                >
                  <span className="text-brand-primary"><PiArrowClockwiseBold size={20} /></span>
                  Nova Partida
                </button>

                <button 
                  onClick={() => setShowStartMatchConfirm(false)}
                  className="w-full py-2 text-zinc-400 text-[10px] font-black uppercase tracking-widest hover:text-zinc-600 transition-colors"
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
                              setTimeout(() => setToast(null), 7000);
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

        <ColorPickerModal 
          isOpen={!!showColorPicker}
          onClose={() => setShowColorPicker(null)}
          currentColor={showColorPicker?.color || ''}
          teamName={
            showColorPicker 
              ? showColorPicker.teamIdx === -1 ? 'Time A (Fixo)' 
              : showColorPicker.teamIdx === -2 ? 'Time B (Fixo)' 
              : teams[showColorPicker.teamIdx]?.name || '' 
              : ''
          }
          isFixed={fixedColors.enabled}
          onToggleFixed={(enabled) => {
            setFixedColors(prev => {
              if (enabled && showColorPicker) {
                const idx = showColorPicker.teamIdx;
                const isTeamA = idx === -1 || idx === match.teamAIndex;
                return {
                  ...prev,
                  enabled,
                  teamA: isTeamA ? showColorPicker.color : (prev.teamA || teams[match.teamAIndex]?.color || TEAM_COLORS[0]),
                  teamB: !isTeamA ? showColorPicker.color : (prev.teamB || teams[match.teamBIndex]?.color || TEAM_COLORS[1]),
                };
              }
              return { ...prev, enabled };
            });
          }}
          onSelect={(color) => {
            if (!showColorPicker) return;
            const idx = showColorPicker.teamIdx;
            const isTeamA = idx === -1 || idx === match.teamAIndex;
            const isTeamB = idx === -2 || idx === match.teamBIndex;
            
            if (idx === -1) {
              setFixedColors(prev => ({ ...prev, teamA: color }));
            } else if (idx === -2) {
              setFixedColors(prev => ({ ...prev, teamB: color }));
            } else if (fixedColors.enabled) {
              setFixedColors(prev => ({
                ...prev,
                teamA: isTeamA ? color : prev.teamA,
                teamB: isTeamB ? color : prev.teamB
              }));
              // Also update specific team if needed, but fixed takes precedence usually
              setTeams(prev => prev.map((t, i) => i === idx ? { ...t, color } : t));
            } else {
              setTeams(prev => {
                const newTeams = [...prev];
                if (newTeams[idx]) {
                  newTeams[idx].color = color;
                }
                return newTeams;
              });
            }
            setShowColorPicker(null);
          }}
        />

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
          onUpdateStars={updatePlayerStars}
          onRemove={removePlayer}
        />

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-[100] pointer-events-none pb-4 sm:pb-6 px-4">
          <nav className="mx-auto max-w-[400px] bg-[#1E3D2F]/95 backdrop-blur-2xl border border-white/10 p-1.5 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-2xl pointer-events-auto">
            <button 
              onClick={() => {
                const screens: Screen[] = ['players', 'teams', 'ranking', 'finance'];
                const targetIndex = screens.indexOf('players');
                const currentIndex = screens.indexOf(currentScreen);
                setSwipeDirection(targetIndex > currentIndex ? -1 : 1);
                setCurrentScreen('players');
              }}
              className={`flex-1 flex flex-col items-center justify-center py-2 transition-all duration-300 rounded-[12px] relative overflow-hidden ${
                currentScreen === 'players' 
                  ? 'text-brand-primary bg-white/5 shadow-inner' 
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              {currentScreen === 'players' && (
                <motion.div layoutId="nav-glow" className="absolute -top-4 w-12 h-4 bg-brand-primary opacity-30 blur-xl rounded-full" />
              )}
              {currentScreen === 'players' ? (
                <div className="mb-1 transition-transform duration-300 -translate-y-0.5">
                  <PiUserCirclePlusThin size={28} />
                </div>
              ) : (
                <div className="mb-1 transition-transform duration-300">
                  <PiUserCirclePlusThin size={24} />
                </div>
              )}
              <span className={`text-[10px] font-black uppercase tracking-widest leading-none transition-all duration-300 ${currentScreen === 'players' ? 'opacity-100 translate-y-0 drop-shadow-md' : 'opacity-70'}`}>Gerenciar</span>
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
              className={`flex-1 flex flex-col items-center justify-center py-2 transition-all duration-300 rounded-[12px] relative overflow-hidden ${
                currentScreen === 'teams' 
                  ? 'text-brand-primary bg-white/5 shadow-inner' 
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              {currentScreen === 'teams' && (
                <motion.div layoutId="nav-glow" className="absolute -top-4 w-12 h-4 bg-brand-primary opacity-30 blur-xl rounded-full" />
              )}
              {currentScreen === 'teams' ? (
                <div className="mb-1 transition-transform duration-300 -translate-y-0.5 text-brand-primary">
                  <GiSoccerField size={26} />
                </div>
              ) : (
                <div className="mb-1 transition-transform duration-300">
                  <GiSoccerField size={22} />
                </div>
              )}
              <span className={`text-[10px] font-black uppercase tracking-widest leading-none transition-all duration-300 ${currentScreen === 'teams' ? 'opacity-100 translate-y-0 drop-shadow-md' : 'opacity-70'}`}>Partida</span>
            </button>
            <button 
              onClick={() => {
                const screens: Screen[] = ['players', 'teams', 'ranking', 'finance'];
                const targetIndex = screens.indexOf('ranking');
                const currentIndex = screens.indexOf(currentScreen);
                setSwipeDirection(targetIndex > currentIndex ? -1 : 1);
                setCurrentScreen('ranking');
              }}
              className={`flex-1 flex flex-col items-center justify-center py-2 transition-all duration-300 rounded-[12px] relative overflow-hidden ${
                currentScreen === 'ranking' 
                  ? 'text-brand-primary bg-white/5 shadow-inner' 
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              {currentScreen === 'ranking' && (
                <motion.div layoutId="nav-glow" className="absolute -top-4 w-12 h-4 bg-brand-primary opacity-30 blur-xl rounded-full" />
              )}
              {currentScreen === 'ranking' ? (
                <div className="mb-1 transition-transform duration-300 -translate-y-0.5">
                  <GiTrophy size={26} />
                </div>
              ) : (
                <div className="mb-1 transition-transform duration-300">
                  <GiTrophy size={22} />
                </div>
              )}
              <span className={`text-[10px] font-black uppercase tracking-widest leading-none transition-all duration-300 ${currentScreen === 'ranking' ? 'opacity-100 translate-y-0 drop-shadow-md' : 'opacity-70'}`}>Ranking</span>
            </button>
          </nav>
        </div>

        {/* Main Menu Modal */}
        <AnimatePresence>
          {showMainMenu && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex justify-end"
              onClick={() => setShowMainMenu(false)}
            >
              <motion.div
                initial={{ x: '100%', filter: 'blur(10px)' }}
                animate={{ x: 0, filter: 'blur(0px)' }}
                exit={{ x: '100%', filter: 'blur(10px)' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="bg-[#1E3D2F]/95 w-72 h-full shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col border-l border-white/10 relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, #ffffff 20px, #ffffff 21px), repeating-linear-gradient(-45deg, transparent, transparent 20px, #ffffff 20px, #ffffff 21px)`,
                }}></div>

                {/* Header Section with Badge */}
                <div className="pt-12 pb-6 px-8 relative z-10">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-white drop-shadow-lg font-megrim">Menu</h2>
                  </div>
                  <button 
                    onClick={() => setShowMainMenu(false)} 
                    className="absolute top-10 right-8 p-3 bg-white/5 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex-1 p-6 flex flex-col gap-8 relative z-10 overflow-y-auto">
                  {/* Navigation Group */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                      <div className="h-[1px] flex-1 bg-white/5" />
                      <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] whitespace-nowrap">Navegação</span>
                      <div className="h-[1px] flex-1 bg-white/5" />
                    </div>
                    
                    <button 
                      onClick={() => {
                        setShowMainMenu(false);
                        if (!isOrgProAuthorized) {
                          setShowAuthModal(true);
                          return;
                        }
                        const screens: Screen[] = ['players', 'teams', 'ranking', 'finance', 'org-pro'];
                        const targetIndex = screens.indexOf('org-pro');
                        const currentIndex = screens.indexOf(currentScreen);
                        setSwipeDirection(targetIndex > currentIndex ? -1 : 1);
                        setCurrentScreen('org-pro');
                      }}
                      className="group w-full flex items-center gap-4 p-3 rounded-lg bg-gradient-to-br from-brand-primary/20 to-brand-primary/5 hover:from-brand-primary/30 hover:to-brand-primary/10 transition-all duration-400 transform active:scale-95 text-left shadow-xl border border-brand-primary/20 relative overflow-hidden"
                    >
                      {!isOrgProAuthorized && (
                        <div className="absolute top-0 right-0 p-1 text-brand-primary/40">
                          <PiLockFill size={10} />
                        </div>
                      )}
                      <div className="w-10 h-10 rounded-lg bg-brand-primary/20 text-brand-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                        <GiCrown size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black uppercase tracking-widest text-xs text-brand-primary">Organização Pro</span>
                        <span className="text-[10px] text-brand-primary/60 tracking-tight mt-0.5">Recursos avançados</span>
                      </div>
                      <ChevronRight size={16} className="ml-auto text-brand-primary/40 group-hover:text-brand-primary transition-colors" />
                    </button>

                    <button 
                      onClick={() => {
                        setShowMainMenu(false);
                        const screens: Screen[] = ['players', 'teams', 'ranking', 'finance', 'org-pro'];
                        const targetIndex = screens.indexOf('finance');
                        const currentIndex = screens.indexOf(currentScreen);
                        setSwipeDirection(targetIndex > currentIndex ? -1 : 1);
                        setCurrentScreen('finance');
                        setFinanceSubScreen('balanco');
                      }}
                      className="group w-full flex items-center gap-4 p-3 rounded-lg bg-gradient-to-br from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 transition-all duration-400 transform active:scale-95 text-left shadow-xl"
                    >
                      <div className="w-10 h-10 rounded-lg bg-white/10 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                        <IoIosWallet size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black uppercase tracking-widest text-xs text-white">Financeiro</span>
                        <span className="text-[10px] text-white/40 tracking-tight mt-0.5">Gestão de caixa</span>
                      </div>
                      <ChevronRight size={16} className="ml-auto text-white/20 group-hover:text-brand-primary transition-colors" />
                    </button>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="p-8 border-t border-white/5 relative z-10 bg-black/20 backdrop-blur-md pb-safe">
                  <button 
                    onClick={() => {
                      setShowMainMenu(false);
                      setShowBackToHomeConfirm(true);
                    }}
                    className="group w-full flex items-center justify-center gap-3 py-4 rounded-[24px] bg-white text-[#1E3D2F] font-normal uppercase tracking-[0.15em] text-[11px] hover:bg-zinc-100 transition-all duration-300 shadow-2xl active:scale-95"
                  >
                    <LogOut size={18} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Sair da Partida</span>
                  </button>
                  
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[300] flex items-center justify-center p-4"
            onClick={() => setShowBackToHomeConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#14301F] border border-orange-500/30 rounded-[32px] p-8 max-w-sm w-full shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 bg-orange-500/5 pointer-events-none" />
              <h2 className="text-2xl font-black text-center mb-4 uppercase tracking-tighter text-orange-400 relative z-10">Sair da Partida?</h2>
              <p className="text-center text-white/70 mb-8 text-sm lowercase first-letter:uppercase leading-relaxed px-2 relative z-10">
                tem certeza que deseja sair desta partida e voltar para o menu principal?
              </p>
              
              <div className="flex flex-col gap-3 relative z-10">
                <button 
                  onClick={() => {
                    setShowBackToHomeConfirm(false);
                    onBackToHome();
                  }}
                  className="w-full py-5 bg-orange-500 text-white rounded-[20px] font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 active:scale-95"
                >
                  Sim
                </button>
                <button 
                  onClick={() => setShowBackToHomeConfirm(false)}
                  className="w-full py-4 rounded-[20px] font-black uppercase tracking-widest text-[10px] transition-all bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                >
                  Não
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

        {/* Auth modal removed */}
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
    <div className="min-h-screen font-sans transition-colors duration-500 flex flex-col justify-center p-0 pt-4 pb-4 sm:p-4 bg-[#14301F]">
      <div className="w-[96%] sm:w-full max-w-md mx-auto px-6 py-12 sm:px-10 sm:py-16 rounded-[40px] shadow-[0_32px_80px_rgba(0,0,0,0.8)] border border-[#E3D39E]/20 flex flex-col min-h-[85vh] sm:min-h-0 justify-between relative overflow-hidden bg-[#14301F]">
        {/* Animated Background Polish */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, #ffffff 20px, #ffffff 21px), repeating-linear-gradient(-45deg, transparent, transparent 20px, #ffffff 20px, #ffffff 21px)`,
          }}></div>
          <div className="absolute -top-[20%] -left-[20%] w-[80%] h-[80%] bg-brand-primary opacity-10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute -bottom-[20%] -right-[20%] w-[80%] h-[80%] bg-brand-primary opacity-5 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center gap-6 text-center mb-12">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
          >
            <SpinningBall size="lg" spin={true} />
          </motion.div>
          <div className="flex flex-col items-center">
            <FutQuinaLogo size="lg" colorClass="" style={{ color: '#E3D39E', fontStyle: 'normal', fontFamily: 'Megrim', fontWeight: '900', letterSpacing: '-0.05em' }} />
            <div className="h-0.5 w-12 bg-brand-primary mt-2 rounded-full opacity-60" />
          </div>
        </div>

        <div className="relative z-10 space-y-10 sm:space-y-8 flex-1 flex flex-col justify-center">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="transform sm:scale-100 scale-105 origin-center w-full"
          >
            
          </motion.div>
          
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {groups.length > 0 && (
                <div className="space-y-4 pt-4 sm:pt-0">
                  <div className="flex items-center gap-3 px-2 mb-2">
                    <span className="text-[10px] font-normal text-[#E3D39E]/40 uppercase tracking-[0.3em]">Minhas Partidas</span>
                    <div className="h-[1px] flex-1 bg-[#E3D39E]/10" />
                  </div>
                  {groups.map((group, index) => (
                    <motion.div 
                      key={`${group.id}-${index}`}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center gap-2"
                    >
                      <button
                        onClick={() => setSelectedGroupOptions({ id: group.id, name: group.name })}
                        className="flex-1 p-4 transition-all duration-400 flex items-center justify-between relative group rounded-[24px] bg-white/5 backdrop-blur-xl border border-[#E3D39E]/20 shadow-[0_15px_35px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:bg-white/10 hover:border-[#E3D39E]/40 overflow-hidden active:scale-95"
                      >
                        <div className="flex flex-col items-start gap-1">
                          <span className="text-xl font-black text-[#E3D39E] drop-shadow-md tracking-tight uppercase" style={{ fontFamily: 'system-ui' }}>{group.name}</span>
                          <span className="text-[9px] font-black text-[#E3D39E]/40 uppercase tracking-widest">{new Date(group.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-center group-hover:text-brand-primary transition-all">
                          <span className="text-[#E3D39E] opacity-70 group-hover:opacity-100"><GiGoalKeeper size={28} /></span>
                        </div>
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="pt-3"
            >
              <button
                onClick={() => setShowNewGroupModal(true)}
                className="w-full p-4 rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-4 transition-all duration-300 shadow-[0_12px_30px_rgba(183,217,108,0.2)] bg-brand-primary text-black hover:opacity-90 hover:scale-[1.01] active:scale-95 border-b-4 border-black/20"
              >
                <div className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center">
                  <Plus size={18} strokeWidth={3} />
                </div>
                Nova Partida
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Group Options Modal */}
      {selectedGroupOptions && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setSelectedGroupOptions(null)}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm p-8 rounded-[32px] shadow-2xl bg-[#14301F] border border-[#E3D39E]/30 relative overflow-hidden" 
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 15px, #ffffff 15px, #ffffff 16px), repeating-linear-gradient(-45deg, transparent, transparent 15px, #ffffff 15px, #ffffff 16px)`,
            }}></div>
            
            <div className="relative z-10 text-center mb-8">
              <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] mb-2 block">Opções da Partida</span>
              <h3 className="text-2xl font-black font-[system-ui] tracking-tighter text-[#E3D39E] uppercase">{selectedGroupOptions.name}</h3>
            </div>

            <div className="relative z-10 flex flex-col gap-4">
              <button
                onClick={() => {
                  setCurrentGroupId(selectedGroupOptions.id);
                  setSelectedGroupOptions(null);
                }}
                className="group w-full flex items-center justify-center gap-4 p-5 rounded-[24px] font-black uppercase tracking-widest text-xs transition-all duration-300 bg-brand-primary text-black hover:scale-[1.02] active:scale-95 shadow-xl shadow-brand-primary/20"
              >
                <span className="group-hover:scale-110 transition-transform"><GiQueenCrown size={20} /></span>
                <span className="mt-0.5">Entrar na Partida</span>
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setGroupToRename(selectedGroupOptions);
                    setRenameValue(selectedGroupOptions.name);
                    setSelectedGroupOptions(null);
                  }}
                  className="flex items-center justify-center gap-3 p-4 rounded-[20px] font-black uppercase tracking-widest text-[10px] transition-all bg-white/5 border border-white/10 hover:bg-white/10 text-white"
                >
                  <RefreshCw size={14} />
                  Renomear
                </button>
                <button
                  onClick={() => {
                    setGroupToDelete(selectedGroupOptions);
                    setSelectedGroupOptions(null);
                  }}
                  className="flex items-center justify-center gap-3 p-4 rounded-[20px] bg-red-500/10 text-red-400 font-black uppercase tracking-widest text-[10px] hover:bg-red-500/20 transition-all border border-red-500/20"
                >
                  <Trash2 size={14} />
                  Exclua
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {groupToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#14301F] border border-red-500/30 rounded-[32px] p-8 max-w-sm w-full shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 text-red-400 text-center relative z-10">Exclua Partida</h3>
            <p className="text-center text-white/70 mb-8 text-sm lowercase first-letter:uppercase leading-relaxed px-2 relative z-10">
              Tem certeza que deseja excluir a partida <strong className="text-white font-black">{groupToDelete.name}</strong>? Todos os dados serão perdidos.
            </p>
            <div className="flex flex-col gap-3 relative z-10">
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
                className="w-full py-5 rounded-[20px] font-black uppercase tracking-widest text-xs bg-red-500 text-white hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 active:scale-95"
              >
                Confirmar Exclusão
              </button>
              <button
                onClick={() => setGroupToDelete(null)}
                className="w-full py-4 rounded-[20px] font-black uppercase tracking-widest text-[10px] transition-all bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Rename Modal */}
      {groupToRename && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm p-8 rounded-[32px] shadow-2xl bg-[#14301F] border border-[#E3D39E]/30 relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 15px, #ffffff 15px, #ffffff 16px), repeating-linear-gradient(-45deg, transparent, transparent 15px, #ffffff 15px, #ffffff 16px)`,
            }}></div>
            <h3 className="relative z-10 text-xl font-black uppercase tracking-tighter mb-6 text-[#E3D39E] text-center">Renomear</h3>
            <input
              type="text"
              value={renameValue}
              onChange={e => setRenameValue(e.target.value)}
              placeholder="Novo nome"
              className="relative z-10 w-full p-5 rounded-[20px] mb-8 outline-none font-bold bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-brand-primary transition-all text-center text-lg"
              autoFocus
            />
            <div className="relative z-10 flex flex-col gap-3">
              <button
                onClick={() => {
                  if (renameValue.trim()) {
                    setGroups(prev => prev.map(g => g.id === groupToRename.id ? { ...g, name: renameValue.trim() } : g));
                    setGroupToRename(null);
                    setRenameValue('');
                  }
                }}
                disabled={!renameValue.trim()}
                className="w-full py-5 rounded-[20px] font-black uppercase tracking-widest text-[11px] bg-brand-primary text-black hover:opacity-90 transition-all disabled:opacity-50 active:scale-95 shadow-xl shadow-brand-primary/20"
              >
                Salvar Alteração
              </button>
              <button
                onClick={() => {
                  setGroupToRename(null);
                  setRenameValue('');
                }}
                className="w-full py-4 rounded-[20px] font-black uppercase tracking-widest text-[10px] transition-all bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* New Group Modal */}
      {showNewGroupModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-sm p-8 rounded-[36px] shadow-[0_20px_60px_rgba(0,0,0,0.8)] bg-[#14301F] border border-[#E3D39E]/30 relative overflow-hidden"
          >
             <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 15px, #ffffff 15px, #ffffff 16px), repeating-linear-gradient(-45deg, transparent, transparent 15px, #ffffff 15px, #ffffff 16px)`,
            }}></div>

            <div className="relative z-10 text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto mb-4">
                <GiGoalKeeper size={32} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter text-[#E3D39E]">Nova Partida</h3>
              <p className="text-[10px] font-black text-[#E3D39E]/40 uppercase tracking-[0.2em] mt-1">Como vai se chamar?</p>
            </div>

            <input
              type="text"
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
              placeholder="Ex: Racha dos Amigos"
              className="relative z-10 w-full p-6 rounded-[24px] mb-8 outline-none font-black bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-brand-primary transition-all text-center text-lg shadow-inner"
              autoFocus
            />
            
            <div className="relative z-10 flex flex-col gap-4">
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
                className="w-full p-5 rounded-[24px] font-black uppercase tracking-widest text-xs bg-brand-primary text-black hover:scale-[1.02] transition-all disabled:opacity-50 active:scale-95 shadow-xl shadow-brand-primary/20"
              >
                Confirmar Criação
              </button>
              <button
                onClick={() => {
                  setShowNewGroupModal(false);
                  setNewGroupName('');
                }}
                className="w-full py-4 rounded-[24px] font-black uppercase tracking-widest text-[10px] transition-all bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
              >
                Voltar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
