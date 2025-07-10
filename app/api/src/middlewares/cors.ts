import cors, { CorsOptions } from "cors";

const options: CorsOptions = {
  credentials: true,
  // origin: ["http://localhost:5173"],
  origin: true,
};

export default cors(options);
