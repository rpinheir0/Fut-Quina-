const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                    <div className="flex gap-2">
                      <button
                        onClick={() => setTheme("light")}
                        className={\`w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center transition-all cursor-pointer \${theme === "light" ? "bg-white text-black" : "bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/60 hover:text-zinc-900 dark:text-white hover:bg-black/10 dark:bg-white/10"}\`}
                      >
                        <Sun size={14} />
                      </button>
                      <button
                        onClick={() => setTheme("dark")}
                        className={\`w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center transition-all cursor-pointer \${theme === "dark" ? "bg-white text-black" : "bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/60 hover:text-zinc-900 dark:text-white hover:bg-black/10 dark:bg-white/10"}\`}
                      >
                        <Moon size={14} />
                      </button>
                    </div>`;

const repl = `                    <div></div>`;

if (content.includes(target)) {
    content = content.replace(target, repl);
    console.log("Success");
} else {
    console.log("Not found");
}

fs.writeFileSync('src/App.tsx', content);
