import * as readline from "readline";

interface Book {
  udc: string;
  author: string;
  title: string;
  year: number;
  copies: number;
}

class TreeNode {
  book: Book;
  left: TreeNode | null = null;
  right: TreeNode | null = null;

  constructor(book: Book) {
    this.book = book;
  }
}

class BookBinaryTree {
  private root: TreeNode | null = null;

  insert(book: Book): void {
    const newNode = new TreeNode(book);

    if (this.root === null) {
      this.root = newNode;
      return;
    }

    this.insertNode(this.root, newNode);
  }

  private insertNode(node: TreeNode, newNode: TreeNode): void {
    if (newNode.book.udc < node.book.udc) {
      if (node.left === null) {
        node.left = newNode;
      } else {
        this.insertNode(node.left, newNode);
      }
    } else {
      if (node.right === null) {
        node.right = newNode;
      } else {
        this.insertNode(node.right, newNode);
      }
    }
  }

  remove(udc: string): boolean {
    if (this.root === null) {
      return false;
    }

    let found = false;
    this.root = this.removeNode(this.root, udc, { value: found });
    return found;
  }

  private removeNode(
    node: TreeNode | null,
    udc: string,
    found: { value: boolean }
  ): TreeNode | null {
    if (node === null) {
      return null;
    }

    if (udc < node.book.udc) {
      node.left = this.removeNode(node.left, udc, found);
      return node;
    } else if (udc > node.book.udc) {
      node.right = this.removeNode(node.right, udc, found);
      return node;
    } else {
      found.value = true;

      if (node.left === null && node.right === null) {
        return null;
      }

      if (node.left === null) {
        return node.right;
      }
      if (node.right === null) {
        return node.left;
      }

      const minNode = this.findMinNode(node.right);
      node.book = minNode.book;
      node.right = this.removeNode(node.right, minNode.book.udc, {
        value: true,
      });
      return node;
    }
  }

  private findMinNode(node: TreeNode): TreeNode {
    let current = node;
    while (current.left !== null) {
      current = current.left;
    }
    return current;
  }

  search(udc: string): Book | null {
    return this.searchNode(this.root, udc);
  }

  private searchNode(node: TreeNode | null, udc: string): Book | null {
    if (node === null) {
      return null;
    }

    if (udc < node.book.udc) {
      return this.searchNode(node.left, udc);
    } else if (udc > node.book.udc) {
      return this.searchNode(node.right, udc);
    } else {
      return node.book;
    }
  }

  getAllBooksSortedByYear(): Book[] {
    const books: Book[] = [];
    this.inOrderTraversal(this.root, books);
    return books.sort((a, b) => a.year - b.year);
  }

  private inOrderTraversal(node: TreeNode | null, books: Book[]): void {
    if (node !== null) {
      this.inOrderTraversal(node.left, books);
      books.push(node.book);
      this.inOrderTraversal(node.right, books);
    }
  }


  printAllBooks(): void {
    console.log("\nСписок всех книг в библиотеке:".padEnd(50, "="));
    console.log(
      "УДК".padEnd(10) +
        "| " +
        "Автор".padEnd(20) +
        "| " +
        "Название".padEnd(30) +
        "| " +
        "Год".padEnd(6) +
        "| " +
        "Экз."
    );
    console.log("".padEnd(75, "-"));

    const printNode = (node: TreeNode | null): void => {
      if (node !== null) {
        printNode(node.left);
        console.log(
          node.book.udc.padEnd(10) +
            "| " +
            node.book.author.padEnd(20) +
            "| " +
            node.book.title.padEnd(30) +
            "| " +
            node.book.year.toString().padEnd(6) +
            "| " +
            node.book.copies
        );
        printNode(node.right);
      }
    };

    printNode(this.root);
    console.log("".padEnd(75, "-"));
  }
}

class Library {
  private bookTree: BookBinaryTree;
  private rl: readline.Interface;

  constructor() {
    this.bookTree = new BookBinaryTree();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  initializeLibrary(): void {
    const initialBooks: Book[] = [
      {
        udc: "001.123",
        author: "Иванов И.И.",
        title: "Основы программирования",
        year: 2020,
        copies: 5,
      },
      {
        udc: "004.438",
        author: "Петров П.П.",
        title: "TypeScript для начинающих",
        year: 2021,
        copies: 3,
      },
      {
        udc: "004.451",
        author: "Сидоров С.С.",
        title: "Операционные системы",
        year: 2019,
        copies: 7,
      },
      {
        udc: "004.738",
        author: "Козлов К.К.",
        title: "Сети и телекоммуникации",
        year: 2018,
        copies: 2,
      },
      {
        udc: "510.635",
        author: "Смирнов С.М.",
        title: "Дискретная математика",
        year: 2017,
        copies: 4,
      },
      {
        udc: "519.688",
        author: "Николаев Н.Н.",
        title: "Алгоритмы и структуры данных",
        year: 2022,
        copies: 6,
      },
      {
        udc: "621.382",
        author: "Морозов М.М.",
        title: "Электроника",
        year: 2020,
        copies: 3,
      },
    ];

    initialBooks.forEach((book) => this.bookTree.insert(book));
    console.log("Библиотека инициализирована начальными данными.");
  }

  async addBook(): Promise<void> {
    console.log("\nДобавление новой книги:".padEnd(50, "-"));

    const udc = await this.askQuestion("Введите номер УДК: ");


    const existingBook = this.bookTree.search(udc);
    if (existingBook) {
      console.log(`Книга с УДК ${udc} уже существует в библиотеке.`);
      const addCopies = await this.askQuestion(
        "Хотите добавить экземпляры? (да/нет): "
      );

      if (addCopies.toLowerCase() === "да") {
        const copiesStr = await this.askQuestion(
          "Введите количество новых экземпляров: "
        );
        const copies = parseInt(copiesStr);

        if (!isNaN(copies) && copies > 0) {

          this.bookTree.remove(udc);
          existingBook.copies += copies;
          this.bookTree.insert(existingBook);
          console.log(
            `Добавлено ${copies} экземпляров книги. Теперь всего: ${existingBook.copies}`
          );
        } else {
          console.log("Некорректное количество экземпляров.");
        }
      }
      return;
    }

    const author = await this.askQuestion(
      "Введите фамилию и инициалы автора: "
    );
    const title = await this.askQuestion("Введите название книги: ");
    const yearStr = await this.askQuestion("Введите год издания: ");
    const year = parseInt(yearStr);
    const copiesStr = await this.askQuestion(
      "Введите количество экземпляров: "
    );
    const copies = parseInt(copiesStr);

    if (isNaN(year) || isNaN(copies) || copies <= 0) {
      console.log("Некорректные данные. Книга не добавлена.");
      return;
    }

    const newBook: Book = { udc, author, title, year, copies };
    this.bookTree.insert(newBook);
    console.log("Книга успешно добавлена в библиотеку.");
  }

  async removeBook(): Promise<void> {
    console.log("\nУдаление книги:".padEnd(50, "-"));

    const udc = await this.askQuestion(
      "Введите номер УДК книги для удаления: "
    );

    const existingBook = this.bookTree.search(udc);
    if (!existingBook) {
      console.log(`Книга с УДК ${udc} не найдена в библиотеке.`);
      return;
    }

    console.log(
      `Найдена книга: ${existingBook.author} - "${existingBook.title}" (${existingBook.year}), экземпляров: ${existingBook.copies}`
    );

    const removeAll = await this.askQuestion(
      "Удалить все экземпляры? (да/нет): "
    );

    if (removeAll.toLowerCase() === "да") {
      this.bookTree.remove(udc);
      console.log("Книга полностью удалена из библиотеки.");
    } else {
      const countStr = await this.askQuestion(
        "Введите количество экземпляров для удаления: "
      );
      const count = parseInt(countStr);

      if (isNaN(count) || count <= 0) {
        console.log("Некорректное количество. Операция отменена.");
        return;
      }

      if (count >= existingBook.copies) {
        this.bookTree.remove(udc);
        console.log("Все экземпляры книги удалены из библиотеки.");
      } else {
        this.bookTree.remove(udc);
        existingBook.copies -= count;
        this.bookTree.insert(existingBook);
        console.log(
          `Удалено ${count} экземпляров книги. Осталось: ${existingBook.copies}`
        );
      }
    }
  }

  async searchBook(): Promise<void> {
    console.log("\nПоиск книги:".padEnd(50, "-"));

    const udc = await this.askQuestion("Введите номер УДК для поиска: ");

    const book = this.bookTree.search(udc);
    if (book) {
      console.log("\nНайдена книга:".padEnd(50, "-"));
      console.log("УДК:".padEnd(20) + book.udc);
      console.log("Автор:".padEnd(20) + book.author);
      console.log("Название:".padEnd(20) + book.title);
      console.log("Год издания:".padEnd(20) + book.year);
      console.log("Экземпляров:".padEnd(20) + book.copies);
    } else {
      console.log(`Книга с УДК ${udc} не найдена в библиотеке.`);
    }
  }

  displayBooksSortedByYear(): void {
    const books = this.bookTree.getAllBooksSortedByYear();

    console.log(
      "\nСписок книг, отсортированный по году издания:".padEnd(50, "=")
    );
    console.log(
      "УДК".padEnd(10) +
        "| " +
        "Автор".padEnd(20) +
        "| " +
        "Название".padEnd(30) +
        "| " +
        "Год".padEnd(6) +
        "| " +
        "Экз."
    );
    console.log("".padEnd(75, "-"));

    books.forEach((book) => {
      console.log(
        book.udc.padEnd(10) +
          "| " +
          book.author.padEnd(20) +
          "| " +
          book.title.padEnd(30) +
          "| " +
          book.year.toString().padEnd(6) +
          "| " +
          book.copies
      );
    });

    console.log("".padEnd(75, "-"));
  }

  displayAllBooks(): void {
    this.bookTree.printAllBooks();
  }

  private askQuestion(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  }

  async run(): Promise<void> {
    console.log("Программа управления библиотечным фондом".padEnd(70, "="));
    console.log(
      "Используется бинарное дерево поиска для хранения информации о книгах"
    );

    this.initializeLibrary();

    let running = true;

    while (running) {
      console.log("\nГлавное меню:".padEnd(50, "-"));
      console.log("1. Добавить новую книгу");
      console.log("2. Удалить книгу");
      console.log("3. Найти книгу по УДК");
      console.log("4. Показать все книги");
      console.log("5. Показать книги, отсортированные по году издания");
      console.log("0. Выход");

      const choice = await this.askQuestion("\nВыберите действие (0-5): ");

      switch (choice) {
        case "1":
          await this.addBook();
          break;
        case "2":
          await this.removeBook();
          break;
        case "3":
          await this.searchBook();
          break;
        case "4":
          this.displayAllBooks();
          break;
        case "5":
          this.displayBooksSortedByYear();
          break;
        case "0":
          running = false;
          console.log("\nПрограмма завершена.");
          break;
        default:
          console.log(
            "Некорректный выбор. Пожалуйста, выберите действие от 0 до 5."
          );
      }
    }

    this.rl.close();
  }
}

const library = new Library();
library.run();
