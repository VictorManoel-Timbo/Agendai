<script lang="ts">
import { defineComponent } from 'vue'

interface DayCell {
    date: Date
    day: number
    inCurrentMonth: boolean
    isToday: boolean
    iso: string
}

export default defineComponent({
    name: 'Calendar',
    data() {
        const now = new Date()
        return {
            today: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            currentMonthDate: new Date(now.getFullYear(), now.getMonth(), 1),
            cells: [] as DayCell[],
            selectedDateIso: '' as string,
            weekdays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] as string[],
            tempYear: null as number | null,
            tempMonth: null as number | null,
            showMonthPicker: false,
            months: [
                'Jan', 'Feb', 'Mar',
                'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep',
                'Oct', 'Nov', 'Dec'
            ]
        }
    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside)
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside)
    },
    computed: {
        monthYearTitle(): string {
            const date = this.currentMonthDate as Date
            const monthName = date.toLocaleString(undefined, { month: 'long' })
            return `${this.capitalize(monthName)} - ${date.getFullYear()}`
        }
    },
    watch: {
        currentMonthDate: {
            immediate: true,
            handler() {
                this.generateCells()
            }
        }
    },
    methods: {
        capitalize(str: string): string {
            if (!str) return str
            return str.charAt(0).toUpperCase() + str.slice(1)
        },
        daysInMonth(year: number, month: number): number {
            return new Date(year, month + 1, 0).getDate()
        },
        isoDate(date: Date): string {
            return date.toISOString().slice(0, 10)
        },
        generateCells(): void {
            const date = this.currentMonthDate as Date
            const year = date.getFullYear()
            const month = date.getMonth()

            const firstWeekday = new Date(year, month, 1).getDay()
            const daysCurrent = this.daysInMonth(year, month)

            const prevMonthDate = new Date(year, month - 1, 1)
            const daysPrev = this.daysInMonth(prevMonthDate.getFullYear(), prevMonthDate.getMonth())

            const cells: DayCell[] = []

            const prevDaysToShow = firstWeekday

            for (let i = 0; i < 42; i++) {
                let cellDate: Date
                let inCurrentMonth = false
                let dayNumber = 1

                if (i < prevDaysToShow) {
                    const day = daysPrev - prevDaysToShow + 1 + i
                    cellDate = new Date(year, month - 1, day)
                } else {
                    const idxInMonth = i - prevDaysToShow
                    if (idxInMonth < daysCurrent) {
                        dayNumber = idxInMonth + 1
                        cellDate = new Date(year, month, dayNumber)
                        inCurrentMonth = true
                    } else {
                        const day = idxInMonth - daysCurrent + 1
                        cellDate = new Date(year, month + 1, day)
                    }
                }

                const iso = this.isoDate(cellDate)
                const todayIso = this.isoDate(this.today)
                const isToday = iso === todayIso

                cells.push({
                    date: cellDate,
                    day: cellDate.getDate(),
                    inCurrentMonth,
                    isToday,
                    iso
                })
            }
            this.cells = cells
        },
        prevMonth(): void {
            const dt = this.currentMonthDate as Date
            this.currentMonthDate = new Date(dt.getFullYear(), dt.getMonth() - 1, 1)
        },
        nextMonth(): void {
            const dt = this.currentMonthDate as Date;
            this.currentMonthDate = new Date(dt.getFullYear(), dt.getMonth() + 1, 1)
        },
        selectCell(cell: DayCell): void {
            this.selectedDateIso = cell.iso
            this.$emit('update:selected', cell.date)
        },
        toggleMonthPicker(): void {
            this.showMonthPicker = !this.showMonthPicker

            if (this.showMonthPicker) {
                this.tempYear = this.currentMonthDate.getFullYear()
                this.tempMonth = this.currentMonthDate.getMonth()
            }
        },
        selectMonth(index: number): void {
            this.tempMonth = index

            if (this.tempYear !== null && this.tempMonth !== null) {
                this.currentMonthDate = new Date(this.tempYear, this.tempMonth, 1)
            }

            this.showMonthPicker = false
        },
        prevYear(): void {
            if (this.tempYear !== null) {
                this.tempYear--
            }
        },
        nextYear(): void {
            if (this.tempYear !== null) {
                this.tempYear++
            }
        },
        handleClickOutside(event: MouseEvent): void {
            const picker = this.$refs.monthPicker as HTMLElement
            const title = this.$refs.monthTitle as HTMLElement
            if (picker && !picker.contains(event.target as Node) && !title.contains(event.target as Node)) {
                this.showMonthPicker = false
            }
        }
    }
})
</script>

<template>
    <section
        class="min-w-[50vw] w-full md:h-full flex flex-col justify-center lg:w-3/4 px-0 sm:px-[3vw] md:px-0 py-6">

        <div class="relative flex items-center justify-between pl-[1vw] min-[375px]:pl-[3vw] sm:px-[3vw] md:px-0 mb-2">

            <button @click="prevMonth" class="p-1 rounded hover:bg-neutral-200 dark:hover:bg-zinc-700 hidden md:block">
                <v-icon name="pr-angle-left" scale="1.5" />
            </button>

            <div class="relative">

                <h2 ref="monthTitle" class="text-lg font-semibold cursor-pointer select-none"
                    @click="toggleMonthPicker">
                    {{ monthYearTitle }}
                </h2>

                <div v-if="showMonthPicker" ref="monthPicker"
                    class="absolute md:left-1/2 md:-translate-x-1/2 top-full z-50 mt-1 w-52 bg-neutral-100 dark:bg-zinc-800 border border-zinc-400 dark:border-neutral-600 shadow-lg rounded-lg p-2 select-none">

                    <div class="flex items-center justify-between mb-1">
                        <button @click.stop="prevYear" class="p-1 rounded hover:bg-neutral-200 dark:hover:bg-zinc-700">
                            <v-icon name="pr-angle-left" scale="1.5" />
                        </button>

                        <span class="font-semibold text-lg">
                            {{ tempYear }}
                        </span>

                        <button @click.stop="nextYear" class="p-1 rounded hover:bg-neutral-200 dark:hover:bg-zinc-700">
                            <v-icon name="pr-angle-right" scale="1.5" />
                        </button>
                    </div>

                    <div class="grid grid-cols-3 gap-2">
                        <button v-for="(month, index) in months" :key="index" @click.stop="selectMonth(index)"
                            class="py-2 rounded hover:bg-neutral-200 dark:hover:bg-zinc-700 text-center text-sm font-medium"
                            :class="{
                                'bg-primary-500 text-white dark:bg-primary-600': index === tempMonth
                            }">
                            {{ month }}
                        </button>
                    </div>
                </div>
            </div>

            <div class="flex gap-8">
                <button @click="prevMonth" class="p-1 rounded hover:bg-neutral-200 dark:hover:bg-zinc-700 md:hidden">
                    <v-icon name="pr-angle-left" scale="1.5" />
                </button>
                <button @click="nextMonth" class="p-1 rounded hover:bg-neutral-200 dark:hover:bg-zinc-700">
                    <v-icon name="pr-angle-right" scale="1.5" />
                </button>
            </div>
        </div>


        <div class="grid grid-cols-7 text-center text-sm font-medium mb-2">
            <div v-for="(day, index) in weekdays" :key="index" class="py-1">
                {{ day }}
            </div>
        </div>

        <div class="grid grid-cols-7 gap-1 select-none h-full">
            <div v-for="cell in cells" :key="cell.iso" @click="selectCell(cell)" tabindex="0"
                class="rounded bg-transparent md:bg-gray-200 dark:md:bg-gray-600 min-h-[2.25rem] md:min-h-[6rem] cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-300/60">

                <div
                    class="w-full h-full p-1 md:p-2 flex flex-col md:justify-start justify-center md:items-center items-center">
                    <span :class="[
                        { 'font-bold': cell.isToday },
                        cell.inCurrentMonth ? 'text-black dark:text-white' : 'text-black/50 dark:text-white/50'
                    ]">
                        <template v-if="cell.isToday">
                            <span
                                class="rounded-full font-bold bg-primary-500 dark:bg-primary-600 px-2 py-1 inline-flex items-center justify-center">
                                {{ cell.day }}
                            </span>
                        </template>
                        <template v-else>
                            {{ cell.day }}
                        </template>
                    </span>
                </div>
            </div>
        </div>
    </section>
</template>
