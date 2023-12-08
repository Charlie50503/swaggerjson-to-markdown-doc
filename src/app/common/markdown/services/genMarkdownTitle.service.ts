import { MarkdownTitleLevel } from '../enum/markdownTitleLevel.enum';

export function genMarkdownTitle(level: MarkdownTitleLevel, content: string) {
  if (level === MarkdownTitleLevel.h1) {
    return `# ${content}`;
  } else if (level === MarkdownTitleLevel.h2) {
    return `## ${content}`;
  } else if (level === MarkdownTitleLevel.h3) {
    return `### ${content}`;
  } else if (level === MarkdownTitleLevel.h4) {
    return `#### ${content}`;
  }
  throw Error('unknown title level');
}
