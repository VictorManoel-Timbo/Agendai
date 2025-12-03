import { useGlobalToast } from "./global-toast.util"

export class ToastHandler {

    private static toast = useGlobalToast()

    static success(message: string, title = "Sucesso") {
        this.toast.add({
            severity: "success",
            summary: title,
            detail: message,
            life: 3000
        })
    }

    static info(message: string, title = "Informação") {
        this.toast.add({
            severity: "info",
            summary: title,
            detail: message,
            life: 3000
        })
    }

    static warn(message: string, title = "Atenção") {
        this.toast.add({
            severity: "warn",
            summary: title,
            detail: message,
            life: 3000
        })
    }

    static error(message: string, title = "Erro") {
        this.toast.add({
            severity: "error",
            summary: title,
            detail: message,
            life: 3000
        })
    }

    static handleError(error: any) {
        const status = error.response.status
        const data = error.response.data

        const msg = data.message ?? "Ocorreu um erro inesperado."

        switch (status) {
            case 400:
                return this.warn(msg, "Requisição inválida")

            case 401:
                return this.error("Faça login novamente.", "Não autorizado")

            case 403:
                return this.error("Você não tem permissão para acessar este recurso.", "Acesso Negado")

            case 404:
                return this.warn("O recurso solicitado não foi encontrado.", "Não encontrado")

            case 408:
                return this.error("O servidor demorou muito para responder.", "Timeout")

            case 409:
                return this.error("Usuário já existe.", "Conflito")

            case 422:
                return this.warn(msg, "Erro de Validação")

            case 429:
                return this.warn("Muitas requisições. Tente novamente em instantes.", "Limite Atingido")

            case 500:
                return this.error("Erro interno no servidor.", "Erro no servidor")

            case 502:
                return this.error("Gateway fora do ar ou resposta inválida.", "Erro 502")

            case 503:
                return this.error("Servidor indisponível no momento.", "Erro 503")

            case 504:
                return this.error("Tempo esgotado aguardando resposta do servidor.", "Tempo excedido")
        }

        return this.error("Um erro desconhecido ocorreu.")
    }
}
