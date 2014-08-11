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
    grunt.registerTask('docularserver', 'Start a simple Express server so you can view the documentation.', function(requestedPort) {

        var path=require('path');

        var options = grunt.config('docularserver') || {};
        var port = requestedPort || options.port || 8000;
        var targetDir = path.join(process.cwd(), options.targetDir)

        //Grab a new async promise
        var process_server_done = this.async();
        try {
            var express = require('express');
            var app = express();

            if (options.livereload){
                console.log('live reload enabled');
                app.use(require('connect-livereload')({
                    port: 35729
                }));
            }

            app.use('/configs',  express.static(path.join(targetDir, '/configs')));
            app.use('/controller', express.static(path.join(targetDir, '/controller')));
            app.use('/documentation', express.static(path.join(targetDir, '/documentation')));
            app.use('/resources', express.static(path.join(targetDir, '/resources')));

            app.use('/resources', function(req,res){
                res.status(404).send('');
            });

            app.use('/', function (req, res){
               res.sendfile(path.join(targetDir, '/index.html'));
            });

            var server = app.listen(port, function(){
                //Notify the user
                console.log("");
                console.log("Documentation server running at ".yellow + ('http://127.0.0.1:' +  server.address().port + '/').green);
            });
        } catch (e) {
            console.log("ERROR:".red, ' Could not start node server', e);
        }



    });

};
