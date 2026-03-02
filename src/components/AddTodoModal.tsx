import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {Todo} from '../services/TodoService';
import {validateTodoTitle, validateTodoDescription, validateDueDate} from '../utils/validation';
import DatePickerInput from './DatePickerInput';

interface AddTodoModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (todo: Partial<Todo>) => void;
  initialTodo?: Todo;
}

/**
 * Modal component for creating and editing Todo items.
 * Validates inputs before invoking onSave.
 */
const AddTodoModal: React.FC<AddTodoModalProps> = ({visible, onClose, onSave, initialTodo}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [titleError, setTitleError] = useState<string | undefined>();
  const [descriptionError, setDescriptionError] = useState<string | undefined>();
  const [dueDateError, setDueDateError] = useState<string | undefined>();

  useEffect(() => {
    if (visible) {
      setTitle(initialTodo?.title ?? '');
      setDescription(initialTodo?.description ?? '');
      setDueDate(initialTodo?.dueDate ? new Date(initialTodo.dueDate) : null);
      setTitleError(undefined);
      setDescriptionError(undefined);
      setDueDateError(undefined);
    }
  }, [visible, initialTodo]);

  const handleSave = () => {
    const titleResult = validateTodoTitle(title);
    const descResult = validateTodoDescription(description);
    const dateResult = validateDueDate(dueDate);

    setTitleError(titleResult.error);
    setDescriptionError(descResult.error);
    setDueDateError(dateResult.error);

    if (!titleResult.valid || !descResult.valid || !dateResult.valid) {
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate ? dueDate.toISOString() : null,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.sheet}>
          <Text style={styles.heading}>{initialTodo ? 'Edit Todo' : 'New Todo'}</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.fieldLabel}>Title *</Text>
            <TextInput
              style={[styles.input, !!titleError && styles.inputError]}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter title"
              maxLength={200}
              returnKeyType="next"
            />
            {!!titleError && <Text style={styles.errorText}>{titleError}</Text>}

            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.multilineInput, !!descriptionError && styles.inputError]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description"
              maxLength={1000}
              multiline
              numberOfLines={3}
            />
            {!!descriptionError && <Text style={styles.errorText}>{descriptionError}</Text>}

            <DatePickerInput value={dueDate} onChange={setDueDate} />
            {!!dueDateError && <Text style={styles.errorText}>{dueDateError}</Text>}
          </ScrollView>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: '90%',
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#212121',
    backgroundColor: '#FAFAFA',
    marginBottom: 4,
  },
  inputError: {
    borderColor: '#F44336',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: '#F44336',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  saveButton: {
    backgroundColor: '#1976D2',
  },
  cancelText: {
    fontSize: 16,
    color: '#424242',
    fontWeight: '600',
  },
  saveText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default AddTodoModal;
