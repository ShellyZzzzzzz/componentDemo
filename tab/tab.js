(function ($) {
    'use strict';

    var Tab = function (el, config) {
        var _this = this;

        if (!(el && el.nodeType && el.nodeType === 1)) {
            throw 'Tab: `el` must be HTMLElement, and not ' + {}.toString.call(el);
        }

        this.el = $(el); // root element

        // 扩展默认配置参数
        this.config = $.extend({
            triggerType: 'click', // 触发事件 click或mouseover
            effect: 'fade', // 切换效果
            active: 1, // 默认选中
            auto: false // 是否自动切换 false或自动切换时间
        }, config);

        // 保存tab标签列表以及对应的内容列表
        this.navItems = this.el.find('.ui-tab-nav li');
        this.contentItems = this.el.find('.ui-tab-content .ui-tab-content-item');

        var config = this.config;
        this.navItems.bind(config.triggerType, function () {
            _this.invoke($(this));
        });

        // 当配置了auto为时间, 启用自动切换功能
        if (config.auto) {
            // 定义一个全局的定时器
            this.timer = null;
            // 计数器
            this.loop = 0;
            this.autoPlay();

            this.contentItems.hover(function () {
                window.clearInterval(_this.timer);
            }, function () {
                _this.autoPlay();
            });
        }

        // 设置默认显示第几个tab
        if (config.active > 1) {
            _this.invoke(_this.navItems.eq(config.active - 1));
        }
    };

    Tab.prototype = {
        // 事件驱动函数
        invoke: function (currentTab) {
            var _this = this;
            var index = currentTab.index();
            // 切换导航选中状态
            currentTab.addClass('active').siblings().removeClass('active');

            // 切换对应的内容区域
            var effect = this.config.effect;
            var contentItems = this.contentItems;
            if (effect === 'default') {
                contentItems.eq(index).addClass('active').siblings().removeClass('active');
            } else if (effect === 'fade') {
                contentItems.eq(index).fadeIn().siblings().fadeOut();
            }

            // 设置自动切换时 同步下标和loop
            if (this.config.auto) {
                this.loop = index;
            }
        },

        // 自动播放事件
        autoPlay: function () {
            var _this     = this,
                config    = this.config,
                navItems  = this.navItems,
                navLength = navItems.length;

            this.timer = window.setInterval(function () {
                _this.loop++;
                if (_this.loop >= navLength) {
                    _this.loop = 0;
                }
                navItems.eq(_this.loop).trigger(config.triggerType);

            }, config.auto);
        }

    };

    window.Tab = Tab;
})(jQuery);