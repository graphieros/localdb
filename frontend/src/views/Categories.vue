<template>
  <div style="margin-bottom: 100px">
    <Spinner v-if="isLoading" />
    <v-navigation-drawer
      class="drawer-view-item"
      v-model="itemModal"
      absolute
      temporary
      hide-overlay
      right
    >
      <v-card
        :style="`background: linear-gradient(to top, ${colors[selectedIndex]}1f, transparent; border:1px solid ${colors[selectedIndex]}; color:${colors[selectedIndex]}; background: linear-gradient(to top, ${colors[selectedIndex]}5f, transparent`"
      >
        <v-card-title>
          {{ selectedItem.title }}
        </v-card-title>
        <v-card-text class="grey--text" style="text-align: left">
          Created: {{ new Date(selectedItem.createdAt).toLocaleDateString() }}
          <br />
          <span v-if="selectedItem.updatedAt">
            Updated: {{ new Date(selectedItem.updatedAt).toLocaleDateString() }}
          </span>
          <br v-if="selectedItem.updatedAt" />
          ID: {{ selectedItem.id }}
        </v-card-text>
        <v-card-text class="grey--text mt-n3" style="text-align: left">
          <v-icon :color="colors[selectedIndex]">mdi-format-quote-open</v-icon>
          {{ selectedItem.description }}
          <v-icon :color="colors[selectedIndex]">mdi-format-quote-close</v-icon>
        </v-card-text>
        <v-rating
          :value="selectedItem.rating"
          :color="colors[selectedIndex]"
          background-color="grey"
          readonly
        ></v-rating>
      </v-card>
    </v-navigation-drawer>
    <v-row
      :class="`${
        isDarkMode ? 'black-bg' : 'white grey-border-bottom'
      } search align-center justify-center`"
    >
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
            v-if="newCategoryName"
            @click="openNewCategoryModal()"
            class="green button-add-item mr-n1 mt-n3"
            ><v-icon>mdi-plus</v-icon></v-btn
          >
        </v-row>
      </v-col>
      <v-dialog v-model="isNewCategoryModal" width="400">
        <v-card :dark="isDarkMode" class="pa-5 pt-2">
          <v-card-title>
            Create category
            <strong class="px-2">{{ newCategoryName }} </strong>?
          </v-card-title>
          {{ categoryColor ? categoryColor.hexa : "" }}
          <v-card-text align="center">
            <v-color-picker
              v-model="categoryColor"
              mode.sync="hexa"
              hide-inputs
            ></v-color-picker>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="cancelCategoryCreation()">
              <v-icon>mdi-close</v-icon>cancel
            </v-btn>
            <v-spacer />
            <v-btn @click="createCategory()" class="green"
              ><v-icon>mdi-plus</v-icon>create category</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="showCategoryColorChange" width="400">
        <v-card :dark="isDarkMode" class="pa-5 pt-2">
          <v-card-title> Change category color </v-card-title>
          <v-card-text align="center">
            <v-color-picker
              v-model="categoryColorUpdated"
              mode.sync="hexa"
              hide-inputs
            ></v-color-picker>
          </v-card-text>
          <v-card-actions>
            <v-btn
              @click="
                showCategoryColorChange = !showCategoryColorChange;
                selectedCategory = {};
              "
            >
              <v-icon>mdi-close</v-icon>cancel
            </v-btn>
            <v-spacer />
            <v-btn @click="updateCategoryColor()" class="green">
              <v-icon>mdi-check</v-icon>update color
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row class="category-wrapper">
      <v-card
        :class="`${
          isDarkMode ? '' : 'white'
        } white--text category-card-wrapper`"
        v-for="(category, i) in categories"
        :key="`cat_${i}`"
        :style="`border:1px solid ${colors[i]}5f; background: linear-gradient(to top, ${colors[i]}3f, transparent)`"
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
            class="mt-12 mr-n2 error--text"
            fab
            absolute
            top
            right
            text
            height="20"
            width="20"
            ><v-icon small>mdi-close</v-icon></v-btn
          >

          <v-btn
            @click="requestChangeCategoryColor(category)"
            class="mt-11 mr-5"
            fab
            absolute
            top
            right
            height="28"
            width="28"
            :dark="isDarkMode"
            :style="`background: ${category.color}`"
          >
            <v-icon small>mdi-palette</v-icon>
          </v-btn>

          <v-btn
            @click="openAddNewItem(category, i)"
            class="button-add-item mr-2"
            :style="`background-color:${colors[i]}`"
            ><v-icon>mdi-plus</v-icon></v-btn
          >
          <span :style="`color:${colors[i]}`">{{ category.name }}</span>
          <small class="grey--text ml-2">({{ category.items.length }})</small>
        </v-card-title>

        <div
          class="gauge"
          :style="`background: ${isDarkMode ? '#18192C' : 'white'}`"
        >
          <GaugeCanvas
            acceleration="0.07"
            size="100"
            animated
            animationSpeed="0"
            base10
            hideMeasures
            :dark="isDarkMode"
            darkColor="#18192C"
            :range="[10, 10, 10, 10, 10, 10, 10, 10, 10, 10]"
            :score="getAverageRating(category.id).rating / 2"
            :msBeforeMount="0"
            :colors="gaugeColorsReversed"
          />
          <div
            class="item-types-count mx-2"
            v-for="(el, k) in itemTypes"
            :key="`item-type_${k}`"
          >
            <div class="item-types-count-wrapper">
              <v-icon class="item-type" :style="`color:${el.color}`">{{
                el.icon
              }}</v-icon>
              <small :style="`color:${el.color}`">{{ getItemTypeCountPerCategory(category, el) }}</small>
            </div>
          </div>
        </div>

        <v-expansion-panels :dark="isDarkMode">
          <v-expansion-panel>
            <v-expansion-panel-header class="pl-7">
              View treemap
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <apexchart
                :options="treemap(category, i)"
                :series="treemap(category, i).series"
                height="200px"
              ></apexchart>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-card-text
          class="px-7 grey--text category-scroll"
          :id="category.id"
          @drop="(e) => drop(e, category.id, category.id)"
          @dragover="(e) => allowDrop(e, category.id)"
          @dragleave="(e) => dragLeave(e, category.id)"
          @dragend="(e) => dragLeave(e, category.id)"
          :key="step"
        >
          <v-card
            :class="`${
              isDarkMode ? 'transparent-bg' : 'app-bg'
            } category-card my-3`"
            v-for="(item, j) in category.items"
            :key="`catCard_${j}`"
            draggable="true"
            :id="item.id"
            @click="draggedEl = null"
            @dragstart="(e) => drag(e, item, category.id)"
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
              <!-- <img src="../assets/logo.png" height="21px" /> -->
              <small
                :class="`${
                  isDarkMode
                    ? 'grey--text text--lighten-2'
                    : 'grey--text text--darken-1'
                }`"
                ><v-icon :style="`color:${colors[i]}`">{{
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
              <div v-if="item.type">
                <v-icon
                  class="item-type mr-2 ml-1"
                  :style="`color:${getIconColor(item)}`"
                  >{{ getIcon(item) }}</v-icon
                >
              </div>
              <div>
                <small class="ml-1"
                  >Created:
                  {{ new Date(item.createdAt).toLocaleDateString() }}</small
                ><v-spacer /><small
                  class="ml-1 updated-date"
                  :style="`color:${colors[i]}`"
                  v-if="item.updatedAt"
                  >Updated:
                  {{ new Date(item.updatedAt).toLocaleDateString() }}</small
                >
              </div>
            </v-card-subtitle>

            <v-rating
              small
              :color="setStarColorFrom(item.rating, i)"
              :value="item.rating"
              background-color="grey"
              length="10"
              class="mb-n3 card-rating"
              half-increments
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
              <v-row
                class="mx-0 pa-2 card-description-row"
                :style="`border-left: 3px solid ${colors[i]}; border-right: 3px solid ${colors[i]}`"
              >
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
                <v-btn
                  absolute
                  bottom
                  right
                  class="mb-6"
                  fab
                  x-small
                  :style="`background-color:${colors[i]}`"
                  @click="viewItem(item, i)"
                  ><v-icon>mdi-eye</v-icon></v-btn
                >
              </v-row>
            </v-card-text>

            <v-card-actions>
              <v-spacer />

              <v-btn
                v-if="!isDeleteRequested || itemToDelete.item.id !== item.id"
                class="mt-11"
                :style="`color:${colors[i]}`"
                absolute
                top
                right
                fab
                outlined
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
        :style="`border-left: 2px solid ${colors[selectedIndex]} !important;border-right: 2px solid ${colors[selectedIndex]} !important`"
        :dark="isDarkMode"
      >
        Add new item to category
        <strong :style="`color:${colors[selectedIndex]}`">{{
          selectedCategory.name
        }}</strong>
        <v-row class="pa-5">
          <v-col class="col-12">
            <v-text-field
              v-model="newItemToCategory.title"
              label="Title"
              :color="colors[selectedIndex]"
              filled
            ></v-text-field>
          </v-col>
          <v-col class="col-12">
            <v-select
              :dark="isDarkMode"
              v-model="newItemToCategory.type"
              :items="itemTypes.map((el) => el.name)"
              label="Type"
              :color="colors[selectedIndex]"
              filled
            ></v-select>
          </v-col>
          <v-col class="col-12">
            <v-textarea
              v-model="newItemToCategory.description"
              filled
              label="Description"
              :color="colors[selectedIndex]"
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
          <v-btn
            light
            @click="addNewItemToCategory()"
            :style="`background:${colors[selectedIndex]}`"
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

    <v-snackbar v-model="showSnack" color="green black--text">
      <v-icon class="mr-1 black--text">mdi-check</v-icon>Moved item
      <strong>{{ snackBarContent.item.title }}</strong> from
      <i>{{ getCategoryNameFromId(snackBarContent.originId) }}</i> to
      <i>{{ getCategoryNameFromId(snackBarContent.destinationId) }}</i>
      <template v-slot:action="{ attrs }">
        <v-btn
          color="black"
          text
          v-bind="attrs"
          @click="showSnack = !showSnack"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import Vue from "vue";
import store from "../store";
import utils from "../utils/index.js";
import Spinner from "../components/Spinner.vue";
import GaugeBar from "../components/GaugeBar.vue";
import GaugeCanvas from "../components/GaugeCanvas.vue";

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
  components: { GaugeBar, GaugeCanvas, Spinner },
  computed: {
    isDarkMode() {
      return store.state.settings.isDarkMode;
    },
    itemTypes() {
      return store.state.itemTypes;
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

      return storedCats.map((cat) => {
        return {
          ...cat,
          items: cat.items.sort((a, b) => b.createdAt - a.createdAt),
        };
      });
    },
    words() {
      let words = [];
      let stringThread = "";
      let itemDescription = [];
      store.state.storedCategories.forEach((category) => {
        itemDescription = category.items.map((item) => item.description);
        words.push(itemDescription);
      });
      utils
        .removePunctuation(words.flat())
        .forEach((string) => (stringThread += string));
      const result = utils
        .removeUndesirableWords(utils.removePunctuation(stringThread))
        .split(" ")
        .filter((el) => el.includes(this.itemSearched))
        .slice(0, 30)
        .sort();
      return new Set(result);
    },
    colors() {
      return store.state.storedCategories.map((category) => category.color);
    },
  },
  data() {
    return {
      categoryColor: null,
      categoryToDelete: {},
      draggedEl: null,
      draggedPayload: {},
      isCategoryDelete: false,
      isDeleteRequested: false,
      isDescriptionVisible: false,
      isEditMode: false,
      isLoading: false,
      isNewCategoryModal: false,
      isSearching: false,
      itemModal: false,
      itemSearched: "",
      itemToDelete: {
        categoryId: null,
        item: {},
      },
      itemToEdit: {
        categoryId: null,
        item: {},
      },
      newCategoryName: "",
      newItemToCategory: {
        id: null,
        description: "",
        title: "",
        createdAt: null,
        updatedAt: null,
        rating: 0,
        type: "",
      },
      originId: null,
      selectedCategory: {},
      selectedId: 0,
      selectedIndex: 0,
      selectedItem: {},
      selectedTreemap: "",
      showModalNewItemToCategory: false,
      showSnack: false,
      snackBarContent: {
        originId: null,
        destinationId: null,
        item: {
          title: "",
        },
      },
      step: 0,
      categoryColorUpdated: "",
      showCategoryColorChange: false,
      gaugeColorsReversed: [
        "#5cd65c",
        "greenyellow",
        "#ccff33",
        "#ffff00",
        "#ffcc00",
        "#ffae00",
        "#ff9933",
        "#ff6600",
        "#ff3300",
        "red",
      ],
    };
  },
  methods: {
    getAverageRating(categoryId) {
      const category = store.state.storedCategories.filter((category) => {
        return category.id === categoryId;
      })[0];
      const itemsRatings = category.items.map((item) => {
        return item.rating || 0;
      });
      return {
        rating:
          Number(
            (
              (itemsRatings.reduce((a, b) => a + b, 0) / itemsRatings.length) *
              2
            ).toFixed(1)
          ) || 0,
        translation: category.name,
        colors: ["#eb4034", "#ebb134", "#20a82e"],
      };
    },
    getCategoryNameFromId(categoryId) {
      const category = store.state.storedCategories.filter((category) => {
        return category.id === categoryId;
      })[0];
      return category?.name;
    },
    allowDrop(e, categoryId) {
      this.originId = categoryId;
      const destination = document.getElementById(this.originId);
      if (this.originId !== this.draggedPayload.originId) {
        destination.style.border = "3px dashed white";
      }
      e.preventDefault();
    },
    drag(e, item, categoryId) {
      this.draggedPayload = {
        item,
        originId: categoryId,
      };
      e.dataTransfer.setData("text", e.target.id);
      this.originId = e.target.id;
      this.draggedEl = document.getElementById(e.target.id);
      const origin = document.getElementById(categoryId);
      origin.style.border = "none";
    },
    dragLeave(_e, categoryId) {
      const origin = document.getElementById(categoryId);
      setTimeout(() => {
        origin.style.border = "none";
      }, 1000);
    },
    dragEnd(_e, categoryId) {
      const origin = document.getElementById(categoryId);
      origin.style.border = "none";
    },
    drop(e, el, newCategoryId) {
      if (this.draggedPayload.originId === newCategoryId) {
        return;
      }
      this.draggedPayload.destinationId = newCategoryId;
      e.preventDefault();

      this.swapCategory();
      const destination = document.getElementById(el);
      destination.style.border = "none";
      destination.appendChild(document.getElementById(this.draggedEl.id));
      this.step += 1;
    },
    swapCategory() {
      store
        .dispatch("DELETE_ITEM_FROM_CATEGORY", {
          categoryId: this.draggedPayload.originId,
          item: this.draggedPayload.item,
        })
        .then(() => {
          this.step += 1;
          this.originId = this.draggedPayload.originId;
          store
            .dispatch("ADD_ITEM_TO_CATEGORY", {
              categoryId: this.draggedPayload.destinationId,
              item: this.draggedPayload.item,
            })
            .then(() => {
              this.snackBarContent = this.draggedPayload;
              this.showSnack = true;
              this.draggedPayload = {};
              this.draggedEl = null;
              const origin = document.getElementById(this.originId);
              origin.style.border = "none";
              this.originId = null;
              this.step += 1;
            });
        });
    },
    setStarColorFrom(_rating, index) {
      return this.colors[index];
    },
    updateRating(newVal, item, categoryId) {
      this.itemToEdit = {
        categoryId,
        item: { ...item, rating: newVal, updatedAt: new Date().getTime() },
      };
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
    requestChangeCategoryColor(category) {
      this.categoryColorUpdated = category.color;
      this.showCategoryColorChange = true;
      this.selectedCategory = category;
    },
    updateCategoryColor() {
      this.selectedCategory.color = this.categoryColorUpdated;
      store.dispatch("UPDATE_CATEGORY", this.selectedCategory).then(() => {
        this.showCategoryColorChange = false;
      });
    },
    openNewCategoryModal() {
      this.isNewCategoryModal = !this.isNewCategoryModal;
    },
    cancelCategoryCreation() {
      this.newCategoryName = "";
      this.isNewCategoryModal = !this.isNewCategoryModal;
    },
    createCategory() {
      if (this.newCategoryName === "") {
        return;
      }
      store
        .dispatch("CREATE_CATEGORY", {
          color: this.categoryColor.hex,
          name: this.newCategoryName,
        })
        .then(() => {
          this.newCategoryName = "";
          this.isNewCategoryModal = !this.isNewCategoryModal;
        });
    },
    addNewItemToCategory() {
      const timeOfBirth = new Date().getTime();
      this.newItemToCategory.id = timeOfBirth;
      this.newItemToCategory.createdAt = timeOfBirth;
      this.isLoading = true;

      setTimeout(() => {
        store
          .dispatch("ADD_ITEM_TO_CATEGORY", {
            categoryId: this.selectedCategory.id,
            item: this.newItemToCategory,
          })
          .then(() => {
            this.showModalNewItemToCategory = false;
            this.newItemToCategory = {
              createdAt: null,
              description: "",
              id: null,
              rating: 0,
              title: "",
              updatedAt: null,
            };
            this.selectedCategory = {};
            this.isLoading = false;
          });
      }, 2000);
    },
    openAddNewItem(category, index) {
      this.selectedCategory = category;
      this.selectedIndex = index;
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
    getIcon(item) {
      const { type } = item;
      return this.itemTypes.find((el) => el.name === type).icon;
    },
    getIconColor(item) {
      const { type } = item;
      return this.itemTypes.find((el) => el.name === type).color;
    },
    getItemTypeCountPerCategory(category, el) {
      const ofElType = category.items.filter((item) => item.type === el.name);
      return ofElType.length;
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
    categoryWords(cat) {
      let words = [];
      let stringThread = "";
      let itemDescription = [];

      const filteredCategory = store.state.storedCategories.filter(
        (category) => {
          return category.name === cat.name;
        }
      )[0];

      itemDescription = filteredCategory.items.map((item) => {
        return item.description;
      });
      words.push(itemDescription);

      utils
        .removePunctuation(words.flat())
        .forEach((string) => (stringThread += string));

      return utils.convertStringToTreemap(
        utils.removeUndesirableWords(utils.removePunctuation(stringThread))
      );
    },
    treemap(category, index) {
      const that = this;

      const dataSet = this.categoryWords(category)
        .filter((set) => {
          return set.x !== "";
        })
        .slice(0, 30);
      this.treemapTotal = dataSet.length;
      const onlyY = dataSet.map((el) => {
        return el.y;
      });

      const maxVal = Math.max(...onlyY);

      return {
        chart: {
          type: "treemap",
          toolbar: {
            show: false,
          },
        },
        colors: [this.colors[index]],
        dataLabels: {
          formatter: function (val, opts) {
            const count = opts.value;
            if (count > maxVal / 4) {
              return [val, count];
            } else {
              return val;
            }
          },
        },
        grid: {
          padding: {
            right: 36,
            left: 36,
          },
        },
        plotOptions: {
          treemap: {
            distributed: false,
            enableShades: true,
            shadeIntensity: 0.61803398875,
          },
        },
        series: [{ data: dataSet }],
        stroke: {
          width: 1,
          colors: ["#000"],
        },

        tooltip: {
          followCursor: true,
          custom: function (tooltipItem) {
            const dataPointIndex = tooltipItem.dataPointIndex;
            const dataPoint =
              tooltipItem.w.config.series[0].data[dataPointIndex];
            let html = "";

            html += `<i>${
              dataPoint.x
            } : ${dataPoint.y.toLocaleString()}</i><br>`;

            return `<div class="custom-tooltip-wrapper">${html}</div>`;
          },
        },
      };
    },
    viewItem(_item, index) {
      this.selectedIndex = index;
      this.itemModal = !this.itemModal;
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
    transform: scale(1.5, 1.5) !important;
  }
}
</style>

<style lang="scss" scoped>
.gauge {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
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
  display: flex;
  flex-direction: row;
  align-items: center;
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
  height: calc(100vh - 150px);
  overflow: auto;
  overflow-x: hidden;
}
.v-card {
  border-radius: 12px;
  box-shadow: 0 10px 20px -10px black !important;
}
.card-title {
  border-radius: 0 0 12px 0;
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
  background: radial-gradient(transparent, grey);
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
    background: rgba(0, 0, 0, 0.9);
    width: 100%;
    max-width: 250px;
    color: white;
    padding: 0 24px 24px 0;
    border-radius: 0 0 12px 12px;
    ul {
      list-style-type: none;
      text-align: left;
      margin: none;
    }
  }
  &__word {
    cursor: pointer;
    display: block;
    padding: 2px 8px;
    border-radius: 4px;
    position: relative;
    &:hover {
      background-color: rgba(0, 255, 0, 0.3);
      &::before {
        color: greenyellow;
        content: "\2605  ";
        display: block;
        font-size: 1.2em;
        left: -18px;
        position: absolute;
        top: -1px;
      }
    }
  }
}
</style>
<style lang="scss">
.drawer-view-item {
  z-index: 1000000;
}
.custom-tooltip-item {
  margin: 3px 0;
}
.custom-tooltip-wrapper {
  background: rgb(0, 0, 14);
  border-radius: 3px;
  color: lightgrey;
  padding: 24px;
  text-align: left;
  word-break: break-word;
}
.custom-tooltip-marker {
  border-radius: 3px;
  display: inline-block;
  height: 20px;
  margin-bottom: -5px;
  margin-right: 5px;
  width: 20px;
}
hr {
  background-color: grey;
  height: 1px;
  margin: 6px 0;
  opacity: 0.6;
}
.v-expansion-panel-content__wrap {
  padding: 0;
}
.v-expansion-panels .v-expansion-panel {
  background-color: transparent !important;
}

.drawer-view-item {
  background-color: rgb(0, 0, 14) !important;
  position: fixed !important;
  top: 50% !important;
  right: 0 !important;
  transform: translateY(-50%) !important;
  height: 600px !important;
  padding: 24px;
  width: 400px !important;
  border-radius: 12px 0 0 12px;
}
.item-type {
  background: rgb(0, 0, 14);
  padding: 2px;
  border-radius: 6px;
}
.item-types-count-wrapper {
  display: flex;
  flex-direction: column;
}
</style>
