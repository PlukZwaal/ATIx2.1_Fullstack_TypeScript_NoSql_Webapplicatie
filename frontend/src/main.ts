import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router/index.ts'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')

// Toggle body class voor scroll lock op auth pagina's (login/register)
import { useAuthStore } from './stores/auth'
const authStore = useAuthStore()
const updateBodyClass = () => {
	const isAuth = authStore.isAuthenticated
	const routePath = router.currentRoute.value.path
	const isAuthPage = routePath === '/login' || routePath === '/register'
	if (!isAuth && isAuthPage) {
		document.body.classList.add('auth-locked')
	} else {
		document.body.classList.remove('auth-locked')
	}
}

updateBodyClass()
router.afterEach(() => updateBodyClass())