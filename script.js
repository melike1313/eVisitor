document.addEventListener('DOMContentLoaded', function () {
  const visitorForm = document.getElementById('visitorForm');
  const fullnameInput = document.getElementById('fullname');
  const messageInput = document.getElementById('message');
  const visitorList = document.getElementById('visitorList');

  if (localStorage.getItem('visitorMessages')) {
    const storedMessages = JSON.parse(localStorage.getItem('visitorMessages'));
    // En yeni message en üstte olacak şekilde ekledim
    storedMessages.forEach(message => {
      addMessageToUI(message.fullName, message.message, new Date(message.date), message.id);
    });
  }


  visitorForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const fullname = fullnameInput.value;
    const message = messageInput.value;

    if (fullname.trim() === '' || message.trim() === '') {
      alert('Please fill out all fields.');
      return;
    }

    const date = new Date();

    addMessageToUI(fullname, message, date);

    const storedMessages = JSON.parse(localStorage.getItem('visitorMessages')) || [];
    const newMessage = { fullName: fullname, message: message, date: date.toISOString(), id: Date.now() };
    storedMessages.push(newMessage);
    localStorage.setItem('visitorMessages', JSON.stringify(storedMessages));

    addMessageToDatabase(fullname, message, date, newMessage.id);

    fullnameInput.value = '';
    messageInput.value = '';
  });

  function addMessageToUI(fullname, message, date, messageId) {
    const listItem = document.createElement('li');
    listItem.setAttribute('data-id', messageId);
  
    const messageText = document.createTextNode(`${fullname}: ${message} (${formatDate(date)})`);
  
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', function() {
      deleteMessage(messageId);
      listItem.remove();
    });
  
    listItem.appendChild(messageText);
    listItem.appendChild(deleteButton);
  

    const firstItem = visitorList.firstChild;
  
    // Eğer en üstteki eleman varsa, yeni elemanı onun üstüne yerleştirdim, yoksa listenin sonuna ekledim
    if (firstItem) {
      visitorList.insertBefore(listItem, firstItem);
    } else {
      visitorList.appendChild(listItem);
    }
  }
  
  

  function deleteMessage(messageId) {
    fetch('http://localhost:5501/deleteMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messageId }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Message deleted from database:', data);
      // Silinen mesajı yerel depolamadan da kaldırıldım
      const storedMessages = JSON.parse(localStorage.getItem('visitorMessages')) || [];
      const updatedMessages = storedMessages.filter(message => message.id !== messageId);
      localStorage.setItem('visitorMessages', JSON.stringify(updatedMessages));
    })
    .catch(error => console.error('Error deleting message from database:', error));
  }
  

  function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  function addMessageToDatabase(fullName, message, date, messageId) {
    fetch('http://localhost:5501/addMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fullName, message, date, messageId }),
    })
      .then(response => response.json())
      .then(data => console.log('Message added to database:', data))
      .catch(error => console.error('Error adding message to database:', error));
  }


  const updateButton = document.createElement('button');
updateButton.textContent = 'Update';
updateButton.classList.add('update-button');
updateButton.addEventListener('click', function() {
  const newMessage = prompt('Enter the new message:');
  if (newMessage) {
    updateMessage(messageId, newMessage);
  }
});

function updateMessage(messageId, newMessage) {
  fetch('http://localhost:5501/updateMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messageId, newMessage }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Message updated in database:', data);
    // Güncellenmiş mesajı yerel depolamada da güncelledim
    const storedMessages = JSON.parse(localStorage.getItem('visitorMessages')) || [];
    const updatedMessages = storedMessages.map(message => {
      if (message.id === messageId) {
        return { ...message, message: newMessage, updatedAt: new Date().toISOString() };
      }
      return message;
    });
    localStorage.setItem('visitorMessages', JSON.stringify(updatedMessages));
  })
  .catch(error => console.error('Error updating message in database:', error));
}
});
