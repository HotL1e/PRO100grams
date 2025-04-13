import * as fs from "fs";
import * as readline from "readline";

/**
 * Разделяет текст на предложения
 * @param text исходный текст
 * @returns массив предложений
 */
function splitIntoSentences(text: string): string[] {
  // Регулярное выражение для разделения текста на предложения
  const sentenceRegex = /[.!?]+\s+/;

  // Разделяем текст на предложения
  const sentences = text.split(sentenceRegex);

  // Фильтруем пустые предложения и обрезаем пробелы
  return sentences
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
}

/**
 * Проверяет, содержит ли предложение указанное слово
 * @param sentence предложение для проверки
 * @param word искомое слово
 * @returns true, если предложение содержит слово
 */
function containsWord(sentence: string, word: string): boolean {
  // Приводим к нижнему регистру для регистронезависимого поиска
  const lowerSentence = sentence.toLowerCase();
  const lowerWord = word.toLowerCase();

  // Разбиваем предложение на слова
  const words = lowerSentence.split(/\s+/);

  // Проверяем, содержится ли искомое слово среди слов предложения
  return words.some((w) => {
    // Удаляем знаки препинания для сравнения
    const cleanWord = w.replace(/[.,!?;:()'"]/g, "");
    return cleanWord === lowerWord;
  });
}

/**
 * Выделяет искомое слово в предложении (добавляет ** вокруг слова)
 * @param sentence предложение для обработки
 * @param word искомое слово
 * @returns предложение с выделенным словом
 */
function highlightWord(sentence: string, word: string): string {
  // Создаем регулярное выражение для поиска слова с учетом границ слова
  // и игнорированием регистра
  const regex = new RegExp(`\\b${word}\\b`, "gi");

  // Заменяем все вхождения слова на выделенное слово
  return sentence.replace(regex, "**$&**");
}

/**
 * Основная функция программы
 */
async function main(): Promise<void> {
  try {
    console.log(
      "Программа поиска предложений с указанным словом".padEnd(60, "=")
    );

    // Создаем интерфейс для чтения ввода пользователя
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Запрашиваем путь к файлу
    rl.question("Введите путь к текстовому файлу: ", (filePath) => {
      // Читаем текст из файла
      fs.readFile(filePath, "utf8", (err, text) => {
        if (err) {
          console.error("Ошибка при чтении файла:", err.message);
          rl.close();
          return;
        }

        // Разделяем текст на предложения
        const sentences = splitIntoSentences(text);
        console.log(`\nВ файле найдено ${sentences.length} предложений.`);

        // Запрашиваем слово для поиска
        rl.question("\nВведите слово для поиска: ", (searchWord) => {
          console.log(
            `\nПредложения, содержащие слово "${searchWord}":`.padEnd(60, "-")
          );

          let found = false;

          // Ищем и выводим предложения с указанным словом
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

// Запуск программы
main();

/**
 * Пример текста для тестирования (можно сохранить в файл sample.txt)
 *
 * Это первое предложение для тестирования программы. Второе предложение содержит
 * слово программа несколько раз, программа должна найти это. А это третье предложение,
 * которое тоже нужно для тестирования! Четвертое предложение не содержит искомого слова.
 * Пятое предложение снова содержит слово ПРОГРАММА, но в другом регистре.
 */
