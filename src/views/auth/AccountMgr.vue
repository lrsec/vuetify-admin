<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container fluid fill-height class="main-container pa-3" >
    <v-layout column fill-height justify-start align-start>
      <v-container fluid class="background-color-white pa-3">

        <v-container fluid class="py-2 px-3 background-color-grey" grid-list-lg>
          <v-layout row justify-start align-center wrap>
            <v-flex md3 lg2><v-text-field label="用户名" v-model="inputName" /></v-flex>
            <v-flex md3 lg2><v-text-field label="手机号" v-model="inputName" /></v-flex>
            <v-flex md3 lg2>
              <v-select
                v-model="inputRole"
                :items="roles"
                item-key="id"
                item-text="name"
                return-object
                label="角色"
                clearable
              />
            </v-flex>
          </v-layout>
          <v-layout row justify-start align-center>
            <v-btn color="info" small @click="search">筛选</v-btn>
          </v-layout>
        </v-container>

        <v-layout row justify-start align-center wrap class="mt-3">
          <v-btn color="info" small class="ml-0" @click="showAddAccount">添加用户</v-btn>
        </v-layout>

        <v-data-table
          :headers="headers"
          :items="contents"
          :loading="loading"
          no-data-text="暂无数据"
          disable-initial-sort
          class="elevation-1 mt-3">

          <template v-slot:items="props">
            <td>{{ props.item.id }}</td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.realName }}</td>
            <td>{{ props.item.phone }}</td>
            <td>{{ props.item.role }}</td>
            <td>{{ props.item.statusName }}</td>
            <td>{{ props.item.createTime }}</td>
            <td>{{ props.item.updateTime }}</td>
            <td class="justify-left align-center layout">

              <v-tooltip
                top>
                <v-icon
                  slot="activator"
                  small
                  class="mr-2"
                  @click="showEditAccount(props.item)"
                >
                  edit
                </v-icon>

                <span>编辑</span>
              </v-tooltip>

              <v-tooltip
                v-if="props.item.status === 1"
                top>
                <v-icon
                  slot="activator"
                  small
                  @click="updateStatus(props.item)"
                  color="red"
                >
                  remove_circle
                </v-icon>

                <span>停用</span>
              </v-tooltip>

              <v-tooltip
                v-if="props.item.status === 0"
                top>
                <v-icon
                  slot="activator"
                  small
                  color="red"
                  @click="updateStatus(props.item)"
                >
                  done
                </v-icon>

                <span>启用</span>
              </v-tooltip>

            </td>
          </template>

        </v-data-table>

      </v-container>

      <div class="empty-footer"/>
    </v-layout>

    <v-dialog
      persistent
      v-model="showAddAccountDialog"
      max-width="600px">

      <v-card>
        <v-card-title>添加用户</v-card-title>

        <v-card-text>
          <v-container grid-list-lg>
            <v-form ref="addAccountForm">
              <v-layout row justify-start>
                <v-flex xs4>
                  <v-text-field
                    v-model="newAccountName"
                    label="角色名"
                    :rules="nameRules"
                    required
                  />
                </v-flex>

                <v-flex xs4>
                  <v-text-field
                    v-model="newAccountPwd"
                    :rules="passwordRules"
                    label="密码"
                    required
                  />
                </v-flex>

                <v-flex xs4>
                  <v-text-field
                    v-model="newAccountPhone"
                    label="手机号"
                  />
                </v-flex>

              </v-layout>

              <v-layout row justify-start>
                <v-flex xs4>
                  <v-text-field
                    v-model="newAccountRealName"
                    label="真实姓名"
                  />
                </v-flex>

                <v-flex xs4>
                  <v-select
                    v-model="newAccountRole"
                    :items="roles"
                    item-key="id"
                    item-text="name"
                    return-object
                    label="角色"
                    :rules="roleRules"
                    required
                  />
                </v-flex>

                <v-flex xs4>
                  <v-select
                    v-model="newAccountStatusName"
                    :items="roleStatusList"
                    label="立即启用"
                    required
                  ></v-select>
                </v-flex>

              </v-layout>
            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" flat @click="closeAddAccount">取消</v-btn>
          <v-btn color="blue darken-1" flat @click="addAccount">确定</v-btn>
        </v-card-actions>
      </v-card>

    </v-dialog>

    <v-dialog
      persistent
      v-model="showEditAccountDialog"
      max-width="600px">

      <v-card>
        <v-card-title>添加用户</v-card-title>

        <v-card-text>
          <v-container grid-list-lg>
            <v-form ref="editAccountForm">
              <v-layout row justify-start>
                <v-flex xs4>
                  <v-text-field
                    v-model="accountInEdit.name"
                    label="角色名"
                    :rules="nameRules"
                    required
                  />
                </v-flex>

                <v-flex xs4>
                  <v-text-field
                    v-model="accountInEdit.phone"
                    label="手机号"
                  />
                </v-flex>

              </v-layout>

              <v-layout row justify-start>
                <v-flex xs4>
                  <v-text-field
                    v-model="accountInEdit.realName"
                    label="真实姓名"
                  />
                </v-flex>

                <v-flex xs4>
                  <v-select
                    v-model="accountInEdit.role"
                    :items="roles"
                    item-key="id"
                    item-text="name"
                    return-object
                    label="角色"
                    :rules="roleRules"
                    required
                  />
                </v-flex>

                <v-flex xs4>
                  <v-select
                    v-model="accountInEdit.statusName"
                    :items="roleStatusList"
                    label="立即启用"
                    required
                  ></v-select>
                </v-flex>

              </v-layout>
            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" flat @click="closeAddAccount">取消</v-btn>
          <v-btn color="blue darken-1" flat @click="submitEditAccount">确定</v-btn>
        </v-card-actions>
      </v-card>

    </v-dialog>

    <GlobalProcess :value="blocking" />
  </v-container>
</template>

<script>
import md5 from 'md5'
import { getRoles, getAccounts, updateAccountStatus, addAccount, updateAccount } from '@/api/auth'

export default {
  name: 'AccountMgr',
  data () {
    return {
      blocking: false,
      headers: [
        {
          text: 'ID',
          align: 'left',
          sortable: true,
          value: 'id'
        },
        {
          text: '用户名',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        {
          text: '真实姓名',
          align: 'left',
          sortable: false,
          value: 'realName'
        },
        {
          text: '手机号',
          align: 'left',
          sortable: false,
          value: 'phone'
        },
        {
          text: '角色',
          align: 'left',
          sortable: true,
          value: 'role'
        },
        {
          text: '状态',
          align: 'left',
          sortable: true,
          value: 'statusName'
        },
        {
          text: '创建时间',
          align: 'left',
          sortable: true,
          value: 'createTime'
        },
        {
          text: '更新时间',
          align: 'left',
          sortable: true,
          value: 'updateTime'
        },
        {
          text: '操作',
          align: 'left',
          sortable: false,
          value: 'name'
        }
      ],

      contents: [],
      roles: [],
      loading: false,

      // 检索
      inputName: null,
      inputPhone: null,
      inputRole: null,
      usedName: null,
      usedPhone: null,
      usedRole: null,

      nameRules: [
        v => (!!v && v.trim().length > 0) || '用户名不能为空'
      ],
      passwordRules: [
        v => !!v || '密码不能为空',
        v => v.length >= 6 || '密码至少为6位'
      ],
      roleRules: [
        v => !!v || '角色不能为空'
      ],
      roleStatusList: ['启用', '停用'],

      // 新增用户
      showAddAccountDialog: false,
      newAccountName: null,
      newAccountPwd: null,
      newAccountRealName: null,
      newAccountPhone: null,
      newAccountRole: null,
      newAccountStatusName: '启用',

      // 修改用户信息
      showEditAccountDialog: false,
      accountInEdit: {}
    }
  },
  methods: {
    updateContents () {
      this.loading = true

      const roleId = this.usedRole == null ? '-1' : this.usedRole.id

      getAccounts(this.usedName, null, this.usedPhone, roleId, -1).then(res => {
        const data = res.data
        if (data.success) {
          this.contents = data.contents
        } else this.$toast.error('获取用户列表失败: ' + data.message)
      }).catch(err => {
        this.$toast.error('获取用户列表错误: ' + err)
      }).finally(() => {
        this.loading = false
      })
    },
    updateRoles () {
      getRoles(null).then(res => {
        const data = res.data
        if (data.success) {
          this.roles = data.contents
        } else this.$toast.error('获取角色信息失败: ' + data.message)
      }).catch(err => {
        this.$toast.error('获取角色信息请求错误: ' + err)
      })
    },
    search () {
      this.usedName = this.inputName
      this.usedPhone = this.inputPhone
      this.usedRole = this.inputRole

      this.updateContents()
    },
    updateOneContent (content) {
      for (let i = 0; i < this.contents.length; i++) {
        if (this.contents[i].id === content.id) {
          this.$set(this.contents, i, content)
          return
        }
      }
    },
    updateStatus (item) {
      this.loading = true
      const status = item.status === 0 ? 1 : 0
      updateAccountStatus(item.id, status).then(res => {
        const data = res.data
        if (data.success) {
          const content = data.content
          this.updateOneContent(content)
        } else this.$toast.error('修改用户状态失败: ' + data.message)
      }).catch(err => {
        this.$toast.error('修改用户状态错误: ' + err)
      }).finally(() => {
        this.loading = false
      })
    },
    showAddAccount () {
      this.newAccountName = null
      this.newAccountPwd = null
      this.newAccountRealName = null
      this.newAccountPhone = null
      this.newAccountRole = null
      this.newAccountStatusName = '启用'

      this.showAddAccountDialog = true
    },
    closeAddAccount () {
      this.showAddAccountDialog = false
    },
    addAccount () {
      if (this.$refs.addAccountForm.validate()) {
        this.blocking = true

        const status = this.newAccountStatusName === '启用' ? 1 : 0
        const password = md5(this.newAccountPwd)

        addAccount(this.newAccountName, password, this.newAccountRealName, this.newAccountPhone, this.newAccountRole.id, status).then(res => {
          const data = res.data
          if (data.success) {
            this.closeAddAccount()
            this.updateContents()
          } else this.$toast.error('添加用户失败: ' + data.message)
        }).catch(error => {
          this.$toast.error('添加用户错误: ' + error)
        }).finally(() => {
          this.blocking = false
        })
      }
    },
    showEditAccount (item) {
      this.accountInEdit = Object.assign({}, item)

      for (let i = 0; i < this.roles.length; i++) {
        const role = this.roles[i]
        if (role.id === item.id) {
          this.accountInEdit.role = role
          return
        }
      }

      this.showEditAccountDialog = true
    },
    closeEditAccount () {
      this.showEditAccountDialog = false
    },
    submitEditAccount () {
      if (this.$refs.editAccountForm.validate()) {
        this.blocking = true

        this.accountInEdit.status = this.accountInEdit.statusName === '启用' ? 1 : 0
        this.accountInEdit.roleId = this.accountInEdit.role.id

        updateAccount(this.accountInEdit).then(res => {
          const data = res.data
          if (data.success) {
            const content = data.content

            this.closeEditAccount()
            this.updateOneContent(content)
          } else this.$toast.error('修改用户信息失败: ' + data.message)
        }).catch(error => {
          this.$toast.error('修改用户信息错误: ' + error)
        }).finally(() => {
          this.blocking = false
        })
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.updateRoles()
      vm.updateContents()
    })
  }
}
</script>

<style scoped>

</style>
