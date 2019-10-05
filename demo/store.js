import {
  observable,
  decorate,
  computed,
  autorun,
  action,
  toJS,
  runInAction
} from "./web_modules/mobx.js";

import ApolloClient from "./web_modules/apollo-boost.js";
import { gql } from "./web_modules/apollo-boost.js";

class Store {
  constructor() {
    this.name = null;
    this.accessToken = null;
    this.createContainerState = "default";
    this.createContainerMessage = null;
    this.containers = null;

    // Check if they already have a token
    if (window.localStorage.getItem("access_token")) {
      this.accessToken = window.localStorage.getItem("access_token");
      this.getUser();
    }
  }

  get hodClient() {
    if (this.accessToken) {
      return new ApolloClient({
        uri: `${window._env_.HAXCMS_ON_DEMAND_FQDN}/graphql`,
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      });
    }
  }

  get authClient() {
    if (this.accessToken) {
      return new ApolloClient({
        uri: `${window._env_.HAXCMS_ON_DEMAND_FQDN}/graphql`,
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      });
    }
  }

  async getContainers() {
    if (this.hodClient) {
      const containers = await this.hodClient.query({
        query: gql`
          query {
            myServers {
              user
              containerId
              url
            }
          }
        `
      });
      this.containers = containers.data.myServers;
    }
  }

  async login() {
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
        this.accessToken = access_token;
        window.localStorage.setItem("access_token", access_token);
        return access_token;
      }
    } catch (error) {
      // We need to redirect the user back to the auth service
      window.location.href = `${window._env_.HAXCMS_AUTH_FQDN}/login?redirect=${window.location.href}`
    }
  }

  async getUser() {
    const user = await fetch(`${window._env_.HAXCMS_AUTH_FQDN}/graphql`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`
      },
      body:
        ' \
        { \
          "query": "query { user { name }}" \
        }'
    }).then(res => res.json());
    this.name = user.data.user.name;
  }

  async createContainerInit() {
    try {
      this.createContainerState = "initializing";
      const server = await this.hodClient.mutate({mutation: gql`
        mutation {
          createServer {
            containerId
            createdAt
            id
            user
          }
        }
      `
      })
      if (server.errors) {
        this.createContainerState = "error";
        if (
          server.errors.find(i =>
            i.message.includes("Unique constraint failed: Server.url")
          )
        ) {
          this.createContainerMessage = "You already have a server, yo!";
        } else {
          this.createContainerMessage = "Something went kinda wrong :(";
        }
      } else {
        this.createContainerState = "complete";
      }
    } catch (error) {
      this.createContainerState = "error";
      this.createContainerMessage = "Something went so wrong :(";
    }
    // auto update containers
    this.getContainers();
  }
}

decorate(Store, {
  name: observable,
  accessToken: observable,
  refreshToken: action.bound,
  createContainerState: observable,
  createContainerStateMessage: observable,
  containers: observable,
  hodClient: computed,
  authClient: computed,
  createContainerInit: action.bound,
  getContainers: action.bound,
  login: action.bound,
  getAccessToken: action.bound,
  getUser: action.bound
});

export const store = new Store();
