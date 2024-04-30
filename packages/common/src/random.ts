const validChars: string[] = [];

for (let i = 65; i <= 90; i++) validChars.push(String.fromCharCode(i));
for (let i = 97; i <= 122; i++) validChars.push(String.fromCharCode(i));
for (let i = 48; i <= 58; i++) validChars.push(String.fromCharCode(i));

export function randomString(len: number) {
  let result = "";
  for (let i = 0; i < len; i++) {
    result += randomArrayItem(validChars);
  }
  return result;
}

export function randomNumber(min: number, max: number) {
  return (max - min) * Math.random() + min;
}

export function randomInt(min: number, max: number) {
  return Math.round(randomNumber(min, max));
}

export function randomArrayItem<T>(array: T[]) {
  return array[randomInt(0, array.length - 1)];
}
