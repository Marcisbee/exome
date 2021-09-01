import { StoreController } from 'exome/lit'
import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { asyncStore } from '../stores/async-store'

@customElement('lit-app')
export class LitApp extends LitElement {
  // Create the controller and store it
  private readonly asyncStore = new StoreController(this, asyncStore)

  private renders = 0

  // Use the controller in render()
  render() {
    const { message, loading, getMessage, getMessageWithLoading } = this.asyncStore.store

    this.renders += 1

    return html`
      ${loading && (html`<i id="loading" />`)}
      <h1>${message}</h1>
      <button id="getMessage" @click=${getMessage}>Get message</button>
      <button id="getMessageWithLoading" @click=${getMessageWithLoading}>Get message with loading</button>
      <span>${this.renders}</span>
    `
  }
}

document.body.innerHTML = '<lit-app />'
