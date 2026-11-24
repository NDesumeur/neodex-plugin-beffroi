# Belfry

A pixel art jumping game: a little bell ringer climbs the floors of a bell tower by running and jumping, before the tower catches up. Climb as high as you can.

*Version française : [README.md](README.md)*

## Announced combos, characters and achievements (new in 1.2.0)

- **Big combos are announced**: at the end of a combo (at least two jumps of 2 floors or more), the word bursts out in large letters in the middle of the screen, depending on the combo size: NICE (4 floors), SUPER (7), GREAT (12), TERRIFIC (20), INCREDIBLE (30), FABULOUS (45), EXTRAORDINARY (70), LEGENDARY (100). Below: the floors, the number of jumps and the points (the square of the floors). A shower of sparks bursts from the bell-ringer, the arpeggio gets longer for big combos, the screen flashes from GREAT on and the colours cycle. A jump of 4 floors or more at once is shown too ("5 FLOORS!"); the combo counter grows from 12.
- **Three characters**, chosen with ← → on the start screen: **the bell-ringer**, balanced; **the tightrope walker** (unlocked at a 30-floor record), who accelerates and runs faster but jumps a little lower; **the acrobat** (unlocked at 60), who can **jump a second time in the air**, once per jump. Each has their own colours.
- **Six trick achievements**, in the ACHIEVEMENTS card: 100 floors without touching a wall, a 50-floor combo, 10 bells in one game, 30 notes in one game, floor 100, 80 floors without touching a bird. A green banner announces each one you unlock.

## Controls

- **← →** (or **Q D**, **A D**): run.
- **Space**, **↑** or **Z**: jump. **Hold the key** to go higher, let go quickly for a small jump.
- **Gamepad**: stick or d-pad to run, **A**, **B** or up to jump, **Start** to begin or pause.
- **Mouse** or **finger**: press on the left or right of the game to run, in the middle to jump.
- **P** or **Esc**: pause. The **Fullscreen** button is next to New game.

## How it works

- **The faster you run, the higher you jump.** The gauge at the top shows your speed: at full speed, a jump clears 3 floors, with a somersault.
- The **walls** send you back without slowing you down: run into a wall to head the other way at full speed.
- The jump is forgiving: it goes off even if you press a little before landing, or just after leaving a beam.
- **Beams** can be crossed from below and get shorter as you climb. From the 12th floor, some **move**, others are **cracked** and fall soon after you land; in the clock, some **slide**.
- The first floors show the moves on the wall. On the **5th floor**, a countdown, then the tower scrolls by itself, a little faster every 30 seconds. If it catches you from below, you lose.

## The bell tower

You go through **the cellars** (torches), **the timber frame** (lanterns), **the bell room**, **the clock** (gears, clock face), **the stained glass**, then **the top**, open to the sky, under the stars and the moon.

- **Bells** throw you upwards when you touch them in the air (+15 points).
- Music **notes** are worth 25 points each.
- **Birds** (pigeons, then bats) cut your momentum and your combo.

## Points

- Each new floor is worth **10 points**.
- **Combos**: chain jumps of at least 2 floors. The combo stops on a small jump or after 3 seconds, and is worth the square of the floors gained (8 floors in a combo = 64 points), from 2 jumps.

## Stats

The Records panel keeps your **best score**, your **highest floor**, the number of **games**, and the totals of **floors climbed**, **combos**, **notes** and **bells rung**.

## Data and sync

Your best score and totals are saved by NeoDex, backed up and synced between your PCs if sync is on.

## Install

In NeoDex: **NeoStore → Discover → Belfry → Install**.

Making a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
