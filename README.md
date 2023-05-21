# Wave Function Collapse
Procedural image generation using an algorithm rooted in quantum mechanics.<br>
Visit: https://quinnbooth.github.io/Wave-Function-Collapse/
<br><br>
<p align="center">
  <img src="./images/README/blob.gif" alt="Blob" width="375" height="313">
  <br>
  <em>Figure 1: Blob image set.</em>
</p>
<br><br>
<p align="center">
  <img src="./images/README/farm.gif" alt="Farm" width="375" height="313">
  <br>
  <em>Figure 2: Farm image set.</em>
</p>

## Author

👨‍💻 **Quinn Booth** - `qab2004@columbia.edu`
<br>

## Uploading Custom Images

When you visit the webpage linked above, you will notice an image set selector on the left side. As you scroll down within the selector, you will come across an upload button. Clicking on this button will open a menu that allows you to select multiple PNG files from your computer. Once you have selected your desired set of images, upload them all at once.<br>

An additional image set has been included in this repository specifically for testing the custom upload feature. You can locate it in the "images/box" directory. It's important to note that unlike the other image sets available, this collection of PNG files is not a pre-defined preset; the script isn't aware of its existence before you upload it. The following images exist within the test set:<br>

| ![box0](./images/box/box0.png) | ![box1](./images/box/box1.png) | ![box2](./images/box/box2.png) | ![box3](./images/box/box3.png) | ![box4](./images/box/box4.png) |
|-----|-----|-----|-----|-----|
| ![box5](./images/box/box5.png) | ![box6](./images/box/box6.png) | ![box7](./images/box/box7.png) | ![box8](./images/box/box8.png) | ![box9](./images/box/box9.png) |<br>

When creating your own image set, there are some rules to keep in mind. First, all PNGs must be 50x50 pixels. The program uses RGB values along each side of the images to determine which PNGs (in various orientations) can be neighbors. Here's how it works, treating the upper left pixel as (0, 0):<br>

- For the top edge, the program samples points (12, 0), (25, 0), and (37, 0).
- For the right edge, the program samples points (49, 12), (49, 25), and (29, 37).
- For the bottom edge, the program samples points (12, 49), (25, 49), and (37, 49).
- For the left edge, the program samples points (0, 12), (0, 25), and (0, 37).<br>

By analyzing these RGB readings, the program determines which PNG images can be neighbors with each other. Let's consider an example scenario: Suppose we have a tile with RGB readings 'red, blue, red' on its right side. In order for another image to be its right-hand neighbor, the RGB readings on the left side of the second image must match those of the first tile (its right-hand readings). This matching pattern ensures that the images can seamlessly connect with each other in the generated output. Below is an image showing the important pixels in red. You can find this PNG in "images/README" and use it as a template.
<br><br>
<p align="center">
  <img src="./images/README/rgb_example.png" alt="Grid" width="200" height="200">
  <br>
  <em>Figure 3: PNG specifications.</em>
</p>
<br>
<br>

# How it Works

