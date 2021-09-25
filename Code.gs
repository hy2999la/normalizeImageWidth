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
    } else {
			// Solve for a linear equation system of n variables, by substitution
			// The widths have to add up to the target width
			// width1 * x_1 + width2 * x_2 + ... + widthn * x_n = targetWidth

			// The heights have to be the same
			// height1 * x_1 = height2 * x_2
			// ...
			// height1 * x_1 = heightn * x_n

			// Solving the system gives us
			// x_1 = targetWidth / (width1 + width2*height1/height2 + ... + widthn*height1/heightn)
			// We then substitute our x_1 value to 

			let denom = imgWidths[0];

			for (let n = 1; n < imgsInP; n++) {
				denom += imgWidths[n] * imgHeights[0] / imgHeights[n];
			}

			let x_1 = targetWidth / denom;

			imgs[0].setWidth(imgWidths[0] * x_1);
			imgs[0].setHeight(imgHeights[0] * x_1);

			for (let n = 1; n < imgsInP; n++) {
				let x_n = imgHeights[0] * x_1 / imgHeights[n];
				imgs[n].setWidth(imgWidths[n] * x_n);
				imgs[n].setHeight(imgHeights[n] * x_n);
			}
    }
  }
}