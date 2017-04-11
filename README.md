# ascii-string-split  ![Build Status](https://travis-ci.org/tcowley/ascii-string-split.svg?branch=master)

## Description

Using Node.js, split an ASCII string into shorter strings of a given length. The library uses a simple algorithm to split longer words as necessary so that they fit. 

This is a very basic library that helps with simple line wrapping inside JavaScript CLI apps. You pass in a string, and it returns an array of strings, none of which is longer than the provided length.

Please note that the library won't split multi-byte strings nicely, but it will split lots of non-ASCII characters just fine.

## Installation

Add this library to your current Node.js project using npm:

```
npm install --save ascii-string-split
```

Or, checkout the source:

```
git clone https://github.com/tcowley/ascii-string-split
```


## Code Examples

### Basic Usage

The basic usage is to allow word splitting on all words larger than 6 letters, or on any word larger than the desired string length.

```JavaScript
var asciiStringSplit = require('ascii-string-split');

var myString = 'a very very long string full of words composed entirely of ASCII characters.';
var strLength = 21;

console.log(asciiStringSplit(myString, strLength));
```

This example will output: 

```bash
[ 
  'a very very long string',
  'full of words composed',
  'entirely of ASCII chara-',
  'cters.' 
]
```

Notice the word 'characters' was split into 'chara-' + 'cters' to make each string as long as possible.

If the desired string length is very short, any word larger than that length will be split apart:

```JavaScript
var asciiStringSplit = require('ascii-string-split');

var myString = 'a few words';
var strLength = 2;

console.log(asciiStringSplit(myString, strLength));
```

This example will output: 

```bash
[ 
  'a', 
  'f-', 
  'ew', 
  'w-', 
  'o-', 
  'r-', 
  'ds' 
]
```

### Avoiding Word Splitting 

You can suppress word splitting for all words, or only specific words. This allows you to keep URLs, proper names, variable names, etc, from being broken up when they really shouldn't be.

```JavaScript
var asciiStringSplit = require('ascii-string-split');

var myString = 'a very very long string full of words composed entirely of ASCII characters.';
var strLength = 21;
var options = {splitWords: false}; 

console.log(asciiStringSplit(myString, strLength, options));
```

This example will output:

```bash
[ 
  'a very very long string',
  'full of words composed',
  'entirely of ASCII',
  'characters.' 
]
```

Notice that 'characters' was *not* split into chunks, instead it starts the next string.

If we use the ```preservedWords``` option, the words it contains will never be split, even if ```splitWords = true```.

```JavaScript
var asciiStringSplit = require('ascii-string-split');

var myString = 'a few words';
var strLength = 2;
var options = {preservedWords: ['few']};

console.log(asciiStringSplit(myString, strLength, options));
```

This example will output: 

```bash
[ 
  'a', 
  'few', 
  'w-', 
  'o-', 
  'r-', 
  'ds' 
]
```

Notice that 'few' did not get split apart, but 'words' did split. 


## API Reference 

### Basics

The library exports one method, which accepts three parameters:

| Param | Values | Description |
| ----- | ------- | ------ |
| **asciiString** | Any length of ASCII string  | The string that should be split into smaller strings. Note that the library won't split multi-byte strings nicely, but it will split lots of non-ASCII characters just fine. |
| **strLength**   | Any integer greater than 2 | The maximum length, in characters, that the smaller strings should be. The length must be at least 2 because the smallest split string is 1 character plus a hyphen! |
| **options**   | An object | An optional object containing options. See the **options** table below for details. |

### Options

| Option | Values | Description |
| ----- | ------- | ------ |
| **splitWords** | A boolean  | When ```true```, words may be split into chunks so that strings are as long as possible. See **How Word Splitting Works** for details. Default is true. |
| **preservedWords**   | An array of words. | Each 'word' is a string of characters, and cannot contain any whitespace. When they fully match a word in the source string, no splitting will occur, even if ```splitWords = true```. This is useful for URLs, proper names and variable names that would get garbled if they were split apart. *Hint*: If your words in this array are still getting split, check your original string to see if they have punctuation attached. Eg: to match 'splittable' inside 'this word is splittable.', you need to append a '.' to match correctly.  |

The return value is always an array. Illegal values throw an error.


### How String Splitting Works

* The library splits your source string across normal whitespace: line breaks, spaces and tabs. Each resulting non-whitespace string is considered a 'word'. Notice that these are not dictionary words, but rather any contiguous set of non-whitespace characters. This means that punctuation, etc, will be included in words. 
* The library copies these words one at a time to a new string, until:
    * The new string is filled, OR
    * The original string has no more words to copy.
* If the new string is already filled, then another new string is started.
* If a word won't fit inside the new string, then it tries to split it, so that at least part of the word will fit. 
    * A hyphen is added to the first part, so that it is clear that the word has been split.
    * Small words aren't normally split, just big ones. See **How Word Splitting Works** for an explanation.
    * You can avoid word splitting altogether by using either ```splitWords = true``` or ```preservedWords``` options.


### How Word Splitting Works

There are two reasons for splitting a word:

* **The word is pretty long, and can be split into smaller *readable* chunks**
    * This only applies to words that are **at least 6 characters long**, so that at least 3 characters are left in each half of the split string. The resulting strings will be readable, even if the split is not at a natural location like the end of a syllable.
* **The word, all by itself, is longer than the strLength parameter**
    * When this occurs, there is no choice but to split the word, unless word splitting is disabled. The library will start a new string with the word, and split it at ```strLength```, minus one character so that a hyphen can be added at the end. 
    * This behaviour only really matters when max-length is very small, or words are very large. For example:
    ```JavaScript
    asciiStringSplit("word", 2); // returns: ['w-', 'o-', 'rd']
    ```
    This example also shows why ```strlength``` must be at least 2 characters, because the smallest split string is 1 character plus a hyphen!


## Tests

Tests are run automatically using Travis CI, but you can run them yourself quite easily.

```bash
$ git clone https://github.com/tcowley/ascii-string-split
$ cd ascii-string-split
$ npm install
$ npm test

// test output displays here
```


The project is using [Tape](/substack/tape) for writing tests. For a small project like this, tape is _very_ easy to use.

## License

[ISC](https://opensource.org/licenses/ISC)



