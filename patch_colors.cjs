const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace text-white/XX with text-black/XX dark:text-white/XX, ignoring if preceded by dark: or hover: (wait, hover:text-white/XX -> hover:text-black/XX dark:hover:text-white/XX)
content = content.replace(/(?<![a-zA-Z:-])text-white\/([0-9]+)/g, 'text-black/$1 dark:text-white/$1');
content = content.replace(/(?<![a-zA-Z:-])hover:text-white\/([0-9]+)/g, 'hover:text-black/$1 dark:hover:text-white/$1');

// Replace bg-white/XX with bg-black/XX dark:bg-white/XX, ignoring if preceded by dark: or hover:
content = content.replace(/(?<![a-zA-Z:-])bg-white\/([0-9]+)/g, 'bg-black/$1 dark:bg-white/$1');
content = content.replace(/(?<![a-zA-Z:-])hover:bg-white\/([0-9]+)/g, 'hover:bg-black/$1 dark:hover:bg-white/$1');

// Replace bg-[#0b0e17] with bg-white dark:bg-[#0b0e17]
// Wait, we should check if they are already dark:bg-[#0b0e17]. If not, change them.
content = content.replace(/(?<![a-zA-Z:-])bg-\[#0b0e17\](\/[0-9]+)?/g, 'bg-white dark:bg-[#0b0e17]$1');

// Replace bg-[#111625] with bg-[#e2e8f0] dark:bg-[#111625] if not preceded by dark:
content = content.replace(/(?<![a-zA-Z:-])bg-\[#111625\](\/[0-9]+)?/g, 'bg-[#e2e8f0] dark:bg-[#111625]$1');

// Replace bg-[#0b1329] with bg-white dark:bg-[#0b1329]
content = content.replace(/(?<![a-zA-Z:-])bg-\[#0b1329\](\/[0-9]+)?/g, 'bg-white dark:bg-[#0b1329]$1');

fs.writeFileSync('src/App.tsx', content);
