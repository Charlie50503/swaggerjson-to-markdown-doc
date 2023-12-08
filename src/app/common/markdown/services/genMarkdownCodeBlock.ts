import * as prettier from 'prettier';
export async function genMarkdownCodeBlock(codeType: string, code: string) {
  const formatCode = await prettier.format(code, { parser: codeType });
  return `
    \`\`\`${codeType}\=
    ${formatCode}
    \`\`\`
  `;
}
