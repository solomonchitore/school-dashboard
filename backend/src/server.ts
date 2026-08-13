import "dotenv/config";
import app from "./app";

const PORT = Number(process.env.PORT) || 5000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log("==================================");
  console.log("School Dashboard Backend");
  console.log(`Running on http://${HOST}:${PORT}`);
  console.log("==================================");
});