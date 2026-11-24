# Nasosky

A self-playing 3D isometric tower defense in a single HTML file, defended by five friends.

Based on [Cinderwatch](https://github.com/kevintngo/cinderwatch) by Kevin T. Ngo (MIT license).

## The defenders

| Key | Defender | What he does | Cinderwatch equivalent |
| --- | --- | --- | --- |
| `1` | **Kenny** | A squad of Kennys with wooden sticks block and whack monsters on the road. | Guard post |
| `2` | **Dzakes** | Throws nuts. Fast, and can hit flyers. | Archer tower |
| `3` | **Mates** | Plays gamelan music. Everything in range is slowed down. No damage. | Storm spire |
| `4` | **Kouc** | Writes code on his computer. Level 1 has no effect. Level 2 makes 10 coins every 10 seconds. Level 3 makes 30 coins every 30 seconds. | (new) |
| `5` | **Vojta** | Lobs sausages that burst on the ground. | Bombard |

The AI commander never builds Kouc. Build and upgrade him yourself to earn coins.

## Play

Open `index.html` in a browser. It works from `file://` with no server and no network.

The game plays itself. Click a pad to take command. Press `C` to hand it back to the AI.

| Input | Action |
| --- | --- |
| Click an empty pad | Open the build menu |
| Click a defender | Upgrade or sell |
| `1` to `5` | Pick a defender |
| `U` / `X` | Upgrade / sell the selected defender |
| `Space` | Call the next wave early |
| `C` | Hand command to the AI, or take it |
| `M` | Mute |

## Build

```bash
python3 tools/faces.py   # only after changing photos in assets/photos (needs Pillow)
python3 tools/build.py   # joins src/*.js into index.html
```

`tools/faces.py` crops the photos in `assets/photos/` (not in the repo; add your own) to round faces and embeds them in `src/05-faces.js`.
Change the crop circle for each photo in the `CROPS` table at the top of that script.

## Test

`tools/cdp.js` drives headless Chrome. On Linux, set `CHROME` to the browser path, and `CHROME_FLAGS=--no-sandbox` if Chrome has no usable sandbox.

```bash
node tools/cdp.js "seed=4&ff=30" wait:3000 shot:battle
```

## License

[MIT](LICENSE). The build includes [three.js](https://threejs.org) r170, also MIT ([notice](vendor/LICENSE-three.txt)).
