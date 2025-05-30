curl -X POST "https://actors-mcp-server.apify.actor/message?token=apify_api_ZAqkOxwn0ERQ6TGY3YNfpldri3wN5k0U4Rrv&sessionId=f1665f8a-4471-4c72-b8ec-3a90a083b900"\
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "maxcopell/tripadvisor",
      "arguments": {
        "searchStringsArray": ["best ramen in San Francisco"],
        "maxCrawledPlacesPerSearch": 3
      }
    }
  }'
curl -X POST "https://actors-mcp-server.apify.actor/message?token=apify_api_ZAqkOxwn0ERQ6TGY3YNfpldri3wN5k0U4Rrv&sessionId=04cb578e-6ea2-4d62-9040-26c924cc1f26
" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/add-actor-as-tool",
    "params": {
      "name": "maxcopell/tripadvisor"
    }
  }'