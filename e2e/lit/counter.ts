import { StoreController } from 'exome/lit'
import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { counter } from '../stores/counter'

@customElement('lit-app')
export class LitApp extends LitElement {
  // Create the controller and store it
  private readonly counter = new StoreController(this, counter)

  private renders = 0

  // Use the controller in render()
  render() {
    const { count, increment } = this.counter.store

    this.renders += 1

    return html`
      <h1 @click=${increment}>${count}</h1>
      <span>${this.renders}</span>
    `
  }
}

document.body.innerHTML = '<lit-app />'
