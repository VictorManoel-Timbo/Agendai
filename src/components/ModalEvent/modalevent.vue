<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";

import { JournalEvent } from "@/models/event.model";
import { JournalEventService } from "@/views/event.service";

// Tipagem do SelectButton Context (essencial para resolver o erro 'any')

interface SelectButtonContext {
  index: number;

  active: boolean;

  // Adicione outras propriedades se você precisar delas no PT, como 'disabled', etc.
}

interface DayOfWeek {
  label: string;

  value: number;
}

interface EventForm {
  nome: string;
  descricao: string;
  categoria: string;
  data_inicio: Date | null;
  data_termino: Date | null;
  horario_inicio: string;
  horario_termino: string;
  local_padrao: string;
  recorrencia_tipo: "unica" | "frequente";
  dias_semana: DayOfWeek[];
}

export default defineComponent({
  props: {
    visible: { type: Boolean, required: true },
  },

  emits: ["close", "saved"],

  setup(_, { emit }) {
    const eventService = new JournalEventService();

    const eventData = ref<EventForm>({
      nome: "",
      descricao: "",
      categoria: "",
      data_inicio: new Date(),
      data_termino: new Date(),
      horario_inicio: "00:00:00",
      horario_termino: "00:00:00",
      local_padrao: "",
      recorrencia_tipo: "unica",
      dias_semana: [],
    });

    const recorrenciaOptions = ref([
      { label: "Única", value: "unica" },

      { label: "Frequente", value: "frequente" },
    ]);

    const dayOptions = ref([
      { label: "Dom", value: 0 },
      { label: "Seg", value: 1 },
      { label: "Ter", value: 2 },
      { label: "Qua", value: 3 },
      { label: "Qui", value: 4 },
      { label: "Sex", value: 5 },
      { label: "Sab", value: 6 },
    ]);

    const categorias = [
      { label: "Aula", value: "aula" },

      { label: "Reunião", value: "reuniao" },

      { label: "Atividade", value: "atividade" },

      { label: "Prova", value: "prova" },

      { label: "Outro", value: "outro" },
    ];

    const isRecorrenciaFrequente = computed(
      () => eventData.value.recorrencia_tipo === "frequente"
    );

    // DEFINIÇÃO DO PT PARA RECORRÊNCIA (TIPADO)

    const recorrenciaPT = computed(() => ({
      root: "flex w-full",

      button: ({ context }: { context: SelectButtonContext }) => ({
        class: [
          "flex-1 py-3 text-md font-semibold border-1",

          "transition-all duration-200 ease-in-out rounded-lg",

          context.active
            ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
            : "bg-gray-100 text-gray-700 border-gray-100 hover:bg-gray-200",

          context.index === 0 ? "rounded-r-none" : "rounded-l-none",
        ],
      }),
    }));

    // DEFINIÇÃO DO PT PARA DIAS DA SEMANA (TIPADO)

    const diasSemanaPT = computed(() => ({
      root: "flex w-full",

      button: ({ context }: { context: SelectButtonContext }) => ({
        class: [
          "flex-1 py-3 text-md font-semibold border-1",

          "transition-all duration-200 ease-in-out rounded-lg",

          context.active
            ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
            : "bg-gray-100 text-gray-700 border-gray-100 hover:bg-gray-200",
        ],
      }),
    }));

    watch(
      () => eventData.value.data_inicio,
      (newVal) => {
        if (eventData.value.recorrencia_tipo === "unica" && newVal) {
          eventData.value.data_termino = newVal;
        }
      }
    );

    watch(
      () => eventData.value.recorrencia_tipo,
      (newType) => {
        if (newType === "unica") {
          eventData.value.data_termino = eventData.value.data_inicio;

          eventData.value.dias_semana = [];
        } else if (newType === "frequente") {
          if (eventData.value.data_termino === eventData.value.data_inicio) {
            eventData.value.data_termino = null;
          }
        }
      }
    );

    function save() {
      const payload: JournalEvent = {
        ...eventData.value,

        data_inicio: eventData.value.data_inicio ?? undefined,

        data_termino: eventData.value.data_termino ?? undefined,

        recorrencia: isRecorrenciaFrequente.value
          ? `frequente_${eventData.value.dias_semana
              .map((d) => d.value)
              .join(",")}`
          : "unica",
      };

      console.log("Payload a ser enviado:", payload);

      emit("saved");
    }

    function close() {
      emit("close");
    }

    return {
      eventData,

      categorias,

      recorrenciaOptions,

      dayOptions,

      isRecorrenciaFrequente,

      recorrenciaPT, // Retornado o PT tipado

      diasSemanaPT, // Retornado o PT tipado

      save,

      close,
    };
  },
});
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="close"
    modal
    header="Novo Evento"
    :style="{ width: '34rem' }"
    class="p-2"
    :draggable="false"
  >
    <template #header>
      <div class="flex items-center justify-between w-full">
        <span class="text-xl font-bold">Título</span>
      </div>
    </template>

    <div class="flex flex-col gap-6 px-4 py-2">
      <div class="flex flex-col gap-2">
        <label for="nome" class="text-sm font-semibold">Nome do Evento</label>

        <InputText id="nome" v-model="eventData.nome" class="w-full py-3" />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm font-semibold">Horário:</label>

        <div class="flex items-center gap-2">
          <InputText
            v-model="eventData.horario_inicio"
            placeholder="00:00:00"
            class="w-1/2 text-center py-3"
          />

          <span class="text-xl font-light text-gray-400">—</span>

          <InputText
            v-model="eventData.horario_termino"
            placeholder="00:00:00"
            class="w-1/2 text-center py-3"
          />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm font-semibold">Recorrência:</label>

        <SelectButton
          v-model="eventData.recorrencia_tipo"
          :options="recorrenciaOptions"
          optionLabel="label"
          optionValue="value"
          class="w-full"
          :pt="recorrenciaPT"
          fluid
        />
      </div>

      <div
        v-if="eventData.recorrencia_tipo === 'unica'"
        class="flex flex-col gap-2"
      >
        <label class="text-sm font-semibold">Dia:</label>

        <Calendar
          v-model="eventData.data_inicio"
          class="w-full"
          dateFormat="dd/mm/yy"
          placeholder="__/__/____"
          :manualInput="false"
          showIcon
          :input-class="'w-full py-3'"
          @date-select="eventData.data_termino = eventData.data_inicio"
        />
      </div>

      <div
        v-if="eventData.recorrencia_tipo === 'frequente'"
        class="flex flex-col gap-6"
      >
        <div class="flex flex-col gap-2">
          <label class="text-sm font-semibold">Período:</label>

          <div class="flex items-center gap-2">
            <Calendar
              v-model="eventData.data_inicio"
              dateFormat="dd/mm/yy"
              placeholder="__/__/____"
              class="w-1/2"
              :manualInput="false"
              showIcon
              :input-class="'w-full py-3'"
            />

            <span class="text-xl font-light text-gray-400">—</span>

            <Calendar
              v-model="eventData.data_termino"
              dateFormat="dd/mm/yy"
              placeholder="__/__/____"
              class="w-1/2"
              :manualInput="false"
              showIcon
              :input-class="'w-full py-3'"
            />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-semibold">Dias:</label>

          <SelectButton
            v-model="eventData.dias_semana"
            :options="dayOptions"
            optionLabel="label"
            multiple
            class="w-full"
            :pt="diasSemanaPT"
            fluid
          />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm font-semibold">Local:</label>

        <InputText v-model="eventData.local_padrao" class="w-full py-3" />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm font-semibold">Descrição:</label>

        <Textarea v-model="eventData.descricao" class="w-full py-3" rows="5" />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm font-semibold">Categoria</label>

        <Dropdown
          v-model="eventData.categoria"
          :options="categorias"
          optionLabel="label"
          optionValue="value"
          class="w-full"
          placeholder="Selecione..."
        />
      </div>

      <div class="flex justify-center mt-4">
        <Button
          label="Criar Evento"
          class="w-full py-3 text-lg font-semibold bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600 focus:shadow-none"
          @click="save"
        />
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
/* Sobrescreve o estilo base do input dentro do Calendar para garantir padding/altura consistentes */

.p-calendar :deep(.p-inputtext) {
  padding-top: 0.75rem !important; /* py-3 */

  padding-bottom: 0.75rem !important; /* py-3 */
}
</style>
