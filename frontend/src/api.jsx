import axios from 'axios';

const API_URL = 'http://localhost:3010';

export const getAllData = async (collection) => {
  try {
    const response = await axios.get(`${API_URL}/home-inventar/findAll/${collection}`);
    console.log({ response });
    return response.data;
  } catch (err) {
    console.error(err.message);
  }
};
