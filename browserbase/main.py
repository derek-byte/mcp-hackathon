from playwright.sync_api import Playwright, sync_playwright, TimeoutError as PlaywrightTimeoutError
from browserbase import Browserbase
import os
from dotenv import load_dotenv
import time
import re # For parsing prices

# Load environment variables from .env file
load_dotenv()

# Ensure your API key and Project ID are set in your .env file or environment
BROWSERBASE_API_KEY = os.environ.get("BROWSERBASE_API_KEY")
BROWSERBASE_PROJECT_ID = os.environ.get("BROWSERBASE_PROJECT_ID")

if not BROWSERBASE_API_KEY:
    raise ValueError("BROWSERBASE_API_KEY environment variable not set.")
if not BROWSERBASE_PROJECT_ID:
    raise ValueError("BROWSERBASE_PROJECT_ID environment variable not set.")

bb = Browserbase(api_key=BROWSERBASE_API_KEY)

def interact_with_airbnb(page: 'Page'): # Forward reference Page type hint
    print("\n--- Starting Airbnb Interaction ---")
    url = "https://www.airbnb.com/rooms/1423262814997006353?search_mode=regular_search&adults=1&check_in=2025-08-08&check_out=2025-08-13&children=0&infants=0&pets=0&source_impression_id=p3_1748640822_P3Oy4aNQJ_UwjG3g&previous_page_section_name=1000&federated_search_id=c74408c8-026c-4dd9-bfa1-f9120d0f9a6f"
    print(f"Navigating to Airbnb URL: {url}")
    page.goto(url, wait_until="domcontentloaded", timeout=90000)
    page_title = page.title()
    print(f"Page title: {page_title}")

    print("Taking screenshot before any action on Airbnb...")
    page.screenshot(path="screenshot_airbnb_before_action.png")
    print("Screenshot 'screenshot_airbnb_before_action.png' saved.")

    print("Scrolling down the Airbnb page...")
    for _ in range(1): # Scroll PageDown once
        page.keyboard.press("PageDown")
        time.sleep(0.5)

    print("Taking screenshot after scrolling on Airbnb...")
    page.screenshot(path="screenshot_airbnb_after_scroll.png")
    print("Screenshot 'screenshot_airbnb_after_scroll.png' saved.")

    reserve_button_testid = "homes-pdp-cta-btn"
    print(f"Attempting to find Airbnb reserve button with data-testid='{reserve_button_testid}'...")

    reserve_buttons = page.get_by_test_id(reserve_button_testid)
    count = reserve_buttons.count()
    print(f"Found {count} elements with data-testid='{reserve_button_testid}'.")

    if count == 0:
        raise Exception(f"No element found with data-testid='{reserve_button_testid}'.")

    target_button = None
    if count == 1:
        print("Found 1 Airbnb reserve button, attempting to click it.")
        target_button = reserve_buttons
    else:
        print(f"Found {count} Airbnb reserve buttons. Attempting to click the last one that is visible.")
        for i in range(count - 1, -1, -1):
            btn = reserve_buttons.nth(i)
            if btn.is_visible():
                print(f"Airbnb reserve button at index {i} (from end) is visible. Selecting this one.")
                target_button = btn
                break
        if not target_button:
            print("No visible Airbnb reserve button found among the multiple matches. Defaulting to the last one in DOM.")
            target_button = reserve_buttons.last()

    print("Ensuring Airbnb reserve button is in view and clicking...")
    target_button.scroll_into_view_if_needed(timeout=10000)
    target_button.click(timeout=30000)
    print("Clicked the Airbnb Reserve button successfully.")

    print("Pausing for 3 seconds to observe the result of the Airbnb click...")
    time.sleep(3)

    print("Taking screenshot after clicking Airbnb 'Reserve' button...")
    page.screenshot(path="screenshot_airbnb_after_click.png")
    print("Screenshot 'screenshot_airbnb_after_click.png' saved.")
    print("--- Finished Airbnb Interaction ---")



def run(playwright: Playwright) -> None:
    print("Creating Browserbase session...")
    session = bb.sessions.create(project_id=BROWSERBASE_PROJECT_ID)
    print(f"Session created: {session.id}")
    print(f"View live session or replay at: https://browserbase.com/sessions/{session.id}")

    print(f"Connecting to Browserbase session via CDP: {session.connect_url}")
    chromium = playwright.chromium
    browser = chromium.connect_over_cdp(session.connect_url)
    context = browser.contexts[0]
    page = context.pages[0]
    page.set_viewport_size({"width": 1920, "height": 1080})
    print("Successfully connected to the page in Browserbase.")

    try:
        # --- Task 1: Airbnb Interaction ---
        interact_with_airbnb(page)

        # --- Task 2: Flight Selection ---
        # !!! IMPORTANT: REPLACE THIS WITH THE ACTUAL FLIGHT WEBSITE URL !!!
        # The URL from your previous script was a placeholder.
        # Ensure this is the URL that directly shows the flight listings.
        # flight_search_url = "https://www.google.com/travel/flights/search?tfs=CBwQAhooEgoyMDI1LTA3LTAxagwIAhIIL20vMGY2N2QSCjIwMjUtMDctMDVyDAgCEggvbS8wN18xZEABSAFSA hauntingAdqWBZ2FvZ2xlLmNvbS90cmF2ZWwvZmxpZ2h0c6gBCENsQXdKMENVQkVGUXlRaFVCRVJFTkVNMWFVTTVSRVJGQlZWVkZVaEFDVUZWVlZGOUdRVVFCSlNCRk1UazZCVHdScklATAWL2cvMXR0ZnFsbjYSAS8yLzA3YmM2eSAFL20vMGY2N2QxNzIAGgA" # Example Google Flights URL
        
        # # You can set flight_search_url to None or an empty string to skip this part
        # # flight_search_url = None 

        # select_cheapest_flight(page, flight_search_url)

    except PlaywrightTimeoutError as pte:
        print(f"A Playwright timeout error occurred: {pte}")
        try:
            error_screenshot_path = "error_timeout_screenshot.png"
            page.screenshot(path=error_screenshot_path)
            print(f"Timeout error screenshot saved as '{error_screenshot_path}'")
        except Exception as se:
            print(f"Could not take timeout error screenshot: {se}")
    except Exception as e:
        print(f"An error occurred: {e}")
        try:
            error_screenshot_path = "error_screenshot.png"
            page.screenshot(path=error_screenshot_path)
            print(f"Error screenshot saved as '{error_screenshot_path}'")
        except Exception as se:
            print(f"Could not take error screenshot: {se}")
    finally:
        print("Closing page and browser...")
        if 'page' in locals() and not page.is_closed():
            page.close()
        if 'browser' in locals() and browser.is_connected():
            browser.close()
        print("Page and browser closed.")

    print(f"Script finished! View replay at https://browserbase.com/sessions/{session.id}")

if __name__ == "__main__":
    with sync_playwright() as playwright:
        run(playwright)