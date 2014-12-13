"use strict";

/*
 * grunt-docular
 * Copyright (c) 2013 John Martin
 * Licensed under the MIT license.
 */
var colors = require('colors');


module.exports = function(grunt) {

    function recursiveConfigMunge(groupData) {
        if(groupData.sections) {
            groupData.groups = groupData.sections;
        }
        if(groupData.id) {
            groupData.groupId = groupData.id;
            delete groupData.id;
        }
        if(groupData.title) {
            groupData.groupTitle = groupData.title;
        }
        if(!groupData.files) {
            groupData.files = [];
        }
        if(groupData.scripts) {
            groupData.files = groupData.files.concat(groupData.scripts);
            delete groupData.scripts;
        }
        if(groupData.docs) {
            groupData.files = groupData.files.concat(groupData.docs);
            delete groupData.docs;
        }

        groupData.files = grunt.file.expand({cwd: process.cwd()}, groupData.files)

        if(groupData.groupIcon) {
            groupData.groupIcon = groupData.groupIcon.replace('icon-', '').replace('fa-', '');
        } else {
            groupData.groupIcon = 'code';
        }

        if(groupData.groups) {
            for(var i = 0, l = groupData.groups.length; i < l; i++) {
                recursiveConfigMunge(groupData.groups[i]);
            }
        }

        return groupData;
    }

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

        recursiveConfigMunge(options);

        if(!options.plugins) {
            options.plugins = [require('docular-ng-plugin'), require('docular-markdown-plugin')];
        }
        
        //Run the gen-docs script
        var process_gen_docs_done = this.async();
        docular.genDocs(options).then(function () {
            process_gen_docs_done(true)
        }, function (err) {
            console.error(err);
            process_gen_docs_done(false);
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
            app.use('/sources', express.static(path.join(targetDir, '/sources')));
            app.use('/resources', express.static(path.join(targetDir, '/resources')));
            app.use('/site.json', express.static(path.join(targetDir, '/site.json')));
            app.use('/structure.json', express.static(path.join(targetDir, '/structure.json')));

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
