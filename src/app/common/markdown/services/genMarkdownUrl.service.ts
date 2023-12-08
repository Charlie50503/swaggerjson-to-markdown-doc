import { MarkdownTitleLevel } from '../enum/markdownTitleLevel.enum';

export function genMarkdownUrl(content: string, url: string) {
  const localTitleLink=url.trim().replace(/ /g,"-")
  return `[${content}](${localTitleLink})`;
}
