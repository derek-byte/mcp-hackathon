# MCP TripAdvisor Server

This MCP server provides an interface to interact with the TripAdvisor scraper actor on Apify.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory and add your Apify API token:
```
APIFY_API_TOKEN=your_apify_token_here
```

You can get your Apify token from your Apify account settings.

## Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on port 3000 by default. You can change this by setting the `PORT` environment variable.

## API Endpoints

### Health Check
```
GET /health
```
Returns server status.

### Scrape TripAdvisor
```
POST /api/scrape-tripadvisor
```

Request body:
```json
{
    "searchTerm": "restaurants in new york",
    "maxItems": 10,
    "includeReviews": false,
    "maxReviews": 0
}
```

Parameters:
- `searchTerm` (required): What to search for on TripAdvisor
- `maxItems` (optional): Maximum number of items to scrape (default: 10)
- `includeReviews` (optional): Whether to include reviews (default: false)
- `maxReviews` (optional): Maximum number of reviews per item (default: 0)

Response:
```json
{
    "success": true,
    "data": [
        {
            "title": "Restaurant Name",
            "url": "https://tripadvisor.com/...",
            "rating": 4.5,
            // ... other fields depending on the scrape
        }
    ]
}
``` 