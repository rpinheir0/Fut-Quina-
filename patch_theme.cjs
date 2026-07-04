const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  useEffect(() => {
    safeLocalStorage.setItem(\`futquina_theme_\${groupId}\`, theme);
  }, [theme, groupId]);`;

const replacement = `  useEffect(() => {
    safeLocalStorage.setItem(\`futquina_theme_\${groupId}\`, theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme, groupId]);`;

content = content.replace(target, replacement);

fs.writeFileSync('src/App.tsx', content);
