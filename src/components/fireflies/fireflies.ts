import "./fireflies.css";
import { el, mount } from "../../helpers/dom";
import { bodyElement } from "../..";

let fireflyColor: string;

function draw(f: any, w: any, h: any, firefly: any) {
	if (f.length < 100) {
		for (let j = 0; j < 10; j++) {
			f.push(new firefly());
		}
	}
	//animation
	for (let i = 0; i < f.length; i++) {
		f[i].move();
		f[i].show();
		if (f[i].x < 0 || f[i].x > w || f[i].y < 0 || f[i].y > h) {
			f.splice(i, 1);
		}
	}
}

function loop(c: any, f: any, w: any, h: any, firefly: any) {
	// window.requestAnimFrame(loop);
	if (c) {
		c.clearRect(0, 0, w, h);
	}
	draw(f, w, h, firefly);
}

export function initFireflies() {
	const canvas: HTMLCanvasElement = el("canvas.fireflies") as HTMLCanvasElement;
	mount(bodyElement, canvas);

	let c = canvas.getContext("2d"),
		w = (canvas.width = window.innerWidth),
		h = (canvas.height = window.innerHeight);

	if (c) {
		class firefly {
			x;
			y;
			s;
			ang;
			v;
			constructor() {
				this.x = Math.random() * w;
				this.y = Math.random() * h;
				this.s = Math.random() * 2;
				this.ang = Math.random() * 2 * Math.PI;
				this.v = (this.s * this.s) / 4;
			}
			move() {
				this.x += this.v * Math.cos(this.ang);
				this.y += this.v * Math.sin(this.ang);
				this.ang += (Math.random() * 20 * Math.PI) / 180 - (10 * Math.PI) / 180;
			}
			show() {
				if (c) {
					c.beginPath();
					c.arc(this.x, this.y, this.s, 0, 2 * Math.PI);
					c.fillStyle = fireflyColor;
					c.fill();
				}
			}
		}

		let f: firefly[] = [];

		window.addEventListener("resize", function () {
			(w = canvas.width = window.innerWidth), (h = canvas.height = window.innerHeight);
			loop(c, f, w, h, firefly);
		});

		loop(c, f, w, h, firefly);
		setInterval(() => {
			loop(c, f, w, h, firefly);
		}, 1000 / 30);
	}
}

export function updateFireflyColor(color: string) {
	fireflyColor = color;
}
