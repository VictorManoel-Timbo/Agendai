<script lang="ts">
import { JournalEventService } from "@/views/event.service";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
    props: {
        visible: {
            type: Boolean,
            required: true
        },
        eventToDelete: {
            type: Object as PropType<any> | null,
            required: true
        }
    },
    emits: ["close", "deleted"],
    data() {
        return {}
    },
    methods: {
        close(): void {
            this.$emit("close")
        },
        deleted(): void {
            this.$emit("deleted")
        },
        deleteEvent(): void {
            console.log(this.eventToDelete)
            this.service.event.pipe().subscribe({
                next: (response) => {}
            })
            this.service.delete(this.eventToDelete.id)

            this.$emit("deleted")
        },
        cancelOcurrenceDateEvent(): void {
            console.log(this.eventToDelete)
            this.service.event.pipe().subscribe({
                next: (response) => {}
            })
            this.service.cancelOcurrenceDateEvent(this.eventToDelete.id, this.eventToDelete.date)

            this.$emit("deleted")
        }
    },
    computed: {
        service(): JournalEventService {
            return new JournalEventService()
        }
    }
})
</script>

<template>
    <Dialog :visible="visible" @update:visible="close()" modal appendTo="body" :style="{ width: '30rem' }"
        :draggable="false">
        <template #header>
            <div class="flex items-center justify-between w-full">
                <span class="text-xl font-bold">Deletar evento ou ocorrência</span>
            </div>
        </template>
        <section class="py-8 gap-2 flex flex-col justify-center items-center">
            <p>Você pode deletar todo o evento ou a ocorrência atual.</p>
            <p class="text-lg font-bold">Tem certeza que quer deletar evento?</p>
        </section>
        <template #footer>
            <div class="flex w-full gap-4">
                <Button label="Cancelar" @click="close()" outlined class="w-full h-12 py-3 text-lg font-semibold bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600 focus:shadow-none" />
                <Button label="Ocorrência" @click="cancelOcurrenceDateEvent()" class="w-full h-12 py-3 text-lg font-semibold bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600 focus:shadow-none" />
                <Button label="Evento" @click="deleteEvent()" class="w-full h-12 py-3 text-lg font-semibold bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600 focus:shadow-none" />
            </div>
        </template>
    </Dialog>
</template>