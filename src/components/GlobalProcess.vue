<template>
  <v-dialog persistent v-model="value" width="60px">
    <v-container class="pa-0" style="width: 60px; height: 60px;">
      <v-layout fill-height justify-center align-center class="pa-0 background-color-white">
        <v-progress-circular
          size="32"
          indeterminate
          color="info"
        ></v-progress-circular>
      </v-layout>
    </v-container>
  </v-dialog>
</template>

<script>
export default {
  name: 'GlobalProcess',
  props: ['value']
}
</script>

<style scoped>

</style>
