const express = require('express');
const cors = require('cors');
const { ApifyClient } = require('apify-client');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Apify client
const apifyClient = new ApifyClient({
    token: process.env.APIFY_API_TOKEN,
});

// TripAdvisor actor ID
const TRIPADVISOR_ACTOR_ID = 'maxcopell~tripadvisor-scraper';

// Routes
app.post('/api/scrape-tripadvisor', async (req, res) => {
    try {
        const {
            searchTerm,
            maxItems = 10,
            includeReviews = false,
            maxReviews = 0,
        } = req.body;

        if (!searchTerm) {
            return res.status(400).json({ error: 'searchTerm is required' });
        }

        // Start the actor and wait for it to finish
        const run = await apifyClient.actor(TRIPADVISOR_ACTOR_ID).call({
            query: searchTerm, // Changed from searchTerm to query
            maxItems,
            includeReviews,
            maxReviews,
            proxyConfiguration: { useApifyProxy: true },
        });

        // Fetch and return the actor run data
        const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();
        res.json({ success: true, data: items });

    } catch (error) {
        console.error('Error running TripAdvisor actor:', error);
        res.status(500).json({
            error: 'Failed to run TripAdvisor actor',
            message: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
    console.log(`MCP Server running on port ${port}`);
}); 