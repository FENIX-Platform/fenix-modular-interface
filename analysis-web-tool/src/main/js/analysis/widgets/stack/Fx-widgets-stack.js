/*global define */

define([
    'jquery',
    'fx-ana/widgets/stack/Fx-stack-items-renderer',
    'text!fx-ana/html/widgets/fx-widgets-stack/template.html',
    //third party libraries
    'lib/mbExtruder',
    'lib/jquery.mb.flipText',
    'lib/jquery.hoverIntent'
], function ($, Renderer, template) {

    'use strict';

    var o = { },
        defaultOptions = {
            interaction: "click",
            panel: {
                positionFixed: true,
                width: 350,
                sensibility: 800,
                position: "right", // left, right, bottom
                extruderOpacity: 1,
                flapDim: 100,
                textOrientation: "bt", // or "tb" (top-bottom or bottom-top)
                onExtOpen: function () {
                },
                onExtContentLoad: function () {
                },
                onExtClose: function () {
                },
                hidePanelsOnClose: true,
                autoCloseTime: 0, // 0=never
                slideTimer: 300
            }
        },
        selectors = {
            LIST: "#fx-ws-list",
            CLOSE_BTN: "#fx-ws-close-btn"
        },
        events = {
            CREATE_PANEL: "",
            ADD_ITEM: "",
            REMOVE_ITEM: ""
        };

    function FxWidgetsStack(options) {
        $.extend(true, o, defaultOptions, options);
        this.renderer = new Renderer();
    }

    FxWidgetsStack.prototype.init = function (options) {
        $.extend(true, o, defaultOptions, options);
        return this;
    };

    FxWidgetsStack.prototype.render = function () {
        this.createPanel();
    };

    FxWidgetsStack.prototype.createPanel = function () {

        this.$panel = $(o.container);

        //Inject template
        this.$panel.html(template);

        this.$panel.buildMbExtruder(o.panel);

        //always after buildMbExtruder()
        this.initPanelBtns();
    };

    FxWidgetsStack.prototype.initPanelBtns = function () {

        //Close button
        this.$panel.find(selectors.CLOSE_BTN).on(o.interaction, $.proxy(this.closePanel, this));
    };

    FxWidgetsStack.prototype.openPanel = function (bool) {
        this.$panel.openMbExtruder(bool);
    };

    FxWidgetsStack.prototype.closePanel = function () {
        this.$panel.closeMbExtruder();
    };

    FxWidgetsStack.prototype.createItem = function (item) {

        return this.renderer.getItem();
    };

    FxWidgetsStack.prototype.addItem = function (item) {

        this.$panel.find(selectors.LIST).append(this.createItem(item));
        this.$panel.trigger(events.ADD_ITEM, [item]);
    };

    FxWidgetsStack.prototype.removeItem = function (item) {
        var self = this;
        this.$panel.find($(item)).fadeOut('fast', function () {
            self.trigger(events.ADD_ITEM, [item]);
            $(this).remove();
        });
    };

    return FxWidgetsStack;
});