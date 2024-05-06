const express = require('express');
const { createEventHandler } = require('@octokit/webhooks');

const app = express();
const port = 8080;

const secret = 'your_webhook_secret'; // Change this to your actual webhook secret
const path = '/webhooks/github'; // Endpoint to receive webhook events
const webhookHandler = createEventHandler({ secret });

// Handle incoming webhook events
app.post(path, webhookHandler.middleware);

// Listen to webhook events
webhookHandler.on('pull_request', ({ id, name, payload }) => {
    const { action, pull_request } = payload;
    // Forward PR message to workspace bot here
    console.log(`Received PR event: ${action} - ${pull_request.title}`);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
