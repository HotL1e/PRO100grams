function sumPositiveElements(arr: number[]): number {
  return arr.reduce((sum, current) => {
    return current > 0 ? sum + current : sum;
  }, 0);
}

function findMaxAbsIndex(arr: number[]): number {
  let maxAbsIndex = 0;
  let maxAbsValue = Math.abs(arr[0]);

  for (let i = 1; i < arr.length; i++) {
    const absValue = Math.abs(arr[i]);
    if (absValue > maxAbsValue) {
      maxAbsValue = absValue;
      maxAbsIndex = i;
    }
  }

  return maxAbsIndex;
}

function findMinAbsIndex(arr: number[]): number {
  let minAbsIndex = 0;
  let minAbsValue = Math.abs(arr[0]);

  for (let i = 1; i < arr.length; i++) {
    const absValue = Math.abs(arr[i]);
    if (absValue < minAbsValue) {
      minAbsValue = absValue;
      minAbsIndex = i;
    }
  }

  return minAbsIndex;
}

function productBetweenMaxMinAbs(arr: number[]): number {
  const maxAbsIndex = findMaxAbsIndex(arr);
  const minAbsIndex = findMinAbsIndex(arr);

  const startIndex = Math.min(maxAbsIndex, minAbsIndex) + 1;
  const endIndex = Math.max(maxAbsIndex, minAbsIndex);

  if (startIndex >= endIndex) {
    return 0;
  }

  let product = 1;
  for (let i = startIndex; i < endIndex; i++) {
    product *= arr[i];
  }

  return product;
}

function sortDescending(arr: number[]): number[] {
  const sortedArr = [...arr];
  return sortedArr.sort((a, b) => b - a);
}

function processArray(arr: number[]): void {
  console.log("Исходный массив:");
  console.log(arr.join(", "));

  const sumPositive = sumPositiveElements(arr);
  console.log(`\n1. Сумма положительных элементов: ${sumPositive.toFixed(2)}`);

  const maxAbsIndex = findMaxAbsIndex(arr);
  const minAbsIndex = findMinAbsIndex(arr);
  const product = productBetweenMaxMinAbs(arr);

  console.log(
    `\n2. Произведение элементов между максимальным и минимальным по модулю:`
  );
  console.log(
    `   Максимальный по модулю элемент: ${arr[maxAbsIndex]
      .toString()
      .padEnd(6)} (индекс: ${maxAbsIndex})`
  );
  console.log(
    `   Минимальный по модулю элемент: ${arr[minAbsIndex]
      .toString()
      .padEnd(6)} (индекс: ${minAbsIndex})`
  );

  if (Math.abs(maxAbsIndex - minAbsIndex) <= 1) {
    console.log("   Между этими элементами нет других элементов");
  } else {
    const startIndex = Math.min(maxAbsIndex, minAbsIndex) + 1;
    const endIndex = Math.max(maxAbsIndex, minAbsIndex);
    const elementsBetween = arr.slice(startIndex, endIndex);
    console.log(`   Элементы между ними: ${elementsBetween.join(", ")}`);
    console.log(`   Произведение: ${product.toFixed(2)}`);
  }

  const sortedArr = sortDescending(arr);
  console.log("\n3. Массив, отсортированный по убыванию:");
  console.log(sortedArr.join(", "));
}

function printArrayTable(arr: number[]): void {
  console.log("\nТаблица элементов массива:");
  console.log("--------------------------------------------------");
  console.log("| Индекс | Значение | Модуль  | Знак     |");
  console.log("--------------------------------------------------");

  arr.forEach((value, index) => {
    const absValue = Math.abs(value);
    const sign =
      value < 0 ? "Отрицательный" : value > 0 ? "Положительный" : "Нулевой";

    console.log(
      `| ${index.toString().padEnd(6)} | ${value
        .toFixed(2)
        .padEnd(8)} | ${absValue.toFixed(2).padEnd(7)} | ${sign.padEnd(9)} |`
    );
  });

  console.log("--------------------------------------------------");
}

function runTests(): void {
  console.log(
    "=== Тест 1: Массив с положительными и отрицательными числами ===".padEnd(
      70,
      "="
    )
  );
  const test1 = [5.2, -3.1, 0.7, -8.4, 2.5, 1.3, -4.6, 0.2];
  processArray(test1);
  printArrayTable(test1);

  console.log("\n=== Тест 2: Массив с нулевыми элементами ===".padEnd(70, "="));
  const test2 = [7.1, 0, -2.3, 4.5, 0, 6.8, -1.2];
  processArray(test2);
  printArrayTable(test2);

  console.log(
    "\n=== Тест 3: Массив с одинаковыми по модулю элементами ===".padEnd(
      70,
      "="
    )
  );
  const test3 = [3.5, -3.5, 2.0, -2.0, 1.5, -1.5];
  processArray(test3);
  printArrayTable(test3);
}

runTests();
