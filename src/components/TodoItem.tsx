import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Todo} from '../services/TodoService';
import {formatDate, isOverdue} from '../utils/dateUtils';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

/**
 * Presentational component that displays a single Todo item with toggle,
 * edit and delete actions.
 */
const TodoItem: React.FC<TodoItemProps> = ({todo, onToggle, onEdit, onDelete}) => {
  const overdue = !todo.completed && isOverdue(todo.dueDate);

  return (
    <View style={[styles.container, todo.completed && styles.completed]}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => onToggle(todo.id)}
        accessibilityRole="checkbox"
        accessibilityState={{checked: todo.completed}}
        accessibilityLabel={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}>
        <Text style={styles.checkboxText}>{todo.completed ? '✓' : '○'}</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={[styles.title, todo.completed && styles.titleCompleted]}>{todo.title}</Text>
        {!!todo.description && <Text style={styles.description}>{todo.description}</Text>}
        {todo.dueDate !== null && (
          <Text style={[styles.dueDate, overdue && styles.overdue]}>
            {overdue ? '⚠ Overdue: ' : 'Due: '}
            {formatDate(todo.dueDate)}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => onEdit(todo)}
          style={styles.actionButton}
          accessibilityLabel={`Edit "${todo.title}"`}>
          <Text style={styles.actionText}>✏</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(todo.id)}
          style={styles.actionButton}
          accessibilityLabel={`Delete "${todo.title}"`}>
          <Text style={[styles.actionText, styles.deleteText]}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  completed: {
    opacity: 0.6,
  },
  checkbox: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxText: {
    fontSize: 20,
    color: '#4CAF50',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9E9E9E',
  },
  description: {
    fontSize: 13,
    color: '#757575',
    marginTop: 2,
  },
  dueDate: {
    fontSize: 12,
    color: '#616161',
    marginTop: 4,
  },
  overdue: {
    color: '#F44336',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 6,
    marginLeft: 4,
  },
  actionText: {
    fontSize: 18,
    color: '#616161',
  },
  deleteText: {
    color: '#F44336',
  },
});

export default TodoItem;
