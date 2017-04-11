var test = require('tape-catch');
var asciiStringSplit = require('../index.js');
var normalizeOptions = asciiStringSplit.normalizeOptions;


test('test option configurations', function (t) {
    
    // options param
    
    var a = {splitWords: true, preservedWords: []};
    var b = normalizeOptions();
    t.deepEquals(a, b, "when no options are provided, splitWords is true, preservedWords is an empty array");

    b = normalizeOptions({});
    t.deepEquals(a, b, "when empty options are provided, splitWords is true, preservedWords is an empty array");

    t.throws(function() { normalizeOptions(5); }, "options can only be undefined or an object" );

    // options.splitWords 
    
    b = normalizeOptions({splitWords: null});
    t.deepEquals(false, b.splitWords, "any options.splitWords value is normalized to a boolean");


    // options.preservedWords 
    
    t.doesNotThrow(function() { normalizeOptions({}); }, "preservedWords is not required in the options object.");
    t.doesNotThrow(function() { normalizeOptions({preservedWords: []}); }, "options.preservedWords must be an array");
    t.throws(function() { normalizeOptions({preservedWords: ''}); }, "options.preservedWords cannot be anything else");
    t.throws(function() { normalizeOptions({preservedWords: [5]}); }, "options.preservedWords entries must be strings");

    t.doesNotThrow(function() { normalizeOptions({}); }, "splitWords is not required in the options object.");
    
    t.end();
    
});

test('test strings with various whitespace', function (t) {
    var a = "a\nb c\td";
    var b = asciiStringSplit(a, 2);
    var c = ['a','b','c','d'];
    
    t.deepEquals(b, c, "string contains line breaks, tabs, and spaces");
    
    t.end();
});

test('test strings shorter than width', function (t) {

    var a = '';
    var b = asciiStringSplit(a, 10);
    var c = [''];
    t.deepEquals(b, c, "empty string");

    a = 'A B C';
    b = asciiStringSplit(a, 10);
    c = [a];
    t.deepEquals(b, c, "string shorter than width");
    
    t.end();

});

test('test wrappable word at width boundary', function (t) {

    var a = '123456 123456';
    var b = asciiStringSplit(a, 10);
    var c = ['123456', '123456'];
    t.deepEquals(b, c, "6 character word with not enough room to split");

    a = '12345 123456';
    b = asciiStringSplit(a, 10);
    c = ['12345 123-', '456'];
    t.deepEquals(b, c, "6 character word with exactly enough room to split");

    a = '1234 123456';
    b = asciiStringSplit(a, 10);
    c = ['1234 123-', '456'];
    t.deepEquals(b, c, "6 character word with more than enough room to split");

    t.end();

});

test('test un-wrappable word at width boundary', function (t) {

    var a = '123456 12345';
    var b = asciiStringSplit(a, 10);
    var c = ['123456', '12345'];
    t.deepEquals(b, c, "5 character word with 4 spaces left until width is reached");
    
    a = '1234';
    t.throws(function() { asciiStringSplit(a, 1); },  "4 character word with 1 character width ");

    a = '1234';
    b = asciiStringSplit(a, 2);
    c = ['1-', '2-', '34'];
    t.deepEquals(b, c, "4 character word with 2 character width ");
    
    t.end();
    
});

test('test wrappable word which is longer than width', function (t) {

    var a = '12345678901234567890';
    var b = asciiStringSplit(a, 10);
    var c = ['123456789-', '012345678-', '90'];
    t.deepEquals(b, c, "word wraps when longer than width");
    
    t.end();
    
});


test('test non-default options', function(t) {

    var a = '12345678901234567890';
    var b = asciiStringSplit(a, 10, {splitWords: false});
    var c = [a];
    t.deepEquals(b, c, "words don't wrap when wordSplit === false");

    var a1 = '12345678901234567890';
    a = 'abc def ' + a1 + ' hij klm';
    b = asciiStringSplit(a, 10, {preservedWords: [a1], });
    c = ['abc def', a1, 'hij klm'];
    t.deepEquals(b, c, "words in preservedWords[] don't wrap when wordSplit === true");
    
    t.end();
    
});


