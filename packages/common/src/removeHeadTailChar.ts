export function removeHeadTailChar(str: string, char: string) {
  while (str[0] === char) str = str.slice(1);
  while (str[str.length - 1] === char) str = str.slice(0, str.length - 1);
  return str;
}
