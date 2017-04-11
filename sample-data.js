var ansiMarkup = require('./index.js');
var helperData = ansiMarkup.generateHelperData(ansiMarkup.normalizeOptions());
var tagMap = helperData.tagMap;

module.exports = generateSampleData();
module.exports.helperData = helperData;

function generateSampleData() {
    var msg;
    var input;
    var result;
    var tests = [];

    // --------------------------------------------------------------------------------
    // BASIC
    // --------------------------------------------------------------------------------

    msg = 'no tags';
    input = [];
    result = [];
    tests.push(assembleData(msg, input, result));

    // --------------------------------------------------------------------------------
    // COLOR
    // --------------------------------------------------------------------------------

    msg = 'unclosed color open';
    input = []; result = [];
    input.push(tagMap.blue.openTag);
    result.push(tagMap.blue.openTag);
    tests.push(assembleData(msg, input, result));

    msg = 'unused color close';
    input = []; result = [];
    input.push(tagMap.blue.closeTag);
    result.push('');
    tests.push(assembleData(msg, input, result));

    msg = 'nested color';
    input = []; result = [];
    input.push(tagMap.red.openTag);
    input.push(tagMap.blue.openTag);
    input.push(tagMap.blue.closeTag);
    input.push(tagMap.red.closeTag);

    result.push(tagMap.red.openTag);
    result.push(tagMap.blue.openTag);
    result.push(tagMap.red.openTag);
    result.push(tagMap.default.openTag);
    tests.push(assembleData(msg, input, result));

    msg = 'overlapping color';
    input = []; result = [];
    input.push(tagMap.red.openTag);
    input.push(tagMap.blue.openTag);
    input.push(tagMap.red.closeTag);
    input.push(tagMap.blue.closeTag);
    result.push(tagMap.red.openTag);
    result.push(tagMap.blue.openTag);
    result.push('');
    result.push(tagMap.default.openTag);
    tests.push(assembleData(msg, input, result));

    msg = 'color inside reset';
    input = []; result = [];
    input.push(tagMap.reset.openTag);
    input.push(tagMap.blue.openTag);
    input.push(tagMap.blue.closeTag);
    input.push(tagMap.reset.closeTag);

    result.push(tagMap.reset.openTag);
    result.push('');
    result.push('');
    result.push(''); 
    tests.push(assembleData(msg, input, result));

    msg = 'reset inside color';
    input = []; result = [];
    input.push(tagMap.blue.openTag);
    input.push(tagMap.reset.openTag);
    input.push(tagMap.reset.closeTag);
    input.push(tagMap.blue.closeTag);

    result.push(tagMap.blue.openTag);
    result.push(tagMap.reset.openTag);
    result.push(tagMap.blue.openTag);
    result.push(tagMap.default.openTag);
    tests.push(assembleData(msg, input, result));

    msg = 'color overlap reset';
    input = []; result = [];
    input.push(tagMap.reset.openTag);
    input.push(tagMap.blue.openTag);
    input.push(tagMap.reset.closeTag);
    input.push(tagMap.blue.closeTag);

    result.push(tagMap.reset.openTag);
    result.push('');
    result.push(tagMap.blue.openTag);
    result.push(tagMap.default.openTag);
    tests.push(assembleData(msg, input, result));

    msg = 'reset overlap color';
    input = []; result = [];
    input.push(tagMap.blue.openTag);
    input.push(tagMap.reset.openTag);
    input.push(tagMap.blue.closeTag);
    input.push(tagMap.reset.closeTag);

    result.push(tagMap.blue.openTag);
    result.push(tagMap.reset.openTag);
    result.push('');
    result.push('');
    tests.push(assembleData(msg, input, result));

    // --------------------------------------------------------------------------------
    // BGCOLOR
    // --------------------------------------------------------------------------------

    msg = 'unclosed bgcolor open';
    input = []; result = [];
    input.push(tagMap.bgblue.openTag);
    result.push(tagMap.bgblue.openTag);
    tests.push(assembleData(msg, input, result));

    msg = 'unused bgcolor close';
    input = []; result = [];
    input.push(tagMap.bgblue.closeTag);
    result.push('');
    tests.push(assembleData(msg, input, result));

    msg = 'nested bgcolor';
    input = []; result = [];
    input.push(tagMap.bgred.openTag);
    input.push(tagMap.bgblue.openTag);
    input.push(tagMap.bgblue.closeTag);
    input.push(tagMap.bgred.closeTag);
    result.push(tagMap.bgred.openTag);
    result.push(tagMap.bgblue.openTag);
    result.push(tagMap.bgred.openTag);
    result.push(tagMap.bgdefault.openTag);
    tests.push(assembleData(msg, input, result));

    msg = 'overlapping bgcolor';
    input = []; result = [];
    input.push(tagMap.bgred.openTag);
    input.push(tagMap.bgblue.openTag);
    input.push(tagMap.bgred.closeTag);
    input.push(tagMap.bgblue.closeTag);
    result.push(tagMap.bgred.openTag);
    result.push(tagMap.bgblue.openTag);
    result.push('');
    result.push(tagMap.bgdefault.openTag);
    tests.push(assembleData(msg, input, result));

    msg = 'bgcolor inside reset';
    input = []; result = [];
    input.push(tagMap.reset.openTag);
    input.push(tagMap.bgblue.openTag);
    input.push(tagMap.bgblue.closeTag);
    input.push(tagMap.reset.closeTag);

    result.push(tagMap.reset.openTag);
    result.push('');
    result.push('');
    result.push(''); // nothing open, nothing to reset
    tests.push(assembleData(msg, input, result));

    msg = 'reset inside bgcolor';
    input = []; result = [];
    input.push(tagMap.bgblue.openTag);
    input.push(tagMap.reset.openTag);
    input.push(tagMap.reset.closeTag);
    input.push(tagMap.bgblue.closeTag);

    result.push(tagMap.bgblue.openTag);
    result.push(tagMap.reset.openTag);
    result.push(tagMap.bgblue.openTag);
    result.push(tagMap.bgdefault.openTag);
    tests.push(assembleData(msg, input, result));

    msg = 'bgcolor overlap reset';
    input = []; result = [];
    input.push(tagMap.reset.openTag);
    input.push(tagMap.bgblue.openTag);
    input.push(tagMap.reset.closeTag);
    input.push(tagMap.bgblue.closeTag);

    result.push(tagMap.reset.openTag);
    result.push('');
    result.push(tagMap.bgblue.openTag);
    result.push(tagMap.bgdefault.openTag);
    tests.push(assembleData(msg, input, result));

    msg = 'reset overlap bgcolor';
    input = []; result = [];
    input.push(tagMap.bgblue.openTag);
    input.push(tagMap.reset.openTag);
    input.push(tagMap.bgblue.closeTag);
    input.push(tagMap.reset.closeTag);

    result.push(tagMap.bgblue.openTag);
    result.push(tagMap.reset.openTag);
    result.push('');
    result.push('');
    tests.push(assembleData(msg, input, result));

    // --------------------------------------------------------------------------------
    // TEXT
    // --------------------------------------------------------------------------------

    msg = 'unclosed text open';
    input = []; result = [];
    input.push(tagMap.bold.openTag);
    result.push(tagMap.bold.openTag);
    tests.push(assembleData(msg, input, result));

    msg = 'unused text close';
    input = []; result = [];
    input.push(tagMap.bold.closeTag);
    result.push('');
    tests.push(assembleData(msg, input, result));

    msg = 'nested text same';
    input = []; result = [];
    input.push(tagMap.bold.openTag);
    input.push(tagMap.bold.openTag);
    input.push(tagMap.bold.closeTag);
    input.push(tagMap.bold.closeTag);
    result.push(tagMap.bold.openTag);
    result.push('');
    result.push('');
    result.push(tagMap.bold.closeTag);
    tests.push(assembleData(msg, input, result));

    msg = 'nested text different';
    input = []; result = [];
    input.push(tagMap.bold.openTag);
    input.push(tagMap.underline.openTag);
    input.push(tagMap.underline.closeTag);
    input.push(tagMap.bold.closeTag);
    result.push(tagMap.bold.openTag);
    result.push(tagMap.underline.openTag);
    result.push(tagMap.underline.closeTag);
    result.push(tagMap.bold.closeTag);
    tests.push(assembleData(msg, input, result));

    msg = 'overlap text different';
    input = []; result = [];
    input.push(tagMap.bold.openTag);
    input.push(tagMap.underline.openTag);
    input.push(tagMap.bold.closeTag);
    input.push(tagMap.underline.closeTag);
    result.push(tagMap.bold.openTag);
    result.push(tagMap.underline.openTag);
    result.push(tagMap.bold.closeTag);
    result.push(tagMap.underline.closeTag);
    tests.push(assembleData(msg, input, result));

    msg = 'text inside reset';
    input = []; result = [];
    input.push(tagMap.reset.openTag);
    input.push(tagMap.bold.openTag);
    input.push(tagMap.bold.closeTag);
    input.push(tagMap.reset.closeTag);
    result.push(tagMap.reset.openTag);
    result.push('');
    result.push('');
    result.push('');
    tests.push(assembleData(msg, input, result));

    msg = 'reset inside text';
    input = []; result = [];
    input.push(tagMap.bold.openTag);
    input.push(tagMap.reset.openTag);
    input.push(tagMap.reset.closeTag);
    input.push(tagMap.bold.closeTag);
    result.push(tagMap.bold.openTag);
    result.push(tagMap.reset.openTag);
    result.push(tagMap.bold.openTag);
    result.push(tagMap.bold.closeTag);
    tests.push(assembleData(msg, input, result));

    msg = 'text overlap reset';
    input = []; result = [];
    input.push(tagMap.reset.openTag);
    input.push(tagMap.bold.openTag);
    input.push(tagMap.reset.closeTag);
    input.push(tagMap.bold.closeTag);
    result.push(tagMap.reset.openTag);
    result.push('');
    result.push(tagMap.bold.openTag);
    result.push(tagMap.bold.closeTag);
    tests.push(assembleData(msg, input, result));

    msg = 'reset overlap text';
    input = []; result = [];
    input.push(tagMap.bold.openTag);
    input.push(tagMap.reset.openTag);
    input.push(tagMap.bold.closeTag);
    input.push(tagMap.reset.closeTag);
    result.push(tagMap.bold.openTag);
    result.push(tagMap.reset.openTag);
    result.push('');
    result.push('');
    tests.push(assembleData(msg, input, result));

    // --------------------------------------------------------------------------------
    // RESET
    // --------------------------------------------------------------------------------

    msg = 'unclosed reset open';
    input = []; result = [];
    input.push(tagMap.reset.openTag);
    result.push(tagMap.reset.openTag);
    tests.push(assembleData(msg, input, result));

    msg = 'unused reset close';
    input = []; result = [];
    input.push(tagMap.reset.closeTag);
    result.push('');
    tests.push(assembleData(msg, input, result));

    msg = 'nested reset';
    input = []; result = [];
    input.push(tagMap.reset.openTag);
    input.push(tagMap.reset.openTag);
    input.push(tagMap.reset.closeTag);
    input.push(tagMap.reset.closeTag);
    result.push(tagMap.reset.openTag);
    result.push('');
    result.push('');
    result.push('');
    tests.push(assembleData(msg, input, result));

    msg = 'reset with no styles open';
    input = []; result = [];
    input.push(tagMap.reset.openTag);
    input.push(tagMap.reset.closeTag);
    result.push(tagMap.reset.openTag);
    result.push('');
    tests.push(assembleData(msg, input, result));

    msg = 'reset with every style open';
    input = []; result = [];
    input.push(tagMap.reset.openTag);
    input.push(tagMap.red.openTag);
    input.push(tagMap.blue.openTag);
    input.push(tagMap.bgblue.openTag);
    input.push(tagMap.bgred.openTag);
    input.push(tagMap.bold.openTag);
    input.push(tagMap.underline.openTag);
    input.push(tagMap.blink.openTag);
    input.push(tagMap.inverse.openTag);
    input.push(tagMap.reset.closeTag);
    result.push(tagMap.reset.openTag);
    result.push('');
    result.push('');
    result.push('');
    result.push('');
    result.push('');
    result.push('');
    result.push('');
    result.push('');
    // this is the reset.closeTag: 
    // replace with all open styles, but only most recent bg and color
    result.push([
        tagMap.bold.openTag,
        tagMap.underline.openTag,
        tagMap.blink.openTag,
        tagMap.inverse.openTag,
        tagMap.blue.openTag,
        tagMap.bgred.openTag,
    ]);
    tests.push(assembleData(msg, input, result));

    return tests;

}

function assembleData(msg, input, result) {
    return {msg: msg, input: input, result: result};
}

