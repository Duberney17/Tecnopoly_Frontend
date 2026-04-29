<template>
  <v-app>
    <!-- Sidebar -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      :width="260"
      class="sidebar-gaming"
    >
      <!-- Logo / Header -->
      <div class="sidebar-header pa-4" :class="{ 'px-2': rail }">
        <div v-if="!rail" class="d-flex align-center gap-3">
          <div class="logo-icon">
            <v-icon size="28" color="primary">mdi-controller-classic</v-icon>
          </div>
          <div>
            <div class="logo-title">TECNOPOLY</div>
            <div class="logo-sub">Panel de Control</div>
          </div>
          <v-spacer />
          <v-btn
            icon="mdi-chevron-left"
            variant="text"
            size="small"
            color="primary"
            @click="rail = true"
          />
        </div>
        <div v-else class="d-flex flex-column align-center gap-2 py-1">
          <div class="logo-icon-sm">
            <v-icon size="22" color="primary">mdi-controller-classic</v-icon>
          </div>
          <v-btn
            icon="mdi-chevron-right"
            variant="text"
            size="x-small"
            color="primary"
            @click="rail = false"
          />
        </div>
      </div>

      <div class="sidebar-divider mx-3" />

      <!-- Role badge -->
      <div v-if="!rail" class="px-4 py-3">
        <v-chip
          :color="authStore.isAdmin ? 'warning' : 'success'"
          size="small"
          variant="elevated"
          prepend-icon="mdi-shield-account"
          class="font-weight-bold"
        >
          {{ authStore.isAdmin ? 'Administrador' : 'Profesor' }}
        </v-chip>
      </div>

      <!-- Nav items -->
      <v-list density="compact" nav class="px-2 mt-1">
        <v-list-item
          v-for="item in navItems"
          :key="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
          rounded="lg"
          class="nav-item mb-1"
          :class="{ 'nav-item-active': route.path.startsWith(item.to) && (item.to !== '/dashboard' || route.path === '/dashboard') }"
          active-class="nav-item-active"
        />
      </v-list>

      <template #append>
        <div class="sidebar-divider mx-3 mb-1" />
        <!-- User info -->
        <div v-if="!rail" class="user-card mx-3 mb-2 pa-3">
          <div class="d-flex align-center gap-2">
            <v-avatar color="primary" size="32" class="user-avatar">
              <span class="text-caption font-weight-bold text-background">
                {{ authStore.user?.name?.charAt(0)?.toUpperCase() }}
              </span>
            </v-avatar>
            <div class="user-info">
              <div class="user-name">{{ authStore.user?.name }}</div>
              <div class="user-email">{{ authStore.user?.email }}</div>
            </div>
          </div>
        </div>
        <v-list density="compact" nav class="px-2 pb-3">
          <v-list-item
            prepend-icon="mdi-logout"
            title="Cerrar sesión"
            rounded="lg"
            class="logout-item"
            @click="handleLogout"
          />
        </v-list>
      </template>
    </v-navigation-drawer>

    <!-- Top bar -->
    <v-app-bar elevation="0" class="topbar-gaming" height="64">
      <template #prepend>
        <div class="topbar-title ml-4">
          <span class="page-title">{{ currentPageTitle }}</span>
          <div class="title-underline" />
        </div>
      </template>
      <template #append>
        <div class="mr-4 d-flex align-center gap-3">
          <div class="status-dot" />
          <span class="status-text text-success text-caption">Sistema activo</span>
        </div>
      </template>
    </v-app-bar>

    <!-- Main content -->
    <v-main class="main-gaming">
      <v-container fluid class="pa-6">
        <slot />
      </v-container>
    </v-main>

    <!-- Global snackbar -->
    <AppSnackbar />
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useRoleNav } from '~/composables/useRoleNav'

const authStore = useAuthStore()
authStore.loadFromStorage()

const { navItems } = useRoleNav()
const router = useRouter()
const route = useRoute()

const drawer = ref(true)
const rail = ref(false)

const currentPageTitle = computed(() => {
  const matched = navItems.value.find(
    (item) => route.path.startsWith(item.to) && item.to !== '/dashboard',
  ) ?? navItems.value.find((item) => item.to === '/dashboard')
  return matched?.title ?? 'Dashboard'
})

async function handleLogout() {
  authStore.logout()
  await router.push('/login')
}
</script>

<style scoped>
/* ── Sidebar ───────────────────────────────── */
.sidebar-gaming {
  background: linear-gradient(180deg, #0D1321 0%, #111827 100%) !important;
  border-right: 1px solid rgba(0, 229, 255, 0.12) !important;
}

.sidebar-header {
  background: rgba(0, 229, 255, 0.04);
}

.logo-icon {
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.15), rgba(124, 77, 255, 0.15));
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 10px;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-icon-sm {
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.15), rgba(124, 77, 255, 0.15));
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 8px;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-title {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 2px;
  color: #00E5FF;
  text-shadow: 0 0 12px rgba(0, 229, 255, 0.5);
}

.logo-sub {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.sidebar-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.2), transparent);
  margin-bottom: 4px;
}

/* Nav items */
.nav-item {
  color: rgba(255, 255, 255, 0.6) !important;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: rgba(0, 229, 255, 0.08) !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.nav-item-active {
  background: linear-gradient(90deg, rgba(0, 229, 255, 0.15), rgba(124, 77, 255, 0.08)) !important;
  border: 1px solid rgba(0, 229, 255, 0.2) !important;
  color: #00E5FF !important;
}

/* Aumentar separación entre iconos y texto en los elementos de la barra lateral */
.nav-item .v-list-item__icon,
.logout-item .v-list-item__icon {
  margin-right: 12px !important;
  min-width: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.nav-item .v-list-item__content,
.logout-item .v-list-item__content {
  gap: 10px;
  align-items: center;
}

/* Asegurar separación en la tarjeta de usuario */
.user-card .user-avatar {
  margin-right: 10px;
}

/* User card */
.user-card {
  background: rgba(0, 229, 255, 0.05);
  border: 1px solid rgba(0, 229, 255, 0.1);
  border-radius: 10px;
}

.user-avatar {
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.3);
}

.user-name {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 130px;
}

.user-email {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 130px;
}

.user-info {
  min-width: 0;
}

.logout-item {
  color: rgba(255, 100, 100, 0.7) !important;
}

.logout-item:hover {
  background: rgba(255, 23, 68, 0.1) !important;
  color: #FF1744 !important;
}

/* ── Top bar ───────────────────────────────── */
.topbar-gaming {
  background: rgba(11, 14, 26, 0.95) !important;
  border-bottom: 1px solid rgba(0, 229, 255, 0.1) !important;
  backdrop-filter: blur(10px);
}

.page-title {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.5px;
}

.title-underline {
  width: 32px;
  height: 2px;
  background: linear-gradient(90deg, #00E5FF, transparent);
  border-radius: 2px;
  margin-top: 2px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #00E676;
  box-shadow: 0 0 6px rgba(0, 230, 118, 0.8);
  animation: pulse-status 2s infinite;
}

.status-text {
  letter-spacing: 0.5px;
}

@keyframes pulse-status {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* ── Main ───────────────────────────────── */
.main-gaming {
  background: #0A0E1A !important;
}
</style>
