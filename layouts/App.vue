<template>
  <div id="app-layout">

    <div>
      <AppHeader v-show="showHeader"/>
    </div>

      <nuxt />

    <AppFooter v-show="showFooter"/>

  </div>
</template>


<script>
    import AppFooter from "../components/global/AppFooter";
    import AppHeader from "../components/global/AppHeader";

    export default {
      components: {AppHeader, AppFooter},
      head: {
        title: 'ownhouse',
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: 'ownhouse',
          },
        ],
      },
        data(){
            return {

            }
        },
        computed: {
            showFooter(){
                let pages = [
                ];
                return pages.indexOf( this.$route.name ) == -1;
            },
            showHeader(){
                let pages = [
                ];
                return pages.indexOf( this.$route.name ) == -1;
            }
        },
      created() {

      },
    }
</script>

<style scoped>
  #app-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

</style>
