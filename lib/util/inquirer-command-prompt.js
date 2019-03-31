"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require('util');
const chalk = require('chalk');
const ellipsize = require('ellipsize');
const InputPrompt = require('inquirer/lib/prompts/input');
const histories = {};
const historyIndexes = {};
const autoCompleters = {};
let context;
class CommandPrompt extends InputPrompt {
    initHistory(context) {
        if (!histories[context]) {
            histories[context] = [];
            historyIndexes[context] = 0;
        }
    }
    initAutoCompletion(context, autoCompletion) {
        if (!autoCompleters[context]) {
            if (autoCompletion) {
                autoCompleters[context] = l => this.autoCompleter(l, autoCompletion);
            }
            else {
                autoCompleters[context] = () => [];
            }
        }
    }
    addToHistory(context, value) {
        this.initHistory(context);
        histories[context].push(value);
        historyIndexes[context]++;
    }
    onKeypress(e) {
        const rewrite = line => {
            this.rl.line = line;
            this.rl.write(null, { ctrl: true, name: 'e' });
        };
        context = this.opt.context ? this.opt.context : '_default';
        this.initHistory(context);
        this.initAutoCompletion(context, this.opt.autoCompletion);
        /** go up commands history */
        if (e.key.name === 'up') {
            if (historyIndexes[context] > 0) {
                historyIndexes[context]--;
                rewrite(histories[context][historyIndexes[context]]);
            }
        }
        else if (e.key.name === 'down') {
            /** go down commands history */
            if (histories[context][historyIndexes[context] + 1]) {
                historyIndexes[context]++;
                rewrite(histories[context][historyIndexes[context]]);
            }
        }
        else if (e.key.name === 'tab') {
            /** search for command at an autoComplete option
             * which can be an array or a function which returns an array
             * */
            let line = this.rl.line
                .replace(/^ +/, '')
                .replace(/\t/, '')
                .replace(/ +/g, ' ');
            try {
                var ac = autoCompleters[context](line);
                if (ac.match) {
                    rewrite(ac.match);
                }
                else if (ac.matches) {
                    console.log();
                    // @ts-ignore
                    process.stdout.cursorTo(0);
                    console.log(chalk.red('>> ') + chalk.grey('Available commands:'));
                    console.log(CommandPrompt.formatList(this.opt.short
                        ? this.short(line, ac.matches)
                        : ac.matches));
                    rewrite(line);
                }
            }
            catch (err) {
                rewrite(line);
            }
        }
        this.render();
    }
    short(l, m) {
        if (l) {
            l = l.replace(/ $/, '');
            for (let i = 0; i < m.length; i++) {
                if (m[i] == l) {
                    m.splice(i, 1);
                    i--;
                }
                else {
                    if (m[i][l.length] == ' ') {
                        m[i] = m[i].replace(RegExp(l + ' '), '');
                    }
                    else {
                        m[i] = m[i].replace(RegExp(l.replace(/ [^ ]+$/, '') + ' '), '');
                    }
                }
            }
        }
        return m;
    }
    autoCompleter(line, cmds) {
        let max = 0;
        if (typeof cmds === 'function') {
            cmds = cmds(line);
        }
        // first element in cmds can be an object with special instructions
        let options = {
            filter: str => str,
        };
        if (typeof cmds[0] === 'object') {
            const f = cmds[0].filter;
            if (typeof f === 'function') {
                options.filter = f;
            }
            cmds = cmds.slice(1);
        }
        cmds = cmds.reduce((sum, el) => {
            RegExp(`^${line}`).test(el) &&
                sum.push(el) &&
                (max = Math.max(max, el.length));
            return sum;
        }, []);
        if (cmds.length > 1) {
            let commonStr = '';
            LOOP: for (let i = line.length; i < max; i++) {
                let c = null;
                for (let l of cmds) {
                    if (!l[i]) {
                        break LOOP;
                    }
                    else if (!c) {
                        c = l[i];
                    }
                    else if (c !== l[i]) {
                        break LOOP;
                    }
                }
                commonStr += c;
            }
            if (commonStr) {
                return { match: options.filter(line + commonStr) };
            }
            else {
                return { matches: cmds };
            }
        }
        else if (cmds.length === 1) {
            return { match: options.filter(cmds[0]) };
        }
        else {
            return { match: options.filter(line) };
        }
    }
    run() {
        return new Promise(function (resolve) {
            // @ts-ignore
            this._run(function (value) {
                // @ts-ignore
                this.addToHistory(context, value);
                resolve(value);
            });
        }.bind(this));
    }
}
exports.CommandPrompt = CommandPrompt;
CommandPrompt.formatList = (elems, maxSize = 40, ellipsized) => {
    const cols = process.stdout.columns;
    let max = 0;
    for (let elem of elems) {
        max = Math.max(max, elem.length + 4);
    }
    if (ellipsized && max > maxSize) {
        max = maxSize;
    }
    let columns = (cols / max) | 0;
    let str = '';
    let c = 1;
    for (let elem of elems) {
        str += CommandPrompt.setSpaces(elem, max, ellipsized);
        if (c === columns) {
            str += ' '.repeat(cols - max * columns);
            c = 1;
        }
        else {
            c++;
        }
    }
    return str;
};
CommandPrompt.setSpaces = (str, length, ellipsized) => {
    if (ellipsized && str.length > length - 4) {
        return ellipsize(str, length - 4) + ' '.repeat(4);
    }
    const newStr = str + ' '.repeat(length - str.length);
    return newStr;
};
// module.exports = CommandPrompt
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5xdWlyZXItY29tbWFuZC1wcm9tcHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnF1aXJlci1jb21tYW5kLXByb21wdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUM1QixNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDOUIsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBRXRDLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFBO0FBRXpELE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQTtBQUNwQixNQUFNLGNBQWMsR0FBRyxFQUFFLENBQUE7QUFDekIsTUFBTSxjQUFjLEdBQUcsRUFBRSxDQUFBO0FBRXpCLElBQUksT0FBTyxDQUFBO0FBRVgsTUFBYSxhQUFjLFNBQVEsV0FBVztJQUMxQyxXQUFXLENBQUMsT0FBTztRQUNmLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDckIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQTtZQUN2QixjQUFjLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1NBQzlCO0lBQ0wsQ0FBQztJQUVELGtCQUFrQixDQUFDLE9BQU8sRUFBRSxjQUFjO1FBQ3RDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDMUIsSUFBSSxjQUFjLEVBQUU7Z0JBQ2hCLGNBQWMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUMxQixJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQTthQUM1QztpQkFBTTtnQkFDSCxjQUFjLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFBO2FBQ3JDO1NBQ0o7SUFDTCxDQUFDO0lBRUQs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