const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                                                <div className={\`w-6 h-6 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0 overflow-hidden \${isCurrent ? "bg-black/50 dark:bg-white/50 dark:bg-black/20" : "bg-black/10 dark:bg-white/10"}\`}>`;
const replacement = `                                                <div className={\`w-6 h-6 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0 overflow-hidden \${isCurrent ? "bg-black/20 dark:bg-white/50" : "bg-black/10 dark:bg-white/10"}\`}>`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync('src/App.tsx', content);
    console.log("Success");
} else {
    console.log("Target not found");
}
