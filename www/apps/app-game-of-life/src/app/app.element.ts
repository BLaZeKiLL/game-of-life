import './app.element.css';
import * as gol from 'game-of-life';

export class AppElement extends HTMLElement {
  public static observedAttributes = [];

  connectedCallback() {
    gol.greet('CodeBlaze');
  }
}
customElements.define('app-game-of-life', AppElement);
