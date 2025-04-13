/**
 * Программа для расчета значений по формулам варианта 2
 */

/**
 * Расчет значения z1 по формуле: z1 = cos α + sin α + cos 3α + sin 3α
 * @param alpha угол в радианах
 * @returns значение z1
 */
function calculateZ1(alpha: number): number {
  return (
    Math.cos(alpha) +
    Math.sin(alpha) +
    Math.cos(3 * alpha) +
    Math.sin(3 * alpha)
  );
}

/**
 * Расчет значения z2 по формуле: z2 = 2√2 cos α · sin(π/2 - 2α)
 * @param alpha угол в радианах
 * @returns значение z2
 */
function calculateZ2(alpha: number): number {
  return 2 * Math.sqrt(2) * Math.cos(alpha) * Math.sin(Math.PI / 2 - 2 * alpha);
}

/**
 * Функция для проверки эквивалентности формул
 * @param alpha угол в радианах
 * @returns объект с результатами расчетов
 */
function compareResults(alpha: number): {
  alpha: number;
  z1: number;
  z2: number;
  difference: number;
} {
  const z1 = calculateZ1(alpha);
  const z2 = calculateZ2(alpha);
  return {
    alpha: alpha,
    z1: z1,
    z2: z2,
    difference: Math.abs(z1 - z2),
  };
}

/**
 * Запуск тестовых примеров с форматированным выводом
 */
function run(): void {
  console.log("Тестовые примеры для проверки формул:".padEnd(60, "="));
  console.log(
    "| α (рад)".padEnd(12) +
      "| α (град)".padEnd(12) +
      "| z1".padEnd(15) +
      "| z2".padEnd(15) +
      "| |z1-z2|".padEnd(12) +
      "|"
  );
  console.log(
    "|" +
      "-".repeat(10) +
      "|" +
      "-".repeat(11) +
      "|" +
      "-".repeat(13) +
      "|" +
      "-".repeat(13) +
      "|" +
      "-".repeat(10) +
      "|"
  );

  // Проверка для различных значений угла
  const testAngles = [
    0,
    Math.PI / 6, // 30°
    Math.PI / 4, // 45°
    Math.PI / 3, // 60°
    Math.PI / 2, // 90°
    Math.PI, // 180°
    (3 * Math.PI) / 2, // 270°
    2 * Math.PI, // 360°
  ];

  testAngles.forEach((alpha) => {
    const result = compareResults(alpha);
    console.log(
      "| " +
        alpha.toFixed(4).padEnd(9) +
        "| " +
        ((alpha * 180) / Math.PI).toFixed(1).padEnd(9) +
        "°" +
        "| " +
        result.z1.toFixed(6).padEnd(12) +
        "| " +
        result.z2.toFixed(6).padEnd(12) +
        "| " +
        result.difference.toFixed(8).padEnd(9) +
        "|"
    );
  });

  console.log("".padEnd(60, "="));
}

run();
