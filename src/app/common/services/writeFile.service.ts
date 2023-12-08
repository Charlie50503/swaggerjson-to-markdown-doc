import * as fs from 'fs';
export function writeFile(fileName: string, content: string) {
  fs.writeFileSync(fileName, content, 'utf8');

  console.log(`${fileName} 已被創建和寫入內容。`);
}
