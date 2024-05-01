const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Hamlet1334',
  database: 'evisitor_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});

app.post('/addMessage', (req, res) => {
  const fullName = req.body.fullName;
  const message = req.body.message;
  const date = new Date();

  const query = 'INSERT INTO new_table (Fullname, Message, CreatedAt) VALUES (?, ?, ?)';
  db.query(query, [fullName, message, date], (err, result) => {
    if (err) throw err;
    res.status(200).send({ status: 'Message received' });
  });
});

app.post('/deleteMessage', (req, res) => {
  const messageId = req.body.messageId;

  const query = 'DELETE FROM new_table WHERE id = ?';
  db.query(query, [messageId], (err, result) => {
    if (err) {
      console.error('Error deleting message from database:', err);
      return res.status(500).send('Error deleting message from database');
    }
    res.status(200).send({ status: 'Message deleted' });

    // Silinen mesajı localStorage'dan da kaldırıldım
    const storedMessages = JSON.parse(localStorage.getItem('visitorMessages')) || [];
    const updatedMessages = storedMessages.filter(message => message.id !== messageId);
    localStorage.setItem('visitorMessages', JSON.stringify(updatedMessages));
  });
});
app.put('/messages/:id', (req, res) => {
  // ID'ye göre mesajı buldum
  const message = messages.find(message => message.id === req.params.id);

  if (message) {
    // Mesajı güncelledim 
    message.text = req.body.text;

    // Güncellenmiş mesajı veritabanına kaydettim


    res.send(message);
  } else {
    res.status(404).send();
  }
});

app.listen(5501, () => {
  console.log('Server is running on port 5501');
});
