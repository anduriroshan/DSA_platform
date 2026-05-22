import urllib.request
import json
import time

# Give the server a couple seconds to fully initialize
time.sleep(2)

try:
    with urllib.request.urlopen("http://localhost:8000/api/algorithms") as response:
        print("Status Code:", response.getcode())
        print("Headers:", dict(response.info()))
        content = response.read().decode('utf-8')
        print("Content:", content)
except Exception as e:
    print("Error fetching:", e)
