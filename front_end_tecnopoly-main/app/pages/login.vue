<template>
  <div class="login-root">
    <!-- Fondo animado con grid -->
    <div class="grid-bg" />
    <div class="glow-orb glow-1" />
    <div class="glow-orb glow-2" />

    <v-container fluid class="fill-height">
      <v-row align="center" justify="center" class="fill-height">
        <v-col cols="12" sm="10" md="10" lg="10" xl="8">
          <!-- Card principal -->
          <div class="login-card">
            <div class="login-hero">
              <div class="hero-overlay" />
              <div class="hero-copy">
                <div class="hero-kicker">Tecnopoly</div>
                <div class="hero-title">Videojuegos educativos</div>
                <div class="hero-text">
                  Accede al panel para administrar usuarios, materias y evaluaciones.
                </div>
              </div>
            </div>

            <div class="login-form-panel">
              <div class="login-header text-center mb-6">
                <div class="controller-icon mx-auto mb-4">
                  <v-icon size="36" color="primary">mdi-controller-classic</v-icon>
                </div>
                <div class="game-title">TECNOPOLY</div>
                <div class="game-subtitle">Panel de Administración</div>
              </div>

              <!-- Alert de error -->
              <v-alert
                v-if="errorMsg"
                type="error"
                variant="tonal"
                rounded="lg"
                class="mb-5"
                closable
                border="start"
                @click:close="errorMsg = ''"
              >
                {{ errorMsg }}
              </v-alert>

              <!-- Formulario -->
              <v-form ref="formRef" @submit.prevent="handleLogin">
                <label class="field-label">Correo electrónico</label>
                <v-text-field
                  v-model="form.email"
                  type="email"
                  prepend-inner-icon="mdi-email-outline"
                  variant="outlined"
                  rounded="lg"
                  :rules="[rules.required, rules.email]"
                  class="mb-3 field-gaming"
                  autofocus
                  placeholder="usuario@ejemplo.com"
                />

                <label class="field-label">Contraseña</label>
                <v-text-field
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  variant="outlined"
                  rounded="lg"
                  :rules="[rules.required]"
                  class="mb-5 field-gaming"
                  placeholder="••••••••"
                  @click:append-inner="showPassword = !showPassword"
                />

                <v-btn
                  type="submit"
                  size="large"
                  block
                  rounded="lg"
                  :loading="loading"
                  class="login-btn"
                >
                  <v-icon start>mdi-login-variant</v-icon>
                  Iniciar Sesión
                </v-btn>
              </v-form>

              <!-- Footer -->
              <div class="text-center mt-5">
                <span class="footer-text">Sistema educativo · </span>
                <span class="footer-brand">Tecnopoly v1.0</span>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'auth' })

const authStore = useAuthStore()
const api = useApi()
const router = useRouter()

const formRef = ref()
const loading = ref(false)
const errorMsg = ref('')
const showPassword = ref(false)

const form = reactive({ email: '', password: '' })

const rules = {
  required: (v: string) => !!v || 'Campo requerido',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Correo inválido',
}

async function handleLogin() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  errorMsg.value = ''
  try {
    const data = await api.post<{ access_token: string; user: any }>('/auth/login', {
      email: form.email,
      password: form.password,
    })
    authStore.setAuth(data.access_token, data.user)

    if (authStore.isAdmin) {
      await router.push('/dashboard')
    } else {
      await router.push('/dashboard/my-subjects')
    }
  } catch (e: any) {
    errorMsg.value = e?.message ?? 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* ── Fondo ─────────────────────────────────── */
.login-root {
  min-height: 100vh;
  background: #0A0E1A;
  position: relative;
  overflow: hidden;
}

.grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 229, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 229, 255, 0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}

.glow-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  left: -100px;
  background: radial-gradient(circle, rgba(0, 229, 255, 0.12), transparent 70%);
}

.glow-2 {
  width: 350px;
  height: 350px;
  bottom: -80px;
  right: -80px;
  background: radial-gradient(circle, rgba(124, 77, 255, 0.12), transparent 70%);
}

/* ── Card ───────────────────────────────────── */
.login-card {
  display: grid;
  grid-template-columns: minmax(360px, 1.3fr) minmax(300px, 0.7fr);
  overflow: hidden;
  background: rgba(17, 24, 39, 0.85);
  border: 1px solid rgba(0, 229, 255, 0.15);
  border-radius: 20px;
  backdrop-filter: blur(21px);
  box-shadow:
    0 0 0 1px rgba(0, 229, 255, 0.05),
    0 25px 50px rgba(0, 0, 0, 0.5),
    0 0 60px rgba(0, 229, 255, 0.06);
}

.login-hero {
  min-height: 620px;
  position: relative;
  background:
    linear-gradient(180deg, rgba(5, 12, 26, 0.1), rgba(5, 12, 26, 0.82)),
    url('/login-hero.jpg.png') center top / cover no-repeat;
}chatgpt

.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(0, 229, 255, 0.18), transparent 28%),
    radial-gradient(circle at 80% 20%, rgba(124, 77, 255, 0.16), transparent 25%),
    linear-gradient(135deg, rgba(3, 8, 20, 0.15), rgba(3, 8, 20, 0.55));
}

.hero-copy {
  position: absolute;
  inset: auto 0 0 0;
  padding: 32px;
  color: #fff;
  z-index: 1;
}

.hero-kicker {
  display: inline-block;
  margin-bottom: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(0, 229, 255, 0.12);
  color: #7ff6ff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.hero-title {
  max-width: 360px;
  font-size: 32px;
  line-height: 1.05;
  font-weight: 900;
  letter-spacing: 1px;
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
}

.hero-text {
  max-width: 320px;
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 14px;
  line-height: 1.55;
}

.login-form-panel {
  padding: 34px 28px 26px;
}

/* ── Header ─────────────────────────────────── */
.controller-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.12), rgba(124, 77, 255, 0.12));
  border: 1px solid rgba(0, 229, 255, 0.25);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.15);
}

.game-title {
  font-size: 26px;
  font-weight: 900;
  letter-spacing: 5px;
  color: #00E5FF;
  text-shadow: 0 0 20px rgba(0, 229, 255, 0.5);
}

.game-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-top: 4px;
}

/* ── Campos ─────────────────────────────────── */
.field-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  display: block;
  margin-bottom: 6px;
}

/* ── Botón login ────────────────────────────── */
.login-btn {
  background: linear-gradient(135deg, #00B8D4, #0097A7) !important;
  color: #fff !important;
  font-weight: 700 !important;
  letter-spacing: 1px !important;
  box-shadow: 0 4px 20px rgba(0, 229, 255, 0.3) !important;
  transition: all 0.3s ease !important;
}

.login-btn:hover {
  box-shadow: 0 6px 28px rgba(0, 229, 255, 0.5) !important;
  transform: translateY(-1px);
}

/* ── Footer ─────────────────────────────────── */
.footer-text {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.25);
}

.footer-brand {
  font-size: 11px;
  color: rgba(0, 229, 255, 0.5);
  font-weight: 600;
}

@media (max-width: 960px) {
  .login-card {
    grid-template-columns: 1fr;
  }

  .login-hero {
    min-height: 300px;
  }
}

@media (max-width: 600px) {
  .login-form-panel {
    padding: 28px 20px 22px;
  }

  .hero-copy {
    padding: 22px;
  }

  .hero-title {
    font-size: 24px;
  }
}
</style>
