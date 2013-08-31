"use strict";

/*
 * grunt-docular
 * Copyright (c) 2013 John Martin
 * Licensed under the MIT license.
 */
var colors = require('colors');

module.exports = function(grunt) {

    var sys = require('sys');
    var exec = require('child_process').exec;

    // ==========================================================================
    // TASKS : That can be used and configured in the intiConfigs
    // ==========================================================================

    /**
    * The main docular task
    * @return {[type]}
    */
    grunt.registerTask('docular', 'Configurable setup to generate AngularJS and other class based documentation.', function() {

        var docular = require('docular');
        var options = grunt.config('docular');

        //Run the gen-docs script
        var process_gen_docs_done = this.async();
        docular.genDocs(options, function(){

            //make good on the async promise
            return process_gen_docs_done();
        });

    });


    /**
     * Launch a simple nodeJS web server for documentation
     * @param  {number} requestedPort optionally specifies the port on which the server will listen.  Default is 8000
     */
    grunt.registerTask('docular-server', 'Start a simple NodeJS server so you can view the documentation.', function(requestedPort) {

        var options_docular = grunt.config('docular') || {};
        var options = grunt.config('docular-server') || {};
        var port = requestedPort || options.port || 8000;

        var docular = require('docular');

        //Grab a new async promise
        var process_server_done = this.async();
        try {

            docular.server({port:port, docular_webapp_target: options_docular.docular_webapp_target}, function(){
                process_server_done();
            });

        } catch (e) {

            console.log("ERROR:".red, ' Could not start node server', e);

        }

        //Notify the user
        console.log("");
        console.log("Documentation server running at ".yellow + ('http://127.0.0.1:' + port + '/').green);

    });

};
