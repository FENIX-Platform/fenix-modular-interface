/*global define */

define([
    'jquery',
    'text!fx-ana/html/widgets/fx-widgets-stack/item-structure.html'
], function ($, template) {

    'use strict';

    var defaultOptions = {
            interaction: "click",
            selectors : {
                'MOVE_TO_DESk' : ".fx-sessionstore-item-movemetodesk",
                'REMOVE' : ".fx-sessionstore-item-removeme"
            },
            events : {
                MOVE_TO_DESK: "moveToDesk",
                REMOVE_ITEM: "removeStackItem"
            }
        };

    function DataSetRender(options) {
        if (this.o === undefined) {
            this.o = {};
        }
        $.extend(true, this.o, defaultOptions, options);
    }
    
    DataSetRender.prototype.initStructure = function () {

        this.$template = $(template);

        this.$template.find(this.o.selectors.MOVE_TO_DESk).on(this.o.interaction, {self: this}, function(e){
            $(this).trigger(e.data.self.o.events.MOVE_TO_DESK, [e.data.self.model, e.data.self.container])
        });

        this.$template.find(this.o.selectors.REMOVE).on(this.o.interaction, {self: this}, function(e){
            $(this).trigger(e.data.self.o.events.REMOVE_ITEM, [e.data.self.model, e.data.self.container]);
        })

    };

    DataSetRender.prototype.renderItem = function ( container, model ) {

        this.model = model;
        this.container = container;
        this.initStructure();

        $(container).append(this.$template);
    };

    return DataSetRender;
});