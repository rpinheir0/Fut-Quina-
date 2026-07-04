const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `            <motion.div
              className="pointer-events-auto flex items-center gap-4 pl-1.5 pr-5 py-1.5 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-black/10 dark:border-white/10 bg-[#121212]/95 backdrop-blur-xl transition-all group"
            >
              <div className={\`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg \${
                toast.type === "success"
                  ? "bg-[#dce3ee] dark:bg-[#dce3ee]merald-500/20 text-[#59b823] border border-emerald-500/20"
                  : toast.type === "warning"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/20"
                    : "bg-black/5 dark:bg-white/5 text-black/80 dark:text-white/80 border border-black/10 dark:border-white/10"
              }\`}>
                {toast.type === "success" && <PiCheckCircleBold size={20} />}
                {toast.type === "warning" && <PiWarningCircleBold size={20} />}
                {toast.type === "gray" && <PiGearBold size={20} />}
                {toast.type === "info" && <PiRocketBold size={20} />}
              </div>
              <div className="flex flex-col pr-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-white leading-none mb-0.5">
                  Notificação
                </p>
                <p className="text-[11px] font-medium text-black/70 dark:text-white/60 leading-tight">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => setToast(null)}
                className="ml-auto w-7 h-7 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:bg-white/10 transition-all active:scale-90"
              >
                <div className="opacity-40 group-hover:opacity-100 transition-opacity text-zinc-900 dark:text-white">
                  <PiXBold size={12} />
                </div>
              </button>
            </motion.div>`;

const replacement1 = `            <motion.div
              className="pointer-events-auto flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-black/10 dark:border-white/10 bg-white/95 dark:bg-[#121212]/95 backdrop-blur-xl transition-all group"
            >
              <div className={\`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm dark:shadow-lg \${
                toast.type === "success"
                  ? "bg-[#dce3ee] dark:bg-emerald-500/20 text-[#59b823] border border-emerald-500/20"
                  : toast.type === "warning"
                    ? "bg-amber-100 dark:bg-amber-500/20 text-amber-500 dark:text-amber-400 border border-amber-500/20"
                    : "bg-black/5 dark:bg-white/5 text-black/80 dark:text-white/80 border border-black/10 dark:border-white/10"
              }\`}>
                {toast.type === "success" && <PiCheckCircleBold size={16} />}
                {toast.type === "warning" && <PiWarningCircleBold size={16} />}
                {toast.type === "gray" && <PiGearBold size={16} />}
                {toast.type === "info" && <PiRocketBold size={16} />}
              </div>
              <div className="flex flex-col pr-1">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-white leading-none mb-[1px]">
                  Notificação
                </p>
                <p className="text-[11px] font-medium text-black/70 dark:text-white/60 leading-tight">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => setToast(null)}
                className="ml-auto w-6 h-6 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:bg-white/10 transition-all active:scale-90"
              >
                <div className="opacity-40 group-hover:opacity-100 transition-opacity text-zinc-900 dark:text-white">
                  <PiXBold size={10} />
                </div>
              </button>
            </motion.div>`;

content = content.replace(target1, replacement1);
fs.writeFileSync('src/App.tsx', content);
