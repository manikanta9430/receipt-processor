# Receipt Processing API
This is a NestJS-based backend service for processing receipts and calculating points based on various rules.

##  API Endpoints

### **1️. Process a Receipt**
**Endpoint:**  
`POST /receipts/process`

**Request Body (JSON):**
```json
{
  "retailer": "Target",
  "purchaseDate": "2022-01-01",
  "purchaseTime": "13:01",
  "items": [
    {
      "shortDescription": "Mountain Dew 12PK",
      "price": "6.49"
    },{
      "shortDescription": "Emils Cheese Pizza",
      "price": "12.25"
    },{
      "shortDescription": "Knorr Creamy Chicken",
      "price": "1.26"
    },{
      "shortDescription": "Doritos Nacho Cheese",
      "price": "3.35"
    },{
      "shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ",
      "price": "12.00"
    }
  ],
  "total": "35.35"
}
```

**Response:**
```json
{ "id": "7fb1377b-b223-49d9-a31a-5a02701dd310" }
```


### **2. Process a Receipt**
**Endpoint:**  
`GET /receipts/:id/points`

**Example Request:**
<br>`GET /receipts/7fb1377b-b223-49d9-a31a-5a02701dd310/points`

**Response (if ID is found):**
```json
{ "points": 28 }
```

**Response (if ID is not found):**
```json
{ "error": "Receipt not found" }
```

## How to install and run locally
**Install Dependencies :** `npm install` <br>
**Run locally:** `npm run start`

## How to build and run using Docker

### **Step-1: Build the docker image**
`docker build -t receipt-processor .`

### **Step-2 Run the container**
`docker run -d -p 7000:7000 receipt-processor`

## Important points about the application
**-->The application listens on port 7000** <br>
**-->The cache for storing points remains active until the app restarts.**