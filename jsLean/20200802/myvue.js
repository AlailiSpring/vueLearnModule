class vue {
    constructor(option) {
        this.option = option;
        this._data = this.option.data;
        this.el = document.querySelector(this.option.el);
        this.compileNode(this.el);
    }

    compileNode(el) {
        let child = el.childNodes;
        //console.log(child);
        [...child].forEach(node => {
            if (node.nodeType === 3) {
                //console.log('这是一个文本节点！');
                let text = node.textContent;
                console.log(text);
                let reg = /\{\{\s*([^\s\{\}]+)\s*\}\}/g;
                if (reg.test(text)) {
                    //与正则表达式匹配的第一个 子匹配
                    let $1 = RegExp.$1;
                    this._data[$1] && (node.textContent = text.replace(reg, this._data[$1]));
                }
            } else if (node.nodeType === 1) {
                this.compileNode(node);
            }
        });
    }
}