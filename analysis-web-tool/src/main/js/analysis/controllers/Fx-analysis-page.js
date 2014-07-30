/*global define */

define([
    //'pnotify',
    //'lib/pnotify.nonblock',
    'lib/tweenmax'
], function () {

    function PageController() {
    }

    //(injected)
    PageController.prototype.desk = undefined;

    //(injected)
    PageController.prototype.catalog = undefined;

    //(injected)
    PageController.prototype.stack = undefined;

    //(injected)
    PageController.prototype.storage = undefined;

    //(injected)
    PageController.prototype.bridge = undefined;

    PageController.prototype.initAnimation = function () {

        var that = this;

        $('.overlay-content').hide();

        $("#btn").on('click', that.openOverlay);

        $(".closeOverlay").on('click', function (e) {
            e.stopPropagation();
            that.closeOverlay();
        });
    };

    PageController.prototype.openOverlay = function () {

        TweenLite.to(
            document.querySelector("#overlay"), 1,
            {
                width: "100%",
                height: "100%",
                ease: Power2.easeInOut,
                onComplete: function () {
                    $('.overlay-content').fadeIn('fast');
                }
            });
    };

    PageController.prototype.closeOverlay = function () {
        $('.overlay-content').fadeOut("fast", function () {

            $('.overlay-content').hide();
            TweenLite.to($("#overlay"), 1, { width: "0%", height: "0%", ease: Power2.easeInOut});

        })
    };

    PageController.prototype.preValidation = function () {

    };

    PageController.prototype.addItemToDesk = function (item) {
        this.desk.addItem(item);
    };

    PageController.prototype.removeItemFromDesk = function (item) {

        this.grid.removeItem(item);
    };

    PageController.prototype.addItemToStack = function (item) {

        this.stack.addItem(item);
    };

    PageController.prototype.removeItemFromStack = function (item) {

        this.stack.removeItem(item);
    };

    PageController.prototype.loadSession = function () {

        var self = this;

        this.storage.getItem('fx.catalog', function (items) {
            var datasets;

            if (items) {
                datasets = JSON.parse(items);
                for (var i = 0; i < datasets.length; i++) {
                    self.getData(datasets[i]);
                }
            }
        });
    };

    PageController.prototype.getData = function (uid) {

        var settings = {
            uid: uid,
            success: $.proxy( this.addItemToDesk, this)
        };
        this.bridge.query(settings);
    };

    PageController.prototype.renderComponents = function () {

        this.desk.render();
        this.catalog.render();
        this.stack.render();

        this.initAnimation();
    };

    PageController.prototype.initEventListeners = function () {

        var that = this;

        $('body').on('analyze', function (e, payload) {
            that.closeOverlay();
            that.getData(payload)
        });
    };

    PageController.prototype.render = function () {

        this.preValidation();
        this.initEventListeners();
        this.renderComponents();
        this.loadSession();
    };

    return PageController;
});