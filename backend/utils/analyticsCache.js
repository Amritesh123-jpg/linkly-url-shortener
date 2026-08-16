const Url = require("../model/urlModel");
const redis = require("../config/redis");

exports.updateAnalyticsCache = async (userId) => {
  const cacheKey = `analytics:${userId}`;

  const urls = await Url.find({
    user: userId,
    isDeleted: false,
  });

  const totalUrls = urls.length;

  const totalClicks = urls.reduce(
    (sum, url) => sum + url.clicks,
    0
  );

  const now = new Date();

  // Last 30 days clicks
  const clicksMap = {};

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);

    const key = date.toISOString().split("T")[0];
    clicksMap[key] = 0;
  }

  urls.forEach((url) => {
    url.clickHistory.forEach((click) => {
      const key = new Date(click.clickedAt)
        .toISOString()
        .split("T")[0];

      if (clicksMap[key] !== undefined) {
        clicksMap[key]++;
      }
    });
  });

  const clicksOverTime = Object.entries(clicksMap).map(
    ([date, clicks]) => ({
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      clicks,
    })
  );

  const activeUrls = urls.filter(
    (url) => !url.expiresAt || url.expiresAt > now
  ).length;

  const expiredUrls = urls.filter(
    (url) => url.expiresAt && url.expiresAt <= now
  ).length;

  const averageClicks =
    totalUrls === 0
      ? 0
      : +(totalClicks / totalUrls).toFixed(2);

  const topUrls = [...urls]
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5)
    .map((url) => ({
      id: url._id,
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      clicks: url.clicks,
    }));

  const analyticsData = {
    totalUrls,
    totalClicks,
    activeUrls,
    expiredUrls,
    averageClicks,
    topUrls,
    clicksOverTime,
  };

  await redis.set(
    cacheKey,
    JSON.stringify(analyticsData),
    "EX",
    300
  );

  console.log("✅ Analytics Cache Updated");
};