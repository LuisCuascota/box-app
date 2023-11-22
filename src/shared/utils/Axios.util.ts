import Axios from "axios-observable";
import { environment } from "../../environments/environment.ts";

const instance = Axios.create({
  baseURL: environment.apiBoxUrl,
  headers: {
    "Content-type": "application/json",
  },
});

export default instance;
