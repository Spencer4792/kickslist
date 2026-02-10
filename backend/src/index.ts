import "dotenv/config";
import app from "./app";
import { startPriceCheckJob } from "./jobs/priceCheck";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startPriceCheckJob();
});
