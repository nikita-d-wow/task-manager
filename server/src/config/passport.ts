import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import User from "../models/user.model";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_REDIRECT_URI!,
    },
    async (_, __, profile: Profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("No email from Google"), false);
        }

        // ✅ Check if user exists by email
        let user = await User.findOne({ email });

        // ✅ If not found, create new user with googleId (password not required)
        if (!user) {
          user = await User.create({
            username: profile.displayName,
            email,
            avatar: profile.photos?.[0]?.value,
            googleId: profile.id, // 🔹 Add googleId here
          });
        } else if (!user.googleId) {
          // ✅ If user exists but doesn't have googleId yet, add it
          user.googleId = profile.id;
          await user.save();
        }

        // ✅ Pass user to Passport
        return done(null, user);
      } catch (err) {
        console.error("Google Auth Error:", err);
        return done(err as Error, false);
      }
    }
  )
);

// Not needed for JWT-based auth but useful for completeness
passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user || false);
  } catch (err) {
    done(err as Error, false);
  }
});

export default passport;
