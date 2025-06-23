import type { NextApiRequest, NextApiResponse } from 'next';
import { get_retail_value } from '../../utils/retail_fallback';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { set_num, condition } = req.body;

  try {
    const response = await fetch('https://klkwwthdl7.execute-api.us-east-2.amazonaws.com/CheckPrice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ set_num, condition }),
    });

    const responseText = await response.text();
    let data: any = null;

    try {
      data = JSON.parse(responseText);
    } catch (err) {
      console.error("Failed to parse JSON from Lambda:", err);
      return res.status(500).json({ error: "Invalid JSON from Lambda" });
    }

    console.log(`${response.ok} Lambda status:`, response.status);
    console.log("📦 Lambda response:", data);

    if (!response.ok) {
      const retail_value = await get_retail_value(set_num, condition);
      if (retail_value !== null) {
        const fallbackPrice = condition.toLowerCase() === 'new'
          ? retail_value * 1.1
          : condition.toLowerCase() === 'used'
          ? retail_value * 0.6
          : retail_value;

        return res.status(200).json({ fallbackPrice, message: 'Fallback price used' });
      }
      return res.status(response.status).json({ error: 'Failed to fetch price data' });
    }

    const samples = data?.data?.price_samples;
    if (!samples || samples.length === 0) {
      const retail_value = await get_retail_value(set_num, condition);
      if (retail_value !== null) {
        const fallbackPrice = condition.toLowerCase() === 'new'
          ? retail_value * 1.1
          : retail_value * 0.6;

        return res.status(200).json({ fallbackPrice, message: 'Fallback price used' });
      }
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in check-price API:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
