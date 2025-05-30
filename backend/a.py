from dotenv import load_dotenv
import os
import asyncio
from pathlib import Path

from langgraph.prebuilt import create_react_agent
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from langchain_mcp_adapters.tools import load_mcp_tools
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI

# Load environment variables from .env file
load_dotenv()

# Make sure to set your APIFY_TOKEN in the environment or .env file
APIFY_TOKEN = os.getenv("APIFY_TOKEN")
if APIFY_TOKEN is None:
    raise ValueError("APIFY_TOKEN environment variable must be set.")

# Initialize the model
# Note: You can use any model from langchain_openai
model = ChatOpenAI(model="gpt-4o")

# Initialize the server parameters
# Note: You can use any server parameters from mcp
server_params = StdioServerParameters(
    command="npx",
    args=["-y", "@apify/actors-mcp-server"],
    env={"APIFY_TOKEN": APIFY_TOKEN},
)


# Initialize the MCP client, load tools, and create an agent
async def main():
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # Initialize the connection
            await session.initialize()

            # Get tools
            tools = await load_mcp_tools(session)

            # Create and run the agent
            agent = create_react_agent(model, tools)
            agent_response = await agent.ainvoke(
                {"messages": "Give me a list with the top 10 cafes in Boston."}
            )

            # Get the response content
            response_content = agent_response["messages"][-1].content
            print(agent_response["messages"][-1].content)

            # Save the response to a markdown file
            output_dir = Path("results")
            output_dir.mkdir(exist_ok=True)
            filename = f"agent_response.md"
            file_path = output_dir / filename

            # Write to file
            with open(file_path, "w") as f:
                f.write(response_content)

            print(f"\\nResults saved to {file_path}")


# Run the async main function
asyncio.run(main())
