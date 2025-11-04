import axios from "axios";

const FASTAPI_URL = "http://127.0.0.1:8000/predict";

export const callFastAPIPrediction = async (data) => {
  const response = await axios.post(FASTAPI_URL, data);
  return response.data;
};
