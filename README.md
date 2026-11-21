# Twin Tails — Spot the Difference

[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/vivcupu21/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/vivcupu21/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

A complete, original spot-the-difference game that plays offline in a desktop
browser from static files — no network requests, no downloaded assets. Two
near-identical pictures sit side by side; find all 7 differences in each of
the 3 hand-drawn scenes. Built for the
[make.fun bounty](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
"Make the best spot the difference game".

## Play

Serve `game/` with any static server and open `game/index.html` in desktop
Chrome, for example:

```sh
python3 -m http.server 8080 --directory game
# open http://localhost:8080/
```

- **Mouse:** click a difference on either picture. A green circle marks it on
  both pictures; a wrong click costs 25 points.
- **H** — hint (pulses an unfound difference, −50 points, 3 per level)
- **M** — mute / unmute sound · **R** — restart level · **N** — next level
- **Esc** — back to menu · **1 / 2 / 3** — pick a level from the menu

## Levels

1. **Taman Pagi** — a sunny garden with a cat on a bench
2. **Kafe Kucing** — a cozy cat café, tea still warm
3. **Pantai Senja** — a beach at sunset

Each level hides 7 differences. Find them all for a time bonus and up to
3 stars; finish all 3 levels to win.

## How it is made

- Every picture is drawn with plain Canvas 2D shapes in
  `game/src/scenes.js` — no image, font, or sound files, nothing fetched.
- Sounds are tiny WebAudio oscillator beeps made in code
  (`game/src/game.js`); there are no audio files.
- `game/src/game.js` is the engine: state, input, HUD, scoring, and the
  `?demo=` states used to take the screenshots from the game's own code.
- `main.ts` (Node 22, stdlib only) copies `game/` and `screenshots/` to the
  output directory and writes `dossier.json` with
  `vendor/makefun-game.ts`, the kit's library, unchanged.

## Screenshots

Real renders of the game's own code, in `screenshots/`:

1. `1-start.jpg` — menu with the three levels
2. `2-play.jpg` — Taman Pagi mid-game: 3 found, 4 remaining
3. `3-play.jpg` — Kafe Kucing mid-game: 5 found, 2 remaining
4. `4-win.jpg` — level complete, 3 stars

## License

MIT — see [LICENSE](LICENSE).
