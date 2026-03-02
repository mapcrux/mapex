import {TodoService, DatabaseAdapter, Todo} from '../src/services/TodoService';

/** Builds a mock DatabaseAdapter that returns preset row data. */
function buildAdapter(rows: Partial<Todo>[] = []): DatabaseAdapter {
  return {
    executeSql: jest.fn().mockResolvedValue([
      {
        rows: {
          length: rows.length,
          item: (i: number) => rows[i],
        },
      },
    ]),
  };
}

describe('TodoService', () => {
  const baseTodo: Todo = {
    id: 1,
    title: 'Test Todo',
    description: 'A description',
    completed: false,
    dueDate: null,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  };

  it('initialize creates the todos table', async () => {
    const adapter = buildAdapter();
    const service = new TodoService(adapter);
    await service.initialize();
    expect(adapter.executeSql).toHaveBeenCalledWith(
      expect.stringContaining('CREATE TABLE IF NOT EXISTS todos'),
      [],
    );
  });

  it('getAllTodos returns an array of todos', async () => {
    const rawRow = {...baseTodo, completed: 0};
    const adapter = buildAdapter([rawRow] as unknown as Partial<Todo>[]);
    const service = new TodoService(adapter);
    await service.initialize();

    // Reset mock to return the todo row for getAllTodos
    (adapter.executeSql as jest.Mock).mockResolvedValueOnce([
      {
        rows: {
          length: 1,
          item: () => rawRow,
        },
      },
    ]);

    const todos = await service.getAllTodos();
    expect(todos).toHaveLength(1);
    expect(todos[0].title).toBe('Test Todo');
    expect(todos[0].completed).toBe(false);
  });

  it('addTodo inserts a record and returns the created todo', async () => {
    const rawRow = {...baseTodo, completed: 0};
    const adapter: DatabaseAdapter = {
      executeSql: jest
        .fn()
        // createTable
        .mockResolvedValueOnce([{rows: {length: 0, item: jest.fn()}}])
        // INSERT
        .mockResolvedValueOnce([{rows: {length: 0, item: jest.fn()}}])
        // SELECT after insert
        .mockResolvedValueOnce([{rows: {length: 1, item: () => rawRow}}]),
    };

    const service = new TodoService(adapter);
    await service.initialize();

    const created = await service.addTodo({
      title: 'Test Todo',
      description: 'A description',
      dueDate: null,
    });

    expect(created.title).toBe('Test Todo');
    expect(created.completed).toBe(false);
  });

  it('updateTodo calls executeSql with correct fields', async () => {
    const adapter = buildAdapter();
    const service = new TodoService(adapter);
    await service.initialize();

    await service.updateTodo(1, {title: 'Updated Title'});

    const calls = (adapter.executeSql as jest.Mock).mock.calls;
    const updateCall = calls.find((c: unknown[]) =>
      typeof c[0] === 'string' && c[0].startsWith('UPDATE todos SET'),
    );
    expect(updateCall).toBeDefined();
    expect(updateCall[0]).toContain('title = ?');
    expect(updateCall[1]).toContain('Updated Title');
  });

  it('deleteTodo executes DELETE with correct id', async () => {
    const adapter = buildAdapter();
    const service = new TodoService(adapter);
    await service.initialize();

    await service.deleteTodo(42);

    const calls = (adapter.executeSql as jest.Mock).mock.calls;
    const deleteCall = calls.find((c: unknown[]) =>
      typeof c[0] === 'string' && c[0].includes('DELETE FROM todos'),
    );
    expect(deleteCall).toBeDefined();
    expect(deleteCall[1]).toContain(42);
  });

  it('toggleTodo executes UPDATE with CASE WHEN', async () => {
    const adapter = buildAdapter();
    const service = new TodoService(adapter);
    await service.initialize();

    await service.toggleTodo(5);

    const calls = (adapter.executeSql as jest.Mock).mock.calls;
    const toggleCall = calls.find((c: unknown[]) =>
      typeof c[0] === 'string' && c[0].includes('CASE WHEN completed'),
    );
    expect(toggleCall).toBeDefined();
    expect(toggleCall[1]).toContain(5);
  });
});
