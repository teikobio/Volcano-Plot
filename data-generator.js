// data-generator.js
export function generateRealEstateDataset() {
  const areas = [
    { name: 'San Francisco', type: 'tech', basePriceOct2022: 4200, priceMultiplierMay2025: 2.2 },
    { name: 'Seattle', type: 'tech', basePriceOct2022: 2800, priceMultiplierMay2025: 1.45 },
    { name: 'Austin', type: 'tech', basePriceOct2022: 2200, priceMultiplierMay2025: 1.65 },
    { name: 'Portland', type: 'tech', basePriceOct2022: 2600, priceMultiplierMay2025: 1.12 },
    { name: 'Millfield County', type: 'rural', basePriceOct2022: 950, priceMultiplierMay2025: 1.005 },
    { name: 'Clearwater County', type: 'rural', basePriceOct2022: 850, priceMultiplierMay2025: 0.98 },
    { name: 'Greendale County', type: 'rural', basePriceOct2022: 780, priceMultiplierMay2025: 1.01 },
    { name: 'Riverside County', type: 'rural', basePriceOct2022: 920, priceMultiplierMay2025: 0.995 },
    { name: 'Papertown', type: 'manual', basePriceOct2022: 1200, priceMultiplierMay2025: 0.72 },
    { name: 'Analogville', type: 'manual', basePriceOct2022: 1100, priceMultiplierMay2025: 0.45 },
    { name: 'Typeville', type: 'manual', basePriceOct2022: 1050, priceMultiplierMay2025: 0.85 }
  ];
  
  const dataset = [];
  let apartmentId = 1;
  
  areas.forEach(area => {
    const numApartments = Math.floor(Math.random() * 11) + 35;
    for (let i = 0; i < numApartments; i++) {
      const sqft = Math.floor(Math.random() * (1400 - 500) + 500);
      const bedrooms = Math.floor(Math.random() * 3) + 1;
      const bathrooms = Math.round((Math.random() * 1.5 + 1) * 2) / 2;
      const floor = Math.floor(Math.random() * 20) + 1;
      const age = Math.floor(Math.random() * 40) + 5;
      const walkScore = Math.floor(Math.random() * 40) + (area.type === 'tech' ? 60 : area.type === 'manual' ? 40 : 20);
      const hasParking = Math.random() > (area.type === 'tech' ? 0.6 : area.type === 'manual' ? 0.3 : 0.2);
      
      let basePrice = area.basePriceOct2022;
      let pricePerSqft = basePrice / 700;
      let oct2022Price = Math.round(
        (pricePerSqft * sqft) +
        (bedrooms * 200) +
        (bathrooms * 150) +
        (walkScore * 3) +
        (hasParking ? 100 : 0) -
        (age * 5) +
        (Math.random() * 400 - 200)
      );
      
      let may2025Price;
      if (area.type === 'tech') {
        let techVariation = area.priceMultiplierMay2025 + (Math.random() * 0.1 - 0.05);
        if (area.name === 'Portland') techVariation = area.priceMultiplierMay2025 + (Math.random() * 0.18 - 0.09);
        may2025Price = Math.round(oct2022Price * techVariation);
      } else if (area.type === 'manual') {
        let manualVariation = area.priceMultiplierMay2025 + (Math.random() * 0.08 - 0.04);
        if (area.name === 'Typeville') manualVariation = area.priceMultiplierMay2025 + (Math.random() * 0.16 - 0.08);
        may2025Price = Math.round(oct2022Price * manualVariation);
      } else {
        let ruralVariation = area.priceMultiplierMay2025 + (Math.random() * 0.08 - 0.04);
        if (area.name === 'Millfield County' || area.name === 'Riverside County') ruralVariation = area.priceMultiplierMay2025 + (Math.random() * 0.15 - 0.075);
        may2025Price = Math.round(oct2022Price * ruralVariation);
      }
      
      dataset.push({
        apartment_id: apartmentId++,
        area: area.name,
        area_type: area.type,
        price_oct_2022: oct2022Price,
        price_may_2025: may2025Price,
        price_change_pct: ((may2025Price - oct2022Price) / oct2022Price * 100)
      });
    }
  });
  
  return dataset;
} 