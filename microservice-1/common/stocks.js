class Stock {
  constructor({
    name,
    tickerSymbol,
    price,
    openPrice,
    closePrice,
    highPrice,
    lowPrice,
    volume,
    marketCap,
    sector,
    exchange,
    dividendYield,
    earningsPerShare,
    peRatio,
    description,
    lastUpdated,
  }) {
    this.name = name;
    this.tickerSymbol = tickerSymbol;
    this.price = price;
    this.openPrice = openPrice;
    this.closePrice = closePrice;
    this.highPrice = highPrice;
    this.lowPrice = lowPrice;
    this.volume = volume;
    this.marketCap = marketCap;
    this.sector = sector;
    this.exchange = exchange;
    this.dividendYield = dividendYield;
    this.earningsPerShare = earningsPerShare;
    this.peRatio = peRatio;
    this.description = description;
    this.lastUpdated = lastUpdated || new Date();
  }

  // Method to update the stock's price and related fields with random values
  updatePrice() {
    const change = (Math.random() - 0.5) * 2; // Random change between -1 and 1
    const newPrice = this.price + change;

    this.price = Math.max(0, newPrice); // Ensure price doesn't go negative
    this.highPrice = Math.max(this.highPrice, this.price);
    this.lowPrice = Math.min(this.lowPrice, this.price);
    this.volume += Math.floor(Math.random() * 1000); // Random volume increment
    this.marketCap = this.price * 1000000; // Example calculation, adjust as needed
    this.lastUpdated = new Date();
  }

  toJSON() {
    return {
      name: this.name,
      tickerSymbol: this.tickerSymbol,
      price: this.price,
      openPrice: this.openPrice,
      closePrice: this.closePrice,
      highPrice: this.highPrice,
      lowPrice: this.lowPrice,
      volume: this.volume,
      marketCap: this.marketCap,
      sector: this.sector,
      exchange: this.exchange,
      dividendYield: this.dividendYield,
      earningsPerShare: this.earningsPerShare,
      peRatio: this.peRatio,
      description: this.description,
      lastUpdated: this.lastUpdated,
    };
  }
}

const stocks = [
  new Stock({
    name: "Apple Inc.",
    tickerSymbol: "AAPL",
    price: 150.25,
    openPrice: 148.5,
    closePrice: 149.1,
    highPrice: 151.0,
    lowPrice: 147.8,
    volume: 50000000,
    marketCap: 2500000000000,
    sector: "Technology",
    exchange: "NASDAQ",
    dividendYield: 0.006,
    earningsPerShare: 5.0,
    peRatio: 30.05,
    description:
      "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.",
  }),
  new Stock({
    name: "Google Inc.",
    tickerSymbol: "GOOGL",
    price: 2800.75,
    openPrice: 2775.0,
    closePrice: 2785.5,
    highPrice: 2820.0,
    lowPrice: 2760.0,
    volume: 1200000,
    marketCap: 1900000000000,
    sector: "Technology",
    exchange: "NASDAQ",
    dividendYield: 0.0,
    earningsPerShare: 90.0,
    peRatio: 31.12,
    description:
      "Google LLC is an American multinational technology company specializing in Internet-related services and products.",
  }),
  new Stock({
    name: "Microsoft Corporation",
    tickerSymbol: "MSFT",
    price: 299.5,
    openPrice: 295.0,
    closePrice: 296.75,
    highPrice: 300.0,
    lowPrice: 293.0,
    volume: 30000000,
    marketCap: 2200000000000,
    sector: "Technology",
    exchange: "NASDAQ",
    dividendYield: 0.009,
    earningsPerShare: 10.0,
    peRatio: 29.95,
    description:
      "Microsoft Corporation is an American multinational technology company which produces computer software, consumer electronics, personal computers, and related services.",
  }),
];

module.exports = { Stock, stocks };
