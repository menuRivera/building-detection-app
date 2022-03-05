import showDetection from './showDetection'

const detectFromVideoFrame = (model, video) => {
  console.log("detectFromVideoFram");

  model.detect(video).then(
    (predictions) => {
      console.log("Predictions: ", predictions);
      showDetection(predictions); // show object detection

      requestAnimationFrame(() => {
        detectFromVideoFrame(model, video);
      });
    },
    (error) => {
      console.log(error);
    }
  );
};

export default detectFromVideoFrame

