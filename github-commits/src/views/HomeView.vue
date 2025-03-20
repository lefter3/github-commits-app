<template>
  <div class="home">
    <h1>{{ name }}</h1>
    <h3>{{ username }}</h3>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useAuth } from "../modules/auth";

export default defineComponent({
  setup() {
    const { user } = useAuth();
    console.log(user?.value)
    const name = computed(() => {
      return user?.value && user.value.displayName
        ? `Hey, ${user.value.displayName}`
        : "Welcome back!";
    });

    const username = computed(
      () =>
        user?.value?.username
    );

    return { user, name, username };
  },
});
</script>