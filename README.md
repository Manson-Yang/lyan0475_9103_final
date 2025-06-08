# Wheels of universe——Time-Based Cosmic Cycle Animation
## Overview：
Wheels of universe is a time-based looping animation effect that simulates a running universe. It consists of three parts: a randomly generated starry sky, dynamically looping meteors, and a planet with rotation as the main effect.

## How to interact?
### •Just open the page
All effects will play automatically after the web page is opened and will loop infinitely.
### •Resize your browser window
The canvas and all visuals will adapt responsively, always filling the window.

## Select animation method
**Time-Based:** Employ timers and events for animation.

## My Individual Approach
### Meteors:
Each meteor uses a class instance storing its own angle, length, weight and speed, and moves diagonally (right-down, controlled by angleDeg around 145°).
Tail length, direction and respawn logic create natural meteor showers.

### Central star:
#### Breathing Central Star
At the very center is a stylized star shape, which constantly expands and contracts in a “breathing” motion.

The star’s radius is updated each frame using a simple increment/decrement approach (middleStarSize += sizeDirection * starSizeStep). When it reaches the upper or lower threshold, the direction reverses, creating a smooth and continuous “breathing” cycle.

#### Rotating Orb
Surrounding the pulsing star is a set of concentric circular forms and decorative elements that rotate as a group around the center.

The entire structure is rotated by incrementing a coreRotation angle and applying a rotate(coreRotation) transformation within a push()/pop() block. All elements drawn inside this block inherit the rotation, resulting in smooth, continuous motion.

#### Radiating Rays
A network of lines outward from the core, like energetic bursts.

These are drawn using functions such as .drawLine() and .diverPoint(), which calculate positions using trigonometric functions to spread points and lines evenly around the center.

#### Orbiting Circles
Several small circles move along concentric paths (orbits) around the central star, forming dynamic, animated “rings.”

Circular positions are calculated for each point along the orbit, with possible randomization or phase differences to avoid uniformity. In the code, this is achieved by functions like .decorationCircle(), which uses trigonometric formulas to place circles along circular paths.

#### Summary
My animation focuses on showing the state of the movement of planets in the universe. I use time-loop animation to correspond to each part, trying to show the laws of the operation of the universe.

## Visual & Artistic Inspiration
Reference 1:https://openprocessing.org/sketch/1150505 ![An image of the Star](assets/1.png)
Reference 2:https://openprocessing.org/sketch/2567734 ![An image of meteor](assets/2.png)
Reference 3:https://www.pinterest.com/pin/70437487264302/ ![An image of main body](assets/3.png)

#### These works inspired my decision to:
1.Use real-world diagonal angles for meteors, not just horizontal/vertical.
2.Design a rotating and running main object.