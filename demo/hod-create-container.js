import { LitElement, html } from "../../web_modules/lit-element.js";
import { MobxLitElement } from "../../web_modules/@adobe/lit-mobx.js";
import { store } from "./store.js";

class HodCreateContainer extends MobxLitElement {
  constructor() {
    super();
    this.store = store;
  }

  render() {
    return html`
      <style>
        :host {
          display: block;
          flex-direction: column;
          justify-content: center;
        }
        #button {
          margin: 1em auto;
          text-align: center;
        }
        button {
          display: inline-block;
          padding: 1em;
          font-size: 1.3em;
          background: black;
          color: white;
          font-family: "Press Start 2P", cursive;
        }
        button:hover,
        button:focus {
          cursor: pointer;
        }
        button:disabled {
          cursor: default;
          background: rgba(0, 0, 0, 0.8);
        }
      </style>
      ${this.store.createContainerState === "default"
        ? html`
            <div id="button">
              <button @click=${this.createContainerInit}>Create your server</button>
            </div>
          `
        : this.store.createContainerState === "initializing"
        ? html`
            <div id="button">
              <button disabled>Initializing</button>
            </div>
          `
        : this.store.createContainerState === "error"
        ? html`
            <div id="button">
              <button disabled>${this.store.createContainerMessage}</button>
            </div>
          `
        : this.store.createContainerState === "complete"
        ? html`
            <div id="button">
              <button disabled>All Set!</button>
            </div>
          `
        : ""}
    `;
  }

  async createContainerInit() {
    try {
      const access_token = window.localStorage.getItem("access_token");
      this.store.createContainerState = "initializing"
      const server = await fetch(`${window._env_.HAXCMS_ON_DEMAND_FQDN}/graphql`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`
        },
        body:
          ' \
          { \
            "query": "mutation { createServer { containerId createdAt id user }}" \
          }'
      }).then(res => res.json())
      if (server.errors) {
        this.store.createContainerState = "error"
        if (server.errors.find(i => i.message.includes('Unique constraint failed: Server.url'))) {
          this.store.createContainerMessage = "You already have a server, yo!"
        }
        else {
          this.store.createContainerMessage = "Something went kinda wrong :("
        }
      }
      else {
        this.store.createContainerState = "complete"
      }
    } catch (error) {
      this.store.createContainerState = "error"
      this.store.createContainerMessage = "Something went so wrong :("
    }
    // auto update containers
    this.store.getContainers()
  }
}
customElements.define("hod-create-container", HodCreateContainer);

