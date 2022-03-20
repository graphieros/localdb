<template>
  <div>
    <h1 class="green--text">
      LOG
      <v-btn v-if="logs.length" @click="clearLog()" class="mt-n1 ml-4 error"
        >CLEAR ALL</v-btn
      >
    </h1>

    <v-card elevation="16" class="mx-auto log-scroll-card">
      <v-virtual-scroll
        class="log-scroll"
        :bench="benched"
        :items="logs"
        item-height="70"
      >
        <template v-slot:default="{ item }">
          <v-btn
            @click="deleteLogItem(item.id)"
            outlined
            absolute
            top
            left
            height="23"
            width="23"
            class="mt-9 ml-n1 grey--text"
            fab
            ><v-icon x-small>mdi-close</v-icon></v-btn
          >
          <v-list-item-content class="scroll-content">
            <span>
              <v-icon :class="`${getColor(item.type)} mr-2 mt-n1`">{{
                getIcon(item.type)
              }}</v-icon>
              <span :class="getColor(item.type)">{{
                new Date(item.logDate).toLocaleDateString()
              }}</span>

              {{ item.type }}
              <strong>{{
                item.item.name ? item.item.name : item.item.title
              }}</strong>
              {{ item.item.title ? "in category" : "" }}
              <strong>{{ item.item.title ? item.category : "" }}</strong>
              <small class="scroll-items-details" v-if="item.item.title">
                <br />
                Created :
                {{ new Date(item.item.createdAt).toLocaleDateString() }}
                <br />
                Description: {{ item.item.description }}
              </small>
            </span>
          </v-list-item-content>
        </template>
      </v-virtual-scroll>
    </v-card>
  </div>
</template>

<script>
import Vue from "vue";
import store from "@/store";

export default Vue.extend({
  name: "Logs",
  components: {},
  data() {
    return {
      benched: 10,
    };
  },
  computed: {
    logs() {
      const storedLogs = [...(store.state.storedLogs || [])];
      return storedLogs;
    },
  },
  methods: {
    clearLog() {
      store.dispatch("CLEAR_LOG");
    },
    deleteLogItem(itemId) {
      store.dispatch("DELETE_LOG_ITEM", itemId);
    },
    getIcon(itemType) {
      switch (itemType) {
        case "update item":
          return "mdi-update";
        case "delete item":
          return "mdi-delete-forever-outline";
        case "create item":
          return "mdi-folder-plus-outline";
        case "create category":
          return "mdi-sitemap";
        case "delete category":
          return "mdi-delete-forever-outline";
        default:
          return;
      }
    },
    getColor(itemType) {
      switch (itemType) {
        case "update item":
          return "warning--text";
        case "delete item":
          return "error--text";
        case "create item":
          return "green--text";
        case "create category":
          return "green--text";
        case "delete category":
          return "error--text";
        default:
          return;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.log-scroll-card {
  padding-left: 56px;
  background: transparent;
  color: grey;
}
.log-scroll {
  height: calc(100vh - 75px);
  direction: rtl;
  overflow: auto;
  &::-webkit-scrollbar {
    background: transparent;
    width: 12px;
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
    width: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: radial-gradient(transparent, green);
    border-radius: 20px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }
}
.scroll-content {
  direction: ltr;
  text-align: left;
  margin-left: 42px;
}
.scroll-items-details {
  display: block;
  margin-left: 28px;
  margin-top: -10px;
  font-size: 0.65em;
}
h1 {
  text-align: left;
  margin-left: 80px;
  margin-top: 15px;
}
</style>
