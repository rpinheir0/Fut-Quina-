/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from "react";
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
  ArrowRight,
  MoveRight,
  Home,
  MoreVertical,
  Eye,
  Award,
  LogOut,
  Contact,
  Rocket,
  Globe,
  Star,
  Palette,
  Power,
  Shirt,
  LayoutPanelLeft,
  ArrowUp,
  ArrowDown,
  LayoutList,
  History,
  Crown,
  MousePointerClick,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { FcHighPriority, FcRules, FcGrid, FcMoneyTransfer } from "react-icons/fc";
import {
  IoPersonOutline,
  IoFootballOutline,
  IoCheckmarkCircle,
  IoInformationCircleOutline,
  IoCheckmarkCircleOutline,
  IoPeopleCircleOutline,
  IoLogoWhatsapp,
} from "react-icons/io5";
import {
  BsArrowUpRightCircle,
  BsClockHistory,
  BsPersonFillAdd,
  BsChevronDoubleUp,
} from "react-icons/bs";
import {
  IoIosTrophy,
  IoIosWallet,
  IoIosFootball,
  IoMdSwap,
  IoMdArrowUp,
  IoMdArrowDown,
  IoMdDoneAll,
  IoIosMenu,
  IoIosSave,
} from "react-icons/io";
import {
  PiUserCirclePlusThin,
  PiUserCirclePlusLight,
  PiUserCirclePlus,
} from "react-icons/pi";
import {
  MdOutlinePlayForWork,
  MdDonutLarge,
  MdDataSaverOff,
} from "react-icons/md";
import { CiSaveUp1, CiMemoPad, CiImport } from "react-icons/ci";
import { TiMap } from "react-icons/ti";
import {
  GiLaurelCrown,
  GiGloves,
  GiGoalKeeper,
  GiSoccerKick,
  GiKing,
  GiSoccerField,
  GiTrophy,
  GiPodiumWinner,
  GiRunningShoe,
  GiLaurelsTrophy,
  GiSocks,
  GiAbstract042,
  GiSoccerBall,
  GiCrown,
  GiWhistle,
  GiSportMedal,
  GiQueenCrown,
  GiCrossShield,
  GiDragonShield,
  GiEdgedShield,
  GiRank3,
  GiBoltShield,
  GiBorderedShield,
  GiCrownedSkull,
} from "react-icons/gi";
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
  PiRankingThin,
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
  PiShieldCheckFill,
  PiPaletteBold,
  PiClockBold,
  PiClockFill,
  PiShuffleAngularBold,
  PiCalendarBlankFill,
  PiWarningCircleFill,
  PiCheckCircleFill,
  PiMapPinFill,
} from "react-icons/pi";
import { supabase } from "./lib/supabase";
import { sounds } from "./lib/sounds";

// --- Supabase Hooks ---
function useSupabaseArraySync<T extends { id: string }>(
  tableName: string,
  groupId: string,
  items: T[],
  mapToDb: (item: T, groupId: string) => any,
  isDataLoaded: boolean,
  isReadOnly: boolean = false,
  isEnabled: boolean = true,
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
        syncedIds.current = new Set(items.map((i) => i.id));
      }
      prevEnabled.current = isEnabled;
      return;
    }

    // If we just enabled, we should probably force a sync of everything to be sure
    const forceSync = isEnabled && !prevEnabled.current;
    prevEnabled.current = isEnabled;

    if (isReadOnly) return;

    const currentIds = new Set(items.map((i) => i.id));
    const deletedIds = forceSync
      ? []
      : [...syncedIds.current].filter((id) => !currentIds.has(id));

    if (deletedIds.length > 0) {
      supabase.from(tableName).delete().in("id", deletedIds).then();
    }

    if (items.length > 0) {
      const payload = items.map((item) => mapToDbRef.current(item, groupId));
      supabase.from(tableName).upsert(payload, { onConflict: "id" }).then();
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
  Legend,
} from "recharts";

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
  isGoalkeeper?: boolean;
}

interface Team {
  id: string;
  name: string;
  playerIds: string[];
  iconIdx: number;
  color: string;
  lastMatchStatus?: "Vencedor" | "Empate" | "Derrota" | "Subiu";
}

interface PenaltyShot {
  playerId: string;
  success: boolean | null;
}

interface MatchResult {
  id: string;
  teamAName: string;
  teamBName: string;
  teamAColor: string;
  teamBColor: string;
  teamAId: string;
  teamBId: string;
  teamAPlayerIds: string[];
  teamBPlayerIds: string[];
  teamAIndex: number;
  teamBIndex: number;
  scoreA: number;
  scoreB: number;
  winnerIndex: number;
  loserIndex: number;
  winnerId: string | null;
  loserId: string | null;
  events: MatchEvent[];
  timestamp: number;
  tieBreakerWinnerId: string | null;
  duration: number;
}

interface TieBreakerState {
  showSelection: boolean;
  type: "penalties" | "lottery" | "none";
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

const CamisaAmarela = ({ size = 24, className = "", ...props }: { size?: number; className?: string; [key: string]: any }) => (
  <img src="/Amarelo.png" alt="Camisa Amarela" width={size} height={size} className={`object-contain ${className}`} referrerPolicy="no-referrer" {...props} />
);

const CamisaAzulClaro = ({ size = 24, className = "", ...props }: { size?: number; className?: string; [key: string]: any }) => (
  <img src="/Azul claro.png" alt="Camisa Azul Claro" width={size} height={size} className={`object-contain ${className}`} referrerPolicy="no-referrer" {...props} />
);

const CamisaAzul = ({ size = 24, className = "", ...props }: { size?: number; className?: string; [key: string]: any }) => (
  <img src="/Azul.png" alt="Camisa Azul" width={size} height={size} className={`object-contain ${className}`} referrerPolicy="no-referrer" {...props} />
);

const CamisaBranca = ({ size = 24, className = "", ...props }: { size?: number; className?: string; [key: string]: any }) => (
  <img src="/Branca.png" alt="Camisa Branca" width={size} height={size} className={`object-contain ${className}`} referrerPolicy="no-referrer" {...props} />
);

const CamisaLaranja = ({ size = 24, className = "", ...props }: { size?: number; className?: string; [key: string]: any }) => (
  <img src="/Laranja.png" alt="Camisa Laranja" width={size} height={size} className={`object-contain ${className}`} referrerPolicy="no-referrer" {...props} />
);

const CamisaPreta = ({ size = 24, className = "", ...props }: { size?: number; className?: string; [key: string]: any }) => (
  <img src="/Preta.png" alt="Camisa Preta" width={size} height={size} className={`object-contain ${className}`} referrerPolicy="no-referrer" {...props} />
);

const CamisaRoxa = ({ size = 24, className = "", ...props }: { size?: number; className?: string; [key: string]: any }) => (
  <img src="/Roxo.png" alt="Camisa Roxa" width={size} height={size} className={`object-contain ${className}`} referrerPolicy="no-referrer" {...props} />
);

const CamisaVerde = ({ size = 24, className = "", ...props }: { size?: number; className?: string; [key: string]: any }) => (
  <img src="/Verde.png" alt="Camisa Verde" width={size} height={size} className={`object-contain ${className}`} referrerPolicy="no-referrer" {...props} />
);

const CamisaVermelha = ({ size = 24, className = "", ...props }: { size?: number; className?: string; [key: string]: any }) => (
  <img src="/Vermelho.png" alt="Camisa Vermelha" width={size} height={size} className={`object-contain ${className}`} referrerPolicy="no-referrer" {...props} />
);

const TEAM_ICONS = [
  CamisaAmarela,
  CamisaAzulClaro,
  CamisaAzul,
  CamisaBranca,
  CamisaLaranja,
  CamisaPreta,
  CamisaRoxa,
  CamisaVerde,
  CamisaVermelha,
];
const TEAM_COLORS = [
  "#2563EB",
  "#DC2626",
  "#16A34A",
  "#EA580C",
  "#CA8A04",
  "#0D9488",
  "#65A30D",
  "#0284C7",
  "#059669",
  "#D97706",
  "#475569",
  "#ffffff",
  "#000000",
];

const SHIRT_COLORS = [
  "#EAB308", // 0: Yellow (CamisaAmarela)
  "#38BDF8", // 1: Light blue (CamisaAzulClaro)
  "#2563EB", // 2: Blue (CamisaAzul)
  "#ffffff", // 3: White (CamisaBranca)
  "#F97316", // 4: Orange (CamisaLaranja)
  "#000000", // 5: Black (CamisaPreta)
  "#8B5CF6", // 6: Purple (CamisaRoxa)
  "#16A34A", // 7: Green (CamisaVerde)
  "#DC2626", // 8: Red (CamisaVermelha)
];

const TypewriterText = ({ text, className, ...props }: { text: string; className?: string; [key: string]: any }) => {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    setDisplayText("");
    let timeout: any;
    let i = 0;
    const type = () => {
      if (i <= text.length) {
        setDisplayText(text.slice(0, i));
        i++;
        timeout = setTimeout(type, 30);
      }
    };
    timeout = setTimeout(type, 150); 
    return () => clearTimeout(timeout);
  }, [text]);

  return <span className={className} {...props}>{displayText}</span>;
};

const TutorialCarousel = () => {
  const [index, setIndex] = useState(0);

  // Imagens carregadas via URLs públicas (imgur) para não quebrar o build
  const items = [
    { image: "https://i.imgur.com/e1fa5xq.png", alt: "Tudo do Seu Jeito" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [items.length]);

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 shadow-[0_0_50px_-12px_rgba(57,255,20,0.15)] group">
      {/* High-tech border glow overlay */}
      <div className="absolute inset-0 rounded-xl border-[1px] border-white/5 z-20 pointer-events-none" />
      <div className="absolute inset-0 rounded-xl shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] z-10 pointer-events-none" />

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
            className="w-full h-full object-cover rounded-xl opacity-90 contrast-125 saturate-150"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                `https://placehold.co/600x400/1a1a1a/ffffff?text=${items[index].alt.replace(/ /g, "+")}\n(Faça+upload+da+imagem)`;
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
              i === index ? "w-8" : "w-2"
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
  const usedColors = existingTeams.map((t) => t.color).filter(Boolean);
  const availableColors = TEAM_COLORS.filter((c) => !usedColors.includes(c));

  if (availableColors.length > 0) {
    // Pick random available color
    return availableColors[Math.floor(Math.random() * availableColors.length)];
  }

  // If no colors are available, pick randomly from all
  return TEAM_COLORS[Math.floor(Math.random() * TEAM_COLORS.length)];
};

const getNextTeamIconIdx = (existingTeams: Team[]) => {
  const usedIcons = existingTeams
    .map((t) => t.iconIdx)
    .filter((idx) => idx !== undefined);
  const availableIndices = TEAM_ICONS.map((_, i) => i).filter(
    (i) => !usedIcons.includes(i),
  );

  if (availableIndices.length > 0) {
    return availableIndices[
      Math.floor(Math.random() * availableIndices.length)
    ];
  }
  return Math.floor(Math.random() * TEAM_ICONS.length);
};

const FlipDigit = ({
  value,
  size = "normal",
  clockId = "",
  digitId = "",
}: {
  value: string;
  size?: "normal" | "small" | "xs";
  clockId?: string;
  digitId?: string;
}) => {
  const theme = "light";
  const dimensions = {
    normal: "w-10 h-14",
    small: "w-7 h-10",
    xs: "w-5 h-7",
  };

  const textSizes = {
    normal: "text-3xl",
    small: "text-xl",
    xs: "text-sm",
  };

  return (
    <div
      className={`relative ${dimensions[size]} flex items-center justify-center overflow-hidden`}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={`flip-${clockId}-${digitId}-${value}`}
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -25, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className={`${textSizes[size]} font-black text-black/90`}
        >
          {value}
        </motion.span>
      </AnimatePresence>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/5 via-transparent to-black/5" />
    </div>
  );
};

const FlipClock = ({
  time,
  size = "normal",
  clockId = "default",
}: {
  time: number;
  size?: "normal" | "small" | "xs";
  clockId?: string;
}) => {
  const theme = "light";
  const minutes = Math.floor(time / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (time % 60).toString().padStart(2, "0");

  return (
    <div
      className={`flex items-center ${size === "xs" ? "gap-2.5 p-2 px-4" : "gap-1 p-2"} rounded-xl border border-black/5 bg-white/80 backdrop-blur-sm shadow-sm`}
    >
      <div className={`flex ${size === "xs" ? "gap-1.5" : "gap-0.5"}`}>
        <FlipDigit
          value={minutes[0]}
          size={size}
          clockId={clockId}
          digitId="min0"
        />
        <FlipDigit
          value={minutes[1]}
          size={size}
          clockId={clockId}
          digitId="min1"
        />
      </div>
      <span
        className={`${size === "xs" ? "text-sm" : size === "small" ? "text-lg" : "text-2xl"} font-black text-black/60 mx-1`}
      >
        :
      </span>
      <div className={`flex ${size === "xs" ? "gap-1.5" : "gap-0.5"}`}>
        <FlipDigit
          value={seconds[0]}
          size={size}
          clockId={clockId}
          digitId="sec0"
        />
        <FlipDigit
          value={seconds[1]}
          size={size}
          clockId={clockId}
          digitId="sec1"
        />
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
  onToggleFixed,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (color: string) => void;
  currentColor: string;
  teamName: string;
  isFixed: boolean;
  onToggleFixed: (enabled: boolean) => void;
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
        className="relative bg-white w-full max-w-sm rounded-xl p-6 overflow-hidden border border-black/10"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <h3 className="text-xl font-black uppercase tracking-tighter text-zinc-900">
              COR DO ESCUDO
            </h3>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              {teamName}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <X size={20} className="text-zinc-500" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {TEAM_ICONS.map((Icon, idx) => {
            const isSelected = SHIRT_COLORS[idx] === currentColor;
            return (
              <button
                key={`shirt-choice-${idx}`}
                onClick={() => onSelect(SHIRT_COLORS[idx])}
                className={`aspect-square rounded-2xl border transition-all relative flex flex-col items-center justify-center p-2 bg-zinc-50 ${
                  isSelected 
                    ? "border-brand-primary ring-2 ring-brand-primary shadow-md scale-105 bg-white" 
                    : "border-zinc-200/60 hover:border-zinc-400 hover:scale-105 hover:bg-white"
                }`}
              >
                <div className="w-14 h-14 flex items-center justify-center">
                  <Icon size={48} />
                </div>
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-primary rounded-full flex items-center justify-center shadow-sm">
                    <Check size={10} className="text-white font-bold" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 bg-zinc-50 rounded-xl border border-black/5 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-zinc-900 uppercase tracking-wider mb-0.5">
                MANTER COR FIXA?
              </span>
              <p className="text-[9px] text-zinc-500 font-medium leading-relaxed">
                A cor será mantida para esta posição nos próximos jogos.
              </p>
            </div>
            <button
              onClick={() => onToggleFixed(!isFixed)}
              className={`w-12 h-6 rounded-full p-1 transition-colors relative ${isFixed ? "bg-brand-primary" : "bg-zinc-300"}`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-transform ${isFixed ? "translate-x-6" : "translate-x-0"} shadow-sm`}
              />
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 bg-brand-gradient text-black font-black uppercase tracking-widest text-xs rounded-xl shadow-xl active:scale-95 transition-all"
        >
          CONFIRMAR
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
  players,
}: {
  isOpen: boolean;
  onSelect: (id: string | null) => void;
  teamPlayers: string[];
  goalPlayerId: string;
  players: any[];
}) => {
  const theme = "light";
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className={`w-full max-w-sm rounded-xl overflow-hidden border ${
          theme === "light"
            ? "bg-zinc-50 border-zinc-200"
            : "bg-brand-card border-white/10"
        }`}
      >
        <div className="bg-brand-primary p-8 text-center relative overflow-hidden">
          {/* Decorative Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-xl -mr-16 -mt-16 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-xl -ml-16 -mb-16 blur-3xl" />
          </div>

          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-lg"
          >
            <span className="text-black">
              <GiTrophy size={32} />
            </span>
          </motion.div>
          <h3 className="text-xl font-black uppercase tracking-tighter text-black leading-tight">
            Quem deu a assistência?
          </h3>
          <p className="text-[10px] text-black/60 font-medium mt-1 uppercase tracking-[0.2em] max-w-[200px] mx-auto leading-relaxed">
            Selecione o craque que serviu o{" "}
            <span className="text-zinc-500">garçom</span> no gol
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-2.5 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar mb-6">
            <motion.button
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={() => onSelect(null)}
              className="w-full p-4 rounded-xl border-2 border-dashed transition-all text-center flex items-center justify-center gap-2 bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 group"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200 transition-colors">
                <PiXBold size={16} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-zinc-500 group-hover:text-zinc-600">
                Sem Assistência
              </span>
            </motion.button>

            {teamPlayers
              .filter((id) => id !== goalPlayerId)
              .map((pid, idx) => {
                const player = players.find((p) => p.id === pid);
                return (
                  <motion.button
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                    key={`assist-choice-${pid}-${idx}`}
                    onClick={() => onSelect(pid)}
                    className="w-full p-3.5 rounded-xl border border-zinc-200 transition-all text-left flex items-center gap-4 bg-white hover:border-brand-primary hover:shadow-lg hover:shadow-brand-primary/10 group relative overflow-hidden"
                  >
                    <div className="absolute inset-y-0 left-0 w-1 bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden border border-zinc-100 bg-zinc-50 shrink-0 group-hover:border-brand-primary/20 transition-colors shadow-inner">
                      {player?.photo ? (
                        <img
                          src={player.photo}
                          alt={player.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100">
                          <span className="text-zinc-400">
                            <IoPersonOutline size={20} />
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">
                        Garçom
                      </div>
                      <div className="text-sm font-black uppercase truncate text-zinc-800 transition-colors group-hover:text-brand-primary leading-none">
                        {player?.name}
                      </div>
                      <div className="flex gap-0.5 mt-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={`star-assist-${player?.id}-${star}`}
                            size={8}
                            className={`${(player?.stars || 3) >= star ? "fill-yellow-400 text-yellow-400" : "text-zinc-300"}`}
                          />
                        ))}
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
            className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:bg-zinc-100 rounded-xl text-zinc-400 hover:text-zinc-600"
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
  teamName,
}: {
  isOpen: boolean;
  onSelect: (id: string) => void;
  teamPlayers: string[];
  players: any[];
  teamName: string;
}) => {
  const theme = "light";
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`w-full max-w-md rounded-xl p-8 border ${
          theme === "light"
            ? "bg-zinc-100 border-zinc-200"
            : "bg-brand-card border-white/10"
        }`}
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-brand-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Medal className="text-brand-primary" size={32} />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight text-zinc-900">
            Quem marcou o gol?
          </h3>
          <p className="text-zinc-500 text-sm mt-2 font-bold uppercase tracking-widest">
            Selecione o jogador do {teamName}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {teamPlayers.map((pid, idx) => (
            <button
              key={`scorer-choice-${pid}-${idx}`}
              onClick={() => onSelect(pid)}
              className={`p-4 rounded-lg border transition-all text-left group ${
                theme === "light"
                  ? "bg-white border-zinc-200 hover:border-brand-primary/50 hover:bg-brand-primary/5"
                  : "bg-black/20 border-white/5 hover:border-brand-primary/50 hover:bg-brand-primary/5"
              }`}
            >
              <div className="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-1 opacity-60">
                Jogador
              </div>
              <div
                className={`text-sm font-black uppercase transition-colors text-zinc-900 group-hover:text-brand-primary leading-none`}
              >
                {players.find((p) => p.id === pid)?.name}
              </div>
              <div className="flex gap-0.5 mt-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={`star-scorer-${pid}-${star}`}
                    size={8}
                    className={`${(players.find((p) => p.id === pid)?.stars || 3) >= star ? "fill-yellow-400 text-yellow-400" : "text-zinc-300"}`}
                  />
                ))}
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
  queueCount = 0,
  fixedColors,
}: {
  state: TieBreakerState;
  onTypeSelect: (type: "penalties" | "lottery" | "none") => void;
  onPenaltyToggle: (team: "A" | "B", index: number) => void;
  onLotterySpin: () => void;
  onConfirm: () => void;
  onBothLeave: (firstToQueue: "A" | "B") => void;
  teamA: Team | undefined;
  teamB: Team | undefined;
  players: Player[];
  colorA?: string;
  colorB?: string;
  queueCount?: number;
  fixedColors?: {
    teamA: string | null;
    teamB: string | null;
    enabled: boolean;
  };
}) => {
  const [showQueueOrder, setShowQueueOrder] = useState(false);

  if (!state.showSelection || !teamA || !teamB) return null;

  const getTeamIcon = (team: Team | undefined, position: "A" | "B") => {
    if (fixedColors?.enabled) {
      const fixedColor = position === "A" ? fixedColors.teamA : fixedColors.teamB;
      if (fixedColor) {
        const idx = SHIRT_COLORS.indexOf(fixedColor);
        if (idx !== -1) return TEAM_ICONS[idx];
      }
    }
    if (!team) return TEAM_ICONS[position === "A" ? 0 : 1];
    return TEAM_ICONS[team.iconIdx ?? (position === "A" ? 0 : 1)];
  };

  const resolvedColorA = colorA || teamA.color || TEAM_COLORS[0];
  const resolvedColorB = colorB || teamB.color || TEAM_COLORS[1];

  const teamAGoals = state.penalties.teamA.filter(
    (p) => p.success === true,
  ).length;
  const teamBGoals = state.penalties.teamB.filter(
    (p) => p.success === true,
  ).length;

  const isPenaltiesOngoing = state.type === "penalties";
  const isLotteryOngoing = state.type === "lottery";

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full max-w-md h-auto max-h-[90vh] flex flex-col bg-[#0b1329]/95 rounded-[24px] overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative text-white"
      >
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -ml-32 -mb-32" />

        {/* Header Section */}
        <div className="pt-10 pb-4 px-6 relative z-10 shrink-0">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
              <span className="text-xs font-black text-white uppercase tracking-[0.4em]">
                Desempate
              </span>
            </div>
            {state.type === "penalties" && (
              <span className="text-white/60 text-xs font-medium ml-5 mt-[-4px]">
                Disputa de pênaltis
              </span>
            )}
          </div>
          {state.type !== "none" && (
            <button
              onClick={() => onTypeSelect("none")}
              className="absolute right-6 top-10 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all active:scale-90"
            >
              <ArrowLeft size={18} />
            </button>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-6 pt-0 relative z-10 custom-scrollbar">
          {state.type === "none" && !showQueueOrder && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/10 mb-6 backdrop-blur-sm">
                <div className="flex-1 flex flex-col items-center">
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]"
                    style={{ color: resolvedColorA }}
                  >
                    {(() => {
                      const IconA = getTeamIcon(teamA, "A");
                      return <IconA size={48} />;
                    })()}
                  </div>
                </div>
                <div className="text-white/20 font-black text-xl">VS</div>
                <div className="flex-1 flex flex-col items-center">
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]"
                    style={{ color: resolvedColorB }}
                  >
                    {(() => {
                      const IconB = getTeamIcon(teamB, "B");
                      return <IconB size={48} />;
                    })()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {queueCount >= 2 && (
                  <button
                    onClick={() => setShowQueueOrder(true)}
                    className="group w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-300 transform active:scale-95 text-left shadow-md"
                  >
                    <div className="w-10 h-10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <img src="/deixa partida.png" referrerPolicy="no-referrer" className="w-10 h-10 object-contain" alt="" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold uppercase tracking-widest text-[11px] text-white group-hover:text-red-300 transition-colors">
                        Os dois times deixam a partida
                      </span>
                      <span className="text-[10px] text-white/50 font-medium tracking-tight mt-0.5">
                        Ambos vão para o final da fila
                      </span>
                    </div>
                    <ChevronRight
                      size={18}
                      className="ml-auto text-white/30 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all"
                    />
                  </button>
                )}

                <button
                  onClick={() => onTypeSelect("penalties")}
                  className="group w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300 transform active:scale-95 text-left shadow-md"
                >
                  <div className="w-10 h-10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <img src="/penalti.png" referrerPolicy="no-referrer" className="w-10 h-10 object-contain" alt="" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold uppercase tracking-widest text-[11px] text-white group-hover:text-emerald-300 transition-colors">
                      Disputa de Pênaltis
                    </span>
                    <span className="text-[10px] text-white/50 font-medium tracking-tight mt-0.5">
                      Marcar acertos e erros
                    </span>
                  </div>
                  <ChevronRight
                    size={18}
                    className="ml-auto text-white/30 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all"
                  />
                </button>

                <button
                  onClick={() => onTypeSelect("lottery")}
                  className="group w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300 transform active:scale-95 text-left shadow-md"
                >
                  <div className="w-10 h-10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <img src="/roleta.png" referrerPolicy="no-referrer" className="w-10 h-10 object-contain" alt="" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold uppercase tracking-widest text-[11px] text-white group-hover:text-blue-300 transition-colors">
                      Sorteio Aleatório
                    </span>
                    <span className="text-[10px] text-white/50 font-medium tracking-tight mt-0.5">
                      Roleta da sorte
                    </span>
                  </div>
                  <ChevronRight
                    size={18}
                    className="ml-auto text-white/30 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all"
                  />
                </button>

                <div className="pt-6">
                  <button
                    onClick={() => onConfirm()}
                    className="w-full p-4 mt-4 rounded-2xl bg-white/5 border border-white/10 text-white/80 font-bold uppercase tracking-widest text-[10px] transition-all hover:bg-white/10 active:scale-95 flex items-center justify-center gap-3 group shadow-sm"
                  >
                    <span>Manter o resultado atual</span>
                    <ChevronRight size={14} className="text-white/30 group-hover:translate-x-1 transition-transform group-hover:text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {state.type === "none" && showQueueOrder && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-bold text-white uppercase tracking-tighter">
                  Posição na Fila
                </h3>
                <p className="text-xs text-white/60 font-bold uppercase tracking-widest mt-1">
                  Quem entra primeiro na fila?
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => onBothLeave("A")}
                  className="group w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300 transform active:scale-95 text-left shadow-md"
                >
                  <div
                    className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                    style={{ color: resolvedColorA }}
                  >
                    {(() => {
                      const IconA = getTeamIcon(teamA, "A");
                      return <IconA size={24} />;
                    })()}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-bold uppercase tracking-widest text-xs text-white group-hover:text-emerald-400 transition-colors truncate">
                      {teamA.name} primeiro
                    </span>
                    <div className="flex flex-wrap gap-x-1.5 mt-1">
                      {(teamA.playerIds || []).map((pid, idx) => (
                        <span
                          key={`${pid}-${idx}-2`}
                          className="text-[8px] text-white/50 font-semibold tracking-tight"
                        >
                          {players.find((p) => p.id === pid)?.name}
                          {idx < (teamA.playerIds?.length || 0) - 1 ? " •" : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => onBothLeave("B")}
                  className="group w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300 transform active:scale-95 text-left shadow-md"
                >
                  <div
                    className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                    style={{ color: resolvedColorB }}
                  >
                    {(() => {
                      const IconB = getTeamIcon(teamB, "B");
                      return <IconB size={24} />;
                    })()}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-bold uppercase tracking-widest text-xs text-white group-hover:text-blue-400 transition-colors truncate">
                      {teamB.name} primeiro
                    </span>
                    <div className="flex flex-wrap gap-x-1.5 mt-1">
                      {(teamB.playerIds || []).map((pid, idx) => (
                        <span
                          key={`${pid}-${idx}-3`}
                          className="text-[8px] text-white/50 font-semibold tracking-tight"
                        >
                          {players.find((p) => p.id === pid)?.name}
                          {idx < (teamB.playerIds?.length || 0) - 1 ? " •" : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setShowQueueOrder(false)}
                  className="w-full p-4 mt-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] transition-all hover:bg-white/10 active:scale-95 text-center shadow-sm"
                >
                  Voltar
                </button>
              </div>
            </div>
          )}

          {isPenaltiesOngoing && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white/5 p-6 rounded-[32px] border border-white/10 backdrop-blur-sm">
                <div className="text-center flex-1 flex flex-col items-center">
                  <div
                    className="w-14 h-14 flex items-center justify-center drop-shadow-[0_0_10px_rgba(255,255,255,0.15)] mb-3"
                    style={{ color: teamA.color || TEAM_COLORS[0] }}
                  >
                    {(() => {
                      const IconA = getTeamIcon(teamA, "A");
                      return <IconA size={48} />;
                    })()}
                  </div>
                  <div className="text-4xl font-black text-white tracking-tighter">
                    {teamAGoals}
                  </div>
                </div>
                <div className="text-white/20 font-black text-2xl tracking-tighter uppercase mx-4">
                  VS
                </div>
                <div className="text-center flex-1 flex flex-col items-center">
                  <div
                    className="w-14 h-14 flex items-center justify-center drop-shadow-[0_0_10px_rgba(255,255,255,0.15)] mb-3"
                    style={{ color: teamB.color || TEAM_COLORS[1] }}
                  >
                    {(() => {
                      const IconB = getTeamIcon(teamB, "B");
                      return <IconB size={48} />;
                    })()}
                  </div>
                  <div className="text-4xl font-black text-white tracking-tighter">
                    {teamBGoals}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {/* Team A Penalties */}
                <div className="space-y-2">
                  {state.penalties.teamA.map((shot, idx) => {
                    const p = players.find(
                      (player) => player.id === shot.playerId,
                    );
                    return (
                      <div
                        key={`pen-a-${idx}`}
                        className="p-3 bg-white/5 border border-white/10 rounded-2xl space-y-3 relative overflow-hidden group shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-bold text-white truncate uppercase tracking-tight leading-none">
                              {p?.name}
                            </span>
                            <span className="text-[7px] text-white/40 font-bold uppercase tracking-widest mt-0.5">
                              Batedor {idx + 1}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onPenaltyToggle("A", idx)}
                            className={`flex-1 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${shot.success === true ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm" : "bg-white/5 text-emerald-400/20 hover:bg-white/10"}`}
                          >
                            <PiCheckCircleBold size={18} />
                          </button>
                          <button
                            onClick={() => onPenaltyToggle("A", idx)}
                            className={`flex-1 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${shot.success === false ? "bg-red-500/20 text-red-400 border border-red-500/30 shadow-sm" : "bg-white/5 text-red-400/20 hover:bg-white/10"}`}
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
                  {state.penalties.teamB.map((shot, idx) => {
                    const p = players.find(
                      (player) => player.id === shot.playerId,
                    );
                    return (
                      <div
                        key={`pen-b-${idx}`}
                        className="p-3 bg-white/5 border border-white/10 rounded-2xl space-y-3 relative overflow-hidden group shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-bold text-white truncate uppercase tracking-tight leading-none">
                              {p?.name}
                            </span>
                            <span className="text-[7px] text-white/40 font-bold uppercase tracking-widest mt-0.5">
                              Batedor {idx + 1}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onPenaltyToggle("B", idx)}
                            className={`flex-1 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${shot.success === true ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm" : "bg-white/5 text-emerald-400/20 hover:bg-white/10"}`}
                          >
                            <PiCheckCircleBold size={18} />
                          </button>
                          <button
                            onClick={() => onPenaltyToggle("B", idx)}
                            className={`flex-1 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${shot.success === false ? "bg-red-500/20 text-red-400 border border-red-500/30 shadow-sm" : "bg-white/5 text-red-400/20 hover:bg-white/10"}`}
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
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold uppercase tracking-widest text-[11px] rounded-2xl shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-30 disabled:saturate-50"
              >
                {teamAGoals === teamBGoals
                  ? "Placar Empatado"
                  : "Finalizar e Salvar"}
              </button>
            </div>
          )}

          {isLotteryOngoing && (
            <div className="flex flex-col items-center gap-6 py-4">
              <div className="relative">
                <motion.div
                  animate={
                    state.lottery.isSpinning
                      ? {
                          rotate: [0, 3600],
                          transition: {
                            duration: 3,
                            ease: [0.45, 0.05, 0.55, 0.95],
                          },
                        }
                      : {
                          rotate: state.lottery.winnerId
                            ? state.lottery.winnerId === teamA.id
                              ? 0
                              : 180
                            : 0,
                        }
                  }
                  className="w-56 h-56 rounded-full bg-white/5 border-[10px] border-emerald-500/20 relative shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center"
                >
                  <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-white/10 -translate-x-1/2" />

                  {/* Result Indicators */}
                  <div
                    className="absolute top-6 left-1/2 -translate-x-1/2 w-10 h-10 drop-shadow-md flex items-center justify-center"
                    style={{ color: teamA.color || TEAM_COLORS[0] }}
                  >
                    {(() => {
                      const IconA = getTeamIcon(teamA, "A");
                      return <IconA size={32} />;
                    })()}
                  </div>
                  <div
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 w-10 h-10 rotate-180 drop-shadow-md flex items-center justify-center"
                    style={{ color: teamB.color || TEAM_COLORS[1] }}
                  >
                    {(() => {
                      const IconB = getTeamIcon(teamB, "B");
                      return <IconB size={32} />;
                    })()}
                  </div>

                  {/* Marker */}
                  <div className="w-24 h-24 bg-[#0b1528] rounded-full border border-white/10 shadow-lg flex items-center justify-center z-10">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                      <SpinningBall size="sm" spin={state.lottery.isSpinning} />
                    </div>
                  </div>
                </motion.div>

                {/* Arrow Pointer */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[20px] border-t-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
              </div>

              {!state.lottery.winnerId && !state.lottery.isSpinning && (
                <div className="w-full space-y-6">
                  <div className="flex items-center gap-4 bg-white/5 p-5 rounded-[24px] border border-white/10 backdrop-blur-sm">
                    <div className="flex-1 flex flex-col items-center">
                      <div
                        className="w-10 h-10 flex items-center justify-center drop-shadow-lg mb-2"
                        style={{ color: teamA.color || TEAM_COLORS[0] }}
                      >
                        {(() => {
                          const IconA = getTeamIcon(teamA, "A");
                          return <IconA size={32} />;
                        })()}
                      </div>
                      <div className="text-[8px] font-bold text-white/60 uppercase tracking-widest">
                        {teamA.name}
                      </div>
                      <div className="mt-1 flex flex-wrap justify-center gap-0.5">
                        {[...teamA.playerIds]
                          .sort((a, b) => {
                            const pA = players.find((p) => p.id === a);
                            const pB = players.find((p) => p.id === b);
                            if (pA?.isGoalkeeper && !pB?.isGoalkeeper)
                              return -1;
                            if (!pA?.isGoalkeeper && pB?.isGoalkeeper) return 1;
                            return 0;
                          })
                          .map((pid, idx, arr) => {
                            const p = players.find(
                              (player) => player.id === pid,
                            );
                            return (
                              <span
                                key={`${pid}-${idx}-third`}
                                className="text-[6px] font-semibold text-white/50 uppercase"
                              >
                                {p?.name}
                                {idx < arr.length - 1 ? "," : ""}
                              </span>
                            );
                          })}
                      </div>
                    </div>
                    <div className="text-white/20 font-bold text-xs uppercase">
                      VS
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div
                        className="w-10 h-10 flex items-center justify-center drop-shadow-lg mb-2"
                        style={{ color: teamB.color || TEAM_COLORS[1] }}
                      >
                        {(() => {
                          const IconB = getTeamIcon(teamB, "B");
                          return <IconB size={32} />;
                        })()}
                      </div>
                      <div className="text-[8px] font-bold text-white/60 uppercase tracking-widest">
                        {teamB.name}
                      </div>
                      <div className="mt-1 flex flex-wrap justify-center gap-0.5">
                        {[...teamB.playerIds]
                          .sort((a, b) => {
                            const pA = players.find((p) => p.id === a);
                            const pB = players.find((p) => p.id === b);
                            if (pA?.isGoalkeeper && !pB?.isGoalkeeper)
                              return -1;
                            if (!pA?.isGoalkeeper && pB?.isGoalkeeper) return 1;
                            return 0;
                          })
                          .map((pid, idx, arr) => {
                            const p = players.find(
                              (player) => player.id === pid,
                            );
                            return (
                              <span
                                key={`${pid}-${idx}-fourth`}
                                className="text-[6px] font-semibold text-white/50 uppercase"
                              >
                                {p?.name}
                                {idx < arr.length - 1 ? "," : ""}
                              </span>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onLotterySpin}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold uppercase tracking-widest text-[11px] rounded-2xl shadow-lg shadow-blue-500/20 hover:opacity-90 transition-all active:scale-95"
                  >
                    Girar Roleta
                  </button>
                </div>
              )}

              {state.lottery.winnerId && !state.lottery.isSpinning && (
                <div className="w-full space-y-6 text-center">
                  <div className="bg-white/5 p-6 rounded-[32px] border border-white/10 animate-in fade-in zoom-in duration-500 backdrop-blur-sm">
                    <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-4">
                      Vencedor Sorteado
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className="w-20 h-20 flex items-center justify-center drop-shadow-xl"
                        style={{
                          color:
                            (state.lottery.winnerId === teamA.id
                              ? teamA.color
                              : teamB.color) || TEAM_COLORS[0],
                        }}
                      >
                        {(() => {
                          const isTeamA = state.lottery.winnerId === teamA.id;
                          const IconWinner = isTeamA
                            ? getTeamIcon(teamA, "A")
                            : getTeamIcon(teamB, "B");
                          return <IconWinner size={64} />;
                        })()}
                      </div>
                      <div className="text-xl font-black text-white uppercase tracking-tighter">
                        {state.lottery.winnerId === teamA.id
                          ? teamA.name
                          : teamB.name}
                      </div>

                      {/* Display winning team players */}
                      <div className="mt-2 flex flex-wrap justify-center gap-1.5 px-4">
                        {(state.lottery.winnerId === teamA.id
                          ? teamA.playerIds
                          : teamB.playerIds
                        ).map((pid, idx, arr) => {
                          const p = players.find((player) => player.id === pid);
                          return (
                            <span
                              key={`${pid}-${idx}-fifth`}
                              className="text-[8px] font-bold text-white/80 uppercase tracking-widest"
                            >
                              {p?.name}
                              {idx < arr.length - 1 ? " •" : ""}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onConfirm()}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold uppercase tracking-widest text-[11px] rounded-2xl shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-all active:scale-95"
                  >
                    Confirmar Resultado
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </motion.div>
    </div>
  );
};

const GoalCelebration = ({
  isOpen,
  scorerName,
  teamName,
  scorerPhoto,
}: {
  isOpen: boolean;
  scorerName: string;
  teamName: string;
  scorerPhoto?: string;
}) => {
  const theme = "light";
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
          className="z-20 bg-zinc-950 border-2 border-white/20 rounded-2xl shadow-2xl overflow-hidden flex items-center p-2 pr-8 max-w-[90%] sm:max-w-md gap-4 min-h-[100px]"
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
              <span className="text-zinc-600 flex items-center shrink-0">
                <IoPersonOutline size={40} />
              </span>
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
  onRemove,
}: {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateName: (id: string, name: string) => void;
  onUpdatePhoto: (id: string, photo: string) => void;
  onUpdateStars?: (id: string, stars: number) => void;
  onRemove?: (id: string) => void;
}) => {
  const theme = "light";
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
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-[280px] bg-[#0b0e17]/95 border border-white/10 text-white backdrop-blur-xl rounded-[24px] relative overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white/5 p-6 text-center relative overflow-hidden border-b border-white/5 flex flex-col items-center">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#34d399]/5 rounded-full -mr-8 -mt-8 blur-xl" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8 blur-lg" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/60 hover:text-white transition-all cursor-pointer"
          >
            <X size={14} />
          </button>

          <div className="relative group mt-2">
            <div className="w-20 h-20 rounded-full overflow-hidden border border-white/10 shadow-lg bg-white/5 flex items-center justify-center relative">
              {player.photo ? (
                <img
                  src={player.photo}
                  alt={player.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-white/40">
                  <IoPersonOutline size={32} />
                  <span className="text-[8px] font-black uppercase mt-1 tracking-widest">
                    Sem Foto
                  </span>
                </div>
              )}
            </div>

            <label className="absolute bottom-0 right-0 w-6 h-6 bg-[#34d399] hover:bg-[#34d399]/90 text-[#1e3d2f] rounded-full flex items-center justify-center cursor-pointer shadow-md transition-all active:scale-95">
              <Camera size={11} />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <div className="w-full mt-3 relative z-10">
            <div className="text-center w-full">
              <input
                type="text"
                defaultValue={player.name}
                onBlur={(e) => onUpdateName(player.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onUpdateName(player.id, e.currentTarget.value);
                    e.currentTarget.blur();
                  }
                }}
                className="w-full bg-transparent text-xl font-black uppercase tracking-tight text-white leading-none text-center outline-none border-b border-transparent focus:border-white/20 transition-all placeholder:text-white/40 py-1"
              />
              <div className="flex flex-wrap items-center justify-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={`modal-star-${star}`}
                    onClick={() =>
                      onUpdateStars && onUpdateStars(player.id, star)
                    }
                    className="transition-all active:scale-95 p-0.5"
                  >
                    <Star
                      size={16}
                      className={`${(player.stars || 0) >= star ? "fill-yellow-400 text-yellow-400" : "text-white/10"}`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center justify-center">
              <div className="text-lg font-black text-white leading-none mb-0.5">
                {player.goals}
              </div>
              <div className="text-[8px] font-bold uppercase tracking-widest text-white/50">
                Gols
              </div>
            </div>
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center justify-center">
              <div className="text-lg font-black text-white leading-none mb-0.5">
                {player.assists}
              </div>
              <div className="text-[8px] font-bold uppercase tracking-widest text-white/50">
                Assistências
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-[#34d399] hover:bg-[#34d399]/90 text-[#1e3d2f] shadow-lg shadow-[#34d399]/20 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 text-center cursor-pointer"
            >
              Confirmar
            </button>

            {onRemove && (
              <button
                onClick={() => {
                  onRemove(player.id);
                  onClose();
                }}
                className="w-full py-2.5 flex items-center justify-center gap-2 text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 rounded-xl font-bold uppercase tracking-widest text-[9px] transition-all active:scale-95 cursor-pointer"
              >
                <Trash2 size={12} />
                Remover
              </button>
            )}
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
  type: "goal";
  team: "A" | "B";
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

interface ScheduledMatch {
  id: string;
  name: string;
  date: number;
  location?: string;
  time?: string;
  status: "Confirmada" | "Pendente";
  confirmedPlayers: number;
  maxPlayers: number;
  imageUrl?: string;
}

type Screen = "players" | "teams" | "ranking" | "finance";

// --- Utils ---

const resizeImage = (
  base64Str: string,
  maxWidth = 150,
  maxHeight = 150,
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onerror = () => resolve(base64Str); // Fallback to original if error
    img.onload = () => {
      const canvas = document.createElement("canvas");
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
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
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
  },
};

const generateId = () => {
  try {
    if (
      typeof window !== "undefined" &&
      window.crypto &&
      window.crypto.randomUUID
    ) {
      return window.crypto.randomUUID();
    }
  } catch (e) {}
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const formatPlayerName = (name: string) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) return name;
  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1][0].toUpperCase();
  return `${firstName} ${lastInitial}.`;
};

const resolveMultipleGoalkeepers = (
  teams: Team[],
  playersList: Player[],
  playersPerTeam?: number,
): { newTeams: Team[]; changed: boolean } => {
  const getGks = (team: Team) =>
    team?.playerIds.filter(
      (id) => playersList.find((p) => p.id === id)?.isGoalkeeper,
    ) || [];
  const getLinePlayers = (team: Team) =>
    team?.playerIds.filter(
      (id) => !playersList.find((p) => p.id === id)?.isGoalkeeper,
    ) || [];

  let changed = false;
  // Deep copy for mutation
  let allTeamsNow = teams.map((t) => ({
    ...t,
    playerIds: [...t.playerIds],
  }));

  // Step 1: Ensure all teams have GKs at index 0 if they have any
  for (let i = 0; i < allTeamsNow.length; i++) {
    const currentTeam = allTeamsNow[i];
    const gks = getGks(currentTeam);
    const line = getLinePlayers(currentTeam);
    const sorted = [...gks, ...line];

    if (JSON.stringify(currentTeam.playerIds) !== JSON.stringify(sorted)) {
      allTeamsNow[i].playerIds = sorted;
      changed = true;
    }
  }

  // Step 2: Balance goalkeepers (ensure max 1 per team if possible)
  for (let i = 0; i < allTeamsNow.length; i++) {
    let team = allTeamsNow[i];
    let gks = getGks(team);
    while (gks.length > 1) {
      let gkToMove = gks.pop()!;
      let receiverFound = false;

      // Try to find a receiver team that has 0 GKs
      for (let j = 0; j < allTeamsNow.length; j++) {
        if (i !== j && getGks(allTeamsNow[j]).length === 0) {
          const receiverLine = getLinePlayers(allTeamsNow[j]);

          if (receiverLine.length > 0) {
            // Swap GK with first line player of receiver (to keep GK at index 0)
            const lineToSwap = receiverLine[0];
            allTeamsNow[i].playerIds = allTeamsNow[i].playerIds.filter(
              (id) => id !== gkToMove,
            );
            allTeamsNow[i].playerIds.push(lineToSwap); // Add line player to giver team

            allTeamsNow[j].playerIds = [
              gkToMove,
              ...allTeamsNow[j].playerIds.filter((id) => id !== lineToSwap),
            ];

            receiverFound = true;
            changed = true;
            break;
    } else if (
            playersPerTeam !== undefined &&
            allTeamsNow[j].playerIds.length < playersPerTeam
          ) {
            // Empty team or team with space, just move them
            allTeamsNow[i].playerIds = allTeamsNow[i].playerIds.filter(
              (id) => id !== gkToMove,
            );
            allTeamsNow[j].playerIds.unshift(gkToMove); // Push to front
            receiverFound = true;
            changed = true;
            break;
          }
        }
      }
      if (!receiverFound) break;
      // Refresh gks for current team after move
      gks = getGks(allTeamsNow[i]);
    }
  }

  // Final pass: ensure index 0 again for safety after movements
  if (changed) {
    allTeamsNow = allTeamsNow.map((team) => {
      const gks = getGks(team);
      const line = getLinePlayers(team);
      return { ...team, playerIds: [...gks, ...line] };
    });
  }

  return { newTeams: allTeamsNow, changed };
};

const SpinningBall = ({
  size = "md",
  className = "",
  spin = true,
  color = "#39FF14",
  patternColor = "#000000",
  isIcon = false,
}: {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  spin?: boolean;
  color?: string;
  patternColor?: string;
  isIcon?: boolean;
}) => {
  const theme = "light";
  const sizeClasses = {
    xs: "w-[18px] h-[18px]",
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-16 h-16",
  };

  return (
    <motion.div
      animate={spin ? { rotate: 360 } : {}}
      transition={
        spin
          ? {
              repeat: Infinity,
              duration: 2,
              ease: "linear",
            }
          : {}
      }
      className={`${sizeClasses[size]} rounded-full relative flex items-center justify-center z-10 ${className}`}
      style={{ backgroundColor: color }}
    >
      {/* Ball pattern */}
      <div
        className="absolute inset-0 rounded-full border-2 overflow-hidden"
        style={{ borderColor: isIcon ? patternColor : "rgba(0,0,0,0.2)" }}
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full"
          style={{ backgroundColor: patternColor, opacity: isIcon ? 0.8 : 0.1 }}
        />
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-0.5"
          style={{ backgroundColor: patternColor, opacity: isIcon ? 0.8 : 0.1 }}
        />
        <div
          className="absolute inset-0 border-[6px] border-transparent rounded-full"
          style={{ borderTopColor: patternColor, opacity: isIcon ? 0.7 : 0.05 }}
        />
      </div>
    </motion.div>
  );
};

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[3000] flex flex-col items-center justify-center bg-[#0b0e17]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center gap-4"
      >
        <motion.img
          src="/icone%20logo.png"
          alt="FutQuina Logo"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-24 h-24 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col items-center"
        >
          <span className="text-3xl uppercase tracking-tighter text-white font-black leading-none">
            FutQuina
          </span>
          <span className="text-[10px] text-white/50 tracking-[0.2em] mt-1 uppercase font-bold">
            Gestão de pelada
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
};

const FutQuinaLogo = ({
  className = "",
  size = "md",
  colorClass: overrideColor,
  titleColorClass,
  subColorClass,
  style,
  align = "center",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  colorClass?: string;
  titleColorClass?: string;
  subColorClass?: string;
  style?: React.CSSProperties;
  align?: "start" | "center" | "end";
}) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  };
  const subSizeClasses = {
    sm: "text-[8px]",
    md: "text-[10px]",
    lg: "text-xs",
  };
  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 48,
  };

  const colorClass = overrideColor || "text-zinc-500 font-bold";
  const textAlignmentClass =
    align === "start" ? "text-left" : align === "end" ? "text-right" : "text-center";

  return (
    <div
      className={`flex items-center gap-1.5 ${textAlignmentClass} ${className}`}
      style={style}
    >
      <div className="relative shrink-0 flex items-center justify-center">
        <img
          src="/icone%20logo.png"
          alt="FutQuina Logo"
          width={iconSizes[size]}
          height={iconSizes[size]}
          className="object-contain"
        />
      </div>
      <span
        className={`${size === "sm" ? "text-sm" : size === "md" ? "text-xl" : "text-3xl"} uppercase tracking-tighter font-staatliches leading-none bg-gradient-to-br from-zinc-400 to-zinc-200 bg-clip-text text-transparent py-1`}
      >
        FutQuina
      </span>
    </div>
  );
};

const RouletteOverlay = () => {
  const theme = "light";
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
                className={`border-[0.5px] border-brand-primary/10 ${i % 2 === 0 ? "bg-brand-primary/5" : "bg-transparent"}`}
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
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 0.5, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
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
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-12 bg-brand-primary z-20"
          style={{ clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)" }}
        />
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
          Sorteando Times
        </h2>
        <div className="flex items-center justify-center gap-2">
          <div
            className="w-2 h-2 rounded-full bg-brand-primary animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 rounded-full bg-brand-primary animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 rounded-full bg-brand-primary animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

const SavingPeladaOverlay = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-zinc-900/95 backdrop-blur-2xl p-6"
    >
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 12 }}
        className="w-24 h-24 rounded-[32px] bg-brand-primary flex items-center justify-center mb-8 shadow-lg shadow-brand-primary/20 text-black"
      >
        <IoIosSave size={48} />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
          Salvando Pelada
        </h2>
        <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-6 px-4">
          Armazenando presença, confrontos e próximos
        </p>
        <div className="flex items-center justify-center gap-2">
          {[0, 150, 300].map((delay) => (
            <div
              key={delay}
              className="w-2 h-2 rounded-full bg-brand-primary animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Animated Counter ---
function AnimatedCounter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number;
    let animationFrameId: number;
    const duration = 1000; // 1 second animation
    const initialValue = displayValue;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayValue(Math.round(initialValue + (value - initialValue) * ease));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [value]);

  return <>{displayValue}</>;
}

// --- App Component ---

function GroupApp({
  groupId,
  onBackToHome,
}: {
  groupId: string;
  onBackToHome: () => void;
}) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = safeLocalStorage.getItem(`futquina_theme_${groupId}`);
    return (saved as "light" | "dark") || "light";
  });

  useEffect(() => {
    safeLocalStorage.setItem(`futquina_theme_${groupId}`, theme);
  }, [theme, groupId]);

  // -- Presence Mode --
  const urlParams = new URLSearchParams(window.location.search);
  const [isPresenceMode, setIsPresenceMode] = useState<boolean>(
    urlParams.get("presence") === "true",
  );
  const [presencePlayerId, setPresencePlayerId] = useState<string>("");
  const [presenceCode, setPresenceCode] = useState<string>("");

  // --- State ---
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [adminPin, setAdminPin] = useState<string>("");
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const isSwitchingMatch = useRef(false);

  useEffect(() => {
    isSwitchingMatch.current = true;

    const loadFromKey = (prefix: string, setter: any, defaultVal: any) => {
      const key = selectedMatchId
        ? `${prefix}_${groupId}_${selectedMatchId}`
        : `${prefix}_${groupId}`;
      // When no match selected, we clear the states for "Organization Dashboard" privacy/clarity
      if (!selectedMatchId) {
        setter(defaultVal);
        return;
      }

      const saved = safeLocalStorage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setter(parsed);
  } catch (e) {
          setter(defaultVal);
        }
      } else {
        setter(defaultVal);
      }
    };

    loadFromKey("futquina_players", setPlayers, []);
    loadFromKey("futquina_expenses", setExpenses, []);
    loadFromKey("futquina_payments", setPayments, []);
    loadFromKey("futquina_teams", setTeams, []);
    loadFromKey("futquina_match_history", setMatchHistory, []);
    loadFromKey("futquina_match", setMatch, {
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
      teamBIndex: -1,
    });
    loadFromKey("futquina_session_player_ids", setSessionPlayerIds, []);

    setTimeout(() => {
      isSwitchingMatch.current = false;
    }, 100);
  }, [selectedMatchId, groupId]);


  useEffect(() => {
    const fetchGroupData = async () => {
      const { data } = await supabase
        .from("groups")
        .select("admin_pin")
        .eq("id", groupId)
        .maybeSingle();
      if (data?.admin_pin) {
        setAdminPin(data.admin_pin);
      }
    };
    fetchGroupData();
  }, [groupId]);

  const [currentScreen, setCurrentScreen] = useState<Screen>("players");

  const [isInitialSetupFlow, setIsInitialSetupFlow] = useState(false);
  const [firstSetupDone, setFirstSetupDone] = useState(() => {
    const saved = safeLocalStorage.getItem(
      `futquina_first_setup_done_${groupId}`,
    );
    return saved === "true";
  });
  const [shouldPulseConfig, setShouldPulseConfig] = useState(false);

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
    const saved = safeLocalStorage.getItem(
      `futquina_available_years_${groupId}`,
    );
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
  const [tempFee, setTempFee] = useState("");
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [isPrintPaymentsOnly, setIsPrintPaymentsOnly] = useState(false);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [financeSubScreen, setFinanceSubScreen] = useState<
    "mensalidade" | "balanco" | "menu"
  >(() => {
    const saved = safeLocalStorage.getItem(
      `futquina_finance_subscreen_${groupId}`,
    );
    return (saved as "mensalidade" | "balanco" | "menu") || "balanco";
  });
  const [orgProTab, setOrgProTab] = useState<
    "painel" | "acesso" | "confirmados" | "admins" | "supabase"
  >("painel");
  const [authMode, setAuthMode] = useState<"pin" | "email" | "signup">("pin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authPin, setAuthPin] = useState("");
  const [appAdmins, setAppAdmins] = useState<any[]>([]);
  const [jogadoresExternos, setJogadoresExternos] = useState<any[]>([]);
  const [presencasExternas, setPresencasExternas] = useState<any[]>([]);

  useEffect(() => {
    safeLocalStorage.setItem(
      `futquina_finance_subscreen_${groupId}`,
      financeSubScreen,
    );
  }, [financeSubScreen, groupId]);
  const [manualAdjustment, setManualAdjustment] = useState<number>(() => {
    const saved = safeLocalStorage.getItem(
      `futquina_manual_adjustment_${groupId}`,
    );
    return saved ? Number(saved) : 0;
  });
  const [isEditingTotal, setIsEditingTotal] = useState(false);
  const [totalInput, setTotalInput] = useState("");

  useEffect(() => {
    safeLocalStorage.setItem(
      `futquina_manual_adjustment_${groupId}`,
      manualAdjustment.toString(),
    );
  }, [manualAdjustment, groupId]);
  const [expenses, setExpenses] = useState<
    { id: string; name: string; amount: number; date: number }[]
  >(() => {
    const saved = safeLocalStorage.getItem(`futquina_expenses_${groupId}`);
    try {
      return saved ? JSON.parse(saved) || [] : [];
} catch (e) {
      return [];
    }
  });
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState({ name: "", amount: "" });
  const [panelModal, setPanelModal] = useState<
    "cadastrados" | "externos" | "assist" | "confirmados" | "admins" | null
  >(null);

  useEffect(() => {
    if (isSwitchingMatch.current) return;
    const key = selectedMatchId
      ? `futquina_expenses_${groupId}_${selectedMatchId}`
      : `futquina_expenses_${groupId}`;
    safeLocalStorage.setItem(key, JSON.stringify(expenses));
  }, [expenses, selectedMatchId, groupId]);
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = safeLocalStorage.getItem(`futquina_players_${groupId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) return [];
        const uniquePlayers: Player[] = [];
        const seenIds = new Set<string>();
        for (const p of parsed) {
          if (!p || typeof p !== "object") continue;
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

  const [scheduledMatches, setScheduledMatches] = useState<ScheduledMatch[]>(
    () => {
      const saved = safeLocalStorage.getItem(
        `futquina_scheduled_matches_${groupId}`,
      );
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const uniqueMatches: ScheduledMatch[] = [];
            const seenMatchIds = new Set<string>();
            for (const m of parsed) {
              if (!m || typeof m !== "object") continue;
              const id = m.id && !seenMatchIds.has(m.id) ? m.id : generateId();
              uniqueMatches.push({ ...m, id });
              seenMatchIds.add(id);
            }
            return uniqueMatches;
          }
          return [];
  } catch (e) {
          return [];
        }
      }
      return [
        {
          id: "default-1",
          name: "Pelada do Domingo",
          date: new Date(2026, 4, 25).getTime(),
          location: "Arena Fut 7",
          time: "08:00 - 10:00",
          status: "Confirmada",
          confirmedPlayers: 14,
          maxPlayers: 16,
        },
      ];
    },
  );

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const handleSwapMatches = () => {
    if (scheduledMatches.length > 1) {
      setScheduledMatches((prev) => {
        const next = [...prev];
        const first = next.shift();
        if (first) next.push(first);
        return next;
      });
    }
  };

  const [matchConfigOpenId, setMatchConfigOpenId] = useState<string | null>(
    null,
  );
  const [expandedMatchCards, setExpandedMatchCards] = useState<string[]>([]);
  const [matchToDelete, setMatchToDelete] = useState<ScheduledMatch | null>(
    null,
  );
  const [newMatchName, setNewMatchName] = useState("");
  const [newMatchDay, setNewMatchDay] = useState("Segunda");
  const [newMatchTime, setNewMatchTime] = useState("08:00");
  const [newMatchImage, setNewMatchImage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMatchImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    safeLocalStorage.setItem(
      `futquina_scheduled_matches_${groupId}`,
      JSON.stringify(scheduledMatches),
    );
  }, [scheduledMatches, groupId]);

  const [showEndPeladaConfirm, setShowEndPeladaConfirm] = useState(false);
  const [isSavingPeladaFlow, setIsSavingPeladaFlow] = useState(false);

  const handleScheduleMatch = () => {
    if (newMatchName.trim()) {
      const days = [
        "Domingo",
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado",
      ];
      const today = new Date();
      const currentDayIndex = today.getDay();
      const targetDayIndex = days.indexOf(newMatchDay);

      let diff = targetDayIndex - currentDayIndex;
      if (diff < 0) diff += 7;

      const matchDate = new Date();
      matchDate.setDate(today.getDate() + diff);
      matchDate.setHours(8, 0, 0, 0); 

      if (editingMatchId) {
        setScheduledMatches((prev) =>
          prev.map((m) =>
            m.id === editingMatchId
              ? {
                  ...m,
                  name: newMatchName.trim(),
                  date: matchDate.getTime(),
                  time: newMatchTime,
                  imageUrl: newMatchImage || undefined,
                }
              : m,
          ),
        );
        setEditingMatchId(null);
} else {
        const newMatch: ScheduledMatch = {
          id: generateId(),
          name: newMatchName.trim(),
          date: matchDate.getTime(),
          location: "Arena a definir",
          time: newMatchTime,
          status: "Pendente",
          confirmedPlayers: 0,
          maxPlayers: 16,
          imageUrl: newMatchImage || undefined,
        };
        setScheduledMatches((prev) => [...prev, newMatch]);
        setSelectedMatchId(newMatch.id);
        setCurrentScreen("players");
        setShowAddPlayerSection(true);
        setTeamsTab("configuracao");
        setPlayersTab("configuracao");
      }

      setFixedColors({ teamA: null, teamB: null, enabled: false });
      setOrgProSettings((prev) => ({ ...prev, allowFixedGoalkeeper: false }));
      setNewMatchName("");
      setNewMatchDay("Segunda");
      setNewMatchTime("08:00");
      setNewMatchImage("");
      setShowScheduleModal(false);
    }
  };
  const [sessionPlayerIds, setSessionPlayerIds] = useState<string[]>(() => {
    const saved = safeLocalStorage.getItem(
      `futquina_session_player_ids_${groupId}`,
    );
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
  const [orgProData, setOrgProData] = useState<{
    [playerId: string]: { code: string };
  }>(() => {
    const saved = safeLocalStorage.getItem(`futquina_org_pro_${groupId}`);
    return saved ? JSON.parse(saved) : {};
  });
  useEffect(() => {
    safeLocalStorage.setItem(
      `futquina_org_pro_${groupId}`,
      JSON.stringify(orgProData),
    );
  }, [orgProData, groupId]);

  const [orgProSettings, setOrgProSettings] = useState<{
    maxAbsences: number | null;
    requirePaymentUpToDate: boolean;
    allowFixedGoalkeeper: boolean;
    matchDayOfWeek: number | null;
    matchTime: string;
    appliedDate: number | null;
  }>(() => {
    const saved = safeLocalStorage.getItem(`futquina_org_settings_${groupId}`);
    return saved
      ? { allowFixedGoalkeeper: false, ...JSON.parse(saved) }
      : {
          maxAbsences: null,
          requirePaymentUpToDate: false,
          allowFixedGoalkeeper: false,
          matchDayOfWeek: null,
          matchTime: "",
          appliedDate: null,
        };
  });

  const [tempOrgProSettings, setTempOrgProSettings] = useState(orgProSettings);

  useEffect(() => {
    safeLocalStorage.setItem(
      `futquina_org_settings_${groupId}`,
      JSON.stringify(orgProSettings),
    );
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
          if (!p || typeof p !== "object") continue;
          const key = `${p.playerId}-${p.year}`;
          if (!seenKeys.has(key)) {
            uniquePayments.push({
              ...p,
              id: p.id || key,
            });
            seenKeys.add(key);
    } else {
            // Merge months if duplicate
            const existing = uniquePayments.find(
              (up) => up.playerId === p.playerId && up.year === p.year,
            );
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

        const allSameGreen =
          parsed.length > 1 &&
          parsed.every((t: any) => t && t.color === "#4ade80");
        const allSameBlack =
          parsed.length > 1 &&
          parsed.every((t: any) => t && t.color === "#1a1a1a");
        const forceRecolor = allSameGreen || allSameBlack;

        for (const t of parsed) {
          if (!t || typeof t !== "object") continue;
          const teamId = t.id && !seenTeamIds.has(t.id) ? t.id : generateId();
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
          if (forceRecolor || !parsedColor || parsedColor === "#1a1a1a") {
            parsedColor = getNextTeamColor(uniqueTeams);
          }

          uniqueTeams.push({
            ...t,
            id: teamId,
            playerIds: uniquePlayerIds,
            color: parsedColor,
          });
        }
        return uniqueTeams;
} catch (e) {
        console.error("Error parsing teams from localStorage", e);
      }
    }
    return [
      {
        id: generateId(),
        name: "Time A",
        playerIds: [],
        iconIdx: 0,
        color: TEAM_COLORS[0],
      },
      {
        id: generateId(),
        name: "Time B",
        playerIds: [],
        iconIdx: 1,
        color: TEAM_COLORS[1],
      },
    ];
  });

  // Clear teams when all players are deleted
  useEffect(() => {
    if (players.length === 0 && teams.length > 0) {
      setTeams([]);
    }
  }, [players.length, teams.length]);

  const [match, setMatch] = useState<
    MatchState & { teamAIndex: number; teamBIndex: number }
  >(() => {
    const saved = safeLocalStorage.getItem(`futquina_match_${groupId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed || typeof parsed !== "object")
          throw new Error("Invalid match data");
        const uniqueEvents: MatchEvent[] = [];
        const seenEventIds = new Set<string>();
        const events = Array.isArray(parsed.events) ? parsed.events : [];
        for (const e of events) {
          if (!e || typeof e !== "object") continue;
          const id = e.id && !seenEventIds.has(e.id) ? e.id : generateId();
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
          events: uniqueEvents,
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
      teamBIndex: -1,
    };
  });

  const [matchHistory, setMatchHistory] = useState<MatchResult[]>(() => {
    const saved = safeLocalStorage.getItem(`futquina_match_history_${groupId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) return [];
        const uniqueHistory: any[] = [];
        const seenHistoryIds = new Set<string>();
        for (const h of parsed) {
          if (!h || typeof h !== "object") continue;
          const hId = h.id && !seenHistoryIds.has(h.id) ? h.id : generateId();
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
    const saved = safeLocalStorage.getItem(
      `futquina_has_randomized_${groupId}`,
    );
    return saved === "true";
  });
  const [pendingAssist, setPendingAssist] = useState<{
    team: "A" | "B";
    goalPlayerId: string;
    eventId: string;
  } | null>(null);
  const [showRandomizeModal, setShowRandomizeModal] = useState(false);
  const [showTeamWarningModal, setShowTeamWarningModal] = useState(false);

  const handlePlayerGoal = (playerId: string, team: "A" | "B") => {
    if (!match.isActive || match.isPaused) {
      setToast({
        message: "⏱️ O cronômetro precisa estar rodando!",
        type: "warning",
      });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    const eventId = generateId();
    const newEvent: MatchEvent = {
      id: eventId,
      type: "goal",
      team,
      playerId,
      timestamp: match.config.duration * 60 - match.timeRemaining,
    };

    setMatch((prev) => ({
      ...prev,
      scoreA: team === "A" ? prev.scoreA + 1 : prev.scoreA,
      scoreB: team === "B" ? prev.scoreB + 1 : prev.scoreB,
      events: [...prev.events, newEvent],
    }));

    setPendingAssist({ team, goalPlayerId: playerId, eventId });
    playWhistle();
  };

  const handleAssistSelection = (assistId: string | null) => {
    if (!pendingAssist) return;

    if (assistId) {
      setMatch((prev) => ({
        ...prev,
        events: prev.events.map((e) =>
          e.id === pendingAssist.eventId ? { ...e, assistId } : e,
        ),
      }));
      setToast({ message: "⚽️ GOL! Assistência registrada", type: "success" });
} else {
      setToast({ message: "⚽️ GOL! Placar atualizado", type: "info" });
    }

    setPendingAssist(null);
    setTimeout(() => setToast(null), 3000);
  };
  const [showFormationChoiceModal, setShowFormationChoiceModal] =
    useState(false);
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
        if (parsed && typeof parsed === "object") {
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
  const [scorerTeam, setScorerTeam] = useState<"A" | "B" | null>(null);
  const [replacingPlayer, setReplacingPlayer] = useState<{
    teamIndex: number;
    removedPlayerId: string;
  } | null>(null);
  const [playerEvents, setPlayerEvents] = useState<{
    [playerId: string]: { type: "swap" | "up" | "down"; timestamp: number };
  }>({});

  const prevTeamsRef = useRef<Team[]>([]);
  useEffect(() => {
    const currentTeams = teams;
    const prevTeams = prevTeamsRef.current;

    if (
      prevTeams.length > 0 &&
      currentTeams.length > 0 &&
      prevTeams !== currentTeams
    ) {
      const now = Date.now();
      const newEvents = { ...playerEvents };
      let changed = false;

      const prevMap = new Map<string, number>();
      prevTeams.forEach((t, i) =>
        t.playerIds.forEach((pid) => prevMap.set(pid, i)),
      );

      const currMap = new Map<string, number>();
      currentTeams.forEach((t, i) =>
        t.playerIds.forEach((pid) => currMap.set(pid, i)),
      );

      currMap.forEach((currIndex, pid) => {
        if (prevMap.has(pid)) {
          const prevIndex = prevMap.get(pid)!;
          if (currIndex < prevIndex) {
            if (
              newEvents[pid]?.type !== "swap" ||
              now - newEvents[pid].timestamp > 1000
            ) {
              newEvents[pid] = { type: "up", timestamp: now };
              changed = true;
            }
          } else if (currIndex > prevIndex) {
            if (
              newEvents[pid]?.type !== "swap" ||
              now - newEvents[pid].timestamp > 1000
            ) {
              newEvents[pid] = { type: "down", timestamp: now };
              changed = true;
            }
          }
        }
      });
      if (changed) {
        setPlayerEvents(newEvents);
      }
    }
    prevTeamsRef.current = currentTeams;
  }, [teams]); // Omit playerEvents from dependencies to prevent excessive re-renders

  useEffect(() => {
    const timer = setInterval(() => {
      setPlayerEvents((prev) => {
        const now = Date.now();
        const next = { ...prev };
        let changed = false;
        Object.keys(next).forEach((pid) => {
          if (now - next[pid].timestamp > 15000) {
            delete next[pid];
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const [showMatchSettingsModal, setShowMatchSettingsModal] = useState(false);
  const [showConfigMenu, setShowConfigMenu] = useState(false);
  const [showTimeEditModal, setShowTimeEditModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState<{
    teamIdx: number;
    color: string;
  } | null>(null);
  const [fixedColors, setFixedColors] = useState<{
    teamA: string | null;
    teamB: string | null;
    enabled: boolean;
  }>(() => {
    const saved = safeLocalStorage.getItem(`futquina_fixed_colors_${groupId}`);
    return saved
      ? JSON.parse(saved)
      : { teamA: null, teamB: null, enabled: false };
  });

  const getTeamIcon = (team: Team | undefined, position: "A" | "B") => {
    if (fixedColors.enabled) {
      const fixedColor = position === "A" ? fixedColors.teamA : fixedColors.teamB;
      if (fixedColor) {
        const idx = SHIRT_COLORS.indexOf(fixedColor);
        if (idx !== -1) return TEAM_ICONS[idx];
      }
    }
    if (!team) return TEAM_ICONS[position === "A" ? 0 : 1];
    return TEAM_ICONS[team.iconIdx ?? (position === "A" ? 0 : 1)];
  };

  const [autoCompleteTeams, setAutoCompleteTeams] = useState(() => {
    const saved = safeLocalStorage.getItem(
      `futquina_auto_complete_teams_${groupId}`,
    );
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (groupId) {
      safeLocalStorage.setItem(
        `futquina_auto_complete_teams_${groupId}`,
        JSON.stringify(autoCompleteTeams),
      );
    }
  }, [autoCompleteTeams, groupId]);

  useEffect(() => {
    // Only run auto-complete if enabled and there are players to assign
    const availableSessionPlayersList = players
      .filter((p) => p.isAvailable && sessionPlayerIds.includes(p.id))
      .sort((a, b) => (a.arrivedAt || 0) - (b.arrivedAt || 0));

    if (
      !autoCompleteTeams ||
      !match.config.playersPerTeam ||
      availableSessionPlayersList.length === 0
    )
      return;

    setTeams((prev) => {
      const limit = match.config.playersPerTeam;
      const allPlayerIds = availableSessionPlayersList.map((p) => p.id);
      
      const expectedTeamCount = Math.max(
        2,
        Math.ceil(allPlayerIds.length / limit),
      );

      // Separate GKs and Line, maintaining order within each group
      const allGks = availableSessionPlayersList
        .filter((p) => p.isGoalkeeper)
        .map((p) => p.id);
      const allLine = availableSessionPlayersList
        .filter((p) => !p.isGoalkeeper)
        .map((p) => p.id);

      // Generate the target assignment to check if we need an update
      const targetAssignment: string[][] = [];
      let gkPtr = 0;
      let linePtr = 0;

      for (let i = 0; i < expectedTeamCount; i++) {
        const teamIds: string[] = [];
        
        // 1. Try to take one GK if available
        if (gkPtr < allGks.length) {
          teamIds.push(allGks[gkPtr]);
          gkPtr++;
        }
        
        // 2. Fill the rest with Line players
        while (teamIds.length < limit && linePtr < allLine.length) {
          teamIds.push(allLine[linePtr]);
          linePtr++;
        }

        // 3. If still has space and we have extra GKs (not assigned to future teams yet), use them as line players
        // This is a backup to ensure everyone gets assigned
        const remainingTeams = expectedTeamCount - 1 - i;
        const extraGksCount = allGks.length - gkPtr;
        const gksNeededForFuture = Math.min(extraGksCount, remainingTeams);
        const gksAvailableNow = extraGksCount - gksNeededForFuture;

        for (let j = 0; j < gksAvailableNow && teamIds.length < limit; j++) {
          teamIds.push(allGks[gkPtr]);
          gkPtr++;
        }

        targetAssignment.push(teamIds);
      }

      // Special case: if we still have players left (extreme case), push them somewhere
      while (linePtr < allLine.length) {
        // Find first team with space
        const teamWithSpace = targetAssignment.find(t => t.length < limit);
        if (teamWithSpace) {
          teamWithSpace.push(allLine[linePtr]);
  } else {
          break; // No more space anywhere
        }
        linePtr++;
      }
      while (gkPtr < allGks.length) {
        const teamWithSpace = targetAssignment.find(t => t.length < limit);
        if (teamWithSpace) {
          teamWithSpace.push(allGks[gkPtr]);
  } else {
          break; // No more space anywhere
        }
        gkPtr++;
      }

      const isDifferent =
        prev.length !== expectedTeamCount ||
        targetAssignment.some((ids, i) => {
          const prevIds = prev[i]?.playerIds || [];
          return (
            ids.length !== prevIds.length ||
            !ids.every((id, idx) => id === prevIds[idx])
          );
        });

      if (!isDifferent) return prev;

      const newTeams: Team[] = [];
      for (let i = 0; i < expectedTeamCount; i++) {
        const chunk = targetAssignment[i];
        const existingTeam = prev[i];

        newTeams.push({
          id: existingTeam?.id || `team-auto-${i}-${generateId()}`,
          name: existingTeam?.name || `Time ${String.fromCharCode(65 + i)}`,
          playerIds: chunk,
          iconIdx: existingTeam?.iconIdx ?? getNextTeamIconIdx(newTeams),
          color: existingTeam?.color ?? getNextTeamColor(newTeams),
          lastMatchStatus: existingTeam?.lastMatchStatus,
        });
      }

      const { newTeams: resolvedTeams } = resolveMultipleGoalkeepers(
        newTeams,
        players,
        match?.config?.playersPerTeam,
      );
      return resolvedTeams;
    });
  }, [
    autoCompleteTeams,
    match?.config?.playersPerTeam,
    sessionPlayerIds,
    players,
    teams,
  ]);

  useEffect(() => {
    // Globally ensure no team assumes > 1 goalkeeper if possible.
    const hasMultipleGks = teams.some(
      (t) =>
        t.playerIds.filter(
          (id) => players.find((p) => p.id === id)?.isGoalkeeper,
        ).length > 1,
    );
    if (hasMultipleGks) {
      const { newTeams, changed } = resolveMultipleGoalkeepers(
        teams,
        players,
        match?.config?.playersPerTeam,
      );
      if (changed) {
        setTeams(newTeams);
      }
    }
  }, [teams, players, match?.config?.playersPerTeam]);

  useEffect(() => {
    if (groupId) {
      safeLocalStorage.setItem(
        `futquina_fixed_colors_${groupId}`,
        JSON.stringify(fixedColors),
      );
    }
  }, [fixedColors, groupId]);

  const [showEventModal, setShowEventModal] = useState<{
    team: "A" | "B" | number;
  } | null>(null);
  const [showInsufficientPlayersModal, setShowInsufficientPlayersModal] =
    useState(false);
  const [showArrivalStepGuide, setShowArrivalStepGuide] = useState(false);
  const [arrivalCardIndex, setArrivalCardIndex] = useState(0);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [showAddPlayerSection, setShowAddPlayerSection] = useState(false);
  const [showPlayerSummary, setShowPlayerSummary] = useState(false);
  const [isFlashingConfig, setIsFlashingConfig] = useState(false);
  const [shrinkEditButton, setShrinkEditButton] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentScreen === "players" && !showAddPlayerSection) {
      setShrinkEditButton(false);
      timer = setTimeout(() => {
        setShrinkEditButton(true);
      }, 7000);
} else {
      setShrinkEditButton(false);
    }
    return () => clearTimeout(timer);
  }, [currentScreen, showAddPlayerSection]);

  useEffect(() => {
    if (isFlashingConfig) {
      const timer = setTimeout(() => {
        setIsFlashingConfig(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isFlashingConfig]);

  const [toast, setToast] = useState<{
    message: string;
    type: "info" | "warning" | "gray" | "success";
  } | null>(null);
  const confirmEndPelada = () => {
    setShowEndPeladaConfirm(false);
    setIsSavingPeladaFlow(true);
    
    // Simulate saving delay
    setTimeout(() => {
      handleEndPelada();
      setIsSavingPeladaFlow(false);
    }, 2000);
  };

  const handleEndPelada = () => {
    // Resets
    setSessionPlayerIds([]);
    setMatchHistory([]);
    setTeams([]);
    setMatch({
      isActive: false,
      isPaused: true,
      timeRemaining: 10 * 60,
      config: { duration: 10, playersPerTeam: 5, goalLimit: 2 },
      scoreA: 0,
      scoreB: 0,
      events: [],
      startTime: null,
      hasEnded: false,
    });
    setLastMatchResult(null);
    setCurrentScreen("teams");
    setTeamsTab("chegada");
    setShowGlobalSettings(false);

    // Also update all players to not available
    setPlayers(prev => prev.map(p => ({ ...p, isAvailable: false, arrivedAt: undefined })));
    
    setToast({ message: "Pelada encerrada e dados resetados!", type: "success" });
    setTimeout(() => setToast(null), 3000);
  };
  const [showIconPicker, setShowIconPicker] = useState<number | null>(null);
  const [selectedScorerId, setSelectedScorerId] = useState<string | null>(null);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [swappingPlayerId, setSwappingPlayerId] = useState<string | null>(null);
  const [fillingVacancyForTeam, setFillingVacancyForTeam] = useState<
    number | null
  >(null);
  const [showStartMatchConfirm, setShowStartMatchConfirm] = useState(false);
  const [tieBreaker, setTieBreaker] = useState<TieBreakerState>({
    showSelection: false,
    type: "none",
    penalties: { teamA: [], teamB: [], isFinished: false, winnerId: null },
    lottery: { isSpinning: false, winnerId: null },
  });
  const [playersTab, setPlayersTab] = useState<"jogadores" | "configuracao">(
    "configuracao",
  );

  const [teamsTab, setTeamsTab] = useState<
    "menu" | "configuracao" | "chegada" | "historico" | "proximos"
  >("historico");

  const [swipeDirection, setSwipeDirection] = useState(0);

  const navigateTeamsTab = (
    target: "menu" | "configuracao" | "chegada" | "historico" | "proximos",
  ) => {
    const tabs = ["configuracao", "chegada", "historico", "proximos"];
    const currentIndex = tabs.indexOf(teamsTab as any);
    const targetIndex = tabs.indexOf(target);
    if (currentIndex !== -1 && targetIndex !== -1) {
      setSwipeDirection(targetIndex > currentIndex ? -1 : 1);
    }
    setTeamsTab(target);
  };

  const [rankingTab, setRankingTab] = useState<
    "geral" | "artilharia" | "assistencias"
  >(() => {
    const saved = safeLocalStorage.getItem(`futquina_ranking_tab_${groupId}`);
    return (saved as "geral" | "artilharia" | "assistencias") || "geral";
  });

  useEffect(() => {
    safeLocalStorage.setItem(`futquina_ranking_tab_${groupId}`, rankingTab);
  }, [rankingTab, groupId]);
  const [showNotEnoughPlayersModal, setShowNotEnoughPlayersModal] =
    useState(false);
  const [showLogoAnimation, setShowLogoAnimation] = useState(false);
  const [showCloseWarningModal, setShowCloseWarningModal] = useState(false);
  const [flashingTeamIds, setFlashingTeamIds] = useState<string[]>([]);

  const [showQuickAddPlayerModal, setShowQuickAddPlayerModal] = useState<
    number | null
  >(null);
  const [duplicatePlayerName, setDuplicatePlayerName] = useState<{
    name: string;
    callback: (newName: string) => void;
  } | null>(null);
  const [showPlayerActionsModal, setShowPlayerActionsModal] = useState<{
    teamIndex: number;
    playerId: string;
  } | null>(null);
  const [showQueuePlayerModal, setShowQueuePlayerModal] = useState<{
    teamIndex: number;
    playerId: string;
    showMoveOptions?: boolean;
  } | null>(null);
  const [movingPlayers, setMovingPlayers] = useState<{
    teamId: string;
    playerIds: string[];
  } | null>(null);
  const [isSelectingDestination, setIsSelectingDestination] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const [showAssistSelection, setShowAssistSelection] = useState<{
    teamIndex: number;
    scorerId: string;
  } | null>(null);
  const [playerManagementModal, setPlayerManagementModal] =
    useState<Player | null>(null);

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetAppConfirm, setShowResetAppConfirm] = useState(false);
  const [showResetStatsConfirm, setShowResetStatsConfirm] = useState(false);
  const [showAutoCompleteModal, setShowAutoCompleteModal] = useState(false);
  const [showGlobalSettings, setShowGlobalSettings] = useState(false);
  const [showGoalAnimation, setShowGoalAnimation] = useState<{
    scorerName: string;
    teamName: string;
    scorerPhoto?: string;
  } | null>(null);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [highlightFirstPlayer, setHighlightFirstPlayer] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const teamRects = useRef<DOMRect[]>([]);

  const handleMainScroll = (e: React.UIEvent<HTMLElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    
    setShowScrollTop((prev) => {
      if (currentScrollY > 150 && !prev) return true;
      if (currentScrollY <= 150 && prev) return false;
      return prev;
    });

    if (currentScrollY > lastScrollY.current + 10) {
      if (toast) {
        setToast(null);
      }
    }
    
    lastScrollY.current = currentScrollY;
  };

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
    touchEndX.current = null;
    touchEndY.current = null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (
      touchStartX.current === null ||
      touchEndX.current === null ||
      touchStartY.current === null ||
      touchEndY.current === null
    ) {
      return;
    }

    // Check if target is inside horizontal scrollable container
    let isHorizontalScroll = false;
    let target = e.target as HTMLElement | null;
    while (target && target !== e.currentTarget) {
      const className = target.className || "";
      if (typeof className === "string" && (className.includes("overflow-x-auto") || className.includes("custom-scrollbar"))) {
        isHorizontalScroll = true;
        break;
      }
      target = target.parentElement as HTMLElement | null;
    }

    if (isHorizontalScroll) return;

    const distanceX = touchStartX.current - touchEndX.current;
    const distanceY = touchStartY.current - touchEndY.current;

    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;

    if (Math.abs(distanceX) > Math.abs(distanceY) * 1.5) {
      let handledTabSwipe = false;

      if (currentScreen === "teams") {
        const tabs = ["configuracao", "chegada", "historico", "proximos"];
        const curTabIdx = tabs.indexOf(teamsTab);
        if (isLeftSwipe && curTabIdx < tabs.length - 1) {
          navigateTeamsTab(tabs[curTabIdx + 1] as any);
          handledTabSwipe = true;
  } else if (isRightSwipe && curTabIdx > 0) {
          navigateTeamsTab(tabs[curTabIdx - 1] as any);
          handledTabSwipe = true;
        }
      } else if (currentScreen === "finance") {
        const tabs = ["balanco", "mensalidade"];
        const curTabIdx = tabs.indexOf(financeSubScreen);
        if (curTabIdx !== -1) {
          if (isLeftSwipe && curTabIdx < tabs.length - 1) {
            setFinanceSubScreen(tabs[curTabIdx + 1] as any);
            handledTabSwipe = true;
    } else if (isRightSwipe && curTabIdx > 0) {
            setFinanceSubScreen(tabs[curTabIdx - 1] as any);
            handledTabSwipe = true;
          }
        }
      } else if (currentScreen === "ranking") {
        const tabs = ["geral", "artilharia", "assistencias"];
        const curTabIdx = tabs.indexOf(rankingTab);
        if (curTabIdx !== -1) {
          if (isLeftSwipe && curTabIdx < tabs.length - 1) {
            setRankingTab(tabs[curTabIdx + 1] as any);
            handledTabSwipe = true;
    } else if (isRightSwipe && curTabIdx > 0) {
            setRankingTab(tabs[curTabIdx - 1] as any);
            handledTabSwipe = true;
          }
        }
      }

      /* Disabling screen swipe to navigate as per user request
      if (!handledTabSwipe) {
        const screens: Screen[] = ["players", "teams", "ranking", "finance"];
        const currentIndex = screens.indexOf(currentScreen);

        if (isLeftSwipe && currentIndex < screens.length - 1) {
          setSwipeDirection(1);
          setCurrentScreen(screens[currentIndex + 1]);
  } else if (isRightSwipe && currentIndex > 0) {
          setSwipeDirection(-1);
          setCurrentScreen(screens[currentIndex - 1]);
        }
      }
      */
    }
  };

  const playWhistle = () => {
    const audio = new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
    );
    audio.play().catch((e) => console.log("Audio play failed:", e));
  };

  const playCheer = () => {
    const audio = new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3",
    );
    audio.play().catch((e) => console.log("Audio play failed:", e));
  };

  const handleGoalkeeperSwap = (pAId: string, pBId: string) => {
    setPlayers((prev) => {
      const pA = prev.find((p) => p.id === pAId);
      const pB = prev.find((p) => p.id === pBId);
      if (!pA || !pB) return prev;
      
      return prev.map((p) => {
        if (p.id === pAId) {
          const updates: any = { arrivedAt: pB.arrivedAt };
          if (pA.isGoalkeeper || pB.isGoalkeeper) updates.isGoalkeeper = !!pB.isGoalkeeper;
          return { ...p, ...updates };
        }
        if (p.id === pBId) {
          const updates: any = { arrivedAt: pA.arrivedAt };
          if (pA.isGoalkeeper || pB.isGoalkeeper) updates.isGoalkeeper = !!pA.isGoalkeeper;
          return { ...p, ...updates };
        }
        return p;
      });
    });
  };

  const scrollToTeam = (teamIndex: number) => {
    setTimeout(() => {
      const el = document.getElementById(`team-card-${teamIndex}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 150);
  };

  const handleResetApp = async () => {
    try {
      setPlayers([]);
      setTeams([
        {
          id: generateId(),
          name: "Time A",
          playerIds: [],
          iconIdx: 0,
          color: TEAM_COLORS[0],
        },
        {
          id: generateId(),
          name: "Time B",
          playerIds: [],
          iconIdx: 1,
          color: TEAM_COLORS[1],
        },
      ]);
      setMatch({
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
        teamBIndex: -1,
      });
      setMatchHistory([]);
      setPayments([]);
      setExpenses([]);
      setSessionPlayerIds([]);
      setHasRandomized(false);
      setLastMatchResult(null);
      setOrgProData({});
      setOrgProSettings({
        maxAbsences: null,
        requirePaymentUpToDate: false,
        matchDayOfWeek: null,
        matchTime: "",
        appliedDate: null,
      });
      setFixedColors({ teamA: null, teamB: null, enabled: false });
      setMonthlyFee(5);
      setAvailableYears([new Date().getFullYear()]);
      setSelectedYear(new Date().getFullYear());
      setManualAdjustment(0);
      setAdminPin("");
      setFirstSetupDone(false);

      // Clear localStorage
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("futquina_") && key.includes(groupId)) {
          localStorage.removeItem(key);
        }
      });

      // Clear Supabase
      if (groupId) {
        await Promise.all([
          supabase.from("players").delete().eq("group_id", groupId),
          supabase.from("teams").delete().eq("group_id", groupId),
          supabase.from("match_history").delete().eq("group_id", groupId),
          supabase.from("match_state").delete().eq("group_id", groupId),
          supabase.from("payments").delete().eq("group_id", groupId),
          supabase.from("transactions").delete().eq("group_id", groupId),
          supabase
            .from("groups")
            .update({
              admin_pin: null,
              monthly_fee: 5,
              selected_year: new Date().getFullYear(),
              manual_adjustment: 0,
              available_years: [new Date().getFullYear()],
              first_setup_done: false,
            })
            .eq("id", groupId),
        ]);
      }

      setToast({ message: "Aplicativo zerado com sucesso!", type: "success" });
      setShowResetAppConfirm(false);
      setShowGlobalSettings(false);
      setCurrentScreen("players");
      setTimeout(() => setToast(null), 3000);
} catch (e) {
      console.error("Error resetting app:", e);
      setToast({ message: "Erro ao zerar aplicativo", type: "warning" });
      setTimeout(() => setToast(null), 3000);
    }
  };

  // --- Persistence ---
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  useEffect(() => {
    async function loadData() {
      setIsDataLoaded(false);
      try {
        const results = await Promise.allSettled([
          supabase
            .from("players")
            .select("*")
            .eq("group_id", groupId)
            .order("name"),
          supabase.from("teams").select("*").eq("group_id", groupId),
          supabase.from("payments").select("*").eq("group_id", groupId),
          supabase.from("match_history").select("*").eq("group_id", groupId),
          supabase
            .from("match_state")
            .select("*")
            .eq("group_id", groupId)
            .maybeSingle(),
          supabase.from("transactions").select("*").eq("group_id", groupId),
          supabase.from("groups").select("*").eq("id", groupId).maybeSingle(),
        ]);

        const playersData =
          results[0].status === "fulfilled" ? results[0].value?.data : null;
        const teamsData =
          results[1].status === "fulfilled" ? results[1].value?.data : null;
        const paymentsData =
          results[2].status === "fulfilled" ? results[2].value?.data : null;
        const matchHistoryData =
          results[3].status === "fulfilled" ? results[3].value?.data : null;
        const matchStateData =
          results[4].status === "fulfilled" ? results[4].value?.data : null;
        const transactionsData =
          results[5].status === "fulfilled" ? results[5].value?.data : null;
        const groupData =
          results[6].status === "fulfilled" ? results[6].value?.data : null;

        if (playersData && playersData.length > 0) {
          const uniquePlayersMap = new Map();
          playersData.forEach((p) => {
            if (!uniquePlayersMap.has(p.id)) {
              uniquePlayersMap.set(p.id, {
                id: p.id,
                name: p.name,
                photo: p.photo || undefined,
                isAvailable: p.is_available,
                arrivedAt: p.arrived_at || undefined,
                goals: 0,
                assists: 0,
              });
            }
          });
          setPlayers(Array.from(uniquePlayersMap.values()));
        }
        if (teamsData && teamsData.length > 0) {
          const loadedTeams: Team[] = [];

          const allSameGreen =
            teamsData.length > 1 &&
            teamsData.every((t) => t.color === "#4ade80");
          const allSameBlack =
            teamsData.length > 1 &&
            teamsData.every((t) => t.color === "#1a1a1a");
          const forceRecolor = allSameGreen || allSameBlack;

          for (const t of teamsData) {
            let parsedColor = t.color;
            if (forceRecolor || !parsedColor || parsedColor === "#1a1a1a") {
              parsedColor = getNextTeamColor(loadedTeams);
            }
            loadedTeams.push({
              id: t.id,
              name: t.name,
              color: parsedColor,
              playerIds: t.player_ids || [],
              iconIdx: t.iconIdx ?? getNextTeamIconIdx(loadedTeams),
            });
          }
          setTeams(loadedTeams);
        }
        if (paymentsData && paymentsData.length > 0) {
          setPayments(
            paymentsData.map((p) => ({
              id: p.id || `${p.player_id}-${p.year}`,
              playerId: p.player_id,
              year: p.year,
              months: p.months || {},
              monthlyFee: p.monthly_fee || 0,
            })),
          );
        }
        if (matchHistoryData && matchHistoryData.length > 0) {
          setMatchHistory(
            matchHistoryData.map((h) => ({
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
              playedAt: h.played_at,
            })),
          );
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
            config: matchStateData.config || {
              duration: 15,
              playersPerTeam: 5,
              scoreLimit: 10,
            },
          });
        }
        if (transactionsData && transactionsData.length > 0) {
          setExpenses(
            transactionsData.map((t) => ({
              id: t.id,
              name: t.name,
              amount: t.amount,
              date: t.date,
            })),
          );
        }
        if (groupData) {
          if (groupData.admin_pin) setAdminPin(groupData.admin_pin);
          if (groupData.monthly_fee)
            setMonthlyFee(Number(groupData.monthly_fee));
          if (groupData.selected_year) setSelectedYear(groupData.selected_year);
          if (groupData.manual_adjustment)
            setManualAdjustment(Number(groupData.manual_adjustment));
          if (
            groupData.available_years &&
            Array.isArray(groupData.available_years)
          ) {
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

    const playersChannel = supabase
      .channel(`public:players:${groupId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "players",
          filter: `group_id=eq.${groupId}`,
        },
        (payload) => {
          const updatedPlayer = payload.new;
          setPlayers((prev) =>
            prev.map((p) =>
              p.id === updatedPlayer.id
                ? {
                    ...p,
                    isAvailable: updatedPlayer.is_available,
                    arrivedAt: updatedPlayer.arrived_at,
                  }
                : p,
            ),
          );
        },
      )
      .subscribe();

    const paymentsChannel = supabase
      .channel(`public:payments:${groupId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "payments",
          filter: `group_id=eq.${groupId}`,
        },
        (payload) => {
          // Just reload all payments data to keep it simple when it changes
          supabase
            .from("payments")
            .select("*")
            .eq("group_id", groupId)
            .then(({ data }) => {
              if (data) {
                setPayments(
                  data.map((p) => ({
                    id: p.id,
                    playerId: p.player_id,
                    month: p.month,
                    year: p.year,
                    amount: p.amount,
                    paidAt: p.paid_at,
                    isHalf: p.is_half,
                  })),
                );
              }
            });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(playersChannel);
      supabase.removeChannel(paymentsChannel);
    };
  }, [groupId, isPresenceMode, isDataLoaded]);

  useSupabaseArraySync(
    "players",
    groupId,
    players,
    (p: any, gid) => ({
      id: p.id,
      group_id: gid,
      name: p.name,
      photo: p.photo || null,
      is_available: p.isAvailable,
      arrived_at: p.arrivedAt || null,
    }),
    isDataLoaded,
    isPresenceMode,
    true,
  );

  useSupabaseArraySync(
    "teams",
    groupId,
    teams,
    (t: any, gid) => ({
      id: t.id,
      group_id: gid,
      name: t.name,
      color: t.color,
      player_ids: t.playerIds,
    }),
    isDataLoaded,
    isPresenceMode,
    true,
  );

  useSupabaseArraySync(
    "payments",
    groupId,
    payments,
    (p: any, gid) => ({
      id: p.id || `${p.playerId}-${p.year}`,
      group_id: gid,
      player_id: p.playerId,
      year: p.year,
      months: p.months,
      monthly_fee: p.monthlyFee,
    }),
    isDataLoaded,
    isPresenceMode,
    true,
  );

  useSupabaseArraySync(
    "match_history",
    groupId,
    matchHistory,
    (m: any, gid) => ({
      id: m.id,
      group_id: gid,
      team_a_id: m.teamAId || null,
      team_b_id: m.teamBId || null,
      team_a_name: m.teamAName,
      team_b_name: m.teamBName,
      score_a: m.scoreA,
      score_b: m.scoreB,
      winner_id: m.winnerId || null,
      loser_id: m.loserId || null,
      events: m.events,
      played_at: m.playedAt,
    }),
    isDataLoaded,
    isPresenceMode,
    true,
  );

  useSupabaseArraySync(
    "transactions",
    groupId,
    expenses,
    (e: any, gid) => ({
      id: e.id,
      group_id: gid,
      name: e.name,
      amount: e.amount,
      date: e.date,
    }),
    isDataLoaded,
    isPresenceMode,
    true,
  );

  useEffect(() => {
    if (!isDataLoaded || isPresenceMode) return;
    supabase
      .from("groups")
      .upsert(
        {
          id: groupId,
          monthly_fee: monthlyFee,
          selected_year: selectedYear,
          manual_adjustment: manualAdjustment,
          available_years: availableYears,
          admin_pin: adminPin,
        },
        { onConflict: "id" },
      )
      .then();
  }, [
    monthlyFee,
    selectedYear,
    manualAdjustment,
    availableYears,
    adminPin,
    isDataLoaded,
    groupId,
    isPresenceMode,
  ]);

  useEffect(() => {
    if (!isDataLoaded || isPresenceMode) return;
    supabase
      .from("match_state")
      .upsert({
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
        config: match.config,
      })
      .then();
  }, [match, isDataLoaded, groupId, isPresenceMode]);

  // Automatically clear teams and reset match if no players exist or all are unavailable
  useEffect(() => {
    if (
      players.length === 0 ||
      (players.length > 0 && players.every((p) => !p.isAvailable))
    ) {
      if (teams.length > 0) {
        setTeams([]);
      }
      if (
        match.isActive ||
        match.teamAIndex !== -1 ||
        match.teamBIndex !== -1
      ) {
        setMatch((prev) => ({
          ...prev,
          isActive: false,
          isPaused: true,
          teamAIndex: -1,
          teamBIndex: -1,
          scoreA: 0,
          scoreB: 0,
        }));
      }
    }
  }, [
    players,
    teams.length,
    match.isActive,
    match.teamAIndex,
    match.teamBIndex,
  ]);

  useEffect(() => {
    if (isSwitchingMatch.current) return;
    const key = selectedMatchId
      ? `futquina_players_${groupId}_${selectedMatchId}`
      : `futquina_players_${groupId}`;
    safeLocalStorage.setItem(key, JSON.stringify(players));
  }, [players, selectedMatchId, groupId]);

  useEffect(() => {
    if (isSwitchingMatch.current) return;
    const key = selectedMatchId
      ? `futquina_teams_${groupId}_${selectedMatchId}`
      : `futquina_teams_${groupId}`;
    safeLocalStorage.setItem(key, JSON.stringify(teams));
    // Automatically remove empty teams
    if (teams.some((t) => (t.playerIds?.length || 0) === 0)) {
      setTeams((prev) => {
        const filtered = prev.filter((t) => (t.playerIds?.length || 0) > 0);
        if (prev.length <= 2 && filtered.length < 2) return prev;
        return filtered;
      });
    }
  }, [teams, selectedMatchId, groupId]);

  useEffect(() => {
    if (isSwitchingMatch.current) return;
    const key = selectedMatchId
      ? `futquina_match_${groupId}_${selectedMatchId}`
      : `futquina_match_${groupId}`;
    safeLocalStorage.setItem(key, JSON.stringify(match));
  }, [match, selectedMatchId, groupId]);

  useEffect(() => {
    if (isSwitchingMatch.current) return;
    const key = selectedMatchId
      ? `futquina_last_result_${groupId}_${selectedMatchId}`
      : `futquina_last_result_${groupId}`;
    safeLocalStorage.setItem(key, JSON.stringify(lastMatchResult));
  }, [lastMatchResult, selectedMatchId, groupId]);

  useEffect(() => {
    if (isSwitchingMatch.current) return;
    const key = selectedMatchId
      ? `futquina_payments_${groupId}_${selectedMatchId}`
      : `futquina_payments_${groupId}`;
    safeLocalStorage.setItem(key, JSON.stringify(payments));
  }, [payments, selectedMatchId, groupId]);

  useEffect(() => {
    if (isSwitchingMatch.current) return;
    const key = selectedMatchId
      ? `futquina_session_player_ids_${groupId}_${selectedMatchId}`
      : `futquina_session_player_ids_${groupId}`;
    safeLocalStorage.setItem(key, JSON.stringify(sessionPlayerIds));
  }, [sessionPlayerIds, selectedMatchId, groupId]);

  useEffect(() => {
    safeLocalStorage.setItem(
      `futquina_monthly_fee_${groupId}`,
      monthlyFee.toString(),
    );
  }, [monthlyFee]);

  useEffect(() => {
    safeLocalStorage.setItem(
      `futquina_selected_year_${groupId}`,
      selectedYear.toString(),
    );
  }, [selectedYear]);

  useEffect(() => {
    safeLocalStorage.setItem(
      `futquina_available_years_${groupId}`,
      JSON.stringify(availableYears),
    );
  }, [availableYears]);

  useEffect(() => {
    if (isSwitchingMatch.current) return;
    const key = selectedMatchId
      ? `futquina_match_history_${groupId}_${selectedMatchId}`
      : `futquina_match_history_${groupId}`;
    safeLocalStorage.setItem(key, JSON.stringify(matchHistory));
  }, [matchHistory, selectedMatchId, groupId]);

  useEffect(() => {
    safeLocalStorage.setItem(
      `futquina_has_randomized_${groupId}`,
      String(hasRandomized),
    );
  }, [hasRandomized]);

  useEffect(() => {
    setIsPrintMode(false);
    if (currentScreen === "finance") {
      setFinanceSubScreen("balanco");
} else {
      setFinanceSubScreen("menu");
    }
    if (currentScreen === "ranking") {
      setRankingTab("geral");
      if (mainRef.current) {
        mainRef.current.scrollTop = 0;
      }
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

  useEffect(() => {
    if (matchConfigOpenId) {
      const timer = setTimeout(() => {
        setMatchConfigOpenId(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [matchConfigOpenId]);

  // Sync com tabelas externas (jogadores e presencas)
  useEffect(() => {
    const fetchExternos = async () => {
      const { data: jogs } = await supabase
        .from("jogadores")
        .select("*")
        .order("created_at", { ascending: false });
      const { data: pres } = await supabase
        .from("presencas")
        .select("*")
        .order("created_at", { ascending: false });

      if (jogs) setJogadoresExternos(jogs);
      if (pres) setPresencasExternas(pres);
    };

    fetchExternos();

    // Realtime subscriptions
    const jogsChannel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "jogadores" },
        (payload) => {
          fetchExternos();
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "presencas" },
        (payload) => {
          fetchExternos();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(jogsChannel);
    };
  }, []);

  useEffect(() => {
    if (showEqualizerModal && equalizerData) {
      const targetTeam = teams[equalizerData.targetTeamIndex];
      const otherTeam = teams[equalizerData.otherTeamIndex];

      if (
        targetTeam &&
        otherTeam &&
        targetTeam.playerIds.length === otherTeam.playerIds.length
      ) {
        setShowEqualizerModal(false);
      }
    }
  }, [teams, showEqualizerModal, equalizerData]);

  // --- Match Timer ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (match.isActive && !match.isPaused) {
      interval = setInterval(() => {
        setMatch((prev) => {
          if (prev.timeRemaining <= 0) return prev;
          const nextTime = prev.timeRemaining - 1;
          if (nextTime <= 0) {
            return { ...prev, timeRemaining: 0, isPaused: true };
          }
          return { ...prev, timeRemaining: nextTime };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [match.isActive, match.isPaused]);

  // --- Match End Detection ---
  useEffect(() => {
    if (
      match.isActive &&
      !match.hasEnded &&
      !tieBreaker.showSelection &&
      players.length > 0
    ) {
      const isTimeUp = match.timeRemaining === 0;
      const isGoalLimitReached =
        match.scoreA >= match.config.goalLimit ||
        match.scoreB >= match.config.goalLimit;

      if (isTimeUp || isGoalLimitReached) {
        finishMatch();
      }
    }
  }, [
    match.timeRemaining,
    match.scoreA,
    match.scoreB,
    match.isActive,
    match.hasEnded,
    match.config.goalLimit,
    teams,
    match.teamAIndex,
    match.teamBIndex,
    tieBreaker.showSelection,
    players.length,
  ]);

  // --- Handlers ---

  useEffect(() => {
    localStorage.setItem(
      `futquina_match_history_${groupId}`,
      JSON.stringify(matchHistory),
    );
  }, [matchHistory]);

  useEffect(() => {
    localStorage.setItem(
      `futquina_has_randomized_${groupId}`,
      String(hasRandomized),
    );
  }, [hasRandomized]);

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "AGORA";
    if (minutes < 60) return `${minutes} MINUTOS ATRÁS`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} HORAS ATRÁS`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "1 DIA ATRÁS";
    return `${days} DIAS ATRÁS`;
  };

  const addPlayer = (name: string, photo?: string) => {
    if (!name.trim()) return;
    const trimmedName = name.trim();

    if (
      players.some((p) => p.name.toLowerCase() === trimmedName.toLowerCase())
    ) {
      setDuplicatePlayerName({
        name: trimmedName,
        callback: (newName) => {
          const isAnyAvailable = players.some((p) => p.isAvailable);
          const newPlayer: Player = {
            id: generateId(),
            name: newName.trim(),
            goals: 0,
            assists: 0,
            isAvailable: isAnyAvailable,
            photo: photo,
            arrivedAt: isAnyAvailable ? Date.now() : undefined,
            stars: 3,
          };
          setPlayers((prev) => [...prev, newPlayer]);
          if (isAnyAvailable) {
            setSessionPlayerIds((prev) => [...prev, newPlayer.id]);
          }
        },
      });
      return;
    }

    const isAnyAvailable = players.some((p) => p.isAvailable);

    const newPlayer: Player = {
      id: generateId(),
      name: trimmedName,
      goals: 0,
      assists: 0,
      isAvailable: isAnyAvailable,
      photo: photo,
      arrivedAt: isAnyAvailable ? Date.now() : undefined,
      stars: 3,
    };
    setPlayers((prev) => [...prev, newPlayer]);
    if (isAnyAvailable) {
      setSessionPlayerIds((prev) => [...prev, newPlayer.id]);
    }
    setToast({
      message: `${trimmedName} adicionado com sucesso!`,
      type: "success",
    });
    setTimeout(() => setToast(null), 3000);
  };

  const handleImportContacts = async () => {
    if (!("contacts" in navigator && "select" in (navigator as any).contacts)) {
      setToast({
        message: "Seu dispositivo não suporta importação de contatos.",
        type: "info",
      });
      return;
    }

    try {
      const props = ["name", "icon"];
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
          setToast({
            message: `${addedCount} contatos importados!`,
            type: "success",
          });
        }
      }
    } catch (err) {
      console.error("Contact Picker Error:", err);
    }
  };

  const addBulkPlayers = (text: string) => {
    setIsAiProcessing(true);
    setShouldPulseConfig(true);

    setTimeout(() => {
      const lines = text.split("\n");
      const newPlayers: Player[] = [];

      // Patterns to ignore: dates (DD/MM, DD-MM), times (HH:MM), common titles/descriptions
      const ignorePatterns = [
        /\d{1,2}[\/\-]\d{1,2}/, // Dates
        /\d{1,2}:\d{2}/, // Times
        /^(lista|jogadores|convocados|presença|confirmados|futebol|pelada|horário|data|local|valor)/i, // Titles
        /^\s*$/, // Empty lines
      ];

      const existingNames = new Set(players.map((p) => p.name.toLowerCase()));

      const isAnyAvailable = players.some((p) => p.isAvailable);

      lines.forEach((line, i) => {
        // Remove common prefixes: "1.", "1-", "-", "*", "•" but keep numbers that are part of the name
        let name = line.replace(/^[\d\.\-\*\•\s]+(?=\s|[A-Z])/, "").trim();
        if (!name) name = line.replace(/^[\d\.\-\*\•\s]+/, "").trim();

        // Check if the line should be ignored
        const shouldIgnore = ignorePatterns.some((pattern) => pattern.test(name));

        if (name && name.length > 1 && !shouldIgnore) {
          if (existingNames.has(name.toLowerCase())) return;
          existingNames.add(name.toLowerCase());

          newPlayers.push({
            id: generateId(),
            name,
            goals: 0,
            assists: 0,
            isAvailable: isAnyAvailable,
            arrivedAt: isAnyAvailable ? Date.now() + i : undefined,
            stars: 3,
          });
        }
      });

      if (newPlayers.length > 0) {
        setPlayers((prev) => [...prev, ...newPlayers]);
        if (isAnyAvailable) {
          setSessionPlayerIds((prev) => [
            ...prev,
            ...newPlayers.map((p) => p.id),
          ]);
        }
      }
      setIsAiProcessing(false);
    }, 1500);
  };

  const finishQuickAddPlayer = (name: string, teamIndex: number) => {
    const newPlayer: Player = {
      id: generateId(),
      name: name.trim(),
      goals: 0,
      assists: 0,
      isAvailable: true,
      arrivedAt: Date.now(),
      stars: 3,
    };
    setPlayers((prev) => [...prev, newPlayer]);
    setSessionPlayerIds((prev) => [...prev, newPlayer.id]);

    const team = teams[teamIndex];
    if (team && team.playerIds.length >= match.config.playersPerTeam) {
      const nextLetter = String.fromCharCode(65 + teams.length);
      const iconIdx = getNextTeamIconIdx(teams);
      const newTeam = {
        id: generateId(),
        name: `Time ${nextLetter}`,
        playerIds: [newPlayer.id],
        iconIdx,
        color: getNextTeamColor(teams),
      };
      setTeams((prev) => [...prev, newTeam]);
      setToast({
        message: `✅ Time formado! Próximo: ${newTeam.name}`,
        type: "info",
      });
      setShowQuickAddPlayerModal(teams.length);
} else {
      setTeams((prev) =>
        prev.map((t, idx) =>
          idx === teamIndex
            ? { ...t, playerIds: [...t.playerIds, newPlayer.id] }
            : t,
        ),
      );
    }

    const input = document.getElementById(
      "quick-player-name",
    ) as HTMLInputElement;
    if (input) input.value = "";
  };

  const quickAddPlayer = (name: string, teamIndex: number) => {
    if (!name.trim()) return;
    const trimmedName = name.trim();

    if (
      match.isActive &&
      (teamIndex === match.teamAIndex || teamIndex === match.teamBIndex)
    ) {
      setToast({
        message:
          "Não é possível adicionar jogadores a times em campo. Finalize a partida primeiro.",
        type: "gray",
      });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    if (
      players.some((p) => p.name.toLowerCase() === trimmedName.toLowerCase())
    ) {
      setDuplicatePlayerName({
        name: trimmedName,
        callback: (newName) => finishQuickAddPlayer(newName, teamIndex),
      });
      return;
    }

    finishQuickAddPlayer(trimmedName, teamIndex);
  };

  const addPlayerToTeam = (playerId: string, teamIndex: number) => {
    if (
      match.isActive &&
      (teamIndex === match.teamAIndex || teamIndex === match.teamBIndex)
    ) {
      setToast({
        message: "Não é possível adicionar jogadores a times em campo.",
        type: "gray",
      });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    const team = teams[teamIndex];
    if (team && team.playerIds.length >= match.config.playersPerTeam) {
      const nextLetter = String.fromCharCode(65 + teams.length);
      const iconIdx = getNextTeamIconIdx(teams);
      const newTeam = {
        id: generateId(),
        name: `Time ${nextLetter}`,
        playerIds: [playerId],
        iconIdx,
        color: getNextTeamColor(teams),
      };
      setTeams((prev) => [...prev, newTeam]);
      setToast({
        message: `✅ Time formado! Próximo: ${newTeam.name}`,
        type: "info",
      });
      setShowQuickAddPlayerModal(teams.length);
} else {
      setTeams((prev) =>
        prev.map((t, idx) =>
          idx === teamIndex
            ? { ...t, playerIds: [...t.playerIds, playerId] }
            : t,
        ),
      );
    }
  };

  // Ensure match indices are always valid
  useEffect(() => {
    if (teams.length === 0) {
      if (match.teamAIndex !== -1 || match.teamBIndex !== -1) {
        setMatch((prev) => ({ ...prev, teamAIndex: -1, teamBIndex: -1 }));
      }
      return;
    }

    setMatch((prev) => {
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
    const playerToRemove = players.find((p) => p.id === id);
    if (!playerToRemove) return;

    setPlayers(players.filter((p) => p.id !== id));
    setSessionPlayerIds((prev) => prev.filter((pid) => pid !== id));
    setPayments((prev) => prev.filter((p) => p.playerId !== id));

    setTeams((prev) => {
      // Regroup all players from all teams to maintain order and fill gap
      const allPlayerIds = prev
        .flatMap((t) => t.playerIds)
        .filter((pid) => pid !== id);
      const limit = match.config.playersPerTeam;
      const newTeams: Team[] = [];

      for (let i = 0; i < allPlayerIds.length; i += limit) {
        const chunk = allPlayerIds.slice(i, i + limit);
        const teamIndex = Math.floor(i / limit);
        const existingTeam = prev[teamIndex];

        newTeams.push({
          id: existingTeam?.id || `team-regrouped-${teamIndex}-${generateId()}`,
          name: `Time ${String.fromCharCode(65 + teamIndex)}`,
          playerIds: chunk,
          iconIdx: existingTeam?.iconIdx ?? getNextTeamIconIdx(newTeams),
          color: existingTeam?.color ?? getNextTeamColor(newTeams),
        });
      }

      // Update match indices
      setMatch((prevMatch) => {
        let newA = prevMatch.teamAIndex;
        let newB = prevMatch.teamBIndex;
        if (newA >= newTeams.length) newA = -1;
        if (newB >= newTeams.length) newB = -1;
        return { ...prevMatch, teamAIndex: newA, teamBIndex: newB };
      });

      return newTeams;
    });
  };

  const removePlayerFromTeam = (
    tIndex: number,
    playerId: string,
    cascade: boolean = true,
  ) => {
    const isWinner =
      lastMatchResult &&
      ((teams[tIndex]?.id === lastMatchResult.teamAId &&
        lastMatchResult.scoreA > lastMatchResult.scoreB) ||
        (teams[tIndex]?.id === lastMatchResult.teamBId &&
          lastMatchResult.scoreB > lastMatchResult.scoreA));

    if (isWinner && cascade) {
      setReplacingPlayer({ teamIndex: tIndex, removedPlayerId: playerId });
      return;
    }

    if (!cascade) {
      setTeams((prev) => {
        const newTeams = [...prev].map((t) => ({
          ...t,
          playerIds: [...t.playerIds],
        }));
        if (newTeams[tIndex]) {
          newTeams[tIndex].playerIds = newTeams[tIndex].playerIds.filter(
            (id) => id !== playerId,
          );
        }
        return newTeams.filter((t) => t.playerIds.length > 0);
      });
      return;
    }

    setTeams((prev) => {
      // For Ordem de Chegada, we always regroup from start to maintain the queue
      const allPlayerIds = prev
        .flatMap((t) => t.playerIds)
        .filter((id) => id !== playerId);
      const limit = match.config.playersPerTeam;
      const newTeams: Team[] = [];

      for (let i = 0; i < allPlayerIds.length; i += limit) {
        const chunk = allPlayerIds.slice(i, i + limit);
        const teamIndex = Math.floor(i / limit);
        const existingTeam = prev[teamIndex];

        newTeams.push({
          id: existingTeam?.id || `team-cascade-${teamIndex}-${generateId()}`,
          name: `Time ${String.fromCharCode(65 + teamIndex)}`,
          playerIds: chunk,
          iconIdx: existingTeam?.iconIdx ?? getNextTeamIconIdx(newTeams),
          color: existingTeam?.color ?? getNextTeamColor(newTeams),
        });
      }

      // Update match indices
      setMatch((prevMatch) => {
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
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, absences } : p)),
    );
  };

  const updatePlayerName = (id: string, newName: string) => {
    if (!newName.trim()) return;
    const trimmedName = newName.trim();
    const currentPlayer = players.find((p) => p.id === id);
    if (!currentPlayer) return;

    if (
      trimmedName.toLowerCase() !== currentPlayer.name.toLowerCase() &&
      players.some((p) => p.name.toLowerCase() === trimmedName.toLowerCase())
    ) {
      setDuplicatePlayerName({
        name: trimmedName,
        callback: (finalName) => {
          setPlayers((prev) =>
            prev.map((p) =>
              p.id === id ? { ...p, name: finalName.trim() } : p,
            ),
          );
        },
      });
      return;
    }

    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: trimmedName } : p)),
    );
    setEditingPlayerId(null);
  };

  const updatePlayerStars = (id: string, stars: number) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, stars } : p)));
  };

  const updatePlayerPhoto = (id: string, photo: string) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, photo } : p)));
  };

  const addAvailablePlayersToTeams = () => {
    const availablePlayers = players.filter(
      (p) => !teams.some((t) => t.playerIds.includes(p.id)),
    );
    if (availablePlayers.length === 0) {
      setToast({
        message: "Não há mais jogadores para adicionar.",
        type: "warning",
      });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setTeams((prevTeams) => {
      let currentTeams = [...prevTeams].map((t) => ({
        ...t,
        playerIds: [...t.playerIds],
      }));
      const limit = match.config.playersPerTeam;

      availablePlayers.forEach((player) => {
        let lastTeam = currentTeams[currentTeams.length - 1];
        if (lastTeam && lastTeam.playerIds.length < limit) {
          lastTeam.playerIds.push(player.id);
  } else {
          const nextLetter = String.fromCharCode(65 + currentTeams.length);
          const iconIdx = getNextTeamIconIdx(currentTeams);
          const color = getNextTeamColor(currentTeams);
          currentTeams.push({
            id: generateId(),
            name: `Time ${nextLetter}`,
            playerIds: [player.id],
            iconIdx,
            color,
          });
        }
      });
      return currentTeams;
    });
    setToast({
      message: `${availablePlayers.length} jogadores adicionados aos times!`,
      type: "info",
    });
    setTimeout(() => setToast(null), 3000);
  };

  const addTeam = () => {
    const nextLetter = String.fromCharCode(65 + teams.length);
    const iconIdx = getNextTeamIconIdx(teams);
    setTeams([
      ...teams,
      {
        id: generateId(),
        name: `Time ${nextLetter}`,
        playerIds: [],
        iconIdx,
        color: getNextTeamColor(teams),
      },
    ]);

    setToast({ message: `Novo time criado: Time ${nextLetter}`, type: "info" });

    // Scroll to bottom after state update
    setTimeout(() => {
      if (mainRef.current) {
        mainRef.current.scrollTo({
          top: mainRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  const removeTeam = (index: number) => {
    if (
      match.isActive &&
      (index === match.teamAIndex || index === match.teamBIndex)
    ) {
      setToast({
        message: "Não é possível remover um time que está em campo.",
        type: "warning",
      });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setTeams(teams.filter((_, i) => i !== index));
  };

  const moveTeam = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === teams.length - 1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
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
    setMatch((prev) => ({
      ...prev,
      teamAIndex: newTeamAIndex,
      teamBIndex: newTeamBIndex,
    }));
  };

  const randomizeTeams = (playersPerTeam: number) => {
    setFlashingTeamIds([]);
    const availablePlayers = players.filter((p) => p.isAvailable);
    if (playersPerTeam <= 0 || availablePlayers.length === 0) return;

    const shuffled = [...availablePlayers].sort(() => 0.5 - Math.random());

    // Update arrivedAt timestamps to match shuffled order
    const now = Date.now();
    setPlayers((prev) =>
      prev.map((p) => {
        const shuffleIdx = shuffled.findIndex((s) => s.id === p.id);
        if (shuffleIdx !== -1) {
          return { ...p, arrivedAt: now + shuffleIdx };
        }
        return p;
      }),
    );

    const newTeams: Team[] = [];

    // Create full teams
    let currentIndex = 0;
    let teamCount = 0;

    while (currentIndex + playersPerTeam <= shuffled.length) {
      const teamPlayers = shuffled.slice(
        currentIndex,
        currentIndex + playersPerTeam,
      );
      const teamLetter = String.fromCharCode(65 + teamCount);
      const iconIdx = getNextTeamIconIdx(newTeams);
      newTeams.push({
        id: generateId(),
        name: `Time ${teamLetter}`,
        playerIds: teamPlayers.map((p) => p.id),
        iconIdx,
        color: getNextTeamColor(newTeams),
      });
      currentIndex += playersPerTeam;
      teamCount++;
    }

    // Handle leftovers - "criará automaticamente outra caixa de time com o jogador que sobrou da divisão"
    if (currentIndex < shuffled.length) {
      const leftoverPlayers = shuffled.slice(currentIndex);
      const teamLetter = String.fromCharCode(65 + teamCount);
      const iconIdx = getNextTeamIconIdx(newTeams);
      newTeams.push({
        id: generateId(),
        name: `Time ${teamLetter}`,
        playerIds: leftoverPlayers.map((p) => p.id),
        iconIdx,
        color: getNextTeamColor(newTeams),
      });
    }

    // Ensure at least 2 teams for the match
    while (newTeams.length < 2) {
      const teamLetter = String.fromCharCode(65 + newTeams.length);
      const iconIdx = getNextTeamIconIdx(newTeams);
      newTeams.push({
        id: generateId(),
        name: `Time ${teamLetter}`,
        playerIds: [],
        iconIdx,
        color: getNextTeamColor(newTeams),
      });
    }

    const { newTeams: resolvedTeams } = resolveMultipleGoalkeepers(
      newTeams,
      players,
      match?.config?.playersPerTeam,
    );
    setTeams(resolvedTeams);
    setMatch((prev) => ({
      ...prev,
      teamAIndex: 0,
      teamBIndex: 1,
    }));
    setShowRandomizeModal(false);
  };

  const resetAllStats = () => {
    setPlayers((prev) => prev.map((p) => ({ ...p, goals: 0, assists: 0 })));
    setToast({ message: "🔄 Histórico resetado", type: "info" });
    setShowResetStatsConfirm(false);
  };

  const registerGoal = (
    team: "A" | "B",
    playerId: string,
    assistId?: string,
  ) => {
    const newEvent: MatchEvent = {
      id: generateId(),
      type: "goal",
      team,
      playerId,
      assistId,
      timestamp: match.config.duration * 60 - match.timeRemaining,
    };

    setMatch((prev) => {
      const newScoreA = team === "A" ? prev.scoreA + 1 : prev.scoreA;
      const newScoreB = team === "B" ? prev.scoreB + 1 : prev.scoreB;

      // Check goal limit
      const isFinished =
        (team === "A" && newScoreA >= prev.config.goalLimit) ||
        (team === "B" && newScoreB >= prev.config.goalLimit);

      return {
        ...prev,
        scoreA: newScoreA,
        scoreB: newScoreB,
        events: [...prev.events, newEvent],
        isPaused: isFinished ? true : prev.isPaused,
        timeRemaining: isFinished ? prev.timeRemaining : prev.timeRemaining,
      };
    });

    // Update player stats
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === playerId) return { ...p, goals: p.goals + 1 };
        if (p.id === assistId) return { ...p, assists: p.assists + 1 };
        return p;
      }),
    );

    playCheer();

    // Trigger Goal Animation
    const scorer = players.find((p) => p.id === playerId);
    const teamName =
      team === "A"
        ? teams[match.teamAIndex]?.name
        : teams[match.teamBIndex]?.name;

    if (scorer) {
      sounds.playGoal();
      setShowGoalAnimation({
        scorerName: scorer.name,
        teamName: teamName || (team === "A" ? "Time A" : "Time B"),
        scorerPhoto: scorer.photo,
      });

      setTimeout(() => {
        setShowGoalAnimation(null);
      }, 3000);
    }

    setShowEventModal(null);
    setSelectedScorerId(null);
  };

  function finalizeMatch(
    sA: number,
    sB: number,
    tAIdx: number,
    tBIdx: number,
    tieBreakerWinnerIndex?: number,
  ) {
    const scoreA = sA;
    const scoreB = sB;
    const teamAIndex = tAIdx;
    const teamBIndex = tBIdx;

    // Determine winner and loser for stats/history
    let winnerIndex = teamAIndex;
    let loserIndex = teamBIndex;

    if (tieBreakerWinnerIndex !== undefined) {
      winnerIndex = tieBreakerWinnerIndex;
      loserIndex =
        tieBreakerWinnerIndex === teamAIndex ? teamBIndex : teamAIndex;
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
      teamToLeaveIndex =
        tieBreakerWinnerIndex === teamAIndex ? teamBIndex : teamAIndex;
    } else if (scoreB > scoreA) {
      teamToStayIndex = teamBIndex;
      teamToLeaveIndex = teamAIndex;
    } else if (scoreA === scoreB) {
      teamToStayIndex = teamAIndex;
      teamToLeaveIndex = -1; // Draw: no one leaves automatically
    }

    const result: MatchResult = {
      id: generateId(),
      teamAName: teams[teamAIndex]?.name || "Time A",
      teamBName: teams[teamBIndex]?.name || "Time B",
      teamAColor:
        (fixedColors.enabled && fixedColors.teamA) ||
        teams[teamAIndex]?.color ||
        TEAM_COLORS[0],
      teamBColor:
        (fixedColors.enabled && fixedColors.teamB) ||
        teams[teamBIndex]?.color ||
        TEAM_COLORS[1],
      teamAId: teams[teamAIndex]?.id,
      teamBId: teams[teamBIndex]?.id,
      teamAPlayerIds: [...(teams[teamAIndex]?.playerIds || [])],
      teamBPlayerIds: [...(teams[teamBIndex]?.playerIds || [])],
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
      tieBreakerWinnerId:
        tieBreakerWinnerIndex !== undefined
          ? teams[tieBreakerWinnerIndex]?.id
          : null,
      duration: match.config.duration,
    };

    setLastMatchResult(result);
    setMatchHistory((prev) => [result, ...prev].slice(0, 10));

    setMatch((prev) => ({
      ...prev,
      isActive: false,
      isPaused: true,
      hasEnded: true,
    }));

    // Move leaving team to the end of the queue
    if (teamToLeaveIndex !== -1) {
      setTeams((prevTeams) => {
        let newTeams = [...prevTeams];
        const teamAId = newTeams[teamAIndex]?.id;
        const teamBId = newTeams[teamBIndex]?.id;

        newTeams = newTeams.map((t) => {
          if (t.id === teamAId)
            return {
              ...t,
              lastMatchStatus:
                scoreA === scoreB
                  ? "Empate"
                  : scoreA > scoreB
                    ? "Vencedor"
                    : "Derrota",
            };
          if (t.id === teamBId)
            return {
              ...t,
              lastMatchStatus:
                scoreA === scoreB
                  ? "Empate"
                  : scoreB > scoreA
                    ? "Vencedor"
                    : "Derrota",
            };
          return t;
        });

        // Set status based on tie breaker if it happened
        if (tieBreakerWinnerIndex !== undefined) {
          const winnerId = teams[tieBreakerWinnerIndex]?.id;
          const loserId =
            teams[
              tieBreakerWinnerIndex === teamAIndex ? teamBIndex : teamAIndex
            ]?.id;
          newTeams = newTeams.map((t) => {
            if (t.id === winnerId) return { ...t, lastMatchStatus: "Vencedor" };
            if (t.id === loserId) return { ...t, lastMatchStatus: "Derrota" };
            return t;
          });
        }

        const leavingTeam = newTeams.splice(teamToLeaveIndex, 1)[0];

        // --- GOALKEEPER FIXED LOGIC ---
        const activeGoalkeepers = players.filter(
          (p) => p.isGoalkeeper && p.isAvailable,
        );
        const totalGoalkeepers = activeGoalkeepers.length;

        const finalStayIndex =
          teamToStayIndex > teamToLeaveIndex
            ? teamToStayIndex - 1
            : teamToStayIndex;
        const nextTeamIndex = finalStayIndex === 0 ? 1 : 0;
        let finalLeavingTeam = { ...leavingTeam };

        let allTeamsNow = [...newTeams, { ...finalLeavingTeam }];

        const getGks = (team: Team) =>
          team?.playerIds.filter(
            (id) => players.find((p) => p.id === id)?.isGoalkeeper,
          ) || [];
        const getLinePlayers = (team: Team) =>
          team?.playerIds.filter(
            (id) => !players.find((p) => p.id === id)?.isGoalkeeper,
          ) || [];

        // Distribute GKs: A team cannot have > 1 GK if possible
        const { newTeams: resolvedTeams } = resolveMultipleGoalkeepers(
          allTeamsNow,
          players,
          match?.config?.playersPerTeam,
        );
        allTeamsNow = resolvedTeams;

        // Ensure active teams (finalStayIndex and nextTeamIndex) have a GK if available
        // According to instructions: if next team has no GK, pull from next available team below
        [finalStayIndex, nextTeamIndex].forEach((activeIdx) => {
          if (!allTeamsNow[activeIdx]) return;
          if (getGks(allTeamsNow[activeIdx]).length === 0) {
            // Find next team with GK starting from other teams
            for (let j = 0; j < allTeamsNow.length; j++) {
              if (j === activeIdx) continue;
              // Don't steal from the other playing team
              if (
                j ===
                (activeIdx === finalStayIndex ? nextTeamIndex : finalStayIndex)
              )
                continue;

              const queueGks = getGks(allTeamsNow[j]);
              if (queueGks.length > 0) {
                const gkToMove = queueGks[0];
                const activeLine = getLinePlayers(allTeamsNow[activeIdx]);
                if (activeLine.length > 0) {
                  const lineToSwap = activeLine[0];
                  // Move GK to active team (index 0)
                  allTeamsNow[activeIdx].playerIds = [
                    gkToMove,
                    ...allTeamsNow[activeIdx].playerIds.filter(
                      (id) => id !== lineToSwap,
                    ),
                  ];
                  // Move line player to source team
                  allTeamsNow[j].playerIds = allTeamsNow[j].playerIds.map(
                    (id) => (id === gkToMove ? lineToSwap : id),
                  );
                  break;
          } else if (
                  match?.config?.playersPerTeam !== undefined &&
                  allTeamsNow[activeIdx].playerIds.length <
                    match.config.playersPerTeam
                ) {
                  allTeamsNow[activeIdx].playerIds = [
                    gkToMove,
                    ...allTeamsNow[activeIdx].playerIds,
                  ];
                  allTeamsNow[j].playerIds = allTeamsNow[j].playerIds.filter(
                    (id) => id !== gkToMove,
                  );
                  break;
                }
              }
            }
          }
        });

        // Final sort for all teams to ensure GKs are at index 0
        allTeamsNow = allTeamsNow.map((t) => {
          const gks = getGks(t);
          const line = getLinePlayers(t);
          return { ...t, playerIds: [...gks, ...line] };
        });

        finalLeavingTeam = allTeamsNow.pop()!;
        newTeams = allTeamsNow;

        newTeams.push(finalLeavingTeam);

        // Identify which team just "subiu" to the match selection
        const joinedTeamId = newTeams[nextTeamIndex]?.id;

        if (joinedTeamId) {
          newTeams = newTeams.map((t) => {
            if (t.id === joinedTeamId && t.id !== teamAId && t.id !== teamBId) {
              return { ...t, lastMatchStatus: "Subiu" };
            }
            return t;
          });
        }

        return newTeams;
      });

      setMatch((prev) => {
        const newStayIndex =
          teamToStayIndex > teamToLeaveIndex
            ? teamToStayIndex - 1
            : teamToStayIndex;
        const nextTeamIndex = newStayIndex === 0 ? 1 : 0;
        return {
          ...prev,
          teamAIndex: newStayIndex,
          teamBIndex: nextTeamIndex,
        };
      });
} else {
      // Draw case, neither leaves automatically, but we still need to set their status
      setTeams((prevTeams) => {
        let newTeams = [...prevTeams];
        const teamAId = newTeams[teamAIndex]?.id;
        const teamBId = newTeams[teamBIndex]?.id;

        newTeams = newTeams.map((t) => {
          if (t.id === teamAId || t.id === teamBId) {
            return { ...t, lastMatchStatus: "Empate" };
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
      const teamsList = document.getElementById("teams-list-section");
      if (teamsList) {
        teamsList.scrollIntoView({ behavior: "smooth", block: "start" });
} else if (mainRef.current) {
        mainRef.current.scrollTo({
          top: mainRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 300);

    setTeamsTab("proximos");
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
        type: "none",
        penalties: {
          teamA: (teams[teamAIndex]?.playerIds || []).map((pid) => ({
            playerId: pid,
            success: null,
          })),
          teamB: (teams[teamBIndex]?.playerIds || []).map((pid) => ({
            playerId: pid,
            success: null,
          })),
          isFinished: false,
          winnerId: null,
        },
        lottery: {
          isSpinning: false,
          winnerId: null,
        },
      });
      return;
    }

    finalizeMatch(scoreA, scoreB, teamAIndex, teamBIndex);
  }

  const resetMatch = () => {
    setFlashingTeamIds([]);
    setMatch((prev) => ({
      ...prev,
      scoreA: 0,
      scoreB: 0,
      timeRemaining: prev.config.duration * 60,
      events: [],
      isPaused: true,
      isActive: true,
      hasEnded: false,
    }));
    setToast({ message: "🔄 Partida reiniciada", type: "info" });
    setTimeout(() => setToast(null), 3000);
  };

  const startNextMatch = (
    teamAIdx: number,
    teamBIdx: number,
    force: boolean = false,
  ) => {
    setFlashingTeamIds([]);
    if (teamAIdx === -1 || teamBIdx === -1) {
      setToast({
        message: "📋 Selecione os times do confronto",
        type: "warning",
      });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    if (teamAIdx === teamBIdx) {
      setToast({ message: "❌ Escolha times diferentes!", type: "warning" });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    const teamA = teams[teamAIdx];
    const teamB = teams[teamBIdx];

    if (teamA.playerIds.length !== teamB.playerIds.length) {
      const targetIdx =
        teamA.playerIds.length < teamB.playerIds.length ? teamAIdx : teamBIdx;
      const otherIdx = targetIdx === teamAIdx ? teamBIdx : teamAIdx;
      setEqualizerData({
        targetTeamIndex: targetIdx,
        requiredCount: teams[otherIdx].playerIds.length,
        otherTeamIndex: otherIdx,
      });
      setShowEqualizerModal(true);
      return;
    }

    setTeams((prev) =>
      prev.map((team) => {
        const { lastMatchStatus, ...rest } = team;
        return rest;
      }),
    );

    setMatch((prev) => ({
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
      teamBIndex: teamBIdx,
    }));
    setShowMatchSettingsModal(false);
    setCurrentScreen("teams");
    setTeamsTab("historico");
  };

  const handleTieBreakerTypeSelect = (
    type: "penalties" | "lottery" | "none",
  ) => {
    setTieBreaker((prev) => ({ ...prev, type }));
  };

  const handlePenaltyToggle = (team: "A" | "B", index: number) => {
    setTieBreaker((prev) => {
      const nextPenalties = { ...prev.penalties };
      const list =
        team === "A" ? [...nextPenalties.teamA] : [...nextPenalties.teamB];

      // Cycle: null -> true -> false -> null
      const current = list[index].success;
      let next: boolean | null = null;
      if (current === null) next = true;
      else if (current === true) next = false;
      else next = null;

      list[index] = { ...list[index], success: next };

      if (team === "A") nextPenalties.teamA = list;
      else nextPenalties.teamB = list;

      return { ...prev, penalties: nextPenalties };
    });
  };

  const handleLotterySpin = () => {
    if (tieBreaker.lottery.isSpinning) return;

    setTieBreaker((prev) => ({
      ...prev,
      lottery: { ...prev.lottery, isSpinning: true },
    }));

    setTimeout(() => {
      const winnerIdx =
        Math.random() > 0.5 ? match.teamAIndex : match.teamBIndex;
      const winnerId = teams[winnerIdx]?.id;
      setTieBreaker((prev) => ({
        ...prev,
        lottery: { isSpinning: false, winnerId: winnerId || null },
      }));
    }, 3000);
  };

  const handleTieBreakerConfirm = () => {
    const scoreA = match.scoreA;
    const scoreB = match.scoreB;
    const teamAIndex = match.teamAIndex;
    const teamBIndex = match.teamBIndex;

    let winnerIndex: number | undefined = undefined;

    if (tieBreaker.type === "penalties") {
      const teamAGoals = tieBreaker.penalties.teamA.filter(
        (p) => p.success === true,
      ).length;
      const teamBGoals = tieBreaker.penalties.teamB.filter(
        (p) => p.success === true,
      ).length;
      if (teamAGoals > teamBGoals) winnerIndex = teamAIndex;
      else if (teamBGoals > teamAGoals) winnerIndex = teamBIndex;
      // If still equal, we don't finalize or let user decide?
      // The button is disabled if equal in the UI
    } else if (tieBreaker.type === "lottery") {
      if (tieBreaker.lottery.winnerId === teams[teamAIndex]?.id)
        winnerIndex = teamAIndex;
      else if (tieBreaker.lottery.winnerId === teams[teamBIndex]?.id)
        winnerIndex = teamBIndex;
    }

    setTieBreaker((prev) => ({ ...prev, showSelection: false }));
    finalizeMatch(scoreA, scoreB, teamAIndex, teamBIndex, winnerIndex);
  };

  const handleBothLeaveMatch = (firstToQueue: "A" | "B") => {
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
      teamAName: teams[teamAIndex]?.name || "Time A",
      teamBName: teams[teamBIndex]?.name || "Time B",
      teamAColor:
        (fixedColors.enabled && fixedColors.teamA) ||
        teams[teamAIndex]?.color ||
        TEAM_COLORS[0],
      teamBColor:
        (fixedColors.enabled && fixedColors.teamB) ||
        teams[teamBIndex]?.color ||
        TEAM_COLORS[1],
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
      tieBreakerWinnerId: null,
    };

    setLastMatchResult(result);
    setMatchHistory((prev) => [result, ...prev].slice(0, 10));

    setMatch((prev) => ({
      ...prev,
      isActive: false,
      isPaused: true,
      hasEnded: true,
    }));

    setTeams((prevTeams) => {
      let newTeams = [...prevTeams];
      const tA = newTeams.find((t) => t.id === teamAId);
      const tB = newTeams.find((t) => t.id === teamBId);

      if (!tA || !tB) return prevTeams;

      // Update statuses
      newTeams = newTeams.map((t) => {
        if (t.id === teamAId || t.id === teamBId) {
          return { ...t, lastMatchStatus: "Empate" };
        }
        return t;
      });

      // Remove both
      newTeams = newTeams.filter((t) => t.id !== teamAId && t.id !== teamBId);

      // Add both to the end in the chosen order
      if (firstToQueue === "A") {
        newTeams.push(tA);
        newTeams.push(tB);
} else {
        newTeams.push(tB);
        newTeams.push(tA);
      }

      // Mark the ones who moved up
      const joinedTeamAId = newTeams[0]?.id;
      const joinedTeamBId = newTeams[1]?.id;

      newTeams = newTeams.map((t) => {
        if (
          (t.id === joinedTeamAId || t.id === joinedTeamBId) &&
          t.id !== teamAId &&
          t.id !== teamBId
        ) {
          return { ...t, lastMatchStatus: "Subiu" };
        }
        return t;
      });

      return newTeams;
    });

    setMatch((prev) => ({
      ...prev,
      teamAIndex: 0,
      teamBIndex: 1,
    }));

    setTieBreaker((prev) => ({ ...prev, showSelection: false }));
    setToast({
      message: "Ambos os times foram para o fim da fila.",
      type: "success",
    });
  };

  const togglePayment = (playerId: string, field: string, amount: number) => {
    setPayments((prev) => {
      const existing = prev.find(
        (p) => p.playerId === playerId && p.year === selectedYear,
      );
      if (existing) {
        const newPayments = [...prev];
        const index = prev.indexOf(existing);
        const newMonths = { ...existing.months };
        newMonths[field] = newMonths[field] === amount ? 0 : amount;
        newPayments[index] = {
          ...existing,
          months: newMonths,
          monthlyFee: amount,
        };
        return newPayments;
} else {
        const newRecord: PaymentRecord = {
          id: `${playerId}-${selectedYear}`,
          playerId,
          year: selectedYear,
          months: { [field]: amount },
          monthlyFee: amount,
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
      { name: "Wanderson", ref2025: 0, Jan: 5, Fev: 5, Mar: 5 },
    ];

    const newPlayers = [...players];
    const newPayments = [...payments];

    data.forEach((item) => {
      let fPlayer = newPlayers.find((p) => p.name === item.name);
      if (!fPlayer) {
        fPlayer = {
          id: generateId(),
          name: item.name,
          level: 3,
          isGoalkeeper: false,
          goals: 0,
          assists: 0,
          isAvailable: true,
        };
        newPlayers.push(fPlayer);
      }

      const existingPaymentIdx = newPayments.findIndex(
        (p) => p.playerId === fPlayer!.id,
      );
      const paymentRecord: PaymentRecord = {
        id: `${fPlayer.id}-2026`,
        playerId: fPlayer.id,
        year: 2026,
        monthlyFee: 5,
        months: {
          Jan: item.Jan,
          Fev: item.Fev,
          Mar: item.Mar,
        },
      };

      if (existingPaymentIdx >= 0) {
        newPayments[existingPaymentIdx] = paymentRecord;
} else {
        newPayments.push(paymentRecord);
      }
    });

    setPlayers(newPlayers);
    setPayments(newPayments);
    setToast({
      message: "Dados da imagem importados com sucesso!",
      type: "info",
    });
    setTimeout(() => setToast(null), 3000);
  };

  const addYear = () => {
    const nextYear = Math.max(...availableYears) + 1;
    setAvailableYears((prev) => [...prev, nextYear]);
    setSelectedYear(nextYear);
    setToast({ message: `Ano ${nextYear} adicionado!`, type: "info" });
    setTimeout(() => setToast(null), 2000);
  };

  const MONTHS = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  const isMatchTimePassed = useMemo(() => {
    if (orgProSettings.matchDayOfWeek === null || !orgProSettings.appliedDate)
      return false;
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
      setOrgProSettings((prev) => ({
        ...prev,
        maxAbsences: null,
        requirePaymentUpToDate: false,
        matchDayOfWeek: null,
        matchTime: "",
        appliedDate: null,
      }));
      setOrgProData({});
      setToast({
        message:
          "A data da pelada passou! As exigências e presenças foram redefinidas.",
        type: "info",
      });
      setTimeout(() => setToast(null), 3000);
    }
  }, [isMatchTimePassed]);

  // --- Memoized Computations for Performance ---
  const sortedPlayersByName = useMemo(
    () => [...players].sort((a, b) => a.name.localeCompare(b.name)),
    [players],
  );
  const sortedPlayersByAssists = useMemo(
    () => [...players].sort((a, b) => (b.assists || 0) - (a.assists || 0)),
    [players],
  );
  const sessionPlayersSorted = useMemo(() => {
    return players
      .filter((p) => sessionPlayerIds.includes(p.id))
      .sort((a, b) => {
        if (a.isAvailable && !b.isAvailable) return -1;
        if (!a.isAvailable && b.isAvailable) return 1;
        if (a.isAvailable && b.isAvailable)
          return (a.arrivedAt || 0) - (b.arrivedAt || 0);
        return a.name.localeCompare(b.name);
      });
  }, [players, sessionPlayerIds]);
  const sortedExpenses = useMemo(
    () => [...(expenses || [])].sort((a, b) => b.date - a.date),
    [expenses],
  );
  const sortedPlayersByTotal = useMemo(
    () =>
      [...players].sort((a, b) => b.goals + b.assists - (a.goals + a.assists)),
    [players],
  );
  const sortedRankingPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      if (rankingTab === "geral")
        return b.goals + b.assists - (a.goals + a.assists);
      if (rankingTab === "artilharia") return b.goals - a.goals;
      if (rankingTab === "assistencias") return b.assists - a.assists;
      return 0;
    });
  }, [players, rankingTab]);
  const sortedTeamAPlayers = useMemo(() => {
    const teamA = teams[match.teamAIndex];
    if (!teamA) return [];
    return [...teamA.playerIds].sort((a, b) => {
      const playerA = players.find((p) => p.id === a);
      const playerB = players.find((p) => p.id === b);
      if (playerA?.isGoalkeeper && !playerB?.isGoalkeeper) return -1;
      if (!playerA?.isGoalkeeper && playerB?.isGoalkeeper) return 1;
      return (playerA?.arrivedAt || 0) - (playerB?.arrivedAt || 0);
    });
  }, [teams, match.teamAIndex, players]);
  const sortedTeamBPlayers = useMemo(() => {
    const teamB = teams[match.teamBIndex];
    if (!teamB) return [];
    return [...teamB.playerIds].sort((a, b) => {
      const playerA = players.find((p) => p.id === a);
      const playerB = players.find((p) => p.id === b);
      if (playerA?.isGoalkeeper && !playerB?.isGoalkeeper) return -1;
      if (!playerA?.isGoalkeeper && playerB?.isGoalkeeper) return 1;
      return (playerA?.arrivedAt || 0) - (playerB?.arrivedAt || 0);
    });
  }, [teams, match.teamBIndex, players]);

  const visiblePlayers = useMemo(() => {
    const timePassed = isMatchTimePassed;
    const currentMonth = MONTHS[new Date().getMonth()];
    const currentYear = new Date().getFullYear();

    return players.filter((player) => {
      const isOrgPro = !!orgProData[player.id];

      if (isOrgPro && timePassed) return false;

      if (
        orgProSettings.maxAbsences !== null &&
        (player.absences || 0) > orgProSettings.maxAbsences
      ) {
        return false;
      }

      if (orgProSettings.requirePaymentUpToDate) {
        const record = payments.find(
          (p) => p.playerId === player.id && p.year === currentYear,
        );
        const isUpToDate = record && record.months[currentMonth] > 0;
        if (!isUpToDate) return false;
      }

      return true;
    });
  }, [players, orgProSettings, orgProData, payments, isMatchTimePassed]);

  // --- UI Components ---

  const NavItem = ({
    screen,
    icon: Icon,
    label,
  }: {
    screen: Screen;
    icon: any;
    label: string;
  }) => {
    const isActive = currentScreen === screen;
    const screens: Screen[] = ["players", "teams", "ranking", "finance"];
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
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
            isActive ? "text-white" : "text-white/60 hover:text-white"
          }`}
        >
          <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
        </motion.div>
        <div className="flex justify-center w-full">
          <span
            className={`text-[7px] uppercase tracking-[0.2em] mt-1 font-black transition-all duration-300 relative z-10 text-center ${
              isActive
                ? "text-white opacity-100"
                : "text-white opacity-60 group-hover:opacity-100"
            }`}
          >
            {label}
          </span>
        </div>
      </button>
    );
  };

  if (isPresenceMode) {
    const orgParam = urlParams.get("org");
    let orgData: any = {};
    if (orgParam) {
      try {
        orgData = JSON.parse(atob(orgParam));
} catch (e) {
        // ignore
      }
    }

    return (
      <div className="h-[100dvh] bg-brand-dark text-white font-sans overflow-y-auto flex flex-col p-6 items-center justify-center">
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-12 left-0 right-0 z-[200] flex justify-center px-6 pointer-events-none"
            >
              <motion.div
                className={`pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.3)] border backdrop-blur-xl transition-all ${
                  toast.type === "success"
                    ? "bg-emerald-500/90 border-emerald-400/50 text-white"
                    : toast.type === "warning"
                      ? "bg-amber-500/90 border-amber-400/50 text-white"
                      : "bg-[#1E3D2F]/95 border-white/10 text-white"
                }`}
              >
                <div className="shrink-0">
                  {toast.type === "success" && <PiCheckCircleBold size={18} />}
                  {toast.type === "warning" && (
                    <PiWarningCircleBold size={18} />
                  )}
                  {toast.type === "gray" && <PiGearBold size={18} />}
                  {toast.type === "info" && <PiRocketBold size={18} />}
                </div>
                <span className="text-xs font-bold leading-tight max-w-[200px]">
                  {toast.message}
                </span>
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
        <div className="bg-[#1E3D2F] w-full max-w-sm rounded-xl p-6 relative overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <GiCrown size={120} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter mb-2 relative z-10">
            Marcar Presença
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-[#E3D39E]/80 font-bold mb-8 relative z-10">
            Confirme sua participação na pelada
          </p>

          {!presencePlayerId ? (
            <div className="space-y-4 relative z-10">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/50">
                Selecione seu nome
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                {sortedPlayersByName.map((p) => (
                  <button
                    key={`pres-${p.id}`}
                    onClick={() => {
                      setPresencePlayerId(p.id);
                      setPresenceCode("");
                    }}
                    className="p-3 bg-white/5 rounded-xl border border-white/10 text-left hover:bg-white/10 transition-colors flex justify-between items-center"
                  >
                    <span className="font-bold text-sm tracking-tight">
                      {p.name}
                    </span>
                    {p.isAvailable && (
                      <span className="text-[8px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full uppercase font-black tracking-widest ml-2">
                        Confirmado
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                <button
                  onClick={() => {
                    setPresencePlayerId("");
                    setPresenceCode("");
                  }}
                  className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-all text-white/60"
                >
                  <ChevronRight size={16} className="rotate-180" />
                </button>
                <div className="flex-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/50 block">
                    Jogador selecionado
                  </label>
                  <span className="font-bold text-lg leading-tight uppercase tracking-tight">
                    {players.find((p) => p.id === presencePlayerId)?.name}
                  </span>
                </div>
              </div>

              {(() => {
                const currentMonth = MONTHS[new Date().getMonth()];
                const currentYear = new Date().getFullYear();
                const playerPayment = payments.find(
                  (p) =>
                    p.playerId === presencePlayerId && p.year === currentYear,
                );
                const isUpToDate =
                  playerPayment &&
                  (playerPayment.months[currentMonth] || 0) > 0;
                const requiresCode = !isUpToDate;
                const playerOrgCode =
                  orgData && orgData[presencePlayerId]
                    ? orgData[presencePlayerId]
                    : null;

                return (
                  <div className="space-y-4">
                    {requiresCode ? (
                      <div className="space-y-4">
                        <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
                          <label className="text-[9px] font-black uppercase tracking-widest text-amber-300 block mb-1">
                            Acesso Restrito
                          </label>
                          <p className="text-[10px] font-medium text-amber-200/80 leading-relaxed">
                            Parece que você não possui pagamentos recentes.
                            Digite sua Chave de Acesso para confirmar presença.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Telefone ou PIN"
                            value={presenceCode}
                            onChange={(e) => setPresenceCode(e.target.value)}
                            className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-4 text-sm font-bold text-white focus:border-[#E3D39E] focus:ring-1 focus:ring-[#E3D39E] outline-none transition-all placeholder:font-normal placeholder:opacity-50"
                          />
                        </div>
                        <button
                          onClick={() => {
                            if (!playerOrgCode) {
                              setToast({
                                message:
                                  "Organização não definiu sua chave. Fale com um admin.",
                                type: "warning",
                              });
                              return;
                            }
                            if (presenceCode.trim() !== playerOrgCode) {
                              setToast({
                                message: "Chave incorreta!",
                                type: "warning",
                              });
                              return;
                            }
                            const now = Date.now();
                            supabase
                              .from("players")
                              .update({ is_available: true, arrived_at: now })
                              .eq("id", presencePlayerId)
                              .then(() => {
                                setPlayers((prev) =>
                                  prev.map((p) =>
                                    p.id === presencePlayerId
                                      ? {
                                          ...p,
                                          isAvailable: true,
                                          arrivedAt: now,
                                        }
                                      : p,
                                  ),
                                );
                                setToast({
                                  message: "Presença confirmada com sucesso!",
                                  type: "success",
                                });
                                setTimeout(() => setPresencePlayerId(""), 2000);
                              });
                          }}
                          className="w-full bg-[#E3D39E] text-black font-black uppercase tracking-widest py-4 rounded-xl shadow-lg hover:bg-white active:scale-95 transition-all text-xs"
                        >
                          Verificar e Confirmar
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6 text-center py-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner shadow-emerald-500/20">
                          <IoCheckmarkCircle size={32} />
                        </div>
                        <div>
                          <p className="text-emerald-400 font-black uppercase tracking-widest text-[10px] mb-1">
                            Status Liberado
                          </p>
                          <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
                            Mensalidade em Dia
                          </p>
                        </div>
                        <div className="px-4 pb-4">
                          <button
                            onClick={() => {
                              const now = Date.now();
                              supabase
                                .from("players")
                                .update({ is_available: true, arrived_at: now })
                                .eq("id", presencePlayerId)
                                .then(() => {
                                  setPlayers((prev) =>
                                    prev.map((p) =>
                                      p.id === presencePlayerId
                                        ? {
                                            ...p,
                                            isAvailable: true,
                                            arrivedAt: now,
                                          }
                                        : p,
                                    ),
                                  );
                                  setToast({
                                    message: "Presença confirmada!",
                                    type: "success",
                                  });
                                  setTimeout(
                                    () => setPresencePlayerId(""),
                                    2000,
                                  );
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
    <div
      className={`h-[100dvh] ${isPrintMode ? "bg-white text-black" : "bg-[#020510] text-zinc-100"} font-sans overflow-hidden flex flex-col transition-colors duration-500 relative ${theme === "dark" ? "dark" : ""}`}
    >
      {/* Aurora Mesh Gradient Background Elements */}
      {!isPrintMode && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#1e3a8a]/20 blur-[100px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#0ea5e9]/10 blur-[120px]" />
          <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] rounded-full bg-[#3b82f6]/10 blur-[90px]" />
        </div>
      )}

      {/* Logo Animation Overlay */}
      <AnimatePresence>
        {showLogoAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-[280px] p-8 rounded-[24px] bg-[#0b0e17]/95 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center space-y-6"
            >
              <SpinningBall size="lg" />
              <div className="text-center flex flex-col items-center">
                <h1 className="text-xl font-black uppercase tracking-tighter text-white">
                  Sorteando
                </h1>
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-1">
                  Aguarde...
                </p>
              </div>
            </motion.div>
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
            onClick={() => setShowExpenseModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              className="w-full max-w-[280px] rounded-[24px] overflow-hidden shadow-2xl bg-[#0b0e17]/95 border border-white/10 text-white backdrop-blur-xl relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-white/5 p-6 text-center relative overflow-hidden border-b border-white/5 flex flex-col items-center">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#34d399]/5 rounded-full -mr-8 -mt-8 blur-xl" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8 blur-lg" />

                <button
                  onClick={() => setShowExpenseModal(false)}
                  className="absolute top-4 right-4 p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/60 hover:text-white transition-all cursor-pointer"
                >
                  <X size={14} />
                </button>

                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 shadow-lg flex items-center justify-center mx-auto mb-2 relative z-10">
                  <img src="/despesas%20detalhadas.png" referrerPolicy="no-referrer" className="w-8 h-8 object-contain" alt="Despesas" />
                </div>

                <h3 className="text-lg font-black uppercase tracking-tight text-white leading-none relative z-10">
                  Nova Despesa
                </h3>
                <p className="text-[8px] text-white/50 font-black mt-1.5 uppercase tracking-[0.2em] relative z-10">
                  GESTÃO FINANCEIRA
                </p>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <label className="text-[8px] font-black uppercase tracking-[0.15em] text-white/50 mb-1 block">
                    Nome da Despesa
                  </label>
                  <input
                    autoFocus
                    value={newExpense.name}
                    onChange={(e) =>
                      setNewExpense((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Aluguel da quadra"
                    className="w-full h-10 px-3 rounded-xl outline-none bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#34d399] focus:bg-white/10 transition-all text-xs"
                  />
                </div>
                <div>
                  <label className="text-[8px] font-black uppercase tracking-[0.15em] text-white/50 mb-1 block">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) =>
                      setNewExpense((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    placeholder="0.00"
                    className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#34d399] focus:bg-white/10 transition-all text-xs text-white"
                  />
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <button
                    onClick={() => {
                      if (!newExpense.name || !newExpense.amount) return;
                      setExpenses((prev) => [
                        ...prev,
                        {
                          id: generateId(),
                          name: newExpense.name,
                          amount: parseInt(newExpense.amount),
                          date: Date.now(),
                        },
                      ]);
                      setNewExpense({ name: "", amount: "" });
                      setShowExpenseModal(false);
                      setToast({
                        message: "Despesa adicionada!",
                        type: "success",
                      });
                      setTimeout(() => setToast(null), 3000);
                    }}
                    className="w-full h-10 bg-[#34d399] hover:bg-[#34d399]/90 text-[#1e3d2f] font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg shadow-[#34d399]/10 transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center"
                  >
                    Confirmar Despesa
                  </button>

                  <button
                    onClick={() => setShowExpenseModal(false)}
                    className="w-full h-10 rounded-xl font-bold uppercase tracking-widest text-[9px] transition-all bg-white/5 border border-white/10 text-white hover:bg-white/10 active:scale-95 cursor-pointer flex items-center justify-center"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showArrivalStepGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[300] flex items-center justify-center p-4"
            onClick={() => setShowArrivalStepGuide(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              className="w-full max-w-[280px] rounded-[24px] overflow-hidden shadow-2xl bg-[#0b0e17]/95 border border-white/10 text-white backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative overflow-hidden w-full bg-transparent">
                <motion.div
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipeThreshold = 50;
                    if (offset.x < -swipeThreshold && arrivalCardIndex === 0) {
                      setArrivalCardIndex(1);
              } else if (offset.x > swipeThreshold && arrivalCardIndex === 1) {
                      setArrivalCardIndex(0);
                    }
                  }}
                  animate={{ x: arrivalCardIndex === 0 ? "0%" : "-50%" }}
                  transition={{ type: "spring", damping: 20, stiffness: 100 }}
                  className="flex w-[200%]"
                >
                  {/* Card 1 */}
                  <div className="w-1/2 flex flex-col">
                    <div className="bg-white/5 p-6 text-center relative overflow-hidden border-b border-white/5">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#34d399]/5 rounded-full -mr-8 -mt-8 blur-xl" />
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8 blur-lg" />

                      <h3 className="text-lg font-black uppercase tracking-tight text-white leading-none mb-1">
                        Próximo Passo
                      </h3>
                      <p className="text-[8px] text-[#34d399]/85 font-black tracking-[0.2em] uppercase">
                        Ordem de chegada (1/2)
                      </p>
                    </div>

                    <div className="p-5 space-y-4">
                      <div className="space-y-3 min-h-[60px] flex items-center">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#34d399]/10 border border-[#34d399]/20 text-[#34d399] flex items-center justify-center text-xs font-black shrink-0">
                            1
                          </div>
                          <p className="text-[11px] font-medium text-white/70 leading-relaxed pt-0.5">
                            Toque nos jogadores para confirmar a presença deles na
                            pelada de hoje.
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-center gap-2 pb-1">
                        <div className={`w-1.5 h-1.5 rounded-full transition-all ${arrivalCardIndex === 0 ? "bg-[#34d399] w-3" : "bg-white/10"}`} />
                        <div className={`w-1.5 h-1.5 rounded-full transition-all ${arrivalCardIndex === 1 ? "bg-[#34d399] w-3" : "bg-white/10"}`} />
                      </div>

                      <button
                        onClick={() => setArrivalCardIndex(1)}
                        className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold uppercase tracking-widest text-[9px] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        Próximo
                      </button>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="w-1/2 flex flex-col">
                    <div className="bg-white/5 p-6 text-center relative overflow-hidden border-b border-white/5">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#34d399]/5 rounded-full -mr-8 -mt-8 blur-xl" />
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8 blur-lg" />

                      <h3 className="text-lg font-black uppercase tracking-tight text-white leading-none mb-1">
                        Próximo Passo
                      </h3>
                      <p className="text-[8px] text-[#34d399]/85 font-black tracking-[0.2em] uppercase">
                        Ordem de chegada (2/2)
                      </p>
                    </div>

                    <div className="p-5 space-y-4">
                      <div className="space-y-3 min-h-[60px] flex items-center">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#34d399]/10 border border-[#34d399]/20 text-[#34d399] flex items-center justify-center text-xs font-black shrink-0">
                            2
                          </div>
                          <p className="text-[11px] font-medium text-white/70 leading-relaxed pt-0.5">
                            Você precisa de pelo menos o dobro de jogadores (ex: 2
                            times de {match.config.playersPerTeam}) para prosseguir.
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-center gap-2 pb-1">
                        <div className={`w-1.5 h-1.5 rounded-full transition-all ${arrivalCardIndex === 0 ? "bg-[#34d399] w-3" : "bg-white/10"}`} />
                        <div className={`w-1.5 h-1.5 rounded-full transition-all ${arrivalCardIndex === 1 ? "bg-[#34d399] w-3" : "bg-white/10"}`} />
                      </div>

                      <button
                        onClick={() => {
                          setShowArrivalStepGuide(false);
                          setArrivalCardIndex(0);
                        }}
                        className="w-full py-2.5 bg-[#34d399] hover:bg-[#34d399]/90 text-[#1e3d2f] rounded-xl font-black uppercase tracking-widest text-[9px] shadow-lg shadow-[#34d399]/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <CheckCircle2 size={12} />
                        OK, Entendi!
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInsufficientPlayersModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[300] flex items-center justify-center p-4"
            onClick={() => setShowInsufficientPlayersModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="w-full max-w-[280px] p-6 rounded-[24px] bg-[#0b0e17]/95 border border-white/10 text-white backdrop-blur-xl shadow-2xl relative flex flex-col items-center text-center space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-sm relative overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-xl" />
                <span className="text-amber-500 relative z-10">
                  <PiWarningCircleBold size={28} />
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black uppercase tracking-tight text-white leading-none">
                  {scheduledMatches.length === 0
                    ? "Crie uma Pelada"
                    : "Ops! Quase lá..."}
                </h3>
                {scheduledMatches.length > 0 && (
                  <p className="text-[9px] font-medium leading-relaxed text-white/50 uppercase tracking-widest mt-1">
                    JOGADORES INSUFICIENTES
                  </p>
                )}
              </div>

              <p className="text-[10px] font-bold text-white/60 text-center leading-relaxed px-2">
                {scheduledMatches.length === 0
                  ? "Você precisa criar uma pelada no Painel de Controle para continuar."
                  : "Jogadores insuficientes para formar 2 times. Crie mais jogadores ou altere a quantidade de jogadores por time."}
              </p>

              <div className="w-full space-y-2 pt-2">
                <button
                  onClick={() => {
                    if (scheduledMatches.length === 0) {
                      setShowInsufficientPlayersModal(false);
                      setCurrentScreen("dashboard");
                      setShowScheduleModal(true);
              } else {
                      setShowInsufficientPlayersModal(false);
                      setCurrentScreen("players");
                      setShowAddPlayerSection(true);
                    }
                  }}
                  className="w-full h-10 bg-[#34d399] hover:bg-[#34d399]/90 text-[#1e3d2f] rounded-xl font-black uppercase tracking-widest text-[9px] shadow-lg shadow-[#34d399]/20 transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  {scheduledMatches.length === 0 ? (
                    <Plus size={12} />
                  ) : (
                    <User size={12} />
                  )}
                  {scheduledMatches.length === 0
                    ? "Criar Pelada"
                    : "Cadastrar Jogadores"}
                </button>

                <button
                  onClick={() => {
                    setShowInsufficientPlayersModal(false);
                    if (scheduledMatches.length !== 0) {
                      setCurrentScreen("teams");
                      setTeamsTab("configuracao");
                      setIsFlashingConfig(true);
                    }
                  }}
                  className={`w-full h-10 bg-white/5 text-white/70 border border-white/10 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-white/10 hover:text-white transition-all active:scale-95 shadow-sm ${scheduledMatches.length > 0 && players.length === 0 ? "hidden" : "block"}`}
                >
                  {scheduledMatches.length === 0
                    ? "OK, ENTENDIDO"
                    : "ALTERAR CONFIGURAÇÃO"}
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
        colorA={
          (fixedColors.enabled && fixedColors.teamA) ||
          teams[match.teamAIndex]?.color
        }
        colorB={
          (fixedColors.enabled && fixedColors.teamB) ||
          teams[match.teamBIndex]?.color
        }
        players={players}
        queueCount={teams.length - 2}
        fixedColors={fixedColors}
      />

      {/* Global Application Settings Modal handled below in sticky header */}

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
              <h3 className="text-lg font-black uppercase tracking-tighter mb-4 text-brand-primary">
                Jogadores Insuficientes
              </h3>
              <p className="text-sm text-brand-text-secondary mb-8 leading-relaxed">
                Você não tem jogadores suficientes criados para formar no mínimo
                dois times com a quantidade configurada.
              </p>
              <div className="flex gap-4 w-full">
                <button
                  onClick={() => setShowNotEnoughPlayersModal(false)}
                  className={`flex-1 py-4 font-black uppercase tracking-widest text-xs rounded-md transition-all ${
                    theme === "light"
                      ? "bg-zinc-200 text-black hover:bg-zinc-300"
                      : "bg-brand-dark text-white hover:bg-white/5"
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setShowNotEnoughPlayersModal(false);
                    setCurrentScreen("players");
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
              className="pointer-events-auto flex items-center gap-4 pl-1.5 pr-5 py-1.5 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-white/10 bg-[#121212]/95 backdrop-blur-xl transition-all group"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg ${
                toast.type === "success"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                  : toast.type === "warning"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/20"
                    : "bg-white/5 text-white/80 border border-white/10"
              }`}>
                {toast.type === "success" && <PiCheckCircleBold size={20} />}
                {toast.type === "warning" && <PiWarningCircleBold size={20} />}
                {toast.type === "gray" && <PiGearBold size={20} />}
                {toast.type === "info" && <PiRocketBold size={20} />}
              </div>
              <div className="flex flex-col pr-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white leading-none mb-0.5">
                  Notificação
                </p>
                <p className="text-[11px] font-medium text-white/60 leading-tight">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => setToast(null)}
                className="ml-auto w-7 h-7 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all active:scale-90"
              >
                <div className="opacity-40 group-hover:opacity-100 transition-opacity text-white">
                  <PiXBold size={12} />
                </div>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-screen flex flex-col overflow-hidden">
        {/* Sticky Header and Tabs Container */}
        <div
          className={`sticky top-0 z-50 bg-[#000000]/95 backdrop-blur-2xl ${isPrintMode ? "hidden" : ""}`}
        >
          {/* Header */}
          <header className="px-6 py-2.5 flex justify-between items-center bg-transparent relative transition-colors duration-300">
            <div className="flex items-center gap-3 overflow-hidden relative z-10">
              <AnimatePresence mode="wait">
                {match.isActive &&
                !match.isPaused &&
                !match.hasEnded &&
                teamsTab !== "historico" ? (
                  <motion.div
                    key="mini-header-status"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => {
                      setCurrentScreen("teams");
                      setTeamsTab("historico");
                    }}
                  >
                    <div className="flex items-center gap-2 px-3 py-1.5">
                      <span
                        className={`text-[12px] font-black tracking-widest tabular-nums text-brand-primary ${match.timeRemaining <= 60 ? "animate-pulse text-red-500" : ""}`}
                      >
                        {Math.floor(match.timeRemaining / 60)
                          .toString()
                          .padStart(2, "0")}
                        :
                        {(match.timeRemaining % 60).toString().padStart(2, "0")}
                      </span>
                      <div className="h-3 w-px bg-white/10 mx-1" />
                      <div className="flex items-center gap-2 mt-0.5">
                        <div
                          style={{
                            color:
                              (fixedColors.enabled && fixedColors.teamA) ||
                              teams[match.teamAIndex]?.color ||
                              "#ffffff",
                          }}
                        >
                          {(() => {
                            const team = teams[match.teamAIndex];
                            const Icon = getTeamIcon(team, "A");
                            return <Icon size={12} />;
                          })()}
                        </div>
                        <span className="text-white font-black text-xs tabular-nums">
                          {match.scoreA}
                        </span>
                        <span className="text-white/30 text-[8px] font-bold mx-0.5">
                          x
                        </span>
                        <span className="text-white font-black text-xs tabular-nums">
                          {match.scoreB}
                        </span>
                        <div
                          style={{
                            color:
                              (fixedColors.enabled && fixedColors.teamB) ||
                              teams[match.teamBIndex]?.color ||
                              "#ffffff",
                          }}
                        >
                          {(() => {
                            const team = teams[match.teamBIndex];
                            const Icon = getTeamIcon(team, "B");
                            return <Icon size={12} />;
                          })()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="main-logo"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <FutQuinaLogo
                      size="md"
                      style={{ color: "#83A8FF" }}
                      titleColorClass="text-[#83A8FF]"
                      subColorClass="text-white"
                      align="start"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2 relative z-10">
              {!(currentScreen === "players" && !showAddPlayerSection) && (
                <button 
                  onClick={() => setShowGlobalSettings(true)}
                  className="text-white hover:opacity-80 transition-opacity p-2 flex items-center justify-center cursor-pointer"
                >
                  <IoIosMenu size={28} />
                </button>
              )}
            </div>
          </header>

          {/* Tabs for Teams */}
          {currentScreen === "teams" && (
            <div className="px-6 pb-3">
              <div className="flex gap-1.5 justify-center">
                <button
                  onClick={() => navigateTeamsTab("configuracao")}
                  className={`w-10 py-1.5 flex items-center justify-center rounded-lg transition-all ${teamsTab === "configuracao" ? "bg-[#34d399] text-[#1E3D2F]" : "bg-white/5 text-white hover:bg-white/10"}`}
                >
                  <PiGearBold size={16} />
                </button>
                <button
                  onClick={() => navigateTeamsTab("chegada")}
                  className={`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all ${teamsTab === "chegada" ? "bg-[#34d399] text-[#1E3D2F]" : "bg-white/5 text-white hover:bg-white/10 font-medium"}`}
                >
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex`}
                  >
                    PRESENÇA
                  </span>
                </button>
                <button
                  onClick={() => navigateTeamsTab("historico")}
                  className={`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all ${teamsTab === "historico" ? "bg-[#34d399] text-[#1E3D2F]" : "bg-white/5 text-white hover:bg-white/10 font-medium"}`}
                >
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex`}
                  >
                    CONFRONTOS
                  </span>
                </button>
                <button
                  onClick={() => navigateTeamsTab("proximos")}
                  className={`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all ${teamsTab === "proximos" ? "bg-[#34d399] text-[#1E3D2F]" : "bg-white/5 text-white hover:bg-white/10 font-medium"}`}
                >
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex`}
                  >
                    PRÓXIMOS
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Tabs for Ranking */}
          {currentScreen === "ranking" && (
            <div className="px-6 pb-3">
              <div className="flex gap-1.5 justify-center">
                <button
                  onClick={() => setRankingTab("geral")}
                  className={`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all ${rankingTab === "geral" ? "bg-[#34d399] text-[#1E3D2F]" : "bg-white/5 text-white hover:bg-white/10 font-medium"}`}
                >
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex`}
                  >
                    Geral
                  </span>
                </button>
                <button
                  onClick={() => setRankingTab("artilharia")}
                  className={`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all ${rankingTab === "artilharia" ? "bg-[#34d399] text-[#1E3D2F]" : "bg-white/5 text-white hover:bg-white/10 font-medium"}`}
                >
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex`}
                  >
                    Artilharia
                  </span>
                </button>
                <button
                  onClick={() => setRankingTab("assistencias")}
                  className={`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all ${rankingTab === "assistencias" ? "bg-[#34d399] text-[#1E3D2F]" : "bg-white/5 text-white hover:bg-white/10 font-medium"}`}
                >
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex`}
                  >
                    Assistências
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Tabs for Finance */}
          {currentScreen === "finance" && !isPrintMode && (
            <div className="px-6 pb-3">
              <div className="flex gap-1.5 justify-center">
                <button
                  onClick={() => setFinanceSubScreen("balanco")}
                  className={`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all ${financeSubScreen === "balanco" ? "bg-[#34d399] text-[#1E3D2F]" : "bg-white/5 text-white hover:bg-white/10 font-medium"}`}
                >
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors`}
                  >
                    Balanço
                  </span>
                </button>
                <button
                  onClick={() => setFinanceSubScreen("mensalidade")}
                  className={`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all ${financeSubScreen === "mensalidade" ? "bg-[#34d399] text-[#1E3D2F]" : "bg-white/5 text-white hover:bg-white/10 font-medium"}`}
                >
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors`}
                  >
                    Mensalidade
                  </span>
                </button>
              </div>
            </div>
          )}
          <AnimatePresence>
            {showGlobalSettings && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-full right-0 w-screen h-[calc(100vh-100%)] bg-black/60 backdrop-blur-sm z-[200] flex justify-end"
                onClick={() => setShowGlobalSettings(false)}
              >
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="w-full max-w-[320px] bg-[#0b0e17]/95 border-l border-white/10 backdrop-blur-xl h-full shadow-2xl flex flex-col overflow-hidden text-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="px-6 pt-6 pb-4 border-b border-white/10 flex items-center justify-between">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setTheme("light")}
                        className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all cursor-pointer ${theme === "light" ? "bg-white text-black" : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"}`}
                      >
                        <Sun size={14} />
                      </button>
                      <button
                        onClick={() => setTheme("dark")}
                        className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all cursor-pointer ${theme === "dark" ? "bg-white text-black" : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"}`}
                      >
                        <Moon size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => setShowGlobalSettings(false)}
                      className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    
                    {/* General Tools Card */}
                    <div className="bg-white/5 rounded-2xl p-1.5 border border-white/10 backdrop-blur-md overflow-hidden">
                      {((showAddPlayerSection && currentScreen === "players") ||
                        currentScreen === "teams" ||
                        currentScreen === "ranking" ||
                        currentScreen === "finance") && (
                        <button
                          onClick={() => {
                            setCurrentScreen("players");
                            setShowAddPlayerSection(false);
                            setSelectedMatchId(null);
                            setPlayersTab("configuracao");
                            setTeamsTab("configuracao");
                            setShowGlobalSettings(false);
                          }}
                          className="w-full flex items-center gap-4 p-4 hover:bg-white/10 rounded-xl transition-all group cursor-pointer"
                        >
                          <div className="flex items-center gap-4 text-left w-full">
                            <img src="/painel%20de%20controle.png" referrerPolicy="no-referrer" className="w-5 h-5 object-contain group-hover:scale-110 transition-transform shrink-0" alt="Painel de controle" />
                            <div className="flex flex-col">
                              <span className="text-[14px] font-bold text-white tracking-wide">
                                Painel de controle
                              </span>
                              <span className="text-[10px] text-white/40 font-medium">
                                Voltar à tela principal
                              </span>
                            </div>
                          </div>
                        </button>
                      )}


                      <button
                        onClick={() => {
                          setShowEndPeladaConfirm(true);
                          setShowGlobalSettings(false);
                        }}
                        className="w-full flex items-center justify-between p-4 hover:bg-red-500/10 rounded-xl transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-4 text-left w-full">
                          <img src="/fim%20da%20pelada.png" referrerPolicy="no-referrer" className="w-5 h-5 object-contain group-hover:scale-110 transition-transform shrink-0" alt="Fim da pelada" />
                          <div className="flex flex-col">
                            <span className="text-[14px] font-bold text-white tracking-wide">
                              Fim da pelada
                            </span>
                            <span className="text-[10px] text-white/40 font-medium">
                              Salvar e fechar pelada
                            </span>
                          </div>
                        </div>
                      </button>


                      <button
                        onClick={() => {
                          setShowSetupGuide(true);
                          setShowGlobalSettings(false);
                        }}
                        className="w-full flex items-center justify-between p-4 hover:bg-white/10 rounded-xl transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-4 text-left w-full">
                          <img src="/guia%20inicial.png" referrerPolicy="no-referrer" className="w-5 h-5 object-contain group-hover:scale-110 transition-transform shrink-0" alt="Guia Inicial" />
                          <div className="flex-1 flex flex-col">
                            <span className="text-[14px] font-bold text-white tracking-wide">
                              Guia Inicial
                            </span>
                            <span className="text-[10px] text-white/40 font-medium">
                              Como usar o aplicativo
                            </span>
                          </div>
                          <ChevronRight size={14} className="text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Close Button Footer */}
                  <div className="p-6 bg-white/5 border-t border-white/10 backdrop-blur-md">
                    <button
                      onClick={() => setShowGlobalSettings(false)}
                      className="w-full py-3.5 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest active:scale-95 transition-all shadow-md border border-white/10 cursor-pointer text-center hover:from-zinc-700 hover:to-zinc-800"
                    >
                      Fechar Menu
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main Content */}
        <main
          ref={mainRef}
          onScroll={handleMainScroll}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className={`flex-1 overflow-y-auto flex flex-col ${currentScreen === "players" ? "pb-32" : "pb-12"} touch-pan-y ${isPrintMode ? "p-0 pb-0 bg-white text-black" : "bg-transparent relative z-10"}`}
        >
          <AnimatePresence mode="wait">
            {currentScreen === "players" && !isPrintMode && (
              <motion.div
                key="players"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-4 sm:p-6 space-y-4 bg-transparent flex-1 flex flex-col"
              >
                {/* Dashboard Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {!showAddPlayerSection ? (
                    <div className="flex flex-col gap-0.5">
                      <h2 className="text-[12px] font-black uppercase tracking-widest text-white">
                        Painel de controle
                      </h2>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-0.5">
                      <h2 className="text-[12px] font-black uppercase tracking-widest text-white">
                        GERENCIAMENTO
                      </h2>
                      <p className="text-[9px] font-black uppercase tracking-widest text-blue-200/50">
                        JOGADORES
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 w-full sm:w-auto">
                    {showAddPlayerSection ? (
                      <>
                        <motion.button
                          onClick={() => {
                            setShouldPulseConfig(false);
                            setCurrentScreen("teams");
                            setTeamsTab("configuracao");
                            if (!firstSetupDone) {
                              setIsInitialSetupFlow(true);
                            }
                          }}
                          animate={shouldPulseConfig ? { 
                            scale: [1, 1.05, 1],
                            boxShadow: ["0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)", "0px 20px 25px -5px rgba(52, 211, 153, 0.4), 0px 10px 10px -5px rgba(52, 211, 153, 0.2)", "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)"]
                          }                     : {}}
                          transition={shouldPulseConfig ? { repeat: Infinity, duration: 1.5 } : {}}
                          className="flex-1 sm:flex-none px-4 h-9 bg-gradient-to-r from-[#59b823] via-[#75c628] to-[#25660e] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          CONFIGURAR PARTIDA
                        </motion.button>
                      </>
                    ) : null}
                  </div>
                </div>

                {/* Main View Switcher */}
                <AnimatePresence mode="wait">
                  {!showAddPlayerSection ? (
                    <motion.div
                      key="dashboard-view"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="w-full flex flex-col space-y-4"
                    >
                      {/* CTA Banner */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        onClick={() => setShowScheduleModal(true)}
                        className="cursor-pointer relative overflow-hidden bg-gradient-to-r from-[#205b10] to-[#205b10] rounded-full p-[6px] shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99]"
                      >
                        {/* Background pattern */}
                        <div className="absolute top-0 right-0 h-full w-2/3 opacity-15 mix-blend-overlay flex justify-end items-center pointer-events-none">
                          <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-black">
                            <GiSoccerBall size={180} />
                          </div>
                        </div>

                        <div className="relative z-10 flex items-center">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#111A13] flex items-center justify-center shrink-0 shadow-md">
                              <Plus size={24} className="text-white" />
                            </div>
                            <h3 className="text-[17px] sm:text-lg font-black tracking-tight uppercase text-white m-0 leading-none pb-0.5">
                              CRIE SUA PELADA
                            </h3>
                          </div>
                        </div>
                      </motion.div>

                      {/* Matches Section */}
                      <div className="space-y-4">
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="flex items-center justify-between px-1"
                        >
                          <h4 className="text-sm font-bold text-[#7e7e7e] font-roboto leading-[21px] w-[102.875px]">
                            Suas peladas
                          </h4>
                        </motion.div>

                        <div className="space-y-4">
                          {scheduledMatches.length === 0 && (
                            <div className="relative w-full max-w-sm mx-auto h-[350px]">
                              <div className="absolute inset-0 rounded-2xl flex flex-col p-4 bg-[#111625]/90 border border-white/10 backdrop-blur-xl overflow-hidden animate-pulse">
                                <div className="flex justify-between items-center mb-2.5 w-full">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-white/10" />
                                    <div className="w-24 h-3 bg-white/10 rounded-full" />
                                  </div>
                                  <div className="w-7 h-7 rounded-full bg-white/10" />
                                </div>
                                <div className="text-center mb-2.5 flex flex-col items-center mt-4">
                                  <div className="w-20 h-2 bg-white/10 rounded-full mb-4" />
                                  <div className="w-32 h-6 bg-white/10 rounded-full mb-3" />
                                  <div className="w-24 h-3 bg-white/10 rounded-full" />
                                </div>
                                <div className="flex justify-center -space-x-1.5 mb-4 mt-6 w-full">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-white/10 border border-[#111625]" />
                                  ))}
                                </div>
                                <div className="bg-white/5 rounded-xl p-2.5 border border-white/10 mt-auto mb-2.5 h-[65px]" />
                                <div className="flex gap-1.5 w-full">
                                  <div className="w-8 h-8 rounded-full bg-white/10" />
                                  <div className="flex-1 h-8 rounded-xl bg-white/10" />
                                </div>
                              </div>
                            </div>
                          )}

                          {scheduledMatches.length === 0 && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: [1, 1.02, 1] }}
                              transition={{
                                opacity: { duration: 0.4 },
                                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                              }}
                              className="bg-white/5 border border-white/10 rounded-xl mx-4 p-3 flex items-center gap-3 shadow-sm"
                            >
                              <div className="w-8 h-8 rounded-full text-[#34d399] bg-[#34d399]/10 border border-[#34d399]/20 flex items-center justify-center shrink-0">
                                <AlertCircle size={16} />
                              </div>
                              <div className="flex-1 flex flex-col">
                                <p className="text-[10px] font-bold text-white/70 leading-tight uppercase tracking-wider">
                                  Você precisa criar uma pelada no botão acima para continuar.
                                </p>
                              </div>
                            </motion.div>
                          )}

                          {scheduledMatches.length > 0 && (
                            <div className="relative w-full max-w-sm mx-auto h-[350px]">
                              <AnimatePresence mode="popLayout" initial={false}>
                                {scheduledMatches.slice(0, 2).map((match, idx) => {
                                const isTop = idx === 0;
                                const matchDate = new Date(match.date);
                                const day = matchDate.getDate();
                                const month = matchDate
                                  .toLocaleString("pt-BR", { month: "long" })
                                  .toLowerCase();
                                const weekday = matchDate
                                  .toLocaleString("pt-BR", { weekday: "long" })
                                  .substring(0, 7)
                                  .toLowerCase();

                                const specificSessionSaved = safeLocalStorage.getItem(`futquina_session_player_ids_${groupId}_${match.id}`);
                                const matchSessionIds = specificSessionSaved ? JSON.parse(specificSessionSaved) : [];
                                const specificPlayersSaved = safeLocalStorage.getItem(`futquina_players_${groupId}_${match.id}`);
                                let matchSpecificPlayers = specificPlayersSaved ? JSON.parse(specificPlayersSaved) : [];
                                if (!Array.isArray(matchSpecificPlayers)) matchSpecificPlayers = [];
                                const confirmedPlayers = matchSpecificPlayers.filter((p: any) => matchSessionIds.includes(p.id) && p.isAvailable);
                                const totalAvailablePlayers = confirmedPlayers.length;

                                return (
                                  <motion.div
                                    key={match.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                    animate={{ 
                                      opacity: 1, 
                                      scale: isTop ? 1 : 0.94, 
                                      y: isTop ? 0 : 20,
                                      zIndex: isTop ? 20 : 10,
                                      filter: isTop ? 'blur(0px)' : 'blur(1px)',
                                    }}
                                    exit={{ 
                                      opacity: 0, 
                                      scale: 0.9, 
                                      x: 200, 
                                      rotate: 15,
                                      zIndex: 100,
                                      transition: { duration: 0.3 }
                                    }}
                                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                    className={`group absolute inset-0 rounded-2xl flex flex-col cursor-pointer transition-all duration-300 p-4 bg-[#111625]/90 border border-white/10 backdrop-blur-xl overflow-hidden ${isTop ? 'shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]' : 'shadow-md brightness-95'}`}
                                  >
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />

                                    <div className="flex justify-between items-center mb-2.5 relative z-10 w-full">
                                      <div className="flex items-center gap-2">
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingMatchId(match.id);
                                            setNewMatchName(match.name);
                                            setNewMatchTime(match.time);
                                            setNewMatchImage(match.imageUrl || "");
                                            const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
                                            const date = new Date(match.date);
                                            setNewMatchDay(days[date.getDay()]);
                                            setShowScheduleModal(true);
                                            setTimeout(() => fileInputRef.current?.click(), 100);
                                          }}
                                          className="w-7 h-7 rounded-full bg-white/5 p-1 flex items-center justify-center border border-white/10 shadow-inner overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                                        >
                                           {match.imageUrl ? (
                                             <img src={match.imageUrl} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                                           ) : matchSpecificPlayers.length > 0 && matchSpecificPlayers[0].photo ? (
                                             <img src={matchSpecificPlayers[0].photo} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                                           ) : (
                                             <span className="text-white/60"><GiSoccerBall size={14} /></span>
                                                  )}
                                        </button>
                                        <TypewriterText 
                                          key={match.id}
                                          text={(match.name || "S").substring(0, 15)} 
                                          className="text-white font-bold text-xs capitalize tracking-wide" 
                                        />
                                      </div>
                                      <button onClick={(e) => {
                                          e.stopPropagation();
                                          setToast({ message: "Para iniciar, selecione a pelada que você criou no painel acima.", type: "info" });
                                          setTimeout(() => setToast(null), 4000);
                                        }}
                                        className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/10 transition-all border border-white/10"
                                      >
                                        <Info size={12} />
                                      </button>
                                    </div>

                                    <div className="text-center mb-2.5 relative z-10">
                                        <p className="text-white/40 text-[8px] font-bold tracking-[0.2em] uppercase mb-0.5">PRÓXIMA PELADA</p>
                                        <h3 className="text-white text-2xl font-black tracking-tight">{day} {month.substring(0, 3)}</h3>
                                        <p className="text-white/70 text-xs mt-0.5 font-medium tracking-wide">{weekday.split('-')[0]} as {match.time}</p>
                                    </div>

                                    <div className="flex justify-center -space-x-1.5 mb-2.5 relative z-10 w-full px-4 overflow-hidden py-0.5">
                                        {matchSpecificPlayers.slice(0, 5).map((player: any, pIdx: number) => (
                                            <div key={`avatar-${pIdx}`} className="w-8 h-8 rounded-full border border-white/10 bg-zinc-800 overflow-hidden shadow-md shrink-0">
                                                {player.photo ? <img src={player.photo} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-white text-[9px] bg-gradient-to-br from-indigo-400 to-purple-500 font-bold uppercase">{player.name[0]}</div>}
                                            </div>
                                        ))}
                                        {matchSpecificPlayers.length > 5 && <div className="w-8 h-8 rounded-full border border-white/10 bg-white/10 backdrop-blur-md flex items-center justify-center text-white font-bold text-[10px] shadow-md shrink-0">+{matchSpecificPlayers.length - 5}</div>}
                                    </div>

                                    <div className="bg-white/5 rounded-xl p-2.5 backdrop-blur-md border border-white/10 relative overflow-hidden mb-2.5">
                                        <div className="absolute right-[-10%] top-[-10%] pointer-events-none rotate-12 scale-150 transition-transform duration-700"><GiSoccerField size={60} color="rgba(255,255,255,0.02)" /></div>
                                        <div className="flex justify-between items-center mb-1.5 relative z-10"><span className="text-white/40 text-[9px] font-bold tracking-wide">STATUS DA PELADA</span></div>
                                        <div className="flex items-center gap-2.5 relative z-10">
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-md border border-white/10 text-[#34d399]"><GiWhistle size={16} /></div>
                                            <div>
                                                <h4 className="text-white font-bold text-xs leading-tight truncate max-w-[100px]">Confirmados</h4>
                                                <p className="text-white/40 text-[9px] mt-0.5">{totalAvailablePlayers} na lista</p>
                                            </div>
                                            <div className="ml-auto text-white text-base font-black tracking-tighter flex items-center">
                                                <span className={`inline-flex mr-1.5 opacity-20 ${totalAvailablePlayers > 0 ? 'text-[#34d399] opacity-100' : ''}`}><GiSoccerBall size={12} /></span>
                                                {totalAvailablePlayers}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 relative z-10 w-full" onClick={(e) => e.stopPropagation()}>
                                        <button onClick={(e) => { e.stopPropagation(); setMatchToDelete(match); }} className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white/70 transition-colors cursor-pointer shadow-sm"><Trash2 size={14} /></button>
                                        {scheduledMatches.length > 1 && (
                                          <button onClick={(e) => { e.stopPropagation(); handleSwapMatches(); }} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white/70 transition-colors cursor-pointer shadow-sm"><ArrowLeftRight size={14} /></button>
                                        )}
                                        <button onClick={(e) => {
                                            e.stopPropagation(); 
                                            setEditingMatchId(match.id); 
                                            setNewMatchName(match.name); 
                                            setNewMatchTime(match.time);
                                            setNewMatchImage(match.imageUrl || "");
                                            const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
                                            const date = new Date(match.date); setNewMatchDay(days[date.getDay()]); setShowScheduleModal(true);
                                          }}
                                          className={`${shrinkEditButton ? "w-8 shrink-0" : "flex-1"} bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm rounded-full h-8 flex items-center justify-center text-white text-[11px] font-bold gap-1 transition-all duration-300 shadow-sm overflow-hidden`}
                                        >
                                            {shrinkEditButton ? <Pencil size={14} /> : "Editar"}
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); setSelectedMatchId(match.id); setCurrentScreen("players"); setShowAddPlayerSection(true); }} className="flex-1 bg-gradient-to-r from-[#59b823] via-[#75c628] to-[#25660e] hover:opacity-90 shadow-lg shadow-emerald-500/10 rounded-full h-8 flex items-center justify-center text-white text-[11px] font-black gap-1 transition-all active:scale-95">Abrir <ArrowUp size={12} /></button>
                                    </div>
                                  </motion.div>
                                );
                              }).reverse()}
                            </AnimatePresence>
                          </div>
                          )}

                          {/* Remaining Matches List */}
                          {scheduledMatches.length > 2 && (
                            <div className="space-y-3 mt-8 pb-4">
                              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7e7e7e] px-1">
                                Outras Peladas
                              </h5>
                              <div className="space-y-3">
                                {scheduledMatches.slice(2).map((match) => {
                                  const matchPlayers = players.filter(p => p.matchId === match.id);
                                  return (
                                    <motion.div
                                      key={match.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="bg-[#111625]/80 rounded-xl p-3 border border-white/10 flex items-center justify-between shadow-sm cursor-pointer hover:bg-[#111625]/90 transition-all duration-200"
                                      onClick={() => {
                                        setSelectedMatchId(match.id);
                                        setCurrentScreen("players");
                                        setShowAddPlayerSection(true);
                                      }}
                                    >
                                      <div className="flex items-center gap-3">
                                      <div 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setEditingMatchId(match.id);
                                          setNewMatchName(match.name);
                                          setNewMatchTime(match.time);
                                          setNewMatchImage(match.imageUrl || "");
                                          const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
                                          const date = new Date(match.date);
                                          setNewMatchDay(days[date.getDay()]);
                                          setShowScheduleModal(true);
                                          setTimeout(() => fileInputRef.current?.click(), 100);
                                        }}
                                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 border border-white/10 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                      >
                                          {match.imageUrl ? (
                                            <img src={match.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                          ) : matchPlayers.length > 0 && matchPlayers[0].photo ? (
                                            <img src={matchPlayers[0].photo} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                          ) : (
                                            <GiSoccerBall size={20} />
                                          )}
                                        </div>
                                      <div>
                                        <h6 className="text-[12px] font-bold text-white leading-tight capitalize">
                                          {match.name || "Sem nome"}
                                        </h6>
                                        <p className="text-[9px] font-medium text-white/50 uppercase tracking-tight mt-0.5">
                                          {new Date(match.date).toLocaleDateString("pt-BR", { weekday: 'short', day: '2-digit', month: 'short' })} às {match.time}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                       <button 
                                         onClick={(e) => { 
                                           e.stopPropagation(); 
                                           setEditingMatchId(match.id); 
                                           setNewMatchName(match.name); 
                                           setNewMatchTime(match.time);
                                           setNewMatchImage(match.imageUrl || "");
                                           const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
                                           const date = new Date(match.date); 
                                           setNewMatchDay(days[date.getDay()]); 
                                           setShowScheduleModal(true); 
                                  }}
                                         className="w-7 h-7 rounded-full bg-white/5 text-white/70 flex items-center justify-center hover:bg-white/10 transition-colors"
                                       >
                                         <Pencil size={12} />
                                       </button>
                                       <button 
                                         onClick={(e) => { e.stopPropagation(); setMatchToDelete(match); }}
                                         className="w-7 h-7 rounded-full bg-white/5 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                                       >
                                         <Trash2 size={12} />
                                       </button>
                                       <ChevronRight size={14} className="text-white/40" />
                                    </div>
                                  </motion.div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>


                      {/* Alert Banner / Tip */}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="management-view"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <div className="space-y-6">
                        <div className="bg-white/5 backdrop-blur-xl p-4 sm:p-6 rounded-[32px] border border-white/10 space-y-4 sm:space-y-6 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <div className="flex-1 flex gap-2 sm:gap-3">
                              <input
                                type="text"
                                placeholder="Nome do jogador..."
                                className={`flex-1 px-4 sm:px-5 py-3 rounded-2xl border border-white/10 outline-none transition-all bg-black/40 text-white placeholder-blue-200/40 focus:ring-2 focus:ring-blue-500/50 text-[13px] sm:text-sm font-medium shadow-inner h-[48px]`}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    addPlayer(e.currentTarget.value);
                                    e.currentTarget.value = "";
                                  }
                                }}
                              />
                              <button
                                onClick={handleImportContacts}
                                className="w-[48px] h-[48px] bg-black/40 text-blue-400 rounded-2xl shadow-inner hover:bg-blue-500/10 transition-all active:scale-95 flex items-center justify-center border border-white/10 shrink-0"
                                title="Importar dos Contatos"
                              >
                                <Contact size={20} strokeWidth={1.5} />
                              </button>
                              <button
                                onClick={() => {
                                  const input = document.querySelector(
                                    "input",
                                  ) as HTMLInputElement;
                                  if (input.value.trim()) {
                                    addPlayer(input.value);
                                    input.value = "";
                                  }
                                }}
                                className="w-[48px] h-[48px] bg-black/40 text-blue-400 rounded-2xl border border-white/10 shadow-inner hover:bg-blue-500/10 transition-all active:scale-95 flex items-center justify-center shrink-0"
                              >
                                <Plus size={22} strokeWidth={1.5} />
                              </button>
                            </div>
                          </div>

                          <div className="relative">
                            <AnimatePresence>
                              {isAiProcessing && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="absolute inset-0 bg-[#1E3D2F]/95 backdrop-blur-md z-20 flex items-center justify-center gap-3 overflow-hidden rounded-2xl border border-white/10 shadow-lg"
                                >
                                  <div className="flex gap-1.5">
                                    {[0, 1, 2].map((i) => (
                                      <motion.div
                                        key={i}
                                        animate={{
                                          scale: [1, 1.2, 1],
                                          opacity: [0.5, 1, 0.5],
                                        }}
                                        transition={{
                                          duration: 0.8,
                                          repeat: Infinity,
                                          delay: i * 0.2,
                                        }}
                                        className="w-1.5 h-1.5 bg-[#53B986] rounded-full shadow-[0_0_8px_rgba(83,185,134,0.5)]"
                                      />
                                    ))}
                                  </div>
                                  <motion.div
                                    animate={{ opacity: [0.7, 1, 0.7] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="text-[10px] uppercase tracking-wider text-[#53B986] font-bold"
                                  >
                                    Adicionando...
                                  </motion.div>

                                  {/* Background shimmer effect */}
                                  <motion.div
                                    animate={{
                                      x: ["-100%", "100%"],
                                    }}
                                    transition={{
                                      duration: 1.5,
                                      repeat: Infinity,
                                      ease: "linear",
                                    }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
                                  />
                                </motion.div>
                              )}
                            </AnimatePresence>
                            <textarea
                              placeholder=" "
                              className={`w-full h-28 sm:h-32 px-5 sm:px-6 py-5 sm:py-6 rounded-2xl border border-white/10 outline-none transition-all text-sm font-medium resize-none bg-black/40 text-white placeholder-blue-200/40 focus:ring-2 focus:ring-blue-500/50 peer shadow-inner`}
                              onChange={(e) => {
                                if (
                                  e.target.value.includes("\n") ||
                                  e.target.value.length > 20
                                ) {
                                  addBulkPlayers(e.target.value);
                                  e.target.value = "";
                                }
                              }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center pb-8 sm:pb-8 pointer-events-none transition-all peer-focus:opacity-0 peer-[:not(:placeholder-shown)]:opacity-0">
                              <motion.div
                                initial={{ maxWidth: 24 }}
                                animate={{ maxWidth: 240 }}
                                transition={{ duration: 0.6, delay: 1.0, ease: "easeInOut" }}
                                className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
                              >
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                                  className="text-[#25D366] shrink-0 flex items-center justify-center"
                                >
                                  <IoLogoWhatsapp size={24} />
                                </motion.div>
                                <motion.span
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.4, delay: 1.2 }}
                                  className="text-xs sm:text-sm text-blue-200/50 leading-tight shrink-0 pt-0.5"
                                >
                                  Cole aqui a lista do whatsapp.
                                </motion.span>
                              </motion.div>
                            </div>
                            <div
                              className={`absolute right-5 sm:right-6 bottom-4 sm:bottom-6 text-blue-400 cursor-pointer hover:text-blue-300 transition-colors flex items-center gap-1.5 sm:gap-2 bg-white/5 backdrop-blur-xl p-1.5 sm:p-2 pl-3 sm:pl-3 rounded-2xl border border-white/10`}
                              onClick={async () => {
                                try {
                                  const text =
                                    await navigator.clipboard.readText();
                                  if (text) {
                                    addBulkPlayers(text);
                                    setToast({
                                      message: "Lista colada com sucesso!",
                                      type: "success",
                                    });
                                    setTimeout(() => setToast(null), 2000);
                                  }
                                } catch (err) {
                                  setToast({
                                    message:
                                      "Permissão de área de transferência negada.",
                                    type: "warning",
                                  });
                                  setTimeout(() => setToast(null), 3000);
                                }
                              }}
                            >
                              <ClipboardPaste
                                size={14}
                                className="sm:w-4 sm:h-4"
                                strokeWidth={1.5}
                              />
                              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-blue-200">
                                CAIXA INTELIGENTE
                              </span>
                            </div>
                          </div>
                        </div>

                        <section className="w-full relative pt-6 border-t border-white/10">
                          {!isDataLoaded || players.length === 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <div key={`skeleton-${idx}`} className="flex items-center justify-between p-2 px-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-sm animate-pulse">
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="w-8 h-8 sm:w-8 sm:h-8 rounded-full bg-white/10 shrink-0" />
                                    <div className="flex flex-col gap-1.5 flex-1">
                                      <div className="h-3 bg-white/10 rounded-full w-24" />
                                      <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <Star key={`skel-star-${idx}-${star}`} size={8} className="text-white/10" />
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <ChevronRight size={14} className="text-white/10" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : visiblePlayers.length === 0 ? (
                            <div className="min-h-[450px] flex flex-col items-center justify-center gap-8 w-full">
                              <div className="flex flex-col items-center gap-4 opacity-50 text-blue-200 text-xs">
                                <span className="font-bold uppercase tracking-widest text-[11px]">
                                  Nenhum jogador encontrado.
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {visiblePlayers.map((player) => (
                                <motion.div
                                  layout
                                  key={`player-list-dash-switch-${player.id}`}
                                  className={`flex items-center justify-between p-2 px-3 rounded-2xl transition-all cursor-pointer hover:bg-white/10 active:bg-white/5 border border-white/10 bg-white/5 backdrop-blur-md shadow-sm`}
                                  onClick={() => {
                                    if (editingPlayerId !== player.id) {
                                      setPlayerManagementModal(player);
                                    }
                                  }}
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="w-8 h-8 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 bg-white/10 text-white/50 border border-white/5 overflow-hidden">
                                      {player.photo ? (
                                        <img
                                          src={player.photo}
                                          alt={player.name}
                                          className="w-full h-full object-cover"
                                          referrerPolicy="no-referrer"
                                        />
                                      ) : (
                                        <span className="flex items-center justify-center">
                                          <IoPersonOutline size={16} />
                                        </span>
                                      )}
                                    </div>
                                    {editingPlayerId === player.id ? (
                                      <input
                                        autoFocus
                                        defaultValue={player.name}
                                        className={`flex-1 bg-black/40 border-b border-blue-500 outline-none text-xs font-medium py-1 px-3 rounded-none text-white min-w-0 placeholder-white/30`}
                                        onClick={(e) => e.stopPropagation()}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter")
                                            updatePlayerName(
                                              player.id,
                                              e.currentTarget.value,
                                            );
                                          if (e.key === "Escape")
                                            setEditingPlayerId(null);
                                        }}
                                        onBlur={(e) =>
                                          updatePlayerName(
                                            player.id,
                                            e.target.value,
                                          )
                                        }
                                      />
                                    ) : (
                                      <div className="flex flex-col gap-0 flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-normal truncate text-left leading-none text-white uppercase tracking-tight">
                                            {player.name}
                                          </span>
                                          {orgProData[player.id] && (
                                            <div className="shrink-0 text-yellow-500">
                                              <GiCrown size={14} />
                                            </div>
                                          )}
                                        </div>
                                        <div className="flex gap-0.5">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                              key={`star-dash-m-switch-${player.id}-${star}`}
                                              size={8}
                                              className={`${(player.stars || 3) >= star ? "fill-yellow-400 text-yellow-400" : "text-white/20"}`}
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {editingPlayerId !== player.id && (
                                      <ChevronRight
                                        size={14}
                                        className="text-white/20"
                                      />
                                    )}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </section>

                        {players.length > 0 && (
                          <div className="flex justify-center pt-6 border-t border-white/10">
                            {!showClearConfirm ? (
                              <button
                                onClick={() => setShowClearConfirm(true)}
                                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-red-500/10 text-red-400 rounded-2xl border border-red-500/20 hover:bg-red-500/20 transition-all active:scale-95 text-[10px] font-black uppercase tracking-[0.2em]"
                              >
                                <Trash2 size={16} />
                                Apagar todos os jogadores
                              </button>
                            ) : (
                              <div className="flex flex-col sm:flex-row items-center gap-3 w-full animate-in fade-in zoom-in duration-200">
                                <button
                                  onClick={() => {
                                    setPlayers([]);
                                    setSessionPlayerIds([]);
                                    setShowClearConfirm(false);
                                  }}
                                  className="w-full px-8 py-4 bg-red-600/80 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-[0_0_15px_rgba(220,38,38,0.3)] active:scale-95 transition-all backdrop-blur-md"
                                >
                                  Confirmar Exclusão
                                </button>
                                <button
                                  onClick={() => setShowClearConfirm(false)}
                                  className="w-full px-8 py-4 bg-white/5 text-white/50 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all border border-white/10"
                                >
                                  Cancelar
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {currentScreen === "teams" && !isPrintMode && (
              <motion.div
                key="teams"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="px-2 sm:px-4 pb-6 pt-4 space-y-4 flex-1 bg-transparent flex flex-col text-white"
              >
                <div id="teams-list-section" className="w-full space-y-4">
                  {!selectedMatchId ? (
                    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
                      <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mb-6">
                        <div className="text-black/30">
                          <IoInformationCircleOutline size={32} />
                        </div>
                      </div>
                      <span className="font-bold uppercase tracking-wide text-zinc-500 text-[10px] mb-4 max-w-sm">
                        {scheduledMatches.length > 0
                          ? "Para iniciar, selecione a pelada que você criou no painel de controle."
                          : "Você precisa criar uma pelada no painel de controle para continuar."}
                      </span>
                      <button
                        onClick={() => {
                          setCurrentScreen("players");
                          setShowAddPlayerSection(false);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-[#59b823] via-[#75c628] to-[#25660e] text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg hover:opacity-90 transition-all active:scale-95 w-32"
                      >
                        Ir
                      </button>
                    </div>
                  ) : teamsTab === "menu" ? (
                    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] px-4">
                      <div className="flex flex-col gap-4 w-full max-w-md">
                        {[
                          { id: 'configuracao', label: 'CONFIGURAÇÃO', icon: PiGearBold, subtitle: 'Ajustes', image: '/i1.png' },
                          { id: 'chegada', label: 'PRESENÇA', icon: PiCheckCircleBold, subtitle: 'Lista', image: '/i2.png' },
                          { id: 'historico', label: 'CONFRONTOS', icon: Swords, subtitle: 'Placar', image: '/i3.png' },
                          { id: 'proximos', label: 'TIMES', icon: PiCalendarBlankBold, subtitle: 'Equipes', image: '/i4.png' }
                        ].map((item, idx) => (
                          <motion.button
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => setTeamsTab(item.id as any)}
                            className="bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 rounded-none p-3 shadow-[0_15px_30px_-12px_rgba(0,0,0,0.1)] flex items-center gap-5 border border-black/5 relative overflow-hidden group w-full"
                          >
                            {/* Decorative Glows - Adjusted for light theme */}
                            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/40 rounded-full blur-[60px] pointer-events-none group-hover:bg-white/60 transition-colors" />
                            
                            <div className="w-14 h-14 flex items-center justify-center group-hover:scale-105 transition-all duration-500 relative z-10 shrink-0">
                              <img 
                                src={item.image} 
                                alt={item.label} 
                                className="w-14 h-14 object-contain relative z-20"
                                loading="eager"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="text-left space-y-0.5 relative z-10">
                              <p className="text-black/40 text-[8px] font-bold tracking-[0.3em] uppercase">{item.subtitle}</p>
                              <h3 className="text-zinc-900 text-sm font-medium uppercase tracking-widest">{item.label}</h3>
                            </div>
                            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                               <ChevronRight size={24} className="text-black/20" />
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ) : teamsTab === "configuracao" ? (
                    <div className="space-y-6">
                      <div className="sticky top-[-1px] z-40 bg-transparent backdrop-blur-md py-4 -mx-2 px-2 sm:-mx-4 sm:px-4 flex justify-between items-center border-b border-white/10">
                        <h3 className="text-sm font-black uppercase tracking-widest text-white">
                          Configuração
                        </h3>
                      </div>

                      <div className="space-y-6 pb-24">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase tracking-[0.15em] text-white/50 block text-center mb-1.5">
                              Tempo (Minutos)
                            </label>
                            <input
                              type="number"
                              defaultValue={match.config.duration}
                              min={1}
                              id="tab-match-duration"
                              className="w-full h-10 px-3 rounded-xl outline-none font-bold bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#34d399] focus:bg-white/10 transition-all text-center text-xs [color-scheme:dark]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase tracking-[0.15em] text-white/50 block text-center mb-1.5">
                              Limite de Gols
                            </label>
                            <input
                              type="number"
                              defaultValue={match.config.goalLimit}
                              min={1}
                              id="tab-match-goals"
                              className="w-full h-10 px-3 rounded-xl outline-none font-bold bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#34d399] focus:bg-white/10 transition-all text-center text-xs [color-scheme:dark]"
                            />
                          </div>
                          <div
                            className={`space-y-1 transition-all duration-500 rounded-xl ${isFlashingConfig ? "animate-flash-highlight" : ""}`}
                          >
                            <label className="text-[8px] font-black uppercase tracking-[0.15em] text-white/50 block text-center mb-1.5">
                              Jogadores por Time
                            </label>
                            <input
                              type="number"
                              defaultValue={match.config.playersPerTeam}
                              min={1}
                              id="tab-match-players"
                              className="w-full h-10 px-3 rounded-xl outline-none font-bold bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#34d399] focus:bg-white/10 transition-all text-center text-xs [color-scheme:dark]"
                            />
                          </div>
                        </div>

                        <div className="p-5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 space-y-4 shadow-xl">
                          <div className="flex items-start justify-between">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1.5 h-6">
                                <span className="text-[#34d399]">
                                  <Shirt size={14} />
                                </span>
                                <span className="text-[11px] font-black uppercase tracking-widest text-white">
                                  Fixar cores
                                </span>
                              </div>
                              <p className="text-[10px] text-white/50 font-bold mt-0.5">
                                Defina as cores permanentes para os times selecionados.
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                setFixedColors((prev) => ({
                                  ...prev,
                                  enabled: !prev.enabled,
                                }))
                              }
                              className={`w-12 h-6 rounded-full p-1 transition-colors relative shrink-0 cursor-pointer ${fixedColors.enabled ? "bg-[#34d399]" : "bg-white/10"}`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full transition-transform ${fixedColors.enabled ? "translate-x-6 bg-[#1e3d2f]" : "translate-x-0 bg-white"} shadow-sm`}
                              />
                            </button>
                          </div>

                          {fixedColors.enabled && (
                            <div className="grid grid-cols-2 gap-4 pt-2 animate-in fade-in slide-in-from-top-1 duration-300">
                              <div className="space-y-1">
                                <label className="text-[8px] font-black uppercase tracking-[0.15em] text-white/50 block text-center mb-1.5">
                                  Cor Time A
                                </label>
                                <button
                                  onClick={() =>
                                    setShowColorPicker({
                                      teamIdx: -1,
                                      color:
                                        fixedColors.teamA || SHIRT_COLORS[8],
                                    })
                                  }
                                  className="w-full h-10 rounded-xl flex items-center justify-between px-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                                >
                                  <div className="flex items-center gap-2">
                                    {(() => {
                                      const color = fixedColors.teamA || SHIRT_COLORS[8];
                                      const idx = SHIRT_COLORS.indexOf(color);
                                      const ShirtIcon = idx !== -1 ? TEAM_ICONS[idx] : TEAM_ICONS[8];
                                      return <ShirtIcon size={24} className="brightness-110 drop-shadow-md inline-block" />;
                                    })()}
                                  </div>
                                  <Palette
                                    size={14}
                                    className="text-[#34d399]"
                                  />
                                </button>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[8px] font-black uppercase tracking-[0.15em] text-white/50 block text-center mb-1.5">
                                  Cor Time B
                                </label>
                                <button
                                  onClick={() =>
                                    setShowColorPicker({
                                      teamIdx: -2,
                                      color:
                                        fixedColors.teamB || SHIRT_COLORS[7],
                                    })
                                  }
                                  className="w-full h-10 rounded-xl flex items-center justify-between px-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                                >
                                  <div className="flex items-center gap-2">
                                    {(() => {
                                      const color = fixedColors.teamB || SHIRT_COLORS[7];
                                      const idx = SHIRT_COLORS.indexOf(color);
                                      const ShirtIcon = idx !== -1 ? TEAM_ICONS[idx] : TEAM_ICONS[7];
                                      return <ShirtIcon size={24} className="brightness-110 drop-shadow-md inline-block" />;
                                    })()}
                                  </div>
                                  <Palette
                                    size={14}
                                    className="text-[#34d399]"
                                  />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="p-5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 space-y-4 shadow-xl">
                          <div className="flex items-start justify-between">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1.5 h-6">
                                <span className="flex items-center justify-center border border-white/20 rounded-full w-5 h-5 text-[10px] font-black text-[#34d399]">
                                  G
                                </span>
                                <span className="text-[11px] font-black uppercase tracking-widest text-white">
                                  Goleiro fixo
                                </span>
                              </div>
                              <p className="text-[10px] text-white/50 font-bold mt-0.5">
                                Ativa a opção de definir goleiros nas ações do jogador.
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                setOrgProSettings((prev) => ({
                                  ...prev,
                                  allowFixedGoalkeeper:
                                    !prev.allowFixedGoalkeeper,
                                }))
                              }
                              className={`w-12 h-6 rounded-full p-1 transition-colors relative shrink-0 cursor-pointer ${orgProSettings.allowFixedGoalkeeper !== false ? "bg-[#34d399]" : "bg-white/10"}`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full transition-transform ${orgProSettings.allowFixedGoalkeeper !== false ? "translate-x-6 bg-[#1e3d2f]" : "translate-x-0 bg-white"} shadow-sm`}
                              />
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            const duration =
                              parseInt(
                                (
                                  document.getElementById(
                                    "tab-match-duration",
                                  ) as HTMLInputElement
                                ).value,
                              ) || 10;
                            const goals =
                              parseInt(
                                (
                                  document.getElementById(
                                    "tab-match-goals",
                                  ) as HTMLInputElement
                                ).value,
                              ) || 5;
                            const playersCount =
                              parseInt(
                                (
                                  document.getElementById(
                                    "tab-match-players",
                                  ) as HTMLInputElement
                                ).value,
                              ) || 5;

                            if (
                              duration <= 0 ||
                              goals <= 0 ||
                              playersCount <= 0
                            ) {
                              setToast({
                                message:
                                  "As configurações devem ser maiores que zero.",
                                type: "warning",
                              });
                              setTimeout(() => setToast(null), 3000);
                              return;
                            }

                            if (isInitialSetupFlow) {
                              if (players.length < playersCount * 2) {
                                setShowNotEnoughPlayersModal(true);
                                return;
                              }

                              // For first time setup, ensure everyone is absent
                              setPlayers((prev) =>
                                prev.map((p) => ({
                                  ...p,
                                  isAvailable: false,
                                  arrivedAt: undefined,
                                })),
                              );
                              setTeams([]); // Clear teams since everyone is now absent
                              setIsInitialSetupFlow(false);
                              setFirstSetupDone(true);
                              safeLocalStorage.setItem(
                                `futquina_first_setup_done_${groupId}`,
                                "true",
                              );
                              setShowSetupGuide(true);

                              setMatch((prev) => ({
                                ...prev,
                                config: {
                                  duration,
                                  goalLimit: goals,
                                  playersPerTeam: playersCount,
                                },
                                timeRemaining: duration * 60,
                                isActive: false,
                                isPaused: true,
                                hasEnded: false,
                                teamAIndex: -1,
                                teamBIndex: -1,
                                scoreA: 0,
                                scoreB: 0,
                                events: [],
                              }));
                              setTeamsTab("chegada");
                      } else {
                              if (players.length < playersCount * 2) {
                                setShowInsufficientPlayersModal(true);
                                return;
                              }

                              // Update config directly including playersPerTeam so it reflects dynamically in the active matches
                              setMatch((prev) => {
                                let newTimeRemaining = prev.timeRemaining;
                                if (
                                  !prev.isActive ||
                                  prev.hasEnded ||
                                  prev.isPaused
                                ) {
                                  newTimeRemaining = duration * 60;
                          } else if (duration !== prev.config.duration) {
                                  newTimeRemaining =
                                    prev.timeRemaining +
                                    (duration - prev.config.duration) * 60;
                                }
                                if (newTimeRemaining < 0) newTimeRemaining = 0;

                                return {
                                  ...prev,
                                  config: {
                                    ...prev.config,
                                    duration,
                                    goalLimit: goals,
                                    playersPerTeam: playersCount,
                                  },
                                  timeRemaining: newTimeRemaining,
                                };
                              });
                              const availableTotal = players.filter(
                                (p) => p.isAvailable,
                              ).length;
                              if (availableTotal >= playersCount * 2) {
                                // Re-sort players by arrival order to ensure consistency
                                const availablePlayers = [...players]
                                  .filter((p) => p.isAvailable)
                                  .sort(
                                    (a, b) =>
                                      (a.arrivedAt || 0) - (b.arrivedAt || 0),
                                  );

                                const uniquePlayerIds = availablePlayers.map(
                                  (p) => p.id,
                                );
                                const newTeams: Team[] = [];

                                for (
                                  let i = 0;
                                  i < uniquePlayerIds.length;
                                  i += playersCount
                                ) {
                                  const teamPlayers = uniquePlayerIds.slice(
                                    i,
                                    i + playersCount,
                                  );
                                  const teamLetter = String.fromCharCode(
                                    65 + Math.floor(i / playersCount),
                                  );
                                  newTeams.push({
                                    id: generateId(),
                                    name: `Time ${teamLetter}`,
                                    playerIds: teamPlayers,
                                    iconIdx: getNextTeamIconIdx(newTeams),
                                    color: getNextTeamColor(newTeams),
                                  });
                                }

                                setTeams(newTeams);
                                if (newTeams.length >= 2) {
                                  setMatch((prev) => ({
                                    ...prev,
                                    teamAIndex: 0,
                                    teamBIndex: 1,
                                    scoreA: 0,
                                    scoreB: 0,
                                    timeRemaining: prev.config.duration * 60,
                                    isActive: false,
                                    isPaused: true,
                                    hasEnded: false,
                                    events: [],
                                  }));
                                }

                                setTeamsTab("proximos");
                                setToast({
                                  message:
                                    "Configurações aplicadas e times formados!",
                                  type: "success",
                                });
                        } else {
                                setTeamsTab("chegada");
                                setShowArrivalStepGuide(true);
                              setArrivalCardIndex(0);
                                setToast({
                                  message: "Configurações aplicadas!",
                                  type: "success",
                                });
                              }
                              setTimeout(() => setToast(null), 3000);
                            }

                            // Sync session players without resetting isAvailable
                            setSessionPlayerIds(players.map((p) => p.id));
                          }}
                          className="w-full h-10 bg-gradient-to-r from-[#59b823] via-[#75c628] to-[#25660e] text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg hover:opacity-90 transition-all active:scale-95 cursor-pointer flex items-center justify-center"
                        >
                          Aplicar Configurações
                        </button>
                      </div>
                    </div>
                  ) : teamsTab === "chegada" ? (
                    <div className="space-y-6 pb-24">
                      {firstSetupDone &&
                        players.filter((p) => sessionPlayerIds.includes(p.id))
                          .length > 0 && (
                          <div className="flex justify-between items-center">
                            <h3 className="text-sm font-black uppercase tracking-widest text-white">
                              ORDEM DE CHEGADA
                            </h3>
                            <div className="flex flex-row items-center gap-2">
                              {players.some(
                                (p) =>
                                  sessionPlayerIds.includes(p.id) &&
                                  !p.isAvailable,
                              ) && (
                                <button
                                  onClick={() => {
                                    const now = Date.now();
                                    
                                    setPlayers((prev) =>
                                      prev.map((pl, idx) => {
                                        if (sessionPlayerIds.includes(pl.id)) {
                                          return {
                                            ...pl,
                                            isAvailable: true,
                                            arrivedAt: pl.arrivedAt || now + idx,
                                          };
                                        }
                                        return pl;
                                      }),
                                    );

                                    setTeams((prevTeams) => {
                                      const playersInExistingTeams = new Set(
                                        prevTeams.flatMap((t) => t.playerIds),
                                      );
                                      const missingSessionPlayerIds =
                                        sessionPlayerIds.filter(
                                          (id) =>
                                            !playersInExistingTeams.has(id),
                                        );

                                      if (missingSessionPlayerIds.length === 0)
                                        return prevTeams;

                                      const playersPerTeam =
                                        match.config.playersPerTeam;
                                      const newAddedTeams: Team[] = [];

                                      for (
                                        let i = 0;
                                        i < missingSessionPlayerIds.length;
                                        i += playersPerTeam
                                      ) {
                                        const teamPlayers =
                                          missingSessionPlayerIds.slice(
                                            i,
                                            i + playersPerTeam,
                                          );
                                        const teamIndex =
                                          prevTeams.length +
                                          newAddedTeams.length;
                                        const teamLetter =
                                          String.fromCharCode(
                                            65 + (teamIndex % 26),
                                          );
                                        newAddedTeams.push({
                                          id: generateId(),
                                          name: `Time ${teamLetter}`,
                                          playerIds: teamPlayers,
                                          iconIdx: getNextTeamIconIdx([
                                            ...prevTeams,
                                            ...newAddedTeams,
                                          ]),
                                          color: getNextTeamColor([
                                            ...prevTeams,
                                            ...newAddedTeams,
                                          ]),
                                        });
                                      }
                                      return [...prevTeams, ...newAddedTeams];
                                    });
                                  }}
                                  className="px-4 py-2 bg-gradient-to-r from-[#59b823] via-[#75c628] to-[#25660e] text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg hover:opacity-90 transition-all active:scale-95 flex items-center gap-2"
                                >
                                  <span className="text-white">
                                    <CheckCircle2 size={16} />
                                  </span>
                                  <span>TODOS</span>
                                </button>
                              )}
                              {players.filter((p) => p.isAvailable).length >=
                                match.config.playersPerTeam * 2 && (
                                <button
                                  onClick={() => {
                                    if (teams.some((t) => t.playerIds.length > 0)) {
                                      if (match.isActive) {
                                        setTeamsTab("historico");
                                } else {
                                        // Ensure first two teams are selected if not already
                                        if (
                                          teams.length >= 2 &&
                                          (match.teamAIndex === -1 ||
                                            match.teamBIndex === -1)
                                        ) {
                                          setMatch((prev) => ({
                                            ...prev,
                                            teamAIndex: 0,
                                            teamBIndex: 1,
                                          }));
                                        }
                                        setTeamsTab("proximos");
                                      }
                                      return;
                                    }

                                    // Ensure teams are generated from all available players in arrival order
                                    const availablePlayers = [...players]
                                      .filter((p) => p.isAvailable)
                                      .sort(
                                        (a, b) =>
                                          (a.arrivedAt || 0) -
                                          (b.arrivedAt || 0),
                                      );

                                    const playersPerTeam =
                                      match.config.playersPerTeam;
                                    const minNeeded = playersPerTeam * 2;

                                    if (availablePlayers.length < minNeeded) {
                                      setShowInsufficientPlayersModal(true);
                                      return;
                                    }

                                    const updatedPlayerIds =
                                      availablePlayers.map((p) => p.id);
                                    const uniquePlayerIds: string[] = [];
                                    const seenIds = new Set<string>();
                                    updatedPlayerIds.forEach((id) => {
                                      if (!seenIds.has(id)) {
                                        uniquePlayerIds.push(id);
                                        seenIds.add(id);
                                      }
                                    });

                                    const newTeams: Team[] = [];

                                    for (
                                      let i = 0;
                                      i < uniquePlayerIds.length;
                                      i += playersPerTeam
                                    ) {
                                      const teamPlayers = uniquePlayerIds.slice(
                                        i,
                                        i + playersPerTeam,
                                      );
                                      const teamIndex = Math.floor(
                                        i / playersPerTeam,
                                      );
                                      const teamLetter = String.fromCharCode(
                                        65 + teamIndex,
                                      );
                                      newTeams.push({
                                        id: generateId(),
                                        name: `Time ${teamLetter}`,
                                        playerIds: teamPlayers,
                                        iconIdx: getNextTeamIconIdx(newTeams),
                                        color: getNextTeamColor(newTeams),
                                      });
                                    }

                                    setTeams(newTeams);

                                    // Pre-select first two complete teams for a match
                                    if (newTeams.length >= 2) {
                                      setMatch((prev) => ({
                                        ...prev,
                                        teamAIndex: 0,
                                        teamBIndex: 1,
                                        scoreA: 0,
                                        scoreB: 0,
                                        timeRemaining:
                                          prev.config.duration * 60,
                                        isActive: false,
                                        isPaused: true,
                                        hasEnded: false,
                                        events: [],
                                      }));
                                    }

                                    setTeamsTab("proximos");
                                  }}
                                  className="px-4 py-2 bg-gradient-to-r from-[#59b823] via-[#75c628] to-[#25660e] text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg hover:opacity-90 transition-all active:scale-95 flex items-center gap-2"
                                >
                                  <span className="text-white">
                                    <CheckCircle2 size={16} />
                                  </span>
                                  <span>PRONTO</span>
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                      {players.filter((p) => p.isAvailable).length <
                        match.config.playersPerTeam * 2 &&
                        players.filter((p) => sessionPlayerIds.includes(p.id))
                          .length > 0 && (
                          <div className="bg-emerald-500/10 rounded-2xl p-4 flex items-center gap-4 border border-emerald-500/20 shadow-sm mb-4 backdrop-blur-md">
                            <div className="text-emerald-400 flex items-center justify-center shrink-0">
                              <IoMdDoneAll size={24} />
                            </div>
                            <div className="flex-1 flex flex-col">
                              <h5 className="text-[13px] font-medium text-white border-black/10 leading-tight">
                                Marque os jogadores que já estão presentes na
                                pelada
                              </h5>
                            </div>
                          </div>
                        )}

                      {!isDataLoaded || players.length === 0 ? (
                        <div className="w-full flex flex-col gap-8 pb-8">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <div key={`skel-arrival-${idx}`} className="h-16 flex items-center justify-between p-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-sm relative overflow-hidden animate-pulse">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg]" />
                                <div className="flex items-center gap-3 w-full">
                                  <div className="w-10 h-10 rounded-full bg-white/10 shrink-0" />
                                  <div className="flex-1 flex flex-col gap-1.5">
                                    <div className="w-24 h-3 bg-white/10 rounded-full" />
                                    <div className="w-16 h-2 bg-white/5 rounded-full" />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-center">
                            <button
                              onClick={() => {
                                setCurrentScreen("players");
                                setPlayersTab("jogadores");
                              }}
                              className="px-6 py-3 bg-gradient-to-r from-[#59b823] via-[#75c628] to-[#25660e] text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg hover:opacity-90 transition-all active:scale-95 cursor-pointer"
                            >
                              CRIAR JOGADORES
                            </button>
                          </div>
                        </div>
                      ) : players.filter((p) => sessionPlayerIds.includes(p.id))
                        .length === 0 ? (
                        <div className="min-h-[450px] flex flex-col items-center justify-center gap-8 w-full">
                          <div className="flex flex-col items-center gap-4 opacity-20 text-white text-xs">
                            <span className="font-bold uppercase tracking-widest text-[11px]">
                              Nenhum jogador na sessão
                            </span>
                          </div>
                            <button
                              onClick={() => {
                                if (players.length < 2) {
                                  setCurrentScreen("players");
                                  setPlayersTab("jogadores");
                          } else {
                                  setCurrentScreen("teams");
                                  setTeamsTab("configuracao");
                                }
                              }}
                              className="px-6 py-3 bg-gradient-to-r from-[#59b823] via-[#75c628] to-[#25660e] text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg hover:opacity-90 transition-all active:scale-95 cursor-pointer"
                            >
                              {players.length < 2
                                ? "CRIAR JOGADORES"
                                : "CONFIGURAR PARTIDA"}
                            </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {sessionPlayersSorted.map((p) => (
                            <button
                              key={`arrival-player-below-${p.id}`}
                              onClick={() => {
                                const isNowAvailable = !p.isAvailable;
                                setPlayers((prev) =>
                                  prev.map((pl) =>
                                    pl.id === p.id
                                      ? {
                                          ...pl,
                                          isAvailable: isNowAvailable,
                                          arrivedAt: isNowAvailable
                                            ? Date.now()
                                            : undefined,
                                        }
                                      : pl,
                                  ),
                                );

                                if (isNowAvailable) {
                                  setTeams((prevTeams) => {
                                    // 1. Get all players currently in teams, deduplicated
                                    const allPlayerIds = prevTeams.flatMap(
                                      (t) => t.playerIds,
                                    );
                                    if (allPlayerIds.includes(p.id))
                                      return prevTeams;

                                    // 2. Add new player to the end
                                    const updatedPlayerIds = [
                                      ...allPlayerIds,
                                      p.id,
                                    ];
                                    // 3. Re-group into teams of N
                                    const newTeams: Team[] = [];
                                    const playersPerTeam =
                                      match.config.playersPerTeam;
                                    for (
                                      let i = 0;
                                      i < updatedPlayerIds.length;
                                      i += playersPerTeam
                                    ) {
                                      const teamPlayers =
                                        updatedPlayerIds.slice(
                                          i,
                                          i + playersPerTeam,
                                        );
                                      const teamIndex = Math.floor(
                                        i / playersPerTeam,
                                      );
                                      const teamLetter = String.fromCharCode(
                                        65 + teamIndex,
                                      );
                                      newTeams.push({
                                        id: generateId(),
                                        name: `Time ${teamLetter}`,
                                        playerIds: teamPlayers,
                                        iconIdx: getNextTeamIconIdx(newTeams),
                                        color: getNextTeamColor(newTeams),
                                      });
                                    }
                                    return newTeams;
                                  });
                          } else {
                                  setTeams((prevTeams) => {
                                    // 1. Get all players currently in teams
                                    const allPlayerIds = prevTeams.flatMap(
                                      (t) => t.playerIds,
                                    );
                                    // 2. Remove player
                                    const updatedPlayerIds =
                                      allPlayerIds.filter((id) => id !== p.id);
                                    // 3. Re-group into teams of N
                                    const newTeams: Team[] = [];
                                    const playersPerTeam =
                                      match.config.playersPerTeam;
                                    for (
                                      let i = 0;
                                      i < updatedPlayerIds.length;
                                      i += playersPerTeam
                                    ) {
                                      const teamPlayers =
                                        updatedPlayerIds.slice(
                                          i,
                                          i + playersPerTeam,
                                        );
                                      const teamIndex = Math.floor(
                                        i / playersPerTeam,
                                      );
                                      const teamLetter = String.fromCharCode(
                                        65 + teamIndex,
                                      );
                                      newTeams.push({
                                        id: generateId(),
                                        name: `Time ${teamLetter}`,
                                        playerIds: teamPlayers,
                                        iconIdx: getNextTeamIconIdx(newTeams),
                                        color: getNextTeamColor(newTeams),
                                      });
                                    }
                                    return newTeams;
                                  });
                                }
                              }}
                              className={`flex items-center gap-3 p-3 rounded-2xl border transition-all active:scale-[0.98] relative overflow-hidden ${
                                p.isAvailable
                                  ? "bg-white/5 backdrop-blur-md border-white/10 text-white shadow-sm"
                                  : "bg-white/5 border-white/5 text-white/40 opacity-60 hover:bg-white/10"
                              }`}
                            >
                              {p.isAvailable && (
                                <motion.div
                                  key={`sweep-${p.id}`}
                                  initial={{ x: "-200%", opacity: 0 }}
                                  animate={{ x: "200%", opacity: [0, 1, 1, 0] }}
                                  transition={{ 
                                    duration: 1, 
                                    ease: "easeInOut",
                                    times: [0, 0.2, 0.8, 1]
                                  }}
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] pointer-events-none z-20"
                                />
                              )}
                              <div
                                className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/10`}
                              >
                                {p.photo ? (
                                  <img
                                    src={p.photo}
                                    alt="P"
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <span
                                    className={
                                      (p.isAvailable
                                        ? "text-white/80"
                                        : "text-white/40") +
                                      " flex items-center shrink-0"
                                    }
                                  >
                                    <IoPersonOutline size={16} />
                                  </span>
                                )}
                              </div>
                              <div className="flex-1 text-left flex flex-col gap-0.5">
                                <div
                                  className={`text-xs font-normal tracking-tight capitalize leading-none ${p.isAvailable ? "text-white" : "text-white/50"}`}
                                >
                                  {p.name.toLowerCase()}
                                </div>
                                <div
                                  className={`text-[8px] font-bold uppercase ${p.isAvailable ? "text-emerald-400" : "text-white/30"}`}
                                >
                                  {p.isAvailable ? "CONFIRMADO" : "Aguardando"}
                                </div>
                              </div>
                              {p.isAvailable && (
                                <CheckCircle2
                                  size={16}
                                  className="text-emerald-400"
                                />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : teamsTab === "historico" ? (
                    <div
                      className={`space-y-6 w-full ${match.isActive ? "pt-6 px-2 sm:px-6 pb-0 overflow-hidden" : "pb-24"}`}
                    >
                      {!match.isActive ? (
                        <div className="min-h-[450px] flex flex-col items-center justify-center gap-8 w-full">
                          {players.filter((p) => p.isAvailable).length === 0 ? (
                            <>
                              <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto mb-2 space-y-4 bg-black/5 p-6 rounded-xl border border-black/10 shadow-sm backdrop-blur-sm animate-pulse mt-4">
                                <div className="w-24 h-2 bg-white/10 rounded-full mb-2" />
                                <div className="flex items-center justify-between gap-4 px-2 py-2 w-full">
                                  <div className="flex-1 flex flex-col items-center text-center space-y-1">
                                    <div className="w-10 h-10 rounded-full bg-white/10 shrink-0" />
                                    <div className="w-12 h-10 bg-white/10 rounded-md mt-2" />
                                  </div>
                                  <div className="text-sm font-black text-white/20 uppercase tracking-widest">
                                    vs
                                  </div>
                                  <div className="flex-1 flex flex-col items-center text-center space-y-1">
                                    <div className="w-10 h-10 rounded-full bg-white/10 shrink-0" />
                                    <div className="w-12 h-10 bg-white/10 rounded-md mt-2" />
                                  </div>
                                </div>
                                <div className="w-full h-12 bg-white/5 rounded-lg border border-white/5 mt-4" />
                              </div>
                              <button
                                onClick={() => {
                                  if (players.length < 2) {
                                    setCurrentScreen("players");
                                    setPlayersTab("jogadores");
                            } else {
                                    setTeamsTab("configuracao");
                                    if (!firstSetupDone) {
                                      setIsInitialSetupFlow(true);
                                    }
                                  }
                                }}
                                className="px-6 py-3 bg-gradient-to-r from-[#59b823] via-[#75c628] to-[#25660e] text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg hover:opacity-90 transition-all active:scale-95 cursor-pointer"
                              >
                                {players.length < 2
                                  ? "CRIAR JOGADORES"
                                  : "CONFIGURAR PARTIDA"}
                              </button>
                            </>
                          ) : players.filter((p) => p.isAvailable).length <
                            match.config.playersPerTeam * 2 ? (
                            <>
                              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                                Faltam{" "}
                                {match.config.playersPerTeam * 2 -
                                  players.filter((p) => p.isAvailable)
                                    .length}{" "}
                                jogadores para iniciar
                              </p>
                              <button
                                onClick={() => setTeamsTab("chegada")}
                                className="px-4 py-2 bg-gradient-to-r from-[#59b823] via-[#75c628] to-[#25660e] text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg hover:opacity-90 transition-all active:scale-95"
                              >
                                Confirmar Chegada
                              </button>
                            </>
                          ) : (
                            <>
                              {lastMatchResult ? (
                                <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto mb-2 space-y-4 bg-black/5 p-6 rounded-xl border border-black/10 shadow-sm backdrop-blur-sm">
                                  <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">
                                    Última Partida
                                  </p>
                                  <div className="flex items-center justify-between gap-4 px-2 py-2 w-full">
                                    <div className="flex-1 flex flex-col items-center text-center space-y-1">
                                      <div
                                        className="w-10 h-10 flex items-center justify-center shrink-0 drop-shadow-sm"
                                        style={{
                                          color:
                                            lastMatchResult.teamAColor ||
                                            teams[lastMatchResult.teamAIndex]
                                              ?.color ||
                                            TEAM_COLORS[0],
                                        }}
                                      >
                                        {(() => {
                                          const IconA =
                                            TEAM_ICONS[
                                              teams[lastMatchResult.teamAIndex]
                                                ?.iconIdx ??
                                                lastMatchResult.teamAIndex %
                                                  TEAM_ICONS.length
                                            ];
                                          return <IconA size={24} />;
                                        })()}
                                      </div>
                                      <div className="text-4xl font-black text-white tabular-nums tracking-tighter leading-none mt-2">
                                        {lastMatchResult.scoreA}
                                      </div>
                                    </div>

                                    <div className="text-sm font-black text-white/40 uppercase tracking-widest">
                                      vs
                                    </div>

                                    <div className="flex-1 flex flex-col items-center text-center space-y-1">
                                      <div
                                        className="w-10 h-10 flex items-center justify-center shrink-0 drop-shadow-sm"
                                        style={{
                                          color:
                                            lastMatchResult.teamBColor ||
                                            teams[lastMatchResult.teamBIndex]
                                              ?.color ||
                                            TEAM_COLORS[1],
                                        }}
                                      >
                                        {(() => {
                                          const IconB =
                                            TEAM_ICONS[
                                              teams[lastMatchResult.teamBIndex]
                                                ?.iconIdx ??
                                                lastMatchResult.teamBIndex %
                                                  TEAM_ICONS.length
                                            ];
                                          return <IconB size={24} />;
                                        })()}
                                      </div>
                                      <div className="text-4xl font-black text-white tabular-nums tracking-tighter leading-none mt-2">
                                        {lastMatchResult.scoreB}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Scorers display */}
                                  <div className="w-full space-y-2 mt-2 pt-4 border-t border-black/10">
                                    {(lastMatchResult.events || []).map(
                                      (event, idx) => {
                                        const p = players.find(
                                          (pl) => pl.id === event.playerId,
                                        );
                                        const a = event.assistId
                                          ? players.find(
                                              (pl) => pl.id === event.assistId,
                                            )
                                          : null;
                                        if (!p) return null;
                                        return (
                                          <div
                                            key={`last-game-event-${event.id || 'e'}-${idx}`}
                                            className="flex items-center justify-between gap-2 p-1.5 rounded-lg border border-black/5"
                                            style={{
                                              backgroundColor:
                                                (event.team === "A"
                                                  ? lastMatchResult.teamAColor ||
                                                    teams[
                                                      lastMatchResult.teamAIndex
                                                    ]?.color
                                                  : lastMatchResult.teamBColor ||
                                                    teams[
                                                      lastMatchResult.teamBIndex
                                                    ]?.color) === "#1a1a1a"
                                                  ? "#ffffff08"
                                                  : (event.team === "A"
                                                      ? lastMatchResult.teamAColor ||
                                                        teams[
                                                          lastMatchResult
                                                            .teamAIndex
                                                        ]?.color
                                                      : lastMatchResult.teamBColor ||
                                                        teams[
                                                          lastMatchResult
                                                            .teamBIndex
                                                        ]?.color ||
                                                        TEAM_COLORS[0]) + "10",
                                            }}
                                          >
                                            <div className="flex items-center gap-1.5 overflow-hidden">
                                              <div className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center shrink-0 border border-black/10">
                                                {p.photo ? (
                                                  <img
                                                    src={p.photo}
                                                    className="w-full h-full object-cover rounded-full"
                                                    referrerPolicy="no-referrer"
                                                  />
                                                ) : (
                                                  <span className="text-black flex items-center shrink-0">
                                                    <IoPersonOutline size={8} />
                                                  </span>
                                                )}
                                              </div>
                                              <div className="flex flex-col gap-0.5 min-w-0">
                                                <span className="text-xs font-normal tracking-tight capitalize truncate text-black/90 leading-none">
                                                  {p.name.toLowerCase()}
                                                </span>
                                                <div className="flex gap-0.5">
                                                  {[1, 2, 3, 4, 5].map(
                                                    (star) => (
                                                      <Star
                                                        key={`star-h-${p.id}-${star}`}
                                                        size={6}
                                                        className={`${(p.stars || 3) >= star ? "fill-yellow-400 text-yellow-400" : "text-black/10"}`}
                                                      />
                                                    ),
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                              {a && (
                                                <div
                                                  className="flex items-center gap-1 text-[8px] font-normal text-zinc-400"
                                                  title={`Assistência: ${a.name}`}
                                                >
                                                  <Footprints size={8} />{" "}
                                                  <span>
                                                    {
                                                      a.name
                                                        .toLowerCase()
                                                        .split(" ")[0]
                                                    }
                                                  </span>
                                                </div>
                                              )}
                                              <div className="px-1.5 py-0.5 rounded-sm bg-black text-white text-[8px] font-black uppercase tracking-widest">
                                                GOL
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      },
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <p className="text-xs font-medium text-zinc-400">
                                  Agora você está pronto para iniciar uma
                                  partida
                                </p>
                              )}
                              <button
                                onClick={() => {
                                  // Select first two teams if available
                                  if (teams.length >= 2) {
                                    setMatch((prev) => ({
                                      ...prev,
                                      teamAIndex: 0,
                                      teamBIndex: 1,
                                    }));
                                  }
                                  setTeamsTab("proximos");
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-[#59b823] via-[#75c628] to-[#25660e] text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg hover:opacity-90 transition-all active:scale-95"
                              >
                                Ir para Próximos
                              </button>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-8 relative pb-12">
                          {match.hasEnded && (
                            <div className="absolute inset-0 z-40 bg-black/10 backdrop-blur-[1px] rounded-2xl pointer-events-auto cursor-default" />
                          )}
                          <div className="sticky top-[-1px] z-40 bg-white/5 backdrop-blur-md border border-white/10 p-4 sm:p-6 flex flex-row items-center justify-between gap-2 sm:gap-4 rounded-2xl w-full max-w-3xl mx-auto relative overflow-hidden shadow-lg">
                            <div className="flex-1 flex flex-col items-center text-center space-y-2 sm:space-y-4">
                              <button
                                className="w-10 h-10 sm:w-20 sm:h-20 transition-transform hover:scale-110 active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed drop-shadow-sm"
                                disabled={match.hasEnded}
                                onClick={() => {
                                  if (match.teamAIndex === -1) return;
                                  setShowColorPicker({
                                    teamIdx: match.teamAIndex,
                                    color:
                                      (fixedColors.enabled &&
                                        fixedColors.teamA) ||
                                      teams[match.teamAIndex]?.color ||
                                      TEAM_COLORS[0],
                                  });
                                }}
                              >
                                {(() => {
                                  const team = teams[match.teamAIndex];
                                  if (!team) return null;
                                  const Icon = getTeamIcon(team, "A");
                                  const color =
                                    (fixedColors.enabled &&
                                      fixedColors.teamA) ||
                                    team.color ||
                                    TEAM_COLORS[0];
                                  return (
                                    <div
                                      className="w-full h-full drop-shadow-md flex items-center justify-center"
                                      style={{ color }}
                                    >
                                      <Icon size={70} />
                                    </div>
                                  );
                                })()}
                              </button>
                              <div
                                className={`text-4xl sm:text-6xl font-black origin-center text-white ${!match.isActive || match.isPaused ? "opacity-50" : ""} tabular-nums tracking-tighter leading-none flex items-center justify-center w-12 h-12 sm:w-20 sm:h-20`}
                              >
                                {match.scoreA}
                              </div>
                            </div>

                            <div className="flex flex-col items-center justify-center gap-2 sm:gap-6 min-w-[70px] sm:min-w-[140px]">
                              <FlipClock
                                clockId="scoreboard-primary"
                                time={match.timeRemaining}
                                size="xs"
                              />
                              <div className="flex flex-col gap-2">
                                <div className="flex gap-2 sm:gap-3">
                                  <button
                                    disabled={
                                      !(
                                        match.teamAIndex !== -1 &&
                                        match.teamBIndex !== -1 &&
                                        teams[match.teamAIndex]?.playerIds
                                          ?.length ===
                                          match.config.playersPerTeam &&
                                        teams[match.teamBIndex]?.playerIds
                                          ?.length ===
                                          match.config.playersPerTeam
                                      ) ||
                                      match.scoreA >= match.config.goalLimit ||
                                      match.scoreB >= match.config.goalLimit
                                    }
                                    onClick={() => {
                                      setMatch((prev) => {
                                        const nextIsPaused = !prev.isPaused;
                                        if (nextIsPaused) {
                                          sounds.playPause();
                                  } else {
                                          sounds.playStartMatch();
                                        }
                                        return {
                                          ...prev,
                                          isPaused: nextIsPaused,
                                          isActive: true,
                                        };
                                      });
                                    }}
                                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all shadow-md ${match.isPaused ? "bg-[#34d399] text-[#1E3D2F] hover:opacity-90" : "bg-white/10 text-white/50 hover:bg-white/20"} disabled:opacity-20 disabled:cursor-not-allowed border border-white/5`}
                                  >
                                    {match.isPaused ? (
                                      <Play
                                        size={16}
                                        className="sm:w-5 sm:h-5"
                                        fill="currentColor"
                                      />
                                    ) : (
                                      <Pause
                                        size={16}
                                        className="sm:w-5 sm:h-5"
                                        fill="currentColor"
                                      />
                                    )}
                                  </button>
                                  <AnimatePresence>
                                    {match.isActive && (
                                      <motion.button
                                        initial={{
                                          opacity: 0,
                                          scale: 0.5,
                                          x: -20,
                                        }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        exit={{
                                          opacity: 0,
                                          scale: 0.5,
                                          x: -20,
                                        }}
                                        disabled={
                                          !(
                                            match.teamAIndex !== -1 &&
                                            match.teamBIndex !== -1 &&
                                            teams[match.teamAIndex]?.playerIds
                                              ?.length ===
                                              match.config.playersPerTeam &&
                                            teams[match.teamBIndex]?.playerIds
                                              ?.length ===
                                              match.config.playersPerTeam
                                          ) ||
                                          match.scoreA >=
                                            match.config.goalLimit ||
                                          match.scoreB >= match.config.goalLimit
                                        }
                                        onClick={finishMatch}
                                        className="p-3 rounded-full transition-all bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-20 disabled:cursor-not-allowed"
                                        title="Finalizar Partida"
                                      >
                                        <Square
                                          size={16}
                                          className="sm:w-5 sm:h-5"
                                          fill="currentColor"
                                        />
                                      </motion.button>
                                    )}
                                  </AnimatePresence>
                                </div>
                                <button
                                  disabled={
                                    !match.isActive ||
                                    !(
                                      match.teamAIndex !== -1 &&
                                      match.teamBIndex !== -1 &&
                                      teams[match.teamAIndex]?.playerIds
                                        ?.length ===
                                        match.config.playersPerTeam &&
                                      teams[match.teamBIndex]?.playerIds
                                        ?.length === match.config.playersPerTeam
                                    ) ||
                                    match.scoreA >= match.config.goalLimit ||
                                    match.scoreB >= match.config.goalLimit
                                  }
                                  onClick={finishMatch}
                                  className="px-2 sm:px-4 py-1 rounded-full bg-red-500/20 text-red-400 text-[6px] sm:text-[8px] font-black uppercase tracking-widest hover:bg-red-500/30 transition-all disabled:opacity-20 disabled:cursor-not-allowed border border-red-500/20"
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
                                    color:
                                      (fixedColors.enabled &&
                                        fixedColors.teamB) ||
                                      teams[match.teamBIndex]?.color ||
                                      TEAM_COLORS[1],
                                  });
                                }}
                              >
                                {(() => {
                                  const team = teams[match.teamBIndex];
                                  if (!team) return null;
                                  const Icon = getTeamIcon(team, "B");
                                  const color =
                                    (fixedColors.enabled &&
                                      fixedColors.teamB) ||
                                    team.color ||
                                    TEAM_COLORS[1];
                                  return (
                                    <div
                                      className="w-full h-full drop-shadow-md flex items-center justify-center"
                                      style={{ color }}
                                    >
                                      <Icon size={70} />
                                    </div>
                                  );
                                })()}
                              </button>
                              <div
                                className={`text-4xl sm:text-6xl font-black origin-center text-white ${!match.isActive || match.isPaused ? "opacity-50" : ""} tabular-nums tracking-tighter leading-none flex items-center justify-center w-12 h-12 sm:w-20 sm:h-20`}
                              >
                                {match.scoreB}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 bg-white/5 p-3 pt-4 rounded-xl border border-white/10 mb-8 relative overflow-hidden">
                            {/* Team Color Top Bars */}
                            <div
                              className="absolute top-0 left-0 w-1/2 h-1 z-10"
                              style={{
                                backgroundColor:
                                  (fixedColors.enabled && fixedColors.teamA) ||
                                  teams[match.teamAIndex]?.color ||
                                  TEAM_COLORS[0],
                              }}
                            />
                            <div
                              className="absolute top-0 right-0 w-1/2 h-1 z-10"
                              style={{
                                backgroundColor:
                                  (fixedColors.enabled && fixedColors.teamB) ||
                                  teams[match.teamBIndex]?.color ||
                                  TEAM_COLORS[1],
                              }}
                            />
                            <div className="space-y-2 relative z-20">
                              {sortedTeamAPlayers.map((pid, idx) => {
                                const p = players.find((pl) => pl.id === pid);
                                if (!p) return null;
                                const matchGoals = match.events.filter(
                                  (e) =>
                                    e.type === "goal" && e.playerId === pid,
                                ).length;
                                const matchAssists = match.events.filter(
                                  (e) =>
                                    e.type === "goal" && e.assistId === pid,
                                ).length;
                                return (
                                  <button
                                    key={`partida-p-a-${pid}`}
                                    disabled={
                                      match.scoreA >= match.config.goalLimit ||
                                      match.scoreB >= match.config.goalLimit
                                    }
                                    onClick={() => {
                                      if (swappingPlayerId) {
                                        if (swappingPlayerId === pid) {
                                          setSwappingPlayerId(null);
                                          setToast({
                                            message: "Troca cancelada.",
                                            type: "info",
                                          });
                                          return;
                                        }

                                        handleGoalkeeperSwap(
                                          swappingPlayerId,
                                          pid,
                                        );
                                        setTeams((prev) => {
                                          const newTeams = [...prev].map(
                                            (team) => ({
                                              ...team,
                                              playerIds: [...team.playerIds],
                                            }),
                                          );
                                          let swapTeamIdx = -1;
                                          let currentTeamIdx = match.teamAIndex;

                                          for (
                                            let i = 0;
                                            i < newTeams.length;
                                            i++
                                          ) {
                                            if (
                                              newTeams[i].playerIds.includes(
                                                swappingPlayerId,
                                              )
                                            )
                                              swapTeamIdx = i;
                                          }

                                          if (
                                            swapTeamIdx !== -1 &&
                                            currentTeamIdx !== -1
                                          ) {
                                            const pAId = swappingPlayerId;
                                            const pBId = pid;
                                            if (
                                              swapTeamIdx === currentTeamIdx
                                            ) {
                                              newTeams[swapTeamIdx].playerIds =
                                                newTeams[
                                                  swapTeamIdx
                                                ].playerIds.map((id) => {
                                                  if (id === pAId) return pBId;
                                                  if (id === pBId) return pAId;
                                                  return id;
                                                });
                                      } else {
                                              newTeams[swapTeamIdx].playerIds =
                                                newTeams[
                                                  swapTeamIdx
                                                ].playerIds.map((id) =>
                                                  id === pAId ? pBId : id,
                                                );
                                              newTeams[
                                                currentTeamIdx
                                              ].playerIds = newTeams[
                                                currentTeamIdx
                                              ].playerIds.map((id) =>
                                                id === pBId ? pAId : id,
                                              );
                                            }
                                            setToast({
                                              message: "Jogadores trocados!",
                                              type: "success",
                                            });
                                          }
                                          return newTeams;
                                        });
                                        setSwappingPlayerId(null);
                                        return;
                                      }
                                      setShowPlayerActionsModal({
                                        teamIndex: match.teamAIndex,
                                        playerId: pid,
                                      });
                                    }}
                                    className={`w-full flex flex-row-reverse items-center p-1.5 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-white/5 hover:bg-white/10 ${
                                      swappingPlayerId === pid
                                        ? "border-2 border-[#53B986] shadow-lg scale-105 relative z-10"
                                        : swappingPlayerId && swappingPlayerId !== pid
                                          ? "border-2 border-[#53B986] shadow-sm animate-pulse shadow-[#53B986]/10"
                                          : "border border-white/5 group"
                                    }`}
                                  >
                                    <div className="w-5 h-5 sm:w-4 sm:h-4 rounded-full bg-transparent flex items-center justify-center shrink-0 overflow-hidden ml-3">
                                      {p.isGoalkeeper ? (
                                        <div className="flex items-center justify-center rounded-full w-4 h-4 text-[9px] font-black leading-none text-white/70">
                                          G
                                        </div>
                                      ) : p.photo ? (
                                        <img
                                          src={p.photo}
                                          className="w-full h-full object-cover rounded-full"
                                          referrerPolicy="no-referrer"
                                        />
                                      ) : (
                                        <span className="text-white/40 flex items-center shrink-0">
                                          <IoPersonOutline size={10} />
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex flex-col items-end gap-0.5 overflow-hidden">
                                      <span className="text-xs font-normal tracking-tight capitalize truncate text-white/90 leading-none text-right">
                                        {p.name.toLowerCase()}
                                      </span>
                                      <div className="flex flex-row-reverse gap-0.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <Star
                                            key={`star-${p.id}-${star}`}
                                            size={6}
                                            className={`${(p.stars || 3) >= star ? "fill-yellow-400 text-yellow-400" : "text-white/20"}`}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1 mr-auto">
                                      {matchAssists > 0 && (
                                        <div className="flex items-center gap-0.5 text-[10px] font-bold text-white/50">
                                          <Footprints size={10} />{" "}
                                          {matchAssists}
                                        </div>
                                      )}
                                      {matchGoals > 0 && (
                                        <div className="flex items-center gap-0.5 text-[10px] font-bold text-white/50">
                                          <CircleDot size={10} /> {matchGoals}
                                        </div>
                                      )}
                                      {playerEvents[p.id] && (
                                        <div className="flex items-center justify-center shrink-0 w-5 h-5 bg-white/50 rounded-full shadow-sm ml-1">
                                          {playerEvents[p.id].type ===
                                            "swap" && (
                                            <span className="text-blue-500 animate-pulse">
                                              <IoMdSwap size={12} />
                                            </span>
                                          )}
                                          {playerEvents[p.id].type === "up" && (
                                            <span className="text-green-800 animate-bounce">
                                              <IoMdArrowUp size={12} />
                                            </span>
                                          )}
                                          {playerEvents[p.id].type ===
                                            "down" && (
                                            <span className="text-red-500 animate-bounce">
                                              <IoMdArrowDown size={12} />
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                              {Array.from({
                                length: Math.max(
                                  0,
                                  match.config.playersPerTeam -
                                    (teams[match.teamAIndex]?.playerIds
                                      ?.length || 0),
                                ),
                              }).map((_, i) => (
                                <button
                                  key={`empty-a-${i}`}
                                  onClick={() => {
                                    if (
                                      movingPlayers &&
                                      isSelectingDestination
                                    ) {
                                      const sourceTeamIdx = teams.findIndex(
                                        (team) =>
                                          team.id === movingPlayers.teamId,
                                      );
                                      if (sourceTeamIdx === match.teamAIndex) {
                                        setToast({
                                          message:
                                            "Os jogadores já estão neste time.",
                                          type: "info",
                                        });
                                        setMovingPlayers(null);
                                        setIsSelectingDestination(false);
                                        return;
                                      }
                                      const availableSlots =
                                        match.config.playersPerTeam -
                                        (teams[match.teamAIndex]?.playerIds
                                          ?.length || 0);
                                      if (availableSlots <= 0) {
                                        setToast({
                                          message:
                                            "Este time já está completo.",
                                          type: "warning",
                                        });
                                        return;
                                      }
                                      const playersToMove =
                                        movingPlayers.playerIds.slice(
                                          0,
                                          availableSlots,
                                        );
                                      setTeams((prev) => {
                                        const newTeams = [...prev].map(
                                          (team) => ({
                                            ...team,
                                            playerIds: [...team.playerIds],
                                          }),
                                        );
                                        const sTeam = newTeams.find(
                                          (team) =>
                                            team.id === movingPlayers.teamId,
                                        );
                                        if (sTeam) {
                                          sTeam.playerIds =
                                            sTeam.playerIds.filter(
                                              (id) =>
                                                !playersToMove.includes(id),
                                            );
                                        }
                                        if (newTeams[match.teamAIndex]) {
                                          newTeams[
                                            match.teamAIndex
                                          ].playerIds.push(...playersToMove);
                                        }
                                        return newTeams.filter(
                                          (team) => team.playerIds.length > 0,
                                        );
                                      });

                                      if (
                                        playersToMove.length <
                                        movingPlayers.playerIds.length
                                      ) {
                                        setMovingPlayers((prev) =>
                                          prev
                                            ? {
                                                ...prev,
                                                playerIds:
                                                  prev.playerIds.slice(
                                                    availableSlots,
                                                  ),
                                              }
                                            : null,
                                        );
                                        setToast({
                                          message: `Apenas ${availableSlots} jogador(es) movido(s). Selecione outro time para o(s) restante(s).`,
                                          type: "info",
                                        });
                                } else {
                                        setMovingPlayers(null);
                                        setIsSelectingDestination(false);
                                        setToast({
                                          message:
                                            "Jogador(es) movido(s) para o Time A!",
                                          type: "success",
                                        });
                                      }
                                    }
                                  }}
                                  className={`w-full flex items-center justify-center p-1.5 rounded-xl border border-dashed transition-all active:scale-95 border-white/10 bg-white/5 text-white/20 hover:bg-white/10 ${movingPlayers && isSelectingDestination ? "animate-pulse border-brand-primary" : ""}`}
                                >
                                  <Plus size={12} />
                                </button>
                              ))}
                            </div>
                            <div className="space-y-2">
                              {sortedTeamBPlayers.map((pid, idx) => {
                                const p = players.find((pl) => pl.id === pid);
                                if (!p) return null;
                                const matchGoals = match.events.filter(
                                  (e) =>
                                    e.type === "goal" && e.playerId === pid,
                                ).length;
                                const matchAssists = match.events.filter(
                                  (e) =>
                                    e.type === "goal" && e.assistId === pid,
                                ).length;
                                return (
                                  <button
                                    key={`partida-p-b-${pid}`}
                                    disabled={
                                      match.scoreA >= match.config.goalLimit ||
                                      match.scoreB >= match.config.goalLimit
                                    }
                                    onClick={() => {
                                      if (swappingPlayerId) {
                                        if (swappingPlayerId === pid) {
                                          setSwappingPlayerId(null);
                                          setToast({
                                            message: "Troca cancelada.",
                                            type: "info",
                                          });
                                          return;
                                        }

                                        handleGoalkeeperSwap(
                                          swappingPlayerId,
                                          pid,
                                        );
                                        setTeams((prev) => {
                                          const newTeams = [...prev].map(
                                            (team) => ({
                                              ...team,
                                              playerIds: [...team.playerIds],
                                            }),
                                          );
                                          let swapTeamIdx = -1;
                                          let currentTeamIdx = match.teamBIndex;

                                          for (
                                            let i = 0;
                                            i < newTeams.length;
                                            i++
                                          ) {
                                            if (
                                              newTeams[i].playerIds.includes(
                                                swappingPlayerId,
                                              )
                                            )
                                              swapTeamIdx = i;
                                          }

                                          if (
                                            swapTeamIdx !== -1 &&
                                            currentTeamIdx !== -1
                                          ) {
                                            const pAId = swappingPlayerId;
                                            const pBId = pid;
                                            if (
                                              swapTeamIdx === currentTeamIdx
                                            ) {
                                              newTeams[swapTeamIdx].playerIds =
                                                newTeams[
                                                  swapTeamIdx
                                                ].playerIds.map((id) => {
                                                  if (id === pAId) return pBId;
                                                  if (id === pBId) return pAId;
                                                  return id;
                                                });
                                      } else {
                                              newTeams[swapTeamIdx].playerIds =
                                                newTeams[
                                                  swapTeamIdx
                                                ].playerIds.map((id) =>
                                                  id === pAId ? pBId : id,
                                                );
                                              newTeams[
                                                currentTeamIdx
                                              ].playerIds = newTeams[
                                                currentTeamIdx
                                              ].playerIds.map((id) =>
                                                id === pBId ? pAId : id,
                                              );
                                            }
                                            setToast({
                                              message: "Jogadores trocados!",
                                              type: "success",
                                            });
                                          }
                                          return newTeams;
                                        });
                                        setSwappingPlayerId(null);
                                        return;
                                      }
                                      setShowPlayerActionsModal({
                                        teamIndex: match.teamBIndex,
                                        playerId: pid,
                                      });
                                    }}
                                    className={`w-full flex items-center p-1.5 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-white/5 hover:bg-white/10 ${
                                      swappingPlayerId === pid
                                        ? "border-2 border-[#53B986] shadow-lg scale-105 relative z-10"
                                        : swappingPlayerId && swappingPlayerId !== pid
                                          ? "border-2 border-[#53B986] shadow-sm animate-pulse shadow-[#53B986]/10"
                                          : "border border-white/5 group"
                                    }`}
                                  >
                                    <div className="w-5 h-5 sm:w-4 sm:h-4 rounded-full bg-transparent flex items-center justify-center shrink-0 overflow-hidden mr-3">
                                      {p.isGoalkeeper ? (
                                        <div className="flex items-center justify-center rounded-full w-4 h-4 text-[9px] font-black leading-none text-white/70">
                                          G
                                        </div>
                                      ) : p.photo ? (
                                        <img
                                          src={p.photo}
                                          className="w-full h-full object-cover rounded-full"
                                          referrerPolicy="no-referrer"
                                        />
                                      ) : (
                                        <span className="text-white/40 flex items-center shrink-0">
                                          <IoPersonOutline size={10} />
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex flex-col gap-0.5 overflow-hidden">
                                      <span className="text-xs font-normal tracking-tight capitalize truncate text-white/90 leading-none">
                                        {p.name.toLowerCase()}
                                      </span>
                                      <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <Star
                                            key={`star-b-${p.id}-${star}`}
                                            size={6}
                                            className={`${(p.stars || 3) >= star ? "fill-yellow-400 text-yellow-400" : "text-white/20"}`}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1 ml-auto">
                                      {playerEvents[p.id] && (
                                        <div className="flex items-center justify-center shrink-0 w-5 h-5 bg-white/50 rounded-full shadow-sm mr-1">
                                          {playerEvents[p.id].type ===
                                            "swap" && (
                                            <span className="text-blue-500 animate-pulse">
                                              <IoMdSwap size={12} />
                                            </span>
                                          )}
                                          {playerEvents[p.id].type === "up" && (
                                            <span className="text-green-800 animate-bounce">
                                              <IoMdArrowUp size={12} />
                                            </span>
                                          )}
                                          {playerEvents[p.id].type ===
                                            "down" && (
                                            <span className="text-red-500 animate-bounce">
                                              <IoMdArrowDown size={12} />
                                            </span>
                                          )}
                                        </div>
                                      )}
                                      {matchGoals > 0 && (
                                        <div className="flex items-center gap-0.5 text-[10px] font-bold text-white/50">
                                          <CircleDot size={10} /> {matchGoals}
                                        </div>
                                      )}
                                      {matchAssists > 0 && (
                                        <div className="flex items-center gap-0.5 text-[10px] font-bold text-white/50">
                                          <Footprints size={10} />{" "}
                                          {matchAssists}
                                        </div>
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                              {Array.from({
                                length: Math.max(
                                  0,
                                  match.config.playersPerTeam -
                                    (teams[match.teamBIndex]?.playerIds
                                      ?.length || 0),
                                ),
                              }).map((_, i) => (
                                <button
                                  key={`empty-b-${i}`}
                                  onClick={() => {
                                    if (
                                      movingPlayers &&
                                      isSelectingDestination
                                    ) {
                                      const sourceTeamIdx = teams.findIndex(
                                        (team) =>
                                          team.id === movingPlayers.teamId,
                                      );
                                      if (sourceTeamIdx === match.teamBIndex) {
                                        setToast({
                                          message:
                                            "Os jogadores já estão neste time.",
                                          type: "info",
                                        });
                                        setMovingPlayers(null);
                                        setIsSelectingDestination(false);
                                        return;
                                      }
                                      const availableSlots =
                                        match.config.playersPerTeam -
                                        (teams[match.teamBIndex]?.playerIds
                                          ?.length || 0);
                                      if (availableSlots <= 0) {
                                        setToast({
                                          message:
                                            "Este time já está completo.",
                                          type: "warning",
                                        });
                                        return;
                                      }
                                      const playersToMove =
                                        movingPlayers.playerIds.slice(
                                          0,
                                          availableSlots,
                                        );
                                      setTeams((prev) => {
                                        const newTeams = [...prev].map(
                                          (team) => ({
                                            ...team,
                                            playerIds: [...team.playerIds],
                                          }),
                                        );
                                        const sTeam = newTeams.find(
                                          (team) =>
                                            team.id === movingPlayers.teamId,
                                        );
                                        if (sTeam) {
                                          sTeam.playerIds =
                                            sTeam.playerIds.filter(
                                              (id) =>
                                                !playersToMove.includes(id),
                                            );
                                        }
                                        if (newTeams[match.teamBIndex]) {
                                          newTeams[
                                            match.teamBIndex
                                          ].playerIds.push(...playersToMove);
                                        }
                                        return newTeams.filter(
                                          (team) => team.playerIds.length > 0,
                                        );
                                      });
                                      if (
                                        playersToMove.length <
                                        movingPlayers.playerIds.length
                                      ) {
                                        setMovingPlayers((prev) =>
                                          prev
                                            ? {
                                                ...prev,
                                                playerIds:
                                                  prev.playerIds.slice(
                                                    availableSlots,
                                                  ),
                                              }
                                            : null,
                                        );
                                        setToast({
                                          message: `Apenas ${availableSlots} jogador(es) movido(s). Selecione outro time para o(s) restante(s).`,
                                          type: "info",
                                        });
                                } else {
                                        setMovingPlayers(null);
                                        setIsSelectingDestination(false);
                                        setToast({
                                          message:
                                            "Jogador(es) movido(s) para o Time B!",
                                          type: "success",
                                        });
                                      }
                                    }
                                  }}
                                  className={`w-full flex items-center justify-center p-1.5 rounded-xl border border-dashed transition-all active:scale-95 border-white/10 bg-white/5 text-white/20 hover:bg-white/10 ${movingPlayers && isSelectingDestination ? "animate-pulse border-brand-primary" : ""}`}
                                >
                                  <Plus size={12} />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : teamsTab === "proximos" ? (
                    <div className="space-y-6 pb-24 relative overflow-visible w-full">
                      {firstSetupDone && teams.length >= 2 && (
                        <div className="sticky top-0 z-40 bg-[#dcdcdc] backdrop-blur-md rounded-2xl p-1 mb-2 shadow-sm border border-black/5 flex justify-between items-center">
                          <div className="flex gap-1 bg-white rounded-[11px]">
                            <div className="flex items-center gap-1.5 ml-1 bg-white rounded-[11px] px-1 py-1">
                              <button
                                onClick={() => {
                                  const newState = !autoCompleteTeams;
                                  setAutoCompleteTeams(newState);
                                  if (newState) {
                                    setShowAutoCompleteModal(true);
                            } else {
                                    setToast({
                                      message: "Subida automática desativada",
                                      type: "info",
                                    });
                                  }
                                }}
                                className={`w-9 h-5 rounded-full p-0.5 transition-all duration-300 relative ${autoCompleteTeams ? "bg-[#34d399]" : "bg-zinc-300"}`}
                                title="Subir automaticamente"
                              >
                                <div
                                  className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 transform ${autoCompleteTeams ? "translate-x-4" : "translate-x-0"}`}
                                />
                              </button>
                              <span className="text-[8px] font-black uppercase tracking-tight text-[#1E3D2F]/60 leading-[1.1] text-left max-w-[75px]">
                                Subir automaticamente
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-1 bg-white rounded-[11px] border-0">
                            <button
                              onClick={() => {
                                if (match.isActive && !match.hasEnded) return;
                                if (
                                  teams.filter(
                                    (t) =>
                                      t.playerIds.length ===
                                      match.config.playersPerTeam,
                                  ).length < 2
                                )
                                  return;

                                setShowLogoAnimation(true);
                                setTimeout(() => {
                                  randomizeTeams(match.config.playersPerTeam);
                                  setShowLogoAnimation(false);
                                  sounds.playDrawFinished();
                                  setToast({
                                    message: "Times sorteados com sucesso!",
                                    type: "success",
                                  });
                                }, 3000);
                              }}
                              disabled={
                                (match.isActive && !match.hasEnded) ||
                                teams.filter(
                                  (t) =>
                                    t.playerIds.length ===
                                    match.config.playersPerTeam,
                                ).length < 2
                              }
                              className="px-3 py-2 rounded-xl transition-all active:scale-95 hover:bg-black/5 flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <span className="text-zinc-800">
                                <PiShuffleAngularBold size={16} />
                              </span>
                              <span className="text-[8px] font-black uppercase tracking-tight text-zinc-800">
                                Sortear
                              </span>
                            </button>
                            <button
                              onClick={() => {
                                if (match.isActive && !match.hasEnded) {
                                  setShowStartMatchConfirm(true);
                                  return;
                                }

                                if (
                                  match.teamAIndex !== -1 &&
                                  match.teamBIndex !== -1 &&
                                  teams[match.teamAIndex]?.playerIds?.length ===
                                    match.config.playersPerTeam &&
                                  teams[match.teamBIndex]?.playerIds?.length ===
                                    match.config.playersPerTeam
                                ) {
                                  startNextMatch(
                                    match.teamAIndex,
                                    match.teamBIndex,
                                  );
                                }
                              }}
                              disabled={
                                !(
                                  match.teamAIndex !== -1 &&
                                  match.teamBIndex !== -1 &&
                                  teams[match.teamAIndex]?.playerIds?.length ===
                                    match.config.playersPerTeam &&
                                  teams[match.teamBIndex]?.playerIds?.length ===
                                    match.config.playersPerTeam
                                )
                              }
                              className="px-3 py-2 rounded-xl transition-all active:scale-95 hover:bg-black/5 flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <span className="text-zinc-800">
                                <IoFootballOutline size={16} />
                              </span>
                              <span className="text-[8px] font-black uppercase tracking-tight text-zinc-800">
                                Iniciar
                              </span>
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        {teams.length < 2 ? (
                          <div className="w-full flex flex-col gap-8 pb-8 pt-4">
                            <div className="space-y-4">
                              {Array.from({ length: 2 }).map((_, idx) => (
                                <div key={`skel-team-${idx}`} className="p-4 rounded-2xl border transition-all relative min-h-[110px] flex flex-col justify-center overflow-hidden shadow-sm opacity-60 border-white/10 bg-white/5 backdrop-blur-md animate-pulse">
                                  <div className="absolute top-0 left-0 right-0 h-1 bg-white/10" />
                                  <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/10" />
                                  <div className="ml-10 flex flex-col gap-2">
                                    <div className="flex gap-2">
                                      {Array.from({ length: 5 }).map((_, pIdx) => (
                                        <div key={`skel-player-${idx}-${pIdx}`} className="w-8 h-8 rounded-full bg-white/10" />
                                      ))}
                                    </div>
                                    <div className="w-32 h-3 bg-white/10 rounded-full mt-2" />
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-center">
                              <button
                                onClick={() => {
                                  if (
                                    players.filter((p) =>
                                      sessionPlayerIds.includes(p.id),
                                    ).length > 0
                                  ) {
                                    setTeamsTab("chegada");
                            } else if (players.length < 2) {
                                    setCurrentScreen("players");
                                    setPlayersTab("jogadores");
                            } else {
                                    setTeamsTab("configuracao");
                                    if (!firstSetupDone) {
                                      setIsInitialSetupFlow(true);
                                    }
                                  }
                                }}
                                className="px-6 py-3 bg-gradient-to-r from-[#59b823] via-[#75c628] to-[#25660e] text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg hover:opacity-90 transition-all active:scale-95 cursor-pointer"
                              >
                                {players.filter((p) =>
                                  sessionPlayerIds.includes(p.id),
                                ).length > 0
                                  ? "CONFIRMAR CHEGADA"
                                  : players.length < 2
                                    ? "CRIAR JOGADORES"
                                    : "CONFIGURAR PARTIDA"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {/* Tie resolution info */}
                            {teams.some(
                              (t) => t.lastMatchStatus === "Empate",
                            ) && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-5 bg-black border border-black/10 rounded-2xl flex items-start gap-4 shadow-xl mb-4 cursor-pointer hover:bg-black/90 transition-colors group"
                                onClick={() => {
                                  setTeams((prev) =>
                                    prev.map((team) =>
                                      team.lastMatchStatus === "Empate"
                                        ? {
                                            ...team,
                                            lastMatchStatus: undefined,
                                          }
                                        : team,
                                    ),
                                  );
                                }}
                              >
                                <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center shrink-0">
                                  <Info
                                    size={18}
                                    className="text-brand-primary"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-1">
                                    Empate Resolvido Manualmente
                                  </span>
                                  <p className="text-[10px] text-white/80 font-bold uppercase leading-relaxed tracking-wider">
                                    Desmarque o time que deve{" "}
                                    <span className="text-white">
                                      descer na fila
                                    </span>
                                    . O time que permanecer selecionado jogará a
                                    próxima partida.
                                  </p>
                                </div>
                              </motion.div>
                            )}

                            {teams.map((t, tIdx) => {
                              const isCurrent =
                                tIdx === match.teamAIndex ||
                                tIdx === match.teamBIndex;
                              const isFlashing = flashingTeamIds.includes(t.id);

                              let teamColor = t.color || TEAM_COLORS[0];
                              if (fixedColors.enabled) {
                                if (
                                  match.teamAIndex === tIdx &&
                                  fixedColors.teamA
                                )
                                  teamColor = fixedColors.teamA;
                                else if (
                                  match.teamBIndex === tIdx &&
                                  fixedColors.teamB
                                )
                                  teamColor = fixedColors.teamB;
                              }

                              return (
                                <motion.div
                                  layout="position"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{
                                    layout: { type: "tween", ease: "circOut", duration: 0.4 },
                                    opacity: { duration: 0.3 },
                                    y: { type: "spring", stiffness: 200, damping: 25 }
                                  }}
                                  key={`team-card-${t.id}`}
                                  id={`team-card-${tIdx}`}
                                  onClick={(e) => {
                                    if (swappingPlayerId) return;
                                    if (
                                      movingPlayers &&
                                      isSelectingDestination
                                    ) {
                                      e.stopPropagation();
                                      const availableSlots =
                                        match.config.playersPerTeam -
                                        t.playerIds.length;
                                      if (availableSlots <= 0) {
                                        setToast({
                                          message:
                                            "Este time já está completo.",
                                          type: "warning",
                                        });
                                        return;
                                      }
                                      const playersToMove =
                                        movingPlayers.playerIds.slice(
                                          0,
                                          availableSlots,
                                        );
                                      setTeams((prev) => {
                                        const newTeams = [...prev].map(
                                          (team) => ({
                                            ...team,
                                            playerIds: [...team.playerIds],
                                          }),
                                        );
                                        const sourceTeam = newTeams.find(
                                          (team) =>
                                            team.id === movingPlayers.teamId,
                                        );
                                        if (sourceTeam) {
                                          sourceTeam.playerIds =
                                            sourceTeam.playerIds.filter(
                                              (id) =>
                                                !playersToMove.includes(id),
                                            );
                                        }
                                        const targetTeam = newTeams.find(
                                          (team) => team.id === t.id,
                                        );
                                        if (targetTeam) {
                                          targetTeam.playerIds.push(
                                            ...playersToMove,
                                          );
                                        }
                                        return newTeams.filter(
                                          (team) => team.playerIds.length > 0,
                                        );
                                      });
                                      if (
                                        playersToMove.length <
                                        movingPlayers.playerIds.length
                                      ) {
                                        setMovingPlayers((prev) =>
                                          prev
                                            ? {
                                                ...prev,
                                                playerIds:
                                                  prev.playerIds.slice(
                                                    availableSlots,
                                                  ),
                                              }
                                            : null,
                                        );
                                        setToast({
                                          message: `Apenas ${availableSlots} jogador(es) movido(s). Selecione outro time para o(s) restante(s).`,
                                          type: "info",
                                        });
                                } else {
                                        setMovingPlayers(null);
                                        setIsSelectingDestination(false);
                                        setToast({
                                          message:
                                            "Jogador(es) movido(s) com sucesso!",
                                          type: "success",
                                        });
                                      }
                                      return;
                                    }
                                  }}
                                  className={`p-4 rounded-2xl border transition-all relative min-h-[110px] flex flex-col justify-center overflow-hidden ${
                                    movingPlayers && isSelectingDestination
                                      ? "cursor-pointer hover:opacity-90"
                                      : "cursor-default"
                                  } ${
                                    isCurrent
                                      ? "shadow-2xl z-10 border-[#53B986] bg-white/5 backdrop-blur-md ring-4 ring-[#53B986]/10"
                                      : "shadow-sm opacity-60 border-white/10 bg-white/5 backdrop-blur-md"
                                  } ${
                                    isFlashing || (movingPlayers && isSelectingDestination && t.playerIds.length < match.config.playersPerTeam)
                                      ? "animate-pulse bg-brand-primary/10 !border-[#53B986]"
                                      : ""
                                  }`}
                                  style={{
                                  }}
                                >
                                  {/* Team Color Top Bar */}
                                  <div
                                    className="absolute top-0 left-0 right-0 h-1 z-10"
                                    style={{ backgroundColor: teamColor }}
                                  />

                                  {/* Status Top Right (Winner/Loser/Draw) */}
                                  {t.lastMatchStatus && (
                                    <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                                      {t.lastMatchStatus === "Vencedor" ? (
                                        <div className="px-2 py-0.5 rounded-full bg-[#39FF14] text-black text-[8px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1">
                                          <Trophy
                                            size={8}
                                            fill="currentColor"
                                          />
                                          Venceu
                                        </div>
                                      ) : t.lastMatchStatus === "Empate" ? (
                                        <div className="px-2 py-0.5 rounded-full bg-zinc-500 text-black text-[8px] font-black uppercase tracking-widest shadow-sm">
                                          Empate
                                        </div>
                                      ) : t.lastMatchStatus === "Derrota" ? (
                                        <div className="px-2 py-0.5 rounded-full bg-red-500 text-black text-[8px] font-black uppercase tracking-widest shadow-sm">
                                          Perdeu
                                        </div>
                                      ) : (
                                        <div className="px-2 py-0.5 rounded-full bg-sky-500 text-black text-[8px] font-black uppercase tracking-widest shadow-sm animate-bounce">
                                          Subiu
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Jersey Icon Top Left */}
                                  <div
                                    className={`absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer z-50 ${isCurrent ? "" : "hover:scale-110"}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (
                                        match.isActive &&
                                        !match.hasEnded &&
                                        !match.isPaused
                                      ) {
                                        setToast({
                                          message:
                                            "Não é possível trocar times durante uma partida ativa.",
                                          type: "warning",
                                        });
                                        return;
                                      }

                                      if (isCurrent) {
                                        if (t.lastMatchStatus === "Empate") {
                                          setTeams((prevTeams) => {
                                            const newTeams = prevTeams.map(
                                              (team) => ({
                                                ...team,
                                                lastMatchStatus:
                                                  team.lastMatchStatus ===
                                                  "Empate"
                                                    ? undefined
                                                    : team.lastMatchStatus,
                                              }),
                                            );
                                            const deselectedTeam =
                                              newTeams.splice(tIdx, 1)[0];
                                            newTeams.push(deselectedTeam);

                                            setMatch((prevMatch) => {
                                              let newTeamAIndex =
                                                prevMatch.teamAIndex;
                                              let newTeamBIndex =
                                                prevMatch.teamBIndex;

                                              if (
                                                prevMatch.teamAIndex === tIdx
                                              ) {
                                                newTeamAIndex = -1;
                                        } else if (
                                                prevMatch.teamAIndex > tIdx
                                              ) {
                                                newTeamAIndex--;
                                              }

                                              if (
                                                prevMatch.teamBIndex === tIdx
                                              ) {
                                                newTeamBIndex = -1;
                                        } else if (
                                                prevMatch.teamBIndex > tIdx
                                              ) {
                                                newTeamBIndex--;
                                              }

                                              return {
                                                ...prevMatch,
                                                teamAIndex: newTeamAIndex,
                                                teamBIndex: newTeamBIndex,
                                              };
                                            });
                                            return newTeams;
                                          });
                                  } else {
                                          // Deselect normally
                                          if (match.teamAIndex === tIdx)
                                            setMatch((prev) => ({
                                              ...prev,
                                              teamAIndex: -1,
                                            }));
                                          else if (match.teamBIndex === tIdx)
                                            setMatch((prev) => ({
                                              ...prev,
                                              teamBIndex: -1,
                                            }));
                                        }
                                      } else {
                                        // Select
                                        if (match.teamAIndex === -1) {
                                          setMatch((prev) => ({
                                            ...prev,
                                            teamAIndex: tIdx,
                                          }));
                                        } else if (match.teamBIndex === -1) {
                                          const teamA = teams[match.teamAIndex];
                                          const teamB = teams[tIdx];
                                          if (
                                            teamA &&
                                            teamB &&
                                            teamA.playerIds.some((id) =>
                                              teamB.playerIds.includes(id),
                                            )
                                          ) {
                                            setToast({
                                              message:
                                                "Estes times possuem jogadores em comum.",
                                              type: "warning",
                                            });
                                            return;
                                          }
                                          setMatch((prev) => ({
                                            ...prev,
                                            teamBIndex: tIdx,
                                          }));
                                  } else {
                                          // Both selected, prioritize keeping the winner and removing the loser
                                          const isTeamALoser =
                                            lastMatchResult &&
                                            teams[match.teamAIndex]?.id ===
                                              lastMatchResult.loserId;
                                          const isTeamBLoser =
                                            lastMatchResult &&
                                            teams[match.teamBIndex]?.id ===
                                              lastMatchResult.loserId;

                                          let teamToReplaceIndex =
                                            match.teamAIndex;
                                          if (isTeamBLoser) {
                                            teamToReplaceIndex =
                                              match.teamBIndex;
                                    } else if (isTeamALoser) {
                                            teamToReplaceIndex =
                                              match.teamAIndex;
                                          }

                                          setTeams((prevTeams) => {
                                            const newTeams = [...prevTeams];
                                            const replacedTeam =
                                              newTeams[teamToReplaceIndex];
                                            const selectedTeam = newTeams[tIdx];

                                            const filteredTeams =
                                              newTeams.filter(
                                                (_, i) =>
                                                  i !== teamToReplaceIndex &&
                                                  i !== tIdx,
                                              );
                                            filteredTeams.splice(
                                              teamToReplaceIndex,
                                              0,
                                              selectedTeam,
                                            );
                                            filteredTeams.push(replacedTeam);

                                            const otherTeamIndex =
                                              teamToReplaceIndex ===
                                              match.teamAIndex
                                                ? match.teamBIndex
                                                : match.teamAIndex;
                                            const otherTeam =
                                              prevTeams[otherTeamIndex];

                                            const newSelectedTeamIndex =
                                              filteredTeams.findIndex(
                                                (team) =>
                                                  team.id === selectedTeam.id,
                                              );
                                            const newOtherTeamIndex =
                                              filteredTeams.findIndex(
                                                (team) =>
                                                  team.id === otherTeam.id,
                                              );

                                            setMatch((prev) => ({
                                              ...prev,
                                              teamAIndex:
                                                teamToReplaceIndex ===
                                                match.teamAIndex
                                                  ? newSelectedTeamIndex
                                                  : newOtherTeamIndex,
                                              teamBIndex:
                                                teamToReplaceIndex ===
                                                match.teamBIndex
                                                  ? newSelectedTeamIndex
                                                  : newOtherTeamIndex,
                                              scoreA: 0,
                                              scoreB: 0,
                                              timeRemaining:
                                                prev.config.duration * 60,
                                              isActive: false,
                                              isPaused: true,
                                              hasEnded: false,
                                              events: [],
                                            }));

                                            return filteredTeams;
                                          });
                                        }
                                      }
                                      // Reset match state when changing teams (handled inside setTeams for the replacement case)
                                      if (
                                        match.teamAIndex === -1 ||
                                        match.teamBIndex === -1 ||
                                        isCurrent
                                      ) {
                                        setMatch((prev) => ({
                                          ...prev,
                                          scoreA: 0,
                                          scoreB: 0,
                                          timeRemaining:
                                            prev.config.duration * 60,
                                          isActive: false,
                                          isPaused: true,
                                          hasEnded: false,
                                          events: [],
                                        }));
                                      }
                                    }}
                                  >
                                    {(() => {
                                      const Icon =
                                        TEAM_ICONS[
                                          t.iconIdx ?? tIdx % TEAM_ICONS.length
                                        ];
                                      return (
                                        <div
                                          className="relative w-8 h-8 flex items-center justify-center transition-transform hover:scale-110 drop-shadow-lg"
                                          style={{ color: teamColor }}
                                        >
                                          <Icon size={24} />
                                        </div>
                                      );
                                    })()}
                                  </div>

                                  {/* Status Top Right removed */}
                                  <div className="absolute top-2 right-2"></div>

                                  {isCurrent &&
                                    t.playerIds.length <
                                      match.config.playersPerTeam && (
                                      <div className="flex flex-col items-center justify-center pt-6 pb-2 relative z-10 w-full px-4">
                                        <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center mb-1">
                                          <Info
                                            className="text-white/80"
                                            size={12}
                                          />
                                        </div>
                                        <h3 className="text-sm font-black text-white uppercase tracking-tighter">
                                          Time Incompleto!
                                        </h3>
                                        <p className="text-[8px] font-bold uppercase tracking-widest text-white/70 leading-tight text-center mt-1">
                                          Times devem estar equilibrados.
                                          <br />
                                          <span className="text-amber-400 font-black">
                                            Toque em um jogador de outro time
                                          </span>{" "}
                                          para completar esta vaga.
                                        </p>
                                      </div>
                                    )}

                                  {!isCurrent &&
                                    t.playerIds.length <
                                      match.config.playersPerTeam && (
                                      <div className="absolute top-4 left-0 right-0 flex justify-center z-10 pointer-events-none">
                                        <div className="flex items-center gap-1.5 pointer-events-auto">
                                          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                            Falta{" "}
                                            {match.config.playersPerTeam -
                                              t.playerIds.length}{" "}
                                            jogador
                                            {match.config.playersPerTeam -
                                              t.playerIds.length >
                                            1
                                              ? "es"
                                              : ""}
                                          </span>
                                          <button
                                            type="button"
                                            className="text-white/40 hover:text-amber-400 cursor-pointer transition-all active:scale-90 hover:bg-white/5 p-1 rounded-full flex items-center justify-center pointer-events-auto"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              const required =
                                                match.config.playersPerTeam -
                                                t.playerIds.length;
                                              let count = 0;
                                              setTeams((prev) => {
                                                const newTeams = prev.map(
                                                  (team) => ({
                                                    ...team,
                                                    playerIds: [
                                                      ...team.playerIds,
                                                    ],
                                                  }),
                                                );
                                                const currentTeam =
                                                  newTeams[tIdx];
                                                if (!currentTeam) return prev;

                                                for (
                                                  let i = tIdx + 1;
                                                  i < newTeams.length;
                                                  i++
                                                ) {
                                                  const sourceTeam =
                                                    newTeams[i];
                                                  while (
                                                    sourceTeam.playerIds
                                                      .length > 0 &&
                                                    count < required
                                                  ) {
                                                    const pId =
                                                      sourceTeam.playerIds.shift()!;
                                                    currentTeam.playerIds.push(
                                                      pId,
                                                    );
                                                    count++;
                                                  }
                                                  if (count >= required) break;
                                                }
                                                return newTeams;
                                              });
                                            }}
                                          >
                                            <div className="text-[#22c55e]">
                                              <BsArrowUpRightCircle size={16} />
                                            </div>
                                          </button>
                                        </div>
                                      </div>
                                    )}

                                  <div
                                    className={
                                      isCurrent &&
                                      t.playerIds.length <
                                        match.config.playersPerTeam
                                        ? "pt-0 relative z-20"
                                        : "pt-14 relative z-20"
                                    }
                                  >
                                    <motion.div
                                      layout
                                      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
                                    >
                                      <AnimatePresence>
                                        {[...t.playerIds]
                                          .sort((a, b) => {
                                            const playerA = players.find(
                                              (p) => p.id === a,
                                            );
                                            const playerB = players.find(
                                              (p) => p.id === b,
                                            );
                                            if (
                                              playerA?.isGoalkeeper &&
                                              !playerB?.isGoalkeeper
                                            )
                                              return -1;
                                            if (
                                              !playerA?.isGoalkeeper &&
                                              playerB?.isGoalkeeper
                                            )
                                              return 1;
                                            return (
                                              (playerA?.arrivedAt || 0) -
                                              (playerB?.arrivedAt || 0)
                                            );
                                          })
                                          .map((pid, idx) => {
                                            const p = players.find(
                                              (pl) => pl.id === pid,
                                            );
                                            if (!p) return null;
                                            return (
                                              <motion.button
                                                layout
                                                layoutId={`player-card-${pid}`}
                                                initial={{
                                                  opacity: 0,
                                                  scale: 0.8,
                                                }}
                                                animate={{
                                                  opacity: 1,
                                                  scale: 1,
                                                }}
                                                exit={{
                                                  opacity: 0,
                                                  scale: 0.8,
                                                }}
                                                transition={{
                                                  layout: { type: "tween", ease: "circOut", duration: 0.4 },
                                                  opacity: { duration: 0.3 },
                                                  scale: { duration: 0.3 }
                                                }}
                                                key={`queue-player-${pid}`}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  if (
                                                    movingPlayers &&
                                                    movingPlayers.teamId ===
                                                      t.id
                                                  ) {
                                                    setMovingPlayers((prev) => {
                                                      if (!prev) return null;
                                                      const pIds =
                                                        prev.playerIds.includes(
                                                          pid,
                                                        )
                                                          ? prev.playerIds.filter(
                                                              (id) =>
                                                                id !== pid,
                                                            )
                                                          : [
                                                              ...prev.playerIds,
                                                              pid,
                                                            ];
                                                      if (pIds.length === 0) {
                                                        setIsSelectingDestination(
                                                          false,
                                                        );
                                                        return null;
                                                      }
                                                      return {
                                                        ...prev,
                                                        playerIds: pIds,
                                                      };
                                                    });
                                                    return;
                                                  }
                                                  if (swappingPlayerId) {
                                                    if (
                                                      swappingPlayerId === pid
                                                    ) {
                                                      setSwappingPlayerId(null);
                                                      setToast({
                                                        message:
                                                          "Troca cancelada.",
                                                        type: "info",
                                                      });
                                                      return;
                                                    }
                                                    const targetTeamIdx = teams.findIndex(
                                                      (tm) => tm.playerIds.includes(swappingPlayerId)
                                                    );
                                                    if (targetTeamIdx !== -1) {
                                                      scrollToTeam(targetTeamIdx);
                                                    }

                                                    // Swap logic
                                                    handleGoalkeeperSwap(
                                                      swappingPlayerId,
                                                      pid,
                                                    );
                                                    setTeams((prev) => {
                                                      const newTeams = [
                                                        ...prev,
                                                      ].map((team) => ({
                                                        ...team,
                                                        playerIds: [
                                                          ...team.playerIds,
                                                        ],
                                                      }));
                                                      let swapTeamIdx = -1;
                                                      let currentTeamIdx = -1;

                                                      // Find teams of both players
                                                      for (
                                                        let i = 0;
                                                        i < newTeams.length;
                                                        i++
                                                      ) {
                                                        if (
                                                          newTeams[
                                                            i
                                                          ].playerIds.includes(
                                                            swappingPlayerId,
                                                          )
                                                        )
                                                          swapTeamIdx = i;
                                                        if (
                                                          newTeams[
                                                            i
                                                          ].playerIds.includes(
                                                            pid,
                                                          )
                                                        )
                                                          currentTeamIdx = i;
                                                      }

                                                      if (
                                                        swapTeamIdx !== -1 &&
                                                        currentTeamIdx !== -1
                                                      ) {
                                                        const pAId =
                                                          swappingPlayerId;
                                                        const pBId = pid;

                                                        if (
                                                          swapTeamIdx ===
                                                          currentTeamIdx
                                                        ) {
                                                          newTeams[
                                                            swapTeamIdx
                                                          ].playerIds =
                                                            newTeams[
                                                              swapTeamIdx
                                                            ].playerIds.map(
                                                              (id) => {
                                                                if (id === pAId)
                                                                  return pBId;
                                                                if (id === pBId)
                                                                  return pAId;
                                                                return id;
                                                              },
                                                            );
                                                  } else {
                                                          newTeams[
                                                            swapTeamIdx
                                                          ].playerIds =
                                                            newTeams[
                                                              swapTeamIdx
                                                            ].playerIds.map(
                                                              (id) =>
                                                                id === pAId
                                                                  ? pBId
                                                                  : id,
                                                            );
                                                          newTeams[
                                                            currentTeamIdx
                                                          ].playerIds =
                                                            newTeams[
                                                              currentTeamIdx
                                                            ].playerIds.map(
                                                              (id) =>
                                                                id === pBId
                                                                  ? pAId
                                                                  : id,
                                                            );
                                                        }
                                                      }
                                                      return newTeams;
                                                    });
                                                    setSwappingPlayerId(null);
                                                    setToast({
                                                      message:
                                                        "Jogadores trocados com sucesso!",
                                                      type: "success",
                                                    });
                                            } else if (
                                                    fillingVacancyForTeam !==
                                                    null
                                                  ) {
                                                    // Move logic
                                                    setTeams((prev) => {
                                                      const newTeams = [
                                                        ...prev,
                                                      ].map((team) => ({
                                                        ...team,
                                                        playerIds: [
                                                          ...team.playerIds,
                                                        ],
                                                      }));
                                                      newTeams[tIdx].playerIds =
                                                        newTeams[
                                                          tIdx
                                                        ].playerIds.filter(
                                                          (id) => id !== pid,
                                                        );
                                                      newTeams[
                                                        fillingVacancyForTeam
                                                      ].playerIds.push(pid);
                                                      return newTeams;
                                                    });
                                                    const isMatchActive =
                                                      match.isActive &&
                                                      (fillingVacancyForTeam ===
                                                        match.teamAIndex ||
                                                        fillingVacancyForTeam ===
                                                          match.teamBIndex);
                                                    setFillingVacancyForTeam(
                                                      null,
                                                    );

                                                    if (isMatchActive) {
                                                      setTeamsTab("historico");
                                                      setToast({
                                                        message:
                                                          "✅ Jogador substituído! A partida pode continuar.",
                                                        type: "success",
                                                      });
                                              } else {
                                                      setToast({
                                                        message:
                                                          "Jogador movido com sucesso!",
                                                        type: "success",
                                                      });
                                                    }
                                                  } else {
                                                    // Check if there's an incomplete selected team
                                                    const incompleteSelectedTeamIdx =
                                                      [
                                                        match.teamAIndex,
                                                        match.teamBIndex,
                                                      ].find(
                                                        (teamIdx) =>
                                                          teamIdx !== -1 &&
                                                          teamIdx !== tIdx && // Not the current team
                                                          (teams[teamIdx]
                                                            ?.playerIds
                                                            ?.length || 0) <
                                                            match.config
                                                              .playersPerTeam,
                                                      );

                                                    if (
                                                      incompleteSelectedTeamIdx !==
                                                      undefined
                                                    ) {
                                                      // Move player to the incomplete selected team
                                                      setTeams((prev) => {
                                                        const newTeams = [
                                                          ...prev,
                                                        ].map((team) => ({
                                                          ...team,
                                                          playerIds: [
                                                            ...team.playerIds,
                                                          ],
                                                        }));
                                                        newTeams[
                                                          tIdx
                                                        ].playerIds = newTeams[
                                                          tIdx
                                                        ].playerIds.filter(
                                                          (id) => id !== pid,
                                                        );
                                                        newTeams[
                                                          incompleteSelectedTeamIdx
                                                        ].playerIds.push(pid);
                                                        return newTeams.filter(
                                                          (team) =>
                                                            team.playerIds
                                                              .length > 0,
                                                        );
                                                      });
                                                      setToast({
                                                        message: `Jogador movido para o ${teams[incompleteSelectedTeamIdx].name}`,
                                                        type: "success",
                                                      });
                                              } else {
                                                      setShowQueuePlayerModal({
                                                        teamIndex: tIdx,
                                                        playerId: pid,
                                                      });
                                                    }
                                                  }
                                                }}
                                                className={`w-full flex items-center justify-start gap-2 p-2 sm:p-1.5 rounded-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                                                  swappingPlayerId === pid ||
                                                  movingPlayers?.playerIds.includes(
                                                    pid,
                                                  )
                                                    ? "bg-[#53B986]/20 text-white border-2 border-[#53B986] shadow-lg scale-105"
                                                    : (swappingPlayerId &&
                                                          swappingPlayerId !==
                                                            pid) ||
                                                        fillingVacancyForTeam !==
                                                          null ||
                                                        [
                                                          match.teamAIndex,
                                                          match.teamBIndex,
                                                        ].some(
                                                          (targetTIdx) =>
                                                            targetTIdx !== -1 &&
                                                            targetTIdx !==
                                                              tIdx &&
                                                            (teams[targetTIdx]
                                                              ?.playerIds
                                                              ?.length || 0) <
                                                              match.config
                                                                .playersPerTeam,
                                                        )
                                                      ? "bg-[#53B986]/10 text-[#53B986] animate-pulse shadow-sm shadow-[#53B986]/10"
                                                      : `border group shadow-sm ${isCurrent ? "bg-gradient-to-r from-[#59b823] via-[#75c628] to-[#25660e] text-white border-transparent" : "text-white bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"}`
                                                }`}
                                                style={{
                                                  backgroundColor: !(
                                                    (swappingPlayerId &&
                                                      swappingPlayerId !==
                                                        pid) ||
                                                    fillingVacancyForTeam !==
                                                      null ||
                                                    movingPlayers?.playerIds.includes(
                                                      pid,
                                                    ) ||
                                                    [
                                                      match.teamAIndex,
                                                      match.teamBIndex,
                                                    ].some(
                                                      (targetTIdx) =>
                                                        targetTIdx !== -1 &&
                                                        targetTIdx !== tIdx &&
                                                        (teams[targetTIdx]
                                                          ?.playerIds?.length ||
                                                          0) <
                                                          match.config
                                                            .playersPerTeam,
                                                    ) ||
                                                    swappingPlayerId === pid
                                                  )
                                                    ? undefined
                                                    : undefined,
                                                }}
                                              >
                                                <div className={`w-6 h-6 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0 overflow-hidden ${isCurrent ? "bg-black/20" : "bg-white/10"}`}>
                                                  {p.isGoalkeeper &&
                                                  orgProSettings.allowFixedGoalkeeper !==
                                                    false ? (
                                                    <div
                                                      className={`flex items-center justify-center shrink-0 rounded-full w-4 h-4 text-[9px] font-black leading-none ${isCurrent ? "text-white" : "text-white/40"}`}
                                                    >
                                                      G
                                                    </div>
                                                  ) : p.photo ? (
                                                    <img
                                                      src={p.photo}
                                                      className="w-full h-full object-cover"
                                                      referrerPolicy="no-referrer"
                                                    />
                                                  ) : (
                                                    <span
                                                      className={`flex items-center shrink-0 ${isCurrent ? "text-white/60" : "text-white/40"}`}
                                                    >
                                                      <IoPersonOutline
                                                        size={12}
                                                      />
                                                    </span>
                                                  )}
                                                </div>
                                                <div className="flex flex-col items-start gap-1 overflow-hidden">
                                                  <span
                                                    className={`text-xs font-bold tracking-tight capitalize truncate leading-none ${isCurrent ? "text-white" : "text-white/90"}`}
                                                  >
                                                    {p.name.toLowerCase()}
                                                  </span>
                                                  <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map(
                                                      (star) => (
                                                        <Star
                                                          key={`star-q-${p.id}-${star}`}
                                                          size={8}
                                                          className={`${(p.stars || 3) >= star ? "fill-yellow-400 text-yellow-400" : "text-white/20"}`}
                                                        />
                                                      ),
                                                    )}
                                                  </div>
                                                </div>
                                                <div className="ml-auto flex items-center gap-1">
                                                  {playerEvents[p.id] && (
                                                    <div className="flex items-center justify-center shrink-0 w-5 h-5 bg-white/50 rounded-full shadow-sm">
                                                      {playerEvents[p.id]
                                                        .type === "swap" && (
                                                        <span className="text-blue-500 animate-pulse">
                                                          <IoMdSwap size={12} />
                                                        </span>
                                                      )}
                                                      {playerEvents[p.id]
                                                        .type === "up" && (
                                                        <span className="text-green-800 animate-bounce">
                                                          <IoMdArrowUp
                                                            size={12}
                                                          />
                                                        </span>
                                                      )}
                                                      {playerEvents[p.id]
                                                        .type === "down" && (
                                                        <span className="text-red-500 animate-bounce">
                                                          <IoMdArrowDown
                                                            size={12}
                                                          />
                                                        </span>
                                                      )}
                                                    </div>
                                                  )}
                                                </div>
                                              </motion.button>
                                            );
                                          })}
                                      </AnimatePresence>
                                    </motion.div>
                                  </div>
                                </motion.div>
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
                          className={`group p-3 sm:p-4 rounded-none transition-all relative cursor-pointer flex flex-col border ${
                            match.teamAIndex === tIndex ||
                            match.teamBIndex === tIndex
                              ? "bg-emerald-900 border-[#53B986] shadow-[0_0_30px_rgba(83,185,134,0.2)]"
                              : "bg-gradient-to-br from-zinc-50 to-zinc-100 border-zinc-200 hover:border-zinc-400"
                          } ${flashingTeamIds.includes(team.id) ? "animate-flash" : ""}`}
                          onClick={() => {
                            if (swappingPlayerId) return;
                            setFlashingTeamIds([]);
                            setMatch((prev) => {
                              if (prev.teamAIndex === tIndex)
                                return { ...prev, teamAIndex: -1 };
                              if (prev.teamBIndex === tIndex)
                                return { ...prev, teamBIndex: -1 };
                              if (prev.teamAIndex === -1)
                                return { ...prev, teamAIndex: tIndex };
                              if (prev.teamBIndex === -1)
                                return { ...prev, teamBIndex: tIndex };
                              return { ...prev, teamBIndex: tIndex };
                            });
                          }}
                        >
                          {/* Selection Indicator */}
                          <div className="absolute top-6 right-6">
                            <div
                              className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-500 ${
                                match.teamAIndex === tIndex
                                  ? "bg-[#53B986] border-[#53B986]"
                                  : match.teamBIndex === tIndex
                                    ? "bg-[#53B986] border-[#53B986]"
                                    : "bg-transparent border-white/20"
                              }`}
                            >
                              {(match.teamAIndex === tIndex ||
                                match.teamBIndex === tIndex) && (
                                <div className="w-2 h-2 rounded-full bg-black" />
                              )}
                            </div>
                          </div>

                          <div className="mb-6">
                            <div
                              className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${
                                match.teamAIndex === tIndex ||
                                match.teamBIndex === tIndex
                                  ? "text-black/60"
                                  : "text-brand-primary"
                              }`}
                            >
                              Club {tIndex + 1}
                            </div>
                            <input
                              value={team.name}
                              placeholder="NOME DO CLUB"
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                if (
                                  match.isActive &&
                                  !match.isPaused &&
                                  (tIndex === match.teamAIndex ||
                                    tIndex === match.teamBIndex)
                                ) {
                                  setToast({
                                    message:
                                      "Não é possível renomear times com o cronômetro rodando.",
                                    type: "gray",
                                  });
                                  setTimeout(() => setToast(null), 3000);
                                  return;
                                }
                                const newTeams = [...teams];
                                newTeams[tIndex].name = e.target.value;
                                setTeams(newTeams);
                              }}
                              className={`bg-transparent font-black text-xl uppercase tracking-tight outline-none w-full placeholder:opacity-40 ${
                                match.teamAIndex === tIndex ||
                                match.teamBIndex === tIndex
                                  ? "text-black"
                                  : "text-zinc-900"
                              }`}
                            />
                          </div>

                          <div className="flex-1 space-y-2 pr-1 custom-scrollbar">
                            {[...team.playerIds]
                              .sort((a, b) => {
                                const pA = players.find((p) => p.id === a);
                                const pB = players.find((p) => p.id === b);
                                if (pA?.isGoalkeeper && !pB?.isGoalkeeper)
                                  return -1;
                                if (!pA?.isGoalkeeper && pB?.isGoalkeeper)
                                  return 1;
                                return (
                                  (pA?.arrivedAt || 0) - (pB?.arrivedAt || 0)
                                );
                              })
                              .map((pid, idx) => {
                                const p = players.find((pl) => pl.id === pid);
                                return p ? (
                                  <div
                                    key={`scoreboard-player-${team.id}-${pid}-${idx}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (
                                        swappingPlayerId &&
                                        swappingPlayerId !== pid
                                      ) {
                                        const targetTeamIdx = teams.findIndex(
                                          (t) =>
                                            t.playerIds.includes(swappingPlayerId)
                                        );
                                        if (targetTeamIdx !== -1) {
                                          scrollToTeam(targetTeamIdx);
                                        }

                                        // Complete swap logic
                                        handleGoalkeeperSwap(
                                          swappingPlayerId,
                                          pid,
                                        );
                                        setTeams((prev) => {
                                          const newTeams = [...prev].map(
                                            (team) => ({
                                              ...team,
                                              playerIds: [...team.playerIds],
                                            }),
                                          );
                                          let teamAIdx = -1;
                                          let teamBIdx = -1;

                                          for (
                                            let i = 0;
                                            i < newTeams.length;
                                            i++
                                          ) {
                                            if (
                                              newTeams[i].playerIds.includes(
                                                swappingPlayerId,
                                              )
                                            )
                                              teamAIdx = i;
                                            if (
                                              newTeams[i].playerIds.includes(
                                                pid,
                                              )
                                            )
                                              teamBIdx = i;
                                          }

                                          if (
                                            teamAIdx !== -1 &&
                                            teamBIdx !== -1
                                          ) {
                                            const pAId = swappingPlayerId;
                                            const pBId = pid;
                                            if (teamAIdx === teamBIdx) {
                                              newTeams[teamAIdx].playerIds =
                                                newTeams[
                                                  teamAIdx
                                                ].playerIds.map((id) => {
                                                  if (id === pAId) return pBId;
                                                  if (id === pBId) return pAId;
                                                  return id;
                                                });
                                      } else {
                                              newTeams[teamAIdx].playerIds =
                                                newTeams[
                                                  teamAIdx
                                                ].playerIds.map((id) =>
                                                  id === pAId ? pBId : id,
                                                );
                                              newTeams[teamBIdx].playerIds =
                                                newTeams[
                                                  teamBIdx
                                                ].playerIds.map((id) =>
                                                  id === pBId ? pAId : id,
                                                );
                                            }
                                          }
                                          return newTeams;
                                        });
                                        setSwappingPlayerId(null);
                                        setToast({
                                          message:
                                            "Jogadores trocados com sucesso!",
                                          type: "success",
                                        });
                                } else if (swappingPlayerId === pid) {
                                        setSwappingPlayerId(null);
                                        setToast({
                                          message: "Seleção cancelada.",
                                          type: "info",
                                        });
                                } else {
                                        setShowPlayerActionsModal({
                                          teamIndex: tIndex,
                                          playerId: pid,
                                        });
                                      }
                                    }}
                                    className={`flex justify-between items-center py-2 px-1 transition-all group/player cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                                      swappingPlayerId === pid
                                        ? "bg-[#53B986]/20 rounded-lg animate-pulse"
                                        : swappingPlayerId &&
                                            swappingPlayerId !== pid
                                          ? "bg-[#53B986]/10 rounded-lg"
                                          : "bg-transparent border-transparent"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                      <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center overflow-hidden border shrink-0 ${match.teamAIndex === tIndex || match.teamBIndex === tIndex ? "border-black/10 bg-black/5" : "bg-gradient-to-br from-zinc-100 to-zinc-300 border-zinc-200"}`}
                                      >
                                        {p.photo ? (
                                          <img
                                            src={p.photo}
                                            alt={p.name}
                                            className="w-full h-full object-cover"
                                            referrerPolicy="no-referrer"
                                          />
                                        ) : (
                                          <span className="text-zinc-700 flex items-center shrink-0">
                                            <IoPersonOutline size={10} />
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex flex-col min-w-0">
                                        <span
                                          className={`text-[11px] sm:text-xs font-bold tracking-tight transition-colors truncate leading-none ${
                                            swappingPlayerId === pid
                                              ? "text-[#53B986]"
                                              : "text-zinc-800"
                                          }`}
                                        >
                                          {p.name}
                                        </span>
                                        <div className="flex gap-0.5 mt-0.5">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                              key={`star-pcard-${p.id}-${star}`}
                                              size={8}
                                              className={`${(p.stars || 3) >= star ? "fill-yellow-400 text-yellow-400" : "text-zinc-300"}`}
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      {swappingPlayerId === pid && (
                                        <div className="px-2 py-1 text-black bg-[#53B986]/20 border border-[#53B986]/50 rounded-sm text-[8px] font-black uppercase">
                                          Selecionado
                                        </div>
                                      )}
                                      {swappingPlayerId &&
                                        swappingPlayerId !== pid && (
                                          <div className="px-2 py-1 bg-[#53B986] text-black rounded-sm text-[8px] font-black uppercase">
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
                                <span className="text-[10px] font-bold mt-2">
                                  SEM JOGADORES
                                </span>
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
                                  if (
                                    match.isActive &&
                                    (tIndex === match.teamAIndex ||
                                      tIndex === match.teamBIndex)
                                  ) {
                                    setToast({
                                      message:
                                        "Não é possível adicionar jogadores a times em campo.",
                                      type: "gray",
                                    });
                                    setTimeout(() => setToast(null), 3000);
                                    return;
                                  }
                                  setShowQuickAddPlayerModal(tIndex);
                                }}
                                className={`flex-[2] py-3 rounded-md text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                                  match.teamAIndex === tIndex ||
                                  match.teamBIndex === tIndex
                                    ? "bg-transparent text-black hover:bg-black/20"
                                    : "bg-transparent text-brand-text-primary hover:bg-black/10"
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

            {currentScreen === "ranking" && (
              <motion.div
                key="ranking"
                initial={isPrintMode ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`p-2 sm:p-4 space-y-6 pb-24 ${isPrintMode ? "bg-white min-h-screen p-0" : ""}`}
              >
                {!isPrintMode ? (
                  <motion.div className={`w-full overflow-hidden`}>
                    <div className="flex items-center justify-between pb-2 border-b border-dashed border-white/10 mb-4 px-2">
                      <div className="flex items-center gap-1">
                        {/* Ranking print button removed */}
                      </div>
                      <div className="text-white/30 text-xs font-bold font-mono tracking-tighter uppercase"></div>
                      <div
                        className={`flex gap-4 sm:gap-8 text-[10px] font-black uppercase tracking-widest text-blue-200/60 ${rankingTab === "artilharia" ? "flex-row-reverse" : ""}`}
                      >
                        <div
                          className={`w-12 text-center flex items-center justify-center gap-1 ${rankingTab !== "assistencias" ? "text-emerald-400" : "opacity-0"}`}
                        >
                          <span className="text-emerald-400"><IoFootballOutline size={14} /></span> Gols
                        </div>
                        <div
                          className={`w-12 text-center flex items-center justify-center gap-1 ${rankingTab !== "artilharia" ? "text-blue-400" : "opacity-0"}`}
                        >
                          <span className="text-blue-400"><GiSoccerKick size={14} /></span> Ass
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      {sortedRankingPlayers.map((player, index) => (
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            layout: {
                              type: "spring",
                              stiffness: 300,
                              damping: 25,
                            },
                            opacity: { duration: 0.2 },
                          }}
                          key={`${player.id}-${index}`}
                          className="flex items-center py-3 px-3 transition-colors rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 shadow-sm"
                        >
                          <div className="w-8 text-sm font-black text-blue-400 text-center shrink-0">
                            {index + 1}
                          </div>

                          <div className="relative ml-2 mr-4 shrink-0">
                            <div
                              className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white/10 border border-white/10 relative z-10`}
                            >
                              {player.photo ? (
                                <img
                                  src={player.photo}
                                  alt={player.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-white/40 flex items-center shrink-0">
                                  <IoPersonOutline size={20} />
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex-1 text-xs text-white tracking-tight truncate mr-4 font-normal capitalize flex flex-col gap-1">
                            <span className="leading-none font-medium">
                              {player.name.toLowerCase()}
                            </span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={`star-rank-${player.id}-${star}`}
                                  size={8}
                                  className={`${(player.stars || 3) >= star ? "fill-yellow-400 text-yellow-400" : "text-white/10"}`}
                                />
                              ))}
                            </div>
                          </div>

                          <div
                            className={`flex gap-4 sm:gap-8 shrink-0 ${rankingTab === "artilharia" ? "flex-row-reverse" : ""}`}
                          >
                            <div
                              className={`w-12 text-center text-sm font-black text-emerald-400 ${rankingTab === "assistencias" ? "opacity-0" : ""}`}
                            >
                              {player.goals}
                            </div>
                            <div
                              className={`w-12 text-center text-sm font-black text-blue-400 ${rankingTab === "artilharia" ? "opacity-0" : ""}`}
                            >
                              {player.assists}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      {!isDataLoaded || players.length === 0 ? (
                        Array.from({ length: 5 }).map((_, idx) => (
                          <div
                            key={`skel-ranking-${idx}`}
                            className="flex items-center py-3 px-3 rounded-2xl bg-white/5 border border-white/10 animate-pulse w-full mt-2"
                          >
                            <div className="w-8 text-sm font-black text-white/20 text-center shrink-0">
                              -
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/10 shrink-0 border border-white/10 mr-4 shadow-sm ml-2">
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                              <div className="h-3 bg-white/10 rounded-2xl w-3/5 shadow-sm"></div>
                              <div className="h-2 bg-white/10 rounded-2xl w-1/4 shadow-sm"></div>
                            </div>
                          </div>
                        ))
                      ) : (
                        sortedRankingPlayers.length === 0 && (
                          <div className="text-center text-white/50 text-xs py-8">
                            Nenhum jogador encontrado.
                          </div>
                        )
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div
                    key="ranking-print"
                    className="p-8 bg-[#dce3ee] min-h-screen text-black space-y-8"
                  >
                    <div className="flex items-center justify-between border-b border-black/10 pb-3">
                      <div className="flex items-center gap-2">
                        <Trophy size={16} className="text-black" />
                        <FutQuinaLogo
                          size="sm"
                          titleColorClass="text-[#484848]"
                        />
                        <span className="text-sm font-black opacity-10">|</span>
                        <span className="text-sm font-black tracking-tighter">
                          Ranking
                        </span>
                      </div>
                      <button
                        onClick={() => setIsPrintMode(false)}
                        className="print:hidden px-3 py-1.5 bg-brand-primary text-black rounded-sm text-[9px] font-bold uppercase hover:opacity-80 transition-colors"
                      >
                        Sair do Print
                      </button>
                    </div>

                    <div className="space-y-4">
                      <h2 className="text-base font-bold uppercase tracking-widest border-l-4 border-black pl-3">
                        Top Jogadores
                      </h2>
                      <div className="border border-black rounded-lg overflow-hidden">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-brand-primary text-black">
                              <th className="p-2 text-[10px] font-black uppercase">
                                Pos
                              </th>
                              <th className="p-2 text-[10px] font-black uppercase">
                                Jogador
                              </th>
                              <th className="p-2 text-[10px] font-black text-center !normal-case">
                                Gols
                              </th>
                              <th className="p-2 text-[10px] font-black text-center !normal-case">
                                Assistências
                              </th>
                              <th className="p-2 text-[10px] font-black uppercase text-center">
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {sortedPlayersByTotal
                              .slice(0, 15)
                              .map((player, index) => (
                                <tr
                                  key={`ranking-row-print-${player.id}-${index}`}
                                  className="border-b border-black/10"
                                >
                                  <td className="p-2 text-xs font-black">
                                    {index + 1}
                                  </td>
                                  <td className="p-2 text-xs font-bold">
                                    {player.name}
                                  </td>
                                  <td className="p-2 text-xs text-center">
                                    {player.goals}
                                  </td>
                                  <td className="p-2 text-xs text-center">
                                    {player.assists}
                                  </td>
                                  <td className="p-2 text-xs text-center font-black">
                                    {player.goals + player.assists}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="text-[8px] text-center opacity-50 uppercase font-bold">
                      Gerado em {new Date().toLocaleDateString("pt-BR")} •
                      FutQuina App
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {currentScreen === "finance" && (
              <motion.div
                key="finance"
                initial={isPrintMode ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`space-y-4 ${isPrintMode ? "space-y-0 bg-white text-black min-h-screen" : ""}`}
              >
                {financeSubScreen === "balanco" &&
                  (() => {
                    const totalRevenue =
                      (payments || []).reduce(
                        (acc: number, p: PaymentRecord) =>
                          acc +
                          Object.values(p?.months || {}).reduce(
                            (mAcc: number, mVal) => mAcc + Number(mVal || 0),
                            0,
                          ),
                        0,
                      ) + manualAdjustment;
                    const totalExpenses = (expenses || []).reduce(
                      (acc: number, e) => acc + (e.amount || 0),
                      0,
                    );
                    const netBalance = totalRevenue - totalExpenses;

                    return (
                      <div
                        className={`space-y-4 ${isPrintMode ? "bg-white min-h-screen text-black p-4 pb-12 font-mono" : "font-mono"}`}
                      >
                        {!isPrintMode && (
                          <div className="h-2" />
                        )}

                        {isPrintMode && (
                          <div className="pt-10 pb-6 text-center border-b border-zinc-300 mb-6 bg-[#dce3ee] flex flex-col items-center relative">
                            <div className="mb-4">
                              <FutQuinaLogo
                                size="md"
                                titleColorClass="text-[#484848]"
                              />
                            </div>
                            <h2 className="text-2xl font-black uppercase mb-1 text-black">
                              {isPrintPaymentsOnly
                                ? "Planilha de Pagamentos"
                                : "Relatório Financeiro"}
                            </h2>
                            <p className="text-[10px] font-bold uppercase opacity-60 text-black">
                              Competência: {MONTHS[new Date().getMonth()]} /{" "}
                              {new Date().getFullYear()}
                            </p>
                            <button
                              onClick={() => {
                                setIsPrintMode(false);
                                setIsPrintPaymentsOnly(false);
                              }}
                              className="absolute top-4 right-4 p-2 text-zinc-400 hover:bg-zinc-800/10 rounded-full transition-colors"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        )}

                        <div
                          className={`px-2 sm:px-4 space-y-4 w-full sm:w-[98%] max-w-7xl mx-auto`}
                        >
                          {/* Summary Cards */}
                          {!isPrintPaymentsOnly && (
                            <>
                              {/* Quick Navigation / Action Row */}
                              <div className="flex items-center justify-center gap-6 py-3 bg-white/5 border border-white/10 rounded-2xl shadow-sm mb-2">
                                {/* Arrecadação Shortcut */}
                                <button
                                  onClick={() => {
                                    if (players.length === 0) {
                                      setToast({
                                        message: "Adicione jogadores para ajustar arrecadação",
                                        type: "info",
                                      });
                                      setTimeout(() => setToast(null), 3000);
                                      return;
                                    }
                                    setTotalInput(manualAdjustment.toString());
                                    setIsEditingTotal(true);
                                  }}
                                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                                >
                                  <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shadow-lg shadow-black/20 group-hover:border-[#34d399]/50 group-hover:bg-[#34d399]/10 transition-all active:scale-95">
                                    <FcMoneyTransfer size={24} />
                                  </div>
                                  <span className="text-[8px] font-black uppercase tracking-[0.15em] text-white/50 group-hover:text-[#34d399] transition-colors">
                                    Arrecadação
                                  </span>
                                </button>

                                {/* Despesas Detalhadas Shortcut */}
                                <button
                                  onClick={() => {
                                    if (players.length === 0) {
                                      setToast({
                                        message: "Adicione jogadores para detalhar despesas",
                                        type: "info",
                                      });
                                      setTimeout(() => setToast(null), 3000);
                                      return;
                                    }
                                    setShowExpenseModal(true);
                                  }}
                                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                                >
                                  <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shadow-lg shadow-black/20 group-hover:border-red-400/50 group-hover:bg-red-400/10 transition-all active:scale-95">
                                    <FcRules size={24} />
                                  </div>
                                  <span className="text-[8px] font-black uppercase tracking-[0.15em] text-white/50 group-hover:text-red-400 transition-colors">
                                    Despesas Det.
                                  </span>
                                </button>

                                {/* Mensalidade Shortcut */}
                                <button
                                  onClick={() => {
                                    setFinanceSubScreen("mensalidade");
                                  }}
                                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                                >
                                  <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shadow-lg shadow-black/20 group-hover:border-[#34d399]/50 group-hover:bg-[#34d399]/10 transition-all active:scale-95">
                                    <FcGrid size={24} />
                                  </div>
                                  <span className="text-[8px] font-black uppercase tracking-[0.15em] text-white/50 group-hover:text-[#34d399] transition-colors">
                                    Mensalidade
                                  </span>
                                </button>
                              </div>

                              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                              {/* Saldo Líquido Card */}
                              <div
                                className={`p-4 transition-all col-span-2 lg:col-span-1 order-1 lg:order-none ${
                                  isPrintMode
                                    ? "bg-white border-zinc-300 border rounded-none"
                                    : "bg-white/5 border border-white/10 rounded-2xl shadow-sm"
                                }`}
                              >
                                <div className="flex justify-between items-center mb-1">
                                  <p
                                    className={`text-[9px] font-black uppercase tracking-widest ${isPrintMode ? "text-zinc-600" : "text-white/50"}`}
                                  >
                                    Saldo em Caixa
                                  </p>
                                  {!isPrintMode && (
                                    <button
                                      onClick={() => {
                                        if (players.length === 0) {
                                          setToast({
                                            message:
                                              "Adicione jogadores para detalhar despesas",
                                            type: "info",
                                          });
                                          setTimeout(() => setToast(null), 3000);
                                          return;
                                        }
                                        setIsPrintMode(true);
                                      }}
                                      className="text-white/40 hover:text-[#34d399] transition-colors"
                                      title="Gerar Print"
                                    >
                                      <Eye size={14} />
                                    </button>
                                  )}
                                </div>
                                <p
                                  className={`text-lg sm:text-xl lg:text-2xl font-black ${
                                    isPrintMode
                                      ? "text-black"
                                      : netBalance >= 0
                                        ? "text-[#34d399]"
                                        : "text-red-400"
                                  }`}
                                >
                                  R$ <AnimatedCounter value={netBalance} />
                                  ,00
                                </p>
                              </div>

                              {/* Arrecadação Card */}
                              <div
                                onClick={() => {
                                  if (!isPrintMode && !isEditingTotal) {
                                    if (players.length === 0) {
                                      setToast({
                                        message: "Adicione jogadores para ajustar arrecadação",
                                        type: "info",
                                      });
                                      setTimeout(() => setToast(null), 3000);
                                      return;
                                    }
                                    setTotalInput(manualAdjustment.toString());
                                    setIsEditingTotal(true);
                                  }
                                }}
                                className={`p-4 transition-all order-2 lg:order-none ${
                                  isPrintMode
                                    ? "bg-white border-zinc-300 border rounded-none text-black"
                                    : "bg-[#34d399]/5 border border-[#34d399]/20 rounded-2xl cursor-pointer hover:bg-[#34d399]/10 overflow-hidden relative shadow-sm"
                                }`}
                              >
                                {!isPrintMode && (
                                  <div className="absolute inset-0 bg-gradient-to-br from-[#34d399]/5 to-transparent pointer-events-none" />
                                )}
                                <p
                                  className={`text-[9px] font-black uppercase tracking-widest mb-1 relative z-10 ${
                                    isPrintMode ? "text-zinc-600" : "text-[#34d399]/80"
                                  }`}
                                >
                                  Arrecadação
                                </p>
                                <div className="flex items-baseline gap-2 relative z-10">
                                  {isEditingTotal ? (
                                    <div
                                      className="flex items-center gap-1 w-full"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <span
                                        className={`text-xs font-bold ${isPrintMode ? "opacity-60" : "text-white/60"}`}
                                      >
                                        R$
                                      </span>
                                      <input
                                        autoFocus
                                        type="number"
                                        value={totalInput}
                                        onChange={(e) =>
                                          setTotalInput(e.target.value)
                                        }
                                        onBlur={() => {
                                          setManualAdjustment(
                                            Number(totalInput),
                                          );
                                          setIsEditingTotal(false);
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            setManualAdjustment(
                                              Number(totalInput),
                                            );
                                            setIsEditingTotal(false);
                                          }
                                        }}
                                        className={`w-full bg-transparent border-b border-[#34d399] outline-none text-base sm:text-lg font-black ${
                                          isPrintMode ? "text-zinc-900" : "text-white"
                                        }`}
                                      />
                                    </div>
                                  ) : (
                                    <div className="flex flex-col">
                                      <p
                                        className={`text-lg sm:text-xl font-black ${
                                          isPrintMode ? "text-black" : "text-white"
                                        }`}
                                      >
                                        R$ {totalRevenue},00
                                      </p>
                                      {!isPrintMode && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setTotalInput(
                                              manualAdjustment.toString(),
                                            );
                                            setIsEditingTotal(true);
                                          }}
                                          className="text-[8px] font-black uppercase tracking-widest text-white/40 flex items-center gap-1 hover:text-white w-fit mt-1.5 transition-colors"
                                        >
                                          Ajustar Manual (R$ {manualAdjustment})
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Despesas Card */}
                              <div
                                onClick={() => {
                                  if (players.length === 0) {
                                    setToast({
                                      message: "Adicione jogadores para detalhar despesas",
                                      type: "info"
                                    });
                                    setTimeout(() => setToast(null), 3000);
                                    return;
                                  }
                                  !isPrintMode && setShowExpenseModal(true);
                                }}
                                className={`p-4 transition-all order-3 lg:order-none ${
                                  isPrintMode
                                    ? "bg-white border-zinc-300 border rounded-none"
                                    : "bg-red-500/5 border border-red-500/20 rounded-2xl cursor-pointer hover:bg-red-500/10 shadow-sm relative overflow-hidden"
                                }`}
                              >
                                <p
                                  className={`text-[9px] font-black uppercase tracking-widest mb-1 ${
                                    isPrintMode ? "text-zinc-600" : "text-red-400"
                                  }`}
                                >
                                  Despesas
                                </p>
                                <p
                                  className={`text-lg sm:text-xl font-black mb-2 ${
                                    isPrintMode ? "text-black" : "text-white"
                                  }`}
                                >
                                  R$ {totalExpenses},00
                                </p>
                                <div className="space-y-1">
                                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-red-500 transition-all duration-1000"
                                      style={{
                                        width: `${Math.min(100, (totalExpenses / Math.max(1, totalRevenue)) * 100)}%`,
                                      }}
                                    />
                                  </div>
                                  <div className="flex justify-between text-[7px] font-bold uppercase tracking-wider opacity-60 text-white/50">
                                    <span>Gasto Total</span>
                                    <span>
                                      {totalRevenue > 0
                                        ? Math.round(
                                            (totalExpenses / totalRevenue) *
                                              100,
                                          )
                                        : 0}
                                      %
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>)}

                          {/* Expenses List */}
                          {!isPrintPaymentsOnly && (
                            <div
                              className={`transition-all overflow-hidden ${
                                isPrintMode
                                  ? "bg-white border border-zinc-300 rounded-none"
                                  : "rounded-2xl border border-white/10 bg-white/5"
                              }`}
                            >
                              <div
                                className={`flex justify-between items-center ${
                                  isPrintMode
                                    ? "border-b border-zinc-300 bg-zinc-100 p-2"
                                    : "p-3.5 border-b border-white/10 bg-white/5"
                                }`}
                              >
                                <h3
                                  className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                                    isPrintMode ? "text-zinc-800" : "text-white/70"
                                  }`}
                                >
                                  {isPrintMode ? (
                                    "DESPESAS DETALHADAS"
                                  ) : (
                                    <>
                                      <img src="/despesas%20detalhadas.png" referrerPolicy="no-referrer" className="w-4 h-4 object-contain inline-block mr-1.5 shrink-0 align-middle" alt="" /> Despesas Detalhadas
                                    </>
                                  )}
                                </h3>
                                {!isPrintMode && (
                                  <button
                                    onClick={() => {
                                      if (players.length === 0) {
                                        setToast({
                                          message: "Adicione jogadores para detalhar despesas",
                                          type: "info"
                                        });
                                        setTimeout(() => setToast(null), 3000);
                                        return;
                                      }
                                      setShowExpenseModal(true);
                                    }}
                                    className="p-1.5 bg-[#34d399] text-[#1E3D2F] rounded-lg hover:opacity-90 active:scale-95 transition-all block cursor-pointer"
                                  >
                                    <Plus size={14} />
                                  </button>
                                )}
                              </div>
                              <div
                                className={`divide-y ${isPrintMode ? "divide-zinc-200" : "divide-white/5"}`}
                              >
                                {(expenses || []).length === 0 ? (
                                  <div
                                    className={`text-center text-white/35 text-[10px] font-medium uppercase tracking-widest ${isPrintMode ? "p-2" : "p-6"}`}
                                  >
                                    Nenhuma despesa registrada
                                  </div>
                                ) : (
                                  sortedExpenses.map((expense, idx) => (
                                    <div
                                      key={`expense-${expense.id}-${idx}`}
                                      className={`flex items-center justify-between group ${isPrintMode ? "p-2 bg-white" : "p-3 bg-transparent hover:bg-white/5 transition-all"}`}
                                    >
                                      <div>
                                        <p
                                          className={`text-xs uppercase tracking-tight ${
                                            isPrintMode ? "font-mono text-zinc-800" : "font-black text-white font-mono"
                                          }`}
                                        >
                                          {expense.name}
                                        </p>
                                        <p
                                          className={`text-[8px] font-bold uppercase tracking-widest ${
                                            isPrintMode ? "text-zinc-500" : "text-white/40"
                                          }`}
                                        >
                                          {new Date(
                                            expense.date,
                                          ).toLocaleDateString("pt-BR")}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-4">
                                        <p
                                          className={`text-xs font-bold ${
                                            isPrintMode ? "text-zinc-900" : "font-black text-red-400 font-mono"
                                          }`}
                                        >
                                          R$ {expense.amount},00
                                        </p>
                                        {!isPrintMode && (
                                          <button
                                            onClick={() =>
                                              setExpenses((prev) =>
                                                prev.filter(
                                                  (e) => e.id !== expense.id,
                                                ),
                                              )
                                            }
                                            className="p-1 text-white/30 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                                          >
                                            <Trash2 size={13} />
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
                            <div
                              className={`transition-all overflow-hidden ${
                                isPrintMode
                                  ? "bg-white border border-zinc-300 rounded-none"
                                  : "rounded-2xl border border-white/10 bg-[#34d399]/5 p-4 space-y-3 shadow-sm"
                              }`}
                            >
                              <div
                                className={`flex justify-between items-center ${isPrintMode ? "border-b border-zinc-300 bg-zinc-100 p-2 text-zinc-900" : ""}`}
                              >
                                <h3
                                  className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${
                                    isPrintMode ? "text-zinc-800" : "text-[#34d399]"
                                  }`}
                                >
                                  {isPrintMode ? (
                                    "PAGOS"
                                  ) : (
                                    <>
                                      <CheckCircle2 size={14} /> Jogadores em Dia
                                    </>
                                  )}{" "}
                                  ({MONTHS[new Date().getMonth()]})
                                </h3>
                                {!isPrintMode && (
                                  <button
                                    onClick={() => {
                                      if (players.length === 0) {
                                        setToast({
                                          message:
                                            "Adicione jogadores para gerar relatórios",
                                          type: "info",
                                        });
                                        setTimeout(() => setToast(null), 3000);
                                        return;
                                      }
                                      setIsPrintMode(true);
                                      setIsPrintPaymentsOnly(true);
                                    }}
                                    className="p-1 text-[#34d399] hover:bg-[#34d399]/10 rounded-lg transition-colors cursor-pointer"
                                    title="Gerar Print desta lista"
                                  >
                                    <Eye size={14} />
                                  </button>
                                )}
                              </div>
                              <div
                                className={`${isPrintMode ? "divide-y divide-zinc-200" : "space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1"}`}
                              >
                                {(
                                  players.filter((p) => {
                                    const currentMonth =
                                      MONTHS[new Date().getMonth()];
                                    const record = payments.find(
                                      (pay) =>
                                        pay.playerId === p.id &&
                                        pay.year === selectedYear,
                                    );
                                    return (
                                      record &&
                                      (record.months[currentMonth] || 0) > 0
                                    );
                                  }) || []
                                ).map((p, pIndex) => (
                                  <div
                                    key={`em-dia-${p.id}-${pIndex}`}
                                    className={`flex items-center justify-between ${
                                      isPrintMode ? "p-2 bg-white" : "p-2.5 rounded-xl bg-white/5 border border-white/5"
                                    }`}
                                  >
                                    <span
                                      className={`text-xs uppercase tracking-tight ${
                                        isPrintMode ? "font-mono text-zinc-800" : "font-bold text-white/90 font-mono"
                                      }`}
                                    >
                                      {p.name}
                                    </span>
                                    {isPrintMode ? (
                                      <span className="text-[10px] uppercase font-bold text-[#34d399] tracking-widest">
                                        Pago
                                      </span>
                                    ) : (
                                      <Check
                                        size={14}
                                        className="text-[#34d399]"
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Em Débito */}
                            <div
                              className={`transition-all overflow-hidden ${
                                isPrintMode
                                  ? "bg-white border border-zinc-300 rounded-none"
                                  : "rounded-2xl border border-white/10 bg-red-500/5 p-4 space-y-3 shadow-sm"
                              }`}
                            >
                              <div
                                className={`flex justify-between items-center ${isPrintMode ? "border-b border-zinc-300 bg-zinc-100 p-2 text-zinc-900" : ""}`}
                              >
                                <h3
                                  className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${
                                    isPrintMode ? "text-zinc-800" : "text-red-400"
                                  }`}
                                >
                                  {isPrintMode ? (
                                    "DEVENDO"
                                  ) : (
                                    <>
                                      <AlertCircle size={14} /> Pendentes
                                    </>
                                  )}{" "}
                                  ({MONTHS[new Date().getMonth()]})
                                </h3>
                                {!isPrintMode && (
                                  <button
                                    onClick={() => {
                                      if (players.length === 0) {
                                        setToast({
                                          message:
                                            "Adicione jogadores para gerar relatórios",
                                          type: "info",
                                        });
                                        setTimeout(() => setToast(null), 3000);
                                        return;
                                      }
                                      setIsPrintMode(true);
                                      setIsPrintPaymentsOnly(true);
                                    }}
                                    className="p-1 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                    title="Gerar Print desta lista"
                                  >
                                    <Eye size={14} />
                                  </button>
                                )}
                              </div>
                              <div
                                className={`${isPrintMode ? "divide-y divide-zinc-200" : "space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1"}`}
                              >
                                {(
                                  players.filter((p) => {
                                    const currentMonth =
                                      MONTHS[new Date().getMonth()];
                                    const record = payments.find(
                                      (pay) =>
                                        pay.playerId === p.id &&
                                        pay.year === selectedYear,
                                    );
                                    return (
                                      !record ||
                                      (record.months[currentMonth] || 0) <= 0
                                    );
                                  }) || []
                                ).map((p, pIndex) => (
                                  <div
                                    key={`em-debito-${p.id}-${pIndex}`}
                                    className={`flex items-center justify-between ${
                                      isPrintMode ? "p-2 bg-white" : "p-2.5 rounded-xl bg-white/5 border border-white/5"
                                    }`}
                                  >
                                    <span
                                      className={`text-xs uppercase tracking-tight ${
                                        isPrintMode ? "font-mono text-zinc-800" : "font-bold text-white/90 font-mono"
                                      }`}
                                    >
                                      {p.name}
                                    </span>
                                    {isPrintMode ? (
                                      <span className="text-[10px] uppercase font-bold text-red-600 tracking-widest">
                                        Pendente
                                      </span>
                                    ) : (
                                      <span className="text-[8px] font-black text-red-400 uppercase tracking-tighter">
                                        Pendente
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {isPrintMode && (
                            <div className="pt-8 text-center opacity-40">
                              <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                                Gerado via App FutQuina •{" "}
                                {new Date().toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                {financeSubScreen === "mensalidade" && (
                  <motion.div className="space-y-4">
                    {!isPrintMode && (
                      <div className="flex justify-end px-4">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => {
                              if (players.length === 0) {
                                setToast({
                                  message: "Adicione jogadores para gerar relatórios",
                                  type: "info"
                                });
                                setTimeout(() => setToast(null), 3000);
                                return;
                              }
                              setIsPrintMode(true);
                            }}
                            className="text-white/60 hover:text-white p-1.5 hover:bg-white/10 rounded-full border border-white/10 transition-colors cursor-pointer"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </div>
                    )}

                    {!isPrintMode && (
                      <div className="grid grid-cols-2 gap-2 px-4 mb-4">
                        <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.15em]">
                              Mensalidade
                            </span>
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
                                  if (e.key === "Enter") {
                                    const val = parseInt(tempFee);
                                    if (!isNaN(val)) setMonthlyFee(val);
                                    setIsEditingFee(false);
                                  }
                                }}
                                className="w-16 bg-white/10 border border-white/20 text-white font-black text-xs rounded px-1.5 py-0.5 outline-none focus:border-[#34d399] focus:bg-white/15"
                              />
                            ) : (
                              <div
                                onClick={() => {
                                  setTempFee(monthlyFee.toString());
                                  setIsEditingFee(true);
                                }}
                                className="text-xs font-black text-white cursor-pointer hover:text-[#34d399] transition-colors"
                              >
                                R$ {monthlyFee},00
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => setMonthlyFee((prev) => prev + 1)}
                              className="p-1 bg-white/5 text-white/80 border border-white/10 rounded hover:bg-white/10 transition-all cursor-pointer active:scale-95"
                            >
                              <Plus size={8} />
                            </button>
                            <button
                              onClick={() =>
                                setMonthlyFee((prev) => Math.max(0, prev - 1))
                              }
                              className="p-1 bg-white/5 text-white/80 border border-white/10 rounded hover:bg-white/10 transition-all cursor-pointer active:scale-95"
                            >
                              <Minus size={8} />
                            </button>
                          </div>
                        </div>

                        <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.15em]">
                              Ano Selecionado
                            </span>
                            <select
                              value={selectedYear}
                              onChange={(e) =>
                                setSelectedYear(parseInt(e.target.value))
                              }
                              className="bg-transparent text-xs font-black text-white outline-none cursor-pointer [color-scheme:dark]"
                            >
                              {availableYears.map((y) => (
                                <option
                                  key={y}
                                  value={y}
                                  className="bg-[#0b0e17] text-white"
                                >
                                  {y}
                                </option>
                              ))}
                            </select>
                          </div>
                          <button
                            onClick={addYear}
                            className="w-6 h-6 rounded-lg bg-[#34d399] hover:bg-[#34d399]/90 text-[#1e3d2f] flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-md shadow-[#34d399]/15"
                            title="Adicionar Novo Ano"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    )}

                    {isPrintMode && (
                      <div className="p-3 bg-[#dce3ee] text-zinc-800 flex justify-between items-center">
                        <FutQuinaLogo
                          size="sm"
                          titleColorClass="text-[#484848]"
                        />
                        <button
                          onClick={() => setIsPrintMode(false)}
                          className="p-1.5 bg-black/10 rounded-sm cursor-pointer"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}

                    <div
                      className={`${isPrintMode ? "overflow-visible" : "overflow-x-auto -mx-4 px-4 pb-2 custom-scrollbar"}`}
                    >
                      <div
                        className={`${isPrintMode ? "w-full" : "min-w-[800px]"}`}
                      >
                        <table
                          className={`w-full border-collapse ${isPrintMode ? "text-[10px]" : "text-[9px]"}`}
                        >
                          <thead>
                            <tr
                              className={`${isPrintMode ? "bg-zinc-100 text-zinc-900" : "bg-white/5 text-white border-b border-white/10"} font-black uppercase tracking-tighter`}
                            >
                              <th
                                className={`p-1.5 text-left border ${isPrintMode ? "border-zinc-300" : "border-white/10 rounded-tl-xl sticky left-0 z-10 bg-[#0c101b]"}`}
                              >
                                Nome
                              </th>
                              <th
                                className={`p-1.5 text-center border ${isPrintMode ? "border-zinc-300" : "border-white/10"}`}
                                colSpan={12}
                              >
                                {selectedYear} (R$ {monthlyFee},00)
                              </th>
                              <th
                                className={`p-1.5 text-center border ${isPrintMode ? "border-zinc-300" : "border-white/10 rounded-tr-xl"}`}
                              >
                                Dívida
                              </th>
                            </tr>
                            <tr
                              className={`${isPrintMode ? "bg-zinc-50 text-zinc-700" : "bg-white/5 text-white/80"} font-bold uppercase tracking-tighter`}
                            >
                              <th
                                className={`border ${isPrintMode ? "border-zinc-300" : "border-white/10 sticky left-0 z-10 bg-[#0c101b]"}`}
                              ></th>
                              {MONTHS.map((month) => (
                                <th
                                  key={month}
                                  className={`p-0.5 border ${isPrintMode ? "border-zinc-300" : "border-white/10"}`}
                                >
                                  {month}
                                </th>
                              ))}
                              <th
                                className={`border ${isPrintMode ? "border-zinc-300" : "border-white/10"}`}
                              ></th>
                            </tr>
                          </thead>
                          <tbody
                            className={`${isPrintMode ? "bg-white text-black" : "text-white bg-transparent"}`}
                          >
                            {players.map((player, index) => {
                              const record = payments.find(
                                (p) =>
                                  p.playerId === player.id &&
                                  p.year === selectedYear,
                              ) || {
                                playerId: player.id,
                                year: selectedYear,
                                months: {},
                                monthlyFee: monthlyFee,
                              };

                              const totalDebt = 12 * monthlyFee;
                              const paidMonths = MONTHS.reduce(
                                (acc, month) =>
                                  acc +
                                  (record?.months?.[month] ? monthlyFee : 0),
                                0,
                              );
                              const remaining = totalDebt - paidMonths;

                              const rowBg = index % 2 === 0 ? "bg-white/5" : "bg-transparent";
                              const stickyBg = index % 2 === 0 ? "bg-[#141926]" : "bg-[#0b0e17]";

                              return (
                                <tr
                                  key={`finance-row-${player.id}-${index}`}
                                  className={`${isPrintMode ? (index % 2 === 0 ? "bg-zinc-50" : "bg-white") : rowBg} ${!isPrintMode ? "hover:bg-white/10 transition-colors" : ""}`}
                                >
                                  <td
                                    className={`p-1 border ${isPrintMode ? "border-zinc-200" : "border-white/10 font-bold sticky left-0 z-10"} ${isPrintMode ? "bg-inherit" : stickyBg}`}
                                  >
                                    <span className="p-0.5 font-bold">
                                      {player.name}
                                    </span>
                                  </td>
                                  {MONTHS.map((month) => {
                                    const isPaid =
                                      (record?.months?.[month] || 0) > 0;
                                    return (
                                      <td
                                        key={`month-cell-${player.id}-${month}`}
                                        className={`p-0.5 border ${isPrintMode ? "border-zinc-200" : "border-white/10"} text-center`}
                                      >
                                        {isPrintMode ? (
                                          <span
                                            className={`font-bold ${isPaid ? "text-emerald-600" : "text-red-400 opacity-30"}`}
                                          >
                                            {isPaid ? "OK" : "-"}
                                          </span>
                                        ) : (
                                          <button
                                            onClick={() =>
                                              togglePayment(
                                                player.id,
                                                month,
                                                monthlyFee,
                                              )
                                            }
                                            className={`w-full py-1 text-[8px] tracking-tight rounded transition-all cursor-pointer ${isPaid ? "bg-[#34d399] text-[#1e3d2f] font-black hover:opacity-90" : "bg-white/5 hover:bg-white/10 text-white/40 font-bold"}`}
                                          >
                                            {isPaid
                                              ? "PAGO"
                                              : `R$ ${monthlyFee}`}
                                          </button>
                                        )}
                                      </td>
                                    );
                                  })}
                                  <td
                                    className={`p-1 border ${isPrintMode ? "border-zinc-200" : "border-white/10"} text-center font-black ${remaining > 0 ? (isPrintMode ? "text-red-600" : "text-red-400") : (isPrintMode ? "text-emerald-700" : "text-[#34d399]")}`}
                                  >
                                    R$ {remaining}
                                  </td>
                                </tr>
                              );
                            })}
                            {players.length === 0 && (
                              <tr>
                                <td
                                  colSpan={14}
                                  className={`p-4 text-center italic normal-case ${isPrintMode ? "text-zinc-400" : "text-white/40 bg-white/5 border border-white/10"}`}
                                >
                                  Nenhum jogador cadastrado.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {!isPrintMode && (
                      <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1 mt-4">
                        <div className="flex items-center gap-1.5 text-[#34d399]">
                          <Info size={12} />
                          <span className="text-[8px] font-black uppercase tracking-[0.15em]">
                            Dica
                          </span>
                        </div>
                        <p className="text-[9px] text-white/60 leading-relaxed">
                          Clique no valor da mensalidade para editar. Use o
                          botão "+" para criar um novo ano de controle.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
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
                  <h3 className="text-2xl font-black uppercase tracking-tighter">
                    Completar Times
                  </h3>
                  <button
                    onClick={() => setShowEqualizerModal(false)}
                    className="p-2 glass-3d rounded-md"
                  >
                    <Plus size={20} className="rotate-45" />
                  </button>
                </div>

                <p className="text-xs text-brand-text-secondary uppercase font-bold tracking-widest leading-relaxed">
                  A partida só pode iniciar com times equilibrados. Selecione
                  jogadores de{" "}
                  <span className="text-brand-primary">outros times</span> para
                  completar o{" "}
                  <span className="text-brand-primary">
                    {teams[equalizerData.targetTeamIndex].name}
                  </span>
                  .
                  <br />
                  <span className="text-[10px] opacity-60 mt-1 block">
                    Faltam{" "}
                    {equalizerData.requiredCount -
                      (teams[equalizerData.targetTeamIndex]?.playerIds
                        ?.length || 0)}{" "}
                    jogador(es) para igualar ao{" "}
                    {teams[equalizerData.otherTeamIndex]?.name || "outro time"}.
                  </span>
                </p>

                <div className="max-h-60 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                  {players
                    .filter((p) => {
                      // Only show players who are NOT in the two selected teams AND are available
                      const isSelected =
                        (match.teamAIndex !== -1 &&
                          teams[match.teamAIndex]?.playerIds?.includes(p.id)) ||
                        (match.teamBIndex !== -1 &&
                          teams[match.teamBIndex]?.playerIds?.includes(p.id));
                      return !isSelected && p.isAvailable;
                    })
                    .map((player) => {
                      const currentTeam = teams.find((t) =>
                        t.playerIds.includes(player.id),
                      );
                      const isInOtherTeam =
                        equalizerData.otherTeamIndex !== -1 &&
                        teams[
                          equalizerData.otherTeamIndex
                        ]?.playerIds?.includes(player.id);
                      const isInAnyOtherTeam = teams.some(
                        (t, idx) =>
                          idx !== equalizerData.targetTeamIndex &&
                          t.playerIds?.includes(player.id),
                      );

                      return (
                        <button
                          key={`equalizer-player-choice-${player.id}`}
                          onClick={() => {
                            const newTeams = [...teams];

                            // Remove from any other team first
                            newTeams.forEach((t) => {
                              t.playerIds = t.playerIds.filter(
                                (id) => id !== player.id,
                              );
                            });

                            // Add to target team
                            if (newTeams[equalizerData.targetTeamIndex]) {
                              newTeams[
                                equalizerData.targetTeamIndex
                              ].playerIds.push(player.id);
                            }
                            setTeams(newTeams);
                          }}
                          className={`w-full p-4 rounded-lg text-left font-bold transition-all flex justify-between items-center glass-3d ${
                            isInOtherTeam
                              ? "bg-brand-primary/10 border border-brand-primary/20"
                              : isInAnyOtherTeam
                                ? "bg-zinc-500/5 opacity-60"
                                : "bg-brand-dark hover:bg-brand-primary/20"
                          }`}
                        >
                          <div className="flex flex-col">
                            <span
                              className={
                                isInOtherTeam ? "text-brand-primary" : ""
                              }
                            >
                              {player.name}
                            </span>
                            <span className="text-[8px] uppercase opacity-60">
                              {currentTeam
                                ? `Time: ${currentTeam.name}`
                                : "Sem Time"}
                            </span>
                          </div>
                          {isInOtherTeam ? (
                            <Shuffle size={16} className="text-brand-primary" />
                          ) : (
                            <Plus size={16} className="text-brand-primary" />
                          )}
                        </button>
                      );
                    })}
                  {players.filter(
                    (p) =>
                      p.isAvailable &&
                      !(
                        match.teamAIndex !== -1 &&
                        teams[match.teamAIndex]?.playerIds?.includes(p.id)
                      ) &&
                      !(
                        match.teamBIndex !== -1 &&
                        teams[match.teamBIndex]?.playerIds?.includes(p.id)
                      ),
                  ).length === 0 && (
                    <div className="text-center py-8 opacity-50 text-xs">
                      Não há jogadores disponíveis em outros times. <br />
                      Crie novos jogadores para equilibrar a partida.
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  {(teams[equalizerData.targetTeamIndex]?.playerIds?.length ||
                    0) === equalizerData.requiredCount ? (
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
            {movingPlayers &&
              !isSelectingDestination &&
              movingPlayers.playerIds.length > 0 && (
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  className="fixed bottom-24 left-0 right-0 px-4 z-[100] flex justify-center pointer-events-none"
                >
                  <div className="bg-brand-card/95 backdrop-blur-md border border-brand-primary/50 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-full p-2 flex items-center gap-3 pointer-events-auto">
                    <div className="px-4 text-sm font-bold text-brand-text-primary">
                      {movingPlayers.playerIds.length} selecionado
                      {movingPlayers.playerIds.length > 1 ? "s" : ""}
                    </div>
                    <button
                      onClick={() => {
                        setIsSelectingDestination(true);
                        setToast({
                          message:
                            "Selecione o time de destino (apenas times incompletos).",
                          type: "info",
                        });
                      }}
                      className="px-6 py-2 bg-brand-primary text-black rounded-full font-black uppercase text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow shadow-brand-primary/20"
                    >
                      <MoveRight size={16} /> Mover
                    </button>
                    <button
                      onClick={() => {
                        setMovingPlayers(null);
                        setIsSelectingDestination(false);
                      }}
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
            onClick={() => setShowPlayerActionsModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              className="w-full max-w-[280px] rounded-[24px] overflow-hidden shadow-2xl bg-[#0b0e17]/95 border border-white/10 text-white backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-white/5 p-6 text-center relative overflow-hidden border-b border-white/5">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#34d399]/5 rounded-full -mr-8 -mt-8 blur-xl" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8 blur-lg" />

                <div className="w-14 h-14 mx-auto rounded-full bg-white/5 flex items-center justify-center overflow-hidden border border-white/10 shadow-lg relative z-10 mb-3">
                  {players.find((p) => p.id === showPlayerActionsModal.playerId)
                    ?.photo ? (
                    <img
                      src={
                        players.find(
                          (p) => p.id === showPlayerActionsModal.playerId,
                        )?.photo
                      }
                      alt="Player"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-white/40 flex items-center shrink-0">
                      <User size={28} />
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-black uppercase tracking-tight text-white leading-none">
                  {
                    players.find(
                      (p) => p.id === showPlayerActionsModal.playerId,
                    )?.name
                  }
                </h3>
                <div className="flex justify-center gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={`star-action-${showPlayerActionsModal.playerId}-${star}`}
                      size={8}
                      className={`${(players.find((p) => p.id === showPlayerActionsModal.playerId)?.stars || 3) >= star ? "fill-yellow-400 text-yellow-400" : "text-white/10"}`}
                    />
                  ))}
                </div>
                <p className="text-[8px] text-white/50 font-black mt-1.5 uppercase tracking-[0.2em]">
                  AÇÕES DO JOGADOR
                </p>
              </div>

              {/* Actions Section */}
              <div className="p-3">
                <div className="space-y-1.5">
                  {/* Primary Success Actions (Goal) */}
                  {!swappingPlayerId &&
                    (showPlayerActionsModal.teamIndex === match.teamAIndex ||
                      showPlayerActionsModal.teamIndex ===
                        match.teamBIndex) && (
                      <button
                        onClick={() => {
                          if (
                            !match.isActive ||
                            match.isPaused ||
                            match.scoreA >= match.config.goalLimit ||
                            match.scoreB >= match.config.goalLimit
                          )
                            return;
                          setShowAssistSelection({
                            teamIndex: showPlayerActionsModal.teamIndex,
                            scorerId: showPlayerActionsModal.playerId,
                          });
                          setShowPlayerActionsModal(null);
                        }}
                        disabled={
                          !match.isActive ||
                          match.isPaused ||
                          match.scoreA >= match.config.goalLimit ||
                          match.scoreB >= match.config.goalLimit
                        }
                        className="w-full h-9 bg-[#34d399] hover:bg-[#34d399]/90 text-[#1e3d2f] rounded-xl font-black uppercase text-[10px] tracking-wider flex items-center justify-center px-4 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#34d399]/20 group font-roboto-flex cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[#1e3d2f] group-hover:scale-110 transition-transform flex items-center">
                            <IoIosFootball size={14} />
                          </span>
                          <span className="tracking-widest">Registrar Gol</span>
                        </div>
                      </button>
                    )}

                  {/* Swap Confirmation (Contextual) */}
                  {swappingPlayerId &&
                    swappingPlayerId !== showPlayerActionsModal.playerId && (
                      <button
                        onClick={() => {
                          const playerAId = swappingPlayerId;
                          const playerBId = showPlayerActionsModal.playerId;

                          const targetTeamIdx = teams.findIndex((t) =>
                            t.playerIds.includes(playerAId),
                          );
                          if (targetTeamIdx !== -1) {
                            scrollToTeam(targetTeamIdx);
                          }

                          handleGoalkeeperSwap(playerAId, playerBId);
                          setTeams((prev) => {
                            const newTeams = prev.map((t) => ({
                              ...t,
                              playerIds: [...t.playerIds],
                            }));
                            let teamAIdx = -1;
                            let teamBIdx = -1;

                            newTeams.forEach((team, idx) => {
                              if (team.playerIds.includes(playerAId))
                                teamAIdx = idx;
                              if (team.playerIds.includes(playerBId))
                                teamBIdx = idx;
                            });

                            if (teamAIdx !== -1 && teamBIdx !== -1) {
                              if (teamAIdx === teamBIdx) {
                                newTeams[teamAIdx].playerIds = newTeams[
                                  teamAIdx
                                ].playerIds.map((id) => {
                                  if (id === playerAId) return playerBId;
                                  if (id === playerBId) return playerAId;
                                  return id;
                                });
                        } else {
                                newTeams[teamAIdx].playerIds = newTeams[
                                  teamAIdx
                                ].playerIds.map((id) =>
                                  id === playerAId ? playerBId : id,
                                );
                                newTeams[teamBIdx].playerIds = newTeams[
                                  teamBIdx
                                ].playerIds.map((id) =>
                                  id === playerBId ? playerAId : id,
                                );
                              }
                            }

                            return newTeams;
                          });
                          setSwappingPlayerId(null);
                          setShowPlayerActionsModal(null);
                        }}
                        className="w-full h-9 bg-amber-500 hover:bg-amber-600 text-black rounded-xl font-black uppercase text-[10px] tracking-wider flex items-center justify-between px-4 transition-all active:scale-95 shadow-md shadow-amber-500/20 group font-roboto-flex cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <RefreshCw
                            size={14}
                            className="group-hover:rotate-180 transition-transform duration-500"
                          />
                          <span className="tracking-widest">
                            Confirmar Troca
                          </span>
                        </div>
                        <Check size={12} className="opacity-50" />
                      </button>
                    )}

                  {/* Action Grid */}
                  {!swappingPlayerId &&
                    orgProSettings.allowFixedGoalkeeper !== false &&
                    (!teams[showPlayerActionsModal.teamIndex]?.playerIds.some(
                      (pid) => players.find((p) => p.id === pid)?.isGoalkeeper,
                    ) ||
                      players.find(
                        (p) => p.id === showPlayerActionsModal.playerId,
                      )?.isGoalkeeper) && (
                      <button
                        onClick={() => {
                          const pid = showPlayerActionsModal.playerId;
                          const targetTeamIndex =
                            showPlayerActionsModal.teamIndex;
                          const player = players.find((p) => p.id === pid);
                          const isBecomingGk = player
                            ? !player.isGoalkeeper
                            : false;

                          setPlayers((prev) =>
                            prev.map((p) =>
                              p.id === pid
                                ? { ...p, isGoalkeeper: !p.isGoalkeeper }
                                : p,
                            ),
                          );

                          if (isBecomingGk && targetTeamIndex !== -1) {
                            setTeams((prev) =>
                              prev.map((team, idx) => {
                                if (idx === targetTeamIndex) {
                                  const otherIds = team.playerIds.filter(
                                    (id) => id !== pid,
                                  );
                                  return {
                                    ...team,
                                    playerIds: [pid, ...otherIds],
                                  };
                                }
                                return team;
                              }),
                            );
                          }

                          setShowPlayerActionsModal(null);
                        }}
                        className={`w-full h-9 mt-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider flex items-center justify-center px-4 transition-all active:scale-[0.98] shadow-sm group border cursor-pointer ${players.find((p) => p.id === showPlayerActionsModal.playerId)?.isGoalkeeper ? "bg-sky-500/10 border-sky-500/20 text-sky-400 hover:bg-sky-500/20" : "bg-white/5 border-white/10 text-white hover:bg-white/10"}`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`${players.find((p) => p.id === showPlayerActionsModal.playerId)?.isGoalkeeper ? "text-sky-400 border-sky-400/40" : "text-white/40 border-white/20"} flex items-center border rounded-full w-4 h-4 justify-center text-[9px] font-black leading-none`}
                          >
                            G
                          </span>
                          <span className="tracking-widest">
                            {players.find(
                              (p) => p.id === showPlayerActionsModal.playerId,
                            )?.isGoalkeeper
                              ? "Remover goleiro fixo"
                              : "Definir como goleiro fixo"}
                          </span>
                        </div>
                      </button>
                    )}
                  <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                    {/* Substituir */}
                    {swappingPlayerId !== showPlayerActionsModal.playerId && (
                      <button
                        onClick={() => {
                          setSwappingPlayerId(showPlayerActionsModal.playerId);
                          setShowPlayerActionsModal(null);
                          setToast({
                            message:
                              "Selecione outro jogador para trocar de posição.",
                            type: "info",
                          });
                        }}
                        className="py-2.5 bg-white/5 border border-white/10 text-white rounded-xl font-bold uppercase text-[9px] tracking-wider flex flex-col items-center justify-center gap-1 transition-all hover:bg-white/10 active:scale-95 shadow-sm group cursor-pointer"
                      >
                        <ArrowLeftRight
                          size={14}
                          className="text-white/60 group-hover:text-white transition-colors"
                        />
                        Substituir
                      </button>
                    )}

                    {/* Mover */}
                    {!swappingPlayerId && (
                      <button
                        onClick={() => {
                          setMovingPlayers({
                            teamId: teams[showPlayerActionsModal.teamIndex].id,
                            playerIds: [showPlayerActionsModal.playerId],
                          });
                          setIsSelectingDestination(true);
                          setTeamsTab("proximos");
                          setShowPlayerActionsModal(null);
                          setToast({
                            message:
                              "Selecione o time de destino (apenas times incompletos).",
                            type: "info",
                          });
                        }}
                        className="py-2.5 bg-white/5 border border-white/10 text-white rounded-xl font-bold uppercase text-[9px] tracking-wider flex flex-col items-center justify-center gap-1 transition-all hover:bg-white/10 active:scale-95 shadow-sm group cursor-pointer"
                      >
                        <MoveRight
                          size={14}
                          className="text-white/60 group-hover:text-white transition-colors"
                        />
                        Mover
                      </button>
                    )}

                    {/* Ausente */}
                    {!swappingPlayerId && (
                      <button
                        onClick={() => {
                          const isPlayerInActiveMatch =
                            match.isActive &&
                            [match.teamAIndex, match.teamBIndex].includes(
                              showPlayerActionsModal.teamIndex,
                            );

                          if (isPlayerInActiveMatch && !match.isPaused) {
                            setMatch((prev) => ({ ...prev, isPaused: true }));
                          }

                          setTeams((prev) => {
                            return prev
                              .map((t) => ({
                                ...t,
                                playerIds: t.playerIds.filter(
                                  (id) =>
                                    id !== showPlayerActionsModal.playerId,
                                ),
                              }))
                              .filter((t) => t.playerIds.length > 0);
                          });
                          setPlayers((prev) =>
                            prev.map((p) =>
                              p.id === showPlayerActionsModal.playerId
                                ? {
                                    ...p,
                                    isAvailable: false,
                                    arrivedAt: undefined,
                                  }
                                : p,
                            ),
                          );

                          if (isPlayerInActiveMatch) {
                            setFillingVacancyForTeam(
                              showPlayerActionsModal.teamIndex,
                            );
                            setTeamsTab("proximos");
                            setToast({
                              message:
                                "Selecione o jogador que entrará no lugar.",
                              type: "info",
                            });
                    } else {
                            setToast({
                              message: "Jogador movido para ausentes.",
                              type: "info",
                            });
                          }

                          setShowPlayerActionsModal(null);
                        }}
                        className="py-2.5 bg-red-500/5 border border-red-500/20 text-red-400 rounded-xl font-bold uppercase text-[9px] tracking-wider flex flex-col items-center justify-center gap-1 transition-all hover:bg-red-500/10 active:scale-95 shadow-sm group cursor-pointer"
                      >
                        <LogOut
                          size={14}
                          className="text-red-400 opacity-80 group-hover:opacity-100 transition-opacity"
                        />
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
                        className="py-2.5 bg-red-500/5 border border-red-500/20 text-red-400 rounded-xl font-bold uppercase text-[9px] tracking-wider flex flex-col items-center justify-center gap-1 transition-all hover:bg-red-500/10 active:scale-95 shadow-sm cursor-pointer"
                      >
                        <X size={14} className="text-red-400 opacity-80" />
                        Cancelar
                      </button>
                    )}

                    <button
                      onClick={() => setShowPlayerActionsModal(null)}
                      className="py-2.5 bg-white/5 border border-white/10 text-white rounded-xl font-bold uppercase text-[9px] tracking-wider flex flex-col items-center justify-center gap-1 transition-all hover:bg-white/10 active:scale-95 shadow-sm cursor-pointer"
                    >
                      <X size={14} className="text-white/60" />
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
            onClick={() => setShowQueuePlayerModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              className="w-full max-w-[280px] rounded-[24px] overflow-hidden shadow-2xl bg-[#0b0e17]/95 border border-white/10 text-white backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-white/5 p-6 text-center relative overflow-hidden border-b border-white/5">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#34d399]/5 rounded-full -mr-8 -mt-8 blur-xl" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8 blur-lg" />

                <div className="w-14 h-14 mx-auto rounded-full bg-white/5 flex items-center justify-center overflow-hidden border border-white/10 shadow-lg relative z-10 mb-3">
                  {players.find((p) => p.id === showQueuePlayerModal.playerId)
                    ?.photo ? (
                    <img
                      src={
                        players.find(
                          (p) => p.id === showQueuePlayerModal.playerId,
                        )?.photo
                      }
                      alt="Player"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-white/40 flex items-center shrink-0">
                      <User size={28} />
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-black uppercase tracking-tight text-white leading-none">
                  {
                    players.find((p) => p.id === showQueuePlayerModal.playerId)
                      ?.name
                  }
                </h3>
                <p className="text-[8px] text-white/50 font-black mt-1.5 uppercase tracking-[0.2em]">
                  AÇÕES DO JOGADOR
                </p>
              </div>

              <div className="p-4">
                <div className="space-y-2.5">
                  {!showQueuePlayerModal.showMoveOptions ? (
                    <div className="grid grid-cols-2 gap-1.5">
                      {orgProSettings.allowFixedGoalkeeper !== false &&
                        (!teams[showQueuePlayerModal.teamIndex]?.playerIds.some(
                          (pid) =>
                            players.find((p) => p.id === pid)?.isGoalkeeper,
                        ) ||
                          players.find(
                            (p) => p.id === showQueuePlayerModal.playerId,
                          )?.isGoalkeeper) && (
                          <button
                            onClick={() => {
                              const pid = showQueuePlayerModal.playerId;
                              const targetTeamIndex =
                                showQueuePlayerModal.teamIndex;
                              const player = players.find((p) => p.id === pid);
                              const isBecomingGk = player
                                ? !player.isGoalkeeper
                                : false;

                              setPlayers((prev) =>
                                prev.map((p) =>
                                  p.id === pid
                                    ? { ...p, isGoalkeeper: !p.isGoalkeeper }
                                    : p,
                                ),
                              );

                              if (isBecomingGk && targetTeamIndex !== -1) {
                                setTeams((prev) =>
                                  prev.map((team, idx) => {
                                    if (idx === targetTeamIndex) {
                                      const otherIds = team.playerIds.filter(
                                        (id) => id !== pid,
                                      );
                                      return {
                                        ...team,
                                        playerIds: [pid, ...otherIds],
                                      };
                                    }
                                    return team;
                                  }),
                                );
                              }

                              setShowQueuePlayerModal(null);
                            }}
                            className={`col-span-2 py-2.5 rounded-xl font-bold text-[9px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 border group cursor-pointer ${players.find((p) => p.id === showQueuePlayerModal.playerId)?.isGoalkeeper ? "bg-sky-500/10 border-sky-500/20 text-sky-400 hover:bg-sky-500/20" : "bg-white/5 border-white/10 text-white hover:bg-white/10"}`}
                          >
                            <span
                              className={`${players.find((p) => p.id === showQueuePlayerModal.playerId)?.isGoalkeeper ? "text-sky-400 border-sky-400/40" : "text-white/40 border-white/20"} flex items-center border rounded-full w-4 h-4 justify-center text-[9px] font-black leading-none`}
                            >
                              G
                            </span>
                            {players.find(
                              (p) => p.id === showQueuePlayerModal.playerId,
                            )?.isGoalkeeper
                              ? "Remover goleiro fixo"
                              : "Definir como goleiro fixo"}
                          </button>
                        )}
                      <button
                        onClick={() => {
                          setSwappingPlayerId(showQueuePlayerModal.playerId);
                          setShowQueuePlayerModal(null);
                          setToast({
                            message:
                              "Selecione outro jogador para trocar de posição.",
                            type: "info",
                          });
                        }}
                        className="py-2.5 bg-white/5 border border-white/10 text-white rounded-xl font-bold uppercase text-[9px] tracking-wider flex flex-col items-center justify-center gap-1 transition-all hover:bg-white/10 active:scale-95 shadow-sm group cursor-pointer"
                      >
                        <ArrowLeftRight
                          size={14}
                          className="text-white/60 group-hover:text-white transition-colors"
                        />
                        Substituir
                      </button>

                      <button
                        onClick={() => {
                          setMovingPlayers({
                            teamId: teams[showQueuePlayerModal.teamIndex].id,
                            playerIds: [showQueuePlayerModal.playerId],
                          });
                          setIsSelectingDestination(true);
                          setShowQueuePlayerModal(null);
                          setToast({
                            message:
                              "Selecione o time de destino (apenas times incompletos).",
                            type: "info",
                          });
                        }}
                        className="py-2.5 bg-white/5 border border-white/10 text-white rounded-xl font-bold uppercase text-[9px] tracking-wider flex flex-col items-center justify-center gap-1 transition-all hover:bg-white/10 active:scale-95 shadow-sm group cursor-pointer"
                      >
                        <MoveRight
                          size={14}
                          className="text-white/60 group-hover:text-white transition-colors"
                        />
                        Mover
                      </button>

                      <button
                        onClick={() => {
                          setTeams((prev) => {
                            return prev
                              .map((t) => ({
                                ...t,
                                playerIds: t.playerIds.filter(
                                  (id) => id !== showQueuePlayerModal.playerId,
                                ),
                              }))
                              .filter((t) => t.playerIds.length > 0);
                          });
                          setPlayers((prev) =>
                            prev.map((p) =>
                              p.id === showQueuePlayerModal.playerId
                                ? {
                                    ...p,
                                    isAvailable: false,
                                    arrivedAt: undefined,
                                  }
                                : p,
                            ),
                          );
                          setShowQueuePlayerModal(null);
                          setToast({
                            message: "Jogador movido para ausentes.",
                            type: "info",
                          });
                        }}
                        className="py-2.5 bg-red-500/5 border border-red-500/20 text-red-400 rounded-xl font-bold uppercase text-[9px] tracking-wider flex flex-col items-center justify-center gap-1 transition-all hover:bg-red-500/10 active:scale-95 shadow-sm group cursor-pointer"
                      >
                        <LogOut
                          size={14}
                          className="text-red-400 opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        Ausente
                      </button>

                      <button
                        onClick={() => setShowQueuePlayerModal(null)}
                        className="py-2.5 bg-white/5 border border-white/10 text-white rounded-xl font-bold uppercase text-[9px] tracking-wider flex flex-col items-center justify-center gap-1 transition-all hover:bg-white/10 active:scale-95 shadow-sm cursor-pointer"
                      >
                        <X size={14} className="text-white/60" />
                        Fechar
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center px-4">
                        Destino:
                      </div>
                      <div className="max-h-60 overflow-y-auto px-1 space-y-2 custom-scrollbar">
                        {teams.map((t, idx) => {
                          if (idx === showQueuePlayerModal.teamIndex)
                            return null;
                          return (
                            <button
                              key={`move-to-${t.id}`}
                              onClick={() => {
                                setTeams((prev) => {
                                  const newTeams = [...prev].map((team) => ({
                                    ...team,
                                    playerIds: [...team.playerIds],
                                  }));
                                  if (
                                    newTeams[showQueuePlayerModal.teamIndex]
                                  ) {
                                    newTeams[
                                      showQueuePlayerModal.teamIndex
                                    ].playerIds = newTeams[
                                      showQueuePlayerModal.teamIndex
                                    ].playerIds.filter(
                                      (id) =>
                                        id !== showQueuePlayerModal.playerId,
                                    );
                                  }
                                  if (newTeams[idx]) {
                                    newTeams[idx].playerIds.push(
                                      showQueuePlayerModal.playerId,
                                    );
                                  }
                                  return newTeams.filter(
                                    (team) => team.playerIds.length > 0,
                                  );
                                });
                                setShowQueuePlayerModal(null);
                                setToast({
                                  message: "Jogador movido com sucesso!",
                                  type: "success",
                                });
                              }}
                              className="w-full text-left px-5 py-4 text-xs font-black text-zinc-900 bg-zinc-50 hover:bg-brand-primary hover:text-black rounded-2xl transition-all border border-zinc-100 flex items-center justify-between group"
                            >
                              <span className="uppercase tracking-tight">
                                {t.name}
                              </span>
                              <ChevronRight
                                size={16}
                                className="opacity-30 group-hover:opacity-100 transition-opacity"
                              />
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={() =>
                          setShowQueuePlayerModal({
                            ...showQueuePlayerModal,
                            showMoveOptions: false,
                          })
                        }
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
              className="w-full max-w-[280px] p-5 rounded-[20px] bg-[#0b0e17]/95 border border-white/10 text-white backdrop-blur-xl shadow-2xl"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-sm relative overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-white/5 rounded-full blur-xl" />
                  <span className="text-white/80 relative z-10"><IoIosFootball size={24} /></span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black uppercase tracking-tight text-white leading-none">
                    Quem deu a assistência?
                  </h3>
                  <p className="text-[9px] font-medium leading-relaxed text-white/50 uppercase tracking-widest">
                    GOL DE{" "}
                    {
                      players.find((p) => p.id === showAssistSelection.scorerId)
                        ?.name
                    }
                  </p>
                </div>

                <div className="w-full grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                  <motion.button
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    onClick={() => {
                      const team =
                        showAssistSelection.teamIndex === match.teamAIndex
                          ? "A"
                          : "B";
                      registerGoal(team, showAssistSelection.scorerId);
                      setShowAssistSelection(null);
                    }}
                    className="w-full h-10 rounded-xl border border-white/10 transition-all text-center flex items-center justify-center bg-white/5 hover:bg-white/10 group shadow-sm shrink-0"
                  >
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/60 group-hover:text-white">
                      Sem Assistência
                    </span>
                  </motion.button>

                  <div className="h-4 flex items-center gap-2 shrink-0">
                    <div className="h-px flex-1 bg-white/5"></div>
                    <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">
                      Jogadores do Time
                    </span>
                    <div className="h-px flex-1 bg-white/5"></div>
                  </div>

                  {teams[showAssistSelection.teamIndex].playerIds
                    .filter((pid) => pid !== showAssistSelection.scorerId)
                    .map((pid, idx) => {
                      const player = players.find((p) => p.id === pid);
                      return (
                        <motion.button
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 + idx * 0.05 }}
                          key={`assist-choice-modal-${pid}`}
                          onClick={() => {
                            const team =
                              showAssistSelection.teamIndex === match.teamAIndex
                                ? "A"
                                : "B";
                            registerGoal(
                              team,
                              showAssistSelection.scorerId,
                              pid,
                            );
                            setShowAssistSelection(null);
                          }}
                          className="w-full p-2.5 rounded-xl border border-white/10 transition-all text-left group flex items-center gap-3 bg-white/5 hover:bg-white/10 shrink-0"
                        >
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden border border-white/5 bg-white/5 shrink-0 shadow-inner">
                            {player?.photo ? (
                              <img
                                src={player.photo}
                                alt={player.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-white/20">
                                  <IoPersonOutline size={14} />
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[7px] font-black text-white/30 uppercase tracking-widest mb-0.5">
                              Garçom
                            </div>
                            <div className="text-[10px] font-black uppercase truncate text-white/80 group-hover:text-white">
                              {player?.name}
                            </div>
                          </div>
                          <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white transition-all shrink-0">
                            <PiPlusBold size={10} />
                          </div>
                        </motion.button>
                      );
                    })}
                </div>

                <button
                  onClick={() => setShowAssistSelection(null)}
                  className="w-full py-3 mt-1 text-[9px] font-black uppercase tracking-widest transition-all bg-white/5 hover:bg-red-500/20 rounded-xl text-white/50 hover:text-red-400 border border-white/5 hover:border-red-500/30 text-center shadow-sm shrink-0"
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
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 text-brand-primary">
                Atenção!
              </h3>
              <p className="text-sm text-brand-text-secondary mb-8">
                Se você fechar esta janela, todas as partidas terão que ser
                criadas novamente. Deseja continuar?
              </p>
              <button
                onClick={() => {
                  setShowCloseWarningModal(false);
                  setCurrentScreen("teams");
                  setTeamsTab(match.isActive ? "historico" : "proximos");
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
                <h3 className="text-2xl font-black uppercase tracking-tighter">
                  Ajustes da Partida
                </h3>
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
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-text-secondary">
                    Confronto Atual
                  </h4>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
                    {teams.map((t, idx) => (
                      <div
                        key={`settings-team-select-${t.id}-${idx}`}
                        className={`p-[1px] rounded-md ${match.teamAIndex === idx || match.teamBIndex === idx ? "bg-team-gradient" : "bg-transparent"}`}
                      >
                        <motion.button
                          animate={
                            match.teamAIndex === idx || match.teamBIndex === idx
                              ? {
                                  scale: [1, 1.03, 1],
                                  y: [0, -2, 0],
                                }
                              : {}
                          }
                          onClick={() => {
                            if (match.teamAIndex === idx) {
                              setMatch((prev) => ({ ...prev, teamAIndex: -1 }));
                      } else if (match.teamBIndex === idx) {
                              setMatch((prev) => ({ ...prev, teamBIndex: -1 }));
                      } else if (match.teamAIndex === -1) {
                              setMatch((prev) => ({
                                ...prev,
                                teamAIndex: idx,
                              }));
                      } else if (match.teamBIndex === -1) {
                              setMatch((prev) => ({
                                ...prev,
                                teamBIndex: idx,
                              }));
                      } else {
                              setMatch((prev) => ({
                                ...prev,
                                teamBIndex: idx,
                              }));
                            }
                          }}
                          className={`w-full p-3 rounded-[15px] text-xs font-black transition-all flex flex-col items-center gap-1 relative ${
                            match.teamAIndex === idx || match.teamBIndex === idx
                              ? "bg-[#0D0D0D] border border-brand-primary text-white shadow-xl"
                              : "bg-[#0D0D0D] border border-white/5 text-white/60"
                          }`}
                        >
                          <div className="absolute top-2 left-2 z-10">
                            <div
                              className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all duration-500 ${
                                match.teamAIndex === idx ||
                                match.teamBIndex === idx
                                  ? "bg-brand-primary border-[#0D0D0D]"
                                  : "bg-black/5 border-black/20"
                              }`}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${
                                  match.teamAIndex === idx ||
                                  match.teamBIndex === idx
                                    ? "bg-[#0D0D0D]"
                                    : "bg-black/10"
                                }`}
                              />
                            </div>
                          </div>
                          <span className="truncate w-full text-center">
                            {t.name}
                          </span>
                          <div className="flex flex-wrap justify-center gap-0.5 mt-1">
                            {t.playerIds.slice(0, 3).map((pid, pidx) => (
                              <span
                                key={`settings-team-player-badge-${t.id}-${pid}-${pidx}`}
                                className="text-[6px] opacity-60 bg-black/5 px-1 rounded-sm"
                              >
                                {
                                  players
                                    .find((p) => p.id === pid)
                                    ?.name.split(" ")[0]
                                }
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
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-text-secondary">
                    Gerenciar Times e Jogadores
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <AnimatePresence mode="popLayout">
                    {teams.map((team, tIdx) => (
                      <motion.div
                        key={`settings-team-manage-${team.id}-${tIdx}`}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                          className={`p-4 rounded-lg border bg-brand-dark/50 transition-all duration-300 ${
                            tIdx === match.teamAIndex ||
                            tIdx === match.teamBIndex
                              ? "border-brand-primary shadow-[0_0_15px_rgba(198,255,0,0.15)]"
                              : "border-white/5"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setShowIconPicker(tIdx)}
                                className="w-8 h-8 rounded-lg bg-black/10 flex items-center justify-center hover:bg-black/20 transition-all active:scale-95 border border-black/5"
                                style={{ color: team.color }}
                              >
                                {(() => {
                                  const Icon =
                                    TEAM_ICONS[
                                      team.iconIdx ?? tIdx % TEAM_ICONS.length
                                    ];
                                  return <Icon size={18} />;
                                })()}
                              </button>
                              <span className="text-sm font-black uppercase tracking-widest text-[#0D0D0D]">
                                {team.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-sm border border-white/10">
                                <button
                                  onClick={() => moveTeam(tIdx, "up")}
                                  disabled={tIdx === 0}
                                  className="p-1.5 text-[#0D0D0D] hover:text-brand-primary disabled:opacity-20 transition-colors"
                                >
                                  <ChevronRight
                                    size={18}
                                    className="-rotate-90"
                                    strokeWidth={3}
                                  />
                                </button>
                                <div className="w-[1px] h-4 bg-black/10 mx-0.5" />
                                <button
                                  onClick={() => moveTeam(tIdx, "down")}
                                  disabled={tIdx === teams.length - 1}
                                  className="p-1.5 text-[#0D0D0D] hover:text-brand-primary disabled:opacity-20 transition-colors"
                                >
                                  <ChevronRight
                                    size={18}
                                    className="rotate-90"
                                    strokeWidth={3}
                                  />
                                </button>
                              </div>
                              <button
                                onClick={() => setShowQuickAddPlayerModal(tIdx)}
                                className="flex items-center gap-1 px-2 py-1 bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/30 rounded-lg transition-all group ml-2"
                              >
                                <UserPlus
                                  size={10}
                                  className="text-brand-primary group-hover:scale-110 transition-transform"
                                />
                                <span className="text-[8px] font-black uppercase text-brand-primary tracking-widest">
                                  Adicionar ou Criar
                                </span>
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {[...team.playerIds]
                              .sort((a, b) => {
                                const pA = players.find((p) => p.id === a);
                                const pB = players.find((p) => p.id === b);
                                if (pA?.isGoalkeeper && !pB?.isGoalkeeper)
                                  return -1;
                                if (!pA?.isGoalkeeper && pB?.isGoalkeeper)
                                  return 1;
                                return (
                                  (pA?.arrivedAt || 0) - (pB?.arrivedAt || 0)
                                );
                              })
                              .map((pid, idx) => {
                                const player = players.find(
                                  (p) => p.id === pid,
                                );
                                if (!player) return null;
                                return (
                                  <div
                                    key={`settings-player-item-${team.id}-${pid}-${idx}`}
                                    className={`flex items-center justify-between p-2 rounded-md bg-brand-card/50`}
                                  >
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                      {editingPlayerId === pid ? (
                                        <input
                                          autoFocus
                                          defaultValue={player.name}
                                          className="bg-transparent border-b border-brand-primary outline-none text-xs font-bold py-0.5 w-full"
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter")
                                              updatePlayerName(
                                                pid,
                                                e.currentTarget.value,
                                              );
                                            if (e.key === "Escape")
                                              setEditingPlayerId(null);
                                          }}
                                          onBlur={(e) =>
                                            updatePlayerName(
                                              pid,
                                              e.target.value,
                                            )
                                          }
                                        />
                                      ) : (
                                        <span className="text-xs font-bold truncate text-[#0D0D0D]">
                                          {player.name}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      {swappingPlayerId === pid ? (
                                        <div className="flex items-center gap-1 bg-brand-primary/20 p-1 rounded-sm border border-brand-primary/30">
                                          <button
                                            onClick={() =>
                                              setSwappingPlayerId(null)
                                            }
                                            className="p-1 text-xs font-bold text-[#0D0D0D] hover:text-brand-primary"
                                          >
                                            Cancelar
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() =>
                                            setSwappingPlayerId(pid)
                                          }
                                          className="p-1.5 text-brand-text-secondary hover:text-brand-primary flex items-center gap-1"
                                        >
                                          <RefreshCw
                                            size={12}
                                            className={
                                              swappingPlayerId
                                                ? "animate-spin"
                                                : ""
                                            }
                                          />
                                          <span className="text-[8px] font-black uppercase">
                                            Sub
                                          </span>
                                        </button>
                                      )}

                                      {swappingPlayerId &&
                                        swappingPlayerId !== pid && (
                                          <button
                                            onClick={() => {
                                              const playerAId =
                                                swappingPlayerId;
                                              const playerBId = pid;

                                              handleGoalkeeperSwap(
                                                playerAId,
                                                playerBId,
                                              );
                                              setTeams((prev) => {
                                                const newTeams = prev.map(
                                                  (t) => ({
                                                    ...t,
                                                    playerIds: [...t.playerIds],
                                                  }),
                                                );
                                                let teamAIdx = -1;
                                                let teamBIdx = -1;

                                                newTeams.forEach(
                                                  (team, idx) => {
                                                    if (
                                                      team.playerIds.includes(
                                                        playerAId,
                                                      )
                                                    )
                                                      teamAIdx = idx;
                                                    if (
                                                      team.playerIds.includes(
                                                        playerBId,
                                                      )
                                                    )
                                                      teamBIdx = idx;
                                                  },
                                                );

                                                if (
                                                  teamAIdx !== -1 &&
                                                  teamBIdx !== -1
                                                ) {
                                                  if (teamAIdx === teamBIdx) {
                                                    newTeams[
                                                      teamAIdx
                                                    ].playerIds = newTeams[
                                                      teamAIdx
                                                    ].playerIds.map((id) => {
                                                      if (id === playerAId)
                                                        return playerBId;
                                                      if (id === playerBId)
                                                        return playerAId;
                                                      return id;
                                                    });
                                            } else {
                                                    newTeams[
                                                      teamAIdx
                                                    ].playerIds = newTeams[
                                                      teamAIdx
                                                    ].playerIds.map((id) =>
                                                      id === playerAId
                                                        ? playerBId
                                                        : id,
                                                    );
                                                    newTeams[
                                                      teamBIdx
                                                    ].playerIds = newTeams[
                                                      teamBIdx
                                                    ].playerIds.map((id) =>
                                                      id === playerBId
                                                        ? playerAId
                                                        : id,
                                                    );
                                                  }
                                                }

                                                return newTeams;
                                              });
                                              setSwappingPlayerId(null);
                                            }}
                                            className="p-1.5 bg-brand-primary text-[#0D0D0D] rounded-sm text-[8px] font-black uppercase"
                                          >
                                            Trocar
                                          </button>
                                        )}

                                      <button
                                        onClick={() => {
                                          setTeams((prev) => {
                                            const newTeams = prev.map((t) => ({
                                              ...t,
                                              playerIds: [...t.playerIds],
                                            }));
                                            newTeams[tIdx].playerIds = newTeams[
                                              tIdx
                                            ].playerIds.filter(
                                              (id) => id !== pid,
                                            );
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
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-text-secondary">
                    Banco de Reservas
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {players.filter(
                      (p) =>
                        p.isAvailable &&
                        !teams.some((t) => t.playerIds.includes(p.id)),
                    ).length === 0 ? (
                      <p className="text-[10px] text-brand-text-secondary italic opacity-50">
                        Nenhum reserva disponível
                      </p>
                    ) : (
                      players
                        .filter(
                          (p) =>
                            p.isAvailable &&
                            !teams.some((t) => t.playerIds.includes(p.id)),
                        )
                        .map((player, pIndex) => (
                          <div
                            key={`quick-add-player-${player.id}-${pIndex}`}
                            className="flex items-center justify-between p-2 rounded-md bg-brand-dark/30 border border-white/5"
                          >
                            <span className="text-xs font-bold truncate text-[#0D0D0D]">
                              {player.name}
                            </span>
                            <div className="flex items-center gap-1">
                              {swappingPlayerId && (
                                <button
                                  onClick={() => {
                                    const playerInTeamId = swappingPlayerId;
                                    const playerFromBenchId = player.id;

                                    const targetTeamIdx = teams.findIndex((t) =>
                                      t.playerIds.includes(playerInTeamId),
                                    );
                                    if (targetTeamIdx !== -1) {
                                      scrollToTeam(targetTeamIdx);
                                    }

                                    handleGoalkeeperSwap(
                                      playerInTeamId,
                                      playerFromBenchId,
                                    );
                                    setTeams((prev) => {
                                      const newTeams = prev.map((t) => ({
                                        ...t,
                                        playerIds: [...t.playerIds],
                                      }));
                                      const teamIdx = newTeams.findIndex((t) =>
                                        t.playerIds.includes(playerInTeamId),
                                      );

                                      if (teamIdx !== -1) {
                                        newTeams[teamIdx].playerIds = newTeams[
                                          teamIdx
                                        ].playerIds.map((id) =>
                                          id === playerInTeamId
                                            ? playerFromBenchId
                                            : id,
                                        );
                                      }
                                      return newTeams;
                                    });
                                    setSwappingPlayerId(null);
                                  }}
                                  className="px-3 py-1 bg-brand-primary text-[#0D0D0D] rounded-sm text-[8px] font-black uppercase"
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
                  if (
                    match.hasEnded ||
                    match.timeRemaining === 0 ||
                    match.scoreA >= match.config.goalLimit ||
                    match.scoreB >= match.config.goalLimit
                  ) {
                    setMatch((prev) => ({
                      ...prev,
                      scoreA: 0,
                      scoreB: 0,
                      timeRemaining: prev.config.duration * 60,
                      events: [],
                      hasEnded: false,
                      isPaused: true,
                      isActive: true,
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
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-black uppercase tracking-tighter text-center">
                Configuração
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => {
                    setShowConfigMenu(false);
                    setShowTimeEditModal(true);
                  }}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all bg-brand-dark hover:bg-brand-primary/20`}
                >
                  <Timer size={20} className="text-brand-primary" />
                  <span>Tempo da Partida</span>
                </button>
                <button
                  onClick={() => {
                    setShowConfigMenu(false);
                    setShowMatchSettingsModal(true);
                  }}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all bg-brand-dark hover:bg-brand-primary/20`}
                >
                  <motion.div
                    animate={{ rotate: [0, 180, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 8.5,
                      ease: "easeInOut",
                    }}
                  >
                    <Settings size={20} className="text-zinc-500" />
                  </motion.div>
                  <span>Ajuste de Partida</span>
                </button>
              </div>
              <button
                onClick={() => setShowConfigMenu(false)}
                className={`w-full py-4 rounded-xl font-bold glass-3d bg-brand-dark text-brand-text-secondary`}
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

              <h3 className="text-2xl font-black uppercase tracking-tighter">
                Tempo da Partida
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-brand-text-secondary">
                    Duração (Minutos)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={
                      match.config.duration === 0 ? "" : match.config.duration
                    }
                    onChange={(e) => {
                      const val =
                        e.target.value === "" ? 0 : parseInt(e.target.value);
                      if (!isNaN(val)) {
                        setMatch((prev) => ({
                          ...prev,
                          config: { ...prev.config, duration: val },
                          timeRemaining: val * 60,
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

        {showIconPicker !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
            onClick={() => setShowIconPicker(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className={`w-full max-w-sm p-6 rounded-lg bg-brand-card space-y-6`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-black uppercase tracking-tighter text-center">
                Escolher Escudo
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {TEAM_ICONS.map((Icon, idx) => (
                  <button
                    key={`team-icon-${idx}`}
                    onClick={() => {
                      const newTeams = [...teams];
                      newTeams[showIconPicker].iconIdx = idx;
                      setTeams(newTeams);
                      setShowIconPicker(null);
                    }}
                    className={`flex items-center justify-center p-3 rounded-lg transition-all hover:scale-110 active:scale-90 bg-brand-dark hover:bg-brand-primary/20`}
                  >
                    <Icon size={24} color={teams[showIconPicker]?.color} />
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowIconPicker(null)}
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
              <h3 className="text-2xl font-black uppercase tracking-tighter">
                Times Incompletos
              </h3>
              <p className={`text-sm text-brand-text-secondary`}>
                Para iniciar uma partida, você precisa ter pelo menos 2 times
                com jogadores escalados.
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
              <h3 className="text-2xl font-black uppercase tracking-tighter">
                Como deseja formar?
              </h3>
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
                    setCurrentScreen("teams");
                    setTeamsTab(match.isActive ? "historico" : "proximos");
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              className="w-full max-w-[280px] rounded-[24px] overflow-hidden shadow-2xl bg-[#0b0e17]/95 border border-white/10 text-white backdrop-blur-xl relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-white/5 p-6 text-center relative overflow-hidden border-b border-white/5 flex flex-col items-center">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#34d399]/5 rounded-full -mr-8 -mt-8 blur-xl" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8 blur-lg" />

                <button
                  onClick={() => setShowStartMatchConfirm(false)}
                  className="absolute top-4 right-4 p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/60 hover:text-white transition-all cursor-pointer"
                >
                  <X size={14} />
                </button>

                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 shadow-lg text-[#34d399] flex items-center justify-center mx-auto mb-2 relative z-10">
                  <IoFootballOutline size={24} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white leading-none relative z-10">
                  Partida em Andamento
                </h3>
                <p className="text-[8px] text-white/50 font-black mt-1.5 uppercase tracking-[0.2em] relative z-10">
                  O que deseja fazer?
                </p>
              </div>

              <div className="p-4 space-y-3">
                <button
                  onClick={() => {
                    setShowStartMatchConfirm(false);
                    setTeamsTab("historico");
                  }}
                  className="w-full h-10 bg-[#34d399] hover:bg-[#34d399]/90 text-[#1e3d2f] font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg shadow-[#34d399]/10 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <PiPlay size={14} />
                  Continuar Partida
                </button>

                <button
                  onClick={() => {
                    setShowStartMatchConfirm(false);
                    if (
                      match.teamAIndex !== -1 &&
                      match.teamBIndex !== -1 &&
                      teams[match.teamAIndex]?.playerIds?.length ===
                        match.config.playersPerTeam &&
                      teams[match.teamBIndex]?.playerIds?.length ===
                        match.config.playersPerTeam
                    ) {
                      startNextMatch(match.teamAIndex, match.teamBIndex);
                    }
                  }}
                  className="w-full h-10 rounded-xl font-bold uppercase tracking-widest text-[9px] transition-all bg-white/5 border border-white/10 text-white hover:bg-white/10 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="text-[#34d399] flex items-center justify-center">
                    <PiArrowClockwiseBold size={14} />
                  </span>
                  Nova Partida
                </button>

                <button
                  onClick={() => setShowStartMatchConfirm(false)}
                  className="w-full h-8 text-white/60 text-[9px] font-black uppercase tracking-widest hover:text-white transition-colors"
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
              <h3 className="text-2xl font-black uppercase tracking-tighter">
                Sortear Jogadores
              </h3>
              <p className="text-xs text-brand-text-secondary uppercase font-bold tracking-widest">
                Quantos jogadores por time?
              </p>

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
                    const val = parseInt(
                      (
                        document.getElementById(
                          "players-per-team-input",
                        ) as HTMLInputElement
                      ).value,
                    );
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
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`w-full max-w-lg p-8 rounded-t-2xl bg-brand-card max-h-[80vh] overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-brand-dark rounded-full mx-auto mb-6" />

              {currentScreen === "teams" ? (
                <>
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-6">
                    Adicionar ao{" "}
                    {teams[showEventModal.team as any]?.name || "Time"}
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {players
                      .filter(
                        (p) =>
                          p.isAvailable &&
                          !teams.some((t) => t.playerIds.includes(p.id)),
                      )
                      .map((player, pIndex) => (
                        <button
                          key={`event-scorer-list-${player.id}-${pIndex}`}
                          onClick={() => {
                            const teamIdx = showEventModal.team as any;
                            const currentTeam = teams[teamIdx];

                            if (
                              currentTeam.playerIds.length >=
                              match.config.playersPerTeam
                            ) {
                              // Team is full, create new team
                              const nextLetter = String.fromCharCode(
                                65 + teams.length,
                              );
                              const iconIdx = getNextTeamIconIdx(teams);
                              const newTeam: Team = {
                                id: generateId(),
                                name: `Time ${nextLetter}`,
                                playerIds: [player.id],
                                iconIdx,
                                color: getNextTeamColor(teams),
                              };

                              setTeams([...teams, newTeam]);
                              setToast({
                                message: `O ${currentTeam.name} já está lotado. Criamos o ${newTeam.name} para este jogador.`,
                                type: "warning",
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
                    {players.filter(
                      (p) =>
                        p.isAvailable &&
                        !teams.some((t) => t.playerIds.includes(p.id)),
                    ).length === 0 && (
                      <div className="text-center py-8 opacity-50">
                        Todos os jogadores já estão em times.
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {!selectedScorerId ? (
                    <>
                      <h3 className="text-xl font-black uppercase tracking-tighter mb-6">
                        Quem marcou o gol?
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        {(showEventModal.team === "A"
                          ? teams[match.teamAIndex]?.playerIds || []
                          : teams[match.teamBIndex]?.playerIds || []
                        ).map((pid) => {
                          const player = players.find((p) => p.id === pid);
                          return player ? (
                            <button
                              key={`event-scorer-select-${showEventModal.team}-${pid}`}
                              onClick={() => setSelectedScorerId(pid)}
                              className={`w-full p-4 rounded-lg text-left font-bold transition-all flex justify-between items-center glass-3d bg-brand-dark`}
                            >
                              <span>{player.name}</span>
                              <ChevronRight
                                size={18}
                                className="text-brand-text-secondary"
                              />
                            </button>
                          ) : null;
                        })}
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-black uppercase tracking-tighter mb-2 text-brand-primary">
                        Assistência?
                      </h3>
                      <p className="text-xs text-brand-text-secondary mb-6 uppercase font-bold tracking-widest">
                        GOL DE:{" "}
                        {players.find((p) => p.id === selectedScorerId)?.name}
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        <button
                          onClick={() =>
                            registerGoal(showEventModal.team, selectedScorerId)
                          }
                          className={`w-full p-4 rounded-lg text-left font-bold transition-all border-2 border-dashed border-white/10 glass-3d hover:bg-brand-dark`}
                        >
                          Sem Assistência
                        </button>
                        {(showEventModal.team === "A"
                          ? teams[match.teamAIndex]?.playerIds || []
                          : teams[match.teamBIndex]?.playerIds || []
                        )
                          .filter((id) => id !== selectedScorerId)
                          .map((aid) => {
                            const assistPlayer = players.find(
                              (p) => p.id === aid,
                            );
                            return (
                              <button
                                key={`event-assist-select-${showEventModal.team}-${aid}`}
                                onClick={() =>
                                  registerGoal(
                                    showEventModal.team,
                                    selectedScorerId,
                                    aid,
                                  )
                                }
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
              <h3 className="text-xl font-black text-center uppercase tracking-tighter">
                Nome Duplicado
              </h3>
              <p className="text-center text-brand-text-secondary text-sm">
                Já existe um jogador com o nome{" "}
                <strong className="text-black">
                  "{duplicatePlayerName.name}"
                </strong>
                . Por favor, altere o nome para continuar.
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
                    if (e.key === "Enter") {
                      const newName = e.currentTarget.value.trim();
                      if (
                        newName &&
                        newName.toLowerCase() !==
                          duplicatePlayerName.name.toLowerCase()
                      ) {
                        duplicatePlayerName.callback(newName);
                        setDuplicatePlayerName(null);
                } else {
                        setToast({
                          message: "Por favor, escolha um nome diferente.",
                          type: "warning",
                        });
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
                      const input = document.getElementById(
                        "new-duplicate-name",
                      ) as HTMLInputElement;
                      const newName = input.value.trim();
                      if (
                        newName &&
                        newName.toLowerCase() !==
                          duplicatePlayerName.name.toLowerCase()
                      ) {
                        duplicatePlayerName.callback(newName);
                        setDuplicatePlayerName(null);
                } else {
                        setToast({
                          message: "Por favor, escolha um nome diferente.",
                          type: "warning",
                        });
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

              <h3 className="text-2xl font-black uppercase tracking-tighter">
                Adicionar Jogador
              </h3>
              <p className="text-xs text-brand-text-secondary uppercase font-bold tracking-widest">
                Adicionar ao {teams[showQuickAddPlayerModal].name}
              </p>

              <div className="space-y-6">
                {/* Existing Players List */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">
                    Jogadores Disponíveis
                  </p>
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {players.filter(
                      (p) =>
                        p.isAvailable &&
                        !teams.flatMap((t) => t.playerIds).includes(p.id),
                    ).length === 0 ? (
                      <div className="py-4 text-center border border-dashed border-white/10 rounded-lg opacity-40">
                        <p className="text-xs font-bold normal-case">
                          Nenhum jogador livre
                        </p>
                      </div>
                    ) : (
                      players
                        .filter(
                          (p) =>
                            p.isAvailable &&
                            !teams.flatMap((t) => t.playerIds).includes(p.id),
                        )
                        .map((p, pIndex) => (
                          <button
                            key={`randomize-player-list-${p.id}-${pIndex}`}
                            onClick={() =>
                              addPlayerToTeam(p.id, showQuickAddPlayerModal)
                            }
                            className="w-full p-3 flex items-center justify-between rounded-lg bg-brand-dark border border-white/5 hover:border-brand-primary/50 transition-all group"
                          >
                            <span className="text-sm font-bold text-[#0D0D0D]">
                              {p.name}
                            </span>
                            <Plus
                              size={14}
                              className="text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity"
                            />
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
                    <span className="bg-brand-card px-2 text-[8px] font-black text-brand-text-secondary uppercase tracking-widest">
                      Ou crie um novo
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nome do novo jogador..."
                    id="quick-player-name"
                    className={`w-full p-4 rounded-lg outline-none font-bold bg-brand-dark border border-white/5 focus:border-brand-primary/30 transition-all`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        quickAddPlayer(
                          e.currentTarget.value,
                          showQuickAddPlayerModal,
                        );
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById(
                        "quick-player-name",
                      ) as HTMLInputElement;
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
              <h3 className="text-lg font-black uppercase tracking-tighter mb-4 text-orange-500">
                Atenção!
              </h3>
              <p className="text-sm text-brand-text-secondary mb-8 leading-relaxed">
                Se você fechar esta janela, todas as partidas terão que ser
                criadas novamente. Deseja continuar?
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
                    setCurrentScreen("scoreboard");
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
              <p className="text-xs text-brand-text-secondary mb-6 text-center">
                O time vencedor teve um jogador removido. Escolha um jogador de
                outro time para substituí-lo:
              </p>

              <div className="w-full max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar mb-6">
                {teams.map(
                  (t, tIdx) =>
                    tIdx !== (replacingPlayer?.teamIndex ?? -1) && (
                      <div
                        key={`summary-team-select-${t.id}-${tIdx}`}
                        className="space-y-1"
                      >
                        <p className="text-[8px] font-black uppercase tracking-widest text-brand-text-secondary ml-2">
                          {t.name}
                        </p>
                        {[...t.playerIds]
                          .sort((a, b) => {
                            const pA = players.find((p) => p.id === a);
                            const pB = players.find((p) => p.id === b);
                            if (pA?.isGoalkeeper && !pB?.isGoalkeeper)
                              return -1;
                            if (!pA?.isGoalkeeper && pB?.isGoalkeeper) return 1;
                            return (pA?.arrivedAt || 0) - (pB?.arrivedAt || 0);
                          })
                          .map((pid, idx) => (
                            <button
                              key={`summary-player-replace-${t.id}-${pid}-${idx}`}
                              onClick={() => {
                                scrollToTeam(replacingPlayer.teamIndex);
                                handleGoalkeeperSwap(
                                  replacingPlayer.removedPlayerId,
                                  pid,
                                );
                                setTeams((prev) => {
                                  const newTeams = prev.map((team) => ({
                                    ...team,
                                    playerIds: [...team.playerIds],
                                  }));
                                  // Remove from source team
                                  newTeams[tIdx].playerIds = newTeams[
                                    tIdx
                                  ].playerIds.filter((id) => id !== pid);
                                  // Replace in target team
                                  newTeams[
                                    replacingPlayer.teamIndex
                                  ].playerIds = newTeams[
                                    replacingPlayer.teamIndex
                                  ].playerIds.map((id) =>
                                    id === replacingPlayer.removedPlayerId
                                      ? pid
                                      : id,
                                  );
                                  return newTeams.filter(
                                    (team) => team.playerIds.length > 0,
                                  );
                                });
                                setPlayerEvents((prev) => ({
                                  ...prev,
                                  [pid]: {
                                    type: "swap",
                                    timestamp: Date.now(),
                                  },
                                }));
                                setReplacingPlayer(null);
                              }}
                              className="w-full p-3 flex items-center justify-between rounded-md bg-brand-dark border border-white/5 hover:border-brand-primary/50 transition-all group"
                            >
                              <span className="text-sm font-bold text-[#0D0D0D]">
                                {players.find((p) => p.id === pid)?.name}
                              </span>
                              <Plus
                                size={14}
                                className="text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity"
                              />
                            </button>
                          ))}
                      </div>
                    ),
                )}
              </div>

              <button
                onClick={() => {
                  // If cancelled, just remove the player without replacement
                  setTeams((prev) => {
                    const newTeams = prev.map((team) => ({
                      ...team,
                      playerIds: [...team.playerIds],
                    }));
                    newTeams[replacingPlayer.teamIndex].playerIds = newTeams[
                      replacingPlayer.teamIndex
                    ].playerIds.filter(
                      (id) => id !== replacingPlayer.removedPlayerId,
                    );
                    return newTeams.filter((team) => team.playerIds.length > 0);
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
          currentColor={showColorPicker?.color || ""}
          teamName={
            showColorPicker
              ? showColorPicker.teamIdx === -1
                ? "Time A (Fixo)"
                : showColorPicker.teamIdx === -2
                  ? "Time B (Fixo)"
                  : teams[showColorPicker.teamIdx]?.name || ""
              : ""
          }
          isFixed={fixedColors.enabled}
          onToggleFixed={(enabled) => {
            setFixedColors((prev) => {
              if (enabled && showColorPicker) {
                const idx = showColorPicker.teamIdx;
                const isTeamA = idx === -1 || idx === match.teamAIndex;
                return {
                  ...prev,
                  enabled,
                  teamA: isTeamA
                    ? showColorPicker.color
                    : prev.teamA ||
                      teams[match.teamAIndex]?.color ||
                      TEAM_COLORS[0],
                  teamB: !isTeamA
                    ? showColorPicker.color
                    : prev.teamB ||
                      teams[match.teamBIndex]?.color ||
                      TEAM_COLORS[1],
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
            const iconIdx = SHIRT_COLORS.indexOf(color);

            if (idx === -1) {
              setFixedColors((prev) => ({ ...prev, teamA: color }));
              if (match.teamAIndex !== -1) {
                setTeams((prev) =>
                  prev.map((t, i) => (i === match.teamAIndex ? { ...t, color, iconIdx } : t)),
                );
              }
            } else if (idx === -2) {
              setFixedColors((prev) => ({ ...prev, teamB: color }));
              if (match.teamBIndex !== -1) {
                setTeams((prev) =>
                  prev.map((t, i) => (i === match.teamBIndex ? { ...t, color, iconIdx } : t)),
                );
              }
            } else if (fixedColors.enabled) {
              setFixedColors((prev) => ({
                ...prev,
                teamA: isTeamA ? color : prev.teamA,
                teamB: isTeamB ? color : prev.teamB,
              }));
              // Also update specific team
              setTeams((prev) =>
                prev.map((t, i) => (i === idx ? { ...t, color, iconIdx } : t)),
              );
      } else {
              setTeams((prev) => {
                const newTeams = [...prev];
                if (newTeams[idx]) {
                  newTeams[idx].color = color;
                  newTeams[idx].iconIdx = iconIdx;
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
          teamPlayers={
            pendingAssist
              ? pendingAssist.team === "A"
                ? match.teamAIndex !== -1
                  ? teams[match.teamAIndex]?.playerIds || []
                  : []
                : match.teamBIndex !== -1
                  ? teams[match.teamBIndex]?.playerIds || []
                  : []
              : []
          }
          goalPlayerId={pendingAssist?.goalPlayerId || ""}
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
          teamPlayers={
            scorerTeam
              ? scorerTeam === "A"
                ? match.teamAIndex !== -1
                  ? teams[match.teamAIndex]?.playerIds || []
                  : []
                : match.teamBIndex !== -1
                  ? teams[match.teamBIndex]?.playerIds || []
                  : []
              : []
          }
          players={players}
          teamName={
            scorerTeam
              ? scorerTeam === "A"
                ? match.teamAIndex !== -1
                  ? teams[match.teamAIndex]?.name
                  : "Time A"
                : match.teamBIndex !== -1
                  ? teams[match.teamBIndex]?.name
                  : "Time B"
              : ""
          }
        />

        <PlayerManagementModalComponent
          player={
            playerManagementModal
              ? players.find((p) => p.id === playerManagementModal.id) ||
                playerManagementModal
              : null
          }
          isOpen={!!playerManagementModal}
          onClose={() => setPlayerManagementModal(null)}
          onUpdateName={updatePlayerName}
          onUpdatePhoto={updatePlayerPhoto}
          onUpdateStars={updatePlayerStars}
          onRemove={removePlayer}
        />

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, y: 50, scale: 0 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95, y: 2 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              onClick={() => {
                if (mainRef.current) {
                  mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="fixed bottom-36 right-5 z-[110] w-14 h-14 bg-emerald-500 text-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-black/5 flex items-center justify-center cursor-pointer transition-colors hover:bg-emerald-600 hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)]"
            >
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <ArrowUp size={28} color="white" />
              </motion.div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Bottom Navigation */}
        {!(currentScreen === "players" && !showAddPlayerSection) && (
          <div
            className={`fixed bottom-0 left-0 right-0 z-[100] w-full ${isPrintMode ? "hidden" : ""}`}
          >
            <nav className="w-full bg-[#111111] border-t border-white/5 pt-1 pb-3 sm:pb-4 px-2 sm:px-6 flex items-center justify-around">
              <button
                onClick={() => {
                  const screens: Screen[] = [
                    "players",
                    "teams",
                    "ranking",
                    "finance",
                  ];
                  const targetIndex = screens.indexOf("players");
                  const currentIndex = screens.indexOf(currentScreen);
                  setSwipeDirection(targetIndex > currentIndex ? -1 : 1);
                  setCurrentScreen("players");
                }}
                className={`flex-1 flex flex-col items-center justify-center py-2 transition-all duration-300 rounded-none relative overflow-hidden ${
                  currentScreen === "players"
                    ? "text-brand-primary bg-white/5 shadow-inner"
                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                {currentScreen === "players" && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute -top-4 w-12 h-4 bg-brand-primary opacity-30 blur-xl rounded-full"
                  />
                )}
                {currentScreen === "players" ? (
                  <div className="mb-1 transition-transform duration-300 -translate-y-0.5">
                    <PiUserCirclePlusThin size={28} />
                  </div>
                ) : (
                  <div className="mb-1 transition-transform duration-300">
                    <PiUserCirclePlusThin size={24} />
                  </div>
                )}
                <span
                  className={`text-[11px] leading-none transition-all duration-300 font-roboto-flex ${currentScreen === "players" ? "opacity-100 translate-y-0" : "opacity-70"}`}
                >
                  Cadastrar
                </span>
              </button>
              <button
                onClick={() => {
                  const screens: Screen[] = [
                    "players",
                    "teams",
                    "ranking",
                    "finance",
                  ];
                  const targetIndex = screens.indexOf("teams");
                  const currentIndex = screens.indexOf(currentScreen);
                  setSwipeDirection(targetIndex > currentIndex ? -1 : 1);
                  setCurrentScreen("teams");
                  // Reset PARTIDA tabs
                  setTeamsTab("historico");
                  setPlayersTab("configuracao");
                }}
                className={`flex-1 flex flex-col items-center justify-center py-2 transition-all duration-300 rounded-none relative overflow-hidden ${
                  currentScreen === "teams"
                    ? "text-brand-primary bg-white/5 shadow-inner"
                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                {currentScreen === "teams" && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute -top-4 w-12 h-4 bg-brand-primary opacity-30 blur-xl rounded-full"
                  />
                )}
                {currentScreen === "teams" ? (
                  <div className="mb-1 transition-transform duration-300 -translate-y-0.5 text-brand-primary">
                    <GiSoccerField size={26} />
                  </div>
                ) : (
                  <div className="mb-1 transition-transform duration-300">
                    <GiSoccerField size={22} />
                  </div>
                )}
                <span
                  className={`text-[11px] leading-none transition-all duration-300 font-roboto-flex ${currentScreen === "teams" ? "opacity-100 translate-y-0" : "opacity-70"}`}
                >
                  Partida
                </span>
              </button>
              <button
                onClick={() => {
                  const screens: Screen[] = [
                    "players",
                    "teams",
                    "ranking",
                    "finance",
                  ];
                  const targetIndex = screens.indexOf("ranking");
                  const currentIndex = screens.indexOf(currentScreen);
                  setSwipeDirection(targetIndex > currentIndex ? -1 : 1);
                  setCurrentScreen("ranking");
                }}
                className={`flex-1 flex flex-col items-center justify-center py-2 transition-all duration-300 rounded-none relative overflow-hidden ${
                  currentScreen === "ranking"
                    ? "text-brand-primary bg-white/5 shadow-inner"
                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                {currentScreen === "ranking" && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute -top-4 w-12 h-4 bg-brand-primary opacity-30 blur-xl rounded-full"
                  />
                )}
                {currentScreen === "ranking" ? (
                  <div className="mb-1 transition-transform duration-300 -translate-y-0.5">
                    <GiTrophy size={26} />
                  </div>
                ) : (
                  <div className="mb-1 transition-transform duration-300">
                    <GiTrophy size={22} />
                  </div>
                )}
                <span
                  className={`text-[11px] leading-none transition-all duration-300 font-roboto-flex ${currentScreen === "ranking" ? "opacity-100 translate-y-0" : "opacity-70"}`}
                >
                  Ranking
                </span>
              </button>
              <button
                onClick={() => {
                  const screens: Screen[] = [
                    "players",
                    "teams",
                    "ranking",
                    "finance",
                  ];
                  const targetIndex = screens.indexOf("finance");
                  const currentIndex = screens.indexOf(currentScreen);
                  setSwipeDirection(targetIndex > currentIndex ? -1 : 1);
                  setCurrentScreen("finance");
                  setFinanceSubScreen("balanco");
                }}
                className={`flex-1 flex flex-col items-center justify-center py-2 transition-all duration-300 rounded-none relative overflow-hidden ${
                  currentScreen === "finance"
                    ? "text-brand-primary bg-white/5 shadow-inner"
                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                {currentScreen === "finance" && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute -top-4 w-12 h-4 bg-brand-primary opacity-30 blur-xl rounded-full"
                  />
                )}
                {currentScreen === "finance" ? (
                  <div className="mb-1 transition-transform duration-300 -translate-y-0.5 text-brand-primary">
                    <IoIosWallet size={26} />
                  </div>
                ) : (
                  <div className="mb-1 transition-transform duration-300">
                    <IoIosWallet size={22} />
                  </div>
                )}
                <span
                  className={`text-[11px] leading-none transition-all duration-300 font-roboto-flex ${currentScreen === "finance" ? "opacity-100 translate-y-0" : "opacity-70"}`}
                >
                  Financeiro
                </span>
              </button>
            </nav>
          </div>
        )}

        {/* Auto Complete Confirmation Modal */}
        {showAutoCompleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4"
            onClick={() => setShowAutoCompleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              className="w-full max-w-[320px] rounded-[32px] overflow-hidden shadow-2xl bg-[#eff5e8] border border-black/5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <CiSaveUp1 size={36} color="black" />
                </div>
                <h2 className="text-sm font-normal text-center mb-2 uppercase tracking-widest text-black">
                  Subida Automática
                </h2>
                <p className="text-center text-black/60 mb-8 text-[11px] leading-relaxed">
                  Os jogadores subirão na fila automaticamente
                  <br />
                  nos times.
                </p>

                <div className="flex justify-center">
                  <button
                    onClick={() => setShowAutoCompleteModal(false)}
                    className="w-full h-12 bg-[#34d399] text-[#1E3D2F] rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-[#34d399]/20 hover:scale-[1.02] transition-all active:scale-95"
                  >
                    OK
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

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
              <h2 className="text-xl font-black text-center mb-2 uppercase tracking-tighter text-white">
                Zerar Estatísticas?
              </h2>
              <p className="text-center text-brand-text-secondary mb-6 text-sm">
                Deseja zerar todos os gols e assistências de todos os jogadores?
                Esta ação não pode ser desfeita.
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
                  className="flex-1 py-3 bg-emerald-500 text-[#1e3d2f] rounded-xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-colors"
                >
                  Zerar Agora
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-[280px] p-5 rounded-[20px] bg-[#0b0e17]/95 border border-white/10 text-white backdrop-blur-xl shadow-2xl"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="space-y-0.5">
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">
                    Guia
                  </h3>
                  <p className="text-[9px] font-medium leading-relaxed text-white/50 max-w-[180px] mx-auto">
                    Siga estes passos simples:
                  </p>
                </div>

                <div className="w-full space-y-2.5 text-left py-1">
                  <div className="flex gap-2 items-start">
                    <div className="w-5 h-5 rounded-full bg-[#34d399]/10 border border-[#34d399]/20 text-[#34d399] text-[10px] font-black flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      1
                    </div>
                    <p className="text-[9px] font-medium text-white/60 leading-tight">
                      <span className="text-white font-bold block mb-0.5">Crie sua Pelada</span>
                      Clique no banner verde para definir nome, data e local.
                    </p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <div className="w-5 h-5 rounded-full bg-[#34d399]/10 border border-[#34d399]/20 text-[#34d399] text-[10px] font-black flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      2
                    </div>
                    <p className="text-[9px] font-medium text-white/60 leading-tight">
                      <span className="text-white font-bold block mb-0.5">Acesse o Gerenciamento</span>
                      Toque na pelada criada na sua lista para adicionar jogadores.
                    </p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <div className="w-5 h-5 rounded-full bg-[#34d399]/10 border border-[#34d399]/20 text-[#34d399] text-[10px] font-black flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      3
                    </div>
                    <p className="text-[9px] font-medium text-white/60 leading-tight">
                      <span className="text-white font-bold block mb-0.5">Organize as Partidas</span>
                      Confirme presenças, registre gols e gerencie o financeiro.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowSetupGuide(false)}
                  className="w-full py-2.5 bg-[#34d399] hover:bg-[#34d399]/90 text-[#1e3d2f] rounded-lg font-black uppercase tracking-widest text-[9px] shadow-lg shadow-[#34d399]/20 active:scale-95 transition-all text-center cursor-pointer mt-1"
                >
                  Entendi, vamos lá!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Auth modal removed */}
      </AnimatePresence>

      {matchToDelete && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="w-full max-w-[280px] p-6 rounded-[24px] bg-[#0b0e17]/95 border border-white/10 text-white backdrop-blur-xl shadow-2xl relative flex flex-col items-center text-center space-y-4"
          >
            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-sm relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-red-500/10 rounded-full blur-xl" />
              <span className="text-red-500 relative z-10">
                <Trash2 size={24} />
              </span>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-lg font-black uppercase tracking-tight text-white leading-none">
                EXCLUIR PELADA
              </h3>
              <p className="text-[10px] font-bold text-white/60 leading-relaxed px-2 mt-2">
                Tem certeza que deseja excluir a pelada?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full pt-2">
              <button
                onClick={() => setMatchToDelete(null)}
                className="w-full h-10 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all bg-white/5 text-white/70 hover:bg-white/10 hover:text-white active:scale-95 border border-white/10"
              >
                CANCELAR
              </button>
              <button
                onClick={() => {
                  setScheduledMatches((prev) =>
                    prev.filter((m) => m.id !== matchToDelete.id),
                  );
                  setToast({
                    message: "Pelada deletada com sucesso!",
                    type: "success",
                  });
                  setMatchToDelete(null);
                }}
                className="w-full h-10 rounded-xl font-black uppercase tracking-widest text-[9px] bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all active:scale-95"
              >
                EXCLUIR
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Schedule Match Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-[280px] rounded-[24px] overflow-hidden shadow-2xl bg-[#0b0e17]/95 border border-white/10 text-white backdrop-blur-xl relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-white/5 p-6 text-center relative overflow-hidden border-b border-white/5 flex flex-col items-center">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#34d399]/5 rounded-full -mr-8 -mt-8 blur-xl" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8 blur-lg" />

              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setEditingMatchId(null);
                  setNewMatchName("");
                  setNewMatchDay("Segunda");
                  setNewMatchTime("08:00");
                  setNewMatchImage("");
                }}
                className="absolute top-4 right-4 p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/60 hover:text-white transition-all cursor-pointer"
              >
                <X size={14} />
              </button>

              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 shadow-lg text-[#34d399] flex items-center justify-center mx-auto mb-2 relative z-10">
                <GiSoccerBall size={24} />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-white leading-none relative z-10">
                {editingMatchId ? "Editar pelada" : "Criar pelada"}
              </h3>
              <p className="text-[8px] text-white/50 font-black mt-1.5 uppercase tracking-[0.2em] relative z-10">
                Como vai se chamar a pelada?
              </p>
            </div>

            <div className="p-4 space-y-4">
              {/* Image Upload Area */}
              <div className="flex flex-col items-center gap-1.5">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-14 h-14 rounded-full bg-white/5 border border-dashed border-white/20 flex items-center justify-center cursor-pointer overflow-hidden hover:border-[#34d399]/60 transition-all shadow-sm group relative"
                >
                  {newMatchImage ? (
                    <>
                      <img src={newMatchImage} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Camera size={14} className="text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Camera size={16} className="text-white/40 group-hover:text-[#34d399]" />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <p className="text-[8px] font-black text-white/50 uppercase tracking-widest">
                  {newMatchImage ? "Alterar foto" : "Foto da pelada"}
                </p>
                {newMatchImage && (
                  <button 
                    onClick={() => setNewMatchImage("")}
                    className="text-[8px] font-bold text-red-400 hover:text-red-300 uppercase tracking-tight mt-0.5"
                  >
                    Remover
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={newMatchName}
                  onChange={(e) => setNewMatchName(e.target.value)}
                  placeholder="Nome da pelada"
                  className="w-full h-10 px-3 rounded-xl outline-none bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#34d399] focus:bg-white/10 transition-all text-center text-xs"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-white/50 uppercase tracking-[0.15em] block text-center">
                    Dia da Semana
                  </label>
                  <select
                    value={newMatchDay}
                    onChange={(e) => setNewMatchDay(e.target.value)}
                    className="w-full h-10 bg-[#0b0e17] border border-white/10 rounded-xl font-bold text-center text-xs text-white outline-none focus:border-[#34d399] shadow-sm cursor-pointer"
                  >
                    {[
                      "Segunda",
                      "Terça",
                      "Quarta",
                      "Quinta",
                      "Sexta",
                      "Sábado",
                      "Domingo",
                    ].map((day) => (
                      <option key={day} value={day} className="bg-[#0b0e17] text-white">
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-white/50 uppercase tracking-[0.15em] block text-center">
                    Horário
                  </label>
                  <div className="flex items-center justify-center bg-[#0b0e17] border border-white/10 px-2 rounded-xl shadow-sm w-full h-10 overflow-hidden">
                    <input
                      type="time"
                      value={newMatchTime}
                      onChange={(e) => {
                        setNewMatchTime(e.target.value);
                      }}
                      className="bg-transparent font-bold text-center text-xs outline-none focus:text-[#34d399] cursor-pointer w-full text-white [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={handleScheduleMatch}
                  disabled={!newMatchName.trim()}
                  className="w-full h-10 bg-[#34d399] hover:bg-[#34d399]/90 text-[#1e3d2f] font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg shadow-[#34d399]/10 transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center"
                >
                  {editingMatchId ? "SALVAR" : "CRIAR"}
                </button>
                <button
                  onClick={() => {
                    setShowScheduleModal(false);
                    setEditingMatchId(null);
                    setNewMatchName("");
                    setNewMatchDay("Segunda");
                    setNewMatchTime("08:00");
                    setNewMatchImage("");
                  }}
                  className="w-full h-10 rounded-xl font-bold uppercase tracking-widest text-[9px] transition-all bg-white/5 border border-white/10 text-white hover:bg-white/10 active:scale-95 cursor-pointer flex items-center justify-center"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* End Pelada Confirm Modal */}
      {showEndPeladaConfirm && (
        <div className="fixed inset-0 z-[310] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-[280px] rounded-[24px] overflow-hidden shadow-2xl bg-[#0b0e17]/95 border border-white/10 text-white backdrop-blur-xl relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-white/5 p-6 text-center relative overflow-hidden border-b border-white/5 flex flex-col items-center">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#34d399]/5 rounded-full -mr-8 -mt-8 blur-xl" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8 blur-lg" />

              <button
                onClick={() => setShowEndPeladaConfirm(false)}
                className="absolute top-4 right-4 p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/60 hover:text-white transition-all cursor-pointer"
              >
                <X size={14} />
              </button>

              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 shadow-lg text-[#34d399] flex items-center justify-center mx-auto mb-2 relative z-10">
                <IoIosSave size={24} />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-white leading-none relative z-10">
                ENCERRAR PELADA
              </h3>
            </div>

            <div className="p-4 space-y-4">
              <p className="text-xs font-medium text-white/70 text-center leading-normal">
                {matchHistory.length > 0 ? (
                  <>
                    Isso irá salvar as informações de <span className="text-[#34d399] font-bold">presença</span>, <span className="text-[#34d399] font-bold">confrontos</span> e <span className="text-[#34d399] font-bold">próximos</span>.
                    <br />
                    Deseja continuar?
                  </>
                ) : (
                  <span className="text-red-400 font-bold block">
                    É necessário que pelo menos uma partida tenha ocorrido para encerrar e salvar as informações.
                  </span>
                )}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => setShowEndPeladaConfirm(false)}
                  className="w-full h-10 rounded-xl font-bold uppercase tracking-widest text-[9px] transition-all bg-white/5 border border-white/10 text-white hover:bg-white/10 active:scale-95 cursor-pointer flex items-center justify-center"
                >
                  CANCELAR
                </button>
                <button
                  onClick={confirmEndPelada}
                  disabled={matchHistory.length === 0}
                  className={`w-full h-10 rounded-xl font-black uppercase tracking-widest text-[9px] bg-[#34d399] hover:bg-[#34d399]/90 text-[#1e3d2f] shadow-lg shadow-[#34d399]/10 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center`}
                >
                  CONFIRMAR
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Saving Overlay */}
      <AnimatePresence>
        {isSavingPeladaFlow && <SavingPeladaOverlay />}
      </AnimatePresence>
    </div>
  );
}

function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else if (isSignUp && !data?.session) {
      setError(
        "Cadastro realizado com sucesso! Se necessário, verifique sua caixa de entrada/spam para confirmar o e-mail antes de entrar.",
      );
      setIsSignUp(false);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen font-sans transition-colors duration-300 flex items-center justify-center p-6 bg-zinc-100 text-zinc-900">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center relative">
          <FutQuinaLogo size="lg" colorClass="text-zinc-900" />
          <p className="text-sm font-medium tracking-widest uppercase opacity-50 mt-4">
            Sua conta, suas peladas
          </p>
        </div>

        <form
          onSubmit={handleAuth}
          className="p-8 rounded-xl shadow-md flex flex-col gap-4 bg-white"
        >
          <div className="flex p-1 bg-black/5 rounded-xl mb-4">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${!isSignUp ? "bg-white shadow-sm text-black" : "text-zinc-500 hover:text-black"}`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${isSignUp ? "bg-white shadow-sm text-black" : "text-zinc-500 hover:text-black"}`}
            >
              Cadastrar
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-red-500/10 text-red-500 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1 block">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/5 border border-black/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary transition-colors"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1 block">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/5 border border-black/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 rounded-xl bg-brand-gradient text-black font-black uppercase tracking-widest text-xs hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Aguarde..." : isSignUp ? "Criar Conta" : "Acessar"}
          </button>
        </form>
      </div>
    </div>
  );
}

// --- Main App Component ---
export default function App() {

  // Directly enter the control panel (no "Nova Partida" page)
  const [currentGroupId] = useState<string>(() => {
    const saved = safeLocalStorage.getItem("futquina_current_group_id_offline");
    if (saved) return saved;

    const savedGroups = safeLocalStorage.getItem("futquina_groups_offline");
    if (savedGroups) {
      try {
        const parsed = JSON.parse(savedGroups);
        if (parsed && parsed.length > 0) return parsed[0].id;
} catch (e) {}
    }
    return "main"; // default main group ID
  });

  useEffect(() => {
    safeLocalStorage.setItem(
      "futquina_current_group_id_offline",
      currentGroupId,
    );
  }, [currentGroupId]);


  return (
    <GroupApp
      groupId={currentGroupId}
      onBackToHome={() => {}}
    />
  );
}
