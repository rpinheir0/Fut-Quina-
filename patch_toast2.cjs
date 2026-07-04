const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target2 = `            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-12 left-0 right-0 z-[200] flex justify-center px-6 pointer-events-none"
            >
              <motion.div
                className={\`pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.3)] border backdrop-blur-xl transition-all \${
                  toast.type === "success"
                    ? "bg-[#dce3ee] dark:bg-[#dce3ee]merald-500/90 border-emerald-400/50 text-zinc-900 dark:text-white"
                    : toast.type === "warning"
                      ? "bg-amber-500/90 border-amber-400/50 text-zinc-900 dark:text-white"
                      : "bg-[#1E3D2F]/95 border-black/10 dark:border-white/10 text-zinc-900 dark:text-white"
                }\`}
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
                  className="ml-2 w-6 h-6 flex items-center justify-center bg-black/50 dark:bg-white/50 dark:bg-black/20 dark:bg-white/20 hover:bg-black/30 dark:hover:bg-white/30 rounded-full transition-colors shrink-0"
                >
                  <PiXBold size={14} />
                </button>
              </motion.div>
            </motion.div>`;

const replacement2 = `            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-12 left-0 right-0 z-[200] flex justify-center px-6 pointer-events-none"
            >
              <motion.div
                className={\`pointer-events-auto flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-black/10 dark:border-white/10 bg-white/95 dark:bg-[#121212]/95 backdrop-blur-xl transition-all group\`}
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
                  <span className="text-[11px] font-medium text-black/70 dark:text-white/60 leading-tight max-w-[200px]">
                    {toast.message}
                  </span>
                </div>
                <button
                  onClick={() => setToast(null)}
                  className="ml-auto w-6 h-6 flex items-center justify-center bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:bg-white/10 rounded-full transition-colors shrink-0"
                >
                  <div className="opacity-40 group-hover:opacity-100 transition-opacity text-zinc-900 dark:text-white">
                    <PiXBold size={10} />
                  </div>
                </button>
              </motion.div>
            </motion.div>`;

content = content.replace(target2, replacement2);
fs.writeFileSync('src/App.tsx', content);
