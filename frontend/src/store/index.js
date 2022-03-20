import Vue from "vue";
import Vuex from "vuex";
import api from "@/api/index.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    storedLogs: [],
    storedCategories: [],
  },

  mutations: {
    GET_CATEGORIES(state, categories) {
      state.storedCategories = categories;
    },
    GET_LOGS(state, logs) {
      state.storedLogs = logs;
    },
  },

  actions: {
    DELETE_LOG_ITEM(state, itemId) {
      const updatedLogItems = [...this.state.storedLogs].filter((log) => {
        return log.id !== itemId;
      });

      return new Promise((resolve, reject) => {
        api
          .deleteJson({
            db: "log",
            id: itemId,
          })
          .then(() => {
            this.state.storedLogs = updatedLogItems;
          });
      });
    },
    DELETE_CATEGORY(state, categoryToDelete) {
      const updatedCategories = [...this.state.storedCategories].filter(
        (category) => {
          return category.id !== categoryToDelete.id;
        }
      );

      return new Promise((resolve, reject) => {
        api
          .deleteJson({
            db: "category",
            id: categoryToDelete.id,
          })
          .then(() => {
            this.state.storedCategories = [...updatedCategories].sort(
              (a, b) => a.id - b.id
            );
            const log = {
              type: "delete category",
              item: categoryToDelete,
              logDate: new Date().getTime(),
            };

            api
              .postJson({
                db: "log",
                values: log,
              })
              .then(() => {
                api.getJson("log").then((res) => {
                  const resData = res.data;
                  if (resData.data) {
                    state.commit("GET_LOGS", resData.data);
                  } else {
                    state.commit("GET_LOGS", resData);
                  }
                });
              });

            resolve(true);
          })
          .catch((err) => reject(err.message));
      });
    },
    CREATE_CATEGORY(state, categoryName) {
      const currentCategoriesIds = [...this.state.storedCategories].map(
        (cat) => cat.id
      );
      const lastCurrentId = Math.max(...currentCategoriesIds);

      const newCategory = {
        id: lastCurrentId + 1,
        name: categoryName,
        items: [],
      };

      const completedCategories = [...this.state.storedCategories, newCategory];

      return new Promise((resolve, reject) => {
        api
          .postJson({
            db: "category",
            values: newCategory,
          })
          .then(() => {
            this.state.storedCategories = [...completedCategories].sort(
              (a, b) => a.id - b.id
            );

            const log = {
              type: "create category",
              item: newCategory,
              logDate: new Date().getTime(),
            };

            api
              .postJson({
                db: "log",
                values: log,
              })
              .then(() => {
                api.getJson("log").then((res) => {
                  const resData = res.data;
                  if (resData.data) {
                    state.commit("GET_LOGS", resData.data);
                  } else {
                    state.commit("GET_LOGS", resData);
                  }
                });
              });

            resolve(true);
          })
          .catch((err) => reject(err.message));
      });
    },
    ADD_ITEM_TO_CATEGORY(state, payload) {
      const { categoryId, item } = payload;

      let updatedCategory = {};

      const updatedCategories = [...this.state.storedCategories].map(
        (category) => {
          if (category.id === categoryId) {
            category.items = [...category.items, item];
            updatedCategory = category;
          }
          return category;
        }
      );

      return new Promise((resolve, reject) => {
        api
          .putJson({
            db: "category",
            id: categoryId,
            values: updatedCategory,
          })
          .then(() => {
            this.state.storedCategories = updatedCategories;
            const log = {
              type: "create item",
              item,
              category: updatedCategory.name,
              logDate: new Date().getTime(),
            };

            api
              .postJson({
                db: "log",
                values: log,
              })
              .then(() => {
                api.getJson("log").then((res) => {
                  const resData = res.data;
                  if (resData.data) {
                    state.commit("GET_LOGS", resData.data);
                  } else {
                    state.commit("GET_LOGS", resData);
                  }
                });
              });

            resolve(true);
          })
          .catch((err) => reject(err.message));
      });
    },
    EDIT_ITEM_FROM_CATEGORY(state, payload) {
      const { categoryId, item } = payload;

      let updatedCategory = {};

      const updatedCategories = [...this.state.storedCategories].map(
        (category) => {
          if (category.id === categoryId) {
            category.items = [...category.items].map((oneItem) => {
              if (oneItem.id === item.id) {
                return item;
              }
              return oneItem;
            });
            updatedCategory = category;
          }
          return category;
        }
      );

      return new Promise((resolve, reject) => {
        api
          .putJson({
            db: "category",
            id: categoryId,
            values: updatedCategory,
          })
          .then(() => {
            this.state.storedCategories = updatedCategories;
            const log = {
              type: "update item",
              item,
              category: updatedCategory.name,
              logDate: new Date().getTime(),
            };

            api
              .postJson({
                db: "log",
                values: log,
              })
              .then(() => {
                api.getJson("log").then((res) => {
                  const resData = res.data;
                  if (resData.data) {
                    state.commit("GET_LOGS", resData.data);
                  } else {
                    state.commit("GET_LOGS", resData);
                  }
                });
              });

            resolve(true);
          })
          .catch((err) => reject(err.message));
      });
    },
    DELETE_ITEM_FROM_CATEGORY(state, payload) {
      const { categoryId, item } = payload;

      let updatedCategory = {};

      const updatedCategories = [...this.state.storedCategories].map(
        (category) => {
          if (category.id === categoryId) {
            category.items = [...category.items].filter((oneItem) => {
              return oneItem.id !== item.id;
            });
            updatedCategory = category;
          }
          return category;
        }
      );

      return new Promise((resolve, reject) => {
        api
          .putJson({
            db: "category",
            id: categoryId,
            values: updatedCategory,
          })
          .then(() => {
            this.state.storedCategories = updatedCategories;
            const log = {
              type: "delete item",
              item,
              category: updatedCategory.name,
              logDate: new Date().getTime(),
            };

            api
              .postJson({
                db: "log",
                values: log,
              })
              .then(() => {
                api.getJson("log").then((res) => {
                  const resData = res.data;
                  if (resData.data) {
                    state.commit("GET_LOGS", resData.data);
                  } else {
                    state.commit("GET_LOGS", resData);
                  }
                });
              });
            resolve(true);
          })
          .catch((err) => reject(err.message));
      });
    },
  },

  modules: {},
});
