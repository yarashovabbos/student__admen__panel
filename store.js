import { configureStore } from '@reduxjs/toolkit';
import studentsReducer from './src/features/students/studentsSlice';
import todosReducer from './src/features/todos/todosSlice';

export const store = configureStore({
  reducer: {
    students: studentsReducer,
    todos: todosReducer
  }
});
