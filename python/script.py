import pandas as pd
# from geopy.geocoders import Nominatim
from opencage.geocoder import OpenCageGeocode
import json
import time

# geolocator = Nominatim(user_agent="http")

def get_location(address, api_key):
    geocoder = OpenCageGeocode(api_key)
    
    try:
        location = geocoder.geocode(address)
        lat = location[0]['geometry']['lat']
        lng = location[0]['geometry']['lng']
        return [lat, lng]
    except:
        return None


df = pd.read_csv('zomato.csv')
i = 1
res = []
api_key = '41e52051016b4a7891381bd7235e26c2'
    

for index, row in df.iterrows():
    if index == 2500:
        break
    address = row['address']
    location = get_location(address, api_key)
    time.sleep(2)
    name = row['name']
    username = 'restaurant'+str(i)
    if location is not None:
        data = {
            'name': name,
            'address': address,
            'location': [location[0], location[1]],
            'username': username,
            'password': 'password'
        }
        print(data)
        res.append(data)
        i += 1

with open('output.json', 'w') as file:
    json.dump(res, file, indent=2)