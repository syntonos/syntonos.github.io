---
# ====================================================================================================
# PROJECT TEMPLATE.  Copy this file into a category folder and rename it, e.g.
#     content/projects/hardware/my-new-thing.md
# The file name becomes the web address (#/hardware/my-new-thing): lowercase-with-dashes.
# Put the project's pictures in:  public/images/hardware/my-new-thing/   (then just write the file names below)
#
# Only `title` and `year` are required (plus a `summary` or a write-up below). Delete any line you don't need.
# Files whose name starts with an underscore (like this one) are ignored by the site.
# The build checks every file and stops with a plain message if something is off (a typo, a missing picture...).
# ====================================================================================================

title: My new thing
year: 2026                       # shown next to the category.  Or use a full date:  date: 2026-03-14
summary: One or two lines for the home page and for projects with no write-up.

# ---------- order ----------
order: 1                         # place in its category (1 = first). Without it: newest first.
featured: true                   # true = shown in "Selected work" on the home page
featuredOrder: 1                 # place in Selected work (1 = first)
draft: false                     # true = hidden on the real site. In `npm run dev` it still shows, marked "(draft)".

# ---------- pictures: just the file names in public/images/<category>/<project>/ ----------
colors: ['#5b8fe8', '#b8a4ee']   # gradient shown while a project has no pictures (two colors)
images: [photo-1.jpg, photo-2.jpg]   # the home page: rotates through these. Any number of pictures.
cover: photo-3.jpg               # the tile on the category page (a name, or a list that fades through on hover).
                                 # Leave out to use `images`.
gallery:                         # the slide carousel on the project page (write-up on the left, slides on the right)
  - photo-1.jpg
  - src: photo-2.jpg
    caption: Shown under the picture
  - video: https://www.youtube.com/watch?v=XXXXXXXXXXX   # a YouTube or Vimeo link
    caption: Demo video
  - video: demo.mp4              # a short clip in the project's picture folder (plays muted, on a loop)

# ---------- the category page ----------
size: 2x1                        # block size as columns x rows (width 1-4, height 1-3). If ANY project in a
                                 # category has a size, that category uses your sizes (others are 1x1).
tags: [PCB, Python]              # the filter links on the category page. Leave out to use `skills`.

# ---------- the project page ----------
scores:                          # the X/10 boxes (hover or tap for the note). Use any labels, 4 looks best.
  - label: Fun
    value: 8
    note: Shown on hover.
  - label: Objective difficulty
    value: 6
skills: [KiCad, C++, Soldering]  # shown as a dotted line under the write-up (and used as tags)
wiki: https://wiki.example.com/my-new-thing   # or `wiki: true` to use the wiki address from site.js
github: https://github.com/you/my-new-thing  # or `github: true` for your GitHub from site.js
links:                           # as many extra links as you like
  - label: Build video
    url: https://example.com
    home: true                   # true = this link also appears on the home page under the project
linksOnHome: false               # true = show ALL of this project's links on the home page
---

Everything below the line is the **write-up**, written in markdown. Headings, lists, links, **bold**, *italic*, quotes
and code all work.

To add a picture, put the file in `public/images/<category>/<project>/` and write just its name:

![A caption](photo-1.jpg)

If there is no write-up, the `summary` above is used instead.
