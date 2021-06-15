const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
global.__basedir = __dirname;

const app = express();
var corsOptions = {
  origin: "*"
};
const db = require("./app/models");
const Role = db.role;


app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb',  extended: true}));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to contour application." });
});
require('./app/routes/auth.routes')(app);;

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
//mongodb://localhost:27017/contour?retryWrites=true&w=majority
// mongodb+srv://admin:admin@cluster0.msmqd.mongodb.net/contour?retryWrites=true&w=majority
// /mongodb://admin:*****@165.22.18.97:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false
//mongodb://admin:admin@127.0.0.1:27017/?authSource=admin&readPreference=primary&ssl=false
db.mongoose
  .connect(`mongodb://admin:admin@165.22.18.97:27017/?authSource=admin&readPreference=primary&ssl=false`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

  var mongodb = require('mongodb');
  
function initial() {
    Role.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        new Role({
          name: "user"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'user' to roles collection");
        });
  
        new Role({
          name: "moderator"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'moderator' to roles collection");
        });
  
        new Role({
          name: "admin"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'admin' to roles collection");
        });
      }
    });
  }
  