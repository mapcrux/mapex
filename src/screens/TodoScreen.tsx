import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import todoServiceInstance, {Todo, TodoService} from '../services/TodoService';
import TodoItem from '../components/TodoItem';
import AddTodoModal from '../components/AddTodoModal';

interface TodoScreenProps {
  service?: TodoService;
}

/**
 * Main screen for the Todo app.
 * Loads todos from SQLite and allows adding, editing, deleting and toggling them.
 */
const TodoScreen: React.FC<TodoScreenProps> = ({service}) => {
  const activeService = service ?? todoServiceInstance;

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>(undefined);

  const loadTodos = useCallback(async () => {
    try {
      setError(null);
      const data = await activeService.getAllTodos();
      setTodos(data);
    } catch (err) {
      setError('Failed to load todos. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [activeService]);

  useEffect(() => {
    activeService
      .initialize()
      .then(loadTodos)
      .catch(() => {
        setError('Failed to initialize the database.');
        setLoading(false);
      });

    return () => {
      activeService.close();
    };
  }, [activeService, loadTodos]);

  const handleToggle = async (id: number) => {
    try {
      await activeService.toggleTodo(id);
      await loadTodos();
    } catch {
      Alert.alert('Error', 'Could not update todo.');
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Alert.alert('Delete Todo', 'Are you sure you want to delete this todo?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await activeService.deleteTodo(id);
            await loadTodos();
          } catch {
            Alert.alert('Error', 'Could not delete todo.');
          }
        },
      },
    ]);
  };

  const handleSave = async (todoData: Partial<Todo>) => {
    try {
      if (editingTodo) {
        await activeService.updateTodo(editingTodo.id, todoData);
      } else {
        await activeService.addTodo({
          title: todoData.title ?? '',
          description: todoData.description ?? '',
          dueDate: todoData.dueDate ?? null,
        });
      }
      setEditingTodo(undefined);
      await loadTodos();
    } catch {
      Alert.alert('Error', 'Could not save todo.');
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditingTodo(undefined);
  };

  const handleAddPress = () => {
    setEditingTodo(undefined);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.heading}>My Todos</Text>
        <Text style={styles.count}>{todos.length} item{todos.length !== 1 ? 's' : ''}</Text>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={todos}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => (
          <TodoItem
            todo={item}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No todos yet. Tap + to add one!</Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity style={styles.fab} onPress={handleAddPress} accessibilityLabel="Add todo">
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <AddTodoModal
        visible={modalVisible}
        onClose={handleModalClose}
        onSave={handleSave}
        initialTodo={editingTodo}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#1976D2',
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  count: {
    fontSize: 14,
    color: '#BBDEFB',
  },
  errorBanner: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 6,
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
  },
  list: {
    paddingVertical: 8,
  },
  empty: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: 16,
    color: '#9E9E9E',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1976D2',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 28,
    color: '#ffffff',
    lineHeight: 32,
  },
});

export default TodoScreen;
