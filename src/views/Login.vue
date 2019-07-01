<template>
  <v-app>
    <v-content>
      <v-container
        fluid
        fill-height
      >
        <v-layout
          align-center
          justify-center
        >
          <v-flex
            xs12
            sm8
            md4
          >
            <v-card class="elevation-12">
              <v-toolbar
                dark
                color="info"
              >
                <v-toolbar-title>欢迎!!!</v-toolbar-title>
                <v-spacer />
                <v-tooltip bottom>
                  <v-btn
                    slot="activator"
                    icon
                    large
                    :href="source"
                    target="_blank"
                  />
                  <span>Source</span>
                </v-tooltip>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    v-model="userName"
                    prepend-icon="person"
                    name="login"
                    label="Login"
                    type="text"
                  />
                  <v-text-field
                    id="password"
                    v-model="password"
                    prepend-icon="lock"
                    name="password"
                    label="Password"
                    type="password"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="info"
                  @click.native="handleSubmit()"
                >
                  登录
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'

export default {

  props: {
    source: String
  },
  data () {
    return {
      drawer: null,
      userName: '',
      password: ''
    }
  },
  methods: {
    ...mapActions([
      'handleLogin'
    ]),
    handleSubmit () {
      const data = {
        userName: this.userName, password: this.password
      }

      this.handleLogin(data).then(res => {
        this.$router.push({
          name: 'home'
        })
      }, rej => {
        this.$toast.error('登录失败: ' + rej)
      })
    }
  }
}
</script>

<style>
</style>
