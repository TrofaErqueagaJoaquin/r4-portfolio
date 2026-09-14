import { PROJECT_CATEGORIES } from '../../lib/constants.js'
import styles from './ProjectFilter.module.css'

export function ProjectFilter({ selected, onChange, counts }) {
  return (
    <div className={styles.filters} role="group" aria-label="Filtrar proyectos por categoría">
      <FilterButton label={`Todos (${counts.all || 0})`} isActive={selected === 'all'} onClick={() => onChange('all')} />
      {PROJECT_CATEGORIES.map((category) => (
        <FilterButton
          key={category.value}
          label={`${category.label} (${counts[category.value] || 0})`}
          isActive={selected === category.value}
          onClick={() => onChange(category.value)}
        />
      ))}
    </div>
  )
}

function FilterButton({ label, isActive, onClick }) {
  return (
    <button type="button" className={styles.filterButton} data-active={isActive} aria-pressed={isActive} onClick={onClick}>
      {label}
    </button>
  )
}
