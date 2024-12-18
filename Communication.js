const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

// Initialize the Express app
const app = express();
const port = 3000;

// MongoDB connection URI
const uri = "mongodb://localhost:27017"; // Change to your MongoDB URI (e.g., MongoDB Atlas URI)

// Database and collection name
const dbName = "eventDatabase";
const collectionName = "events";

// The secret API Key (in a production environment, it should be stored in a secure location, like an environment variable)
const API_KEY = 'your-secret-api-key';

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// MongoDB client instance
let client;

// Function to connect to MongoDB
async function connectToDB() {
    if (!client) {
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
    }
    return client.db(dbName).collection(collectionName);
}

// Middleware for API Key authentication
function authenticate(req, res, next) {
    // Check for the API key in the request header
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey || apiKey !== API_KEY) {
        return res.status(403).json({ message: 'Forbidden: Invalid API Key' });
    }
    
    // If API Key is valid, proceed to the next middleware/handler
    next();
}

// POST endpoint to receive events and insert them into MongoDB
app.post('/event', authenticate, async (req, res) => {
    const event = req.body;

    // Validate the event data (optional)
    if (!event || Object.keys(event).length === 0) {
        return res.status(400).json({ message: 'Invalid event data' });
    }

    try {
        // Connect to MongoDB and insert the event
        const collection = await connectToDB();
        const result = await collection.insertOne(event);

        // Respond with a success message
        res.status(200).json({ message: 'Event successfully inserted', insertedId: result.insertedId });
    } catch (error) {
        console.error('Error inserting event into MongoDB:', error);
        res.status(500).json({ message: 'Failed to insert event into MongoDB', error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});



const https = require('https');
const axios = require('axios');  // You can also use axios to simplify HTTP requests

// Your API URL (replace with your actual API endpoint)
const apiUrl = 'http://<your-api-endpoint>/event';

// Your API Key for authentication
const apiKey = 'your-secret-api-key';

exports.handler = async (event) => {
    const eventBody = JSON.stringify(event);  // This is the event data from Connect or EventBridge
    
    // Prepare the HTTP request options
    const options = {
        method: 'POST',
        url: apiUrl,
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey // Include the API key in the header for authentication
        },
        data: eventBody
    };

    try {
        // Make the API call using Axios
        const response = await axios(options);
        
        // Return a success message
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Event successfully sent', response: response.data })
        };
    } catch (error) {
        console.error('Error sending event to API:', error);
        
        // Return an error response
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to send event', error: error.message })
        };
    }
};
