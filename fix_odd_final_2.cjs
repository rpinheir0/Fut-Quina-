const fs = require('fs');
const execSync = require('child_process').execSync;

const file = 'src/App.tsx';
const lines = fs.readFileSync(file, 'utf8').split('\n');

// Get all line numbers with these specific syntax errors from the 575 errors file (tsc_output5.txt)
const grepCmd = `grep -E "Declaration or statement expected|'try' expected|'catch' or 'finally' expected" tsc_output5.txt | grep -oE "\\([0-9]+," | grep -oE "[0-9]+" | sort -u`;
const errorLinesOutput = execSync(grepCmd, { encoding: 'utf8' }).trim();
const errorLines = new Set(errorLinesOutput.split('\n').map(Number));

let count = 0;

for (let i = 0; i < lines.length; i++) {
  const lineNum = i + 1;
  if (errorLines.has(lineNum)) {
    const line = lines[i];
    
    if (line.match(/^ *else if \(/) || line.match(/^ *catch \(/) || line.match(/^ *finally \{/) || line.match(/^ *else \{/)) {
       const match = line.match(/^ */);
       const spaces = match[0].length;
       const origSpaces = spaces + 6;
       lines[i] = ' '.repeat(origSpaces) + '} ' + line.trim();
       count++;
    }
  }
}

fs.writeFileSync(file, lines.join('\n'));
console.log(`Restored ${count} lines.`);
