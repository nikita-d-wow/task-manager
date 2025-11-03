import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

// ✅ Redirect user to Google login
router.get("/", passport.authenticate("google", { scope: ["profile", "email"] }));

// ✅ Google OAuth callback
router.get(
  "/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login-failed" }),
  async (req, res) => {
    try {
      const user = req.user as any;

      // Generate JWT
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      // Redirect to frontend with token
      const redirectUrl = `${process.env.CLIENT_URL}/google-success?token=${token}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=google_auth_failed`);
    }
  }
);

export default router;
