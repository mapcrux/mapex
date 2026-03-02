import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import TodoItem from '../src/components/TodoItem';
import {Todo} from '../src/services/TodoService';

const baseTodo: Todo = {
  id: 1,
  title: 'Test Todo',
  description: 'Test description',
  completed: false,
  dueDate: null,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

describe('TodoItem', () => {
  it('renders the todo title', () => {
    const {getByText} = render(
      <TodoItem
        todo={baseTodo}
        onToggle={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );
    expect(getByText('Test Todo')).toBeTruthy();
  });

  it('renders the description', () => {
    const {getByText} = render(
      <TodoItem
        todo={baseTodo}
        onToggle={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );
    expect(getByText('Test description')).toBeTruthy();
  });

  it('calls onToggle when the checkbox is pressed', () => {
    const onToggle = jest.fn();
    const {getByLabelText} = render(
      <TodoItem
        todo={baseTodo}
        onToggle={onToggle}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );
    fireEvent.press(getByLabelText('Mark "Test Todo" as complete'));
    expect(onToggle).toHaveBeenCalledWith(1);
  });

  it('calls onEdit when the edit button is pressed', () => {
    const onEdit = jest.fn();
    const {getByLabelText} = render(
      <TodoItem
        todo={baseTodo}
        onToggle={jest.fn()}
        onEdit={onEdit}
        onDelete={jest.fn()}
      />,
    );
    fireEvent.press(getByLabelText('Edit "Test Todo"'));
    expect(onEdit).toHaveBeenCalledWith(baseTodo);
  });

  it('calls onDelete when the delete button is pressed', () => {
    const onDelete = jest.fn();
    const {getByLabelText} = render(
      <TodoItem
        todo={baseTodo}
        onToggle={jest.fn()}
        onEdit={jest.fn()}
        onDelete={onDelete}
      />,
    );
    fireEvent.press(getByLabelText('Delete "Test Todo"'));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('shows overdue indicator for past due todos', () => {
    const overdueTodo: Todo = {
      ...baseTodo,
      dueDate: '2000-01-01T00:00:00.000Z',
    };
    const {getByText} = render(
      <TodoItem
        todo={overdueTodo}
        onToggle={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );
    expect(getByText(/Overdue/)).toBeTruthy();
  });

  it('displays completed icon when todo is completed', () => {
    const completedTodo: Todo = {...baseTodo, completed: true};
    const {getByText} = render(
      <TodoItem
        todo={completedTodo}
        onToggle={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );
    expect(getByText('✓')).toBeTruthy();
  });
});
