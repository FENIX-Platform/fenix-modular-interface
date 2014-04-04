/*global define, window */

define(["jquery", ""], function( $ ) {

    var lang = 'EN',
        json_config = 'json/analysis.json',
        s_topmenu ='#top-menu',
        s_header = '#header',
        s_filterbuilder = '#filterbuilder',
        s_grid = '#grid',
        s_grid_ctrl_btns = '#grid-ctrl-btns',
        s_sessionstore_panel = '#sessionstore-panel',
        s_sessionstore_counter = '#sessionstore-counter',
        s_footer = '#footer';

    function IndexContext(){}

    IndexContext.prototype.initialize = function() {
        var topMenu, footer, header, catalog, grid, sessionStore;

    };

    return IndexContext;

});