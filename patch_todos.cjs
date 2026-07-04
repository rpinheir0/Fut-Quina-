const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                                  <span className="text-zinc-900 dark:text-white">
                                    <CheckCircle2 size={16} />
                                  </span>
                                  <span>TODOS</span>`;

const repl = `                                  <span>TODOS</span>`;

if (content.includes(target)) {
    content = content.replace(target, repl);
    console.log("Success");
} else {
    console.log("Not found");
}

fs.writeFileSync('src/App.tsx', content);
