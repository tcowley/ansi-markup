// random tests

var ansiMarkup = require('./index.js');
var sampleData = require('./sample-data.js');
var helperData = sampleData.helperData;
var resetTag = helperData.tagMap.reset;
var pad = Array(100).join(' ');
var samples = [];

sampleData.forEach(function(data) {
    var input = 'text' + data.input.join(' text ') + ' text';
    var result = ansiMarkup(input);
    console.log((data.msg + pad).slice(0, 30), result);
    //console.log((pad).slice(0, 30), input);
    //console.log((pad).slice(0, 30), result.replace(/\u001b/g,''));
});

samples.push( 'plain {red}red {blue}blue{/blue} red {/red} plain');
samples.push( 'plain {reset}{red}{bold}{underline}reset text{/reset} red, bold, underline');


var singleTags = Object.keys(helperData.tagMap).slice(1).map(function(tagName) {
    return helperData.tagMap[tagName].openTag + tagName + helperData.tagMap[tagName].closeTag ;
});
samples.push(singleTags.slice(0,4).join(', '));
samples.push('{inverse}' + samples.slice(-1)[0]);
samples.push(singleTags.slice(4,15).join(', '));
samples.push('{inverse}' + samples.slice(-1)[0]);
samples.push(singleTags.slice(15).join(', '));
samples.push('{inverse}' + samples.slice(-1)[0]);

//var largeString = helperData.allTags.join('text');
//for(var i =0; i < 10; i++) largeString += largeString + "\n";
//samples.push(largeString);

samples.forEach(function(sample) { 
    console.log('')
    console.log(sample);
    console.log(ansiMarkup(sample));
    //console.log(ansiMarkup(sample).replace(/\u001b/g, ''));
});



