import requests
from bs4 import BeautifulSoup
import time
from listings.models import Listing, Source
from django.utils import timezone
from django.db import transaction

SS_COM_CARS_URL = "https://www.ss.com/lv/transport/cars/bmw/"
BASE_URL = "https://www.ss.com"

def get_listing_links():
    """
    Fetches all BMW listing links from ss.com (pagination supported).
    """
    links = []
    page = 1
    while True:
        url = SS_COM_CARS_URL + f"page{page}.html" if page > 1 else SS_COM_CARS_URL
        resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        soup = BeautifulSoup(resp.text, "html.parser")
        table = soup.find("table", {"id": "page_main"})
        if not table:
            break
        rows = table.find_all("tr")[1:]  # skip header
        page_links = []
        for row in rows:
            link_tag = row.find("a", href=True)
            if link_tag and "/msg/" in link_tag["href"]:
                page_links.append(BASE_URL + link_tag["href"])
        if not page_links:
            break
        links.extend(page_links)
        page += 1
        time.sleep(1)  # be polite to ss.com
    return links

def parse_listing(url):
    """
    Parses a single BMW listing page and returns a dict of fields.
    """
    resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
    soup = BeautifulSoup(resp.text, "html.parser")
    title = soup.find("h2").text.strip() if soup.find("h2") else "BMW"
    price_tag = soup.find("td", class_="ads_price")
    price = int(price_tag.text.replace("€", "").replace(" ", "").strip()) if price_tag else None
    location = soup.find("td", class_="ads_city").text.strip() if soup.find("td", class_="ads_city") else ""
    description = soup.find("div", id="msg_div_msg").text.strip() if soup.find("div", id="msg_div_msg") else ""
    images = []
    img_tags = soup.select("div#pic_div img")
    for img in img_tags:
        src = img.get("src")
        if src:
            images.append("https:" + src if src.startswith("//") else src)
    # Extract year, mileage, fuel, etc. from table
    details = {}
    for row in soup.select("table#details td"):
        text = row.text.strip()
        if "Gads:" in text:
            details["year"] = text.replace("Gads:", "").strip()
        if "Nobraukums:" in text:
            details["mileage"] = text.replace("Nobraukums:", "").replace("km", "").replace(" ", "").strip()
        if "Degviela:" in text:
            details["fuel_type"] = text.replace("Degviela:", "").strip()
    # External ID from URL
    external_id = url.split("/")[-2]
    return {
        "external_id": external_id,
        "title": title,
        "price": price,
        "location": location,
        "description": description,
        "images": images,
        "year": details.get("year"),
        "mileage": details.get("mileage"),
        "fuel_type": details.get("fuel_type"),
        "url": url,
    }

def save_listing(data, source_obj):
    """
    Saves or updates a Listing in the database.
    """
    with transaction.atomic():
        listing, created = Listing.objects.update_or_create(
            external_id=data["external_id"],
            source=source_obj,
            defaults={
                "title": data["title"],
                "description": data["description"],
                "price": data["price"],
                "location": data["location"],
                "images": data["images"],
                "url": data["url"],
                "year": data["year"],
                "mileage": data["mileage"],
                "fuel_type": data["fuel_type"],
                "listing_type": "car",
                "car_category": "BMW",
                "is_active": True,
                "scraped_at": timezone.now(),
            }
        )
        return listing, created

def main():
    # Ensure Source exists
    source_obj, _ = Source.objects.get_or_create(
        name="ss.com",
        defaults={"source_type": "car", "url": SS_COM_CARS_URL, "is_active": True}
    )
    links = get_listing_links()
    print(f"Found {len(links)} BMW listings on ss.com")
    for url in links:
        try:
            data = parse_listing(url)
            save_listing(data, source_obj)
            print(f"Saved: {data['title']} ({data['external_id']})")
            time.sleep(0.5)
        except Exception as e:
            print(f"Error scraping {url}: {e}")

if __name__ == "__main__":
    # This script should be run with Django context, e.g.:
    # python manage.py shell < scrapers/sscom.py
    main()