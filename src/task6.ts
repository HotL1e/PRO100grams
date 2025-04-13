import * as readline from "readline";

interface STUDENT {
  fullName: string;
  groupNumber: number;
  grades: number[];
}

function calculateAverageGrade(student: STUDENT): number {
  const sum = student.grades.reduce((acc, grade) => acc + grade, 0);
  return sum / student.grades.length;
}

function hasGradeFive(student: STUDENT): boolean {
  return student.grades.includes(5);
}

async function inputStudent(
  rl: readline.Interface,
  index: number
): Promise<STUDENT> {
  console.log(`\nВвод данных для студента ${index + 1}:`.padEnd(40, "-"));

  return new Promise((resolve) => {
    rl.question("Введите фамилию и инициалы: ", (fullName) => {
      rl.question("Введите номер группы: ", (groupNumberStr) => {
        const groupNumber = parseInt(groupNumberStr);
        const grades: number[] = [];

        console.log("Введите 5 оценок:");

        const askGrade = (gradeIndex: number) => {
          if (gradeIndex >= 5) {
            resolve({
              fullName,
              groupNumber,
              grades,
            });
            return;
          }

          rl.question(`Оценка ${gradeIndex + 1}: `, (gradeStr) => {
            const grade = parseInt(gradeStr);

            if (grade >= 2 && grade <= 5) {
              grades.push(grade);
              askGrade(gradeIndex + 1);
            } else {
              console.log(
                "Некорректная оценка. Допустимые значения: 2, 3, 4, 5. Повторите ввод."
              );
              askGrade(gradeIndex);
            }
          });
        };

        askGrade(0);
      });
    });
  });
}

function displayStudent(student: STUDENT, index: number): void {
  const avgGrade = calculateAverageGrade(student);

  console.log(
    `${(index + 1).toString().padEnd(3)} | ${student.fullName.padEnd(20)} | ${
      student.groupNumber
    } | ${avgGrade.toFixed(2)}`
  );
}

function displayStudents(students: STUDENT[], title: string): void {
  console.log(`\n${title}:`.padEnd(50, "="));
  console.log("№   | ФИО                  | Группа | Средний балл");
  console.log("".padEnd(60, "-"));

  students.forEach((student, index) => {
    displayStudent(student, index);
  });

  console.log("".padEnd(60, "-"));
}

function displayStudentsWithGradeFive(students: STUDENT[]): void {
  const studentsWithFive = students.filter(hasGradeFive);

  console.log("\nСтуденты, имеющие оценки 5:".padEnd(50, "="));

  if (studentsWithFive.length === 0) {
    console.log("Студентов с оценками 5 не найдено.");
    return;
  }

  console.log("№   | ФИО                  | Группа | Средний балл");
  console.log("".padEnd(60, "-"));

  studentsWithFive.forEach((student, index) => {
    displayStudent(student, index);
  });

  console.log("".padEnd(60, "-"));
}

function sortStudentsByAverageGrade(students: STUDENT[]): STUDENT[] {
  return [...students].sort((a, b) => {
    const avgA = calculateAverageGrade(a);
    const avgB = calculateAverageGrade(b);
    return avgA - avgB;
  });
}

async function main(): Promise<void> {
  console.log(
    "Программа обработки массива структур STUDENT (Вариант 2)".padEnd(70, "=")
  );
  console.log(
    "Структура STUDENT содержит поля: фамилия и инициалы, номер группы, успеваемость (5 оценок)"
  );

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const numStudents = 10;
  console.log(`\nВведите данные для ${numStudents} студентов:`);

  const students: STUDENT[] = [];

  for (let i = 0; i < numStudents; i++) {
    const student = await inputStudent(rl, i);
    students.push(student);
  }

  displayStudents(students, "Исходный список студентов");

  const sortedStudents = sortStudentsByAverageGrade(students);

  displayStudents(
    sortedStudents,
    "Список студентов, отсортированный по возрастанию среднего балла"
  );

  displayStudentsWithGradeFive(students);

  console.log("\nПрограмма завершена.");
  rl.close();
}

main();