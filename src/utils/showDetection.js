const showDetection = (prediction) => {
    // draw the detections bounding boxes, as well as the labels, and confidence score over the video
    console.log("Show detection: ", prediction);
    const c = document.getElementById("c");
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const font = "24px helvetica";
    ctx.font = font;
    ctx.textBaseline = "top";
    prediction.forEach((prediction) => {
        const x = prediction.bbox[0];
        const y = prediction.bbox[1];
        const width = prediction.bbox[2];
        const height = prediction.bbox[3];

        // Draw the bounding box.
        ctx.strokeStyle = "#2fff00";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, width, height);

        // Draw the label background.
        ctx.fillStyle = "#2fff00";

        // ganti 'preson' jadi 'toilet'
        let predictionText = prediction.class;
        if (predictionText == "person") {
            predictionText = "toilet";
        }

        const textWidth = ctx.measureText(predictionText).width;
        const textHeight = parseInt(font, 10);

        // draw top left rectangle
        ctx.fillRect(x, y, textWidth + 10, textHeight + 10);

        // draw bottom left rectangle
        ctx.fillRect(
            x,
            y + height - textHeight,
            textWidth + 15,
            textHeight + 10
        );

        // Draw the text last to ensure it's on top.
        ctx.fillStyle = "#000000";
        ctx.fillText(predictionText, x, y);
        ctx.fillText(prediction.score.toFixed(2), x, y + height - textHeight);
    });
};

export default showDetection