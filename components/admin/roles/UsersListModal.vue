<template>
  <modal :show.sync="show" @close-modal="closeModal" :size="'modal-lg'">
    <template>
      <div v-if="loading" class="overlay">
        <i class="fas fa-2x fa-sync fa-spin"></i>
      </div>
      <div class="modal-header">
        <h4 class="modal-title">Добавить пользователей</h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span @click="closeModal" aria-hidden="true">×</span>
        </button>
      </div>
      <div class="modal-body">
<!--        <div class="d-flex justify-content-between mb-3">-->
<!--          <button class="btn btn-outline-dark btn-sm mr-2">-->
<!--            <i class="fa-solid fa-user-plus"></i> Добавить-->
<!--          </button>-->
<!--          <form class="form-search input-group input-group-sm" style="width: 300px;">-->
<!--            <input v-model="search"-->
<!--                   type="text"-->
<!--                   name="table_search"-->
<!--                   class="form-control float-right border-dark"-->
<!--                   placeholder="Поиск...">-->
<!--            <div class="input-group-append">-->
<!--              <button type="submit" class="btn btn-default border-dark">-->
<!--                <i class="fas fa-search"></i>-->
<!--              </button>-->
<!--            </div>-->
<!--          </form>-->
<!--        </div>-->

        <div class="card">
          <div class="d-flex justify-content-between" style="padding: 1rem 1.5rem;">
            <button @click="createUser()" class="btn btn-outline-dark btn-sm mr-2">
              <i class="fa-solid fa-user-plus"></i> Добавить
            </button>
            <form class="form-search input-group input-group-sm" style="width: 300px;">
              <input v-model="search"
                     type="text"
                     name="table_search"
                     class="form-control float-right border-dark"
                     placeholder="Поиск...">
              <div class="input-group-append">
                <button type="submit" class="btn btn-default border-dark">
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </form>
          </div>

          <div class="card-body table-responsive p-0 limit-height">
            <table class="table table-head-fixed text-nowrap">
              <thead>
              <tr>
                <th style="width: 1%">
                  ID
                </th>
                <th style="width: 20%">
                  Имя
                </th>
                <th style="width: 30%">
                  Email
                </th>
                <th style="width: 20%">
                  Действия
                </th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="user in users.data" v-if="!usersAdded.includes(user.id)">
                <td>
                  {{ user.id }}
                </td>
                <td>
                  <a>
                    {{ user.name }}
                  </a>
                </td>
                <td>
                  <a>
                    {{ user.email }}
                  </a>
                </td>
                <td class="project-actions">
                  <input v-model="checkbox" :value="{id:user.id,name: user.name, added: true}" type="checkbox">
                </td>
              </tr>
              </tbody>
<!--              <div v-if="loading" class="spinner-load">&ndash;&gt;-->
<!--                <img src="/loader.gif">-->
<!--              </div>-->
            </table>
          </div>
        </div>
      </div>
      <div class="modal-footer justify-content-between">
        <button @click="closeModal()" class="btn btn-outline-light">Отмена</button>
        <pagination :data="users" @pagination-change-page="getUsers"></pagination>
        <button @click="add()" class="btn btn-outline-light">
          <span>Добавить</span>
        </button>
      </div>
    </template>
  </modal>
</template>

<script>
import Modal from "../global/Modal";
export default {
  name: "UsersListModal",
  components: {Modal},
  props: {
    show: Boolean,
    userAddModal: Boolean,
  },
  data() {
    return {
      users: {},
      usersAdded: [],
      loading: false,
      search: '',
      debounce: null,
      checkbox: []
    }
  },
  watch: {
    show(val){
      if(val) {
        if(!Object.keys(this.users).length) {
          this.getUsers()
        }
        const users = this.$store.getters["role/getUsers"]
        let deleted_user = []

        for (let i = 0; i < users.length; i++) {
          if(this.usersAdded.includes(users[i].id)) {
            deleted_user.push(users[i].id)
          }
        }
        this.usersAdded = deleted_user
      }
    },

    search() {
      if(this.search) {
        if (this.search.length >= 3) {
          this.loading = true
          clearTimeout(this.debounce);

          this.debounce = setTimeout(() => {
            this.$api.adminUsers.search(this.search).then(response => {
              this.users = response
            }).catch(() => {
              console.warn('Oh. Something went wrong')
            }).finally(() => {
              this.loading = false
            });
          }, 600);
        }
      } else {
        this.getUsers(1)
      }
    }
  },

  methods: {
    createUser() {
      this.$emit('update:user-add-modal', true)
      this.closeModal()
    },

    closeModal() {
      this.$emit("update:show", false);
      this.checkbox = []
    },

    async getUsers(page) {
      this.loading = true
      if (typeof page === 'undefined') {
        page = 1;
      }

      let users = await this.$api.adminUsers.index(page)
      this.users = users
      this.loading = false
    },

    add() {
      if (this.checkbox.length) {
        this.$store.commit('role/pushUsers', this.checkbox)

        this.checkbox.forEach((user) => {
          this.usersAdded.push(user.id)
        })

        this.closeModal()
      }
    },
  },
}
</script>

<style>
  .limit-height {
    /*max-height: 500px;*/
    /*height: 100%;*/
    height: 400px;
  }

</style>

