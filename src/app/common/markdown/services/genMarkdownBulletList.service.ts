export function genMarkdownBulletList(listContent: string[]) {
  return listContent
    .map((content) => {
      return `* ${content}`;
    })
    .join('\n');
}
