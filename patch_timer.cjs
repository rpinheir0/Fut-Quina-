const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `        <motion.span
          key={\`flip-\${clockId}-\${digitId}-\${value}\`}
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -25, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className={\`\${textSizes[size]} font-black text-black/90\`}
        >`;
const replacement1 = `        <motion.span
          key={\`flip-\${clockId}-\${digitId}-\${value}\`}
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -25, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className={\`\${textSizes[size]} font-black text-zinc-900 dark:text-white\`}
        >`;

const target2 = `    <div
      className={\`flex items-center \${size === "xs" ? "gap-2.5 p-2 px-4" : "gap-1 p-2"} rounded-xl border border-black/5 bg-black/80 dark:bg-white/80 backdrop-blur-sm shadow-sm\`}
    >`;
const replacement2 = `    <div
      className={\`flex items-center \${size === "xs" ? "gap-1.5 p-1 px-3" : "gap-1 p-1.5"} rounded-xl border border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/50 backdrop-blur-md shadow-sm\`}
    >`;

const target3 = `      <span
        className={\`\${size === "xs" ? "text-sm" : size === "small" ? "text-lg" : "text-2xl"} font-black text-black/60 mx-1\`}
      >`;
const replacement3 = `      <span
        className={\`\${size === "xs" ? "text-sm" : size === "small" ? "text-lg" : "text-2xl"} font-black text-black/40 dark:text-white/40 mx-0.5\`}
      >`;

content = content.replace(target1, replacement1);
content = content.replace(target2, replacement2);
content = content.replace(target3, replacement3);

fs.writeFileSync('src/App.tsx', content);
