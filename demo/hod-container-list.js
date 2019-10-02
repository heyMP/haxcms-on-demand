import { LitElement, html } from "../../web_modules/lit-element.js";
import { MobxLitElement } from "../../web_modules/@adobe/lit-mobx.js";
import { store } from "./store.js";

class HodContainerList extends MobxLitElement {
  constructor() {
    super();
    this.store = store;
  }

  connectedCallback() {
    super.connectedCallback()
    this.store.getContainers()
  }

  render() {
    return html`
      <style>
        :host {
          display: block;
          flex-direction: column;
          justify-content: center;
          text-align: center;
        }
        a {
          display: inline-block;
          margin: auto;
          padding: 1em;
          font-size: 1.3em;
          color: black;
          font-family: "Press Start 2P", cursive;
        }
        a:hover,
        a:focus {
          cursor: pointer;
        }
        a:disabled {
          cursor: default;
          background: rgba(0, 0, 0, 0.8);
        }        }
      </style>
      ${this.store.containers.map(container =>
        html`
          <a href="${window.location.protocol}//${container.url}" class="item">${container.url}</a>
        `
      )}
    `;
  }
}
customElements.define("hod-container-list", HodContainerList);

