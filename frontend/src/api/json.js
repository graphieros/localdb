import axios from "axios";

const server = "http://localhost:3004/";

// add validation

export const getJson = async (db) => {
  return await axios.get(`${server}${db}`);
};

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

  console.log(db, id, values);

  return await axios.put(`${server}${db}/${id}`, values);
};

export const postJson = async (config) => {
  const { db, values } = config;
  if (!values.id) {
    values.id = new Date().getTime();
  }
  return await axios.post(`${server}${db}`, values);
};

// select category of stuff
