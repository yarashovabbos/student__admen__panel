import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents, addStudent, updateStudent, deleteStudent, setSearchQuery } from '../features/students/studentsSlice';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';

const StudentsList = () => {
  const dispatch = useDispatch();
  const students = useSelector((state) => state.students.students);
  const studentStatus = useSelector((state) => state.students.status);
  const error = useSelector((state) => state.students.error);
  const searchQuery = useSelector((state) => state.students.searchQuery);

  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', group: '' });

  useEffect(() => {
    if (studentStatus === 'idle') {
      dispatch(fetchStudents());
    }
  }, [studentStatus, dispatch]);

  const handleSearch = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleShowModal = (student) => {
    setEditingStudent(student);
    setFormData(student || { firstName: '', lastName: '', group: '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    setFormData({ firstName: '', lastName: '', group: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStudent) {
      dispatch(updateStudent({ ...editingStudent, ...formData })).then(() => {
        toast.success('Student updated successfully!');
        handleCloseModal();
      });
    } else {
      dispatch(addStudent(formData)).then(() => {
        toast.success('Student added successfully!');
        handleCloseModal();
      });
    }
  };

  const handleDelete = (studentId) => {
    dispatch(deleteStudent(studentId)).then(() => toast.success('Student deleted successfully!'));
  };

  const filteredStudents = students.filter(student => 
    student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <ToastContainer />
      <h1 className='mt-5'>Students List</h1>
      <Form.Control type="text" placeholder="Search" value={searchQuery} onChange={handleSearch} />
      {studentStatus === 'loading' && <div>Loading...</div>}
      {studentStatus === 'succeeded' && (
        <Table striped bordered hover className='mt-3 ' style={{width:"1300px"}}>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Group</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.firstName}</td>
                <td>{student.lastName}</td>
                <td>{student.group}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShowModal(student)}>Edit</Button>{' '}
                  <Button variant="danger" onClick={() => handleDelete(student.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {studentStatus === 'failed' && <div>{error}</div>}

      <Button className='add__btn' variant="primary" onClick={() => handleShowModal(null)}>Add Student</Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingStudent ? 'Edit Student' : 'Add Student'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="group">
              <Form.Label>Group</Form.Label>
              <Form.Control
                type="text"
                value={formData.group}
                onChange={(e) => setFormData({ ...formData, group: e.target.value })}
              />
            </Form.Group>
            <Button className='add__btn' variant="primary" type="submit">
              {editingStudent ? 'Update' : 'Add'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StudentsList;
