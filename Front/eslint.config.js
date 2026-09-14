import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // Decisión documentada: esta regla nueva marca el patrón estándar
      // "fetch de datos al montar" (useEffect -> setState al resolver la
      // promesa) como problemático, empujando hacia librerías de fetching
      // (React Query, SWR) o Suspense. Ese patrón es exactamente el que
      // pide la consigna (useState/useEffect para estado de carga/error) y
      // sumar una librería externa solo para complacer al linter sería una
      // dependencia innecesaria. Se desactiva a propósito, no por descuido.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
]
