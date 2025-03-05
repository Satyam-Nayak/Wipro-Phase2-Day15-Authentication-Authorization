const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const bodyParser = require('body-parser');

server.use(middlewares);
server.use(bodyParser.json());

// Mock authentication routes
server.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = router.db.get('users').value();

  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.json({
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

server.post('/register', (req, res) => {
  const { email, password } = req.body;
  const users = router.db.get('users').value();

  if (users.some(u => u.email === email)) {
    res.status(400).json({ message: 'User already exists' });
  } else {
    const newUser = { id: Date.now(), email, password };
    router.db.get('users').push(newUser).write();
    res.status(201).json(newUser);
  }
});

server.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken === 'mock-refresh-token') {
    res.json({
      token: 'new-mock-jwt-token',
      refreshToken: 'new-mock-refresh-token',
    });
  } else {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
});

// Use default router
server.use(router);

// Start server
server.listen(3000, () => {
  console.log('JSON Server is running');
});
