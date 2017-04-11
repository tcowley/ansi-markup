// --------------------------------------------------------------------------------
// ASCII String Split Library
// --------------------------------------------------------------------------------

module.exports = exports = asciiStringSplit;
asciiStringSplit.normalizeOptions = normalizeOptions;
    
function asciiStringSplit(str, width, options) {
    var words = str.split(/\s/);
    var lines = [];
    var line = '';
    options = normalizeOptions(options);
    
    if (width < 2) {
        throw new Error('width must be at least 2 characters');
    }
    
    words.forEach(function(word) {
        var offset;
        
        // ---------------------------------------------------------
        // STEP 1: add words to the lines
        // ---------------------------------------------------------
        
        // CASE 1: starting a new line
        if (!line.length) {
            line = word;
        }
            
        // CASE 2: appending a word that fits on the current line
        else if ( line.length + 1 + word.length  <= width ) {
            line += ' ' + word;
        }
        
        // CASE 3: word doesn't fit on the current line, and it is not allowed to be split
        else if (!options.splitWords || !!~options.preservedWords.indexOf(word)) {
            line.length && lines.push(line);
            line = word;
        }
            
        // CASE 4: append a big word that will be split across lines
        // - line has at least 5 spaces left, which is room for: 1 space, 3 chars and a hyphen
        // - word is at least 6 letters long
        // - resulting split ensures at least 3 characters on both lines
        else if ( line.length + 5 <= width && word.length > 5) {
            // fill the rest of the line, leaving room for a trailing '-'
            offset = width - line.length - 2; 
            // edge case: ensure there are at least 3 chars after the split
            offset = offset > word.length - 3 ? word.length - 3 : offset;

            line += ' ' + word.substring(0, offset) + '-';
            lines.push(line);
            line = word.substring(offset);
        }
            
        // CASE 5: word doesn't fit on the line, so start a new line
        else {
            lines.push(line);
            line = word;
        }

        // ---------------------------------------------------------
        // STEP 2: wrap overflowed lines onto additional lines
        // ---------------------------------------------------------

        // only if splitWords is true and current word is not in preservedWords
        if (options.splitWords && !~options.preservedWords.indexOf(word)) {
            while (line.length > width) {
                lines.push(line.substring(0, width-1) + '-');
                line = line.substring(width-1);
            }
        }
        
    });
    
    lines.push(line);
    
    return lines;
}

function normalizeOptions(options) {
    var newOptions = {
        splitWords: true,
        preservedWords: []
    };

    if (!(typeof options === 'object' || typeof options === 'undefined')) {
        throw new Error('options must be an object');
    }
    options = options || {};
    
    if ('splitWords' in options) {
        newOptions.splitWords = !!options.splitWords;
    }
    
    if ('preservedWords' in options) {
        if (!Array.isArray(options.preservedWords)) {
            throw new Error('options.preservedWords must be an array');
        }

        options.preservedWords.forEach(function(str) {
            if (typeof str !== 'string') {
                throw new Error('options.preservedWords entries must be strings');
            }
            newOptions.preservedWords.push(str);
        });
    } 
    
    return newOptions;
}

