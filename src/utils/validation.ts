const TITLE_MAX_LENGTH = 200;
const DESCRIPTION_MAX_LENGTH = 1000;

/**
 * Validates a todo title.
 * @param title - The title string to validate.
 */
export function validateTodoTitle(title: string): {valid: boolean; error?: string} {
  const trimmed = title.trim();
  if (!trimmed) {
    return {valid: false, error: 'Title is required.'};
  }
  if (trimmed.length > TITLE_MAX_LENGTH) {
    return {valid: false, error: `Title must be ${TITLE_MAX_LENGTH} characters or fewer.`};
  }
  return {valid: true};
}

/**
 * Validates a todo description.
 * @param description - The description string to validate.
 */
export function validateTodoDescription(description: string): {valid: boolean; error?: string} {
  if (description.length > DESCRIPTION_MAX_LENGTH) {
    return {
      valid: false,
      error: `Description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer.`,
    };
  }
  return {valid: true};
}

/**
 * Validates a todo due date.
 * @param dueDate - The due date to validate, or null for no due date.
 */
export function validateDueDate(dueDate: Date | null): {valid: boolean; error?: string} {
  if (!dueDate) {
    return {valid: true};
  }
  if (dueDate <= new Date()) {
    return {valid: false, error: 'Due date must be in the future.'};
  }
  return {valid: true};
}
