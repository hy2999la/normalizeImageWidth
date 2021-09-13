# normalizeImageWidth
## Description
A small Google App Script for normalizing image widths in a document for each line

This was used to help speed up the process of screenshotting guitar tabs from youtube videos, and composite them into one document

## Example:
### Pre-normalized
![](./readme/pre-normalized.png)

Before running the script, pasted images have different kind of sizes due to screenshotting different regions of the sheet music. Each "line" or "paragraph" contains 1, 2, or 3 images to form 4 bars. As we can see these images needs to be normalized/fixed such that each line's images have uniform heights and each image's width add up to some target width (which was 752px after some testing)

### Post-normalized
![](./readme/post-normalized.png)

After running the script, we see that each line of images now correctly show the 4 bars, by having their width fixed to match up to the total target width. Lines that have 2 images are completely fixed by also calculating the ratio needed to have the same height (and fit the width). This is done by solving a linear equation system of 2 variables.

```
width_1 * x_1 + width_2 * x_2 = targetWidth
height_1 * x_1 - height_2 * x_2 = 0
```

x_1 and x_2 represents the scaling multiplier needed to correctly fit the two images. We equate the total width with the target width, as well as equating the final heights of both images.

The final solution to these variables can then be solved via substitution:
```
let x_2 = targetWidth / (width_1 * height_2 / height_1 + width_2);
let x_1 = height_2 / height_1 * x_2;
```

This works in the case of only having two images in the same paragraph, and solving a linear equation with 3 unknowns are out of the scope of GAPs. Therefore, for lines that contain 3 images, we simply scale the width based on their width ratio. We then scale the height based on the aspect ratio of the original image, we then have to manually change the image's scale in Google Docs, but since the images correctly fit each line already, this makes the process easier than before.