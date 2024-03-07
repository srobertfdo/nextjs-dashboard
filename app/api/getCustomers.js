import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const filePath = path.join(process.cwd(), 'public', 'customers.json');
    const data = fs.readFileSync(filePath);
    const customers = JSON.parse(data);
    res.status(200).json({ customers });
}