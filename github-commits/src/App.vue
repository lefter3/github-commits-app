<template>
  <div class="container">

    <nav v-if="isAuthenticated">
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
    </nav>
    <template v-if="isAuthenticating">
      <h1>Loading...</h1>
    </template>
    <template v-else>
      <router-view/>
    </template>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "./modules/auth";

export default defineComponent({
  setup() {
    const { isAuthenticating, user } = useAuth()
    const router = useRouter()
    const route = useRoute()
    const isAuthenticated = computed(() => {
      return !!user?.value
    })
    watch([ user ], () => {
      if ( isAuthenticating.value === false && route.meta.requiresAuth === true && !user?.value) {
        console.log('redirecting home in app.vue');

        router.push({ name: 'home' })
      }
      else if ( isAuthenticating.value !== false ) router.push({ name: 'login' })
    })

    return { isAuthenticating, user, isAuthenticated }
  }
})
</script>
<style>
          #app {
            font-family: Avenir, Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-align: center;
            /* color: #2c3e50; */
          }
          body {
              background-color: black;
              color: #FFBF00; /* Amber */
              margin: 0;
              padding: 0;
          }
          a {
            text-decoration: none!important;
          }
          .container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 20px;
              margin-top: 5%
          }
          nav {
              margin: 0 auto;
              max-width: 600px;
              background-color: #333;
              padding: 15px;
              text-align: center;
          }
          nav a {
              color: #FFBF00; /* Amber */
              text-decoration: none;
              margin: 0 20px;
              transition: color 0.3s;
              font-weight: bold;
          }
          nav a:hover {
              color: #FFD700; /* Gold */
          }
          h1, h3 {
              text-align: center;
              margin: 20px 0;
          }
          .button {
              background-color: #FFBF00; /* Amber */
              color: black;
              border: 2px solid #FFBF00; /* Amber */
              padding: 10px 20px;
              text-align: center;
              text-decoration: none;
              display: inline-block;
              transition: background-color 0.3s, color 0.3s;
              border-radius: 5px;
              margin: 20px auto;
              display: block;
          }
          .button:hover {
              background-color: black;
              color: #FFBF00; /* Amber */
          }
          .list {
              margin: 0 auto;
              max-width: 600px;
              list-style-type: none;
              padding: 0;
          }
          .list-item {
              border: 1px solid #FFBF00; /* Amber */
              margin: 10px 0;
              padding: 15px;
              transition: background-color 0.3s;
              border-radius: 5px;
              background-color: #222;
          }
          .list-item:hover {
              background-color: #333;
          }
          .pagination {
              margin: 20px 0;
              text-align: center;
          }
          .pagination button {
              color: #FFBF00; /* Amber */
              margin: 0 5px;
              text-decoration: none;
              padding: 5px 10px;
              border: 1px solid #FFBF00; /* Amber */
              transition: background-color 0.3s, color 0.3s;
              border-radius: 5px;
          }
          .pagination a:hover {
              background-color: #FFBF00; /* Amber */
              color: black;
          }
</style>
