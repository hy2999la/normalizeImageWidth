function normalizeImageWidths() {
  var doc = DocumentApp.openByUrl('<URL>');

  console.log('Normalizing ' + doc.getName());

  var body = doc.getBody();

  // (96/72) is the ratio from points to pixels
  // -36 for the left and right page margins
  // -10 to account for paragraph spacing inbetween inline images
  const targetWidth =
    (96 / 72) * (body.getAttributes()['PAGE_WIDTH'] - 36) - 10;

  console.log('Target Width: ' + targetWidth);

  // 18 points = 0.25 inches
  body.setMarginLeft(18);
  body.setMarginRight(18);
  body.setMarginTop(18);
  body.setMarginBottom(18);

  var paragraphs = body.getParagraphs();
  for (let i = 0; i < paragraphs.length; i++) {
    let imgsInP = paragraphs[i].getNumChildren();
    if (imgsInP == 0) {
      // If there's any paragraphs with no images, skip
      continue;
    }

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

    if (imgsInP == 1) {
      // Just set the image to the target width and the height based on aspect ratio
      imgs[0].setWidth(targetWidth);
      imgs[0].setHeight((targetWidth * imgHeights[0]) / imgWidths[0]);
    } else {
      let denom = imgWidths[0];

      for (let n = 1; n < imgsInP; n++) {
        denom += (imgWidths[n] * imgHeights[0]) / imgHeights[n];
      }

      let x_1 = targetWidth / denom;

      imgs[0].setWidth(imgWidths[0] * x_1);
      imgs[0].setHeight(imgHeights[0] * x_1);

      for (let n = 1; n < imgsInP; n++) {
        let x_n = (imgHeights[0] * x_1) / imgHeights[n];
        imgs[n].setWidth(imgWidths[n] * x_n);
        imgs[n].setHeight(imgHeights[n] * x_n);
      }
    }
  }
}
