const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                                                  <span
                                                    className={\`text-xs font-bold tracking-tight capitalize truncate leading-none \${isCurrent ? "text-zinc-900 dark:text-white" : "text-black/90 dark:text-white/90"}\`}
                                                  >
                                                    {p.name.toLowerCase()}
                                                  </span>`;

const repl = `                                                  <span
                                                    className={\`text-xs font-bold tracking-tight capitalize truncate leading-none \${isCurrent ? "text-zinc-900 dark:text-zinc-800" : "text-black/90 dark:text-white/90"}\`}
                                                  >
                                                    {p.name.toLowerCase()}
                                                  </span>`;

if (content.includes(target)) {
    content = content.replace(target, repl);
    console.log("Success");
} else {
    console.log("Not found");
}

fs.writeFileSync('src/App.tsx', content);
