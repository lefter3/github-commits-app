<template>
    <div>
      <h1 v-if="loading"> Loading... </h1>
  
      <template v-else>
    <ul class="list">
      <li class="list-item" v-for="item in paginatedItems" :key="item.id">{{ item.name }}</li>
    </ul>
    <div v-if="paginatedItems.length" class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
      </template>
    </div>
  </template>
  
  <script lang="ts">
  import { computed, defineComponent, ref, watch } from "vue";  
  import { useApi, useApiWithAuth } from "../modules/api";
import { getPageNumberFromRel } from "@/utils/util";
import { useAuth } from "@/modules/auth";
  
  export default defineComponent({
   setup() {
      const { user } = useAuth()
      const { loading, data, error, get } = useApiWithAuth("/github-api/repositories");
  
      watch([ loading ], () => {
                if ( error.value ) {
                  console.log(error)
                }
                else if ( data.value ) {
                    console.log(data.value)
                }
            })
    const currentPage = ref(1);

      get({
        per_page: 5,
        page: currentPage
      });

    
    watch([currentPage], () =>  {
      get({
        per_page: 5,
        page: currentPage
      });
    })

    const totalPages = computed(() => {
      try {
        return getPageNumberFromRel(data.value.headers.link, 'last') ?? 1
      } catch (error) {
        return 1
       }
    });
    const linkHeader = computed(() => {
      return data.value.headers.link
    })
    const paginatedItems = computed(() => {
     return data.value.data
    });

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };
  
      return { loading, paginatedItems, totalPages, currentPage, nextPage, prevPage, linkHeader };
    },
  });
  </script>
  