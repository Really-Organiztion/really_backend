const express = require("express");
const router = express.Router();

const requestRouter = require("./routers/request.router");
const currencyRouter = require("./routers/currency.router");
const reelRouter = require("./routers/reel.router");
const commentRouter = require("./routers/comment.router");
const postRouter = require("./routers/post.router");
const termsRouter = require("./routers/terms.router");
const reportRouter = require("./routers/report.router");
const image3dRouter = require("./routers/image3d.router");
const unitRouter = require("./routers/unit.router");
const rateRouter = require("./routers/rate.router");
const likeReelRouter = require("./routers/likeReel.router");
const favoritePostRouter = require("./routers/favoritePost.router");
const walletRouter = require("./routers/wallet.router");
const bankRouter = require("./routers/bank.router");
const transactionRouter = require("./routers/transaction.router");
const bookingRouter = require("./routers/booking.router");
const adminRouter = require("./routers/admin.router");
const promoCodeRouter = require("./routers/promoCode.router");
const giftCardRouter = require("./routers/giftCard.router");
const communityRouter = require("./routers/community.router");
const userRouter = require("./routers/user.router");
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
router.use("/request", requestRouter);
router.use("/currency", currencyRouter);
router.use("/reel", reelRouter);
router.use("/comment", commentRouter);
router.use("/post", postRouter);
router.use("/terms", termsRouter);
router.use("/report", reportRouter);
router.use("/image3d", image3dRouter);
router.use("/unit", unitRouter);
router.use("/rate", rateRouter);
router.use("/likeReel", likeReelRouter);
router.use("/favoritePost", favoritePostRouter);
router.use("/wallet", walletRouter);
router.use("/bank", bankRouter);
router.use("/transaction", transactionRouter);
router.use("/booking", bookingRouter);
router.use("/promoCode", promoCodeRouter);
router.use("/giftCard", giftCardRouter);
router.use("/community", communityRouter);
router.use("/user", userRouter);
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
