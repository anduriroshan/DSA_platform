from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

response = client.get("/api/algorithms")
print("Status Code:", response.status_code)
print("Response JSON:", response.json())
print("Raw Content:", response.content)

# Test single algorithm
response_single = client.get("/api/algorithms/bubble-sort")
print("Single Status Code:", response_single.status_code)
print("Single Response JSON:", response_single.json())
