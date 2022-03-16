<template>
  <div>
    <v-row class="search">
      <v-text-field
        v-model="itemSearched"
        dense
        solo
        placeholder="Search item"
        prepend-inner-icon="mdi-magnify"
        clearable
        dark
        class="search-input"
      ></v-text-field>
    </v-row>
    <v-row class="category-wrapper">
      <v-card
        class="white--text category-card-wrapper"
        v-for="(category, i) in categories"
        :key="`cat_${i}`"
      >
        <v-card-title class="pl-7 grey--text text--lighten-2">
          {{ category.name }}
        </v-card-title>
        <v-card-text class="px-7 grey--text">
          <v-card
            class="category-card my-3"
            v-for="(item, j) in category.items"
          >
            <v-card-title
              class="category-card-title pl-5"
              :key="item.title"
              @click="showDescription(item)"
            >
              <small class="grey--text text--lighten-2"
                ><v-icon class="green--text">{{
                  isDescriptionVisible && item.id === selectedId
                    ? "mdi-chevron-up"
                    : "mdi-chevron-down"
                }}</v-icon
                >{{ item.title }}
              </small>
            </v-card-title>

            <v-card-text
              class="category-card-description mt-4 grey--text text--lighten-2"
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
                      dark
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
    <v-dialog v-model="isDeleteRequested" width="350">
      <v-card class="error pa-5 card-delete">
        DELETE <strong>{{ itemToDelete.item.title }} </strong>?
        <v-card-actions class="mt-2">
          <v-btn
            outlined
            class="error lighten-1"
            @click="isDeleteRequested = false"
            ><v-icon class="mr-1">mdi-close</v-icon>cancel</v-btn
          >
          <v-spacer />
          <v-btn class="error darken-3" @click="confirmDeleteItem"
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

export default Vue.extend({
  name: "Categories",
  components: {},
  computed: {
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
  },
  data() {
    return {
      isDescriptionVisible: false,
      selectedItem: {},
      selectedId: 0,
      itemSearched: "",
      isDeleteRequested: false,
      itemToDelete: {
        categoryId: null,
        item: {},
      },
      itemToEdit: {
        categoryId: null,
        item: {},
      },
      isEditMode: false,
    };
  },
  methods: {
    isDescriptionChanged(item) {
      return item.description !== this.itemToEdit.item.description;
    },
    saveEdit() {
      store.dispatch("EDIT_ITEM_FROM_CATEGORY", this.itemToEdit).then(() => {
        this.isEditMode = false;
      });
    },
    cancelEdit() {
      this.isEditMode = false;
    },
    editItem(categoryId, item) {
      this.itemToEdit = {
        categoryId: categoryId,
        item: { ...this.selectedItem },
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

<style>
.theme--dark.v-text-field--solo > .v-input__control > .v-input__slot {
  background: rgba(255, 255, 255, 0.05) !important;
}
</style>

<style lang="scss" scoped>
.search {
  padding: 50px 90px 0px 130px;
}

.category-wrapper {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 20px;
  padding: 0 90px 0 130px;
}

.category-card-wrapper {
  background: rgba(255, 255, 255, 0.05);
}

.category-card {
  background: rgba(255, 255, 255, 0.05);
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

.card-delete {
  border-radius: 8px;
  border-left: 2px solid orange !important;
  border-right: 2px solid orange !important;
}

.description-textarea-edit {
  font-size: 0.8em;
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
</style>
