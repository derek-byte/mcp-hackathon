from playwright.sync_api import Playwright, sync_playwright, TimeoutError as PlaywrightTimeoutError
from browserbase import Browserbase
import os
from dotenv import load_dotenv
import time

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
    page.set_viewport_size({"width": 1920, "height": 1080}) # Set a common viewport size
    print("Successfully connected to the page in Browserbase.")

    try:
        url = "https://www.airbnb.com/rooms/1423262814997006353?search_mode=regular_search&adults=1&check_in=2025-08-08&check_out=2025-08-13&children=0&infants=0&pets=0&source_impression_id=p3_1748640822_P3Oy4aNQJ_UwjG3g&previous_page_section_name=1000&federated_search_id=c74408c8-026c-4dd9-bfa1-f9120d0f9a6f"
        print(f"Navigating to: {url}")
        page.goto(url, wait_until="domcontentloaded", timeout=90000) # Try domcontentloaded for faster initial load
        page_title = page.title()
        print(f"Page title: {page_title}")

        print("Taking screenshot before any action...")
        page.screenshot(path="screenshot_before_action.png")
        print("Screenshot 'screenshot_before_action.png' saved.")

        # Scroll down the page a bit to ensure elements load and are in view
        # Scrolling to the end might be too much if the button is mid-page or in a sticky element
        # that appears after some scrolling.
        print("Scrolling down the page...")
        for _ in range(3): # Scroll PageDown a few times
            page.keyboard.press("PageDown")
            time.sleep(0.5) # Wait for content to potentially load after scroll

        # Wait for network activity to settle after scrolling
        print("Waiting for network idle after scrolling...")
        page.wait_for_load_state("networkidle", timeout=30000)

        print("Taking screenshot after scrolling...")
        page.screenshot(path="screenshot_after_scroll.png")
        print("Screenshot 'screenshot_after_scroll.png' saved.")

        reserve_button_testid = "homes-pdp-cta-btn"
        print(f"Attempting to find reserve button with data-testid='{reserve_button_testid}'...")

        # Get all matching buttons
        reserve_buttons = page.get_by_test_id(reserve_button_testid)
        count = reserve_buttons.count()
        print(f"Found {count} elements with data-testid='{reserve_button_testid}'.")

        if count == 0:
            raise Exception(f"No element found with data-testid='{reserve_button_testid}'.")
        elif count == 1:
            print("Found 1 button, attempting to click it.")
            target_button = reserve_buttons
        else:
            # If multiple, try to click the last one, assuming it's the main content button
            # or the one that becomes active/visible after scrolling.
            print(f"Found {count} buttons. Attempting to click the last one that is visible.")
            # Iterate backwards to find the first visible one from the end
            target_button = None
            for i in range(count - 1, -1, -1):
                btn = reserve_buttons.nth(i)
                if btn.is_visible(): # Check for visibility
                    print(f"Button at index {i} (from end) is visible. Selecting this one.")
                    target_button = btn
                    break
            
            if not target_button:
                 print("No visible button found among the multiple matches. Defaulting to the last one in DOM.")
                 target_button = reserve_buttons.last() # Fallback to last if no visible one explicitly found by this logic

        print("Ensuring button is in view and clicking...")
        target_button.scroll_into_view_if_needed(timeout=10000)
        target_button.click(timeout=30000) # Increased timeout for the click action
        print("Clicked the Reserve button successfully.")

        print("Pausing for 5 seconds to observe the result of the click...")
        time.sleep(5)

        print("Taking screenshot after clicking 'Reserve' button...")
        page.screenshot(path="screenshot_after_click.png")
        print("Screenshot 'screenshot_after_click.png' saved.")

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