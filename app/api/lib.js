import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'lib', 'wasm_exec.js'); // Update the file path as needed
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    res.setHeader('Content-Type', 'text/javascript');
    res.status(200).send(content);
  } catch (error) {
    res.status(404).end();
  }
}
