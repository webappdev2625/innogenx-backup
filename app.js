require("dotenv").config();
const express = require("express");
// const session = require("express-session");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
// const compression = require("compression");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const crypto = require("node:crypto");
const http2 = require("node:http2");
const http2Express = require("http2-express-bridge");
const { readFileSync } = require("fs");
const autopush = require("http2-express-autopush");
const app = http2Express(express);
const WorkerPool = require("workerpool");
const pool = WorkerPool.pool({ minWorkers: "max" });
const routeHandler = require("./Server/routes/route-handler");
const expressStaticGzip = require("express-static-gzip");
console.log(
  `Worker Threads Enabled - Min Workers: ${pool.minWorkers} - Max Workers: ${pool.maxWorkers} - Worker Type: ${pool.workerType}`
);

const publicPath = path.join(__dirname, "public");
// app.use(express.static(publicPath));
app.use(
  "/",
  expressStaticGzip(publicPath, {
    enableBrotli: true,
    // index: false,
    customCompressions: [
      {
        encodingName: "deflate",
        fileExtension: "zz",
      },
    ],
    orderPreference: ["br", "gz"],
    // setHeaders: function (res, path) {
    //   let compressionAlgo;
    //   res.setHeader("Cache-Control", "public, max-age=31536000");
    //   if (req.header("Accept-Encoding").includes("br")) {
    //     compressionAlgo = ".br";
    //   } else compressionAlgo = ".gz";
    //   req.url = req.url + compressionAlgo;
    //   res.setHeader("Content-Encoding", compressionAlgo.substr(1));
    // },
  })
);

// app.use(compression());
// process.binding("http_parser").HTTPParser =
//   require("http-parser-js").HTTPParser;

// // redis@v4
// let RedisStore = require("connect-redis")(session);
// const { createClient } = require("redis");
// let redisClient = createClient({
//   legacyMode: true,
// });
// redisClient.connect().catch(console.error);
// app.set("trust proxy", 1); // trust first proxy
// app.use(
//   session({
//     store: new RedisStore({ client: redisClient }),
//     saveUninitialized: false,
//     secret: "keyboard cat",
//     resave: false,
//   })
// );
// redisClient.on("error", console.error);

app.disable("x-powered-by");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));
// app.use((req, res, next) => {
//   res.locals.cspNonce_css = crypto.randomBytes(16).toString("hex");
//   res.locals.cspNonce_js = crypto.randomBytes(16).toString("hex");
//   next();
// });
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      styleSrc: ["'self'", "*.google.com"],
      imgSrc: ["'self'"],
      scriptSrc: ["'self'", "*.googleapis.com", "*.gstatic.com"],
    },
  })
);
// app.use(
//   helmet.hsts({
//     maxAge: 63072000,
//     preload: true,
//   })
// );
app.use(helmet.noSniff());

const options = {
  key: readFileSync("./server.key"),
  cert: readFileSync("./server.crt"),
  allowHTTP1: true,
};

//This is a string path of the root from which static files are served. second and third parameters are optional
// app.use(autopush('./pages', {'staticOptions'}, {'assetCacheConfig'}))
app.use(autopush(publicPath));

// app.get("/", (req, res) => {
//   // res.push(["/css/index.min.css", "/js/index.min.js"], "./public");
//   res.sendFile(path.join(__dirname, "./public/html/index.html"));
// });

app.use(routeHandler);

const server = http2.createSecureServer(options, app);
const port = process.env.PORT || 8443;
server.listen(port, () => {
  console.log(`listening on port ${port}`);
});

// log any error that occurs when running the server
server.on("error", (err) => console.error(err));
