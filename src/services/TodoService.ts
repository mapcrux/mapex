import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';

/**
 * Represents a Todo item.
 */
export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Database adapter interface for testability.
 */
export interface DatabaseAdapter {
  executeSql(
    query: string,
    params?: unknown[],
  ): Promise<[{rows: {length: number; item(i: number): Todo}}]>;
}

/**
 * Service responsible for all Todo CRUD operations using SQLite.
 */
export class TodoService {
  private db: DatabaseAdapter | null = null;

  constructor(private adapter?: DatabaseAdapter) {}

  /**
   * Initializes the database connection and creates the todos table if needed.
   */
  async initialize(): Promise<void> {
    if (this.adapter) {
      this.db = this.adapter;
    } else {
      SQLite.enablePromise(true);
      const realDb: SQLiteDatabase = await SQLite.openDatabase({
        name: 'todos.db',
        location: 'default',
      });
      this.db = realDb as unknown as DatabaseAdapter;
    }
    await this.createTable();
  }

  private async createTable(): Promise<void> {
    await this.db!.executeSql(
      `CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        completed INTEGER DEFAULT 0,
        dueDate TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )`,
      [],
    );
  }

  /**
   * Returns all todos ordered by creation date descending.
   */
  async getAllTodos(): Promise<Todo[]> {
    const [results] = await this.db!.executeSql(
      'SELECT * FROM todos ORDER BY createdAt DESC',
      [],
    );
    const todos: Todo[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      todos.push({...row, completed: row.completed === 1});
    }
    return todos;
  }

  /**
   * Returns a single todo by its ID, or null if not found.
   */
  async getTodoById(id: number): Promise<Todo | null> {
    const [results] = await this.db!.executeSql('SELECT * FROM todos WHERE id = ?', [id]);
    if (results.rows.length === 0) {
      return null;
    }
    const row = results.rows.item(0);
    return {...row, completed: row.completed === 1};
  }

  /**
   * Adds a new todo and returns the created record.
   */
  async addTodo(
    todo: Pick<Todo, 'title' | 'description' | 'dueDate'>,
  ): Promise<Todo> {
    const now = new Date().toISOString();
    await this.db!.executeSql(
      'INSERT INTO todos (title, description, completed, dueDate, createdAt, updatedAt) VALUES (?, ?, 0, ?, ?, ?)',
      [todo.title, todo.description, todo.dueDate, now, now],
    );
    const [results] = await this.db!.executeSql(
      'SELECT * FROM todos WHERE createdAt = ? ORDER BY id DESC LIMIT 1',
      [now],
    );
    const row = results.rows.item(0);
    return {...row, completed: row.completed === 1};
  }

  /**
   * Updates a todo's fields and bumps updatedAt.
   */
  async updateTodo(id: number, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>): Promise<void> {
    const updatedAt = new Date().toISOString();
    const fields = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');
    const values = Object.values(updates);
    await this.db!.executeSql(`UPDATE todos SET ${fields}, updatedAt = ? WHERE id = ?`, [
      ...values,
      updatedAt,
      id,
    ]);
  }

  /**
   * Deletes a todo by ID.
   */
  async deleteTodo(id: number): Promise<void> {
    await this.db!.executeSql('DELETE FROM todos WHERE id = ?', [id]);
  }

  /**
   * Toggles the completed status of a todo.
   */
  async toggleTodo(id: number): Promise<void> {
    await this.db!.executeSql(
      'UPDATE todos SET completed = CASE WHEN completed = 0 THEN 1 ELSE 0 END, updatedAt = ? WHERE id = ?',
      [new Date().toISOString(), id],
    );
  }

  /**
   * Closes the database connection.
   */
  close(): void {
    this.db = null;
  }
}

export default new TodoService();
