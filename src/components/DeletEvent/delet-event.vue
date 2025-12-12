<script lang="ts">
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
    name: 'DeletEvent',
    props: {
      event: { type: Object as PropType<Record<string, any> | null>, default: null },
      loading: { type: Boolean, default: false }
    },
    data() {
        return{
            isOpen: false
        }
    },
    methods:{
        open() {
            this.isOpen = true
        },
        handleCancel() {
            this.isOpen = false
            this.$emit('cancel')
        },
        handleConfirm() {
            this.isOpen = false
            this.$emit('confirm', this.event)
        }
    }
})
</script>

<template>
  <div>
    <!-- Modal -->
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50">
      <!-- Backdrop -->
      <div 
        @click="handleCancel" 
        class="fixed inset-0 bg-black bg-opacity-50"
      ></div>
      
      <!-- Modal Content -->
      <div
        class="relative w-80 p-6 z-10 border rounded-md shadow-xl bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-700"
        @click.stop
      >
        <!-- Botão Fechar -->
        <button 
          @click="handleCancel"
          class="absolute top-4 left-4 text-gray-600 hover:text-gray-800 dark:text-gray-300"
          aria-label="Fechar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <!-- Título -->
        <h2 class="text-center font-semibold text-lg mb-4 mt-2 text-gray-900 dark:text-gray-100">
          Excluir evento
        </h2>

        <!-- Mensagem -->
        <p class="text-center text-gray-700 text-sm mb-4 dark:text-gray-200">
          Você tem certeza que quer excluir este evento?
        </p>

        <!-- Título do evento (opcional) -->
        <p v-if="event" class="text-center text-sm font-medium text-gray-900 mb-4 dark:text-gray-100">
          {{ event.title || event.name || 'Evento' }}
        </p>

        <!-- Botões -->
        <div class="flex gap-3">
          <button
            @click="handleCancel"
            class="flex-1 px-4 py-2.5 bg-gray-100 text-gray-800 rounded transition-colors font-medium text-sm border border-orange-300 hover:bg-gray-200 disabled:opacity-60 dark:bg-gray-700 dark:text-gray-200 dark:border-orange-400"
          >
            cancelar
          </button>
          <button
            @click="handleConfirm"
            :disabled="loading"
            class="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors font-medium text-sm disabled:opacity-60"
          >
            <span v-if="!loading">confirmar</span>
            <span v-else>excluindo...</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>