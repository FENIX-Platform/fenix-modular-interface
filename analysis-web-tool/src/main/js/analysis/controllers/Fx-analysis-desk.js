/*global define */

define([
    'fx-ana/widgets/desk/Fx-desk-items-renderer'
], function (Renderer) {

    function DeskController() {
        this.renderer = new Renderer();
    }

    //(injected)
    DeskController.prototype.grid = undefined;

    DeskController.prototype.renderComponents = function () {

        this.grid.render();
    };

    DeskController.prototype.preValidation = function () {

        if (!this.grid) {
            throw new Error("DeskController: INVALID GRID ITEM.")
        }
        if (!this.renderer) {
            throw new Error("DeskController: INVALID RENDERER ITEM.")
        }
    };

    DeskController.prototype.render = function () {

        this.preValidation();
        this.renderComponents();
    };

    DeskController.prototype.addItem = function ( item ) {

        var container = document.createElement('DIV'),
            handler = document.createElement('DIV'),
            content = document.createElement('DIV');

        container.className = 'fx-analysis-item';
        handler.className = "fx-catalog-modular-form-handler";
        content.className = 'fx-desk-item';

        container.appendChild(handler);
        container.appendChild(content);

        this.grid.addItem(container);
        this.renderer.renderItem(content, item);
    };

    DeskController.prototype.removeItem = function (item) {

        this.grid.removeItem(item);
    };

    DeskController.prototype.clear = function () {

        this.grid.clear();
    };

    return DeskController;
});