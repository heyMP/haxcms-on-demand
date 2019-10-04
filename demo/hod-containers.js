import { html } from "./web_modules/lit-element.js";
import { autorun } from "./web_modules/mobx.js";
import { MobxLitElement } from "./web_modules/@adobe/lit-mobx.js";
import { store } from "./store.js";
import "./hod-create-container.js";
import "./hod-container-list.js";
import "./hod-toolbar.js";

class HodContainers extends MobxLitElement {
  constructor() {
    super();
    this.store = store;
  }

  connectedCallback() {
    super.connectedCallback();
    this.store.getContainers()
    autorun(() => {
      if (this.store.accessToken) {
        this.store.getContainers()
      }
    })
  }

  render() {
    // watch for change
    return html`
      <style>
        :host {
          display: block;
          flex-direction: column;
          justify-content: center;
        }
      </style>

      <hod-toolbar></hod-toolbar>

      ${this.store.containers.length}

      ${this.store.containers
        ? this.store.containers.length > 0
          ? html`
              <hod-container-list></hod-container-list>
            `
          : this.store.containers.length === 0
          ? html`
              <hod-create-container></hod-create-container>
            `
          : ""
        : ""}
    `;
  }
}
customElements.define("hod-containers", HodContainers);
