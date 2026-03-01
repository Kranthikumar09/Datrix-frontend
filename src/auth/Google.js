const { OAuth2Client } = require("google-auth-library");
const express = require("express");
const app = express();
app.use(express.json());

const client = new OAuth2Client("1012050456512-229eq2t4bmrf7djm8nba44enuk08iq9i.apps.googleusercontent.com");

app.post("/auth/google", async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "1012050456512-229eq2t4bmrf7djm8nba44enuk08iq9i.apps.googleusercontent.com",
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;
    // Find or create user in your database
    const user = { id: googleId, email, name }; // Adjust based on your DB schema
    const jwtToken = generateJwt(user); // Your JWT generation logic
    res.json({ success: true, token: jwtToken, user });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(400).json({ success: false, message: "Google authentication failed" });
  }
});

// Placeholder for JWT generation
function generateJwt(user) {
  // Use a library like `jsonwebtoken` to create a JWT
  return "your-jwt-token-here"; // Replace with actual implementation
}
