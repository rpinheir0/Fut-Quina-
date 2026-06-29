const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

// Find start line
const startLineIdx = lines.findIndex(l => l.includes('{showPeladaReport && ('));
if (startLineIdx === -1) {
    console.error('Start line not found');
    process.exit(1);
}

// Find matching closing brace/paren (we know it ends right before showEventModal &&)
let endLineIdx = lines.findIndex((l, i) => i > startLineIdx && l.includes('{showEventModal && ('));
if (endLineIdx === -1) {
    console.error('End line not found');
    process.exit(1);
}

// We also need to remove any empty lines before showEventModal
while (lines[endLineIdx - 1].trim() === '') {
    endLineIdx--;
}

lines.splice(startLineIdx, endLineIdx - startLineIdx);

fs.writeFileSync('src/App.tsx', lines.join('\n'));
console.log('Success');
