<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" class="pa-0" fixed app
      :mobile-break-point="mobileSize"
      :width="navDrawWrapWidth">
      <v-layout fill-height>
        <v-navigation-drawer
          v-model="drawer" dark width="100" :mobile-break-point="mobileSize">
          <div style="width: 100%; height: 100%;" @mouseover="backMenuItem">
            <v-layout
              row
              justify-center
              align-center
              style="height: 50px;">

              <v-menu
                open-on-hover
                bottom offset-y
                left offset-x>
                <v-avatar size="30" slot="activator">
                  <img :src="require('../assets/logo.png')">
                </v-avatar>

                <v-list style="width: 200px;" class="pt-0 pb-0" dense>
                  <v-list-tile
                    class="avater-tile"
                    @click="openChangePwd">
                    <v-list-tile-title class="body-1">修改密码</v-list-tile-title>

                  </v-list-tile>

                  <v-divider />

                  <v-list-tile
                    id="logout-tile"
                    @click="logout">
                    <v-list-tile-content>
                      <v-list-tile-title class="body-1">退出登录</v-list-tile-title>
                    </v-list-tile-content>

                    <v-icon id="logout-icon">power_settings_new</v-icon>

                  </v-list-tile>
                </v-list>
              </v-menu>

            </v-layout>

            <v-list class="pt-0" dense>
              <v-divider />

              <v-list-tile
                class="first-menu-tile"
                v-for="item in menuList"
                :key="item.title"
                :to="{name: item.name}"
                active-class="active-menu-white"
                @click="clickFirstMenu(item)"
                @mouseenter.stop="changeMenuItem(item)"
                @mouseover.stop="doNothing">
                <v-list-tile-action style="min-width: auto">
                  <v-icon size="16">{{ item.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-title class="ml-2 body-1">
                  {{ item.title }}
                </v-list-tile-title>
              </v-list-tile>
            </v-list>
          </div>
        </v-navigation-drawer>
        <v-navigation-drawer
          v-model="drawer"
          light
          width="150"
          :mobile-break-point="mobileSize"
          v-if="hasSubNav">

          <div style="width: 100%; height: 100%;" @mouseleave="backMenuItem">
            <v-layout
              row
              justify-center
              align-center
              style="height: 50px;">
              <div>{{menuItem.title}}</div>
            </v-layout>

            <v-list class="pt-0" dense>
              <v-divider />

              <template v-for="secondMenu in menuItem.children" >
                <v-list-group
                  v-if="secondMenu.children && secondMenu.children.length > 0"
                  :key="secondMenu.title"
                  value="true"
                >

                  <template slot="activator">
                    <v-list-tile>
                      <v-list-tile-title class="body-1">{{ secondMenu.title }}</v-list-tile-title>
                    </v-list-tile>
                  </template>

                  <template v-for="thirdMenu in secondMenu.children">
                    <v-list-tile
                      :key="thirdMenu.name"
                      :to="{name: thirdMenu.name}"
                      active-class="default-class active-menu-grey">
                      <v-list-tile-title class="pl-3 body-1">{{ thirdMenu.title }}</v-list-tile-title>
                    </v-list-tile>
                  </template>

                </v-list-group>

                <v-list-tile
                  v-else
                  :key="secondMenu.title"
                  :to="{name: secondMenu.name}"
                  active-class="default-class active-menu-grey">
                  {{ secondMenu.title }}
                </v-list-tile>
              </template>

            </v-list>
          </div>

        </v-navigation-drawer>
      </v-layout>
    </v-navigation-drawer>

    <v-toolbar
      light
      fixed
      app
      color="white"
      flat
      height="50px">
      <v-toolbar-side-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title class="subheading">{{ title }}</v-toolbar-title>
    </v-toolbar>

    <v-content>
        <router-view/>
    </v-content>

    <v-dialog
      persistent
      v-model="showChangePwdDialog"
      max-width="600px"
      >

      <v-card>
        <v-card-title>修改登录密码 - {{userName}}</v-card-title>

        <v-card-text>
          <v-container grid-list-md>
            <v-form ref="changePwdForm">
              <v-layout column>
                <v-flex xs12>
                  <v-text-field
                    v-model="oldPwd"
                    label="原始密码"
                    :rules="oldPwdRule"
                    type="password"
                    required/>
                </v-flex>

                <v-flex xs12>
                  <v-text-field
                    v-model="newPwd"
                    label="新密码"
                    :rules="newPwdRule"
                    type="password"
                    required/>
                </v-flex>

                <v-flex xs12>
                  <v-text-field
                    v-model="verifyNewPwd"
                    label="再次确认"
                    :rules="verifyNewPwdRule"
                    type="password"
                    required/>
                </v-flex>

              </v-layout>
            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer/>
          <v-btn color="blue darken-1" flat @click="closeChangePwdDialog">取消</v-btn>
          <v-btn color="blue darken-1" flat @click="changePwd">确定</v-btn>
        </v-card-actions>
      </v-card>

    </v-dialog>
  </v-app>
</template>

<script>
import md5 from 'md5'
import { findRouterItem } from '@/libs/util'

export default {
  data () {
    return {
      drawer: true,
      routeItem: {},
      menuItem: {},
      menuHoverCache: null,

      // 修改密码
      showChangePwdDialog: false,
      oldPwd: '',
      newPwd: '',
      verifyNewPwd: '',
      oldPwdRule: [
        v => !!v || '原始密码不能为空'
      ],
      newPwdRule: [
        v => !!v || '密码不能为空',
        v => v.length >= 6 || '密码至少为6位'
      ],
      verifyNewPwdRule: [
        v => !!v || '密码不能为空',
        v => v === this.newPwd || '与新密码不一致'
      ]
    }
  },
  computed: {
    userName () {
      return this.$store.state.user.userName
    },
    title () {
      return this.$route.meta.title
    },
    mobileSize () {
      return this.$vuetify.breakpoint.thresholds.sm
    },
    menuList () {
      return this.$store.getters.menuList
    },
    hasSubNav () {
      return (this.menuItem.children && this.menuItem.children.length > 0)
    },
    navDrawWrapWidth () {
      if (this.hasSubNav) return 250
      else return 100
    }
  },
  methods: {
    clickFirstMenu (menu) {
      if (!menu.children || menu.children.length === 0) {
        this.$router.push({ name: menu.name })
      } else {
        const secondMenu = menu.children[0]

        if (!secondMenu.children || secondMenu.length === 0) {
          this.$router.push({ name: secondMenu.name })
        } else {
          this.$router.push({ name: secondMenu.children[0].name })
        }
      }
    },
    changeMenuItem (menu) {
      // if (!menu.children || menu.children.length === 0) return
      if (this.menuItem.name !== menu.name) {
        if (!this.menuHoverCache) {
          this.menuHoverCache = this.menuItem
        }

        this.menuItem = menu
      }
    },
    backMenuItem () {
      if (this.menuHoverCache != null) {
        this.menuItem = this.menuHoverCache
        this.menuHoverCache = null
      }
    },
    doNothing () {},
    logout () {
      this.$store.dispatch('handleLogOut').then((res) => {
        this.$router.push({ name: 'login' })
      }).catch(err => {
        this.$toast.error('退出登录失败: ' + err)
      })
    },
    openChangePwd () {
      this.showChangePwdDialog = true
    },
    closeChangePwdDialog () {
      this.showChangePwdDialog = false
    },
    changePwd () {
      if (this.$refs.changePwdForm.validate()) {
        const data = {
          oldPwd: md5(this.oldPwd),
          newPwd: md5(this.newPwd)
        }
        this.$store.dispatch('changePassword', data).then(res => {
          this.closeChangePwdDialog()
          this.$router.push({ name: 'login' })
        }).catch(err => {
          this.$toast.error('修改密码失败: ' + err)
        })
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      const currentName = to.name
      const menus = vm.menuList
      const route = findRouterItem(currentName)
      if (route != null) {
        vm.routeItem = route

        for (let i = 0; i < menus.length; i++) {
          const menu = menus[i]
          if (menu.name === route.name) {
            vm.menuItem = menu
            break
          }
        }
      }

      vm.menuHoverCache = null
    })
  }
}
</script>

<style>
  .active-menu-white {
    background-color: white;
    color: #000000;
  }

  .active-menu-grey {
    background-color: #EBEDF0;
  }

  #logout-tile {
    background-color: #EBEDF0;
  }

  #logout-tile:hover {
    background-color: #38f;
    color: #ffffff;
  }

  #logout-tile:hover #logout-icon {
    color: #ffffff;
  }

  .avater-tile:hover {
    background-color: #38f;
    color: #ffffff;
  }
</style>
