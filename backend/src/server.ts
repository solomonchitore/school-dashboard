import "dotenv/config";
import app from "./app";

const PORT = 5000;

app.listen(PORT, () => {
  console.log("==============================");
  console.log("School Dashboard Backend");
  console.log(`Running on http://localhost:${PORT}`);
  console.log("==============================");
});