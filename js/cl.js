$(function onload() {
  $.getJSON('/cl.json', format)
})

function format(data) {
  var places = $('#places')
  data.forEach(function(ele) {
    var place = $('<div>', {
      class: 'place'
    })
    place.appendTo(places)
    if (ele.ImageThumb) {
      $('<img>', {src: ele.ImageThumb}).appendTo(place)
    }
    $('<a>', {
      text: ele.PostingTitle,
      href: ele.PostingURL,
      class: 'title'
    }).appendTo(place)
    $('<p>', {
      text: formatDelta(Math.floor(Date.now()/1000) - ele.PostedDate) + ' old'
    }).appendTo(place)
    $('<p>', {
      text: '$' + ele.Ask
    }).appendTo(place)
  })
}

var second = 1
  , minute = second*60
  , hour = minute*60
  , day = hour*24
  , month = day*30
  , year = day*365.24
  , places = 2

function formatDelta(delta) {
  if (delta < second) {
    return delta + ' miliseconds'
  } else if (delta < minute) {
    return (delta/second).toFixed(places) + ' seconds'
  } else if (delta < hour) {
    return (delta/minute).toFixed(places) + ' minutes'
  } else if (delta < day) {
    return (delta/hour).toFixed(places) + ' hours'
  } else if (delta < month) {
    return (delta/day).toFixed(places) + ' days'
  } else if (delta < year) {
    return (delta/month).toFixed(places) + ' months'
  } else {
    return (delta/year).toFixed(places) + ' years'
  }
}