const express = require('express');
const app = express();
const port = 8080;

// Your webhook secret
const secret = 'purushottam-graas'; // Change this to your actual webhook secret
const path = '/webhooks/github'; // Endpoint to receive webhook events

// Use dynamic import to load @octokit/webhooks
import('@octokit/webhooks').then(({ createEventHandler }) => {
    // Parse JSON bodies for POST requests
    app.use(express.json());

    // Define webhookHandler within the scope of the dynamic import's .then() callback
    const webhookHandler = createEventHandler({ secret });

    // Handle incoming webhook events
    app.post(path, (req, res) => {
        try {
            webhookHandler(req, res, () => {
                console.log('Webhook event handled successfully.');
            });
        } catch (error) {
            console.error('Error handling webhook event:', error);
            res.status(500).send('Internal Server Error');
        }
    });

    // Listen to webhook events
    webhookHandler.on('pull_request', ({ id, name, payload }) => {
        const { action, pull_request } = payload;
        // Forward PR message to workspace bot here
        console.log(`Received PR event: ${action} - ${pull_request.title}`);
    });
// test
app.post('/webhooks/github', (req, res) => {
    res.send(req.body)
    // Process the incoming webhook payload here
    console.log('Received webhook payload:', req.body);
    res.status(200).send('Webhook received successfully');
});

    // Start the server
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Failed to load @octokit/webhooks:', err);
});
