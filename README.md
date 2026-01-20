# BOOTED v1

<table>
<tr>
<td width="30%">
  <img src="https://github.com/user-attachments/assets/34473723-04a6-4008-98ec-0b4933c179a7" width="100%" alt="booted demo"/>
</td>
<td>
  <h3>At a glance</h3>
  
  Front end web app that communicates with an <a href="https://github.com/dotkalm/booted-server">image recognition api</a> to overlay an object onto a photo from device’s camera using threeJS.
</td>
</tr>
</table>

## Overview 
<table>
  
<tr>
<td>
<h3>Background</h3>

</td>
<td>
  I was living in Santa Monica, CA, and often saw very expensive cars parked on the street, naturally I wanted to boot them. 
  
</td>
</tr>

<tr>
  
<td>
  <h3>Concept</h3>

</td>

<td>
Place a `parking enforcement boot` on photos of cars.
  
</td>

</tr>

<tr>

  <td>
<h3>Why?</h3>

</td>
<td>
Pranking people
  
</td>
</tr>
<tr>
<td>
<h3>Technical Goal</h3>

</td>
<td>
Overlay 3d asset on 2-d image, scale correctly, rotate correctly, place on correct spot with correct lighting.
  
</td>
</tr>
</table>

## Front end requirements 
1. Send image to server
2. Receive coordinates of car tire bounding box and basic geometric heuristics from backend.
3. Correctly orient 3d asset, scale, and place accordingly

## Known imitations of v1
1. Always chooses tire on the right of the image
2. Only basic perspective is created using 1 axis determined by the car's wheels
3. Lighting is not matched


## How I made v1
<table>
  
<tr>
<td with="30%">
<img width="100%" alt="Storybook screenshot" src="https://github.com/user-attachments/assets/d3dbde3a-559c-4b29-a50a-d24693412a0d" />
</td>
<td>
<h3>Developed With Fixtures using Storybook</h3>
Created fixtures to mock api response and used storybook to help establish the baseline orientation of the 3d asset
</td>
</tr>
<tr>
<td with="30%">
<img width="100%" alt="zAxis" src="https://github.com/user-attachments/assets/a54aacc8-9e9e-490a-b72e-b7e7cc2dd193" />
</td>
<td>
<h3>Establishing Z-Axis</h3>
I realized that I could approximate the z-axis of the object by drawing a line from the center of each tire and calculating the angle of that line. 
</td>
</tr>
<tr>
<td with="30%">
<img width="100%" alt="zAxis" src="https://github.com/user-attachments/assets/3c533349-f094-4dd9-9dc1-eaa06bcfe26f" />
  
</td>
<td>
<h3>Scaling object and placing on target</h3>
  
  1. After orienting the asset on the correct z-axis I then create a 2d image from the 3d context. 

  2. Once the asset is 2d I scale the circular clamp of the boot according to the size of the tire's ellipse.

3. I then calculate the distance of the car tire from the center of the image and use those coordinates to shift the 2d parking boot onto the target. 
</td>
</tr>
</table>


## What to expect from v2
<table>
<tr>
<td width="30%">  
  <h3>Leverage homography</h3>
</td>
<td>


  1. Correctly determine the camera's perspective in the original photo
  2. Apply the perspective from the original world-view to the camera perspective in threeJs
    <img width="60%" height="60%" alt="homography" src="https://github.com/user-attachments/assets/02389e69-2c66-48cc-92e3-36b148c30b07" />

</td>
</tr>
<tr>
<td width="30%">  
  <h3>Apply lighting</h3>
</td>
<td>


  1. Collect lighting heuristics from API
  2. Use lighting sources in threeJs to match asset to scene
</td>
</tr>
</table>
