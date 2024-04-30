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
  });
});

app.listen(5501, () => {
  console.log('Server is running on port 5501');
});
