import './app.element.css';
import { Universe, Cell } from 'game-of-life';
import { memory } from 'game-of-life/game_of_life_bg.wasm';

const CELL_SIZE = 5; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

export class AppElement extends HTMLElement {
  public static observedAttributes = [];

  private ID = 'canvas-game-of-life';
  private ctx!: CanvasRenderingContext2D;
  private universe!: Universe;

  private width = 236;
  private height = 128;

  connectedCallback() {
    this.innerHTML = `<canvas id="${this.ID}"></canvas>`;

    const canvas = document.getElementById(this.ID) as HTMLCanvasElement;

    canvas.height = (CELL_SIZE + 1) * this.height + 1;
    canvas.width = (CELL_SIZE + 1) * this.width + 1;

    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    if (this.ctx === null || this.ctx === undefined) {
      console.error('Unable to create canvas.');
    }

    this.universe = Universe.new(this.width, this.height);

    requestAnimationFrame(() => this.renderLoop());
  }

  private renderLoop() {
    this.universe.tick();

    this.drawGrid();
    this.drawCells();

    requestAnimationFrame(() => this.renderLoop());
  }

  private drawCells() {
    const cells = new Uint8Array(memory.buffer, this.universe.cells(), this.width * this.height);

    this.ctx.beginPath();

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const idx = this.getIndex(row, col);

        this.ctx.fillStyle = cells[idx] === Cell.Dead
          ? DEAD_COLOR
          : ALIVE_COLOR;

        this.ctx.fillRect(
          col * (CELL_SIZE + 1) + 1,
          row * (CELL_SIZE + 1) + 1,
          CELL_SIZE,
          CELL_SIZE
        );
      }
    }

    this.ctx.stroke();
  }

  private drawGrid() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = GRID_COLOR;

    // Vertical lines.
    for (let i = 0; i <= this.width; i++) {
      this.ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
      this.ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * this.height + 1);
    }

    // Horizontal lines.
    for (let j = 0; j <= this.height; j++) {
      this.ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
      this.ctx.lineTo((CELL_SIZE + 1) * this.width + 1, j * (CELL_SIZE + 1) + 1);
    }

    this.ctx.stroke();
  }

  private getIndex(row: number, column: number) {
    return row * this.width + column;
  }
}

customElements.define('app-game-of-life', AppElement);
