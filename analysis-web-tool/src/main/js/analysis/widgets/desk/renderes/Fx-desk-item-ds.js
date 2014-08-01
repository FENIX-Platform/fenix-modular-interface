/*global define */

define([
    'jquery',
    'jqwidgets'
], function ($) {

    'use strict';

    var defaultOptions = {
        interaction: "click",
        RESOURCES: 'resources',
        DSD: 'dsd',
        COLUMNS: 'columns',
        VALUES: 'values',
        DATA: 'data',
        COLUMN_ID: "columnId",
        tabs: ['metadata', 'table'],
        selectors: {
            content : {
                METADATA : ".tab-metadata-container",
                MAP : ".tab-map-container",
                TABLE : ".tab-table-container",
                COLUMN_CHART : ".tab-table-container",
                BAR_CHART : ".tab-columnchart-container",
                LINE_CHART : ".tab-linechart-container",
                PIE_CHART : ".tab-piechart-container"
            }
        },
        events: {
        }
    };

    function DataSetRender(options) {
        this.o = {};
        $.extend(true, this.o, defaultOptions, options);
    }

    DataSetRender.prototype.createMapCode = function (column) {
        var map = {};
        for (var i = 0; i < column.length; i++) {

        }
    };

    DataSetRender.prototype.processColumn = function (index, column) {

        if (column.hasOwnProperty(this.o.VALUES) && column[this.o.VALUES] !== null && column[this.o.VALUES].length <= 1) {
            this.hiddenColumns.push(column);
            this.indexesToDelete.push(index);
        } else {
            this.visibleColumns.push(column);
            this.dataFields.push({ name: column[this.o.COLUMN_ID], type: 'string' });

            if (column.dataType = "code") {
                console.log(column)
            }
        }
    };

    DataSetRender.prototype.getData = function () {

        for (var i = 0; i < this.rawData.length; i++) {

            //remove hidden columns
            for (var j = 0; j < this.indexesToDelete.length; j++) {
                this.rawData[i].splice(this.indexesToDelete[j], 1)
            }

            //create jQWidgets model
            var d = {};
            for (j = 0; j < this.visibleColumns.length; j++) {

                if (this.visibleColumns[j].dataType === 'code') {

                }
                d[this.dataFields[j].name] = this.rawData[i][j];
            }

            this.data.push(d);
        }

        return this.data;
    };

    DataSetRender.prototype.getDataFields = function () {
        return this.dataFields;
    };

    DataSetRender.prototype.getColumns = function () {

        for (var i = 0; i < this.dataFields.length; i++) {
            var c = { datafield: this.dataFields[i].name};
            c.text = this.getColumnLabel(this.visibleColumns [i]);
            this.columns.push(c);
        }

        return this.columns;
    };

    DataSetRender.prototype.getColumnLabel = function (column) {

        var label = 'not defined',
            keys;

        if (column.hasOwnProperty("title") && column.title !== null) {

            if (column.title.hasOwnProperty('EN')) {
                label = column.title['EN'];
            } else {

                keys = Object.keys(column.title);

                if (keys.length > 0) {
                    label = column.title[ keys[0] ];
                }
            }
        } else {

            if (column.hasOwnProperty("dimension") && column.dimension !== null) {

                if (column.dimension.hasOwnProperty("title") && column.dimension.title !== null) {

                    if (column.dimension.title.hasOwnProperty('EN')) {
                        label = column.dimension.title['EN'];
                    } else {

                        keys = Object.keys(column.dimension.title);

                        if (keys.length > 0) {
                            label = column.dimension.title[ keys[0] ];
                        }
                    }
                }
            }
        }

        return label;
    };

    DataSetRender.prototype.initInnerStructures = function (item) {

        //Select the first resource. We can create just one table here
        this.resource = item[this.o.RESOURCES][0];
        this.dsd = this.resource[this.o.DSD];
        this.visibleColumns = [];
        this.hiddenColumns = [];
        this.columnsCodeMapping = {};
        this.columns = [];
        this.indexesToDelete = [];
        this.dataFields = [];
        this.rawColumns = this.dsd[this.o.COLUMNS];

        for (var i = 0; i < this.rawColumns.length; i++) {
            this.processColumn(i, this.rawColumns[i]);
        }

        this.data = [];
        this.rawData = this.resource[this.o.DATA];
    };

    DataSetRender.prototype.activatePanels = function () {

        this.$template.find("li[data-tab]").hide();
        for (var i = 0; i < this.o.tabs.length; i++){
            this.$template.find("li[data-tab='"+ this.o.tabs[i]+"']").show();
        }

    };

    DataSetRender.prototype.buildTable = function () {

        var data = this.getData();
        // prepare the data
        var source = {
            datatype: "json",
            datafields: this.getDataFields(),
            localdata: data
        };
        var dataAdapter = new $.jqx.dataAdapter(source);
        this.$template.find(this.o.selectors.content.TABLE).jqxGrid(
            {
                width: '100%',
                source: dataAdapter,
                columns: this.getColumns()
            });

    };

    DataSetRender.prototype.renderItem = function (tamplate, item) {

        this.$template = tamplate;

        this.initInnerStructures(item);
        this.activatePanels();

        this.buildTable();

    };

    return DataSetRender;
});