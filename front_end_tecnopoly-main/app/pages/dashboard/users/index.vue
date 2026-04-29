<template>
  <div>
    <!-- Header -->
    <div class="page-header mb-7">
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center gap-3">
          <div class="page-icon">
            <v-icon size="22" color="primary">mdi-account-group</v-icon>
          </div>
          <div>
            <h1 class="page-title">Usuarios</h1>
            <p class="page-sub">Gestión de administradores y profesores</p>
          </div>
        </div>
        <v-btn
          prepend-icon="mdi-plus"
          class="btn-neon"
          rounded="lg"
          @click="openCreate"
        >
          Nuevo Usuario
        </v-btn>
      </div>
    </div>

    <!-- Filters -->
    <div class="gaming-card mb-4 pa-4">
      <v-row dense align="center">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="search"
            placeholder="Buscar por nombre o correo..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            rounded="lg"
            hide-details
            clearable
            class="field-gaming"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="filterRole"
            :items="roleOptions"
            placeholder="Todos los roles"
            variant="outlined"
            density="compact"
            rounded="lg"
            hide-details
            clearable
            class="field-gaming"
          />
        </v-col>
        <v-col cols="12" md="2" class="text-right">
          <span class="count-badge">{{ filteredUsers.length }} usuarios</span>
        </v-col>
      </v-row>
    </div>

    <!-- Table -->
    <div class="gaming-card">
      <v-data-table
        :headers="headers"
        :items="filteredUsers"
        :loading="loading"
        loading-text="Cargando usuarios..."
        no-data-text="No hay usuarios registrados"
        items-per-page-text="Filas por página"
        class="gaming-table"
      >
        <template #item.name="{ item }">
          <div class="d-flex align-center gap-3">
            <v-avatar :color="item.role === 'admin' ? 'warning' : 'success'" size="32" class="user-av">
              <span class="text-caption font-weight-bold">{{ item.name.charAt(0).toUpperCase() }}</span>
            </v-avatar>
            <span class="user-name-cell">{{ item.name }}</span>
          </div>
        </template>
        <template #item.email="{ item }">
          <span class="email-cell">{{ item.email }}</span>
        </template>
        <template #item.role="{ item }">
          <v-chip
            :color="item.role === 'admin' ? 'warning' : 'success'"
            size="small"
            variant="tonal"
            class="role-chip"
          >
            <v-icon start size="12">{{ item.role === 'admin' ? 'mdi-shield-crown' : 'mdi-account-tie' }}</v-icon>
            {{ item.role === 'admin' ? 'Administrador' : 'Profesor' }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex gap-1 justify-center">
            <v-btn icon="mdi-pencil" variant="text" size="small" color="primary" class="action-btn" @click="openEdit(item)" />
            <v-btn icon="mdi-delete" variant="text" size="small" color="error" class="action-btn" @click="confirmDelete(item)" />
          </div>
        </template>
      </v-data-table>
    </div>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="500" persistent>
      <div class="dialog-gaming">
        <div class="dialog-header">
          <v-icon color="primary" class="mr-2">{{ editing ? 'mdi-account-edit' : 'mdi-account-plus' }}</v-icon>
          <span>{{ editing ? 'Editar Usuario' : 'Nuevo Usuario' }}</span>
        </div>
        <div class="dialog-body">
          <v-form ref="formRef" @submit.prevent="saveUser">
            <label class="field-label">Nombre completo</label>
            <v-text-field
              v-model="form.name"
              variant="outlined"
              rounded="lg"
              :rules="[rules.required, rules.minLen(2)]"
              class="mb-3 field-gaming"
              placeholder="Ej: Juan Pérez"
            />
            <label class="field-label">Correo electrónico</label>
            <v-text-field
              v-model="form.email"
              type="email"
              variant="outlined"
              rounded="lg"
              :rules="[rules.required, rules.email]"
              class="mb-3 field-gaming"
              placeholder="usuario@ejemplo.com"
            />
            <label class="field-label">{{ editing ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña' }}</label>
            <v-text-field
              v-model="form.password"
              type="password"
              variant="outlined"
              rounded="lg"
              :rules="editing ? [] : [rules.required, rules.minLen(6)]"
              class="mb-3 field-gaming"
              placeholder="••••••••"
            />
            <label class="field-label">Rol del usuario</label>
            <v-select
              v-model="form.role"
              :items="roleOptions"
              variant="outlined"
              rounded="lg"
              :rules="[rules.required]"
              class="field-gaming"
            />
          </v-form>
        </div>
        <div class="dialog-actions">
          <v-btn variant="text" rounded="lg" color="rgba(255,255,255,0.5)" @click="dialog = false">Cancelar</v-btn>
          <v-btn rounded="lg" :loading="saving" class="btn-neon" @click="saveUser">
            {{ editing ? 'Guardar Cambios' : 'Crear Usuario' }}
          </v-btn>
        </div>
      </div>
    </v-dialog>

    <!-- Confirm Delete -->
    <AppConfirmDialog
      v-model="confirmDialog"
      title="Eliminar usuario"
      :message="`¿Seguro que deseas eliminar a ${selectedUser?.name}? Esta acción no se puede deshacer.`"
      :loading="deleting"
      @confirm="deleteUser"
      @cancel="confirmDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'
import { useSnackbarStore } from '~/stores/snackbar'

definePageMeta({ layout: 'dashboard', middleware: 'admin-only' })

const api = useApi()
const snackbar = useSnackbarStore()

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'profesor'
}

const users = ref<User[]>([])
const loading = ref(false)
const dialog = ref(false)
const confirmDialog = ref(false)
const saving = ref(false)
const deleting = ref(false)
const editing = ref(false)
const selectedUser = ref<User | null>(null)
const formRef = ref()
const search = ref('')
const filterRole = ref<string | null>(null)

const form = reactive({ name: '', email: '', password: '', role: '' })

const headers = [
  { title: 'Nombre', key: 'name', sortable: true },
  { title: 'Correo', key: 'email', sortable: true },
  { title: 'Rol', key: 'role', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'center' as const },
]

const roleOptions = [
  { title: 'Administrador', value: 'admin' },
  { title: 'Profesor', value: 'profesor' },
]

const rules = {
  required: (v: string) => !!v || 'Campo requerido',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Correo inválido',
  minLen: (n: number) => (v: string) => (v && v.length >= n) || `Mínimo ${n} caracteres`,
}

const filteredUsers = computed(() =>
  users.value.filter((u) => {
    const matchSearch = !search.value || u.name.toLowerCase().includes(search.value.toLowerCase()) || u.email.toLowerCase().includes(search.value.toLowerCase())
    const matchRole = !filterRole.value || u.role === filterRole.value
    return matchSearch && matchRole
  })
)

async function loadUsers() {
  loading.value = true
  try {
    users.value = await api.get<User[]>('/users')
  } catch (e: any) {
    snackbar.error(e?.message ?? 'Error al cargar usuarios')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editing.value = false
  Object.assign(form, { name: '', email: '', password: '', role: '' })
  dialog.value = true
}

function openEdit(user: User) {
  editing.value = true
  selectedUser.value = user
  Object.assign(form, { name: user.name, email: user.email, password: '', role: user.role })
  dialog.value = true
}

async function saveUser() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  saving.value = true
  try {
    if (editing.value && selectedUser.value) {
      const payload: any = { name: form.name, email: form.email, role: form.role }
      if (form.password) payload.password = form.password
      await api.patch(`/users/${selectedUser.value.id}`, payload)
      snackbar.success('Usuario actualizado correctamente')
    } else {
      await api.post('/users', { name: form.name, email: form.email, password: form.password, role: form.role })
      snackbar.success('Usuario creado correctamente')
    }
    dialog.value = false
    await loadUsers()
  } catch (e: any) {
    snackbar.error(e?.message ?? 'Error al guardar usuario')
  } finally {
    saving.value = false
  }
}

function confirmDelete(user: User) {
  selectedUser.value = user
  confirmDialog.value = true
}

async function deleteUser() {
  if (!selectedUser.value) return
  deleting.value = true
  try {
    await api.del(`/users/${selectedUser.value.id}`)
    snackbar.success('Usuario eliminado')
    confirmDialog.value = false
    await loadUsers()
  } catch (e: any) {
    snackbar.error(e?.message ?? 'Error al eliminar usuario')
  } finally {
    deleting.value = false
  }
}

onMounted(loadUsers)
</script>

<style scoped>
/* ── Header ─────────────────────────────────── */
.page-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, rgba(0,229,255,0.12), rgba(124,77,255,0.1));
  border: 1px solid rgba(0,229,255,0.25);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-title {
  font-size: 20px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.5px;
  line-height: 1.2;
}

.page-sub {
  font-size: 12px;
  color: rgba(255,255,255,0.35);
  margin: 0;
}

/* ── Neon button ────────────────────────────── */
.btn-neon {
  background: linear-gradient(135deg, rgba(0,229,255,0.2), rgba(0,184,212,0.2)) !important;
  border: 1px solid rgba(0,229,255,0.4) !important;
  color: #00E5FF !important;
  font-weight: 700 !important;
  letter-spacing: 0.5px;
  transition: all 0.2s ease !important;
}

.btn-neon:hover {
  background: linear-gradient(135deg, rgba(0,229,255,0.3), rgba(0,184,212,0.3)) !important;
  box-shadow: 0 0 20px rgba(0,229,255,0.25) !important;
}

/* ── Cards ──────────────────────────────────── */
.gaming-card {
  background: rgba(17,24,39,0.85);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
}

/* ── Table ──────────────────────────────────── */
.gaming-table {
  background: transparent !important;
}

.user-name-cell {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255,255,255,0.88);
}

.email-cell {
  font-size: 13px;
  color: rgba(255,255,255,0.45);
}

.user-av {
  box-shadow: 0 0 8px rgba(0,229,255,0.2);
}

.role-chip {
  font-weight: 600 !important;
  font-size: 11px !important;
  letter-spacing: 0.3px;
}

.action-btn {
  opacity: 0.7;
  transition: opacity 0.2s, transform 0.2s;
}
.action-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

/* ── Count badge ────────────────────────────── */
.count-badge {
  font-size: 11px;
  color: rgba(0,229,255,0.6);
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* ── Field label ────────────────────────────── */
.field-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
  color: rgba(255,255,255,0.45);
  text-transform: uppercase;
  display: block;
  margin-bottom: 6px;
}

/* ── Dialog ─────────────────────────────────── */
.dialog-gaming {
  background: #111827;
  border: 1px solid rgba(0,229,255,0.15);
  border-radius: 16px;
  overflow: hidden;
}

.dialog-header {
  display: flex;
  align-items: center;
  padding: 20px 24px 16px;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  background: rgba(0,229,255,0.04);
}

.dialog-body {
  padding: 20px 24px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 24px 20px;
  border-top: 1px solid rgba(255,255,255,0.06);
}
</style>
