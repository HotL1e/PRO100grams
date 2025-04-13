/**
 * Программа обработки массива структур STUDENT
 * Вариант 2:
 * - Ввод с клавиатуры данных в массив, состоящий из десяти структур типа STUDENT
 * - Записи должны быть упорядочены по возрастанию среднего балла
 * - Вывод на дисплей фамилий и номеров групп для всех студентов, имеющих оценки 5
 * - Если таких студентов нет, вывести соответствующее сообщение
 */

import * as readline from "readline";

/**
 * Структура STUDENT
 */
interface STUDENT {
  /** Фамилия и инициалы */
  fullName: string;
  /** Номер группы */
  groupNumber: number;
  /** Успеваемость (массив из пяти элементов) */
  grades: number[];
}

/**
 * Вычисляет средний балл студента
 * @param student объект типа STUDENT
 * @returns средний балл
 */
function calculateAverageGrade(student: STUDENT): number {
  const sum = student.grades.reduce((acc, grade) => acc + grade, 0);
  return sum / student.grades.length;
}

/**
 * Проверяет, имеет ли студент оценки 5
 * @param student объект типа STUDENT
 * @returns true, если студент имеет хотя бы одну оценку 5
 */
function hasGradeFive(student: STUDENT): boolean {
  return student.grades.includes(5);
}

/**
 * Запрашивает у пользователя данные о студенте
 * @param rl интерфейс readline
 * @param index индекс студента
 * @returns Promise с объектом STUDENT
 */
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

/**
 * Выводит информацию о студенте
 * @param student объект типа STUDENT
 * @param index индекс студента
 */
function displayStudent(student: STUDENT, index: number): void {
  const avgGrade = calculateAverageGrade(student);

  console.log(
    `${(index + 1).toString().padEnd(3)} | ${student.fullName.padEnd(20)} | ${
      student.groupNumber
    } | ${avgGrade.toFixed(2)}`
  );
}

/**
 * Выводит список студентов
 * @param students массив объектов STUDENT
 * @param title заголовок списка
 */
function displayStudents(students: STUDENT[], title: string): void {
  console.log(`\n${title}:`.padEnd(50, "="));
  console.log("№   | ФИО                  | Группа | Средний балл");
  console.log("".padEnd(60, "-"));

  students.forEach((student, index) => {
    displayStudent(student, index);
  });

  console.log("".padEnd(60, "-"));
}

/**
 * Выводит список студентов с оценками 5
 * @param students массив объектов STUDENT
 */
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

/**
 * Сортирует массив студентов по возрастанию среднего балла
 * @param students массив объектов STUDENT
 * @returns отсортированный массив
 */
function sortStudentsByAverageGrade(students: STUDENT[]): STUDENT[] {
  return [...students].sort((a, b) => {
    const avgA = calculateAverageGrade(a);
    const avgB = calculateAverageGrade(b);
    return avgA - avgB;
  });
}

/**
 * Основная функция программы
 */
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

  // Вводим данные с клавиатуры
  const numStudents = 10;
  console.log(`\nВведите данные для ${numStudents} студентов:`);

  const students: STUDENT[] = [];

  for (let i = 0; i < numStudents; i++) {
    const student = await inputStudent(rl, i);
    students.push(student);
  }

  // Выводим исходный список студентов
  displayStudents(students, "Исходный список студентов");

  // Сортируем студентов по возрастанию среднего балла
  const sortedStudents = sortStudentsByAverageGrade(students);

  // Выводим отсортированный список
  displayStudents(
    sortedStudents,
    "Список студентов, отсортированный по возрастанию среднего балла"
  );

  // Выводим студентов с оценками 5
  displayStudentsWithGradeFive(students);

  console.log("\nПрограмма завершена.");
  rl.close();
}

// Запуск программы
main();
