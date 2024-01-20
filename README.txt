Jednoduchá webová chat aplikace.
Uživatel si zvolí své jméno a místnost, do které se chce připojit.
Pokud uživatel nezadá jméno, bude zobrazován jako Anonymous.
Pokud uživatel nezadá ID místnosti, nebude připojen.
Uživatelé si následně v dané místnosti mohou posílat zprávy pomocí WebSocketů.

Z ČASOVÉHO DŮVODU JSEM NESTIHL DOIMPLEMENTOVAT FRONTEND PRO REST API ENDPOINTY. V KÓDU A V DOKUMENTACI TEDY UVÁDÍM BACKEND KÓD.

----------Web Sockety----------



socket.on('joinRoom', (room) => {
    socket.join(room);
  });
-Připojí uživatele do místnosti



socket.on('chatMessage', (message) => {
    messages.push(message);
    io.to(message.room).emit('message', message);
  });
-Pošle zprávu všem uživatelům v místnosti

socket.on('message', (message) => {
      const chatDiv = document.getElementById('chat');
      const messageDiv = document.createElement('div');
      messageDiv.innerHTML = `<strong>${message.username}:</strong> ${message.text}`;
      chatDiv.appendChild(messageDiv);
    });
-Vypíše zprávu do chatu pro uživatele v místnosti



socket.on('disconnect', () => {
    console.log('User disconnected');
  });
-Vypíše odpojení uživatele



----------REST API Endpointy----------



app.get('/api/messages', (req, res) => {
  res.json(messages);
});
-Vrátí zprávy ze všech místností



app.get('/api/messages/user/:username', (req, res) => {
  const username = req.params.username;
  const userMessages = messages.filter((message) => message.username === username);
  res.json(userMessages);
});
-Vrátí zprávy vybraného uživatele


app.get('/api/messages/room/:room', (req, res) => {
  const room = req.params.room;
  const roomMessages = messages.filter((message) => message.room === room);
  res.json(roomMessages);
});
-Vrátí zprávy z vybrané místnosti



app.get('/api/messages/search/:keyword', (req, res) => {
  const keyword = req.params.keyword.toLowerCase();
  const filteredMessages = messages.filter((message) =>
    message.text.toLowerCase().includes(keyword)
  );
  res.json(filteredMessages);
});
-Vrátí zprávy obsahující keywordy