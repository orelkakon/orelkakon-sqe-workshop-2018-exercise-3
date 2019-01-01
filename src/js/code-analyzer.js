import * as esprima from 'esprima';
import * as codegen from 'escodegen';

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse);
};
let input;let mapValues;let vertex; let edges;let kodKodNum;let needToEval;let color;
function start(Function,Inputs) {
    input = analyzeInputFunction(parseCode(Inputs));
    mapValues = setParams(parseCode(Function), input);
    color = '|color';
    vertex = 'st=>start: Start' + '\n';
    edges = 'st';
    kodKodNum = 1;
    needToEval = true;
    main(parseCode(Function).body[0].body.body);
    return vertex+'\n'+edges;
}
//main:
function main(code) {
    for(let i=0;i<code.length;i++){
        if(code[i].type === 'VariableDeclaration'){
            handlerVarDec(code[i].declarations[0]);
        }
        else if(code[i].type === 'ExpressionStatement'){
            handlerExpSta(code[i].expression);
        }
        else if(code[i].type === 'IfStatement'){
            handlerIfSta(code[i]);
        }
        else
            contMain(code,i);
    }
}
function contMain(code,i) {
    if(code[i].type === 'ReturnStatement'){
        handlerReturnSta(code[i]);
    }
    else {   //if(code[i].type === 'WhileStatement') {
        handlerWhileSta(code[i]);
    }
}
function main1Line(code) {
    if(code.type === 'ExpressionStatement') {
        handlerExpSta(code.expression);
    }
    else {   //if(code.type === 'ReturnStatement'){
        handlerReturnSta(code);
    }
    //not support ++ / -- in 1Line
}

//handlers:
function handlerVarDec(code) {
    let name = code.id.name; let value = '';
    if(code.init !== null) {
        value = codegen.generate(code.init);
        vertex = vertex + 'op' + kodKodNum + '=>operation: ' + '(' + kodKodNum + ')' + '\n' + 'let ' + name + ' = ' + value + '\n';
    }else {
        vertex = vertex + 'op' + kodKodNum + '=>operation: ' + '(' + kodKodNum + ')' + '\n' + 'let ' + name +'\n';
    }
    edges = edges +'->'+'op'+kodKodNum;
    kodKodNum++;
    if(needToEval){
        let substitutedValue = substitute(value);
        mapValues.set(name, eval(substitutedValue));
        vertex = vertex + color + '\n';
    }
}
function handlerExpSta(code) {
    let name;let value;
    if(code.type === 'AssignmentExpression') {
        name = code.left.name;       value = codegen.generate(code.right);
        vertex = vertex + 'op' + kodKodNum + '=>operation: ' + '(' + kodKodNum + ')' + '\n' + name + ' = ' + value + '\n';
        edges = edges +'->'+'op' + kodKodNum;
    }
    else{ //update expression
        name = code.argument.name;   value = handlerUpdateExp(code);
        vertex = vertex + 'op' + kodKodNum + '=>operation: ' + '(' + kodKodNum + ')' + '\n' + codegen.generate(code) + '\n';
        edges = edges + '->'+'op' + kodKodNum;
    }
    kodKodNum++;
    if (needToEval) {
        let substitutedValue = substitute(value);
        mapValues.set(name, eval(substitutedValue));
        vertex = vertex + color + '\n';
    }
}
function handlerIfSta(code) {
    let cond = codegen.generate(code.test);
    vertex = vertex +'cond'+kodKodNum+'=>condition: '+'('+kodKodNum+')'+'\n'+cond+'\n'; edges = edges +'->'+ 'cond'+kodKodNum+'\n'; vertex = vertex + color + '\n';
    let remKodKodNum = kodKodNum; let substituteCond = substitute(cond);
    if(!eval(substituteCond)){ //cond false
        needToEval = false; edges = edges +'cond'+remKodKodNum+'(yes)'; kodKodNum++;
        handlerConsequent(code.consequent); edges = edges + '->'+'cond'+kodKodNum;
        edges = edges + '\n' + 'cond'+remKodKodNum+'(no)'; needToEval = true;
        if (code.alternate !== null)
            handlerAlternate(code.alternate,true);
    }
    else{  //cond true
        edges = edges +'cond'+remKodKodNum+'(yes)'; kodKodNum++;
        handlerConsequent(code.consequent);  edges = edges + '->'+'cond'+kodKodNum;
        edges = edges + '\n' + 'cond' + remKodKodNum +'(no)';
        if (code.alternate !== null)
            handlerAlternate(code.alternate,false);
    }
}
function handlerWhileSta(code) {
    let cond = codegen.generate(code.test);
    vertex = vertex +'op'+kodKodNum+'=>operation: '+'('+kodKodNum+')'+'\n'+'NULL'+'\n';  edges = edges +'->'+ 'op'+kodKodNum; vertex = vertex + color + '\n';
    let remNullKodKodNum = kodKodNum;  kodKodNum++;  let remKodKodNum = kodKodNum; let substituteCond = substitute(cond);
    vertex = vertex +'cond'+kodKodNum+'=>condition: '+'('+kodKodNum+')'+'\n'+cond+'\n';  edges = edges +'->'+ 'cond'+kodKodNum+'\n';
    vertex = vertex + color + '\n';
    if(!eval(substituteCond)){ //cond false
        needToEval = false; edges = edges +'cond'+remKodKodNum+'(no)'; kodKodNum++;
        handlerConsequent(code.body);
        edges = edges + '(right)'+'->'+'op'+remNullKodKodNum; edges = edges + '\n' + 'cond'+remKodKodNum+'(yes)';
        needToEval = true;
    }
    else{  //cond true
        edges = edges +'cond'+remKodKodNum+'(yes)'; kodKodNum++;
        handlerConsequent(code.body);
        edges = edges + '->'+'op'+remNullKodKodNum;
        edges = edges + '\n' + 'cond'+remKodKodNum+'(no)';
    }
}
function handlerReturnSta(code) {
    let value = 'return ' + codegen.generate(code.argument);
    vertex = vertex + 'op' + kodKodNum + '=>operation: ' + '(' + kodKodNum + ')' + '\n' + value + '\n';
    vertex = vertex + color + '\n';
    edges = edges +'->'+ 'op' + kodKodNum;
    kodKodNum++;
}
function handlerUpdateExp(code){
    if(code.operator === '++') {
        return code.argument.name + ' + 1';
    }
    else{ // case of '--'
        return code.argument.name + ' - 1';
    }
}
function handlerConsequent(code) {
    if(code.type === 'BlockStatement'){
        main(code.body);
    }
    else {
        main1Line(code); //maybe need to check this
    }
}
function handlerAlternate(code,toDo) {
    if(code.type === 'IfStatement'){
        handlerIfSta(code);
    }
    else if(code.type === 'BlockStatement'){
        needToEval = toDo;
        main(code.body);
    }
    else{
        needToEval = toDo;
        main1Line(code);
    }
}

//help function:
function substitute(value) {
    let iter1 = mapValues.keys();
    let key = iter1.next().value;
    while (key !== undefined){
        if(value.includes(key)){
            //if(mapValues.get(key).includes('\'')) {
            //  value = value.split(key).join('"'+mapValues.get(key).split('\'').join('')+'"');
            //}
            //else {
            value = value.split(key).join(mapValues.get(key));
            //}
        }
        key = iter1.next().value;
    }
    return value;
}

//set ups:
function analyzeInputFunction(inputfunction) {
    let array = [];
    if(inputfunction.body[0].expression.type === 'SequenceExpression') {
        for (let i = 0; i < inputfunction.body[0].expression.expressions.length; i++) {
            if (inputfunction.body[0].expression.expressions[i].type === 'ArrayExpression') {
                array.push(codegen.generate(inputfunction.body[0].expression.expressions[i]));
            }
            else{
                array.push(inputfunction.body[0].expression.expressions[i].raw);
            }
        }
    }
    else {
        if(inputfunction.body[0].expression.type === 'ArrayExpression')
            array.push(codegen.generate(inputfunction.body[0].expression));
        else
            array.push(inputfunction.body[0].expression.value);
    }
    return array;
} //maybe need to suitable to assignment 3
function setParams(code,arrInput){
    let functionVar = new Map();
    for (let j = 0; j < code.body[0].params.length; j++) {
        functionVar.set(code.body[0].params[j].name,arrInput[j]);
    }
    return functionVar;
}

export {start};
