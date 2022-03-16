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
