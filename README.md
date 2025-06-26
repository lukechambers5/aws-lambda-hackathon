# LEGO Price Tracker (AWS Lambda Hackathon)

This project tracks LEGO set prices using AWS Lambda, DynamoDB, API Gateway, and a Next.js frontend. It checks a cached price first in DynamoDB, and if not found, fetches live data from the BrickEconomy API and stores it for future use.

---

## Live Demo

> (Add your frontend deployment URL here, e.g., `https://lego-prices.vercel.app`)

---

## AWS Services Used

| Service              | Purpose                                                                 |
|----------------------|-------------------------------------------------------------------------|
| **AWS Lambda**        | Serverless backend to check and store prices in DynamoDB               |
| **Amazon DynamoDB**   | NoSQL database for storing LEGO price samples                          |
| **Amazon API Gateway**| Public endpoint to trigger Lambda using a POST request                 |
| **IAM Roles**         | Grants Lambda permission to read/write from DynamoDB                   |
| **CloudWatch Logs**   | Debugging and monitoring Lambda execution and errors                   |

---

## Overview

1. User enters a LEGO set number and condition (new/used)
2. `/api/check-price` (Next.js API route) sends a POST to the AWS Lambda endpoint
3. **Lambda flow:**
   - Checks DynamoDB for `set_num + condition`
   - If found: returns cached price
   - If not found: `/api/check-price` uses `retail_fallback.ts` to call BrickEconomy API
   - Stores the new price into DynamoDB via another call to the same Lambda
4. The result is shown to the user with name, year, and latest price


---

## Lambda Deep Dive

- The function receives an HTTP POST request via **API Gateway**
- The request must include a `set_num` and `condition`
- If `store: true` is included:
  - It will expect additional fields (`name`, `year`, `price_samples`)
  - Stores the price data in **DynamoDB**
- If `store` is not set or false:
  - It will **retrieve** the existing price data from DynamoDB and return it to the client


---

## Example Input (Fetch)

```json
{
  "set_num": "10236-1",
  "condition": "new"
}
```


---

## Example Output (Found)
```json
{
  "message": "Price found",
  "data": {
    "set_num": "10236-1",
    "condition": "new",
    "name": "Ewok Village",
    "year": 2013,
    "price_samples": [
      { "source": "BrickEconomy", "value": 450 }
    ]
  }
}
```


---

## Example Output (Not Found)
```json
{
  "message": "No price data available for this set."
}
```


---

## Tech Stack

### Frontend
- **Next.js (React)**
- API route: `/api/check-price`
- User interface: `/index.tsx` page with clean inputs and result

### Backend
- **AWS Lambda** (Python)
- **DynamoDB** with partition key `set_num` and sort key `condition`
- **API Gateway** to expose Lambda securely
- **Node.js API route** to orchestrate logic

---
