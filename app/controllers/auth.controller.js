const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
     host: 'smtp.ionos.de',
     secure: false, 
     port:587,
    //service: 'outlook',
    auth: {
      //user: 'M.MEHREZ@NU.EDU.EG',
      //pass: 'ITUMEN'
      user: 'bewerbung@betriebsservice-ooe.info',
      pass: 'Bewerbung2?'
    }

  });

exports.signup = (req, res) => {
  const user = new User({
    username: req.params.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  console.log(user);
  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({ message: "User was registered successfully!" });
            // res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.send({ message: "User was registered successfully!" });

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 604800 // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
        profile: user.profile
      });
    });
};
//User encrypr
exports.UserEncryptPassword = (req, res) => {
  let password = bcrypt.hashSync(req.params.password, 8)
  let message = `You Encrypted Password is: ${password}
  `
  res.send(message)
};
//User check encryption
exports.UserChcekPassword = (req, res) => {
  let password = req.body.passwordText
  let passwordEncrypt = req.body.passwordEncrypt
  let passwordCheck = bcrypt.compare(password, passwordEncrypt, function(err, result) {
    if (err) {
      return err
    }
    let message = `You Encrypted Password is: ${result}
    `
    res.send(message)  
  });};

//User forget password email
exports.userSendPasswordMail = (req, res) => {
  let email = req.params.email
  console.log('mail', email);
  User.findOne({
    email: email
  }).exec((err, user) => {
    if (err || !user) {
      console.log('err', err);
      return res.send(404, { msg: "User Not found." });
    }
    else {
      const token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 604800 // 24 hours
      });
      const mailOptions = {
        from: 'bewerbung@betriebsservice-ooe.info',
        to: email,
        subject: 'Password reset',
        text: `Dear ${user.username}
        Follow this link for your password reset http://jobs.koordinierungsstelle.at/#/resetPassword/${user._id}/${token}`,
      };      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          res.send(error)
        } else {
          console.log('Email sent: ' + info.response);
          res.send(info)
        }
      });
    }
  })
};

//User forget password email
exports.userUpdatePassword = (req, res) => {
  let password = req.body.password
  let userid = req.body.userid
  let token = req.body.token
  console.log('mail', );
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    if(decoded.id != userid){
      return res.status(401).send({ message: "Unauthorized!" });
    }
  });
  User.update({
    "_id": userid
  }, {
    $set: {
      "password": bcrypt.hashSync(req.body.password, 8)
    }
  }).exec((err, user) => {
    console.log('err', err);
    console.log('user', user);
    return res.send({ message: "Success!" });
  })
};
