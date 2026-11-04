---
title: CUPI CAN Board + Firmware Stack (Autonomous Hexapod)
year: 2026
summary: Cornell University Physical Intelligence (Autonomous Hexapod) - PCB for controlling actuator motion, full-stack firmware development for CAN communication buses. Takes USB-C input from the Jetson t5000 and converts to FDCAN differential bus for 18 actuators. Designed in Altium. Written in C and Python.
order: 2
featured: true
featuredOrder: 2
colors: ['#e89ab6', '#a9b7f0']
images: [can-schematic.png]
scores:
  - label: Fun
    value: 3
    note: Fairly useful, but not particularly riveting.
  - label: Usability
    value: 10
    note: Extremely useful and reusable. Most robotics and exoskeletons use CAN communication, and require conversion between different communication protocols.
  - label: Difficulty (Subjective)
    value: 3
    note: Not that bad. I feel like I've just done this a lot recently.
  - label: Difficulty (Objective)
    value: 6
    note: Firmware stack took a while. Plus lots of differential pairs to wire.
size: 1x2
tags: [Embedded, PCB Design]
skills: [KiCad, C++, 3D printing, Embedded systems]
---
