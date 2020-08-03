class vue extends EventTarget{
    constructor(option) {
        super();
        this.option = option;
        this._data = this.option.data;
        this.el = document.querySelector(this.option.el);
        this.compileNode(this.el);
        this.observe(this._data);
    }

    observe(data){
        let _this = this;
        this._data = new Proxy(data, {
            set(target, prop, value) {
                //console.log(value);
                let event = new CustomEvent(prop,{
                    detail: value
                });
                _this.dispatchEvent(event);

                return Reflect.set(...arguments);
            }
        });
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
                    //与正则表达式匹配的第一个子匹配
                    let $1 = RegExp.$1;
                    this._data[$1] && (node.textContent = text.replace(reg, this._data[$1]));

                    this.addEventListener($1, e => {
                        node.textContent = text.replace(reg, e.detail);
                    });
                }
            } else if (node.nodeType === 1) {
                let attr = node.attributes;
                if (attr.hasOwnProperty('v-model')) {
                    let keyName = attr['v-model'].nodeValue;
                    //用户数据绑定到input标签
                    node.value = this._data[keyName];
                    //input绑定监听，input值发生改变，要绑定到外层显示内容上
                    node.addEventListener('input', e => {
                        this._data[keyName] = node.value;
                    });

                }
                //递归调用
                this.compileNode(node);
            }
        });
    }
}