const Url = require("../model/urlModel");
const redis = require("../config/redis");

exports.updateDashboardCache = async (userId) => {
  const cacheKey = `dashboard:${userId}`;

  // Total URLs
  const totalUrls = await Url.countDocuments({
    user: userId,
    isDeleted: false,
  });

  // Total Clicks
  const totalClicks = await Url.aggregate([
    {
      $match: {
        user: userId,
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: null,
        totalClicks: { $sum: "$clicks" },
      },
    },
  ]);

  // Active URLs
  const activeUrls = await Url.countDocuments({
    user: userId,
    isDeleted: false,
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } },
    ],
  });

  // Expired URLs
  const expiredUrls = await Url.countDocuments({
    user: userId,
    isDeleted: false,
    expiresAt: { $lte: new Date() },
  });

  // Most Clicked URL
  const mostClickedUrl = await Url.findOne({
    user: userId,
    isDeleted: false,
  }).sort("-clicks");

  const dashboardData = {
    totalUrls,
    totalClicks: totalClicks[0]?.totalClicks || 0,
    activeUrls,
    expiredUrls,
    mostClickedUrl,
  };

  await redis.set(
    cacheKey,
    JSON.stringify(dashboardData),
    "EX",
    300
  );

  console.log("✅ Dashboard Cache Updated");
};