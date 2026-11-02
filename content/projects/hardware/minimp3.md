---
title: miniMP3
year: 2025
order: 5
images: [mp3-pcb-back.png]
cover: mp3-pcb-back.png
gallery: [mp3-3D.png, mp3-3D-2.png, mp3-pcb-back.png, mp3-pcb-front.png]
scores:
  - label: Fun
    value: 8
    note: Honestly just a fun tiling challenge; it reminded me of a lot of puzzle? games? Routing differential pairs under these conditions was not fun though.
  - label: Usability
    value: 10
    note: It's an MP3 player! And it's incredibly compact.
  - label: Difficulty (Subjective)
    value: 4
    note: Not that complex. Baby's third? Electronics project.
  - label: Difficulty (Objective)
    value: 4
    note: Good project for learning more PCB design. Firmware is a bit tricky though.
tags: [Embedded, PCB Design]
skills: [Embedded, KiCad, C++, Firmware]
wiki: https://minayeh.com/wiki
github: https://github.com/syntonos/miniMP3
---

A very tiny MP3 player, designed to take up as little space as possible. The footprint was designed around two rotary switches (volume, selection) and a 1.54" OLED screen. Every single component had to fit into that space, so that was a fairly fun layout challenge. Designed in KiCad. Firmware written in C++.
