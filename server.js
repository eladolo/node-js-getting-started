// .env usage
require('dotenv').config();
// Require express
const express = require('express');
const cookieParser = require("cookie-parser");
const session = require('cookie-session');
// const redis   = require("ioredis");
// const redisStore = require('connect-redis')(session);
// const client  = new redis(
// 	{
//         host: process.env.REDIS_HOST,
//         port: process.env.REDIS_PORT,
//         username: process.env.REDIS_USER,
//         password: process.env.REDIS_PASSWORD
//  	}
// );
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
// Initialize express
const app = express();
// create a server
const PORT = process.env.PORT || 4555;
// API routes
const router = require('./router');

// session management
app.use(session({
    cookieName: 'chakstudio-api-session',
    // store: new redisStore({
    // 	host: process.env.REDIS_HOST,
	// 	port: process.env.REDIS_PORT,
	// 	password: process.env.REDIS_PASSWORD,
    // 	client: client
    // }),
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    cookie: {
      sameSite: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    },
    keys: ['x', 'y'],
    resave: false,
    genid: function(req) {
      	console.log('session id created');
    	return uuidv4();
	}
}));
app.use(function(req, res, next) {
    if (!req.session.views) {
        req.session.views = {};
    }
    // get the url pathname
    let pathname = req.url.split("/");
    pathname = pathname[pathname.length - 1];
    console.log("req: " + pathname);
    // count the views
    req.session.views[pathname == "" ? "home" : pathname] = (req.session.views[pathname] || 0) + 1;
    next();
});
// Setup cors
const whitelist = process.env.WHITE_LIST ? process.env.WHITE_LIST.split(" ") : [];
console.log(whitelist, "WL");
app.use(cors({
    origin: (origin, cb) => {
        if (whitelist.indexOf(origin) !== -1 || whitelist.length === 0) {
            cb(null, true);
        } else {
            cb(new Error(`Origin not allowed: '${origin}'`));
        }
    },
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));
// parse json objects
app.use(express.json());
// parse url encoded objects- data sent through the url
app.use(express.urlencoded({ extended: true }));
// cookie parser middleware
app.use(cookieParser());
// headers middleware
app.use(function(req, res, next) {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});
// start server listen
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// add modules routes
Object.entries(router).map(([key, val]) => {
    val.routes(app);
});
// default response
app.post('/*', async (req, res) => {
    res.status(201).json({
        code: 404,
        data: "Hello api 🌼"
    });
});
app.put('/*', async (req, res) => {
    res.status(201).json({
        code: 404,
        data: "Hello api 🌼"
    });
});
app.get('/*', async (req, res) => {
    res.status(201).json({
        code: 404,
        data: "Hello api 🌷"
    });
});
app.patch('/*', async (req, res) => {
    res.status(201).json({
        code: 404,
        data: "Hello api 🌹"
    });
});
app.delete('/*', async (req, res) => {
    res.status(201).json({
        code: 404,
        data: "Hello api 🌺"
    });
});