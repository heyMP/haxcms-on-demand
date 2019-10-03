import {
  observable,
  decorate,
  computed,
  autorun,
  action,
  toJS,
  runInAction
} from "./web_modules/mobx.js";

import ApolloClient from './web_modules/apollo-boost.js';
import { gql } from './web_modules/apollo-boost.js';

class Store {
  constructor() {
    this.name = null;
    this.accessToken = null
    this.createContainerState = 'default'
    this.createContainerMessage = null
    this.containers = null
  }

  get hodClient() {
    return new ApolloClient({
      uri: `${window._env_.HAXCMS_ON_DEMAND_FQDN}/graphql`,
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('access_token')}`
      }
    });
  }

  get authClient() {
    return new ApolloClient({
      uri: `${window._env_.HAXCMS_AUTH_FQDN}/graphql`,
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('access_token')}`
      }
    });
  }

  async getContainers() {
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
      })
      this.containers = containers.data.myServers
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
  getContainers: action.bound
});

export const store = new Store()
