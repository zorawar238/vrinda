const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function (file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('src');

files.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace fetch with credentials
  // For GET requests without options
  content = content.replace(/await fetch\((.*?)\);/g, (match, p1) => {
    // skip if it's already got an options object or it's a known public route that doesn't need credentials
    // Actually, adding credentials: 'include' to all requests to our own backend is fine.
    if (p1.includes(',')) return match;
    if (p1.includes('/api/')) {
        return `await fetch(${p1}, { credentials: 'include' });`;
    }
    return match;
  });

  // For fetch calls with options, replace Authorization header and add credentials
  content = content.replace(/headers:\s*{\s*'Content-Type':\s*'application\/json',?\s*Authorization:\s*`Bearer \${.*?}`\s*,?\s*}/g, `headers: {\n          'Content-Type': 'application/json'\n        },\n        credentials: 'include'`);

  // Same, with different spacing
  content = content.replace(/Authorization:\s*`Bearer \${.*?}`\s*,?/g, `credentials: 'include',`);
  
  // Cleanup multiple credentials: 'include'
  content = content.replace(/credentials:\s*'include',\s*credentials:\s*'include'/g, `credentials: 'include'`);
  
  // Fix options without credentials but with other headers
  if (originalContent !== content) {
    // Make sure we didn't screw up the JSON format
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
