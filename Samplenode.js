// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Create an Express app
const app = express();

// Middleware to parse JSON data
app.use(bodyParser.json());

// MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/pushnotifications'; // Use your MongoDB URI if using MongoDB Atlas

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Define schema for storing notifications
const NotificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  date: { type: Date, default: Date.now }
});

// Create model for Notification
const Notification = mongoose.model('Notification', NotificationSchema);

// REST API route to store data (can be used for any data you need to push to MongoDB)
app.post('/api/data', (req, res) => {
  const { title, message } = req.body;

  const newNotification = new Notification({
    title,
    message
  });

  newNotification.save()
    .then(notification => res.status(201).json(notification))
    .catch(err => res.status(400).json({ error: err.message }));
});

// REST API route to send push notification
app.post('/api/notify', (req, res) => {
  const { title, message } = req.body;

  // Create a new notification entry in MongoDB
  const newNotification = new Notification({ title, message });

  newNotification.save()
    .then(notification => {
      // Here we simulate sending the notification (you can replace this with actual notification logic)
      console.log(`Notification Sent: ${title} - ${message}`);
      
      // Respond with success
      res.status(200).json({
        message: 'Notification sent successfully',
        notification
      });
    })
    .catch(err => res.status(400).json({ error: err.message }));
});

// Set up the server to listen on a specific port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
