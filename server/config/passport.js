const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const supabase = require("../utils/supabase");
const { signToken } = require("../utils/jwt");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const name = profile.displayName;

        const { data: existing } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .single();

        let user = existing;

        if (!user) {
          const { data } = await supabase
            .from("users")
            .insert([{ name, email, password: null }])
            .select()
            .single();

          user = data;
        }

        const token = signToken({ userId: user.id });

        return done(null, { user, token });
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

module.exports = passport;
