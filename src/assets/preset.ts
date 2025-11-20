import { definePreset } from "@primeuix/themes"
import Aura from '@primeuix/themes/aura'

export function setMyPreset() {
    return definePreset(Aura, {
        semantic: {
            primary: {
                50: '#FEF1EA',
                100: '#FED7C0',
                200: '#FEBC96',
                300: '#FEA16C',
                400: '#FE8742',
                500: '#FE7A2D',
                600: '#CB6124',
                700: '#98491B',
                800: '#653012',
                900: '#4C240D',
                950: '#321809'
            },
            colorScheme: {
                light: {
                    surface: {
                        0: '#FFFFFF',
                        50: '{neutral.50}',
                        100: '{neutral.100}',
                        200: '{neutral.200}',
                        300: '{neutral.300}',
                        400: '{neutral.400}',
                        500: '{neutral.500}',
                        600: '{neutral.600}',
                        700: '{neutral.700}',
                        800: '{neutral.800}',
                        900: '{neutral.900}',
                        950: '{neutral.950}'
                    },
                },
                dark: {
                    surface: {
                        0: '#FFFFFF',
                        50: '{zinc.50}',
                        100: '{zinc.100}',
                        200: '{zinc.200}',
                        300: '{zinc.300}',
                        400: '{zinc.400}',
                        500: '{zinc.500}',
                        600: '{zinc.600}',
                        700: '{zinc.700}',
                        800: '{zinc.800}',
                        900: '{zinc.900}',
                        950: '{zinc.950}'
                    },
                }
            }
        }
    })
}