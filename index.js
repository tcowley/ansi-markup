module.exports = ansiMarkup;

var defaults = {
    force: false,
    leftDelimiter: '{',
    rightDelimiter: '}',
};

ansiMarkup.parseInput = parseInput;
ansiMarkup.normalizeTags = normalizeTags;
ansiMarkup.swapTagsForCodes = swapTagsForCodes;
ansiMarkup.mergeCodesAndContent = mergeCodesAndContent;
ansiMarkup.getTagNameFromTag = getTagNameFromTag;
ansiMarkup.normalizeOptions = normalizeOptions;
ansiMarkup.generateHelperData = generateHelperData;

function ansiMarkup(input, options) {
    options = normalizeOptions(options);
    var helpers = generateHelperData(options);
    var stripCodes = !options.force && !process.stdout.isTTY;
    var parsedInput = parseInput(input, options.leftDelimiter, helpers.allTags);
    var tags = normalizeTags(parsedInput.tags, helpers.tagMap);
    var codes = swapTagsForCodes(tags, helpers.tagMap, stripCodes);
    var result = mergeCodesAndContent(parsedInput.content, codes, helpers.tagMap, stripCodes);
    return result.join('');
}

function normalizeOptions(options) {
    options = typeof options === 'object' ? options : {};
    var newOptions = {};
    newOptions.force = 'force' in options ? !!options.force : defaults.force;
    newOptions.leftDelimiter = defaults.leftDelimiter;
    newOptions.rightDelimiter = defaults.rightDelimiter;
    return newOptions;
}

function generateHelperData(options) {
    var leftDelimiter = options.leftDelimiter;
    var rightDelimiter = options.rightDelimiter;
    var tagCodes = {
        reset: [0, null],
        // text styles
        bold: [1, 22],
        underline: [4, 24],
        blink: [5, 25],
        inverse: [7, 27],
        // fg colors 
        black: [30, null],
        red: [31, null],
        green: [32, null],
        yellow: [33, null],
        blue: [34, null],
        magenta: [35, null],
        cyan: [36, null],
        white: [37, null],
        gray: [90, null],
        grey: [90, null],
        default: [39, null],
        // bg colors 
        bgblack: [40, null],
        bgred: [41, null],
        bggreen: [42, null],
        bgyellow: [43, null],
        bgblue: [44, null],
        bgmagenta: [45, null],
        bgcyan: [46, null],
        bgwhite: [47, null],
        bgdefault: [49, null],
    };
    var tagMap = {};
    var allTags = [];
    Object.keys(tagCodes).forEach(function(tagName, i) {
        tagMap[tagName] = {
            openTag: leftDelimiter + tagName + rightDelimiter,
            openCode: '\u001b[' + tagCodes[tagName][0] + 'm',
            closeTag: leftDelimiter + '/' + tagName + rightDelimiter,
            closeCode: (tagCodes[tagName][1] ? '\u001b[' + tagCodes[tagName][1] + 'm' : '')
        };
        allTags.push(tagMap[tagName].openTag);
        allTags.push(tagMap[tagName].closeTag);
    });
    return {allTags: allTags, tagMap: tagMap};
}

function parseInput(input, leftDelimiter, allTags) {
    
    var parsed = {content: [], tags: []};
    var tagsRe = new RegExp('(' +
        allTags.map(function(tag) { return tag.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'); }).join('|')
        + ')', 'gi');
    input
        .split(leftDelimiter + leftDelimiter)
        .map(function(str) { tagsRe.lastIndex = 0; return str.split(tagsRe); })
        .forEach(function(arr,i) {
            arr.forEach(function(str,j) {
                // push all found tags onto the tags array, 
                // and place a non-string placeholder in the main string array
                if (tagsRe.test(str)) {
                    tagsRe.lastIndex = 0;
                    parsed.tags.push(str);
                    parsed.content.push(null);
                }
                // to replace our original string split value
                else {
                    // if a new sub-array has been started, push a single leadingDelimiter onto content array
                    i && !j && parsed.content.push(leftDelimiter);
                    // push all non-tag strings onto main content array
                    parsed.content.push(str);
                }
            });
        });
    return parsed;
}

function normalizeTags(tags, tagMap) {
    var foundTag;
    var textTagNames = ['bold', 'underline', 'blink','inverse'];
    var counters = {
        reset: 0,
        bold: 0,
        underline: 0,
        blink: 0,
        inverse: 0,
        colors: [],
        bgcolors: []
    };
    
    tags = tags.slice();

    tags.forEach(function(tag, i) {
        
        //var tag = getTagNameFromTag(tag, true);
        var tagWithoutDelimiters = getTagNameFromTag(tag, true);
        var tagName = getTagNameFromTag(tag, false);
        var colors;
        var defaultColor;

        // CASE 1: reset tag

        if (tagName === 'reset') {
            // this is an opening tag
            if (tagWithoutDelimiters === tagName) {
                if (counters.reset) {
                    tags[i] = '';
                }
                counters.reset++;
            }
            // this is a closing reset tag
            else {
                // if there are no open reset tags, ignore this one.
                if (!counters.reset) {
                    tags[i] = '';
                }
                // there are open reset tags, so decrement
                else if (counters.reset) {
                    counters.reset--;
                    // there are still open reset tags, do nothing.
                    if (counters.reset) {
                        tags[i] = '';
                    }
                    // this was the last open reset tag: 
                    // - display all open text styles, and the most recent color and bg color    
                    else {
                        var replacementTags = [];
                        textTagNames.forEach(function(tagName) { counters[tagName] && replacementTags.push(tagName); });
                        counters.colors.slice(-1)[0] && replacementTags.push(counters.colors.slice(-1)[0]);
                        counters.bgcolors.slice(-1)[0] && replacementTags.push(counters.bgcolors.slice(-1)[0]);
                        switch (replacementTags.length) {
                        case 0:
                            tags[i] = '';
                            break;
                        case 1:
                            tags[i] = replacementTags.map(function(tagName) { return tagMap[tagName].openTag; })[0];
                            break;
                        default:
                            tags[i] = replacementTags.map(function(tagName) { return tagMap[tagName].openTag; });
                        }
                    }
                }
            }
        }

        // CASE 2: text tags

        else if (~textTagNames.indexOf(tagName)) {
            // this is an opening tag, push it onto the stack
            if (~textTagNames.indexOf(tagWithoutDelimiters)) {
                // don't keep the tag value if reset is open, or if bold is already open
                if (counters.reset || counters[tagName]) {
                    tags[i] = '';
                }
                counters[tagName]++;
            }
            // this is a closing tag
            else {
                // if the tag isn't already opened, remove it
                if (!counters[tagName]) {
                    tags[i] = '';
                }
                // if the tag is open, count down
                else if (counters[tagName]) {
                    counters[tagName]--;
                    // if a reset tag is open still, then remove the close tag (do nothing)
                    if (counters.reset) {
                        tags[i] = '';
                    }
                    // if there are still open tags for this style, do nothing, since the style is still in effect.
                    else if (counters[tagName]) {
                        tags[i] = '';
                    }
                    // the style is now closed, so preserve the closing tag
                    else {
                        tags[i] = tags[i]; 
                    }
                }
            }
        }

        // CASE 3: color tags

        else {
            // set up for bg for fg
            colors = /^bg/.test(tagName) ? 'bgcolors' : 'colors';
            defaultColor = colors.replace('colors', 'default');
            
            // if this is an opening tag, push it onto the stack
            if (tagWithoutDelimiters === tagName) {
                counters[colors].push(tagName);
                // don't keep the tag value if reset is open:
                if (counters.reset) {
                    tags[i] = '';
                }
            }
            
            // this is a closing tag
            else {
                
                // if the color matches the most recently opened one
                if (tagName === counters[colors].slice(-1)[0]) {
                    counters[colors].pop();
                    if (counters.reset) {
                        tags[i] = '';
                    }
                    else if (!counters.reset) {
                        tags[i] = tagMap[counters[colors].slice(-1)[0] || defaultColor].openTag;
                    }
                }
                // if the color is somewhere else in the colors stack
                // - remove it from the stack
                // - reset the close tag to empty string
                else {
                    foundTag = false;
                    for (var j = counters[colors].length -1; j >= 0; j--) {
                        if (tagName === counters[colors][j]) {
                            counters[colors].splice(j, 1);
                            tags[i] = '';
                            foundTag = true;
                            break;
                        }
                    }
                    // the tag doesn't match any color opened so far, remove it
                    if (!foundTag) {
                        tags[i] = '';
                    }
                }
            }
        }
    });
    return tags;
}

function swapTagsForCodes(tags, tagMap, stripCodes) {
    // replace the tags with their ansi codes
    var codes = tags.map(function(tag) {
        if (!stripCodes && tag.length) {
            if (Array.isArray(tag)) {
                return swapTagsForCodes(tag, tagMap, stripCodes).join('');
            }
            else {
                var tagName = getTagNameFromTag(tag, false);
                return /\//.test(tag) ? tagMap[tagName].closeCode : tagMap[tagName].openCode;
            }
        }
        return '';
    });
    return codes;
}

function mergeCodesAndContent(content, codes, tagMap, stripCodes) {
    var merged = content.slice();
    var counter = 0;
    merged.forEach(function(val, i){
        if (val === null) {
            merged[i] = codes[counter];
            counter++;
        }
    });
    if (!stripCodes) {
        merged.push(tagMap.reset.openCode);
        merged.unshift(tagMap.reset.openCode);
    }
    return merged;
}

function getTagNameFromTag(tag, leaveForwardSlash) {
    return tag.toLowerCase().replace(/[^\/a-z]*/g, '').replace(leaveForwardSlash ? '' : '/', '');
}


