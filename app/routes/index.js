var express = require('express');
var router = express.Router();
const axios = require('axios')
const config = require('../config')
const fileUpload = require('express-fileupload');
const CircularJSON = require('circular-json');
const imageDataURI = require('image-data-uri')
const rateLimit = require('../middlewares/rateLimiter');
const rateLimiter = require('../middlewares/rateLimiter');

router.use(fileUpload());
router.use(rateLimit)

router.post("/decodeImage", async (req, res, next) => {
  try {

    // M A T H P I X    A P I    U R L
    const url = "https://api.mathpix.com/v3/text";

    // I N I T I A L I Z I N G    T H E    F I L E N A M E 
    //let image = req.files.image
     let imageurl = req.body.imageUrl
    // M O V E    I M G    T O    K Y C    P A T H
    // id.mv(path.join(config.imgPath, id.name));

    // S E T T I N G    U P    H E A D E R S 
    const headers = {};
    headers["Content-type"] = "application/json";
    headers["app_id"] = config.APP_ID;
    headers["app_key"] = config.APP_KEY;

    // B U F F E R    O F    I M A G E    F I L E 
    //let dataBuffer = image.data

    // M I M E 
    //var mime = image.mimetype
    //var imgType = mime.split(/[/]/);

    // I M A G E    T Y P E 
    //let mediaType = imgType[1];

    // I M A G E    D A T A    U R I 
    //var dataURI = await imageDataURI.encode(dataBuffer, mediaType)

    const body = {
      "src": imageurl,
      "formats": ["text", "data", "html", "latex_styled"],
      "data_options": {
        "include_asciimath": true,
        "include_latex": true
      }
    }

    const details = JSON.stringify(body);

    const options = {
      method: "POST",
      url: url,
      headers: headers,
      data: details,
    };

    const response = await axios(options);

    const result = JSON.parse(CircularJSON.stringify(response.data))

    const data = result.text;

    if (data == undefined || result.error == "Content not found") {
      return res.status(422).send({
        status: "Fail",
        message: "Content not found"
      })
    }

    const modifiedText = data.replace(/(\\\r\n|\n|\r|\\)/gm, '')
    console.log("MODIFIED TEXT:",modifiedText)
    return res.send({
      message: modifiedText,
      result: true
    })

  } catch (error) {

    console.log("ERROR:", error)

    res.status(500).send({
      status: "Fail",
      error: error.message
    })
  }
});

module.exports = router;
