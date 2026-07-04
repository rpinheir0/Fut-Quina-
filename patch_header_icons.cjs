const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `            {/* Header Actions */}
            <div className="flex items-center gap-2 relative z-10">
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center transition-all cursor-pointer bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/60 hover:text-zinc-900 dark:text-white hover:bg-black/10 dark:bg-white/10 shadow-sm"
              >
                {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
              </button>
              {!(currentScreen === "players" && !showAddPlayerSection) && (
                <button 
                  onClick={() => setShowGlobalSettings(true)}
                  className="text-zinc-900 dark:text-white hover:opacity-80 transition-opacity p-2 flex items-center justify-center cursor-pointer"
                >
                  <IoIosMenu size={28} />
                </button>
              )}
            </div>`;

const replacement = `            {/* Header Actions */}
            <div className="flex items-center gap-2 relative z-10">
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all cursor-pointer bg-white/5 text-white/70 hover:text-white hover:bg-white/10 shadow-sm"
              >
                {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
              </button>
              {!(currentScreen === "players" && !showAddPlayerSection) && (
                <button 
                  onClick={() => setShowGlobalSettings(true)}
                  className="text-white hover:opacity-80 transition-opacity p-2 flex items-center justify-center cursor-pointer"
                >
                  <IoIosMenu size={28} />
                </button>
              )}
            </div>`;

content = content.replace(target, replacement);
fs.writeFileSync('src/App.tsx', content);
