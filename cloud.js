/*
	var obj = {
		name: '狼族小狈',
		QQ: 1340641314,
		github: 'https://github.com/1340641314/cloud',
		statement: '在保留头部版权的情况下，可以自由发布修改，应用于商业用途',
		version: '2.0.0',
		update: '2016-3-19'
	};
*/
!(function (cloud) {
    if (typeof define === 'function' && define.amd) {
        define(cloud());
    } else {
        window.cloud = cloud();
    }

})(function () {
    'use strict';
    var win = window;
    var doc = document;
    var count = 0; //用来统计弹出次数
    var cloud = {}; //对外暴露的对象
    var icon = ['success', 'warning', 'error', 'loading']; //系统默认图标

    /**
     * 打开一个云层
     */
    cloud.open = function (setting) {

        //定义默认插件配置
        var defaults = {
            title: '', //有值时才显示
            closeBtn: false, //标题上的关闭按钮，true时显示，false时不显示
            content: '', //有值时才显示
            icon: '', //内容要调用的图标，可自定义图标如： a.png当做参数传进来
            covered: false, //罩层，true时显示，false时不显示
            coveredClose: true, //true点击罩层关闭云层，false时不关闭
            button: [],
            load: function (el) {}, //云层创建完成后执行的方法
            close: function (el) {} //云层关闭前执行的方法，return false 则强制禁止关闭
        };

        var elCloud = document.createElement('div'); //创建html布局

        /**
         * 初始化执行方法
         */
        function init() {
            count++;
            setDef();
            createHtml();
            eventBind();
            show();
            return close;
        }
        /**
         * 覆盖默认配置
         */
        function setDef() {
            for (var key in setting) {
                defaults[key] = setting[key];
            }

        }

        /**
         * 创建 cloud html布局
         */
        function createHtml() {
            var html = [];

            elCloud.className = 'cloud';
            elCloud.id = 'cloud-' + count;
            elCloud.style.zIndex = 10000 + count;
            //主体区域 start
            html.push('<div class="cloud-main">');
            //创建标题
            if (defaults.title != '' || defaults.closeBtn) {
                html.push('<div class="cloud-title">');
                html.push(defaults.title);
                if (defaults.closeBtn) {
                    html.push('<div class="cloud-closebtn"></div>'); //显示标题上的关闭按钮
                }
                html.push('</div>');
            }
            //创建内容区域
            if (defaults.content != '') {
                html.push('<div class="cloud-content">' + getContent() + '</div>');
            }
            //创建按钮
            if (defaults.button.length > 0) {
                var button = defaults.button;
                html.push('<div class="cloud-button">');
                for (var i = 0; i < button.length; i++) {
                    html.push('<div class="cloud-button-item">' + button[i].name + '</div>');
                }
                html.push('</div>');
            }
            html.push('</div>');
            //主体区域 end
            //创建罩层
            if (defaults.covered) {
                html.push('<div class="cloud-cover"></div>');
            }
            elCloud.innerHTML = html.join('');
        }

        /**
         * 获取内容
         * @returns {boolean} 返回字符串
         */
        function getContent() {
            for (var i = 0; i < icon.length; i++) {
                if (icon[i] == defaults.icon) {
                    return '<div class="cloud-icon cloud-icon-' + icon[i] + '">' + defaults.content + '</div>';
                }
            }

            if (/^.*?(jpg|png|gif)$/.test(defaults.icon)) {
                return '<div class="cloud-icon" style="background-image: url(' + defaults.icon + ');">' + defaults.content + '</div>';
            } else {
                return defaults.content;
            }

        }
        /**
         * 事件绑定
         */
        function eventBind() {

            var elCloseBtn = elCloud.querySelector('.cloud-closebtn'); //关闭按钮
            var elButton = elCloud.querySelectorAll('.cloud-button-item'); //按钮列表
            var elCover = elCloud.querySelector('.cloud-cover'); //罩层

            //标题上的关闭按钮事件绑定
            if (elCloseBtn) {
                elCloseBtn.addEventListener('click', close, false);
            }
            //按钮列表事件绑定  
            if (elButton.length > 0) {

                for (var i = 0; i < defaults.button.length; i++) {
                    (function (el, button) {
                        el.addEventListener('click', function () {
                            if ('callback' in button) { //按钮对应的回调方法return false 则不关闭弹层
                                if (button.callback(elCloud) !== false) {
                                    close();
                                }
                            } else {
                                close();
                            }

                        }, false);
                    })(elButton[i], defaults.button[i]);
                }

            }
            //罩层事件绑定
            if (elCover && defaults.coveredClose) {
                elCover.addEventListener('click', close, false);
            }
        }
        /**
         * 加载完成后，显示
         */
        function show() {
            doc.body.appendChild(elCloud);
            defaults.load(elCloud);
            elCloud.style.margin = '-' + (elCloud.offsetHeight / 2) + 'px 0 0 -' + (elCloud.offsetWidth / 2) + 'px';
        }
        /**
         * 关闭云层，创建完成云层后会返回该方法
         */
        function close() {
            if (defaults.close(elCloud) !== false) { //关闭之前回调方法，return false 则不关闭云层
                elCloud.className += ' cloud-close';
                doc.body.removeChild(elCloud);
            }
        }
        return init();
    };
    /**
     * 自动消失消息框
     * @param {string}   content  要显示的消息
     * @param {string}   position 要显示的位置， 如：头部 10% 中部40% 底部80%
     * @param {string}   time     消失的时间
     */
    cloud.msg = function (content, position, time) {
        var bool = true;
        var close = this.open({
            content: content,
            load: function (el) {
                el.style.top = position || '50%';
                var elMain = el.querySelector('.cloud-main');
                elMain.style.background = 'rgba(0, 0, 0, 0.5)';
                elMain.style.border = 'none';
                elMain.style.width = 'auto';

                var elContent = el.querySelector('.cloud-content');
                elContent.style.color = '#fff';
                elContent.style.padding = '2px 10px';
                elContent.style.fontSize = '12px';
            },
            close: function (el) {
                if (bool) {
                    el.style.cssText += '-webkit-transition: all 0.5s;transition: all 0.5s;opacity: 0;';
                    bool = true;
                }

                return false; //关闭系统自动关闭
            }
        });

        setTimeout(close, time || 1500); //定时关闭
    };
    /**
     * 单行文本输入框
     * @param {string}   title    提示的内容
     * @param {string}   content    输入框的值
     * @param {function} callback 用户编辑完成点击确定执行的回调函数，传入一个参数为用户输入的文字；用户取消则无回调函数
     */
    cloud.text = function (title, content, callback) {
        this.open({
            title: title || '请输入内容',
            content: '<input class="cloud-text" type="text" value="' + (content || '') + '">',
            covered: true,
            coveredClose: false,
            closeBtn: true,
            button: [{
                name: '取消'
            }, {
                name: '确定',
                callback: function (el) {
                    var input = el.querySelector('.cloud-text');
                    callback(input.value);
                }
            }]
        });
    };
    /**
     * 多行文本输入框
     * @param {string}   title    提示的内容
     * @param {string}   content    输入框的值
     * @param {function} callback 用户编辑完成点击确定执行的回调函数，传入一个参数为用户输入的文字；用户取消则无回调函数
     */
    cloud.textarea = function (title, content, callback) {
        this.open({
            title: title || '请输入内容',
            content: '<textarea class="cloud-text">' + content + '</textarea>',
            covered: true,
            coveredClose: false,
            closeBtn: true,
            button: [{
                name: '取消'
            }, {
                name: '确定',
                callback: function (el) {
                    var input = el.querySelector('.cloud-text');
                    callback(input.value);
                }
            }]
        });
    };
    /**
     * 确定框
     * @param {string}   content 提示的内容
     */
    cloud.alert = function (content) {
        this.open({
            title: '系统提示',
            content: content,
            covered: true,
            closeBtn: true,
            button: [{
                name: '确定',
                callback: function () {}
            }]
        });
    };
    /**
     * 提示框
     * @param {string} content 提示的内容
     * @param {string} icon    要使用的图标
     */
    cloud.explain = function (content, icon) {
        this.open({
            content: content,
            covered: true,
            icon: icon || ''
        });
    };
    /**
     * 询问框
     * @param {string} content       询问的内容
     * @param {function} trueCallback  用户选择确定执行回调函数
     * @param {function} falseCallback 用户选择取消执行回调函数
     */
    cloud.asked = function (content, trueCallback, falseCallback) {
        this.open({
            content: content,
            covered: true,
            button: [{
                name: '取消',
                callback: falseCallback || function () {}
            }, {
                name: '确定',
                callback: trueCallback || function () {}
            }]
        });


    };
    /**
     * 单选框
     * @param {string}   title    标题
     * @param {Array}    list     选择的列表数据
     * @param {string}   key      列表显示的字段名称
     * @param {string} name     被选中的名称
     * @param {function} callback 用户选择后执行的回调函数，传入一个参数，即用户选择的数据对象
     */
    cloud.select = function (title, list, key, name, callback) {

        //保存关闭的方法
        var close = this.open({
            title: title,
            content: createSelectHtml(title, list, key, name),
            covered: true,
            button: [{
                name: '取消'
            }],
            load: load
        });

        /**
         * 加载完成后执行方法
         * @param {object} el 创建的元素
         */
        function load(el) {
            var select = el.querySelectorAll('.cloud-select');
            for (var i = 0; i < select.length; i++) {
                select[i].addEventListener('click', function () {

                    var select = this.parentNode.querySelectorAll('.cloud-select-true');
                    for (var i = 0; i < select.length; i++) {
                        select[i].className = 'cloud-select-false';
                    }
                    this.querySelector('div').className = 'cloud-select-true';
                    var index = parseInt(this.dataset.index);
                    callback(list[index]);
                    close();
                }, false);
            }
        }
    };
    /**
     * 多选框
     * @param {string}   title    标题
     * @param {Array}    list     选择的列表数据
     * @param {string}   key      列表显示的字段名称
     * @param {string} name     被选中的名称，多个使用|隔开
     * @param {function} callback 用户选择后执行的回调函数，传入一个参数，即用户选择的数据对象
     */
    cloud.checkbox = function (title, list, key, data, callback) {

        //保存关闭的方法
        var close = this.open({
            title: title,
            content: createSelectHtml(title, list, key, name),
            covered: true,
            button: [{
                name: '确定',
                callback: function (el) {
                    var select = el.querySelectorAll('.cloud-select-true');
                    var arr = [];

                    for (var i = 0; i < select.length; i++) {
                        var index = parseInt(select[i].parentNode.dataset.index);
                        arr.push(list[index]);
                    }
                    callback(arr);
                }
            }],
            load: load
        });

        /**
         * 加载完成后执行方法
         * @param {object} el 创建的元素
         */
        function load(el) {
            var select = el.querySelectorAll('.cloud-select');
            for (var i = 0; i < select.length; i++) {
                select[i].addEventListener('click', function () {
                    var bool = this.querySelector('div');
                    if (bool.className == 'cloud-select-false') {
                        bool.className = 'cloud-select-true';
                    } else {
                        bool.className = 'cloud-select-false';
                    }
                }, false);
            }
        }

    };

    /**
     * 创建选择框列表html代码
     * @param {string}   title    标题
     * @param {Array}    list     选择的列表数据
     * @param {string}   key      列表显示的字段名称
     * @param {string} name     被选中的名称，多个使用|隔开
     */
    function createSelectHtml(title, list, key, name) {

        var html = [];

        for (var i = 0; i < list.length; i++) {
            html.push('<div class="cloud-select" data-index="' + i + '">');
            var re = new RegExp('^(' + name.replace(/,/, '|') + ')$');
            if (re.test(list[i][key])) {
                html.push('<div class="cloud-select-true"></div>');
            } else {
                html.push('<div class="cloud-select-false"></div>');
            }
            html.push('<div class="cloud-select-title">' + list[i][key] + '</div>');
            html.push('</div>');
        }
        return html.join('');

    }
    /**
     * 加载框
     * @param   {string}   content 加载框提示的内容
     * @param   {boolean}  bool    true为点击罩层关闭，false为不关闭
     * @param   {string}   icon    自定义加载图标
     * @returns {function} 会返回一个关闭加载框的方法
     */
    cloud.loading = function (content, bool, icon) {
        return this.open({
            content: content,
            covered: true,
            coveredClose: bool == undefined ? true : bool,
            icon: icon || 'loading',
            load: function (el) {
                el.querySelector('.cloud-main').style.width = 'auto';
            }
        });
    };

    return cloud;
});