const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

let startTag = 'bg-[#dedede] backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl border border-black/10 ring-1 ring-black/5';
let startIdx = content.indexOf(startTag, content.indexOf("currentScreen === 'ranking'"));
let endTag = "currentScreen === 'ranking' && isPrintMode";
let endIdx = content.indexOf(endTag, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  let section = content.substring(startIdx, endIdx);
  
  // Replace text-white to text-black
  section = section.replace(/text-white(\/[0-9]+)?/g, function(match, p1) {
    if (p1) {
      return 'text-zinc-800' + p1;
    }
    return 'text-zinc-800';
  });
  
  section = section.replace(/text-\[#B7D96C\]/g, 'text-zinc-800');
  
  section = section.replace(/bg-white\/5/g, 'bg-black/5');
  section = section.replace(/bg-white\/10/g, 'bg-black/10');
  section = section.replace(/divide-white\/5/g, 'divide-black/5');
  section = section.replace(/border-white\/10/g, 'border-black/10');
  section = section.replace(/border-white\/5/g, 'border-black/5');
  
  content = content.substring(0, startIdx) + section + content.substring(endIdx);
  console.log('Replaced in ranking');
} else {
  console.log('Not found ranking: ' + startIdx + ' ' + endIdx);
}

fs.writeFileSync('src/App.tsx', content);
