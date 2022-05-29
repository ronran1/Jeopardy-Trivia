const fs = require('fs')
const figlet = require('figlet')
const data = require("./data.json");
const express = require('express')
const app = express()
let stats = require('./playerStats.json')

let players = stats
let newData = []

function modifyJson(file, data) {
  fs.writeFileSync(file, data)
  players = JSON.parse(fs.readFileSync(file))
}

app.use(express.static('./public'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.get('/api', (req, res) => {
  let question = data[Math.ceil(Math.random()*100000)]
  let userName = req.query.users
  console.log("Question requested")
  if(!players.find(el => el.player == userName)) {
    newData = [...players, { player: userName, score: 0 }]
    modifyJson('./playerStats.json', JSON.stringify(newData, null, 2))
  }
  res.status(200).json({ success: true, data: question, stats: getStats(userName) || 0 })
})

app.post('/api', (req, res) => {
  console.log(req.body)
  if (players.find(el => el.player == req.body.player)) {
    newData = players.map(el => {
      if (req.body.player === el.player) {
        el.score = req.body.score
      }
      return el
    })
  }
  console.log(newData);
  modifyJson('./playerStats.json', JSON.stringify(newData, null, 2))
  res.status(200).send("stfu")
})

app.all('*', (req, res) => {
  let x = figlet("404", function(err, data) {
    if(err) {
      console.log("sum went wrong");
    }
    return data
  })
  res.status(404).send(x)
})
function getStats(player) {
  for (key in players) {
    console.log(players[key])
    if(players[key].player == player) {
      console.log("Player found")
      return players[key].score
    }
  }
}

app.listen(5000, () => {
  console.log("server listening on port 5000")
})

// Old http based code for reference

// const server = http.createServer((req, res) => {
  //   const page = url.parse(req.url).pathname;
  //   const params = querystring.parse(url.parse(req.url).query);
  //   console.log(page);
  //   const htmlPages = (pg) => {
    //     fs.readFile(pg, function(err, data) {
//       res.writeHead(200, {'Content-Type': 'text/html'});
//       res.write(data);
//       res.end();
//     });
//   }
//   const apiPages = (pg) => {
//         res.writeHead(200, {'Content-Type': 'application/json'});
//         const objToJson = data[Math.ceil(Math.random()*10000)]
//         res.end(JSON.stringify(objToJson));
//   }
//   if (req.method == 'POST' && page == '/api') {
//     console.log(params)
//     req.on('data', function(data) {
      
//     })
//   }
//   if (page == '/') {
//     htmlPages('index.html')
//   }
//   else if (page == '/img/jeopardy_logo.jpg') {
//     fs.readFile('img/jeopardy_logo.jpg', function(err, data) {
//       res.writeHead(200, {'Content-Type' : 'image/jpeg'});
//       res.write(data)
//       res.end()
//     })
//   }
//   else if (page == '/api') {
//     apiPages(page)
//   }//else if
//   else if (page == '/css/style.css'){
//     fs.readFile('css/style.css', function(err, data) {
//       res.write(data);
//       res.end();
//     });
//   }else if (page == '/js/main.js'){
//     fs.readFile('js/main.js', function(err, data) {
//       res.writeHead(200, {'Content-Type': 'text/javascript'});
//       res.write(data);
//       res.end();
//     });
//   }else{
//     figlet('404!!', function(err, data) {
//       if (err) {
//           console.log('Something went wrong...');
//           console.dir(err);
//           return;
//       }
//       res.write(data);
//       res.end();
//     });
//   }
// });

// server.listen(8000);
