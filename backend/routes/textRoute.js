const express = require('express');
const textController = require('../controller/textController');
const authController = require('../controller/authController');
const router = express.Router();

router.post (
      '/create',
      authController.protect,
      textController.createText
);

router.get(
  "/myTexts",
  authController.protect,
  textController.getMyTexts
);

router.get(
  "/expired",
  authController.protect,
  textController.getExpiredTexts
);

router.patch(
  "/restore/:id",
  authController.protect,
  textController.restoreText
);

router.delete(
  "/:id",
  authController.protect,
  textController.deleteText
);


router.get(
  "/:shortCode",
  textController.getText
);


module.exports = router;