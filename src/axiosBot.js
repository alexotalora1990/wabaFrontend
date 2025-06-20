
import axios from 'axios';

export const BOT_BASE_URL = 'http://localhost:4700/';
const axiosBot = axios.create({ baseURL: BOT_BASE_URL });
export default axiosBot;