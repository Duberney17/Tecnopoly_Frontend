<template>
  <div class="login-root">
    <!-- Fondo animado con grid -->
    <div class="grid-bg" />
    <div class="glow-orb glow-1" />
    <div class="glow-orb glow-2" />
    <div class="glow-orb glow-3" />

    <v-container fluid class="fill-height pa-0">
      <v-row align="center" justify="center" class="fill-height ma-0">
        <v-col cols="12" sm="12" md="12" lg="11" xl="10" class="pa-4">

          <!-- Card principal -->
          <div class="login-card">

            <!-- ── Panel izquierdo: imagen hero ── -->
            <div class="login-hero">

              <!-- Esquinas neón estilo HUD -->
              <div class="corner corner-tl" />
              <div class="corner corner-tr" />
              <div class="corner corner-bl" />
              <div class="corner corner-br" />

              <!-- Línea de escaneo animada -->
              <div class="scan-line" />

              <!-- Orbes de luz flotantes internos -->
              <div class="hero-orb orb-a" />
              <div class="hero-orb orb-b" />
              <div class="hero-orb orb-c" />

              <!-- Partículas flotantes -->
              <div class="particle p1" /><div class="particle p2" />
              <div class="particle p3" /><div class="particle p4" />
              <div class="particle p5" /><div class="particle p6" />
              <div class="particle p7" /><div class="particle p8" />

              <!-- Circuitos decorativos arriba -->
              <div class="circuit-top">
                <div class="ct-line ct-l1" />
                <div class="ct-line ct-l2" />
                <div class="ct-dot" />
                <div class="ct-dot ct-dot2" />
              </div>

              <!-- Circuitos decorativos abajo -->
              <div class="circuit-bot">
                <div class="cb-line cb-l1" />
                <div class="cb-line cb-l2" />
                <div class="cb-dot" />
                <div class="cb-dot cb-dot2" />
              </div>

              <!-- Imagen principal -->
              <img
                src="/chatgpt.png"
                alt="Tecnopoly"
                class="hero-img"
              />

              <!-- Fundidos de borde -->
              <div class="hero-fade-bottom" />
              <div class="hero-fade-right" />

              <!-- Badge flotante inferior -->
              <div class="hero-badge">
                <v-icon size="14" color="#00E5FF">mdi-controller-classic</v-icon>
                <span>Videojuegos Educativos</span>
              </div>

              <!-- Stats flotantes -->
              <div class="hero-stat stat-top">
                <v-icon size="13" color="#00E5FF">mdi-school-outline</v-icon>
                <span>+500 estudiantes</span>
              </div>
              <div class="hero-stat stat-right">
                <v-icon size="13" color="#7C4DFF">mdi-trophy-outline</v-icon>
                <span>Aprendizaje lúdico</span>
              </div>

            </div>

            <!-- ── Panel derecho: formulario ── -->
            <div class="login-form-panel">

              <!-- Logo / ícono -->
              <div class="login-header text-center mb-7">
                <div class="controller-icon mx-auto mb-4">
                  <v-icon size="38" color="primary">mdi-controller-classic</v-icon>
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
                  class="mb-6 field-gaming"
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
              <div class="text-center mt-6">
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
/* ── Fondo principal ────────────────────────── */
.login-root {
  min-height: 100vh;
  background: #0A0E1A;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 229, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 229, 255, 0.04) 1px, transparent 1px);
  background-size: 44px 44px;
  pointer-events: none;
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
}
.glow-1 {
  width: 500px; height: 500px;
  top: -150px; left: -150px;
  background: radial-gradient(circle, rgba(0, 229, 255, 0.13), transparent 70%);
}
.glow-2 {
  width: 400px; height: 400px;
  bottom: -100px; right: -100px;
  background: radial-gradient(circle, rgba(124, 77, 255, 0.13), transparent 70%);
}
.glow-3 {
  width: 300px; height: 300px;
  top: 50%; left: 40%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(0, 229, 255, 0.06), transparent 70%);
}

/* ── Card ───────────────────────────────────── */
.login-card {
  display: grid;
  grid-template-columns: 2.2fr 1fr;
  min-height: 640px;
  overflow: hidden;
  background: rgba(17, 24, 39, 0.90);
  border: 1px solid rgba(0, 229, 255, 0.18);
  border-radius: 24px;
  backdrop-filter: blur(24px);
  box-shadow:
    0 0 0 1px rgba(0, 229, 255, 0.06),
    0 30px 60px rgba(0, 0, 0, 0.55),
    0 0 80px rgba(0, 229, 255, 0.07);
}

/* ── Hero panel ─────────────────────────────── */
.login-hero {
  position: relative;
  overflow: hidden;
  min-height: 640px;
  border-right: 1px solid rgba(0, 229, 255, 0.12);
  background:
    radial-gradient(ellipse at 20% 10%, rgba(0, 180, 255, 0.18) 0%, transparent 45%),
    radial-gradient(ellipse at 80% 90%, rgba(124, 77, 255, 0.16) 0%, transparent 45%),
    radial-gradient(ellipse at 50% 50%, rgba(0, 60, 120, 0.25) 0%, transparent 70%),
    linear-gradient(170deg, #06101f 0%, #0b1e3a 40%, #06101f 100%);
}

/* Grid sutil dentro del hero */
.login-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 229, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 229, 255, 0.05) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
  z-index: 0;
}

/* Partículas estáticas de fondo */
.login-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(1.5px 1.5px at 12% 8%,  rgba(0,229,255,0.8)   0%, transparent 100%),
    radial-gradient(1px   1px   at 88% 12%, rgba(255,255,255,0.6)  0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 25% 88%, rgba(0,229,255,0.6)   0%, transparent 100%),
    radial-gradient(1px   1px   at 72% 92%, rgba(255,255,255,0.5)  0%, transparent 100%),
    radial-gradient(1px   1px   at 55% 5%,  rgba(124,77,255,0.7)  0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 92% 55%, rgba(0,229,255,0.5)   0%, transparent 100%),
    radial-gradient(1px   1px   at 8%  65%, rgba(255,255,255,0.4)  0%, transparent 100%),
    radial-gradient(1px   1px   at 40% 95%, rgba(124,77,255,0.6)  0%, transparent 100%),
    radial-gradient(1px   1px   at 60% 3%,  rgba(0,229,255,0.5)   0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 3%  45%, rgba(124,77,255,0.5)  0%, transparent 100%),
    radial-gradient(1px   1px   at 97% 78%, rgba(0,229,255,0.6)   0%, transparent 100%),
    radial-gradient(1px   1px   at 35% 4%,  rgba(255,255,255,0.4)  0%, transparent 100%);
  pointer-events: none;
  z-index: 0;
}

/* ── Esquinas neón estilo HUD ────────────────── */
.corner {
  position: absolute;
  width: 22px;
  height: 22px;
  z-index: 4;
  pointer-events: none;
}
.corner-tl { top: 14px; left: 14px; border-top: 2px solid rgba(0,229,255,0.7); border-left: 2px solid rgba(0,229,255,0.7); border-radius: 3px 0 0 0; }
.corner-tr { top: 14px; right: 14px; border-top: 2px solid rgba(0,229,255,0.7); border-right: 2px solid rgba(0,229,255,0.7); border-radius: 0 3px 0 0; }
.corner-bl { bottom: 14px; left: 14px; border-bottom: 2px solid rgba(124,77,255,0.7); border-left: 2px solid rgba(124,77,255,0.7); border-radius: 0 0 0 3px; }
.corner-br { bottom: 14px; right: 14px; border-bottom: 2px solid rgba(124,77,255,0.7); border-right: 2px solid rgba(124,77,255,0.7); border-radius: 0 0 3px 0; }

/* ── Línea de escaneo ────────────────────────── */
.scan-line {
  position: absolute;
  left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0,229,255,0.5), rgba(0,229,255,0.9), rgba(0,229,255,0.5), transparent);
  box-shadow: 0 0 12px rgba(0,229,255,0.6), 0 0 24px rgba(0,229,255,0.3);
  z-index: 4;
  pointer-events: none;
  animation: scanMove 4s ease-in-out infinite;
}
@keyframes scanMove {
  0%   { top: 0%;   opacity: 0; }
  5%   { opacity: 1; }
  95%  { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

/* ── Orbes flotantes internos ────────────────── */
.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  pointer-events: none;
  z-index: 0;
}
.orb-a {
  width: 180px; height: 180px;
  top: -60px; left: -40px;
  background: radial-gradient(circle, rgba(0,229,255,0.22), transparent 70%);
  animation: orbFloat 7s ease-in-out infinite;
}
.orb-b {
  width: 150px; height: 150px;
  bottom: -50px; right: 20px;
  background: radial-gradient(circle, rgba(124,77,255,0.22), transparent 70%);
  animation: orbFloat 9s ease-in-out infinite reverse;
}
.orb-c {
  width: 100px; height: 100px;
  top: 50%; left: 10%;
  background: radial-gradient(circle, rgba(0,180,255,0.15), transparent 70%);
  animation: orbFloat 6s ease-in-out infinite 2s;
}
@keyframes orbFloat {
  0%, 100% { transform: translateY(0px) scale(1); }
  50%       { transform: translateY(-18px) scale(1.08); }
}

/* ── Partículas flotantes animadas ───────────── */
.particle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
  animation: particleFloat linear infinite;
}
.p1 { width:4px; height:4px; top:8%;  left:10%; background:rgba(0,229,255,0.8); box-shadow:0 0 6px rgba(0,229,255,0.8); animation-duration:5s; animation-delay:0s; }
.p2 { width:3px; height:3px; top:15%; left:85%; background:rgba(255,255,255,0.7); animation-duration:7s; animation-delay:1s; }
.p3 { width:5px; height:5px; top:90%; left:20%; background:rgba(124,77,255,0.8); box-shadow:0 0 8px rgba(124,77,255,0.8); animation-duration:6s; animation-delay:2s; }
.p4 { width:3px; height:3px; top:88%; left:78%; background:rgba(0,229,255,0.6); animation-duration:8s; animation-delay:0.5s; }
.p5 { width:4px; height:4px; top:5%;  left:50%; background:rgba(124,77,255,0.7); box-shadow:0 0 6px rgba(124,77,255,0.6); animation-duration:6.5s; animation-delay:3s; }
.p6 { width:3px; height:3px; top:92%; left:50%; background:rgba(255,255,255,0.5); animation-duration:9s; animation-delay:1.5s; }
.p7 { width:4px; height:4px; top:10%; left:35%; background:rgba(0,229,255,0.6); animation-duration:7.5s; animation-delay:4s; }
.p8 { width:3px; height:3px; top:85%; left:90%; background:rgba(124,77,255,0.6); animation-duration:5.5s; animation-delay:2.5s; }
@keyframes particleFloat {
  0%   { transform: translateY(0) rotate(0deg);   opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(-30px) rotate(360deg); opacity: 0; }
}

/* ── Circuitos decorativos arriba ────────────── */
.circuit-top {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 52px;
  z-index: 2;
  pointer-events: none;
}
.ct-line { position: absolute; background: rgba(0,229,255,0.25); border-radius: 2px; }
.ct-l1   { top: 18px; left: 40px;  width: 80px; height: 1px; }
.ct-l2   { top: 18px; left: 120px; width: 1px;  height: 18px; }
.ct-dot  { position:absolute; width:5px; height:5px; border-radius:50%; background:rgba(0,229,255,0.7); box-shadow:0 0 8px rgba(0,229,255,0.8); top:16px; left:36px; animation: dotPulse 2s ease-in-out infinite; }
.ct-dot2 { position:absolute; width:4px; height:4px; border-radius:50%; background:rgba(0,229,255,0.5); top:35px; left:117px; animation: dotPulse 2s ease-in-out infinite 1s; }

/* ── Circuitos decorativos abajo ─────────────── */
.circuit-bot {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 52px;
  z-index: 2;
  pointer-events: none;
}
.cb-line { position: absolute; background: rgba(124,77,255,0.25); border-radius: 2px; }
.cb-l1   { bottom: 18px; right: 40px;  width: 80px; height: 1px; }
.cb-l2   { bottom: 18px; right: 120px; width: 1px;  height: 18px; }
.cb-dot  { position:absolute; width:5px; height:5px; border-radius:50%; background:rgba(124,77,255,0.8); box-shadow:0 0 8px rgba(124,77,255,0.8); bottom:16px; right:36px; animation: dotPulse 2.5s ease-in-out infinite; }
.cb-dot2 { position:absolute; width:4px; height:4px; border-radius:50%; background:rgba(124,77,255,0.5); bottom:35px; right:117px; animation: dotPulse 2.5s ease-in-out infinite 1.2s; }

@keyframes dotPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.6); }
}

/* ── Imagen principal ────────────────────────── */
.hero-img {
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center center;
  display: block;
  filter: brightness(1.05) saturate(1.1);
  transform: scale(1.0);
  transition: transform 0.6s ease;
  z-index: 1;
}
.login-hero:hover .hero-img {
  transform: scale(1.06);
}

/* ── Fundidos de borde ───────────────────────── */
.hero-fade-bottom {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 120px;
  background: linear-gradient(to top, rgba(17, 24, 39, 0.65), transparent);
  pointer-events: none;
  z-index: 2;
}
.hero-fade-right {
  position: absolute;
  top: 0; right: 0; bottom: 0;
  width: 60px;
  background: linear-gradient(to left, rgba(17, 24, 39, 0.50), transparent);
  pointer-events: none;
  z-index: 2;
}

/* ── Badge inferior ──────────────────────────── */
.hero-badge {
  position: absolute;
  bottom: 20px; left: 20px;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(10, 14, 26, 0.72);
  border: 1px solid rgba(0, 229, 255, 0.30);
  border-radius: 999px;
  padding: 6px 14px;
  backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.85);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* ── Stats flotantes ─────────────────────────── */
.hero-stat {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(10, 14, 26, 0.70);
  border: 1px solid rgba(0, 229, 255, 0.22);
  border-radius: 999px;
  padding: 5px 12px;
  backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.80);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  z-index: 4;
  pointer-events: none;
}
.stat-top {
  top: 18px; left: 50%;
  transform: translateX(-50%);
  border-color: rgba(0,229,255,0.28);
  animation: statFloatC 4s ease-in-out infinite;
}
.stat-right {
  top: 50%; right: 18px;
  transform: translateY(-50%);
  border-color: rgba(124,77,255,0.28);
  animation: statFloatR 4s ease-in-out infinite 2s;
}
@keyframes statFloatC {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50%       { transform: translateX(-50%) translateY(-5px); }
}
@keyframes statFloatR {
  0%, 100% { transform: translateY(-50%) translateX(0); }
  50%       { transform: translateY(-50%) translateX(-5px); }
}

/* ── Panel formulario ────────────────────────── */
.login-form-panel {
  padding: 42px 32px 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* ── Header ──────────────────────────────────── */
.controller-icon {
  width: 72px; height: 72px;
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.14), rgba(124, 77, 255, 0.14));
  border: 1px solid rgba(0, 229, 255, 0.28);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 24px rgba(0, 229, 255, 0.18), inset 0 1px 0 rgba(255,255,255,0.06);
}
.game-title {
  font-size: 27px;
  font-weight: 900;
  letter-spacing: 6px;
  color: #00E5FF;
  text-shadow: 0 0 24px rgba(0,229,255,0.6), 0 0 48px rgba(0,229,255,0.25);
}
.game-subtitle {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.38);
  letter-spacing: 2.5px;
  text-transform: uppercase;
  margin-top: 5px;
}

/* ── Labels campos ───────────────────────────── */
.field-label {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 1.2px;
  color: rgba(255, 255, 255, 0.45);
  text-transform: uppercase;
  display: block;
  margin-bottom: 6px;
}

/* ── Botón login ──────────────────────────────── */
.login-btn {
  background: linear-gradient(135deg, #00C8E8, #0097A7) !important;
  color: #fff !important;
  font-weight: 700 !important;
  letter-spacing: 1.5px !important;
  font-size: 13px !important;
  box-shadow: 0 4px 20px rgba(0,229,255,0.35), 0 1px 0 rgba(255,255,255,0.08) inset !important;
  transition: all 0.3s ease !important;
}
.login-btn:hover {
  background: linear-gradient(135deg, #00D8F5, #00ACC1) !important;
  box-shadow: 0 6px 30px rgba(0,229,255,0.55), 0 1px 0 rgba(255,255,255,0.08) inset !important;
  transform: translateY(-2px);
}

/* ── Footer ───────────────────────────────────── */
.footer-text  { font-size: 10.5px; color: rgba(255,255,255,0.22); }
.footer-brand { font-size: 10.5px; color: rgba(0,229,255,0.50); font-weight: 600; }

/* ── Responsive ───────────────────────────────── */
@media (max-width: 960px) {
  .login-card {
    grid-template-columns: 1fr;
  }
  .login-hero {
    min-height: 280px;
    border-right: none;
    border-bottom: 1px solid rgba(0, 229, 255, 0.12);
  }
  .stat-right { display: none; }
}
@media (max-width: 600px) {
  .login-card { border-radius: 18px; }
  .login-form-panel { padding: 30px 22px 24px; }
  .login-hero { min-height: 220px; }
  .game-title { font-size: 22px; letter-spacing: 4px; }
}
</style>
