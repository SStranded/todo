import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Nav from './Nav';

function Main({ socket }) {
  const [todo, setTodo] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [viewTodos, setViewTodos] = useState([]);
  const [view, setView] = useState('All');

  const [showModal, setShowModal] = useState(false);
  const [selectedItemID, setSelectedItemID] = useState('');

  const toggleModal = (itemId) => {
    socket.emit('viewComments', itemId);
    setSelectedItemID(itemId);
    setShowModal(!showModal);
  };

  const generateID = () => Math.random().toString(36).substring(2, 10);

  useEffect(() => {
    let user = localStorage.getItem('_username');
    let userId = localStorage.getItem('_id');

    function fetchTodos() {
      fetch(`http://localhost:4000/api?user=${user}&userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setTodoList(data);
          setViewTodos(data);
        })
        .catch((err) => console.error(err));
    }
    fetchTodos();
    socket.on('todos', (data) => setTodoList(data));
  }, [socket]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    socket.emit('addTodo', {
      id: generateID(),
      todo,
      comments: [],
      completed: false,
      user: localStorage.getItem('_username'),
      userId: localStorage.getItem('_id'),
    });
    setTodo('');
  };

  useEffect(() => {
    let todos = todoList;
    switch (view) {
      case 'All':
        setViewTodos(todos);
        break;
      case 'Active':
        todos = todoList.filter((todo) => !todo.completed);
        setViewTodos(todos);
        break;
      case 'Completed':
        todos = todoList.filter((todo) => todo.completed);
        setViewTodos(todos);
        break;

      default:
        break;
    }
  }, [view, todoList]);

  const handleDeleteTodo = (todo) => socket.emit('deleteTodo', todo);

  const handleCompleteTodo = (todo) => {
    socket.emit('completeTodo', todo);
  };

  const handleViewAll = () => {
    // setViewTodos(todoList);
    setView('All');
  };

  const handleViewActive = () => {
    // const todos = todoList.filter((todo) => !todo.completed);
    // setViewTodos(todos);
    setView('Active');
  };

  const handleViewComplete = () => {
    // const todos = todoList.filter((todo) => todo.completed);
    // setViewTodos(todos);
    setView('Completed');
  };

  return (
    <div>
      <Nav />
      <form className="form" onSubmit={handleAddTodo}>
        <input
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          className="input"
          placeholder="type todo here"
          required
        />
        <button className="form_btn">ADD TODO</button>
      </form>

      <div className="filters">
        <button
          className="form_btn"
          id={view === 'All' ? 'active' : ''}
          onClick={handleViewAll}
        >
          View All
        </button>
        <button
          className="form_btn"
          id={view === 'Active' ? 'active' : ''}
          onClick={handleViewActive}
        >
          View Active
        </button>
        <button
          className="form_btn"
          id={view === 'Completed' ? 'active' : ''}
          onClick={handleViewComplete}
        >
          View Completed
        </button>
      </div>

      <div className="todo_container">
        <h3>{view}</h3>
        {viewTodos.map((todo) => (
          <div className="todo_item" key={todo.id}>
            <div className="checkbox_text">
              <input
                type="checkbox"
                name="completed"
                checked={todo.completed}
                onChange={() => handleCompleteTodo(todo)}
              ></input>
              <p>{todo.todo}</p>
            </div>

            <div>
              <button
                className="comments_btn"
                onClick={() => toggleModal(todo.id)}
              >
                View Comments
              </button>

              <button
                className="delete_btn"
                onClick={() => handleDeleteTodo(todo)}
              >
                DELETE
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal ? (
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          selectedItemID={selectedItemID}
          socket={socket}
        />
      ) : (
        ''
      )}
    </div>
  );
}

export default Main;
