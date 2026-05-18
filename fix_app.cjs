const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const lines = code.split('\n');

// Find the index of line 10510 (0-indexed => 10509)
// But to be safe, I'll find "// --- Main App Component ---" around 10509
let mainAppIdx = -1;
let mainAppIdx2 = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('// --- Main App Component ---')) {
    if (mainAppIdx === -1) mainAppIdx = i;
    else mainAppIdx2 = i;
  }
}

if (mainAppIdx !== -1) {
    if (lines[mainAppIdx + 1].includes('function GroupApp')) {
        lines[mainAppIdx + 1] = 'export default function App() {';
    }
}

if (mainAppIdx2 !== -1) {
    // Delete from mainAppIdx2 down
    lines.splice(mainAppIdx2);
}

fs.writeFileSync('src/App.tsx', lines.join('\n'));
console.log('Fixed');
