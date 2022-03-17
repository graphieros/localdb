import Vue from "vue";
import Vuex from "vuex";
import api from "@/api/index.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    storedCategories: [],
  },

  mutations: {
    GET_CATEGORIES(state, categories) {
      state.storedCategories = categories;
    },
  },

  actions: {
    DELETE_CATEGORY(commit, categoryToDelete) {
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
            if (commit) {
              resolve(true);
            }
          })
          .catch((err) => reject(err.message));
      });
    },
    CREATE_CATEGORY(commit, categoryName) {
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
            if (commit) {
              resolve(true);
            }
          })
          .catch((err) => reject(err.message));
      });
    },
    ADD_ITEM_TO_CATEGORY(commit, payload) {
      const { categoryId, item } = payload;
      let modifiedCategory = [...this.state.storedCategories].filter(
        (category) => {
          return category.id === categoryId;
        }
      )[0];

      const otherCategories = [...this.state.storedCategories].filter(
        (category) => {
          return category.id !== categoryId;
        }
      );

      modifiedCategory = {
        ...modifiedCategory,
        items: [...modifiedCategory.items, item],
      };

      return new Promise((resolve, reject) => {
        api
          .putJson({
            db: "category",
            id: modifiedCategory.id,
            values: modifiedCategory,
          })
          .then(() => {
            this.state.storedCategories = [
              ...otherCategories,
              modifiedCategory,
            ].sort((a, b) => a.id - b.id);
            if (commit) {
              resolve(true);
            }
          })
          .catch((err) => reject(err.message));
      });
    },
    EDIT_ITEM_FROM_CATEGORY(commit, payload) {
      const { categoryId, item } = payload;
      let modifiedCategory = [...this.state.storedCategories].filter(
        (category) => {
          return category.id === categoryId;
        }
      )[0];

      const otherCategories = [...this.state.storedCategories].filter(
        (category) => {
          return category.id !== categoryId;
        }
      );

      modifiedCategory.items = [...modifiedCategory.items].filter((el) => {
        return el.id !== item.id;
      });

      modifiedCategory = {
        ...modifiedCategory,
        items: [...modifiedCategory.items, item],
      };

      return new Promise((resolve, reject) => {
        api
          .putJson({
            db: "category",
            id: modifiedCategory.id,
            values: modifiedCategory,
          })
          .then(() => {
            this.state.storedCategories = [
              ...otherCategories,
              modifiedCategory,
            ].sort((a, b) => a.id - b.id);
            resolve(true);
          })
          .catch((err) => reject(err.message));
      });
    },
    DELETE_ITEM_FROM_CATEGORY(commit, payload) {
      const { categoryId, item } = payload;
      let modifiedCategory = [...this.state.storedCategories].filter(
        (category) => {
          return category.id === categoryId;
        }
      )[0];
      modifiedCategory.items = [...modifiedCategory.items].filter((el) => {
        return el.id !== item.id;
      });

      return new Promise((resolve, reject) => {
        api
          .putJson({
            db: "category",
            id: modifiedCategory.id,
            values: modifiedCategory,
          })
          .then(() => {
            if (commit) {
              resolve(true);
            }
          })
          .catch((err) => reject(err.message));
      });
    },
  },

  modules: {},
});
