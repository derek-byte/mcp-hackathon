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


def select_cheapest_flight(page: 'Page', flight_url: str):
    print("\n--- Starting Flight Selection ---")
    if not flight_url:
        print("Flight URL not provided. Skipping flight selection.")
        return

    print(f"Navigating to Flight URL: {flight_url}")
    page.goto(flight_url, wait_until="networkidle", timeout=120000) # Increased timeout and using networkidle
    print(f"Page title: {page.title()}")
    page.screenshot(path="screenshot_flight_page_loaded.png")

    # Based on the screenshot provided for Google Flights interface
    flight_listing_selector = "li.pIav2d"  # Each flight is an <li> with this class
    # The price is within a div with multiple classes, then a span.
    # A more specific selector for the price text content based on screenshot:
    price_container_selector = "div.YMlPec.Kp2tdc.Hk4XGb" # This div contains the span with the price
    # The clickable element for selection is often the flight listing itself or a primary div within it.
    # Let's assume the listing_locator (li.pIav2d) itself is what we might click,
    # or a prominent child div that covers most of its area.
    # From the screenshot, a div with jsaction seems like a good candidate for the actual click if the <li> isn't directly clickable.
    # For example, the div with class 'JMc5Xc': page.locator("div.JMc5Xc").
    # However, often the entire list item `li` is made clickable or Playwright handles it well.

    print(f"Looking for flight listings with selector: '{flight_listing_selector}'")
    # Wait for at least one listing to be present before proceeding
    try:
        page.wait_for_selector(flight_listing_selector, timeout=30000)
        print("Flight listings detected.")
    except PlaywrightTimeoutError:
        print("Timeout waiting for flight listings to appear with the specified selector.")
        page.screenshot(path="screenshot_flight_no_listings_found.png")
        return

    listings = page.locator(flight_listing_selector).all()

    if not listings:
        print("No flight listings found even after waiting.")
        page.screenshot(path="screenshot_flight_no_listings.png")
        return

    print(f"Found {len(listings)} flight listings.")
    cheapest_flight_info = {
        "price": float('inf'),
        "element_to_click": None, # This will be the listing_locator itself or a specific child
        "details": ""
    }

    for i, listing_locator in enumerate(listings):
        try:
            # Locate the price text using the specific div and then the span within it
            price_element = listing_locator.locator(f"{price_container_selector} span").first
            
            if not price_element.is_visible(timeout=5000):
                print(f"Price element not visible for listing {i}. Skipping.")
                continue
            
            price_text = price_element.inner_text() # Example: "$231"
            
            cleaned_price_text = re.sub(r'[^\d\.]', '', price_text) # Removes '$', commas, etc.
            if not cleaned_price_text:
                print(f"Could not parse price from '{price_text}' for listing {i}. Skipping.")
                continue
            current_price = float(cleaned_price_text)

            print(f"Listing {i+1}: Raw price text = '{price_text}', Parsed price = {current_price}")

            # The element to click will be the flight listing itself (the <li>).
            # Google Flights often makes the entire list item clickable.
            if current_price < cheapest_flight_info["price"]:
                # Check if the listing element itself seems actionable (visible and enabled)
                # The `is_enabled` check might not be relevant for an <li> but `is_visible` is.
                if listing_locator.is_visible(timeout=1000):
                    cheapest_flight_info["price"] = current_price
                    cheapest_flight_info["element_to_click"] = listing_locator # The <li> element
                    cheapest_flight_info["details"] = f"Listing {i+1} - Price: ${current_price}"
                else:
                    print(f"Listing {i+1} (price ${current_price}) is not visible. Not considering it as cheapest.")

        except PlaywrightTimeoutError:
            print(f"Timeout while processing listing {i+1}. It might not be fully loaded or visible.")
        except Exception as e:
            print(f"Error processing listing {i+1}: {e}")
            try:
                listing_locator.screenshot(path=f"screenshot_flight_listing_{i+1}_error.png")
            except Exception as se:
                print(f"Could not take screenshot of listing {i+1}: {se}")

    if cheapest_flight_info["element_to_click"]:
        print(f"Found cheapest flight: {cheapest_flight_info['details']}")
        print("Attempting to select the cheapest flight by clicking the listing...")
        
        # Scroll the chosen listing into view
        cheapest_flight_info["element_to_click"].scroll_into_view_if_needed()
        time.sleep(0.5) # Brief pause after scroll

        # Click the listing.
        # It's possible a specific child element within the listing is the actual clickable target.
        # If clicking the `li` directly doesn't work, we might need to refine this to click
        # a specific child div, e.g., one with a jsaction attribute or a prominent role.
        # For example: `cheapest_flight_info["element_to_click"].locator("div[jsaction*='click']").first.click()`
        cheapest_flight_info["element_to_click"].click()
        
        print("Clicked on the cheapest flight listing. Waiting for potential page changes...")
        # Wait for navigation or a significant change. This is a generic wait.
        # You might need to wait for a specific element on the next page if it navigates.
        time.sleep(8) # Increased wait time to observe results or page load
        page.screenshot(path="screenshot_flight_cheapest_selected_or_next_page.png")
        print("Cheapest flight selected (simulated by click). Screenshot taken.")
    else:
        print("Could not find any suitable flight to select as the cheapest.")
        page.screenshot(path="screenshot_flight_no_cheapest_found.png")
    
    print("--- Finished Flight Selection ---")


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
        flight_search_url = "https://www.google.com/travel/flights/search?tfs=CBwQAhooEgoyMDI1LTA3LTAxagwIAhIIL20vMGY2N2QSCjIwMjUtMDctMDVyDAgCEggvbS8wN18xZEABSAFSA hauntingAdqWBZ2FvZ2xlLmNvbS90cmF2ZWwvZmxpZ2h0c6gBCENsQXdKMENVQkVGUXlRaFVCRVJFTkVNMWFVTTVSRVJGQlZWVkZVaEFDVUZWVlZGOUdRVVFCSlNCRk1UazZCVHdScklATAWL2cvMXR0ZnFsbjYSAS8yLzA3YmM2eSAFL20vMGY2N2QxNzIAGgA" # Example Google Flights URL
        
        # You can set flight_search_url to None or an empty string to skip this part
        # flight_search_url = None 

        select_cheapest_flight(page, flight_search_url)

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