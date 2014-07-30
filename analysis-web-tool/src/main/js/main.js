// relative or absolute path of Components' main.js
require([
    'http://localhost:8080/catalog/js/paths.js',
    './paths'
], function (Catalog, Analysis) {

    // NOTE: This setTimeout() call is used because, for whatever reason, if you make
    //       a 'require' call in here or in the Cart without it, it will just hang
    //       and never actually go fetch the files in the browser. There's probably a
    //       better way to handle this, but I don't know what it is.
    setTimeout(function () {

        /*
         @param: prefix of Components paths to reference them also in absolute mode
         @param: paths to override
         @param: callback function
         */
        Catalog.initialize('http://localhost:8080/catalog/js', null, function () {

            Analysis.initialize('./', null, function () {

                require([
                    'fx-ana/start',
                    'fx-cat-br/start'
                ], function (Analysis, Catalog) {

                    new Analysis().init({
                        catalog: new Catalog()
                    });

                });
            });
        });
    }, 0);
});
