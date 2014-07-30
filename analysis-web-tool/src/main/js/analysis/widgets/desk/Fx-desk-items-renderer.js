/*global define */

define([
    'jquery',
    'fx-ana/widgets/desk/renderes/Fx-desk-item-ds',
    'text!fx-ana/html/widgets/desk/items/structure.html'
], function ($, DataSetRenderer, template) {

    'use strict';

    var o = { },
        defaultOptions = {
            interaction: "click"
        },
        selectors = {
        },
        events = {
            CREATE_PANEL: "",
            ADD_ITEM: "",
            REMOVE_ITEM: ""
        };

    function GridItemRenderer(options) {
        $.extend(true, o, defaultOptions, options);
        this.ds = new DataSetRenderer();
    }

    GridItemRenderer.prototype.renderItem = function (container, item) {

        this.initBlankTemplate();

        $(container).append(this.$template);
        this.$template.find('UL').tab();
        this.ds.renderItem(this.$template.find('#table_' + window.fx_dynamic_id_counter), item);

    };

    GridItemRenderer.prototype.initBlankTemplate = function () {

        this.$template = $(template);

        var r = 'REPLACE';
        window.fx_dynamic_id_counter > -1 ? window.fx_dynamic_id_counter++ : window.fx_dynamic_id_counter = 0;

        this.$template.find("[id*='" + r + "'], [href*='" + r + "']").each(function () {

            var o = $(this).attr('id');
            if (o) $(this).attr('id', o.replace(r, window.fx_dynamic_id_counter));
            o = $(this).attr('href');
            if (o) $(this).attr('href', o.replace(r, window.fx_dynamic_id_counter));
        });


    };

    return GridItemRenderer;
});