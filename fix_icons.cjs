const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<IoMdSwap size=\{12\} className="([^"]+)" \/>/g, '<span className="$1"><IoMdSwap size={12} /></span>');
code = code.replace(/<IoMdArrowUp size=\{12\} className="([^"]+)" \/>/g, '<span className="$1"><IoMdArrowUp size={12} /></span>');
code = code.replace(/<IoMdArrowDown size=\{12\} className="([^"]+)" \/>/g, '<span className="$1"><IoMdArrowDown size={12} /></span>');

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed linter errors in icons');
