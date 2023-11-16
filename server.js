import express from 'express';
import { connect, Schema, model } from 'mongoose';
import { json } from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(json());

// MongoDB connection
connect('mongodb+srv://kirtan_14:Kirtanjain1234.@cluster-kirtan.bw7og2l.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define MongoDB Schema and Model for User
const userSchema = new Schema({
  username: String,
  password: String,
});

const User = model('User', userSchema);

// Routes
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(409).json({ message: 'User already exists. Please log in.' });
    } else {
      const user = new User({ username, password });
      await user.save();
      res.status(200).json({ message: 'User created successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error during login' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
