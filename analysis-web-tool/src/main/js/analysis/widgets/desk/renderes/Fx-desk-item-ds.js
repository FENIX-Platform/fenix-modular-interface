/*global define */

define([
    'jquery',
    'jqwidgets',
    'highcharts'
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
        tabs: ['metadata', 'table', 'charts'],
        selectors: {
            content: {
                METADATA: ".tab-metadata-container",
                MAP: ".tab-map-container",
                TABLE: ".tab-table-container",
                COLUMN_CHART: ".tab-columnchart-container",
                BAR_CHART: ".tab-barchart-container",
                LINE_CHART: ".tab-linechart-container",
                PIE_CHART: ".tab-piechart-container"
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

    DataSetRender.prototype.getTitle = function () {
        return this.model.metadata
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

        var label =  this.getLabel(column, "title");

        if (label === null) {
            if (column.hasOwnProperty("dimension") && column.dimension !== null) {
                label = this.getLabel(column.dimension, "title");
            }
        }
        return label;
    };
    
    DataSetRender.prototype.getLabel = function (obj, attribute) {

        var label= "not defined",
            keys;

        if (obj.hasOwnProperty(attribute) && obj.title !== null) {

            if (obj[attribute].hasOwnProperty('EN')) {
                label = obj[attribute]['EN'];
            } else {

                keys = Object.keys(obj[attribute]);

                if (keys.length > 0) {
                    label = obj[attribute][ keys[0] ];
                }
            }
        }

        return label;
    };

    DataSetRender.prototype.initInnerStructures = function () {

        console.log(this.model)

        //Select the first resource. We can create just one table here
        this.dsd = this.model[this.o.DSD];
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
        this.rawData = this.model[this.o.DATA];
    };

    DataSetRender.prototype.activatePanels = function () {

        this.$template.find("li[data-tab]").hide();
        for (var i = 0; i < this.o.tabs.length; i++) {
            this.$template.find("li[data-tab='" + this.o.tabs[i] + "']").show();
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
                columns: this.getColumns(),
                theme: "fenix"
            });

    };

    DataSetRender.prototype.buildCharts = function () {

        var conf = {
            title: {
                text: 'Monthly Average Temperature',
                x: -20 //center
            },
            xAxis: {
                categories: [2000, 2001, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct']
            },
            yAxis: {
                title: {
                    text: 'Quantity'
                },
                plotLines: [
                    {
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }
                ]
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [
                {
                    name: 'Tokyo',
                    data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                },
                {
                    name: 'New York',
                    data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
                },
                {
                    name: 'Berlin',
                    data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
                },
                {
                    name: 'London',
                    data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                }
            ]
        };

        this.$template.find(this.o.selectors.content.COLUMN_CHART).highcharts(conf);

    };

    DataSetRender.prototype.renderItem = function (tamplate, item) {

        this.$template = tamplate;
        this.model = item.resources[0];

        this.initInnerStructures( this.model );
        this.activatePanels();

        this.buildTable();
        this.buildCharts();

    };

    return DataSetRender;
});