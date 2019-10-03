import { html } from "./web_modules/lit-element.js";
import { MobxLitElement } from "./web_modules/@adobe/lit-mobx.js";
import { store } from "./store.js";
import { gql } from "./web_modules/apollo-boost.js";

class HodAuth extends MobxLitElement {
  constructor() {
    super();
    this.store = store;
  }
  async connectedCallback() {
    super.connectedCallback();

    await this.getAccessToken();
    await this.getUser();
  }

  async getAccessToken() {
    try {
      const access_token = await fetch(
        `${window._env_.HAXCMS_AUTH_FQDN}/access_token`,
        {
          credentials: "include"
        }
      ).then(res => res.json());
      if (access_token) {
        window.localStorage.setItem("access_token", access_token);
        return access_token;
      }
    } catch (error) {
      console.log(error)
    }
  }

  async getUser() {
    if (typeof window.localStorage.access_token !== "undefined") {
      const user = await fetch(`${window._env_.HAXCMS_AUTH_FQDN}/graphql`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem('access_token')}`
        },
        body:
          ' \
          { \
            "query": "query { user { name }}" \
          }'
      }).then(res => res.json());
      this.store.name = user.data.user.name;
    }
  }
}
customElements.define("hod-auth", HodAuth);
