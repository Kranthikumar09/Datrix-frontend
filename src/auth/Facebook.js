const axios = require("axios");

app.post("/auth/facebook", async (req, res) => {
  const { accessToken, userID } = req.body;
  try {
    const fbResponse = await axios.get(
      `https://graph.facebook.com/${userID}?fields=id,name,email,picture&access_token=${accessToken}`
    );
    const { id, email, name } = fbResponse.data;
    // Find or create user in your database
    const user = { id, email, name }; // Adjust based on your DB schema
    const jwtToken = generateJwt(user); // Your JWT generation logic
    res.json({ success: true, token: jwtToken, user });
  } catch (error) {
    console.error("Facebook auth error:", error);
    res.status(400).json({ success: false, message: "Facebook authentication failed" });
  }
});