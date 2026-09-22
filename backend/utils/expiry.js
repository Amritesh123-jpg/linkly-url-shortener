const calculateExpiry = (expiry) => {
  switch (expiry) {
    case "5m":
      return new Date(Date.now() + 5 * 60 * 1000);

    case "10m":
      return new Date(Date.now() + 10 * 60 * 1000);

    case "30m":
      return new Date(Date.now() + 30 * 60 * 1000);

    case "1h":
      return new Date(Date.now() + 60 * 60 * 1000);

    case "1d":
      return new Date(Date.now() + 24 * 60 * 60 * 1000);

    case "7d":
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    case "30d":
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    case "never":
      return null;

    default:
      throw new Error("Invalid expiry time");
  }
};

module.exports = calculateExpiry;