import type { ToastServiceMethods } from 'primevue/toastservice'

let toast: ToastServiceMethods | null = null

export const setToast = (t: ToastServiceMethods) => {
    toast = t
}

export const useGlobalToast = () => {
    if (!toast) {
        console.warn("Serviço de toast não inicializado")
    }
    return toast!
}