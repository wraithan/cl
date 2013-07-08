var http = require('http')
  , fs = require('fs')
  , request = require('request')
  , parse = require('json-parse-stream')
  , through = require('through')
  , url = 'http://portland.craigslist.org/jsonsearch/apa/mlt?useMap=1&srchType=A&maxAsk=1400&bedrooms=2&addTwo=purrr&real=1'

function stringifyBuffer() {
  return through(write)
  function write(data) {
    this.queue(data.toString())
  }
}

function filter() {
  return through(write)
  function write(data) {
    if (data.Latitude <= 45.580683 &&
        data.Latitude >= 45.523616 &&
        data.Longitude <= -122.608728 &&
        data.Longitude >= -122.69364 &&
        data.PostedDate >= Math.floor(Date.now()/1000)-(84600*2)) {
      this.queue(data)
    }
  }
}

function getEntries() {
  return through(write)
  function write(data) {
    if (data.type === "object" && data.value.PostingURL) {
      this.queue(data.value)
    }
  }
}

function jsonify() {
  var stream = through(write, end)
    , first = true
  return stream

  function write(data) {
    if (first) {
      this.queue('[' + JSON.stringify(data))
      first = false
    } else {
      this.queue(',' + JSON.stringify(data))
    }
  }
  function end() {
    this.queue(']')
    this.queue(null)
  }
}

var server = http.createServer(function(req, res) {
  console.log(req.method + ' ' + req.url)
  if (req.url === '/') {
    fs.createReadStream(__dirname + '/html/index.html')
      .pipe(res)
  } else if (req.url === '/cl.json') {
    request(url)
      .pipe(stringifyBuffer())
      .pipe(parse())
      .pipe(getEntries())
      .pipe(filter())
      .pipe(jsonify())
      .pipe(res)
  } else if (req.url === '/js/cl.js') {
    fs.createReadStream(__dirname + '/js/cl.js')
      .pipe(res)
  } else if (req.url === '/css/base.css') {
    fs.createReadStream(__dirname + '/css/base.css')
      .pipe(res)
  }
})

var port = process.env.port || 4567

server.listen(port, function() {
  console.log('Listening on: http://localhost:' + port)
})
