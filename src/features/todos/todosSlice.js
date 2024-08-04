// features/todos/todosSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  todos: [],
  status: 'idle',
  error: null,
};

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await axios.get('http://localhost:5000/todos');
  return response.data;
});

export const addTodo = createAsyncThunk('todos/addTodo', async (newTodo) => {
  const response = await axios.post('http://localhost:5000/todos', newTodo);
  return response.data;
});

export const updateTodo = createAsyncThunk('todos/updateTodo', async (updatedTodo) => {
  const response = await axios.put(`http://localhost:5000/todos/${updatedTodo.id}`, updatedTodo);
  return response.data;
});

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (todoId) => {
  await axios.delete(`http://localhost:5000/todos/${todoId}`);
  return todoId;
});

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex(todo => todo.id === action.payload.id);
        state.todos[index] = action.payload;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter(todo => todo.id !== action.payload);
      });
  },
});

export default todosSlice.reducer;
