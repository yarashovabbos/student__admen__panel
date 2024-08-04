import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import StudentsList from './components/StudentsList';
import TodosList from './components/TodosList';

const App = () => {
  return (
    <Container>
      <Row>
        {/* <Col>
       
        </Col> */}
        <Col>
          <StudentsList />
        </Col>
        <Col>
          <TodosList />
        </Col>
      </Row>
    </Container>
  );
};

export default App;
