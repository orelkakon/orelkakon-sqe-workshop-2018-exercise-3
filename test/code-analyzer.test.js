import assert from 'assert';
import {start} from '../src/js/code-analyzer';

describe('Examples from site', () => {
    it('test1:', () => {
        assert.equal(start('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}\n','1,2,3'),'st=>start: Start\n' +
            'op1=>operation: (1)\n' +
            'let a = x + 1\n' +
            '|color\n' +
            'op2=>operation: (2)\n' +
            'let b = a + y\n' +
            '|color\n' +
            'op3=>operation: (3)\n' +
            'let c = 0\n' +
            '|color\n' +
            'cond4=>condition: (4)\n' +
            'b < z\n' +
            '|color\n' +
            'op5=>operation: (5)\n' +
            'c = c + 5\n' +
            'cond6=>condition: (6)\n' +
            'b < z * 2\n' +
            '|color\n' +
            'op7=>operation: (7)\n' +
            'c = c + x + 5\n' +
            '|color\n' +
            'op8=>operation: (8)\n' +
            'c = c + z + 5\n' +
            'op9=>operation: (9)\n' +
            'return c\n' +
            '|color\n' +
            '\n' +
            'st->op1->op2->op3->cond4\n' +
            'cond4(yes)->op5->cond6\n' +
            'cond4(no)->cond6\n' +
            'cond6(yes)->op7->cond8\n' +
            'cond6(no)->op8->op9');
    });
    it('test2:', () => {
        assert.equal(start('function foo(x, y, z){\n' +
            '   let a = x + 1;\n' +
            '   let b = a + y;\n' +
            '   let c = 0;\n' +
            '   \n' +
            '   while (a < z) {\n' +
            '       c = a + b;\n' +
            '       z = c * 2;\n' +
            '       a++;\n' +
            '   }\n' +
            '   \n' +
            '   return z;\n' +
            '}\n','1,2,3'),'st=>start: Start\n' +
            'op1=>operation: (1)\n' +
            'let a = x + 1\n' +
            '|color\n' +
            'op2=>operation: (2)\n' +
            'let b = a + y\n' +
            '|color\n' +
            'op3=>operation: (3)\n' +
            'let c = 0\n' +
            '|color\n' +
            'op4=>operation: (4)\n' +
            'NULL\n' +
            '|color\n' +
            'cond5=>condition: (5)\n' +
            'a < z\n' +
            '|color\n' +
            'op6=>operation: (6)\n' +
            'c = a + b\n' +
            '|color\n' +
            'op7=>operation: (7)\n' +
            'z = c * 2\n' +
            '|color\n' +
            'op8=>operation: (8)\n' +
            'a++\n' +
            '|color\n' +
            'op9=>operation: (9)\n' +
            'return z\n' +
            '|color\n' +
            '\n' +
            'st->op1->op2->op3->op4->cond5\n' +
            'cond5(yes)->op6->op7->op8->op4\n' +
            'cond5(no)->op9');
    });
});

describe('unit tests', () => {
    it('Test1:', () => {
        assert.equal(start('function foo(x, y, z,d){\n' +
            '   let a = x + 1;\n' +
            '   let b = a + y;\n' +
            '   let c = 0;\n' +
            '   let v = \'hello\';\n' +
            '   while (d[0] != 1) {\n' +
            '       c = a + b;\n' +
            '       z = c * 2;\n' +
            '   }\n' +
            '   \n' +
            '   return z;\n' +
            '}\n','1,2,3,[1]'),'st=>start: Start\n' +
            'op1=>operation: (1)\n' +
            'let a = x + 1\n' +
            '|color\n' +
            'op2=>operation: (2)\n' +
            'let b = a + y\n' +
            '|color\n' +
            'op3=>operation: (3)\n' +
            'let c = 0\n' +
            '|color\n' +
            'op4=>operation: (4)\n' +
            'let v = \'hello\'\n' +
            '|color\n' +
            'op5=>operation: (5)\n' +
            'NULL\n' +
            '|color\n' +
            'cond6=>condition: (6)\n' +
            'd[0] != 1\n' +
            '|color\n' +
            'op7=>operation: (7)\n' +
            'c = a + b\n' +
            'op8=>operation: (8)\n' +
            'z = c * 2\n' +
            'op9=>operation: (9)\n' +
            'return z\n' +
            '|color\n' +
            '\n' +
            'st->op1->op2->op3->op4->op5->cond6\n' +
            'cond6(no)->op7->op8(right)->op5\n' +
            'cond6(yes)->op9');
    });
    it('Test2:', () => {
        assert.equal(start('function foo(x, y, z,d){\n' +
            '  \n' +
            '}\n','1,2,3,4'),'st=>start: Start\n' +
            '\n' +
            'st');
    });
    it('Test3:', () => {
        assert.equal(start('function foo(x, y, z, d){\n' +
            '  let ans = x + y + z + d;\n' +
            '  return ans;\n' +
            '}\n','11,22,33,44'),'st=>start: Start\n' +
            'op1=>operation: (1)\n' +
            'let ans = x + y + z + d\n' +
            '|color\n' +
            'op2=>operation: (2)\n' +
            'return ans\n' +
            '|color\n' +
            '\n' +
            'st->op1->op2');
    });
    it('Test4:', () => {
        assert.equal(start('function test(x, y){\n' +
            '  let ans = [5,6];\n' +
            'let a = 5;\n' +
            'if(x == y){\n' +
            ' a= 10;\n' +
            '}\n' +
            'else{\n' +
            'a= 20;\n' +
            '}\n' +
            '  return a;\n' +
            '}\n','[1,2],[3,4]'),'st=>start: Start\n' +
            'op1=>operation: (1)\n' +
            'let ans = [\n' +
            '    5,\n' +
            '    6\n' +
            ']\n' +
            '|color\n' +
            'op2=>operation: (2)\n' +
            'let a = 5\n' +
            '|color\n' +
            'cond3=>condition: (3)\n' +
            'x == y\n' +
            '|color\n' +
            'op4=>operation: (4)\n' +
            'a = 10\n' +
            'op5=>operation: (5)\n' +
            'a = 20\n' +
            '|color\n' +
            'op6=>operation: (6)\n' +
            'return a\n' +
            '|color\n' +
            '\n' +
            'st->op1->op2->cond3\n' +
            'cond3(yes)->op4->cond5\n' +
            'cond3(no)->op5->op6');
    });
    it('Test5:', () => {
        assert.equal(start('function test(x, y){\n' +
            '  let ans;\n' +
            'ans = 1;\n' +
            '  return ans;\n' +
            '}\n','7,0'),'st=>start: Start\n' +
            'op1=>operation: (1)\n' +
            'let ans\n' +
            '|color\n' +
            'op2=>operation: (2)\n' +
            'ans = 1\n' +
            '|color\n' +
            'op3=>operation: (3)\n' +
            'return ans\n' +
            '|color\n' +
            '\n' +
            'st->op1->op2->op3');
    });
    it('Test6:', () => {
        assert.equal(start('function test(x, y){\n' +
            '  let ans = \'yesOrNo\';\n' +
            'let b = 8;\n' +
            '  let ch = x + y;\n' +
            '  if(ch<5){\n' +
            'b++;\n' +
            '}\n' +
            'if(1<4)\n' +
            'b++;\n' +
            'if(5>8)\n' +
            'b=b+4;\n' +
            'if(ch>6)\n' +
            'return ans\n' +
            '\n' +
            '\n' +
            '}\n','1,2'),'st=>start: Start\n' +
            'op1=>operation: (1)\n' +
            'let ans = \'yesOrNo\'\n' +
            '|color\n' +
            'op2=>operation: (2)\n' +
            'let b = 8\n' +
            '|color\n' +
            'op3=>operation: (3)\n' +
            'let ch = x + y\n' +
            '|color\n' +
            'cond4=>condition: (4)\n' +
            'ch < 5\n' +
            '|color\n' +
            'op5=>operation: (5)\n' +
            'b++\n' +
            '|color\n' +
            'cond6=>condition: (6)\n' +
            '1 < 4\n' +
            '|color\n' +
            'op7=>operation: (7)\n' +
            'b++\n' +
            '|color\n' +
            'cond8=>condition: (8)\n' +
            '5 > 8\n' +
            '|color\n' +
            'op9=>operation: (9)\n' +
            'b = b + 4\n' +
            'cond10=>condition: (10)\n' +
            'ch > 6\n' +
            '|color\n' +
            'op11=>operation: (11)\n' +
            'return ans\n' +
            '|color\n' +
            '\n' +
            'st->op1->op2->op3->cond4\n' +
            'cond4(yes)->op5->cond6\n' +
            'cond4(no)->cond6\n' +
            'cond6(yes)->op7->cond8\n' +
            'cond6(no)->cond8\n' +
            'cond8(yes)->op9->cond10\n' +
            'cond8(no)->cond10\n' +
            'cond10(yes)->op11->cond12\n' +
            'cond10(no)');
    });
    it('Test7:', () => {
        assert.equal(start('function test(x, y){\n' +
            '  let a = x + 2;\n' +
            '  if(a<5)\n' +
            '    return 3;\n' +
            '  else if(a + 5 < y)\n' +
            '      a++;\n' +
            '  else\n' +
            '     a++;\n' +
            'if(a == 9){\n' +
            'let d = 8;\n' +
            'd++;\n' +
            '}\n' +
            '}\n    ','2 , 3'),'st=>start: Start\n' +
            'op1=>operation: (1)\n' +
            'let a = x + 2\n' +
            '|color\n' +
            'cond2=>condition: (2)\n' +
            'a < 5\n' +
            '|color\n' +
            'op3=>operation: (3)\n' +
            'return 3\n' +
            '|color\n' +
            'cond4=>condition: (4)\n' +
            'a + 5 < y\n' +
            '|color\n' +
            'op5=>operation: (5)\n' +
            'a++\n' +
            'op6=>operation: (6)\n' +
            'a++\n' +
            '|color\n' +
            'cond7=>condition: (7)\n' +
            'a == 9\n' +
            '|color\n' +
            'op8=>operation: (8)\n' +
            'let d = 8\n' +
            'op9=>operation: (9)\n' +
            'd++\n' +
            '\n' +
            'st->op1->cond2\n' +
            'cond2(yes)->op3->cond4\n' +
            'cond2(no)->cond4\n' +
            'cond4(yes)->op5->cond6\n' +
            'cond4(no)->op6->cond7\n' +
            'cond7(yes)->op8->op9->cond10\n' +
            'cond7(no)');
    });
    it('Test8:', () => {
        assert.equal(start('function test(x){\n' +
            '  let a = 1;\n' +
            '  if(x==6){\n' +
            '    a++;\n' +
            '    if(x==5){\n' +
            '       a++;\n' +
            '     }\n' +
            '    else{\n' +
            '       x++;\n' +
            '    }\n' +
            '   }\n' +
            '  return a * 7;\n' +
            '}\n','5'),'st=>start: Start\n' +
            'op1=>operation: (1)\n' +
            'let a = 1\n' +
            '|color\n' +
            'cond2=>condition: (2)\n' +
            'x == 6\n' +
            '|color\n' +
            'op3=>operation: (3)\n' +
            'a++\n' +
            'cond4=>condition: (4)\n' +
            'x == 5\n' +
            '|color\n' +
            'op5=>operation: (5)\n' +
            'a++\n' +
            'op6=>operation: (6)\n' +
            'x++\n' +
            'op7=>operation: (7)\n' +
            'return a * 7\n' +
            '|color\n' +
            '\n' +
            'st->op1->cond2\n' +
            'cond2(yes)->op3->cond4\n' +
            'cond4(yes)->op5->cond6\n' +
            'cond4(no)->op6->cond7\n' +
            'cond2(no)->op7');
    });
    it('Test9:', () => {
        assert.equal(start('function test(x){\n' +
            '  let a = 1;\n' +
            '  while(x==6){\n' +
            '    a++;\n' +
            '    if(3<5){\n' +
            '       a++;\n' +
            'let r = 3;\n' +
            '     }\n' +
            '    else{\n' +
            '       x++;\n' +
            '    }\n' +
            'while( x==10){\n' +
            ' a = a+1;\n' +
            'a++;\n' +
            'let n = 7;\n' +
            '}\n' +
            '   }\n' +
            '  return a * 7;\n' +
            '}\n','5'),'st=>start: Start\n' +
            'op1=>operation: (1)\n' +
            'let a = 1\n' +
            '|color\n' +
            'op2=>operation: (2)\n' +
            'NULL\n' +
            '|color\n' +
            'cond3=>condition: (3)\n' +
            'x == 6\n' +
            '|color\n' +
            'op4=>operation: (4)\n' +
            'a++\n' +
            'cond5=>condition: (5)\n' +
            '3 < 5\n' +
            '|color\n' +
            'op6=>operation: (6)\n' +
            'a++\n' +
            'op7=>operation: (7)\n' +
            'let r = 3\n' +
            'op8=>operation: (8)\n' +
            'x++\n' +
            'op9=>operation: (9)\n' +
            'NULL\n' +
            '|color\n' +
            'cond10=>condition: (10)\n' +
            'x == 10\n' +
            '|color\n' +
            'op11=>operation: (11)\n' +
            'a = a + 1\n' +
            'op12=>operation: (12)\n' +
            'a++\n' +
            'op13=>operation: (13)\n' +
            'let n = 7\n' +
            'op14=>operation: (14)\n' +
            'return a * 7\n' +
            '|color\n' +
            '\n' +
            'st->op1->op2->cond3\n' +
            'cond3(no)->op4->cond5\n' +
            'cond5(yes)->op6->op7->cond8\n' +
            'cond5(no)->op8->op9->cond10\n' +
            'cond10(no)->op11->op12->op13(right)->op9\n' +
            'cond10(yes)(right)->op2\n' +
            'cond3(yes)->op14');
    });
    it('Teat10:', () => {
        assert.equal(start('function last(x,y){\n' +
            '  let a = x;\n' +
            '  x++;\n' +
            '  let b;\n' +
            'b= 8;\n' +
            'return b + a\n' +
            '}\n','\'hello\',[[1,2,3],4,5,[\'ss\',\'sss\']]'),'st=>start: Start\n' +
            'op1=>operation: (1)\n' +
            'let a = x\n' +
            '|color\n' +
            'op2=>operation: (2)\n' +
            'x++\n' +
            '|color\n' +
            'op3=>operation: (3)\n' +
            'let b\n' +
            '|color\n' +
            'op4=>operation: (4)\n' +
            'b = 8\n' +
            '|color\n' +
            'op5=>operation: (5)\n' +
            'return b + a\n' +
            '|color\n' +
            '\n' +
            'st->op1->op2->op3->op4->op5');
    });
});

describe('Example more concrete for coverage', () => {
    it('T1:', () => {
        assert.equal(start('function toCover(x){\n' +
            '   let a = 6;\n' +
            'a--;\n' +
            'return a\n' +
            '\n' +
            '\n' +
            '}','[1,2,3]'),'st=>start: Start\n' +
            'op1=>operation: (1)\n' +
            'let a = 6\n' +
            '|color\n' +
            'op2=>operation: (2)\n' +
            'a--\n' +
            '|color\n' +
            'op3=>operation: (3)\n' +
            'return a\n' +
            '|color\n' +
            '\n' +
            'st->op1->op2->op3');
    });
});
