const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').Server(app);
const PORT = 4000;

const socketIO = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3001',
  },
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let todoList = [];

socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on('addTodo', (todo) => {
    todoList.unshift(todo);

    let user = todo.user;
    let userId = todo.userId;
    const usersTodos = todoList.filter((todo) => {
      if (user === todo.user && userId === todo.userId) {
        return true;
      }
      return false;
    });

    socket.emit('todos', usersTodos);
  });

  socket.on('viewComments', (id) => {
    for (let i = 0; i < todoList.length; i++) {
      if (id === todoList[i].id) {
        socket.emit('commentsReceived', todoList[i]);
      }
    }
  });

  socket.on('updateComment', (data) => {
    const { user, todoID, comment } = data;
    for (let i = 0; i < todoList.length; i++) {
      if (todoID === todoList[i].id) {
        todoList[i].comments.push({ name: user, text: comment });
        socket.emit('commentsReceived', todoList[i]);
      }
    }
  });

  socket.on('completeTodo', (todo) => {
    let user = todo.user;
    let userId = todo.userId;
    const usersTodos = todoList.filter((todo) => {
      if (user === todo.user && userId === todo.userId) {
        return true;
      }
      return false;
    });

    for (let i = 0; i < usersTodos.length; i++) {
      if (usersTodos[i].id === todo.id) {
        usersTodos[i].completed = !usersTodos[i].completed;
      }
    }

    socket.emit('todos', usersTodos);
  });

  socket.on('deleteTodo', (todo) => {
    todoList = todoList.filter((item) => item.id !== todo.id);

    let user = todo.user;
    let userId = todo.userId;
    const usersTodos = todoList.filter((todo) => {
      if (user === todo.user && userId === todo.userId) {
        return true;
      }
      return false;
    });

    socket.emit('todos', usersTodos);
  });

  socket.on('disconnect', () => {
    socket.disconnect();
    console.log('🔥: A user disconnected');
  });
});

app.get('/api', (req, res) => {
  let user = req.query.user;
  let userId = req.query.userId;
  const usersTodos = todoList.filter((todo) => {
    if (user === todo.user && userId === todo.userId) {
      return true;
    }
    return false;
  });

  res.json(usersTodos);
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
