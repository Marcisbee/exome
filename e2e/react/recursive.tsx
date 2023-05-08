import * as React from 'react'
import * as ReactDom from 'react-dom/client'
import { useStore } from 'exome/react'

import { RecursiveStore, recursiveStore } from '../stores/recursive'

function Item({ item }: { item: RecursiveStore }) {
  const { name, items, rename } = useStore(item)

  return (
    <li>
      <input
        type="text"
        value={name}
        onChange={(e) => {
          rename(e.target.value)
        }}
      />

      {items && (
        <ul>
          {items.map((subItem) => (
            <Item item={subItem} />
          ))}
        </ul>
      )}
    </li>
  )
}

const root = ReactDom.createRoot(document.body);
root.render(<ul><Item item={recursiveStore} /></ul>);
