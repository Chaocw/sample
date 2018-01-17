requirejs.config({
      baseUrl: "src/js",
      paths: {
        'jquery': 'bower_components/jquery/dist/jquery.min'
      }
    });

    requirejs(['app/index']);