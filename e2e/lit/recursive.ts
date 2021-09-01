import { StoreController } from 'exome/lit'
import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { RecursiveStore, recursiveStore } from '../stores/recursive'

@customElement('lit-item')
export class LitItem extends LitElement {
  @property()
  public item!: RecursiveStore

  // Create the controller and store it
  private recursiveStore!: StoreController<RecursiveStore>

  connectedCallback() {
    this.recursiveStore = new StoreController(this, this.item)
    super.connectedCallback()
  }

  // Use the controller in render()
  render() {
    const { name, items, rename } = this.recursiveStore.store

    return html`
      <li>
        <input
          type="text"
          value=${name}
          @input=${(e: any) => {
            rename(e.target.value)
          }}
        />

        ${items && html`
          <ul>
            ${items.map((subItem) => html`
              <lit-item .item=${subItem}></lit-item>
            `)}
          </ul>
        `}
      </li>
    `
  }

  // Allow external css
  createRenderRoot() {
    return this
  }
}

@customElement('lit-app')
export class LitApp extends LitElement {
  render() {
    return html`
      <ul><lit-item .item=${recursiveStore}></lit-item></ul>
    `
  }

  // Allow external css
  createRenderRoot() {
    return this
  }
}

document.body.innerHTML = '<lit-app />'
