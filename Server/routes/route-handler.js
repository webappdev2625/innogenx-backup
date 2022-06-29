const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { exit } = require("process");
// import responsiveImageWebp from "../../temp3/images/test/input/5ff29a2e5ac90.webp?sizes[]=300,sizes[]=600,sizes[]=1024,sizes[]=2048&format=webp";
// const publicPath = path.join(__dirname, "../public");
let compressionAlgo;
// console.log(responsiveImageWebp);

router.get("/about", function (req, res) {
  res.send("About this page");
});

router.get("/optimize-images", function (req, res) {
  const sharp = require("sharp");
  const inputFolderPath = path.join(
    __dirname,
    "./../../temp3/images/test/input"
  );
  const outputFolderPath = path.join(
    __dirname,
    "./../../temp3/images/test/output"
  );
  fs.readdir(inputFolderPath, function (err, files) {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    const widthSizes = [320, 640, 960, 1280, 1600, 1900, 2400];

    async function resizeImage(widthSize, file) {
      try {
        const img = sharp(
          path.join(__dirname, "./../../temp3/images/test/input/" + file)
          // path.join(
          //   __dirname,
          // "./../../temp3/images/test/input/24hrs.png"
          // "./../../temp3/images/test/input/5ff29a2e5ac90.webp"
          // )
        );
        return await img.metadata().then(function (metadata) {
          const finalWidth =
            widthSize < metadata.width ? widthSize : metadata.width;
          const filename = file.substr(0, file.lastIndexOf("."));
          console.log(metadata.width, widthSize, finalWidth, filename);
          const outputFile = path.join(
            outputFolderPath,
            filename + "-" + finalWidth + ".webp"
          );
          return (
            img
              .resize(finalWidth, null, {
                fit: sharp.fit.inside,
                withoutEnlargement: true,
              })
              .toFormat("webp")
              .toFile(
                path.join(
                  __dirname,
                  "./../../temp3/images/test/output/" +
                    filename +
                    "-" +
                    finalWidth +
                    ".webp"
                )
              )

              // path.join(
              //   __dirname,
              // "./../../temp3/images/test/output/24hrs-320.webp"
              // "./../../temp3/images/test/output/5ff29a2e5ac90-320.webp"
              // )

              .then(() => {
                console.log("Image created: ", outputFile);
                // if (metadata.width <= widthSize) return false;
                // else return true;
                return metadata.width <= widthSize ? false : true;
              })
          );
        });

        // .toFile("./images/test/output/5ff29a2e5ac90-320.webp");
      } catch (error) {
        console.log(error);
      }

      // console.log(responsiveImageWebp);
    }
    files.forEach(async function (file) {
      console.log(file);
      // loop2: widthSizes.forEach((widthSize) => {
      for (let widthSize of widthSizes) {
        let result = await resizeImage(widthSize, file);
        console.log("result: ", result);
        if (result == false) break;
      }
    });
    res.send("Images have been optimized");
  });
  //
});

// Home page route.
router.get("/", function (req, res) {
  // if (req.header("Accept-Encoding").includes("br")) {
  //   compressionAlgo = ".br";
  // } else compressionAlgo = ".gz";
  // req.url = req.url + compressionAlgo;
  // console.log(req.header("Accept-Encoding"));
  // res.setHeader("Content-Encoding", compressionAlgo.substr(1));
  // console.log(compressionAlgo);

  // if (req.url.split(".").pop() == "html")
  //   res.setHeader("Content-Type", "text/html; charset=UTF-8");
  // if (req.url.split(".").pop() == "js")
  //   res.setHeader("Content-Type", "application/javascript; charset=UTF-8");
  // if (req.url.split(".").pop() == "css")
  //   res.setHeader("Content-Type", "text/css; charset=UTF-8");
  // res.header();
  res.push(
    [
      // "/css/index.min.css" + compressionAlgo,
      // "/js/lozad.min.js" + compressionAlgo,
      // "/js/index.min.js" + compressionAlgo,
      "/css/index.min.css",
      "/js/index.min.js",
      "/images/logo-121.webp",
      "/images/certified-73.webp",
      "/images/insuredwork-73.webp ",
      "/images/24hrs-73.webp 73w",
      "/images/ontime-73.webp 73w",
      "/images/call-icon-14.webp",
    ],
    "public"
    // "../public"
    // "./public"
  );
  // res.sendFile(
  //   path.join(__dirname, "../../public/index.html") + compressionAlgo
  // );
  // console.log(compressionAlgo);
  // res.sendFile("index.html" + compressionAlgo);
  res.setHeader("Content-Encoding", "br");
  res.sendFile("index.html.br");
  // res.sendFile(path.join(__dirname, "../../public/html/index.html"));
});

module.exports = router;
