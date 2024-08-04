import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos, addTodo, updateTodo, deleteTodo } from '../features/todos/todosSlice';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';

const TodosList = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.todos);
  const todoStatus = useSelector((state) => state.todos.status);
  const error = useSelector((state) => state.todos.error);

  const [showModal, setShowModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [formData, setFormData] = useState({ text: '', complete: false });

  useEffect(() => {
    if (todoStatus === 'idle') {
      dispatch(fetchTodos());
    }
  }, [todoStatus, dispatch]);

  const handleShowModal = (todo) => {
    setEditingTodo(todo);
    setFormData(todo || { text: '', complete: false });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTodo(null);
    setFormData({ text: '', complete: false });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTodo) {
      dispatch(updateTodo({ ...editingTodo, ...formData })).then(() => {
        toast.success('Todo updated successfully!');
        handleCloseModal();
      });
    } else {
      dispatch(addTodo(formData)).then(() => {
        toast.success('Todo added successfully!');
        handleCloseModal();
      });
    }
  };

  const handleDelete = (todoId) => {
    dispatch(deleteTodo(todoId)).then(() => toast.success('Todo deleted successfully!'));
  };

  return (
    <div>
      <ToastContainer />
      <h1 className='mt-5'>Todos List</h1>
      {todoStatus === 'loading' && <div>Loading...</div>}
      {todoStatus === 'succeeded' && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Text</th>
              <th>Complete</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo.id}>
                <td>{todo.id}</td>
                <td>{todo.text}</td>
                <td>{todo.complete ? '✅' : '❌'}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShowModal(todo)}>Edit</Button>{' '}
                  <Button variant="danger" onClick={() => handleDelete(todo.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {todoStatus === 'failed' && <div>{error}</div>}

      <Button className='add__btn' variant="primary" onClick={() => handleShowModal(null)}>Add Todo</Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingTodo ? 'Edit Todo' : 'Add Todo'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="text">
              <Form.Label>Text</Form.Label>
              <Form.Control
                type="text"
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="complete">
              <Form.Check
                type="checkbox"
                label="Complete"
                checked={formData.complete}
                onChange={(e) => setFormData({ ...formData, complete: e.target.checked })}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {editingTodo ? 'Update' : 'Add'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TodosList;
