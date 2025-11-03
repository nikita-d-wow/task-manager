import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const googleCallback = (req: Request, res: Response) => {
  try {
    const user = req.user as { id: string; username: string; email: string };

    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/signup?error=no_user`);
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    // ✅ Redirect user to frontend with token
    const redirectUrl = `${process.env.CLIENT_URL}/google-success?token=${token}`;
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    return res.redirect(`${process.env.CLIENT_URL}/signup?error=google_auth_failed`);
  }
};
