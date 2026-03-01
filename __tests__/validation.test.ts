import {
  validateTodoTitle,
  validateTodoDescription,
  validateDueDate,
} from '../src/utils/validation';

describe('validateTodoTitle', () => {
  it('returns valid for a normal title', () => {
    expect(validateTodoTitle('Buy groceries')).toEqual({valid: true});
  });

  it('returns invalid for an empty string', () => {
    const result = validateTodoTitle('');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('returns invalid for a whitespace-only string', () => {
    const result = validateTodoTitle('   ');
    expect(result.valid).toBe(false);
  });

  it('returns invalid for a title exceeding 200 characters', () => {
    const longTitle = 'a'.repeat(201);
    const result = validateTodoTitle(longTitle);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('200');
  });

  it('returns valid for exactly 200 characters', () => {
    const title = 'a'.repeat(200);
    expect(validateTodoTitle(title)).toEqual({valid: true});
  });
});

describe('validateTodoDescription', () => {
  it('returns valid for an empty description', () => {
    expect(validateTodoDescription('')).toEqual({valid: true});
  });

  it('returns valid for a normal description', () => {
    expect(validateTodoDescription('Some details')).toEqual({valid: true});
  });

  it('returns invalid for a description exceeding 1000 characters', () => {
    const long = 'b'.repeat(1001);
    const result = validateTodoDescription(long);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('1000');
  });

  it('returns valid for exactly 1000 characters', () => {
    const desc = 'c'.repeat(1000);
    expect(validateTodoDescription(desc)).toEqual({valid: true});
  });
});

describe('validateDueDate', () => {
  it('returns valid when dueDate is null', () => {
    expect(validateDueDate(null)).toEqual({valid: true});
  });

  it('returns valid for a future date', () => {
    const future = new Date();
    future.setDate(future.getDate() + 1);
    expect(validateDueDate(future)).toEqual({valid: true});
  });

  it('returns invalid for a past date', () => {
    const past = new Date();
    past.setDate(past.getDate() - 1);
    const result = validateDueDate(past);
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });
});
