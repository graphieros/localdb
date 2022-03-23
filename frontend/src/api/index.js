import axios from "axios";
import { getJson } from "./json";

const server = "http://localhost:3004/";

// add validation

// export const getJson = async (db) => {
//   return await axios.get(`${server}${db}`);
// };

export const deleteJson = async (config) => {
  const { db, id } = config;

  return await axios.delete(`${server}${db}/${id}`);
};

export const getSingle = async (config) => {
  // example: getUser(userid).then(if user.bookId => getSingle(books, bookId)) == join
  const { db, id } = config;

  return await axios.get(`${server}${db}/${id}`);
};

export const putJson = async (config) => {
  const { db, id, values } = config;

  return await axios.put(`${server}${db}/${id}`, values);
};

export const putSettings = async (config) => {
  const { db, values } = config;
  return await axios.put(`${server}${db}`, values);
};

export const postJson = async (config) => {
  const { db, values } = config;
  if (!values.id) {
    values.id = new Date().getTime();
  }
  return await axios.post(`${server}${db}`, values);
};

// console.log(import.meta);

const api = {
  getJson,
  deleteJson,
  getSingle,
  putJson,
  postJson,
  putSettings,
};

export default api;
