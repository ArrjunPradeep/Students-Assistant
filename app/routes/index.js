var express = require('express');
var router = express.Router();
const axios = require('axios')
const config = require('../config/config')
const fileUpload = require('express-fileupload');
const CircularJSON = require('circular-json');
const imageDataURI = require('image-data-uri')
const rateLimit = require('../middlewares/rateLimiter');
const solutionsModel = require('../models/solutions')
require('array-foreach-async');

router.use(fileUpload());
router.use(rateLimit)

router.post("/decodeImage", async (req, res, next) => {
  try {

    // M A T H P I X    A P I    U R L
    const url = "https://api.mathpix.com/v3/text";

    // I N I T I A L I Z I N G    T H E    F I L E N A M E 
    let imageurl = req.body.imageUrl

    // S E T T I N G    U P    H E A D E R S 
    const headers = {};
    headers["Content-type"] = "application/json";
    headers["app_id"] = config.APP_ID;
    headers["app_key"] = config.APP_KEY;

    const body = {
      "src": imageurl,
      "formats": ["text", "data", "html", "latex_styled"],
      "include_line_data": true,
      "data_options": {
        "include_asciimath": true,
        "include_latex": true,
        "include_mathml": true
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
      console.log("NOT FOUND")
      return res.status(422).send({
        status: "Fail",
        message: "Content Not Found",
        result:false,
        type:"nil"
      })
    }

    let decodeInfo = result.line_data
    let diagramDetections =[]

    decodeInfo.forEach(result => {
      diagramDetections.push(result.type)
    });

    if(diagramDetections.includes('diagram')){
      console.log("DIAGRAM FOUND")
      return res.send({
        status:"Success",
        message: imageurl,
        result: false,
        type:"diagram"
      })
    }else{
      console.log("DIAGRAM NOT FOUND")
      const modifiedText = data.replace(/(\\\r\n|\n|\r|\\)/gm, '')
      console.log("MODIFIED TEXT:",modifiedText)

      let solutionsInfo = await solutionsModel.findOne({question:modifiedText}).lean().exec()
  
      if(solutionsInfo!=null){
        return res.status(200).send({
          status:"Success",
          message: solutionsInfo.answer,
          result: true,
          type:"text"
        })
      }else{
        return res.status(200).send({
          status:"Success",
          message: modifiedText,
          result: false,
          type:"text"
        })
      }
    }

  } catch (error) {

    console.log("ERROR:", error)

    return res.status(500).send({
      status: "Fail",
      message: error.message,
      result:false
    })
  }
});

module.exports = router;
