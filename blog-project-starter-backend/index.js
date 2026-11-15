// server.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require("cors");
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
require('dotenv').config();

const app = express();
app.use(cors());

// Middleware
app.use(bodyParser.json());

const adminUid = process.env.ADMIN_UID;
if (!adminUid) {
  throw new Error('ADMIN_UID must be set in the backend environment');
}

initializeApp({
  credential: applicationDefault()
});

const requireAdmin = async (req, res, next) => {
  const authorization = req.get('Authorization');
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const token = authorization.slice('Bearer '.length);
    const decodedToken = await getAuth().verifyIdToken(token);
    if (decodedToken.uid !== adminUid) {
      return res.status(403).json({ message: 'Only the administrator can create blogs' });
    }

    next();
  } catch (error) {
    console.error('Failed to verify Firebase ID token:', error);
    return res.status(401).json({ message: 'Invalid or expired authentication token' });
  }
};

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/blogDB').then(()=>{
    console.log("Connection Successfull")
})


// Define Schema
const blogSchema = new mongoose.Schema({
  newTitle: String,
  newContent: String,
  date:String,
  likes:Number
});

const Blog = mongoose.model('Blog', blogSchema);

// Routes
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({});
    console.log(blogs)
    res.send(blogs)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.patch('/api/blogs/like/:id', async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
  
      // Increment the likes of the blog post
      const updatedBlog = await Blog.findByIdAndUpdate(
        req.params.id,
        { $inc: { likes: 1 } },
        { new: true } // This option returns the modified document rather than the original
      );
  
      res.json(updatedBlog);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });


app.post('/api/blogs', requireAdmin, async (req, res) => {

  const blog = new Blog({
    newTitle: req.body.newTitle,
    newContent: req.body.newContent,
    date:req.body.date,
    likes:req.body.likes
  });

  try {
    const newBlog = await blog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start server
app.listen(5000, () => console.log('Server running on port 5000'));
