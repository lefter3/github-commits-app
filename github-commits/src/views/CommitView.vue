<template>
    <h1>Commits by repository and date</h1>
    <ul class="list">
    <li class="list-item" v-for="item in items" :key="item.label" >
       <strong @click="toggleShow(item)">{{ item.label }}</strong>
      <ul v-if="item.showNested" class="nested-list">
        <li class="list-item" v-for="data in item.data" :key="data.date">
          Date: {{ data.date }}, Count: {{ data.commits }}
        </li>
      </ul>
    </li>
  </ul>
  </template>
  
  <script lang="ts">
  import { useApiWithAuth } from '@/modules/api';
import { useAuth } from '@/modules/auth';
import { prepareDatasets } from '@/utils/util';
import { defineComponent, ref, watch } from 'vue';
    
  export default defineComponent({
    name: 'MatrixChart',
    setup() {

      const { user } = useAuth()
      const { loading, data, error, get } = useApiWithAuth("/commit-count");
      let items = ref<any[]>([])

      watch([ loading ], () => {
                if ( error.value ) {
                  console.log(error)
                }
                else if ( data.value ) {
                  console.log(data.value)
                    items.value = prepareDatasets(data.value).map(el => ({
                      ...el,
                      showNested: false
                    }))
                    console.log(items.value)
                }
            })
      get()

      const toggleShow = (item: any) => {
        console.log(item)
        item.showNested = !item.showNested;
    };

    get();

    return {
      items,
      toggleShow
    };

   
    }
  });
  </script>
  
  <style scoped>
  a.nostyle:link {
    text-decoration: inherit;
    color: inherit;
    cursor: auto;
}

a.nostyle:visited {
    text-decoration: inherit;
    color: inherit;
    cursor: auto;
}
  </style>