/**
 * Программа для вычисления значения функции, заданной рядом Тейлора
 * Вариант 2: x - x²/√2 + x³/√3 + x⁴/2 + x⁵/√5 - ...
 */

/**
 * Вычисляет значение n-го члена ряда Тейлора
 * @param x аргумент функции
 * @param n номер члена ряда (начиная с 1)
 * @returns значение n-го члена ряда
 */
function getTerm(x: number, n: number): number {
  // Знак члена ряда: (-1)^(n+1)
  const sign = n % 2 === 1 ? 1 : -1;

  // Знаменатель: √n для нечетных n, n/2 для четных n
  let denominator: number;
  if (n % 2 === 1) {
    denominator = Math.sqrt(n);
  } else {
    denominator = n / 2;
  }

  // Возвращаем член ряда: sign * x^n / denominator
  return (sign * Math.pow(x, n)) / denominator;
}

/**
 * Вычисляет значение функции с заданной точностью
 * @param x аргумент функции
 * @param epsilon требуемая точность
 * @param maxTerms максимальное количество членов ряда
 * @returns значение функции и количество использованных членов ряда
 */
function calculateFunction(
  x: number,
  epsilon: number,
  maxTerms: number = 100
): { result: number; terms: number } {
  let sum = 0;
  let term = 0;
  let n = 1;

  do {
    term = getTerm(x, n);
    sum += term;
    n++;

    if (n > maxTerms) {
      break;
    }
  } while (Math.abs(term) > epsilon);

  return {
    result: sum,
    terms: n - 1,
  };
}

/**
 * Выводит таблицу значений функции на заданном интервале
 * @param xStart начальное значение x
 * @param xEnd конечное значение x
 * @param step шаг изменения x
 * @param epsilon требуемая точность
 */
function printTable(
  xStart: number,
  xEnd: number,
  step: number,
  epsilon: number
): void {
  console.log(
    `Интервал: от ${xStart} до ${xEnd}, шаг: ${step}, точность: ${epsilon}`
  );
  console.log("--------------------------------------------------");
  console.log("| x      | Значение функции | Использовано членов |");
  console.log("--------------------------------------------------");

  for (let x = xStart; x <= xEnd; x += step) {
    const { result, terms } = calculateFunction(x, epsilon);
    console.log(
      `| ${x.toFixed(4).padEnd(7)} | ${result.toFixed(10).padEnd(17)} | ${terms
        .toString()
        .padEnd(19)} |`
    );
  }

  console.log("--------------------------------------------------");
}

// Параметры расчета
const xStart = -1.0; // начальное значение x
const xEnd = 1.0; // конечное значение x
const step = 0.1; // шаг изменения x
const epsilon = 1e-6; // требуемая точность

// Вывод таблицы значений
printTable(xStart, xEnd, step, epsilon);
