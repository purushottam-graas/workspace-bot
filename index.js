import('@octokit/webhooks').then(({ createEventHandler }) => {
    const express = require('express');
    const app = express();
    const port = process.env.PORT || 8080;

    // Your webhook secret
    const secret = 'purushottamgraas'; // Change this to your actual webhook secret
    const path = '/webhooks/github'; // Endpoint to receive webhook events

    // Parse JSON bodies for POST requests
    app.use(express.json());

    // Define webhookHandler within the scope of the dynamic import's .then() callback
    const webhookHandler = createEventHandler({ secret });

    // Handle incoming webhook events
    app.post(path, (req, res) => {
        try {
            webhookHandler(req, res, () => {
                console.log('Webhook event handled successfully.');
                res.status(200).send('Webhook received successfully');
            });
        } catch (error) {
            console.log('Error handling webhook event:', error);
            res.status(500).send('Internal Server Error');
        }
    });

    // Listen to all webhook events
    webhookHandler.onAny(({ id, name, payload }) => {
        // Log the event name and payload
        console.log(`Received ${name} event:`, payload);
    });

    // Define a route handler for the root route
    app.get('/', (req, res) => {
        console.log('Received GET request');
        res.send('Hello, World!');
    });

    // Start the server
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Failed to load @octokit/webhooks:', err);
});
