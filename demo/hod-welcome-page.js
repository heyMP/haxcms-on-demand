import { LitElement, html } from "../../web_modules/lit-element.js";
import { MobxLitElement } from "../../web_modules/@adobe/lit-mobx.js";
import { store } from "./store.js";

class HodWelcomePage extends MobxLitElement {
  constructor() {
    super();
    this.store = store;
  }

  render() {
    return html`
      <style>
        @import url("https://fonts.googleapis.com/css?family=Roboto+Mono:400,700&display=swap");
        @import url("https://fonts.googleapis.com/css?family=Press+Start+2P&display=swap");

        :host {
          display: block;
          max-width: 30rem;
          margin: auto;
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
          color: ;
        }

        a.button img {
          margin-right: 12px;
        }
        a.button:hover {
          text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
          transition: text-shadow 0.1s ease-in 0s;
        }
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
        .button:hover {
          box-shadow: 16px 16px #000000;
          transition: box-shadow 0.1s ease-out 0s, background 0.3s ease-in 0s;
        }
        .button.btn-bg-purple:hover {
          background: #fc03ec;
        }
        .button.btn-bg-blue:hover {
          background: #0099ff;
        }
        .button.btn-bg-green:hover {
          background: #00ff00;
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

        /* Animation */
      </style>
      <div class="container-1">
        <div class="align-v">
          <p>
            Hello there. This demo was created specially for
            <strong>2019.HAX.CAMP</strong> attendees. To create a personal HAX
            CMS instance, sign in with your Github account.
          </p>
          <a href="#" @click=${this.store.login} class="button btn-bg-purple center"
            ><img
              class="btn-img"
              height="32"
              width="32"
              src="https://unpkg.com/simple-icons@latest/icons/github.svg"
            />
            Sign in with Github</a>
        </div>
      </div>
    `;
  }
}
customElements.define("hod-welcome-page", HodWelcomePage);
