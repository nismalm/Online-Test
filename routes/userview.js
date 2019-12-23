const express     = require('express'),
      app         = express(),
      userFns     = require('../functions/functions'),
      passport    = require('passport'),
      qnDb        = require('../models/questions'),
      stdDat      = require('../models/stddata')

app.get('/login', userFns.isNotLoggedIn, (req, res) => {
  res.render('stdlogin')
})

app.post('/login', userFns.isNotLoggedIn, passport.authenticate('local', {
    successRedirect : '/user/window',
    failureRedirect : '/user/login'
  }), (req, res) => {
})

app.get('/window', userFns.isUserLoggedIn, (req, res) => {
  res.render("studentst")
})

app.post('/startexam', userFns.isUserLoggedIn, (req, res) => {
  stdDat.find({regno: req.user.username}, 'exam_stat', (emrr, ress) => {
    if (emrr) {
      console.log(`\n${new Date().toLocaleString()} : Error on finding question 1.0 ::\n${err}\n`)
      res.send(`<script>alert("Server Error Contact Invigilator")</script>`)
    }else {
      // if (ress[0].exam_stat == 0) {
        qnDb.find({qno: 1}, '-__v -option', (err, results) => {
          if (err) {
            console.log(`\n${new Date().toLocaleString()} : Error on finding question 1.1 ::\n${err}\n`)
            res.send(`<script>alert("Server Error Contact Invigilator")</script>`)
          }else {
            stdDat.updateOne({regno: req.user.username}, { $set: { exam_stat: 1, start_time: new Date }}, (erru, upd) => {
              if (erru) {
                console.log(`\n${new Date().toLocaleString()} : Error on finding question 1.2 ::\n${err}\n`)
                res.send(`<script>alert("Server Error Contact Invigilator")</script>`)
              }else {
                stdDat.find({regno: req.user.username}, 'regno name start_time', (ermr, rses) => {
                  if (ermr) {
                    console.log(`\n${new Date().toLocaleString()} : Error on finding question 1.3 ::\n${err}\n`)
                    res.send(`<script>alert("Server Error Contact Invigilator")</script>`)
                  }else {
                    res.render('examqn', {data: results[0], user: rses[0]})
                  }
                })
              }
            })
          }
        })
      // }else {
        // res.send(`<script>alert("User Already Taken Exam")</script>`)
      // }
    }
  })
})

app.get('/qn/:id', userFns.isUserLoggedIn, (req, res) => {
  qnDb.find({qno: req.params.id}, '-__v -option', (err, results) => {
    if (err) {
      console.log(`\n${new Date().toLocaleString()} : Error on finding question 1.1 ::\n${err}\n`)
      res.send(`<script>alert("Server Error Contact Invigilator")</script>`)
    }else {
      stdDat.find({regno: req.user.username}, 'regno name start_time', (ermr, rses) => {
        if (ermr) {
          console.log(`\n${new Date().toLocaleString()} : Error on finding question 1.3 ::\n${err}\n`)
          res.send(`<script>alert("Server Error Contact Invigilator")</script>`)
        }else {
          res.render('examqn', {data: results[0], user: rses[0]})
        }
      })
    }
  })
})

app.get('/logout', userFns.isUserLoggedIn, (req, res) => {
  req.logout()
  res.redirect('/user/login')
})

module.exports = app