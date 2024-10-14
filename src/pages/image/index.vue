<template>
  <div class="flex-1 p-2">
    <v-row dense>
      <v-col
        v-for="(image, i) in imageList"
        :key="i"
        cols="12"
        md="3"
      >
        <v-card color="surface-variant">
          <v-img
            height="200"
            :src="image.url"
            cover
          >
          </v-img>
          <template v-slot:actions>
            <v-spacer>
              <span class="text-xs pl-2 text-gray-300">{{ `${image.width}*${image.height}` }}</span>
            </v-spacer>
            <v-btn icon="mdi-paperclip" size="small"></v-btn>
            <v-btn icon="mdi-close" size="small"></v-btn>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { getHistory, ImageData } from '../../api/image'

const imageList = ref<ImageData[]>()

onMounted(async() => {
  console.log(1);
  const res = await getHistory()
  console.log(res);
  if (res) {
    imageList.value = res.data.data
    console.log(imageList.value);
  }
})
</script>

<style lang="scss" scoped>

</style>
