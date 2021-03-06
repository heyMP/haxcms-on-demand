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

    // if we are in the process of logging, meaning we have a new refresh_token
    if (getUrlParameter('login') === "true") {
      // remove query parameters
      window.history.pushState({},"", window.location.origin);
      // remove the existing access_token if we have one
      window.localStorage.removeItem("access_token");
      this.login()
    }
    // Check if they already have a token
    else if (window.localStorage.getItem("access_token")) {
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
      window.location.href = `${window._env_.HAXCMS_AUTH_FQDN}/login?redirect=${window.location.origin}?login=true`
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
        // Temp solution to make sure it's fully set up
        setTimeout(() => {
          this.createContainerState = "complete";
        }, 5000)
      }
    } catch (error) {
      this.createContainerState = "error";
      this.createContainerMessage = "Something went so wrong :(";
    }
    // auto update containers
    this.getContainers();
  }

  async deleteMyContainers() {
    try {
      const server = await this.hodClient.mutate({mutation: gql`
        mutation {
          deleteMyServers {
            count
          }
        }
      `
      })
    } catch(error) { }
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
  getUser: action.bound,
  deleteMyContainers: action.bound
});

const getUrlParameter = (name) => {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

export const store = new Store();
