# normalizeImageWidth
## Description
A small Google App Script for fixing image widths in a document.

This was used to help speed up the process of screenshotting guitar tabs from youtube videos, and compositing them into one document on Google Doc.

## Usage

1. Paste `Code.gs` into a new Google App Script project.

2. Replace the `<URL>` with the url to your document with all the images pasted.

3. Run the script (Accepting any permissions from Google).

## Example:
### Pre-normalized
![](./readme/pre-normalized.png)

Before running the script, pasted images have different kind of sizes due to screenshotting different regions of the sheet music in the video. Each line contains screenshots to form 4 bars. Once we have reached 4 bars, we commit a new line (or "Paragraph" in the editor's sense), and we continue screenshotting. 

In our case, the screenshot above shows 3 bars on the first page and then 1 bar on the second page. All of these images are inline and in the same paragraph. Then a new paragraph and 2 images to form 4 additional bars.

As we can see these images needs to be normalized/fixed such that each line's images have uniform heights and each image's width add up to some target width (calculated with the page width and padding)

### Post-normalized
![](./readme/post-normalized.png)

After running the script, we see that each line of images now correctly show the 4 bars, by having their width fixed to match up to the total target width. Lines that have 2 or more images are fixed by calculating the ratio needed to have the same height (and fit the width). This is done by solving the linear equation regarding the correct ratios.