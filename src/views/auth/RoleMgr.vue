<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container fluid fill-height class="main-container pa-3">
    <v-layout column fill-height justify-start align-start>
      <v-container fluid class="background-color-white pa-3">

        <v-container fluid class="pa-2 background-color-grey">
          <v-layout row justify-start align-center>
            <v-flex md3><v-text-field label="名称" class="ml-2" style="width: 150px;" v-model="inputName" /></v-flex>
          </v-layout>
          <v-layout row justify-start align-center>
            <v-btn color="info" small @click="search">筛选</v-btn>
          </v-layout>
        </v-container>

        <v-layout row justify-start align-center wrap class="mt-3">
          <v-btn color="info" small class="ml-0" @click="showAddRole">新建角色</v-btn>
        </v-layout>

        <v-data-table
          :headers="headers"
          :items="contents"
          :loading="loading"
          no-data-text="暂无数据"
          disable-initial-sort
          class="elevation-1 mt-3">

          <template v-slot:items="props">
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.detail }}</td>
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
                  @click="openEditRole(props.item)"
                >
                  edit
                </v-icon>

                <span>编辑</span>
              </v-tooltip>

              <v-tooltip
                v-if="props.item.editable && props.item.status === 1"
                top>
                <v-icon
                  slot="activator"
                  small
                  @click="updateRoleStatus(props.item)"
                  color="red"
                >
                  remove_circle
                </v-icon>

                <span>停用</span>
              </v-tooltip>

              <v-tooltip
                v-if="props.item.editable && props.item.status === 0"
                top>
                <v-icon
                  slot="activator"
                  small
                  color="red"
                  @click="updateRoleStatus(props.item)"
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
      v-model="showAddRoleDialog"
      max-width="600px">

      <v-card>
        <v-card-title>新增角色</v-card-title>

        <v-card-text>
          <v-container grid-list-lg>
            <v-form ref="addRoleForm">
              <v-layout row justify-start>
                <v-flex xs4>
                  <v-text-field
                    v-model="newRoleName"
                    label="角色名"
                    :rules="roleNameRules"
                    :disabled="roleInEdit.editable === 0"
                    required
                  />
                </v-flex>

                <v-flex xs4>
                  <v-text-field
                    v-model="newRoleDetail"
                    :disabled="roleInEdit.editable === 0"
                    label="备注"
                  />
                </v-flex>

                <v-flex xs4>
                  <v-select
                    v-model="newRoleStatus"
                    :items="roleStatusList"
                    label="立即启用"
                    :disabled="roleInEdit.editable === 0"
                    required
                  ></v-select>
                </v-flex>
              </v-layout>

              <v-card>
                <v-card-title class="body-1">权限设置</v-card-title>

                <v-card-text style="height: 300px;">
                  <v-treeview
                    v-model="newRoleAccess"
                    :items="accessPoints"
                    item-key="name"
                    item-text="title"
                    open-all
                    selectable
                  />
                </v-card-text>
              </v-card>
            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" flat @click="closeAddRole">取消</v-btn>
          <v-btn color="blue darken-1" flat @click="addRole">确定</v-btn>
        </v-card-actions>
      </v-card>

    </v-dialog>

    <v-dialog
      persistent
      v-model="showEditRoleDialog"
      max-width="600px">

      <v-card>
        <v-card-title>修改角色信息</v-card-title>

        <v-card-text>
          <v-container grid-list-lg>
            <v-form ref="editRoleForm">
              <v-layout row justify-start>
                <v-flex xs4>
                  <v-text-field
                    v-model="roleInEdit.name"
                    label="角色名"
                    :rules="roleNameRules"
                    required
                  />
                </v-flex>

                <v-flex xs4>
                  <v-text-field
                    v-model="roleInEdit.detail"
                    label="备注"
                  />
                </v-flex>

                <v-flex xs4>
                  <v-select
                    v-model="roleInEdit.statusName"
                    :items="roleStatusList"
                    label="是否启用"
                    required
                  ></v-select>
                </v-flex>
              </v-layout>

              <v-card>
                <v-card-title class="body-1">权限设置</v-card-title>

                <v-card-text style="height: 300px;">
                  <v-treeview
                    v-model="roleInEdit.accessNames"
                    :items="accessPoints"
                    item-key="name"
                    item-text="title"
                    open-all
                    selectable
                  />
                </v-card-text>
              </v-card>
            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" flat @click="closeEditRole">取消</v-btn>
          <v-btn color="blue darken-1" flat @click="updateRole">确定</v-btn>
        </v-card-actions>
      </v-card>

    </v-dialog>

    <GlobalProcess :value="blocking" />

  </v-container>
</template>

<script>
import { getRoles, updateRoleStatus, getAuthPoints, addRole, updateRole } from '@/api/auth'
import { hasOneOf } from '@/libs/tools'

export default {
  name: 'RoleMgr',
  data () {
    return {
      blocking: false,
      headers: [
        {
          text: '角色名',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        {
          text: '备注',
          align: 'left',
          sortable: false,
          value: 'detail'
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
      loading: false,

      // 检索
      inputName: null,
      usedName: null,

      roleNameRules: [
        v => (!!v && v.trim().length > 0) || '角色名不能为空'
      ],
      roleStatusList: ['启用', '停用'],
      accessPoints: [],

      // 新增角色
      showAddRoleDialog: false,
      newRoleName: null,
      newRoleDetail: null,
      newRoleStatus: '启用',
      newRoleAccess: [],

      // 修改角色信息
      showEditRoleDialog: false,
      roleInEdit: {}
    }
  },
  methods: {
    updateContents () {
      this.loading = true

      getRoles(this.usedName).then(res => {
        const data = res.data
        if (data.success) {
          this.contents = data.contents
        } else this.$toast.error('获取角色信息失败: ' + data.message)
      }).catch(err => {
        this.$toast.error('获取角色信息请求错误: ' + err)
      }).finally(() => {
        this.loading = false
      })
    },
    search () {
      this.usedName = this.inputName

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
    updateRoleStatus (item) {
      this.loading = true
      const status = item.status === 0 ? 1 : 0
      updateRoleStatus(item.id, status).then(res => {
        const data = res.data
        if (data.success) {
          const content = data.content
          this.updateOneContent(content)
        } else this.$toast.error('修改角色状态失败: ' + data.message)
      }).catch(err => {
        this.$toast.error('修改角色状态错误: ' + err)
      }).finally(() => {
        this.loading = false
      })
    },
    updateAccessPoints () {
      return new Promise((resolve, reject) => {
        getAuthPoints().then(res => {
          const data = res.data
          if (data.success) {
            this.accessPoints = data.contents
            resolve(data)
          } else {
            this.$toast.error('获取权限列表失败: ' + data.message)
            reject(data.message)
          }
        }).catch(error => {
          this.$toast.error('获取权限列表错误: ' + error)
          reject(error)
        })
      })
    },
    showAddRole () {
      this.updateAccessPoints().then(() => {
        this.newRoleName = null
        this.newRoleDetail = null
        this.newRoleStatus = '启用'
        this.newRoleAccess = []

        this.showAddRoleDialog = true
      })
    },
    closeAddRole () {
      this.showAddRoleDialog = false
    },
    addRole () {
      if (this.$refs.addRoleForm.validate()) {
        const access = this.parseRoleAccess(this.accessPoints, this.newRoleAccess)
        const status = this.newRoleStatus === '启用' ? 1 : 0

        this.blocking = true

        addRole(this.newRoleName, this.newRoleDetail, access, status).then(res => {
          const data = res.data
          if (data.success) {
            this.closeAddRole()
            this.updateContents()
          } else this.$toast.error('添加角色失败: ' + data.message)
        }).catch(error => {
          this.$toast.error('添加角色错误: ' + error)
        }).finally(() => {
          this.blocking = false
        })
      }
    },
    parseRoleAccess (accessPoints, selected) {
      let contents = []
      for (let i = 0; i < accessPoints.length; i++) {
        const ap = accessPoints[i]
        if (ap.children.length > 0) {
          let childrenCounts = this.parseRoleAccess(ap.children, selected)
          contents = contents.concat(childrenCounts)

          if (childrenCounts.length > 0) {
            contents = contents.concat(ap.contents)
          }
        } else {
          if (selected.includes(ap.name)) {
            contents = contents.concat(ap.contents)
          }
        }
      }
      return contents
    },
    readAccessNames (accessPoints, access) {
      let names = []
      for (let i = 0; i < accessPoints.length; i++) {
        const ap = accessPoints[i]
        if (ap.children.length > 0) {
          let childNames = this.readAccessNames(ap.children, access)
          names = names.concat(childNames)

          if (childNames.length >= ap.children.length) {
            names.push(ap.name)
          }
        } else {
          if (ap.contents && ap.contents.length > 0 && hasOneOf(access, ap.contents)) {
            names.push(ap.name)
          }
        }
      }

      return names
    },
    openEditRole (item) {
      this.updateAccessPoints().then(() => {
        this.roleInEdit = Object.assign({}, item)
        this.roleInEdit.accessNames = this.readAccessNames(this.accessPoints, this.roleInEdit.access)

        this.showEditRoleDialog = true
      })
    },
    closeEditRole () {
      this.showEditRoleDialog = false
    },
    updateRole () {
      if (this.$refs.editRoleForm.validate()) {
        this.roleInEdit.access = this.parseRoleAccess(this.accessPoints, this.roleInEdit.accessNames)
        this.roleInEdit.status = this.roleInEdit.statusName === '启用' ? 1 : 0

        this.blocking = true

        updateRole(this.roleInEdit).then(res => {
          const data = res.data
          if (data.success) {
            const content = data.content
            this.closeEditRole()
            this.updateOneContent(content)
          } else this.$toast.error('修改角色信息错误: ' + data.message)
        }).catch(error => {
          this.$toast.error('修改角色信息错误: ' + error)
        }).finally(() => {
          this.blocking = false
        })
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.updateContents()
    })
  }
}
</script>

<style scoped>

</style>
