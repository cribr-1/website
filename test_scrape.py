import requests
import json

headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}
# Trying to query housing.com API or makaan
url = 'https://www.makaan.com/petra/app/v4/project?cityId=11&localityId=50000&page=1' # Bangalore cityId is roughly 11? Just testing
response = requests.get('https://www.makaan.com/bangalore-property/east-bangalore-real-estate-50201', headers=headers)
print("Status code:", response.status_code)
if response.status_code == 200:
    print("Success! Can scrape Makaan.")
