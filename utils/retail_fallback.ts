export async function get_retail_value(set_num: string, condition: string = 'new') {
  const apiKey = process.env.BRICKECONOMY_API_KEY;
  const userAgent = process.env.USER_AGENT;

  const url = `https://www.brickeconomy.com/api/v1/set/${set_num}?currency=USD`;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-apikey': apiKey || '',
      'User-Agent': userAgent || ''
    }
  };

  try {
    const response = await fetch(url, options);
    const json = await response.json();
    const data = json.data;

    if (!data) throw new Error("No data returned");

    const marketPrice = condition.toLowerCase() === 'new'
      ? data.current_value_new
      : condition.toLowerCase() === 'used'
      ? data.current_value_used
      : null;

    return {
      marketPrice,
      meta: {
        name: data.name,
        set_number: data.set_number,
        theme: `${data.theme} - ${data.subtheme}`,
        year: data.year,
        pieces: data.pieces_count,
        minifigs: data.minifigs_count,
        isRetired: data.retired,
        releaseDate: data.released_date,
        retiredDate: data.retired_date,
        retailPrice: {
          us: data.retail_price_us,
          uk: data.retail_price_uk,
          ca: data.retail_price_ca
        },
        forecast: {
          in2Y: data.forecast_value_new_2_years,
          in5Y: data.forecast_value_new_5_years
        },
        lastNewSale: data.price_events_new?.[0],
        lastUsedSale: data.price_events_used?.[0],
        growth12mo: data.rolling_growth_12months,
        growth1Y: data.rolling_growth_lastyear
      }
    };
  } catch (err) {
    console.error(`Error fetching retail value for ${set_num}:`, err);
    return null;
  }
}
