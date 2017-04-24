var test = require('tape-catch');
var ansiMarkup = require('../index.js');
var sampleData = require('../sample-data.js');


test('test ansiMarkup(input, options)', function (t) {
    var input;
    var options = ansiMarkup.normalizeOptions();
    var helperData = ansiMarkup.generateHelperData(options);
    var allTags = helperData.allTags;
    var leftDelimiter = options.leftDelimiter;
    var tags;
    var largeString = allTags.join('text');
    for(var i =0; i < 10; i++) largeString += largeString;

    // large data sets
    t.doesNotThrow(function() { ansiMarkup(largeString, leftDelimiter, allTags); }, 'input must be a string');
    t.end();
});


test('test parseInput(input, leftDelimiter, allTags)', function (t) {
    var input;
    var options = ansiMarkup.normalizeOptions();
    var helperData = ansiMarkup.generateHelperData(options);
    var allTags = helperData.allTags;
    var leftDelimiter = options.leftDelimiter;
    var tags;
    
    // BASIC
    t.throws(function() { ansiMarkup.parseInput(null, leftDelimiter, allTags); }, 'input must be a string');
    input = '';
    result = {};
    result.content = [''];
    result.tags = [];
    t.deepEquals(result, ansiMarkup.parseInput(input, leftDelimiter, allTags), 'input can be an empty string');
    
    // TAGS
    input = allTags.join('');
    result = {};
    result.content = allTags.reduce(function(l, r) { return l.concat(null, ''); }, ['']);
    result.tags = allTags.slice();
    t.deepEquals(result, ansiMarkup.parseInput(input, leftDelimiter, allTags), 'all tags are matched');

    input = allTags.join('').toUpperCase();
    result = {};
    result.content = allTags.reduce(function(l, r) { return l.concat(null, ''); }, ['']);
    result.tags = allTags.map(function(tag) { return tag.toUpperCase();});
    t.deepEquals(result, ansiMarkup.parseInput(input, leftDelimiter, allTags), 'tags are matched regardless of case');
    
    // ESCAPED DELIMITERS
    
    input = leftDelimiter + leftDelimiter;
    result = {};
    result.content = ['', leftDelimiter, ''];
    result.tags = [];
    t.deepEquals(result, ansiMarkup.parseInput(input, leftDelimiter, allTags), 'double delimiter is matched correctly');

    input = leftDelimiter + leftDelimiter + leftDelimiter;
    result = {};
    result.content = ['', leftDelimiter , leftDelimiter];
    result.tags = [];
    t.deepEquals(result, ansiMarkup.parseInput(input, leftDelimiter, allTags), 'triple delimiter is matched correctly');

    // TAGS + DELIMITERS
    
    tags = allTags.slice(0,2);
    input = tags.join(leftDelimiter + leftDelimiter);
    result = {};
    result.content = tags.map(function(tag) { return ['', null, '']; });
    result.content = result.content.reduce(function(l, r) { return l.concat('{' , r); });
    result.tags = tags.slice();
    t.deepEquals(result, ansiMarkup.parseInput(input, leftDelimiter, allTags), 'tags separated by escaped delimiters match correctly');
    
    t.end();
    
});

test('test normalizeTags(tags, tagMap)', function (t) {
    
    sampleData.forEach(function(data) {
        var options = ansiMarkup.normalizeOptions();
        var helperData = ansiMarkup.generateHelperData(options);
        var tagMap = helperData.tagMap;
        t.deepEquals(data.result, ansiMarkup.normalizeTags(data.input, tagMap), data.msg);
    });
    t.end();
});

test('test swapTagsForCodes(input, tagMap, stripCodes)', function(t) {
    var input;
    var result;
    var options = ansiMarkup.normalizeOptions();
    var helperData = ansiMarkup.generateHelperData(options);
    var tagMap = helperData.tagMap;
    var allTags = helperData.allTags;
    
    t.throws(function() { ansiMarkup.swapTagsForCodes(null, tagMap, false)}, 'input must be an array');

    input = allTags.slice();
    result = input.map(function() { return ''; });
    t.deepEquals(result, ansiMarkup.swapTagsForCodes(input, tagMap, true), 'tags map to empty strings when stripCodes = true');
    
    input = allTags.slice();
    result = input.map(function(tag) {
        var tagName = ansiMarkup.getTagNameFromTag(tag);
        return /\//.test(tag) ? tagMap[tagName].closeCode : tagMap[tagName].openCode;
    });
    t.deepEquals(result, ansiMarkup.swapTagsForCodes(input, tagMap, false), 'tags map to correct ansi codes when stripCodes = false');
    
    t.end();
});

test('test mergeCodesAndContent(content, codes, tagMap, stripCodes)', function(t) {
    var content;
    var codes;
    var result;
    var options = ansiMarkup.normalizeOptions();
    var helperData = ansiMarkup.generateHelperData(options);
    var tagMap = helperData.tagMap;
    var allTags = helperData.allTags;
    
    t.throws(function() { ansiMarkup.mergeCodesAndContent(null, null, tagMap, false)}, 'first two inputs must be arrays');
    
    content = Array
        .apply(null, Array(allTags.length))
        .map(String.prototype.valueOf, "text")
        .reduce(function(l,r) { return l.concat(null, r); }, ['text']);
    codes = allTags.map(function(tag) {
        var tagName = ansiMarkup.getTagNameFromTag(tag);
        return tagMap[tagName][/\//.test(tag) ? 'closeCode' : 'openCode'];
    });
    result = codes.reduce(function(l,r) { return l.concat(r, 'text')}, ['text']);
    result.push(tagMap.reset.openCode);
    result.unshift(tagMap.reset.openCode);
    t.deepEquals(result, ansiMarkup.mergeCodesAndContent(content, codes, tagMap, false), 'all possible codes merge with content');
    
    t.end();

});




