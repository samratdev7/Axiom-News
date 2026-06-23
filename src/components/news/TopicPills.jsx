'use client';

import categories from '@/lib/categories';
import styles from './TopicPills.module.css';

export default function TopicPills({ selected, onSelect }) {
  return (
    <div className={styles.container} id="topic-pills">
      <div className={styles.pills}>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`${styles.pill} ${selected === cat.id ? styles.active : ''}`}
            onClick={() => onSelect(cat.id)}
            id={`topic-${cat.id}`}
          >
            <span className={styles.icon}>{cat.icon}</span>
            <span className={styles.label}>{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
