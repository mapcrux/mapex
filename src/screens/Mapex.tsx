import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import TodoScreen from './TodoScreen';

/**
 * Root component for the Mapex application.
 * Currently renders the TodoScreen component.
 */
const Mapex: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <TodoScreen />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default Mapex;
