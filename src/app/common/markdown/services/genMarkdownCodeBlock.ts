export function genMarkdownCodeBlock(codeType: string, code: string) {
  return `
    \`\`\`${codeType}\=
    ${code}
    \`\`\`
  `;
}
