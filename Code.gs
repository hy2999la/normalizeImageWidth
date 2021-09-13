function normalizeImageWidths() {
  const targetWidth = 752.0;

  var body = DocumentApp.getActiveDocument().getBody();

  var paragraphs = body.getParagraphs();
  for (let i = 1; i < paragraphs.length; i++) {
    let imgsInP = paragraphs[i].getNumChildren();
    let imgs = [];
    let imgHeights = [];
    let imgWidths = [];

    let totalWidth = 0;

		for (let j = 0; j < imgsInP; j++) {
			imgs[j] = paragraphs[i].getChild(j);
			imgHeights[j] = imgs[j].getHeight();
			imgWidths[j] = imgs[j].getWidth();
			totalWidth += imgWidths[j];
		}

		let widthDiff = targetWidth - totalWidth; // We need to scale our images to fit this width

    if (imgsInP == 1) {
			// Just set the image to the target width and the height based on aspect ratio
			imgs[0].setWidth(targetWidth);
			imgs[0].setHeight(targetWidth * imgHeights[0] / imgWidths[0]);
    } else if (imgsInP == 2) {
			// The more common case where there are only 2 images inline that needs to be normalized
			// Solve for a linear equation system of 2 variables, by substitution
			// The widths have to add up to the target width
			// width1 * x_1 + width2 * x_2 = targetWidth

			// The heights have to be the same
			// height1 * x_1 = height_2 * x_2

			let x_2 = targetWidth / (imgWidths[0] * imgHeights[1] / imgHeights[0] + imgWidths[1]);
			let x_1 = imgHeights[1] / imgHeights[0] * x_2;

			imgs[0].setWidth(imgWidths[0] * x_1);
			imgs[0].setHeight(imgHeights[0] * x_1);
			imgs[1].setWidth(imgWidths[1] * x_2);
			imgs[1].setHeight(imgHeights[1] * x_2);

    } else {
      // We go through each image and we scale it proportional to the width ratios between each image
			// For this case, (images more than 2), we shrink it to one line and normalize the height manually
      for (let j = 0; j < imgsInP; j++) {
        let widthToScale = widthDiff * imgWidths[j] / totalWidth; // How much do we need to scale the width of this image, by getting the percent of the diff based on the width ratios between images
        let heightToScale = widthToScale * imgHeights[j] / imgWidths[j]; // How much do we need to scale the height of this image, by getting the height diff based on the image's aspect ratio
        imgs[j].setWidth(widthToScale + imgWidths[j]);
        imgs[j].setHeight(heightToScale + imgHeights[j]);
      }
    }
  }
}