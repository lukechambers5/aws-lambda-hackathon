
# 🧱 LEGO Price Generator – AWS Lambda Hackathon Project

This is a full-stack price suggestion tool for LEGO sets based on condition and set number, using:

- **AWS Lambda** (serverless price logic)
- **API Gateway** (secure endpoint)
- **DynamoDB** (price samples per set)
- **Next.js API Route** (frontend/backend bridge)

## 💡 How it works

1. A user enters a LEGO set number and condition (`new` or `used`).
2. The request hits an AWS API Gateway URL which triggers a Lambda function.
3. The Lambda reads price samples from DynamoDB.
4. If no price samples exist, a fallback price is estimated based on retail value.

## 🗃️ DynamoDB Schema

Each item has:
- `set_num`: string (partition key)
- `condition`: string (`new` or `used`)
- `price_samples`: list of numbers (e.g. `[{"N":"150"},{"N":"160"}]`)

## 📦 Lambda Function Sample

```js
// lambda/handler.js
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const { set_num, condition } = JSON.parse(event.body);
  const params = {
    TableName: 'LegoPrices',
    Key: { set_num, condition }
  };

  try {
    const data = await docClient.get(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ data: data.Item || {} }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data' }),
    };
  }
};
```

## 🔁 Fallback Logic

If price samples are missing, fallback prices are:
- `new` → `retail * 1.1`
- `used` → `retail * 0.6`

Defined in `get_retail_value()`.

## 🚀 Deployment

This repo includes:
- Your frontend-facing API route
- A placeholder Lambda function
- Sample data for DynamoDB

## 📌 Example Request

```ts
POST /api/check-price
{
  "set_num": "75257",
  "condition": "new",
  "sell_method": "auction"
}
```