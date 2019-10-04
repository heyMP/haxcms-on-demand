import { LitElement, html } from "../../web_modules/lit-element.js";
import { MobxLitElement } from "../../web_modules/@adobe/lit-mobx.js";
import { store } from "./store.js";
import "./hod-welcome-page.js"
import "./hod-user-page.js"
import "./web_modules/@lrnwebcomponents/hax-logo.js"

class HodRouter extends MobxLitElement {
  constructor() {
    super();
    this.store = store;
  }

  render() {
    return html`
      <style>
        :host {
          display: block;
          max-width: 30rem;
          margin: auto;
          text-align: center;
        }
        hax-logo {
          margin-top: 3rem;
          margin-bottom: -3rem;
        }
      </style>
      <hax-logo></hax-logo>
      ${this.store.name
        ? html`<hod-user-page></hod-user-page>`
        : html`<hod-welcome-page></hod-welcome-page>`
      }
    `;
  }

}
customElements.define("hod-router", HodRouter);