import {
  observable,
  decorate,
  computed,
  autorun,
  action,
  toJS,
  runInAction
} from "../../web_modules/mobx.js";

class Store {
  constructor() {
    this.name = null;
    this.accessToken = null
    this.createContainerState = 'default'
    this.createContainerMessage = null
    this.containers = []
    this.getContainers()
  }

  async getContainers() {
    try {
      const access_token = window.localStorage.getItem("access_token");
      const containers = await fetch(`${window._env_.HAXCMS_ON_DEMAND_FQDN}/graphql`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`
        },
        body:
          ' \
          { \
            "query": "query { myServers { user containerId url }}" \
          }'
      }).then(res => res.json())
      this.containers = containers.data.myServers
    } catch (error) {
    }
  }
}

decorate(Store, {
  name: observable,
  accessToken: observable,
  createContainerState: observable,
  createContainerStateMessage: observable,
  containers: observable,
  getContainers: action.bound
});

export const store = new Store()
