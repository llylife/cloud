/*
	var obj = {
		name: '狼族小狈',
		QQ: 1340641314,
		github: 'https://github.com/1340641314/layer',
		statement: '在保留头部版权的情况下，可以自由发布修改，应用于商业用途',
		version: '1.0.0',
		update: '2016-1-5'
	};
*/
(function (win) {

  var doc = document;
  win.layer = {
    setting: null,
    style: null,
    element: {},
    timer: null,
    init: function () {
      var element = this.element;
      var setting = this.setting;
      var style = this.style;
      
      //主框架
      element.oLayer = doc.createElement('div');
      element.oLayer.className = 'layer';

      //主内容区
      element.oMain = doc.createElement('div');
      element.oMain.className = 'layer-main';
      element.oLayer.appendChild(element.oMain);

      //罩层
      if (setting.covered != false) {
        element.oCovered = doc.createElement('div');
        element.oCovered.className = 'layer-covered';
        if (setting.coveredClose != false) {
          element.oCovered.addEventListener('click', function (oLayer) {
            this.close(oLayer);
          }.bind(this, element.oLayer), false);
        }
        element.oLayer.appendChild(element.oCovered);
      }

      //标题
      if (setting.title) {
        element.oTitle = doc.createElement('div');
        element.oTitle.className = 'layer-title';
        element.oTitle.innerHTML = setting.title;
        element.oMain.appendChild(element.oTitle);

        //关闭
        if (setting.close) {
          element.oClose = doc.createElement('div');
          element.oClose.className = 'layer-title-close';
          element.oClose.addEventListener('click', function (oLayer) {
            this.close(oLayer);
          }.bind(this, element.oLayer), false);
          element.oTitle.appendChild(element.oClose);
        }
      }

      //内容
      element.oContent = doc.createElement('div');
      element.oContent.className = 'layer-content';
      element.oContent.innerHTML = setting.content || '暂无内容';
      element.oMain.appendChild(element.oContent);

      //按钮
      if (setting.button && typeof (setting.button) === 'object' && typeof (setting.button.length) == 'number') {
        element.oButton = doc.createElement('div');
        element.oButton.className = 'layer-button';

        //循环子列表按钮
        var aButton = setting.button;
        for (var i = 0; i < aButton.length; i++) {
          var oBtn = doc.createElement('div');
          oBtn.className = 'layer-button-item';
          oBtn.innerHTML = aButton[i].name;
          //按钮绑定事件
          if (!aButton[i].callback) {
            aButton[i].callback = function () {}; //如果没有回调函数，则给一个空函数
          }
          oBtn.addEventListener('click', function (oLayer, callback) {
            this.close(oLayer);
            callback(); //执行按钮回调函数
          }.bind(this, element.oLayer, aButton[i].callback.bind(this)), false);
          element.oButton.appendChild(oBtn);
        }

        element.oMain.appendChild(element.oButton);
      }

      //设置css
      for (var key in style) {
        var name = key.replace(/\b(\w)|\s(\w)/g, function (m) {
          return m.toUpperCase();
        });
        var curStyle = style[key];

        for (var attr in curStyle) {
          this.element['o' + name].style[attr] = curStyle[attr];
        }
      }

      //显示弹层
      doc.body.appendChild(element.oLayer);

      //设置定时器
      if (typeof (setting.time) == 'number') {
        this.timer = setTimeout(function (oLayer) {
          this.close(oLayer);
        }.bind(this, element.oLayer), setting.time);
      }
    },
    open: function (setting, style) {
      this.setting = setting || {};
      this.style = style || {};
      this.init();

    },
    close: function (oLayer) {
      if (!oLayer) {
        oLayer = this.element.oLayer;
      }
      //移除节点
      if (oLayer.parentNode == document.body) {
        document.body.removeChild(oLayer);
      }
    },
    msg: function (content, type, time) {
      var layerStyle = {};

      if (type == 'top') {
        layerStyle.top = '50px';
        layerStyle.bottom = 'auto';
      } else if (type == 'center') {
        layerStyle.top = 'auto';
        layerStyle.bottom = '50%';
      } else {
        layerStyle.top = 'auto';
        layerStyle.bottom = '50px';
      }
      
      this.open({
        covered: false,
        content: content,
        time: time || 1000
      }, {
        layer: layerStyle,
        main: {
          minWidth: '0'
        },
        content: {
          padding: '0 10px',
          background: 'rgba(85, 85, 85, 0.7)',
          lineHeight: '24px',
          fontSize: '13px',
          color: '#fff'
        }
      });
    },
    explain: function (content) { //系统提示
      this.open({
        title: '系统提示',
        close: true,
        coveredClose: true,
        content: content,
      });
    },
    asked: function (content, leftFn, rightFn) {
      this.open({
        close: false,
        coveredClose: false,
        content: content,
        button: [{
          name: '取消', 
          callback: leftFn
        }, {
          name: '确定',
          callback: rightFn
        }]
      });
    },
    alert: function (content) {
      this.open({
        close: false,
        coveredClose: false,
        content: content,
        button: [{
          name: '确定'
        }]
      });
    },
    load: function (content, coveredClose) {
      this.open({
        covered: true,
        coveredClose: coveredClose,
        content: '<div class="layer-content-loading"></div><p style="font-size: 13px; color: #222;">' + content + '</p>'
      }, {
        layer: {
          top: '40%',
          bottom: 'auto'
        },
        main: {
          minWidth: '0'
        },
        content: {
          padding: '5px',
          background: '#fff',
          lineHeight: '24px',
          fontSize: '13px',
          textAlign: 'center',
          color: '#555'
        }
      });
    }
  };

})(window);
