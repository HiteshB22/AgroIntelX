import requests

# url = "https://res.cloudinary.com/drxcqxkro/raw/upload/v1767716774/soil-reports/onceab8zlglkmepn2hmb.pdf"
url =  'https://res.cloudinary.com/drxcqxkro/raw/upload/s--jGWY_eon--/v1/soil-reports/aafygjni373xbjrvlwmn.pdf'

r = requests.get(url)
print("Status:", r.status_code)
print("Content-Type:", r.headers.get("Content-Type"))
print("Size:", len(r.content))
