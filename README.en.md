# Belfry

A pixel art jumping game: a little bell ringer climbs the floors of a bell tower by running and jumping, before the tower catches up. Climb as high as you can.

*Version française : [README.md](README.md)*

## Controls

- **← →** (or **A D**, **Q D**): run.
- **Space**, **↑** or **W**: jump.
- **Mouse** or **finger**: press on the left or right of the game to run, in the middle to jump.
- **P** or **Esc**: pause.

## How it works

- **The faster you run, the higher you jump.** The gauge at the top shows your speed: at full speed, a jump clears 3 floors.
- **Walls** bounce you back without slowing you: run into a wall to head the other way at full speed.
- **Beams** can be crossed from below: you land on them when falling. They get shorter as you climb, and change from wood to stone then copper every 25 floors. A sign marks every tenth floor.
- From **floor 5**, the tower scrolls by itself, a bit faster every 30 seconds. If it catches you from below, you lose.
- Each new floor gives **10 points**.
- **Combos**: chain jumps of at least 2 floors. The combo stops on a small jump or after 3 seconds, and scores the square of the floors gained (8 floors in a combo = 64 points), from 2 jumps on.

## Stats

The Records panel keeps your **best score**, the number of **games**, the total **floors climbed** and the number of **combos**.

## Data and sync

Your best score and totals are saved by NeoDex, backed up and synced between your PCs if sync is on.

## Install

In NeoDex: **NeoStore → Discover → Belfry → Install**.

Making a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
