import os
import re
import sys
import time
import requests
from io import BytesIO

from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

try:
    from PIL import Image, ImageFilter
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False

# config (for now only asurascans im lazy to do other webs)
BASE_URL = "https://asuracomic.net"
RESULT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "result")
NAV_TIMEOUT = 60_000
LOAD_TIMEOUT = 15_000
IMAGE_MIN_WIDTH = 800

def make_full_url(href: str) -> str:
    """Ensure href is a full absolute URL."""
    if not href:
        return ""
    if href.startswith("http"):
        return href
    # Strip leading slashes for consistency
    path = href.lstrip("/")
    # Playwright sometimes returns href without /series/ prefix
    # e.g. "pick-me-up-infinite-gacha-8b65e2fc/chapter/1"
    # Needs to become /series/pick-me-up-infinite-gacha-8b65e2fc/chapter/1
    if not path.startswith("series/"):
        path = "series/" + path
    return BASE_URL + "/" + path

def clear_screen():
    os.system("cls" if os.name == "nt" else "clear")


def print_banner():
    print(r"""
    ╔══════════════════════════════════════════════════╗
    ║      ASURA SCANS MANHWA SCRAPER  (Playwright)    ║
    ║      ────────────────────────────────────         ║
    ║      High-Quality Panel Downloader               ║
    ╚══════════════════════════════════════════════════╝
    """)


def sanitize_filename(name: str) -> str:
    name = re.sub(r'[<>:"/\\|?*]', '', name)
    return name.strip().strip('.')


def download_image(url: str, save_path: str, session: requests.Session):
    """Download image, optionally upscale, save as high-quality PNG."""
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
        ),
        "Referer": BASE_URL + "/",
        "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
    }

    resp = session.get(url, headers=headers, timeout=30, stream=True)
    resp.raise_for_status()

    if PIL_AVAILABLE:
        img = Image.open(BytesIO(resp.content))
        if img.mode in ("P", "PA"):
            img = img.convert("RGBA")

        if img.width < IMAGE_MIN_WIDTH:
            ratio = IMAGE_MIN_WIDTH / img.width
            new_size = (IMAGE_MIN_WIDTH, int(img.height * ratio))
            img = img.resize(new_size, Image.LANCZOS)

        # Subtle sharpen for crispness
        img = img.filter(ImageFilter.SHARPEN)

        final_path = os.path.splitext(save_path)[0] + ".png"
        if img.mode == "RGBA":
            img.save(final_path, "PNG", optimize=True)
        else:
            img.convert("RGB").save(final_path, "PNG", optimize=True)
    else:
        ext = os.path.splitext(url.split("?")[0])[-1] or ".jpg"
        final_path = os.path.splitext(save_path)[0] + ext
        with open(final_path, "wb") as f:
            for chunk in resp.iter_content(8192):
                f.write(chunk)

    return final_path

def new_page(browser):
    """Create a new browser page with stealth-ish settings."""
    ctx = browser.new_context(
        user_agent=(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
        ),
        viewport={"width": 1920, "height": 1080},
        java_script_enabled=True,
    )
    page = ctx.new_page()
    page.set_default_navigation_timeout(NAV_TIMEOUT)
    page.set_default_timeout(LOAD_TIMEOUT)

    def route_handler(route):
        if route.request.resource_type in ("font", "media"):
            route.abort()
        else:
            route.continue_()

    page.route("**/*", route_handler)
    return page


def safe_goto(page, url, retries=3):
    """Navigate to url with retries on failure."""
    for attempt in range(1, retries + 1):
        try:
            page.goto(url, wait_until="domcontentloaded")
            return True
        except Exception as e:
            print(f"  [!] Attempt {attempt}/{retries} failed: {type(e).__name__}: {e}")
            if attempt < retries:
                time.sleep(3)
    return False


def scroll_full_page(page, pause_ms=400):
    """Scroll page in increments so lazy images trigger."""
    page.evaluate("""
        async (pauseMs) => {
            await new Promise(resolve => {
                let totalHeight = 0;
                const distance = 600;
                const timer = setInterval(() => {
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    if (totalHeight >= document.body.scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, pauseMs);
            });
        }
    """, pause_ms)
    page.evaluate("window.scrollTo(0, 0)")
    time.sleep(0.3)
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    time.sleep(1)


# its scraping time baby

def get_popular_manhwa(page, tab="weekly"):
    """Scrape popular manhwa sidebar from homepage."""
    print(f"\n  [*] Loading homepage...")
    if not safe_goto(page, BASE_URL):
        print("  [!] Could not load homepage.")
        return []

    page.wait_for_timeout(2000)

    try:
        buttons = page.query_selector_all('[role="tablist"] button[role="tab"]')
        for btn in buttons:
            if btn.inner_text().strip().lower() == tab.lower():
                btn.click()
                page.wait_for_timeout(1000)
                break
    except Exception:
        pass

    manhwa_list = []
    try:
        panels = page.query_selector_all('[role="tabpanel"][data-state="active"]')
        if not panels:
            panels = page.query_selector_all('[role="tabpanel"]')
        if not panels:
            return manhwa_list

        panel = panels[0]
        items = panel.query_selector_all('div.flex.px-\\[15px\\].py-3')

        for item in items:
            try:
                rank_el = item.query_selector('div.text-center')
                rank = rank_el.inner_text().strip() if rank_el else "?"

                link_el = (
                    item.query_selector('span.block a')
                    or item.query_selector('a.overflow-hidden.block')
                )
                if not link_el:
                    continue
                title = link_el.inner_text().strip()
                url = link_el.get_attribute("href") or ""
                url = make_full_url(url)

                rating_el = item.query_selector('div.italic')
                rating = rating_el.inner_text().strip() if rating_el else "N/A"

                manhwa_list.append({
                    "rank": rank,
                    "title": title,
                    "url": url,
                    "rating": rating,
                })
            except Exception:
                continue
    except Exception as e:
        print(f"  [!] Error parsing popular: {e}")

    return manhwa_list


def get_latest_updates(page):
    """Scrape latest updated manhwa from homepage."""
    print("\n  [*] Loading homepage for latest updates...")
    if not safe_goto(page, BASE_URL):
        return []

    page.wait_for_timeout(3000)

    updates = []
    seen = set()
    try:
        links = page.query_selector_all('a[href*="/series/"]')
        for link in links:
            href = link.get_attribute("href") or ""
            if not href or href in seen or "/chapter/" in href:
                continue

            title = ""
            span = link.query_selector("span.block, span, p")
            if span:
                title = span.inner_text().strip()
            if not title:
                img = link.query_selector("img")
                if img:
                    title = img.get_attribute("alt") or ""
            if not title or len(title) < 2:
                continue

            full_url = make_full_url(href)
            seen.add(href)
            updates.append({"title": title.strip(), "url": full_url})
    except Exception as e:
        print(f"  [!] Error: {e}")

    return updates


def get_chapter_list(page, series_url: str):
    """Get chapters from a series page. Returns (title, [{chapter_num, title, url}])."""
    print(f"\n  [*] Loading series page...")
    if not safe_goto(page, series_url):
        return "", []

    page.wait_for_timeout(3000)

    series_title = ""
    for sel in ["span.text-xl", "h1", "h2.font-bold", "h3"]:
        el = page.query_selector(sel)
        if el:
            t = el.inner_text().strip()
            if t and len(t) > 2:
                series_title = t
                break
    if not series_title:
        m = re.search(r"/series/([^/]+)", series_url)
        if m:
            series_title = m.group(1).rsplit("-", 1)[0].replace("-", " ").title()

    chapters = []
    seen = set()
    ch_links = page.query_selector_all('a[href*="/chapter/"]')
    for link in ch_links:
        href = link.get_attribute("href") or ""
        if not href or href in seen:
            continue
        seen.add(href)

        text = link.inner_text().strip()
        ch_match = re.search(r"/chapter/(\d+)", href)
        ch_num = ch_match.group(1) if ch_match else "?"
        full_url = make_full_url(href)

        chapters.append({
            "chapter_num": ch_num,
            "title": text if text else f"Chapter {ch_num}",
            "url": full_url,
        })

    try:
        chapters.sort(key=lambda x: int(x["chapter_num"]) if x["chapter_num"].isdigit() else 0)
    except Exception:
        pass

    return series_title, chapters


def scrape_chapter_images(page, chapter_url: str):
    """Scrape all panel images from a chapter page."""
    print(f"\n  [*] Loading chapter: {chapter_url}")
    if not safe_goto(page, chapter_url):
        return "Unknown", "0", []

    try:
        page.wait_for_selector(
            'img[alt*="chapter page"]',
            timeout=20_000,
        )
    except PWTimeout:
        print("  [!] Timeout waiting for images, continuing anyway...")

    print("  [*] Scrolling to load all panels...")
    scroll_full_page(page, pause_ms=350)
    page.wait_for_timeout(2000)
    scroll_full_page(page, pause_ms=200)
    page.wait_for_timeout(1000)

    url_match = re.search(r"/series/([^/]+?)(?:-[a-f0-9]{6,})?/chapter/(\d+)", chapter_url)
    if url_match:
        manhwa_name = url_match.group(1).replace("-", " ").title()
        chapter_num = url_match.group(2)
    else:
        manhwa_name = "Unknown Manhwa"
        ch_m = re.search(r"/chapter/(\d+)", chapter_url)
        chapter_num = ch_m.group(1) if ch_m else "0"

    try:
        for a in page.query_selector_all('a[href*="/series/"]'):
            t = a.inner_text().strip()
            if t and len(t) > 3 and "chapter" not in t.lower():
                manhwa_name = t
                break
    except Exception:
        pass

    image_urls = []
    imgs = page.query_selector_all('div.w-full.mx-auto.center img')
    for img in imgs:
        src = img.get_attribute("src") or img.get_attribute("data-src") or ""
        alt = img.get_attribute("alt") or ""

        if "EndDesign" in src or "end page" in alt.lower():
            continue
        if not src or src.startswith("data:"):
            continue
        if "chapter page" in alt.lower() or "/storage/media/" in src:
            image_urls.append(src)

    if not image_urls:
        print("  [*] Trying broader image search...")
        for img in page.query_selector_all("img"):
            alt = img.get_attribute("alt") or ""
            src = img.get_attribute("src") or ""
            if "chapter page" in alt.lower() and src and not src.startswith("data:"):
                image_urls.append(src)

    print(f"  [+] Found {len(image_urls)} panels")
    return manhwa_name, chapter_num, image_urls


def download_chapter(manhwa_name: str, chapter_num: str, image_urls: list):
    """Download all chapter images to result/<name>/chapter_<num>/."""
    if not image_urls:
        print("  [!] No images to download.")
        return

    safe_name = sanitize_filename(manhwa_name)
    chapter_dir = os.path.join(RESULT_DIR, safe_name, f"chapter_{chapter_num}")
    os.makedirs(chapter_dir, exist_ok=True)

    session = requests.Session()
    total = len(image_urls)
    print(f"\n  [*] Downloading {total} pages to:\n      {chapter_dir}")
    print(f"  {'─' * 50}")

    for i, url in enumerate(image_urls, 1):
        save_path = os.path.join(chapter_dir, f"page_{i:03d}")
        try:
            download_image(url, save_path, session)
            filled = int(30 * i / total)
            bar = "█" * filled + "░" * (30 - filled)
            print(f"\r  [{bar}] {i}/{total} - page_{i:03d}", end="", flush=True)
        except Exception as e:
            print(f"\n  [!] Failed page {i}: {e}")

    print(f"\n  {'─' * 50}")
    print(f"  [OK] Download complete! -> {chapter_dir}")
    if PIL_AVAILABLE:
        print(f"  [OK] Images upscaled & sharpened (min {IMAGE_MIN_WIDTH}px wide)")
    else:
        print("  [i] Install Pillow for upscaling: pip install Pillow")

    session.close()


def menu_popular(page):
    while True:
        print("\n  ┌─── Popular Manhwa ─────────────────────────┐")
        print("  │  1. Weekly                                  │")
        print("  │  2. Monthly                                 │")
        print("  │  3. All Time                                │")
        print("  │  0. Back                                    │")
        print("  └─────────────────────────────────────────────┘")

        choice = input("\n  Select tab > ").strip()
        if choice == "0":
            return

        tab = {"1": "weekly", "2": "monthly", "3": "all"}.get(choice, "weekly")
        manhwa_list = get_popular_manhwa(page, tab)

        if not manhwa_list:
            print("  [!] No manhwa found.")
            continue

        print(f"\n  {'─' * 55}")
        print(f"  {'#':<4} {'Title':<35} {'Rating':<8}")
        print(f"  {'─' * 55}")
        for m in manhwa_list:
            print(f"  {m['rank']:<4} {m['title'][:33]:<35} ★ {m['rating']:<6}")
        print(f"  {'─' * 55}")

        pick = input("\n  Enter rank # to select (0 = back) > ").strip()
        if pick == "0":
            continue

        selected = next((m for m in manhwa_list if m["rank"] == pick), None)
        if not selected:
            print("  [!] Invalid selection.")
            continue

        menu_series(page, selected["url"], selected["title"])


def menu_latest(page):
    updates = get_latest_updates(page)
    if not updates:
        print("  [!] No updates found.")
        return

    seen, unique = set(), []
    for u in updates:
        if u["url"] not in seen:
            seen.add(u["url"])
            unique.append(u)
    updates = unique[:20]

    print(f"\n  {'─' * 55}")
    print(f"  {'#':<4} {'Title':<50}")
    print(f"  {'─' * 55}")
    for i, u in enumerate(updates, 1):
        print(f"  {i:<4} {u['title'][:48]}")
    print(f"  {'─' * 55}")

    pick = input("\n  Enter number to select (0 = back) > ").strip()
    if pick == "0":
        return
    try:
        idx = int(pick) - 1
        if 0 <= idx < len(updates):
            menu_series(page, updates[idx]["url"], updates[idx]["title"])
        else:
            print("  [!] Invalid selection.")
    except ValueError:
        print("  [!] Invalid input.")


def menu_series(page, series_url: str, series_title: str = ""):
    title, chapters = get_chapter_list(page, series_url)
    if series_title:
        title = series_title

    if not chapters:
        print("  [!] No chapters found.")
        return

    print(f"\n  Series: {title}")
    print(f"  Total chapters: {len(chapters)}")
    print(f"  {'─' * 55}")

    if len(chapters) > 20:
        for ch in chapters[:5]:
            print(f"    Ch.{ch['chapter_num']:<6} {ch['title'][:45]}")
        print(f"    ... ({len(chapters) - 10} more) ...")
        for ch in chapters[-5:]:
            print(f"    Ch.{ch['chapter_num']:<6} {ch['title'][:45]}")
    else:
        for ch in chapters:
            print(f"    Ch.{ch['chapter_num']:<6} {ch['title'][:45]}")

    print(f"  {'─' * 55}")
    print("  Enter chapter(s): 1  |  1-10  |  5,10,15  |  all")
    print("  0 = back")

    pick = input("\n  Chapter(s) > ").strip().lower()
    if pick == "0":
        return

    selected_nums = set()
    if pick == "all":
        selected_nums = {ch["chapter_num"] for ch in chapters}
    else:
        for part in pick.replace(" ", "").split(","):
            if "-" in part:
                try:
                    a, b = part.split("-", 1)
                    for n in range(int(a), int(b) + 1):
                        selected_nums.add(str(n))
                except ValueError:
                    pass
            else:
                selected_nums.add(part)

    to_download = [ch for ch in chapters if ch["chapter_num"] in selected_nums]
    if not to_download:
        print("  [!] No matching chapters.")
        return

    print(f"\n  [*] Will download {len(to_download)} chapter(s)")
    for ch in to_download:
        print(f"\n  {'═' * 55}")
        print(f"  Downloading: {title} - Chapter {ch['chapter_num']}")
        print(f"  {'═' * 55}")
        _, _, images = scrape_chapter_images(page, ch["url"])
        download_chapter(title, ch["chapter_num"], images)


def menu_direct_url(page):
    print("\n  Enter full chapter URL.")
    print("  Example: https://asuracomic.net/series/the-tutorial-is-too-hard-74967906/chapter/0")
    print("  0 = back")

    url = input("\n  URL > ").strip()
    if url == "0":
        return
    if "asuracomic" not in url.lower():
        print("  [!] Only AsuraScans URLs supported.")
        return

    if "/chapter/" not in url:
        menu_series(page, url)
        return

    name, ch_num, images = scrape_chapter_images(page, url)
    download_chapter(name, ch_num, images)


# i hope it runs

def main():
    clear_screen()
    print_banner()

    if not PIL_AVAILABLE:
        print("  [!] Pillow not installed — images won't be upscaled.")
        print("      pip install Pillow\n")

    print("  [*] Launching Playwright Chromium...")

    with sync_playwright() as pw:
        browser = pw.chromium.launch(
            headless=True,
            args=["--disable-blink-features=AutomationControlled"],
        )
        page = new_page(browser)

        try:
            while True:
                print("\n  ┌─── MAIN MENU ────────────────────────────────┐")
                print("  │                                               │")
                print("  │  1. Popular Manhwa (Weekly/Monthly/All)       │")
                print("  │  2. Latest Updates                            │")
                print("  │  3. Direct Chapter URL                        │")
                print("  │  4. Enter Series URL                          │")
                print("  │  0. Exit                                      │")
                print("  │                                               │")
                print("  └───────────────────────────────────────────────┘")

                choice = input("\n  Select > ").strip()

                if choice == "1":
                    menu_popular(page)
                elif choice == "2":
                    menu_latest(page)
                elif choice == "3":
                    menu_direct_url(page)
                elif choice == "4":
                    print("\n  Enter series URL.")
                    print("  Example: https://asuracomic.net/series/nano-machine-ccdc98ed")
                    url = input("\n  URL > ").strip()
                    if url and url != "0":
                        menu_series(page, url)
                elif choice == "0":
                    print("\n  Bye!")
                    break
                else:
                    print("  [!] Invalid option.")

        except KeyboardInterrupt:
            print("\n\n  [*] Interrupted.")
        finally:
            browser.close()
            print("  [*] Browser closed.")


if __name__ == "__main__":
    main()
