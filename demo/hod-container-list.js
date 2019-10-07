import { LitElement, html } from "../../web_modules/lit-element.js";
import { MobxLitElement } from "../../web_modules/@adobe/lit-mobx.js";
import { store } from "./store.js";

class HodContainerList extends MobxLitElement {
  constructor() {
    super();
    this.store = store;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  render() {
    return html`
      <style>
        :host {
          display: block;
          flex-direction: column;
          justify-content: center;
          max-width: 30rem;
          margin: auto;
        }
        @import url("https://fonts.googleapis.com/css?family=Roboto+Mono:400,700&display=swap");
        @import url("https://fonts.googleapis.com/css?family=Press+Start+2P&display=swap");

        body {
          font-family: "Roboto Mono", Consolas, Monospace;
          height: 100%;
          display: grid;
          margin: 8px;
        }
        hr {
          border: 8px solid #000;
          display: block;
          margin: 0;
        }
        .red {
          color: red;
        }
        .white {
          background: #fff;
          padding: 10px;
        }
        .black {
          background: black;
          color: white;
          padding: 0px 8px;
        }
        .container-1 {
          margin: auto;
        }
        .container-2 {
          margin: auto;
          margin-bottom: 4rem;
          position: relative;
        }
        .delete {
          padding: 1rem;
          background: white;
          color: black;
          position: absolute;
          right: -1rem;
          top: -1rem;
          z-index: 10;
          display: inline-block;
          width: auto;
          display: none;
          transition: all .3 ease-in-out;
        }
        .delete:hover,
        .delete:focus {
          background: red;
          color: white;
        }
        .container-2:hover .delete,
        .container-2:focus .delete {
          display: inline-block;
        }
        .align-v {
          height: 100vh;
        }
        #image {
          display: block;
          margin: 3rem auto 0.5rem auto;
          /*     max-height:200px;
    max-width:200px; */
          width: 80%;
          max-width: 200px;
          height: 200px;
          border-radius: 50%;
          overflow: hidden;
          position: relative;
          padding: 0;
          /*     border: solid black 8px; */
        }
        #name {
          text-align: center;
          font-size: 0.75em;
          margin-top: 1rem;
          color: #333;
        }
        img.person {
          width: 100%;
        }
        p {
          max-width: 30rem;
          margin: 2rem auto;
        }
        .center {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        a.button {
          font-family: "Press Start 2P", cursive;
          font-weight: 700;
          text-transform: uppercase;
          text-decoration: none;
          text-align: center;
        }

        a.button img {
          margin-right: 12px;
        }
        a.button:focus,
        a.button:hover {
          text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
          transition: text-shadow 0.1s ease-in 0s;
        }
        a.button:focus,
        a.button:hover {
          text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
          transition: text-shadow 0.1s ease-in 0s;
        }
        .button {
          background: #fff;
          border: 4px solid #000;
          padding: 2rem;
          margin-right: 8px;
          box-shadow: 8px 8px #000000;
          transition: box-shadow 0.1s ease-in 0s, background 0.3s ease-in 0s;
          color: black;
        }
        .button:focus,
        .button:hover {
          box-shadow: 16px 16px #000000;
          transition: box-shadow 0.1s ease-out 0s, background 0.3s ease-in 0s;
        }
        .button.btn-bg-purple:focus,
        .button.btn-bg-purple:hover {
          background: #fc03ec;
          color: white;
        }
        .button.btn-bg-blue:focus,
        .button.btn-bg-blue:hover {
          background: #0099ff;
          color: white;
        }
        .button.btn-bg-green:focus,
        .button.btn-bg-green:hover {
          background: #00ff00;
          color: white;
        }

        .drag-box {
          width: 20px;
          height: 20px;
          border: 8px solid black;
        }
        .drop-box {
          display: block;
          height: auto;
          border: 8px solid black;
        }
        .padding-3 {
          padding: 3em;
        }
        .bg-1 {
          background: repeating-linear-gradient(
            -45deg,
            #fff,
            #fff 4px,
            #000 4px,
            #000 8px
          );
          /*     background-size: .8rem .8rem; */
        }
        #view {
          width: 320px;
          height: 320px;
          background-color: #eee;
        }
      </style>
      ${this.store.containers.map(
        container =>
          html`
            <div class="container-2">
              <div class="drop-box padding-3 bg-1">
                <a
                  href="${window.location.protocol}//${container.url}"
                  class="button btn-bg-green center"
                  target="_blank"
                  >${container.url}</a
                >
                <a class="delete" @click=${this._deleteContainer} data-id=${container.containerId} alt="Delete container">X</a>
              </div>
            </div>
          `
      )}
    `;
  }

  _deleteContainer(e) {
    console.log(e.target);
  }
}
customElements.define("hod-container-list", HodContainerList);
