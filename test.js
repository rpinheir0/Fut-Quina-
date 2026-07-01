const line = '     }';
if (line.match(/^ +}$/)) {
  const spaces = line.length - 1;
  console.log("Matched!", spaces);
  if (spaces % 2 !== 0) {
    console.log("Odd!", line.replace('}', '       }}'));
  }
}
