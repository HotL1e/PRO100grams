import * as fs from "fs";
import * as readline from "readline";

function splitIntoSentences(text: string): string[] {
  const sentenceRegex = /[.!?]+\s+/;

  const sentences = text.split(sentenceRegex);

  return sentences
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
}

function containsWord(sentence: string, word: string): boolean {
  const lowerSentence = sentence.toLowerCase();
  const lowerWord = word.toLowerCase();

  const words = lowerSentence.split(/\s+/);

  return words.some((w) => {
    const cleanWord = w.replace(/[.,!?;:()'"]/g, "");
    return cleanWord === lowerWord;
  });
}

function highlightWord(sentence: string, word: string): string {
  const regex = new RegExp(`\\b${word}\\b`, "gi");

  return sentence.replace(regex, "**$&**");
}

async function main(): Promise<void> {
  try {
    console.log(
      "Программа поиска предложений с указанным словом".padEnd(60, "=")
    );

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Введите путь к текстовому файлу: ", (filePath) => {
      fs.readFile(filePath, "utf8", (err, text) => {
        if (err) {
          console.error("Ошибка при чтении файла:", err.message);
          rl.close();
          return;
        }

        const sentences = splitIntoSentences(text);
        console.log(`\nВ файле найдено ${sentences.length} предложений.`);

        rl.question("\nВведите слово для поиска: ", (searchWord) => {
          console.log(
            `\nПредложения, содержащие слово "${searchWord}":`.padEnd(60, "-")
          );

          let found = false;

          sentences.forEach((sentence, index) => {
            if (containsWord(sentence, searchWord)) {
              found = true;
              const highlightedSentence = highlightWord(sentence, searchWord);
              console.log(
                `${(index + 1).toString().padEnd(3)} ${highlightedSentence}`
              );
            }
          });

          if (!found) {
            console.log(
              `Предложений, содержащих слово "${searchWord}", не найдено.`
            );
          }

          console.log("".padEnd(60, "-"));
          console.log("\nПрограмма завершена.");
          rl.close();
        });
      });
    });
  } catch (error: any) {
    console.error("Произошла ошибка:", error.message);
    process.exit(1);
  }
}

main();