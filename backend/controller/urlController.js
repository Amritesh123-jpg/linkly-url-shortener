const ogs = require("open-graph-scraper");
const Url = require("../model/urlModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const QRCode = require("qrcode");
// Create Short URL
exports.createShortUrl = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const {  customAlias, expiry="30d" } = req.body;

  let originalUrl = req.body.originalUrl.trim();

  if (!/^https?:\/\//i.test(originalUrl)) {
    originalUrl = `https://${originalUrl}`;
  }

  const tag = req.body.tag
  ?.replace(/<[^>]*>/g, "") // Remove HTML tags
  .trim()
  .toLowerCase() || "general";
  
  const validator =  /^[a-zA-Z0-9\s_-]+$/;

  if(tag && !validator.test(tag)){
    return next(new AppError("Tag can only contain letters, numbers, spaces, hyphens, and underscores", 400));
  }

  console.log("Normalized URL:", originalUrl);

  // Validate URL
  try {
    new URL(originalUrl);
  } catch (err) {
    return next(new AppError("Please provide a valid URL", 400));
  }

  const existingUrl = await Url.findOne({
     originalUrl,
     isDeleted: false,
     user: req.user.id,
     expiresAt: { $gt: new Date() }
    });

    if(existingUrl){
      return res.status(200).json({
        status: "success",
        message: "You already have this URL shortened",
        data: {
          url: existingUrl,
          shortUrl: `${req.protocol}://${req.get("host")}/${existingUrl.shortCode}`,
        },
      }
    );
  }
  let shortCode;

  if (customAlias) {
    shortCode = customAlias.trim().toLowerCase();

    const existingUrl = await Url.findOne({ shortCode });

    if (existingUrl) {
      // Alias belongs to another user
      if (existingUrl.user.toString() !== req.user.id) {
        return next(
          new AppError("Custom alias already belongs to another user", 409)
        );
      }

      // Same user but alias still active
      if (!existingUrl.expiresAt || existingUrl.expiresAt > new Date()) {
        return next(
          new AppError("You already have this custom alias", 409)
        );
      }

      // Same user + expired
      await existingUrl.deleteOne();
    }
  } else {
    // Generate unique random code
    do {
      shortCode = Math.random().toString(36).substring(2, 8);
    } while (await Url.findOne({ shortCode }));
  }

  // Expire after 2 minutes
  let expiresAt;

  switch (expiry) {
    case "5m":
      expiresAt = new Date(Date.now() + 5 * 60 * 1000);
      break;
    case "10m":
      expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      break;  
    case "30m":
      expiresAt = new Date(Date.now() + 30 * 60 * 1000);
      break;
    case "1h":
      expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      break;
    case "1d":
      expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      break;
    case "7d":
      expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      break;  
    case "never":
      expiresAt = null;
      break;  
    default:
      return next(new AppError("Invalid expiry time. Use 5m, 10m, 30m, 1h, 1d,7d,30d or never", 400));
  }   

    let title = "";
    let favicon = "";

    try {
      const { result } = await ogs({ url: originalUrl });
      console.dir(result, { depth: null });

      title = result.ogTitle || result.twitterTitle || result.title || "";

      favicon =
        result.favicon ||
        result.ogImage?.[0]?.url ||
        "";
    } catch (err) {
      console.dir("Metadata fetch failed:", err.message);
    }

    const { hostname } = new URL(originalUrl);

    if (!title) {
      title = hostname;
    }

    if (favicon) {
      favicon = new URL(favicon, originalUrl).href;
    } else {
      favicon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
    }

  const newUrl = await Url.create({
    originalUrl,
    shortCode,
    expiresAt,
    tag,
    user: req.user.id,
    title,
    favicon
  });

  console.log("Created URL:", newUrl);
  console.log("Title:", newUrl.title);
  console.log("Favicon:", newUrl.favicon);
   
  console.log({
  shortUrl: `${req.protocol}://${req.get("host")}/${shortCode}`,
  url: newUrl,
  });

  res.status(201).json({
    status: "success",
    data: {
      url: newUrl,
      shortUrl: `${req.protocol}://${req.get("host")}/${shortCode}`,
    },
  });
});

// Redirect URL
exports.redirectUrl = catchAsync(async (req, res, next) => {
  const { shortCode } = req.params;

  const url = await Url.findOne({
    shortCode,
    isDeleted: false,
  });

  if (!url) {
    return next(new AppError("URL not found", 404));
  }

  console.log("===== REDIRECT =====");
  console.log("ShortCode:", shortCode);
  console.log("ExpiresAt:", url.expiresAt);
  console.log("Current:", new Date());
  console.log(
    "Expired:",
    url.expiresAt ? url.expiresAt < new Date() : false
  );

  if (url.expiresAt && url.expiresAt < new Date()) {
    return next(new AppError("This URL has expired", 410));
  }

  url.clicks++;
  url.lastClickedAt = new Date();

  url.clickHistory.push({
    clickedAt: new Date(),
  });

  await url.save();

  return res.redirect(url.originalUrl);
});

// Get My URLs
exports.getAllUrls = catchAsync(async (req, res, next) => {
  const { 
    search,
    status = "all",
    page = 1,
    limit = 10,
    sort = "-createdAt",
  } = req.query;

  const filter = {
    user: req.user.id,
    isDeleted: false
  };
  
  const {tag} = req.query;

  if (tag && tag !== "all") {
  const tags = tag
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  filter.tag = {
    $in: tags.map((t) => new RegExp(`^${t}$`, "i")),
  };
  }

  if (search) {
    filter.$or = [
      {
        originalUrl: {
          $regex: search,
          $options: "i",
        },
      },
      {
        shortCode: {
          $regex: search,
          $options: "i",
        },
      },
      {
        tag: {
          $regex: search,
          $options: "i",
        },
      }
    ];
  }

  if (status === "active") {
  filter.$or = [
    { expiresAt: null },
    { expiresAt: { $gt: new Date() } },
  ];
}

if (status === "expired") {
  filter.expiresAt = { $lte: new Date() };
}
  
const pageNumber = Number(page);
const limitNumber = Number(limit);

const skip = (pageNumber - 1) * limitNumber;

const urls = await Url.find(filter)
  .sort(sort)
  .skip(skip)
  .limit(limitNumber);

const totalUrls = await Url.countDocuments(filter);

res.status(200).json({
  status: "success",
  results: urls.length,
  totalResults: totalUrls,
  currentPage: pageNumber,
  totalPages: Math.ceil(totalUrls / limitNumber),
  data: {
    urls,
  },
});
});

// Delete URL
exports.deleteUrl = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const url = await Url.findOne({
      _id: id,
      user: req.user.id,
      isDeleted: false,
    });

  if (!url) {
    return next(new AppError("URL not found", 404));
  }

  if (url.user.toString() !== req.user.id) {
    return next(
      new AppError("You are not allowed to delete this URL", 403)
    );
  }

    url.isDeleted = true;
    url.deletedAt = new Date();
    await url.save();

  

  res.status(200).json({
    status: "success",
    message: "URL moved to trash successfully",
  });
});

// Update URL
exports.updateUrl = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { originalUrl, tag } = req.body;

  const url = await Url.findOne({
    _id: id,
    user: req.user.id,
    isDeleted: false,
  });

  if (!url) {
    return next(new AppError("URL not found", 404));
  }

  if (tag && tag.length > 20) {
    return next(
      new AppError("Tag cannot exceed 20 characters", 400)
    );
  }

  if (url.expiresAt && url.expiresAt < new Date()) {
    return next(
      new AppError("This URL has expired. Please create a new one.", 410)
    );
  }

  if (originalUrl !== undefined) {
    try {
      new URL(originalUrl);
    } catch (err) {
      return next(
        new AppError("Please provide a valid URL", 400)
      );
    }

    url.originalUrl = originalUrl;
  }

  if (tag !== undefined) {
    url.tag = tag;
  }

  await url.save();

  res.status(200).json({
    status: "success",
    data: {
      url,
    },
  });
});

// URL Analytics
exports.getUrlAnalytics = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const url = await Url.findOne({
    _id: id,
    user: req.user.id,
    isDeleted: false,
  });

  if (!url) {
    return next(new AppError("URL not found", 404));
  }

  if (url.user.toString() !== req.user.id) {
    return next(
      new AppError("You are not allowed to view analytics", 403)
    );
  }

  const shortUrl = `${req.protocol}://${req.get("host")}/${url.shortCode}`;

  const now = new Date();
  //Active /Expired
  const status = 
   url.expiresAt && url.expiresAt < now 
   ? "expired" 
   : "active";

   const daySinceCreated = Math.max(
    1, Math.ceil(
      (now - url.createdAt) / (1000 * 60 * 60 * 24)
    )
  );

  const averageClicksPerDay = (url.clicks / daySinceCreated).toFixed(2);

  let remainingTime = "Expired";

  if (url.expiresAt && url.expiresAt > now) {
    const diff = url.expiresAt - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const parts = [];
    if (days > 0) parts.push(`${days} Days`);
    if (hours > 0) parts.push(`${hours} Hours`);
    if (minutes > 0) parts.push(`${minutes} Minutes`);
    if (parts.length === 0) {
    remainingTime = "Less than a minute";
    }
    
    remainingTime = parts.join(", ");
}

  const qrCode = await QRCode.toDataURL(shortUrl);

  res.status(200).json({
    status: "success",
    data: {
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl,
      tag: url.tag,
      qrCode,
      clicks: url.clicks,

      status: status,
      averageClicksPerDay: averageClicksPerDay,
      daysSinceCreated: daySinceCreated,
      remainingTime: remainingTime,
      
      lastClickedAt: url.lastClickedAt,

      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
      expiresAt: url.expiresAt

      
    },
  });
});


exports.getDashboardStats = catchAsync(async (req, res, next) => {

  // Total URLs
  const totalUrls = await Url.countDocuments({
    user: req.user.id,
    isDeleted: false,
  });

  // Total Clicks
  const totalClicks = await Url.aggregate([
    {
      $match: {
        user: req.user._id,
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: null,
        totalClicks: {
          $sum: "$clicks",
        },
      },
    },
  ]);

  // Active URLs
  const activeUrls = await Url.countDocuments({
    user: req.user.id,
    isDeleted: false,
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } },
    ],
  });

  // Expired URLs
  const expiredUrls = await Url.countDocuments({
    user: req.user.id,
    isDeleted: false,
    expiresAt: {
      $lte: new Date(),
    },
  });

  // Most Clicked URL
  const mostClickedUrl = await Url.findOne({
    user: req.user.id,
    isDeleted: false,
  }).sort("-clicks");

  res.status(200).json({
    status: "success",
    data: {
      totalUrls,
      totalClicks: totalClicks[0]?.totalClicks || 0,
      activeUrls,
      expiredUrls,
      mostClickedUrl,
    },
  });

});

exports.topUrls = catchAsync(async (req, res, next) => {
  const topUrls = await Url.find({ user: req.user.id,isDeleted: false })
    .sort({clicks: -1})
    .limit(5)
   .select("shortCode originalUrl clicks createdAt");  

    res.status(200).json({
      status: "success",
      results: topUrls.length,
      data: {
        topUrls,
      },
    });

});

exports.getRecentUrls = catchAsync(async (req, res, next) => {
  const recentUrls = await Url.find({ user: req.user.id,isDeleted: false })
    .sort({ createdAt: -1 })
    .limit(4);
    
    res.status(200).json({
      status: "success",
      results: recentUrls.length, 
      data: {
        recentUrls,
      },
    });
});


exports.deleteManyUrls = catchAsync(async (req, res, next) => {
  
  const {ids} = req.body;
  // Check if ids array is provided
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return next(
      new AppError("Please provide an array of URL IDs", 400)
    );
  }

  // Delete URLs that belong to the user
  const result = await Url.deleteMany({
    _id: { $in: ids },
    user: req.user.id,
  });
  console.log(result);

  res.status(200).json({
    status: "success",
    message: `${result.deletedCount} URLs deleted successfully`,
  });
});

exports.restoreUrl = catchAsync(async (req, res, next) => {
  const {duration} = req.body;
  const {id} = req.params;

  const url =await Url.findById({
  _id: id,
  user: req.user.id,
  isDeleted: false,
  });

  if(!url){
    return next(new AppError("URL not found", 404));
  }

    if (url.isDeleted) {
    return next(
      new AppError(
        "This URL is in trash. Restore it before renewing expiry.",
        400
      )
    );
  }

  

  if (url.user.toString() !== req.user.id) {
    return next(
      new AppError("You are not allowed to restore this URL", 403)
    );
  }

  if(!url.expiresAt || url.expiresAt > new Date()){
    return next(
      new AppError("This URL is not expired and cannot be restored", 400)
    );
  }

  const allowedDurations = [1, 7, 30, -1];

if (!allowedDurations.includes(duration)) {
  return next(
    new AppError(
      "Duration must be 1, 7, 30 days or -1 (Never Expire)",
      400
    )
  );
}

  if(duration === -1){
    url.expiresAt = null;
  }else{
    url.expiresAt = new Date(
    Date.now()+ duration*24*60*60*1000
    );
  }

  
  await url.save();

// console.log("Restored URL:");
// console.log(url);

  res.status(200).json({
    status: "success",
    message: "URL restored successfully",
  }); 

});

exports.generateQRCode = catchAsync(async (req, res, next) => {

  const { id } = req.params;

  const url = await Url.findById(id);
  
  if (!url) {
    return next(new AppError("URL not found", 404));
  }

  if(url.user.toString() !== req.user.id){
    return next(
      new AppError("You are not allowed to generate QR code for this URL", 403)
    );
  }

  const shortUrl = `${req.protocol}://${req.get("host")}/${url.shortCode}`;

  

  res.setHeader("Content-Type", "image/png");
  

  await QRCode.toFileStream(res, shortUrl);

});

exports.getDashboardAnalytics = catchAsync(async (req, res, next) => {
  console.log("Logged in user:", req.user.id);
  //const urls = await Url.find();


  const urls = await Url.find({
  user: req.user.id,
  isDeleted: false
  });
  console.log(urls);
  const totalUrls = urls.length;
  const totalClicks = urls.reduce(
  (sum, url) => sum + url.clicks,
  0
  );
  const now = new Date();

// 👇 YAHAN SE ADD KARO

    const clicksMap = {};

    // Last 30 days initialize
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);

      const key = date.toISOString().split("T")[0];
      clicksMap[key] = 0;
    }

    // Count clicks
    urls.forEach((url) => {
      url.clickHistory.forEach((click) => {
        const key = new Date(click.clickedAt).toISOString().split("T")[0];

        if (clicksMap[key] !== undefined) {
          clicksMap[key]++;
        }
      });
    });

    // Convert for frontend
    const clicksOverTime = Object.entries(clicksMap).map(([date, clicks]) => ({
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      clicks,
    }));

    // 👆 YAHAN TAK ADD KARO



    const activeUrls = urls.filter(
      (url) => !url.expiresAt || url.expiresAt > now
    ).length;

  const averageClicks =
  totalUrls === 0 ? 0 : +(totalClicks / totalUrls).toFixed(2);
  const topUrls = [...urls]
  .sort((a, b) => b.clicks - a.clicks)
  .slice(0, 5)
  .map((url) => ({
    id: url._id,
    shortCode: url.shortCode,
    originalUrl: url.originalUrl,
    clicks: url.clicks,
  }));

  const expiredUrls = urls.filter(
  (url) => url.expiresAt && url.expiresAt <= now
   ).length;

    res.status(200).json({
    status: "success",
        data: {
      totalUrls,
      totalClicks,
      activeUrls,
      expiredUrls,
      averageClicks,
      topUrls,
      clicksOverTime,
    },
  });

});

exports.getTags = catchAsync(async (req, res) => {
  const tags = await Url.distinct("tag", {
    user: req.user._id,
    isDeleted: false,
  });

  res.status(200).json({
    status: "success",
    tags,
  });
});