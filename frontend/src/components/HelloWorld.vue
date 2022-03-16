<template>
  <div>
    <v-btn @click="getUsers">GET USERS</v-btn>
    <v-btn @click="makeNewUser">NEW USER</v-btn>

    <div v-for="(user, i) in users" :key="`user${i}`">
      <v-card
        >{{ user.name }}
        <v-btn @click="deleteUser({ db: 'users', id: user.id })"
          >DELETE USER</v-btn
        >
      </v-card>
    </div>
  </div>
</template>

<script>
import api from "@/api";
export default {
  data() {
    return {
      count: 0,
      users: [],
    };
  },
  methods: {
    getUsers() {
      api.getJson("users").then((res) => {
        this.users = res.data;
      });
    },
    deleteUser(config) {
      api.deleteJson(config).then((_res) => {
        this.users = this.users.filter((user) => user.id !== config.id);
      });
    },
    makeNewUser() {
      const newUser = {
        name: "Moron",
        id: new Date().getTime(),
        iq: 10,
      };
      api.postJson({ db: "users", values: newUser }).then((res) => {
        this.users.push(res.data);
      });
    },
  },
};
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
