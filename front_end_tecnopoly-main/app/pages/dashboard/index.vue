<template>
  <div>
    <!-- Saludo -->
    <div class="welcome-section mb-7">
      <div class="d-flex align-center gap-3 mb-1">
        <v-icon color="primary" size="22">mdi-gamepad-variant</v-icon>
        <h1 class="welcome-title">Bienvenido, <span class="name-highlight">{{ authStore.user?.name }}</span></h1>
      </div>
      <p class="welcome-sub">Panel de administración · Tecnopoly</p>
    </div>

    <!-- Stats cards -->
    <v-row class="mb-2">
      <v-col v-for="card in statsCards" :key="card.title" cols="12" sm="6" md="3">
        <v-card :to="card.to" class="stat-card" elevation="0">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="stat-icon-wrap" :style="{ '--c': card.color }">
                <v-icon size="22" :color="card.color">{{ card.icon }}</v-icon>
              </div>
              <v-icon size="16" color="rgba(255,255,255,0.2)">mdi-arrow-top-right</v-icon>
            </div>
            <div class="stat-value">{{ card.value }}</div>
            <div class="stat-label">{{ card.title }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Acciones rápidas -->
    <div class="section-header mt-8 mb-4">
      <v-icon color="primary" size="18" class="mr-2">mdi-lightning-bolt</v-icon>
      <span class="section-title">Acciones Rápidas</span>
    </div>

    <v-row>
      <v-col v-for="action in quickActions" :key="action.title" cols="12" sm="6" md="4">
        <v-card :to="action.to" class="action-card" elevation="0">
          <v-card-text class="pa-4">
            <div class="d-flex align-center gap-4">
              <div class="action-icon-wrap">
                <v-icon size="22" color="primary">{{ action.icon }}</v-icon>
              </div>
              <div>
                <div class="action-title">{{ action.title }}</div>
                <div class="action-sub">{{ action.subtitle }}</div>
              </div>
              <v-spacer />
              <v-icon size="18" color="rgba(0,229,255,0.4)">mdi-chevron-right</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const authStore = useAuthStore()
const api = useApi()

const counts = reactive({ users: 0, grades: 0, subjects: 0, questions: 0 })

const statsCards = computed(() => {
  if (authStore.isAdmin) {
    return [
      { title: 'Usuarios', value: counts.users, icon: 'mdi-account-group', color: '#00E5FF', to: '/dashboard/users' },
      { title: 'Grados', value: counts.grades, icon: 'mdi-school', color: '#FFD740', to: '/dashboard/grades' },
      { title: 'Materias', value: counts.subjects, icon: 'mdi-book-open-variant', color: '#00E676', to: '/dashboard/subjects' },
    ]
  }
  return [
    { title: 'Mis Materias', value: counts.subjects, icon: 'mdi-book-account', color: '#00E5FF', to: '/dashboard/my-subjects' },
  ]
})

const quickActions = computed(() => {
  if (authStore.isAdmin) {
    return [
      { title: 'Crear usuario', subtitle: 'Agregar admin o profesor', icon: 'mdi-account-plus', to: '/dashboard/users' },
      { title: 'Crear grado', subtitle: 'Nuevo grado escolar', icon: 'mdi-school', to: '/dashboard/grades' },
      { title: 'Crear materia', subtitle: 'Nueva materia', icon: 'mdi-book-plus', to: '/dashboard/subjects' },
    ]
  }
  return [
    { title: 'Ver mis materias', subtitle: 'Materias asignadas a ti', icon: 'mdi-book-account', to: '/dashboard/my-subjects' },
  ]
})

onMounted(async () => {
  try {
    if (authStore.isAdmin) {
      const [users, grades, subjects] = await Promise.all([
        api.get<any[]>('/users'),
        api.get<any[]>('/grades'),
        api.get<any[]>('/subjects'),
      ])
      counts.users = users.length
      counts.grades = grades.length
      counts.subjects = subjects.length
    } else {
      const subjects = await api.get<any[]>('/subjects')
      counts.subjects = subjects.length
    }
  } catch { /* silent */ }
})
</script>

<style scoped>
/* ── Welcome ───────────────────────────────── */
.welcome-section {
  border-left: 3px solid #00E5FF;
  padding-left: 16px;
}

.welcome-title {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.3px;
}

.name-highlight {
  color: #00E5FF;
  text-shadow: 0 0 12px rgba(0, 229, 255, 0.4);
}

.welcome-sub {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.5px;
  margin: 0;
}

/* ── Stat cards ────────────────────────────── */
.stat-card {
  background: rgba(17, 24, 39, 0.8) !important;
  border: 1px solid rgba(255, 255, 255, 0.07) !important;
  cursor: pointer;
  transition: all 0.25s ease;
  text-decoration: none;
}

.stat-card:hover {
  border-color: rgba(0, 229, 255, 0.25) !important;
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 229, 255, 0.06) !important;
}

.stat-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(var(--c-rgb, 0, 229, 255), 0.12), transparent);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-value {
  font-size: 32px;
  font-weight: 800;
  color: #fff;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: 0.5px;
}

/* ── Section header ────────────────────────── */
.section-header {
  display: flex;
  align-items: center;
}

.section-title {
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

/* ── Action cards ──────────────────────────── */
.action-card {
  background: rgba(17, 24, 39, 0.6) !important;
  border: 1px solid rgba(255, 255, 255, 0.06) !important;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.action-card:hover {
  background: rgba(0, 229, 255, 0.05) !important;
  border-color: rgba(0, 229, 255, 0.2) !important;
  transform: translateX(4px);
}

.action-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(0, 229, 255, 0.08);
  border: 1px solid rgba(0, 229, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.action-title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
}

.action-sub {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
  margin-top: 2px;
}
</style>
