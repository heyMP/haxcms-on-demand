import { html } from "../../web_modules/lit-element.js";
import { MobxLitElement } from "../../web_modules/@adobe/lit-mobx.js";
import { store } from "./store.js";
import './hod-create-container.js'
import './hod-container-list.js'

class HodContainers extends MobxLitElement {
  constructor() {
    super();
    this.store = store;
  }

  connectedCallback() {
    super.connectedCallback()
  }

  render() {
    return html`
      <style>
        :host {
          display: block;
          flex-direction: column;
          justify-content: center;
        }
      </style>
      ${this.store.containers.length > 0
        ? html`
          <hod-container-list></hod-container-list>
        `
        : html`
          <hod-create-container></hod-create-container>
        `
      }
    `;
  }
}
customElements.define("hod-containers", HodContainers);

