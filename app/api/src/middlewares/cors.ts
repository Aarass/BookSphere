import cors, { CorsOptions } from "cors";

const options: CorsOptions = {
  credentials: true,
};

export default cors(options);
