const Text = require('../model/textModel');
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const calculateExpiry = require('../utils/expiry');
const { getPagination,getTotalPages, } = require("../utils/pagination");

const generateShortCode = () => {
  return Math.random().toString(36).substring(2, 8);
};

exports.createText = catchAsync(async (req, res, next) => {
  const { content, expiry = "30d" } = req.body;

  // 1. Check content
  if (!content || !content.trim()) {
    return next(new AppError("Please provide some text", 400));
  }

  // 2. Generate unique short code
  let shortCode;

  do {
    shortCode = generateShortCode();
  } while (await Text.findOne({ shortCode }));

  // 3. Calculate expiry
  const expiresAt = calculateExpiry(expiry);

  // 4. Create text
  const newText = await Text.create({
    content: content.trim(),
    shortCode,
    user: req.user.id,
    expiresAt,
  });

  // 5. Create shareable URL
  const shareUrl = `${req.protocol}://${req.get("host")}/text/${shortCode}`;

  // 6. Response
  res.status(201).json({
    status: "success",
    data: {
      text: newText,
      shareUrl,
    },
  });
});

exports.getText = catchAsync(async (req, res, next) => {
  const { shortCode } = req.params;

  // Find text using short code
  const text = await Text.findOne({
      shortCode
    });

  if (!text) {
    return next(new AppError("Text not found", 404));
  }

  // Check expiry
  if (text.expiresAt && text.expiresAt <= new Date()) {
    return next(new AppError("This text has expired", 410));
  }

  res.status(200).json({
    status: "success",
    data: {
      text,
    },
  });
});

exports.getMyTexts = catchAsync(async (req, res, next) => {
 
  const { page, limit, skip } = getPagination(
  req.query.page,
  req.query.limit
  );

  // 7. Get total number of texts
  const activeFilter = {
  user: req.user.id,
  $or: [
    { expiresAt: null },
    { expiresAt: { $gt: new Date() } },
  ],
};

const totalTexts = await Text.countDocuments(activeFilter);

const texts = await Text.find(activeFilter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // 9. Calculate total pages
  const totalPages = getTotalPages(totalTexts, limit);

  res.status(200).json({
    status: "success",
    results: texts.length,

    currentPage: page,
    totalPages,
    totalTexts,

    data: {
      texts,
    },
  });
});

exports.deleteText = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const text = await Text.findOne({
    _id: id,
    user: req.user.id,
  });

  if (!text) {
    return next(new AppError("Text not found", 404));
  }

  await Text.findByIdAndDelete(id);

  res.status(200).json({
    status: "success",
    message: "Text deleted permanently",
  });
});

exports.getExpiredTexts = catchAsync(async (req, res, next) => {
  const { page, limit, skip } = getPagination(
    req.query.page,
    req.query.limit
  );

  const expiredFilter = {
    user: req.user.id,
    expiresAt: {
      $ne: null,
      $lte: new Date(),
    },
  };

  const totalTexts = await Text.countDocuments(expiredFilter);

  const texts = await Text.find(expiredFilter)
    .sort({ expiresAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPages = getTotalPages(totalTexts, limit);

  res.status(200).json({
    status: "success",
    results: texts.length,
    currentPage: page,
    totalPages,
    totalTexts,
    data: {
      texts,
    },
  });
});

exports.restoreText = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { expiry } = req.body;

  const text = await Text.findOne({
    _id: id,
    user: req.user.id,
  });

  if (!text) {
    return next(new AppError("Text not found", 404));
  }

  // Text must actually be expired
  if (
    !text.expiresAt ||
    text.expiresAt > new Date()
  ) {
    return next(
      new AppError("This text is not expired", 400)
    );
  }

   // Calculate new expiry
  const expiresAt = calculateExpiry(expiry);

  text.expiresAt = expiresAt;

  await text.save();

  res.status(200).json({
    status: "success",
    message: "Text restored successfully",
    data: {
      text,
    },
  });
});
