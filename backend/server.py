#!/usr/bin/env python3
"""
TravelDeals MCP Server
Finds best travel deals using multiple APIs via MCP protocol
"""

import asyncio
import json
import logging
from typing import Any, Dict, List, Optional
from datetime import datetime, timedelta

from mcp.server import Server
from mcp.server.models import InitializationOptions
from mcp.server.stdio import stdio_server
from mcp.types import (
    Resource,
    Tool,
    TextContent,
    ImageContent,
    EmbeddedResource,
    LoggingLevel
)
import httpx
import os
from dataclasses import dataclass

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("travel-deals-mcp")

@dataclass
class TravelDeal:
    """Travel deal data structure"""
    title: str
    price: float
    original_price: float
    savings: float
    destination: str
    dates: str
    provider: str
    rating: float
    url: str
    image_url: str
    deal_type: str  # "flight", "hotel", "package"

class TravelDealsServer:
    """Main server class for travel deals MCP"""
    
    def __init__(self):
        self.server = Server("travel-deals-mcp")
        self.http_client = httpx.AsyncClient()
        
        # API configurations (replace with real API keys)
        self.apis = {
            "amadeus_api_key": os.getenv("AMADEUS_API_KEY", "demo_key"),
            "rapidapi_key": os.getenv("RAPIDAPI_KEY", "demo_key"),
            "booking_api_key": os.getenv("BOOKING_API_KEY", "demo_key")
        }
        
        self.setup_tools()
        self.setup_resources()
        
    def setup_tools(self):
        """Define MCP tools for travel deals"""
        
        @self.server.list_tools()
        async def handle_list_tools() -> list[Tool]:
            return [
                Tool(
                    name="search_flight_deals",
                    description="Find best flight deals for given destinations and dates",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "origin": {"type": "string", "description": "Origin city/airport"},
                            "destination": {"type": "string", "description": "Destination city/airport"},
                            "departure_date": {"type": "string", "description": "Departure date (YYYY-MM-DD)"},
                            "return_date": {"type": "string", "description": "Return date (YYYY-MM-DD)", "optional": True},
                            "budget_max": {"type": "number", "description": "Maximum budget", "optional": True}
                        },
                        "required": ["origin", "destination", "departure_date"]
                    }
                ),
                Tool(
                    name="search_hotel_deals",
                    description="Find best hotel deals for given location and dates",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "destination": {"type": "string", "description": "Destination city"},
                            "checkin_date": {"type": "string", "description": "Check-in date (YYYY-MM-DD)"},
                            "checkout_date": {"type": "string", "description": "Check-out date (YYYY-MM-DD)"},
                            "guests": {"type": "number", "description": "Number of guests", "default": 2},
                            "budget_max": {"type": "number", "description": "Maximum budget per night", "optional": True}
                        },
                        "required": ["destination", "checkin_date", "checkout_date"]
                    }
                ),
                Tool(
                    name="search_package_deals",
                    description="Find best vacation package deals (flight + hotel)",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "origin": {"type": "string", "description": "Origin city"},
                            "destination": {"type": "string", "description": "Destination city"},
                            "departure_date": {"type": "string", "description": "Departure date (YYYY-MM-DD)"},
                            "return_date": {"type": "string", "description": "Return date (YYYY-MM-DD)"},
                            "budget_max": {"type": "number", "description": "Maximum total budget", "optional": True}
                        },
                        "required": ["origin", "destination", "departure_date", "return_date"]
                    }
                ),
                Tool(
                    name="get_destination_insights",
                    description="Get travel insights and tips for a destination",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "destination": {"type": "string", "description": "Destination city/country"},
                            "travel_month": {"type": "string", "description": "Month of travel (optional)"}
                        },
                        "required": ["destination"]
                    }
                ),
                Tool(
                    name="compare_deals",
                    description="Compare multiple travel deals and find the best value",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "deal_type": {"type": "string", "description": "Type of deals to compare", "enum": ["flights", "hotels", "packages"]},
                            "criteria": {"type": "string", "description": "Comparison criteria", "enum": ["price", "rating", "value", "savings"]}
                        },
                        "required": ["deal_type", "criteria"]
                    }
                )
            ]

        @self.server.call_tool()
        async def handle_call_tool(name: str, arguments: dict) -> list[TextContent]:
            try:
                if name == "search_flight_deals":
                    return await self.search_flight_deals(arguments)
                elif name == "search_hotel_deals":
                    return await self.search_hotel_deals(arguments)
                elif name == "search_package_deals":
                    return await self.search_package_deals(arguments)
                elif name == "get_destination_insights":
                    return await self.get_destination_insights(arguments)
                elif name == "compare_deals":
                    return await self.compare_deals(arguments)
                else:
                    raise ValueError(f"Unknown tool: {name}")
            except Exception as e:
                logger.error(f"Error calling tool {name}: {e}")
                return [TextContent(type="text", text=f"Error: {str(e)}")]

    def setup_resources(self):
        """Define MCP resources"""
        
        @self.server.list_resources()
        async def handle_list_resources() -> list[Resource]:
            return [
                Resource(
                    uri="travel://popular-destinations",
                    name="Popular Travel Destinations",
                    description="List of popular travel destinations with current deals",
                    mimeType="application/json"
                ),
                Resource(
                    uri="travel://deal-alerts",
                    name="Deal Alerts",
                    description="Current travel deal alerts and notifications",
                    mimeType="application/json"
                ),
                Resource(
                    uri="travel://best-times-to-travel",
                    name="Best Times to Travel",
                    description="Optimal travel times for different destinations",
                    mimeType="application/json"
                )
            ]

        @self.server.read_resource()
        async def handle_read_resource(uri: str) -> str:
            if uri == "travel://popular-destinations":
                return json.dumps({
                    "destinations": [
                        {"name": "Paris", "country": "France", "avg_deal_savings": "35%"},
                        {"name": "Tokyo", "country": "Japan", "avg_deal_savings": "28%"},
                        {"name": "New York", "country": "USA", "avg_deal_savings": "42%"},
                        {"name": "London", "country": "UK", "avg_deal_savings": "31%"},
                        {"name": "Barcelona", "country": "Spain", "avg_deal_savings": "38%"}
                    ]
                })
            elif uri == "travel://deal-alerts":
                return json.dumps({
                    "alerts": [
                        {"destination": "Bali", "savings": "45%", "expires": "2025-06-15"},
                        {"destination": "Iceland", "savings": "52%", "expires": "2025-06-10"},
                        {"destination": "Costa Rica", "savings": "38%", "expires": "2025-06-20"}
                    ]
                })
            else:
                raise ValueError(f"Unknown resource: {uri}")

    async def search_flight_deals(self, args: dict) -> list[TextContent]:
        """Search for flight deals"""
        origin = args["origin"]
        destination = args["destination"]
        departure_date = args["departure_date"]
        return_date = args.get("return_date")
        budget_max = args.get("budget_max")
        
        # Demo data - replace with real API calls
        demo_deals = [
            TravelDeal(
                title=f"{origin} to {destination} Round-trip",
                price=450,
                original_price=680,
                savings=230,
                destination=destination,
                dates=f"{departure_date} - {return_date}" if return_date else departure_date,
                provider="Skyscanner",
                rating=4.5,
                url="https://skyscanner.com/deal123",
                image_url="https://example.com/flight.jpg",
                deal_type="flight"
            ),
            TravelDeal(
                title=f"Direct Flight {origin}-{destination}",
                price=520,
                original_price=750,
                savings=230,
                destination=destination,
                dates=f"{departure_date} - {return_date}" if return_date else departure_date,
                provider="Expedia",
                rating=4.3,
                url="https://expedia.com/deal456",
                image_url="https://example.com/flight2.jpg",
                deal_type="flight"
            )
        ]
        
        # Filter by budget if provided
        if budget_max:
            demo_deals = [deal for deal in demo_deals if deal.price <= budget_max]
        
        # Sort by savings
        demo_deals.sort(key=lambda x: x.savings, reverse=True)
        
        result = {
            "search_params": args,
            "deals_found": len(demo_deals),
            "best_savings": f"${demo_deals[0].savings:.0f}" if demo_deals else "N/A",
            "deals": [
                {
                    "title": deal.title,
                    "price": deal.price,
                    "original_price": deal.original_price,
                    "savings": deal.savings,
                    "savings_percent": f"{(deal.savings/deal.original_price)*100:.0f}%",
                    "provider": deal.provider,
                    "rating": deal.rating,
                    "dates": deal.dates,
                    "url": deal.url
                }
                for deal in demo_deals[:5]  # Top 5 deals
            ]
        }
        
        return [TextContent(
            type="text", 
            text=f"🛫 Flight Deals Found!\n\n{json.dumps(result, indent=2)}"
        )]

    async def search_hotel_deals(self, args: dict) -> list[TextContent]:
        """Search for hotel deals"""
        destination = args["destination"]
        checkin = args["checkin_date"]
        checkout = args["checkout_date"]
        guests = args.get("guests", 2)
        budget_max = args.get("budget_max")
        
        # Demo data
        demo_deals = [
            TravelDeal(
                title=f"Luxury Hotel in {destination}",
                price=180,
                original_price=280,
                savings=100,
                destination=destination,
                dates=f"{checkin} - {checkout}",
                provider="Booking.com",
                rating=4.7,
                url="https://booking.com/hotel123",
                image_url="https://example.com/hotel.jpg",
                deal_type="hotel"
            ),
            TravelDeal(
                title=f"Boutique Hotel {destination}",
                price=145,
                original_price=220,
                savings=75,
                destination=destination,
                dates=f"{checkin} - {checkout}",
                provider="Hotels.com",
                rating=4.4,
                url="https://hotels.com/hotel456",
                image_url="https://example.com/hotel2.jpg",
                deal_type="hotel"
            )
        ]
        
        if budget_max:
            demo_deals = [deal for deal in demo_deals if deal.price <= budget_max]
            
        demo_deals.sort(key=lambda x: x.savings, reverse=True)
        
        result = {
            "search_params": args,
            "deals_found": len(demo_deals),
            "avg_savings": f"${sum(deal.savings for deal in demo_deals)/len(demo_deals):.0f}" if demo_deals else "N/A",
            "deals": [
                {
                    "title": deal.title,
                    "price_per_night": deal.price,
                    "original_price": deal.original_price,
                    "savings_per_night": deal.savings,
                    "total_savings": deal.savings * ((datetime.strptime(checkout, "%Y-%m-%d") - datetime.strptime(checkin, "%Y-%m-%d")).days),
                    "provider": deal.provider,
                    "rating": deal.rating,
                    "url": deal.url
                }
                for deal in demo_deals[:5]
            ]
        }
        
        return [TextContent(
            type="text",
            text=f"🏨 Hotel Deals Found!\n\n{json.dumps(result, indent=2)}"
        )]

    async def search_package_deals(self, args: dict) -> list[TextContent]:
        """Search for vacation package deals"""
        # Implementation similar to above
        result = {
            "message": "Package deals feature coming soon!",
            "search_params": args
        }
        return [TextContent(type="text", text=json.dumps(result, indent=2))]

    async def get_destination_insights(self, args: dict) -> list[TextContent]:
        """Get destination insights"""
        destination = args["destination"]
        
        insights = {
            "destination": destination,
            "best_time_to_visit": "April-June, September-November",
            "avg_temperature": "22°C (72°F)",
            "currency": "EUR",
            "top_attractions": ["Eiffel Tower", "Louvre Museum", "Notre Dame"],
            "travel_tips": [
                "Book flights 6-8 weeks in advance for best deals",
                "Consider off-season travel for 40% savings",
                "Use public transport for budget-friendly local travel"
            ],
            "current_deals_available": 12,
            "avg_savings_this_month": "34%"
        }
        
        return [TextContent(
            type="text",
            text=f"🌍 {destination} Travel Insights\n\n{json.dumps(insights, indent=2)}"
        )]

    async def compare_deals(self, args: dict) -> list[TextContent]:
        """Compare deals"""
        deal_type = args["deal_type"]
        criteria = args["criteria"]
        
        comparison = {
            "comparison_type": f"{deal_type} by {criteria}",
            "top_deals": [
                {"rank": 1, "deal": "Paris Flight Deal", "score": 95, "value": "$230 savings"},
                {"rank": 2, "deal": "London Hotel Deal", "score": 89, "value": "$180 savings"},
                {"rank": 3, "deal": "Tokyo Package Deal", "score": 85, "value": "$450 savings"}
            ],
            "recommendation": "Paris Flight Deal offers the best value based on your criteria"
        }
        
        return [TextContent(
            type="text",
            text=f"📊 Deal Comparison Results\n\n{json.dumps(comparison, indent=2)}"
        )]

    async def run(self):
        """Run the MCP server"""
        async with stdio_server() as (read_stream, write_stream):
            await self.server.run(
                read_stream,
                write_stream,
                InitializationOptions(
                    server_name="travel-deals-mcp",
                    server_version="1.0.0",
                    capabilities=self.server.get_capabilities(
                        notification_options=None,
                        experimental_capabilities=None,
                    ),
                ),
            )

async def main():
    """Main entry point"""
    server = TravelDealsServer()
    await server.run()

if __name__ == "__main__":
    asyncio.run(main())