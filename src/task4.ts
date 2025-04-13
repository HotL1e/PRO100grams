/**
 * Программа обработки двумерного массива целых чисел
 * Вариант 2
 */

/**
 * Создает случайную целочисленную матрицу заданного размера
 * @param rows количество строк
 * @param cols количество столбцов
 * @param min минимальное значение элемента
 * @param max максимальное значение элемента
 * @returns двумерный массив целых чисел
 */
function createRandomMatrix(
  rows: number,
  cols: number,
  min: number = -10,
  max: number = 10
): number[][] {
  const matrix: number[][] = [];

  for (let i = 0; i < rows; i++) {
    const row: number[] = [];
    for (let j = 0; j < cols; j++) {
      row.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    matrix.push(row);
  }

  return matrix;
}

/**
 * Выводит матрицу в консоль в виде таблицы
 * @param matrix двумерный массив
 * @param title заголовок таблицы
 */
function printMatrix(matrix: number[][], title: string = "Матрица"): void {
  console.log(`\n${title}:`.padEnd(50, "-"));

  // Вывод индексов столбцов
  process.stdout.write("    | ");
  for (let j = 0; j < matrix[0].length; j++) {
    process.stdout.write(`${j.toString().padEnd(4)} | `);
  }
  console.log("\n" + "".padEnd(7 + matrix[0].length * 8, "-"));

  // Вывод строк матрицы
  for (let i = 0; i < matrix.length; i++) {
    process.stdout.write(`${i.toString().padEnd(2)} | `);
    for (let j = 0; j < matrix[i].length; j++) {
      process.stdout.write(`${matrix[i][j].toString().padEnd(4)} | `);
    }
    console.log();
  }
}

/**
 * Определяет количество столбцов, не содержащих ни одного нулевого элемента
 * @param matrix двумерный массив
 * @returns количество столбцов без нулевых элементов
 */
function countColumnsWithoutZeros(matrix: number[][]): number {
  if (matrix.length === 0 || matrix[0].length === 0) {
    return 0;
  }

  const cols = matrix[0].length;
  const rows = matrix.length;
  let count = 0;

  for (let j = 0; j < cols; j++) {
    let hasZero = false;

    for (let i = 0; i < rows; i++) {
      if (matrix[i][j] === 0) {
        hasZero = true;
        break;
      }
    }

    if (!hasZero) {
      count++;
    }
  }

  return count;
}

/**
 * Вычисляет характеристику строки - сумму положительных четных элементов
 * @param row строка матрицы
 * @returns сумма положительных четных элементов
 */
function calculateRowCharacteristic(row: number[]): number {
  return row.reduce((sum, element) => {
    // Проверяем, что элемент положительный и четный
    if (element > 0 && element % 2 === 0) {
      return sum + element;
    }
    return sum;
  }, 0);
}

/**
 * Сортирует строки матрицы по возрастанию характеристик
 * @param matrix исходная матрица
 * @returns новая матрица с отсортированными строками
 */
function sortRowsByCharacteristic(matrix: number[][]): number[][] {
  // Создаем копию матрицы, чтобы не изменять исходную
  const sortedMatrix = [...matrix.map((row) => [...row])];

  // Вычисляем характеристики для каждой строки
  const characteristics = sortedMatrix.map((row) =>
    calculateRowCharacteristic(row)
  );

  // Создаем массив индексов
  const indices = characteristics.map((_, i) => i);

  // Сортируем индексы по характеристикам
  indices.sort((a, b) => characteristics[a] - characteristics[b]);

  // Создаем новую матрицу с отсортированными строками
  return indices.map((i) => [...matrix[i]]);
}

/**
 * Выводит информацию о столбцах без нулевых элементов
 * @param matrix двумерный массив
 */
function printColumnsWithoutZeros(matrix: number[][]): void {
  if (matrix.length === 0 || matrix[0].length === 0) {
    console.log("Матрица пуста");
    return;
  }

  const cols = matrix[0].length;
  const rows = matrix.length;

  console.log("\nСтолбцы без нулевых элементов:".padEnd(50, "-"));

  let columnsFound = false;

  for (let j = 0; j < cols; j++) {
    let hasZero = false;

    for (let i = 0; i < rows; i++) {
      if (matrix[i][j] === 0) {
        hasZero = true;
        break;
      }
    }

    if (!hasZero) {
      columnsFound = true;
      console.log(
        `Столбец ${j}:`.padEnd(12) + matrix.map((row) => row[j]).join(", ")
      );
    }
  }

  if (!columnsFound) {
    console.log("Нет столбцов без нулевых элементов");
  }
}

/**
 * Выводит характеристики строк матрицы
 * @param matrix двумерный массив
 */
function printRowCharacteristics(matrix: number[][]): void {
  console.log(
    "\nХарактеристики строк (суммы положительных четных элементов):".padEnd(
      70,
      "-"
    )
  );

  matrix.forEach((row, index) => {
    const characteristic = calculateRowCharacteristic(row);
    const positiveEvenElements = row.filter(
      (element) => element > 0 && element % 2 === 0
    );

    console.log(
      `Строка ${index}:`.padEnd(10) +
        `Характеристика = ${characteristic.toString().padEnd(4)}` +
        (positiveEvenElements.length > 0
          ? ` (${positiveEvenElements.join(" + ")})`
          : " (нет положительных четных элементов)")
    );
  });
}

/**
 * Обрабатывает матрицу согласно заданию
 * @param matrix исходная матрица
 */
function processMatrix(matrix: number[][]): void {
  // Выводим исходную матрицу
  printMatrix(matrix, "Исходная матрица");

  // 1. Определяем количество столбцов без нулевых элементов
  const columnsWithoutZeros = countColumnsWithoutZeros(matrix);
  console.log(
    `\n1. Количество столбцов без нулевых элементов: ${columnsWithoutZeros}`
  );

  // Выводим информацию о столбцах без нулевых элементов
  printColumnsWithoutZeros(matrix);

  // Выводим характеристики строк
  printRowCharacteristics(matrix);

  // 2. Сортируем строки по возрастанию характеристик
  const sortedMatrix = sortRowsByCharacteristic(matrix);

  // Выводим отсортированную матрицу
  printMatrix(sortedMatrix, "Матрица с отсортированными строками");

  // Выводим характеристики отсортированных строк
  printRowCharacteristics(sortedMatrix);
}

// Создаем тестовую матрицу
const rows = 5;
const cols = 6;
const matrix = createRandomMatrix(rows, cols, -10, 10);

// Обрабатываем матрицу
processMatrix(matrix);

// Дополнительный тестовый пример с нулевыми элементами
console.log("\n".padEnd(70, "="));
console.log("Дополнительный тестовый пример:".padEnd(70, "="));

const testMatrix = [
  [4, 0, 7, 2, 6],
  [3, 8, 0, 4, 1],
  [0, 5, 9, 0, 2],
  [6, 2, 4, 8, 0],
  [1, 0, 3, 6, 4],
];

processMatrix(testMatrix);
