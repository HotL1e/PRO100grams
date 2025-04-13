function getTerm(x: number, n: number): number {
  const sign = n % 2 === 1 ? 1 : -1;

  let denominator: number;
  if (n % 2 === 1) {
    denominator = Math.sqrt(n);
  } else {
    denominator = n / 2;
  }

  return (sign * Math.pow(x, n)) / denominator;
}

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

const xStart = -1.0;
const xEnd = 1.0;
const step = 0.1;
const epsilon = 1e-6;

printTable(xStart, xEnd, step, epsilon);
