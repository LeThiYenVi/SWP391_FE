import instance from "./customize-axios";

export const getLocationsAPI = async () => {
  const response = await instance.get('/api/locations');
  return response.data;
}; 