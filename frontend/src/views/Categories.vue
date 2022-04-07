<template>
  <div style="margin-bottom: 100px">
    <v-row
      :class="`${
        isDarkMode ? 'black-bg' : 'white grey-border-bottom'
      } search align-center justify-center`"
    >
      <!-- {{ wordsList }} -->
      <!-- TODO: add a dynamic result -->
      <v-col class="search align-center pa-0 ma-0">
        <v-text-field
          v-model="itemSearched"
          dense
          solo
          placeholder="Search item"
          prepend-inner-icon="mdi-magnify"
          clearable
          :dark="isDarkMode"
          class="search__input mt-2 mb-n2"
          @input="isSearching = true"
          v-click-outside="closeList"
        ></v-text-field>
        <div class="search__list" v-if="isSearching">
          <ul>
            <li v-for="(word, i) in words" :key="`search_${i}`">
              <span class="search__word" @click="selectWord(word)">{{
                word
              }}</span>
            </li>
          </ul>
        </div>
      </v-col>
      <v-col class="pa-0 ma-0">
        <v-row class="align-center new-category-action pa-0 ma-0">
          <v-text-field
            :dark="isDarkMode"
            label="Create a new category"
            placeholder="Name"
            v-model="newCategoryName"
            color="green"
            dense
            clearable
            class="mx-5 input-new-category"
          ></v-text-field>
          <v-btn
            @click="createCategory()"
            class="green button-add-item mr-n1 mt-n3"
            ><v-icon>mdi-plus</v-icon></v-btn
          >
        </v-row>
      </v-col>
    </v-row>
    <v-row class="category-wrapper">
      <v-card
        :class="`${
          isDarkMode ? '' : 'white'
        } white--text category-card-wrapper`"
        v-for="(category, i) in categories"
        :key="`cat_${i}`"
      >
        <v-card-title
          :class="`card-title pl-7 ${
            isDarkMode
              ? 'grey--text text--lighten-2 category-header__dark'
              : 'grey--text text--darken-2 category-header__light'
          }`"
        >
          <v-btn
            @click="requestCategoryDelete(category)"
            class="mt-9 mr-n2 error--text"
            fab
            absolute
            top
            right
            text
            height="20"
            width="20"
            ><v-icon x-small>mdi-close</v-icon></v-btn
          >
          <v-btn
            @click="openAddNewItem(category)"
            class="green button-add-item mr-2"
            ><v-icon>mdi-plus</v-icon></v-btn
          >
          {{ category.name }}
          <small class="grey--text ml-2">({{ category.items.length }})</small>
        </v-card-title>
        <v-card-text class="px-7 grey--text category-scroll">
          <v-card
            :class="`${
              isDarkMode ? 'transparent-bg' : 'app-bg'
            } category-card my-3`"
            v-for="(item, j) in category.items"
            :key="`catCard_${j}`"
          >
            <template
              v-if="isDeleteRequested && itemToDelete.item.id === item.id"
            >
              <v-row class="justify-center pt-5 pb-3">
                <v-btn
                  outlined
                  text
                  x-small
                  class="error--text lighten-1 mx-2"
                  @click="isDeleteRequested = false"
                  ><v-icon class="mr-1">mdi-close</v-icon>cancel</v-btn
                >
                <v-btn x-small class="error mx-2" @click="confirmDeleteItem"
                  ><v-icon small class="mr-1">mdi-trash-can</v-icon
                  >delete</v-btn
                >
              </v-row>
            </template>
            <v-card-title
              class="category-card-title pl-5"
              :key="item.title"
              @click="showDescription(item)"
            >
              <img src="../assets/logo.png" height="21px" />
              <small
                :class="`${
                  isDarkMode
                    ? 'grey--text text--lighten-2'
                    : 'grey--text text--darken-1'
                }`"
                ><v-icon class="green--text">{{
                  isDescriptionVisible && item.id === selectedId
                    ? "mdi-chevron-up"
                    : "mdi-chevron-down"
                }}</v-icon
                >{{ item.title }}
              </small>
            </v-card-title>
            <v-card-subtitle
              @click="showDescription(item)"
              class="grey--text mb-n5 card-date"
            >
              <small class="ml-1"
                >Created:
                {{ new Date(item.createdAt).toLocaleDateString() }}</small
              ><v-spacer /><small
                class="ml-1 updated-date green--text"
                v-if="item.updatedAt"
                >Updated:
                {{ new Date(item.updatedAt).toLocaleDateString() }}</small
              >
            </v-card-subtitle>

            <v-rating
              small
              :color="setStarColorFrom(item.rating)"
              :value="item.rating"
              background-color="grey"
              class="mb-n3 card-rating"
              @input="(e) => updateRating(e, item, category.id)"
            />

            <v-card-text
              :class="`${
                isDarkMode
                  ? 'grey--text text--lighten-2'
                  : 'grey--text text--darken-2'
              } category-card-description mt-4 `"
              v-if="isDescriptionVisible && item.id === selectedId"
            >
              <v-row class="mx-0 pa-2 card-description-row">
                <small
                  @click="editItem(category.id, item)"
                  v-if="!isEditMode"
                  class="item-description"
                  ><v-icon
                    v-if="!isEditMode"
                    @click="editItem(category.id, item)"
                    class="mr-2 black--text"
                    >mdi-pencil</v-icon
                  >{{ item.description }}</small
                >

                <template v-if="isEditMode && item.id === selectedId">
                  <v-col class="col-12">
                    <v-textarea
                      v-model="itemToEdit.item.description"
                      class="description-textarea-edit"
                      autofocus
                      :dark="isDarkMode"
                      auto-grow
                    ></v-textarea>
                  </v-col>
                  <v-col class="col-12 mt-n5 mb-n3">
                    <v-row class="px-3">
                      <v-btn @click="cancelEdit()" outlined class="error" small
                        >CANCEL</v-btn
                      >
                      <v-spacer />
                      <transition name="fade">
                        <v-btn
                          v-if="isDescriptionChanged(item)"
                          @click="saveEdit()"
                          class="green"
                          small
                          >SAVE</v-btn
                        >
                      </transition>
                    </v-row>
                  </v-col>
                  <v-card-actions> </v-card-actions>
                </template>
              </v-row>
            </v-card-text>

            <v-card-actions>
              <v-spacer />

              <v-btn
                v-if="!isDeleteRequested || itemToDelete.item.id !== item.id"
                class="error mt-9 mr-n2"
                absolute
                top
                right
                fab
                height="20px"
                width="20px"
                @click="deleteItem(category.id, item)"
                ><v-icon x-small>mdi-close</v-icon></v-btn
              >
            </v-card-actions>
          </v-card>
        </v-card-text>
      </v-card>
    </v-row>

    <v-dialog v-model="showModalNewItemToCategory" width="500">
      <v-card
        :class="`${isDarkMode ? 'black-bg' : 'white'} pa-5 card-new-item`"
        :dark="isDarkMode"
      >
        Add new item to category
        <strong class="green--text">{{ selectedCategory.name }}</strong>
        <v-row class="pa-5">
          <v-col class="col-12">
            <v-text-field
              v-model="newItemToCategory.title"
              label="Title"
              color="green"
              filled
            ></v-text-field>
          </v-col>
          <v-col class="col-12">
            <v-textarea
              v-model="newItemToCategory.description"
              filled
              label="Description"
              color="green"
              auto-grow
            ></v-textarea>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-btn
            text
            @click="showModalNewItemToCategory = !showModalNewItemToCategory"
            ><v-icon class="mr-1">mdi-close</v-icon>CANCEL</v-btn
          ><v-spacer />
          <v-btn @click="addNewItemToCategory()" class="green"
            ><v-icon class="mr-1">mdi-plus</v-icon>ADD ITEM</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isCategoryDelete" width="350">
      <v-card class="error pa-5 card-delete">
        <img src="../assets/logo.png" height="33px" class="icon-delete" />
        DELETE CATEGORY <strong>{{ categoryToDelete.name }} </strong>?
        <v-card-actions class="mt-2">
          <v-btn
            outlined
            class="error lighten-1"
            @click="isCategoryDelete = false"
            ><v-icon class="mr-1">mdi-close</v-icon>cancel</v-btn
          >
          <v-spacer />
          <v-btn class="error darken-3" @click="confirmDeleteCategory()"
            ><v-icon class="mr-1">mdi-trash-can</v-icon>delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import store from "@/store";
import utils from "../utils/index.js";

Vue.directive("click-outside", {
  bind(el, binding, vnode) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener("click", el.clickOutsideEvent);
  },
  unbind(el) {
    document.body.removeEventListener("click", el.clickOutsideEvent);
  },
});

export default Vue.extend({
  name: "Categories",
  components: {},
  computed: {
    isDarkMode() {
      return store.state.settings.isDarkMode;
    },
    categories() {
      const storedCats = [...(store.state.storedCategories || [])];
      const searchString = (this.itemSearched || "").toLowerCase();

      if (searchString.length > 0) {
        const filteredCats = storedCats.map((category) => {
          return {
            ...category,
            items: category.items.filter((item) => {
              if (
                (item.description || "").toLowerCase().indexOf(searchString) >=
                  0 ||
                (item.title || "").toLowerCase().indexOf(searchString) >= 0
              ) {
                return true;
              }
            }),
          };
        });
        return filteredCats;
      }
      return storedCats;
    },
    words() {
      let words = [];
      let stringThread = "";
      let itemDescription = [];
      store.state.storedCategories.forEach((category) => {
        itemDescription = category.items.map((item) => item.description);
        words.push(itemDescription);
      });
      this.removeClutter(words.flat()).forEach(
        (string) => (stringThread += string)
      );
      const result = this.removeUndesirableWords(
        this.removeClutter(stringThread)
      )
        .split(" ")
        .filter((el) => el.includes(this.itemSearched))
        .slice(0, 30)
        .sort();
      return new Set(result);
    },
  },
  data() {
    return {
      isDescriptionVisible: false,
      selectedItem: {},
      selectedId: 0,
      itemSearched: "",
      isDeleteRequested: false,
      isSearching: false,
      itemToDelete: {
        categoryId: null,
        item: {},
      },
      itemToEdit: {
        categoryId: null,
        item: {},
      },
      isEditMode: false,
      isCategoryDelete: false,
      newCategoryName: "",
      newItemToCategory: {
        id: null,
        description: "",
        title: "",
        createdAt: null,
        updatedAt: null,
        rating: 0,
      },
      selectedCategory: {},
      showModalNewItemToCategory: false,
      categoryToDelete: {},
    };
  },
  methods: {
    removeClutter(list) {
      const punctuation = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
      if (typeof list === "object") {
        return list.map((item) => {
          return item.replace(punctuation, " ");
        });
      } else {
        return list.replace(punctuation, " ");
      }
    },
    setStarColorFrom(rating) {
      switch (rating) {
        case 5:
          return "green";
        case 4:
          return "green";
        case 3:
          return "orange";
        case 2:
          return "red";
        case 1:
          return "red";
        default:
          return "grey";
      }
    },
    updateRating(newVal, item, categoryId) {
      this.itemToEdit = { categoryId, item: { ...item, rating: newVal } };
      this.saveEdit();
    },
    confirmDeleteCategory() {
      store.dispatch("DELETE_CATEGORY", this.categoryToDelete).then(() => {
        this.categoryToDelete = {};
        this.isCategoryDelete = false;
      });
    },
    requestCategoryDelete(category) {
      this.categoryToDelete = category;
      this.isCategoryDelete = true;
    },
    createCategory() {
      if (this.newCategoryName === "") {
        return;
      }

      store.dispatch("CREATE_CATEGORY", this.newCategoryName).then(() => {
        this.newCategoryName = "";
      });
    },
    addNewItemToCategory() {
      const timeOfBirth = new Date().getTime();
      this.newItemToCategory.id = timeOfBirth;
      this.newItemToCategory.createdAt = timeOfBirth;
      store
        .dispatch("ADD_ITEM_TO_CATEGORY", {
          categoryId: this.selectedCategory.id,
          item: this.newItemToCategory,
        })
        .then(() => {
          this.showModalNewItemToCategory = false;
          this.newItemToCategory = {
            id: null,
            description: "",
            title: "",
            createdAt: null,
            updatedAt: null,
            rating: 0,
          };
          this.selectedCategory = {};
        });
    },
    openAddNewItem(category) {
      this.selectedCategory = category;
      this.showModalNewItemToCategory = true;
    },
    isDescriptionChanged(item) {
      return item.description !== this.itemToEdit.item.description;
    },
    saveEdit() {
      store.dispatch("EDIT_ITEM_FROM_CATEGORY", this.itemToEdit).then(() => {
        this.isEditMode = false;
        this.itemToEdit = {
          categoryId: null,
          item: {},
        };
      });
    },
    cancelEdit() {
      this.isEditMode = false;
    },
    closeList() {
      this.isSearching = false;
    },
    editItem(categoryId, item) {
      this.setSelectedItem(item);
      this.itemToEdit = {
        categoryId: categoryId,
        item: { ...this.selectedItem, updatedAt: new Date().getTime() },
      };

      this.isEditMode = true;
    },
    confirmDeleteItem() {
      store
        .dispatch("DELETE_ITEM_FROM_CATEGORY", this.itemToDelete)
        .then(() => {
          this.itemToDelete = {
            categoryId: null,
            item: {},
          };
          this.isDeleteRequested = false;
        });
    },
    deleteItem(categoryId, item) {
      this.isDeleteRequested = !this.isDeleteRequested;
      this.itemToDelete = { categoryId: categoryId, item: item };
    },
    removeUndesirableWords(string) {
      string = string.toLowerCase();
      string = string.replace(/  +/g, " ");
      string = string.replaceAll("\n", " ");
      string = string.replace(/[0-9]/g, "");

      utils.undesirable.forEach((letter) => {
        string = string.replaceAll(letter, " ");
      });

      return string;
    },
    selectWord(word) {
      this.itemSearched = word;
      this.isSearching = false;
    },
    setSelectedItem(item) {
      this.selectedItem = item;
      this.selectedId = item.id;
    },
    showDescription(item) {
      if (this.selectedItem.id === item.id) {
        this.isDescriptionVisible = false;
        this.selectedItem = {};
        this.isEditMode = false;
        return;
      }

      this.setSelectedItem(item);

      if (this.selectedItem.id === this.selectedId) {
        this.isDescriptionVisible = true;
      } else {
        this.isDescriptionVisible = false;
      }
    },
  },
});
</script>

<style lang="scss">
.theme--dark.v-text-field--solo > .v-input__control > .v-input__slot {
  background: rgba(255, 255, 255, 0.05) !important;
}
.card-rating {
  .v-icon:hover {
    transform: rotate(20deg) !important;
  }
}
</style>

<style lang="scss" scoped>
.search {
  align-items: center;
  display: flex;
  justify-content: center;
  left: 67px;
  padding-right: 20px;
  padding-top: 20px;
  position: fixed;
  top: 0;
  width: calc(100% - 60px);
  z-index: 10;
}

.input-new-category {
  max-width: 250px;
}

.search-input {
  margin-left: 64px;
}

.new-category-action {
  display: flex;
  justify-content: end;
  padding-right: 54px !important;
}

.category-wrapper {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 40px;
  padding: 0 90px 0 130px;
}

.category-icon {
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s ease-in-out;
  &:hover {
    opacity: 1;
  }
}

.icon-delete {
  margin-bottom: -10px;
}

.category-card-wrapper {
  background: rgba(255, 255, 255, 0.05);
}

.card-date {
  text-align: left !important;
}

.updated-date {
  display: block;
  margin-top: -6px;
}

.category-card-title {
  text-align: left;
  word-break: break-word;
  line-height: 18px;
  margin-right: 20px;
  cursor: pointer;
}

.category-card-description {
  text-align: left;
}

.card-description-row {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  border-left: 1px solid greenyellow !important;
  border-right: 1px solid greenyellow !important;
}

.card-new-item {
  border-radius: 8px;
  border-left: 1px solid greenyellow !important;
  border-right: 1px solid greenyellow !important;
}

.card-delete {
  border-radius: 8px;
  border-left: 2px solid green !important;
  border-right: 2px solid green !important;
}

.description-textarea-edit {
  font-size: 0.8em;
}

.v-btn:not(.v-btn--round).v-size--default.button-add-item {
  width: 30px !important;
  height: 30px !important;
  min-width: 30px !important;
}

.new-category-wrapper {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.05),
    transparent
  );
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@media screen and(max-width: 1000px) {
  .category-wrapper {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media screen and(max-width: 800px) {
  .category-wrapper {
    grid-template-columns: repeat(1, 1fr);
  }
}

.category-card-wrapper {
  height: clamp(340px, 50vh, 500px);
  overflow: auto;
}
.card-title {
  position: sticky;
  top: 0;
  z-index: 8;
}
::-webkit-scrollbar {
  background: transparent;
  width: 12px;
}
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
  width: 10px;
  margin-top: 64px;
  margin-bottom: 4px;
}
::-webkit-scrollbar-thumb {
  background: radial-gradient(transparent, green);
  border-radius: 20px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

.search {
  position: relative;
  display: flex;
  justify-content: start;
  &__input {
    max-width: 250px;
  }
  &__list {
    display: block;
    position: absolute;
    top: 46px;
    left: 0px;
    background: rgba(0, 0, 0, 0.7);
    width: 100%;
    max-width: 250px;
    color: white;
    padding-bottom: 24px;
    border-radius: 0 0 12px 12px;
    ul {
      list-style-type: none;
      text-align: left;
      margin: none;
    }
  }
  &__word {
    cursor: pointer;
    transition: all 0.15s ease-in-out;
    display: block;
    padding: 2px 8px;
    border-radius: 4px;
    &:hover {
      color: greenyellow;
      background: green;
    }
  }
}
</style>
