// utils/retail_fallback.ts

const retailMap: Record<string, { price: number; name: string; url: string }> = {
  "71043": {
    price: 399.99,
    name: "Hogwarts Castle",
    url: "https://www.brickeconomy.com/set/71043-1/lego-hogwarts-castle"
  },
  "75257": {
    price: 99.99,
    name: "Millennium Falcon",
    url: "https://www.brickeconomy.com/set/75257-1/lego-millennium-falcon"
  },
  "21319": {
    price: 69.99,
    name: "Friends Central Perk",
    url: "https://www.brickeconomy.com/set/21319-1/lego-central-perk"
  },
  "75313": {
    price: 849.99,
    name: "UCS AT-AT",
    url: "https://www.brickeconomy.com/set/75313-1/lego-at-at"
  },
  "10276": {
    price: 249.99,
    name: "Colosseum",
    url: "https://www.brickeconomy.com/set/10276-1/lego-colosseum"
  },
  "10294": {
    price: 199.99,
    name: "Titanic",
    url: "https://www.brickeconomy.com/set/10294-1/lego-titanic"
  },
  "21318": {
    price: 199.99,
    name: "Tree House",
    url: "https://www.brickeconomy.com/set/21318-1/lego-tree-house"
  },
  "10295": {
    price: 149.99,
    name: "Porsche 911",
    url: "https://www.brickeconomy.com/set/10295-1/lego-porsche-911"
  },
  "10280": {
    price: 49.99,
    name: "Flower Bouquet",
    url: "https://www.brickeconomy.com/set/10280-1/lego-flower-bouquet"
  },
  "76139": {
    price: 249.99,
    name: "1989 Batmobile",
    url: "https://www.brickeconomy.com/set/76139-1/lego-1989-batmobile"
  }
};

export async function get_retail_value(set_num: string, condition: string): Promise<number | null> {
  const entry = retailMap[set_num];
  if (!entry) {
    console.warn(`⚠️ No retail price found for set ${set_num}`);
    return null;
  }

  console.log(`✅ MSRP for ${entry.name} (${set_num}): $${entry.price}`);
  return entry.price;
}
