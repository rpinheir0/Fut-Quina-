const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf8');

if (!content.includes('@custom-variant dark')) {
  content = content.replace('@import "tailwindcss";', '@import "tailwindcss";\n@custom-variant dark (&:where(.dark, .dark *));');
}

content = content.replace('  body {\n    @apply bg-[#0b0e17] text-white antialiased;\n    font-size: 1rem;\n  }', '  body {\n    @apply bg-white dark:bg-[#0b0e17] text-zinc-900 dark:text-white antialiased;\n    font-size: 1rem;\n  }');

fs.writeFileSync('src/index.css', content);
