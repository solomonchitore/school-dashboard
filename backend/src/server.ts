import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("=================================");
  console.log("🚀 School Dashboard Backend");
  console.log(`🌐 Running on http://localhost:${PORT}`);
  console.log("=================================");
});