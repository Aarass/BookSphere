import cors, { CorsOptions } from "cors";

const options: CorsOptions = {
  credentials: true,
  origin: ["http://localhost:5173"],
};

export default cors(options);
