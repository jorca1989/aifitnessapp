#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to recursively find all TypeScript/JavaScript files
function findFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      results = results.concat(findFiles(filePath, extensions));
    } else if (extensions.some(ext => file.endsWith(ext))) {
      results.push(filePath);
    }
  });
  
  return results;
}

// Function to replace localhost URLs with API_ENDPOINTS
function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  // Replace axios.get calls
  const axiosGetRegex = /axios\.get\(`http:\/\/localhost:3001\/api\/([^`]+)`/g;
  if (axiosGetRegex.test(content)) {
    content = content.replace(axiosGetRegex, 'axios.get(`${API_ENDPOINTS.$1.replace(/\\//g, "_").toUpperCase()}`');
    updated = true;
  }
  
  // Replace axios.post calls
  const axiosPostRegex = /axios\.post\(`http:\/\/localhost:3001\/api\/([^`]+)`/g;
  if (axiosPostRegex.test(content)) {
    content = content.replace(axiosPostRegex, 'axios.post(`${API_ENDPOINTS.$1.replace(/\\//g, "_").toUpperCase()}`');
    updated = true;
  }
  
  // Replace axios.put calls
  const axiosPutRegex = /axios\.put\(`http:\/\/localhost:3001\/api\/([^`]+)`/g;
  if (axiosPutRegex.test(content)) {
    content = content.replace(axiosPutRegex, 'axios.put(`${API_ENDPOINTS.$1.replace(/\\//g, "_").toUpperCase()}`');
    updated = true;
  }
  
  // Replace axios.delete calls
  const axiosDeleteRegex = /axios\.delete\(`http:\/\/localhost:3001\/api\/([^`]+)`/g;
  if (axiosDeleteRegex.test(content)) {
    content = content.replace(axiosDeleteRegex, 'axios.delete(`${API_ENDPOINTS.$1.replace(/\\//g, "_").toUpperCase()}`');
    updated = true;
  }
  
  if (updated) {
    // Add import if not present
    if (!content.includes('import API_ENDPOINTS')) {
      const importStatement = "import API_ENDPOINTS from '../config/api';";
      const lastImportIndex = content.lastIndexOf('import');
      if (lastImportIndex !== -1) {
        const nextLineIndex = content.indexOf('\n', lastImportIndex);
        content = content.slice(0, nextLineIndex + 1) + importStatement + '\n' + content.slice(nextLineIndex + 1);
      }
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated: ${filePath}`);
  }
}

// Main execution
console.log('🔄 Updating API URLs in source files...');

const srcDir = path.join(__dirname, '..', 'src');
const files = findFiles(srcDir);

files.forEach(file => {
  try {
    updateFile(file);
  } catch (error) {
    console.error(`❌ Error updating ${file}:`, error.message);
  }
});

console.log('✨ API URL update complete!');
console.log('📝 Next steps:');
console.log('1. Review the changes in your files');
console.log('2. Test locally to ensure everything works');
console.log('3. Commit and push to trigger Vercel deployment');
console.log('4. Set environment variables in Vercel dashboard');
