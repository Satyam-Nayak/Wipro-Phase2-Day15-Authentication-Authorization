const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const SECRET_KEY = 'your-secret-key';
const REFRESH_SECRET_KEY = 'your-refresh-secret-key';
const TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function generateTokens(user) {
  const token = jwt.sign(
    { id: user.id, email: user.email },
    SECRET_KEY,
    { expiresIn: TOKEN_EXPIRY }
  );
  
  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    REFRESH_SECRET_KEY,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  return { token, refreshToken };
}

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Login endpoint
server.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = router.db.get('users').value();
  const user = users.find(u => u.email === email && u.password === hashPassword(password));

  if (user) {
    const { token, refreshToken } = generateTokens(user);
    res.json({ token, refreshToken });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// Register endpoint
server.post('/register', (req, res) => {
  const { email, password } = req.body;
  const users = router.db.get('users').value();
  
  if (users.find(u => u.email === email)) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  const user = {
    id: Date.now(),
    email,
    password: hashPassword(password)
  };

  router.db.get('users').push(user).write();
  res.status(201).json({ message: 'User created successfully' });
});

// Refresh token endpoint
server.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    const user = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
    const tokens = generateTokens(user);
    res.json(tokens);
  } catch (err) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// Forgot password endpoint
server.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  const users = router.db.get('users').value();
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Generate password reset token
  const resetToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
  
  // In a real application, you would send this token via email
  // For demo purposes, we'll just return it
  res.json({
    message: 'Password reset instructions sent',
    resetToken // Remove this in production
  });
});

// Reset password endpoint
server.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const users = router.db.get('users');
    const user = users.find({ id: decoded.id }).value();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    users
      .find({ id: decoded.id })
      .assign({ password: hashPassword(newPassword) })
      .write();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired reset token' });
  }
});

// Verify token middleware
server.use(/^(?!\/login|\/register|\/refresh-token|\/forgot-password|\/reset-password).*$/, (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const user = jwt.verify(token, SECRET_KEY);
      req.user = user;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    res.status(401).json({ message: 'Authorization header required' });
  }
});

server.use(router);
server.listen(3000, () => {
  console.log('JSON Server with auth is running on port 3000');
});