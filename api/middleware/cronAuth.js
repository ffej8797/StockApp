export const cronAuth = (req, res, next) => {
  const auth = req.headers.authorization;

  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  next();
};