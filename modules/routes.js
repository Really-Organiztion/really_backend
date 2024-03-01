const express = require("express");
const router = express.Router();

const countryRouter = require("./routers/country.router");
const currencyRouter = require("./routers/currency.router");
const walletRouter = require("./routers/wallet.router");
const adminRouter = require("./routers/admin.router");
const promoCodeRouter = require("./routers/promoCode.router");
const giftCardRouter = require("./routers/giftCard.router");
const communityRouter = require("./routers/community.router");
const userRouter = require("./routers/user.router");
const uploadFileRouter = require("./routers/uploadFile.router");
const fcmRouter = require("./routers/fcm.router");
const teacherRouter = require("./routers/teacher.router");
const courseRouter = require("./routers/course.router");
const chapterRouter = require("./routers/chapter.router");
const lessonRouter = require("./routers/lesson.router");
const trendingCourseRouter = require("./routers/trendingCourse.router");
const previewRouter = require("./routers/preview.router");
const subjectRouter = require("./routers/subject.router");
const deliveredTaskRouter = require("./routers/task.router");
const quizRouter = require("./routers/quiz.router");
const packageRouter = require("./routers/package.router");
const promotionRouter = require("./routers/promotion.router");
const codeRouter = require("./routers/code.router");
const notificationRouter = require("./routers/notification.router");

router.use("/admin", adminRouter);
router.use("/country", countryRouter);
router.use("/currency", currencyRouter);
router.use("/wallet", walletRouter);
router.use("/promoCode", promoCodeRouter);
router.use("/giftCard", giftCardRouter);
router.use("/community", communityRouter);
router.use("/user", userRouter);
router.use("/uploadFile", uploadFileRouter);
router.use("/fcm", fcmRouter);
router.use("/teacher", teacherRouter);
router.use("/course", courseRouter);
router.use("/chapter", chapterRouter);
router.use("/lesson", lessonRouter);
router.use("/trendingCourse", trendingCourseRouter);
router.use("/preview", previewRouter);
router.use("/subject", subjectRouter);
router.use("/task", deliveredTaskRouter);
router.use("/quiz", quizRouter);
router.use("/package", packageRouter);
router.use("/promotion", promotionRouter);
router.use("/code", codeRouter);
router.use("/notification", notificationRouter);

module.exports = router;
