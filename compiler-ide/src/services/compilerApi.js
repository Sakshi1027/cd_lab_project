import { api } from './api';

export const compileCode = async (code, activeFile = "test.c") => {
  try {
    const response = await api.post('/compile', { code, filename: activeFile });
    return response.data;
  } catch (error) {
    console.warn("Backend compiler connection failed. Falling back to offline mock service.", error);
    throw error;
  }
};
