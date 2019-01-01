import $ from 'jquery';
import {start} from './code-analyzer';
import * as flowchart from 'flowchart.js';
let Function;
let Inputs;

$(document).ready(function () {
    $('#CFGButton').click(() => {
        Function = $('#codePlaceholder').val();
        Inputs = $('#inputs').val();
        let result = start(Function,Inputs);
        const diagram = flowchart.parse(result);
        clear();
        diagram.drawSVG('graph',{'yes-text': 'T',
            'no-text': 'F','flowstate':{'color' : {'fill' : 'green'}}});
    });
});

function clear() {
    document.getElementById('graph').innerHTML = '';
}
