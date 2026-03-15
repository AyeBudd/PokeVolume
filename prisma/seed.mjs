import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sets = [
  { slug: 'surging-sparks', name: 'Surging Sparks', era: 'Scarlet & Violet', releaseDate: '2025-02-07' },
  { slug: 'pokemon-151', name: '151', era: 'Scarlet & Violet', releaseDate: '2023-09-22' },
  { slug: 'crown-zenith', name: 'Crown Zenith', era: 'Sword & Shield', releaseDate: '2023-01-20' },
  { slug: 'paldean-fates', name: 'Paldean Fates', era: 'Scarlet & Violet', releaseDate: '2024-01-26' },
  { slug: 'obsidian-flames', name: 'Obsidian Flames', era: 'Scarlet & Violet', releaseDate: '2023-08-11' },
  { slug: 'twilight-masquerade', name: 'Twilight Masquerade', era: 'Scarlet & Violet', releaseDate: '2024-05-24' },
  { slug: 'temporal-forces', name: 'Temporal Forces', era: 'Scarlet & Violet', releaseDate: '2024-03-22' },
  { slug: 'paradox-rift', name: 'Paradox Rift', era: 'Scarlet & Violet', releaseDate: '2023-11-03' },
  { slug: 'stellar-crown', name: 'Stellar Crown', era: 'Scarlet & Violet', releaseDate: '2024-09-13' }
];

const packTemplates = [
  { slug: 'surging-sparks-booster-pack', setSlug: 'surging-sparks', name: 'Surging Sparks Booster Pack', summary: 'High-upside modern set with volatile top chase values.', releaseDate: '2025-02-07', ebay: 5.8, pc: 4.99 },
  { slug: '151-booster-pack', setSlug: 'pokemon-151', name: 'Pokémon 151 Booster Pack', summary: 'Collector favorite with strong nostalgia demand.', releaseDate: '2023-09-22', ebay: 11.5, pc: 8.99 },
  { slug: 'crown-zenith-booster-pack', setSlug: 'crown-zenith', name: 'Crown Zenith Booster Pack', summary: 'Deep hit pool with broad mid-tier value support.', releaseDate: '2023-01-20', ebay: 6.75, pc: 5.49 },
  { slug: 'paldean-fates-booster-pack', setSlug: 'paldean-fates', name: 'Paldean Fates Booster Pack', summary: 'Shiny-focused subset with premium chase cards.', releaseDate: '2024-01-26', ebay: 7.1, pc: 5.99 },
  { slug: 'obsidian-flames-booster-pack', setSlug: 'obsidian-flames', name: 'Obsidian Flames Booster Pack', summary: 'Accessible set with one elite chase and steady rares.', releaseDate: '2023-08-11', ebay: 4.2, pc: 3.99 },
  { slug: 'twilight-masquerade-booster-pack', setSlug: 'twilight-masquerade', name: 'Twilight Masquerade Booster Pack', summary: 'Meta relevance and collectible art rares in balance.', releaseDate: '2024-05-24', ebay: 5.25, pc: 4.99 },
  { slug: 'temporal-forces-booster-pack', setSlug: 'temporal-forces', name: 'Temporal Forces Booster Pack', summary: 'Strong special illustration rares with moderate depth.', releaseDate: '2024-03-22', ebay: 4.95, pc: 4.49 },
  { slug: 'paradox-rift-booster-pack', setSlug: 'paradox-rift', name: 'Paradox Rift Booster Pack', summary: 'Large set checklist with reliable competitive singles.', releaseDate: '2023-11-03', ebay: 4.5, pc: 4.49 },
  { slug: 'stellar-crown-booster-pack', setSlug: 'stellar-crown', name: 'Stellar Crown Booster Pack', summary: 'Newer release with room for repricing as supply settles.', releaseDate: '2024-09-13', ebay: 5.9, pc: 4.99 }
];

const cardTemplates = [
  ['charizard-ex-sir', 'Charizard ex', '223/197', 'Special Illustration Rare', 125],
  ['pikachu-ex-sir', 'Pikachu ex', '198/165', 'Special Illustration Rare', 82],
  ['mew-ex-sir', 'Mew ex', '205/165', 'Special Illustration Rare', 94],
  ['greninja-ex-sir', 'Greninja ex', '214/167', 'Special Illustration Rare', 71],
  ['giratina-vstar-gold', 'Giratina VSTAR', 'GG69/GG70', 'Hyper Rare', 95],
  ['iono-sir', 'Iono', '269/193', 'Special Illustration Rare', 62],
  ['roaring-moon-ex-sir', 'Roaring Moon ex', '251/182', 'Special Illustration Rare', 54],
  ['gardevoir-ex-sir', 'Gardevoir ex', '245/091', 'Special Illustration Rare', 66],
  ['bloodmoon-ursaluna-ex-sir', 'Bloodmoon Ursaluna ex', '216/167', 'Special Illustration Rare', 47],
  ['area-zero-underdepths-gold', 'Area Zero Underdepths', '174/142', 'Hyper Rare', 33]
];

const fallbackProbabilities = [0.0038, 0.0045, 0.005, 0.006, 0.004, 0.009, 0.0075, 0.008, 0.01, 0.0125];

async function main() {
  await prisma.sourceListing.deleteMany();
  await prisma.pullRate.deleteMany();
  await prisma.packPrice.deleteMany();
  await prisma.cardPrice.deleteMany();
  await prisma.packCard.deleteMany();
  await prisma.pack.deleteMany();
  await prisma.card.deleteMany();
  await prisma.set.deleteMany();

  const setBySlug = new Map();
  for (const entry of sets) {
    const set = await prisma.set.create({
      data: {
        slug: entry.slug,
        name: entry.name,
        era: entry.era,
        releaseDate: new Date(entry.releaseDate)
      }
    });
    setBySlug.set(entry.slug, set);
  }

  for (const template of packTemplates) {
    const set = setBySlug.get(template.setSlug);
    const pack = await prisma.pack.create({
      data: {
        slug: template.slug,
        name: template.name,
        summary: template.summary,
        releaseDate: new Date(template.releaseDate),
        setId: set.id
      }
    });

    await prisma.packPrice.createMany({
      data: [
        { packId: pack.id, source: 'EBAY', price: template.ebay },
        { packId: pack.id, source: 'POKEMON_CENTER', price: template.pc }
      ]
    });

    await prisma.sourceListing.createMany({
      data: [
        {
          packId: pack.id,
          source: 'EBAY',
          externalId: `${pack.slug}-ebay`,
          title: `${template.name} lot`,
          listingUrl: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(template.name)}`,
          price: template.ebay,
          confidenceScore: 0.88,
          rawPayload: { seeded: true, provider: 'ebay' }
        },
        {
          packId: pack.id,
          source: 'POKEMON_CENTER',
          externalId: `${pack.slug}-pc`,
          title: `${template.name} at Pokémon Center`,
          listingUrl: `https://www.pokemoncenter.com/search/${encodeURIComponent(template.setSlug)}`,
          price: template.pc,
          confidenceScore: 0.96,
          rawPayload: { seeded: true, provider: 'pokemon_center' }
        }
      ]
    });

    for (let i = 0; i < cardTemplates.length; i += 1) {
      const [slug, name, cardNumber, rarity, basePrice] = cardTemplates[i];
      const priceVariance = 0.82 + ((i + pack.slug.length) % 5) * 0.08;
      const card = await prisma.card.upsert({
        where: { slug: `${template.setSlug}-${slug}` },
        update: {},
        create: {
          slug: `${template.setSlug}-${slug}`,
          name,
          cardNumber,
          rarity,
          subset: i < 4 ? 'Main Set' : 'Galarian Gallery',
          specialTag: i < 6 ? 'Chase' : null,
          setId: set.id
        }
      });

      await prisma.packCard.create({ data: { packId: pack.id, cardId: card.id } });
      await prisma.cardPrice.create({
        data: {
          cardId: card.id,
          sourceName: 'TCG Market (seeded)',
          price: Number((basePrice * priceVariance).toFixed(2))
        }
      });
      await prisma.pullRate.create({
        data: {
          packId: pack.id,
          cardId: card.id,
          probability: fallbackProbabilities[i],
          sourceName: 'Seeded baseline',
          isEstimated: i > 6
        }
      });
    }
  }

  console.log('Seed complete: packs, cards, pricing, pull rates, and source listings inserted.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
