# Kontra Experiments

I'm creating some new functionality for the [Kontra](https://straker.github.io/kontra/) game engine.

These features won't worry too much about final bundle size, but they're modular enough that you can only use the ones you need.

This was based on the tutorial for the [Haxeflixel](https://haxeflixel.com/documentation/tutorial/) engine.

The code is very messy. I'm mostly looking for feedback on how to implement these features. Don't judge. pls! =D

## Running the example

`npm i`

`npm start`

# Feature descriptions

Here are the experimental features developed.

## Depth Sort

You can add objects to a depth sort list, and it'll take care of rendering them in order, based on a parameter.

By default, we sort by the **y** value. If the object is closer to the bottom of the screen, it's rendered on top of the others.

## Collision Mapping

It'll get the tiles data, rows, width and height parameters and put it in an object to be used for the Raycasting feature.

## Raycasting

To check if the one object has a direct line of view to another point, we can use the Ray class to cast a ray and check if it hits the **collision map** or a sprite. If it doesn't, we know the 2 points have a direct line.

## Directional Collider

Based on an e-mail exchange with our lord and savior [@straker](https://github.com/straker), I created a way to check from which side a collision occured.

Since I check this by having a "thin" sensor object stuck to each side of the object, I had issues where the object would enter a little bit inside the wall, making 3 of the sensors touch the wall at the same time.

The **size** parameter is used to avoid. By testing, I found that if the **size** value is the same as the **speed** the object is moving, we don't have this issue.

## Helper functions

Used to configure the canvas and do some vector math.

## Log Dashboard (WIP)

A way to log quickly changing values without freezing your browser.