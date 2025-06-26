import type { NextApiRequest, NextApiResponse } from 'next';
import { get_retail_value } from '../../utils/retail_fallback';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { set_num, condition } = req.body;

  if (!set_num || !condition) {
    return res.status(400).json({ error: 'Missing set_num or condition' });
  }

  try {
    // 🔍 Step 1: Try to fetch from DynamoDB (via Lambda)
    const response = await fetch('https://klkwwthdl7.execute-api.us-east-2.amazonaws.com/CheckPrice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ set_num, condition }),
    });

    const responseText = await response.text();
    let data: any;

    try {
      data = JSON.parse(responseText);
    } catch (err) {
      console.error("Failed to parse JSON from Lambda:", err);
      return res.status(500).json({ error: "Invalid JSON from Lambda" });
    }

    const samples = data?.data?.price_samples;

    // If no result or empty samples, fallback to BrickEconomy
    if (!response.ok || !samples || samples.length === 0) {
      type FallbackType = {
        marketPrice?: number;
        retailPrice?: {
          us?: number;
          uk?: number;
          ca?: number;
        };
        meta: {
          name: string;
          year: number;
        };
      };

      let fallback = await get_retail_value(set_num, condition) as FallbackType;

      if (fallback) {
        let fallbackPrice = 0;
        if (fallback.marketPrice != null) {
          fallbackPrice = fallback.marketPrice;
        }
        if(fallbackPrice == 0){
          fallback = await get_retail_value(set_num, "new") as FallbackType;
          fallbackPrice = fallback?.marketPrice ? fallback.marketPrice * 0.8 : 0;

        }
        const storeResponse = await fetch('https://klkwwthdl7.execute-api.us-east-2.amazonaws.com/CheckPrice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            store: true,
            set_num,
            condition,
            name: fallback.meta.name,
            year: fallback.meta.year,
            price_samples: [{
              date: new Date().toISOString().split('T')[0],
              value: Number(fallbackPrice.toFixed(2))
            }]
          })
        });
        const storeResult = await storeResponse.text();
        return res.status(200).json({
          message: 'Fallback price used',
          data: {
            set_num,
            condition,
            name: fallback.meta.name,
            year: fallback.meta.year,
            price_samples: [
              {
                date: new Date().toISOString().split('T')[0],
                value: Number(fallbackPrice.toFixed(2))
              }
            ]
          }
        });
      }

      return res.status(500).json({ error: 'Unable to fetch fallback price' });
    }

    // ✅ If price samples exist, return normal data
    return res.status(200).json(data);

  } catch (error) {
    console.error('Error in check-price API:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
