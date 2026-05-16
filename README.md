# 🐍 Snake Game

A classic Snake game built with vanilla HTML, CSS, and JavaScript — no frameworks, no dependencies, just open and play.

---

## 📁 Project Structure

```
snake-game/
├── index.html   # Game markup & layout
├── style.css    # Styling & dark theme
├── game.js      # Game logic & rendering
└── README.md    # You are here
```

---

## 🚀 How to Run

1. Download or clone the project folder.
2. Open `index.html` in any modern browser.
3. That's it — no build step, no server needed.

---

## 🎮 Controls

| Input | Action |
|-------|--------|
| `Arrow Keys` | Steer the snake |
| `W A S D` | Steer the snake |
| `Space` / `Enter` | Start / restart |
| On-screen buttons | Tap to steer (mobile) |
| Swipe on canvas | Swipe direction (mobile) |

---

## ⚙️ Configuration

Open `game.js` and tweak the constants at the top:

```js
const GRID  = 20;   // Grid size (cells per axis)
const CELL  = 16;   // Pixel size of each cell
const SPEED = 140;  // Milliseconds per tick (lower = faster)
```

---

## 🎨 Theming

All colors are CSS variables defined at the top of `style.css`:

```css
:root {
  --bg:       #0d1117;   /* page background   */
  --surface:  #161b22;   /* canvas background */
  --border:   #30363d;   /* UI borders        */
  --green:    #39d353;   /* snake & accents   */
  --food:     #f78166;   /* food dot          */
  --text:     #e6edf3;   /* primary text      */
  --muted:    #7d8590;   /* secondary text    */
}
```

Change any value to instantly re-theme the game.

---

## 🧠 How It Works

| File | Responsibility |
|------|----------------|
| `index.html` | Shell, canvas element, overlay, control buttons |
| `style.css` | Dark terminal theme, responsive layout |
| `game.js` | Game loop (`setInterval`), snake movement, collision detection, canvas rendering |

### Game loop
Every `SPEED` ms the `tick()` function:
1. Applies the buffered direction (`nextDir`)
2. Computes the new head position
3. Checks for wall or self-collision → game over
4. Moves the snake forward (unshift head, pop tail)
5. Checks food collision → grow + place new food
6. Calls `draw()` to re-render the canvas

---

## 📱 Mobile Support

- On-screen `↑ ← ↓ →` buttons for thumb control
- Swipe gestures on the canvas

---

## 🪪 License

MIT — free to use, modify, and distribute.
