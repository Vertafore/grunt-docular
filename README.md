# grunt-docular

> Extensible Documentation Generation Based on AngularJS's Documentation Generation

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-docular --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-docular');
```

## The "docular" task

### Overview
In your project's Gruntfile, add a section named `docular` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    docular: {
        baseUrl: 'http://localhost:8000', //the base url of your app, this is rendered as the base tag
        showAngularDocs: true, //include the generation and rendering of angular documentation
        showDocularDocs: true, //include the generation and rendering of Docular documentation
        docAPIOrder : ['doc', 'angular'], //when ui resources are loaded they follow this order
        groups: [] //group objects to parse and render additional documentation (see api)
    },
})
```

### Options
baseURL (Type:`string`, default=""): Angular uses the <base> tag to designate the baseUrl for an app. This is helpful for helping resolve routes and location through the $location service

showAngularDocs (Type:`boolean`, default=false): The angular source is included in the docular package so it can be parsed and rendered to both help test the docular package and provide angular documentation for apps that use it.

showDocularDocs (Type:`boolean`, default=false): Setting this to true will have docular parse and render the documentation for the docular plugin itself. This is helpful for developers to understand the default doc api (docular-doc-api-doc) to help them create their own docular api extensions.

docAPIOrder (Type:`array [string]`, default=['doc', 'angular']): For each docular api extension, we need to know which order to include the UI scripts and CSS due to overrides etc..

groups (Type:`array [group object]`, default=[]): This is an array of group objects. Groups have their own api but generally consists of some meta data and lists of files that need to be parsed and rendered for documentation. For more check out

### Groups
Group configurations for Angular and the docular documentation are stored and pushed into all groups if you set the showAngularDocs and showDocularDocs options to true. These configurations are identical to what you would use to configure docular to parse and render your own documentation.

Here is the group configuration for Angular:
```js
{
    groupTitle: 'Angular Docs', //this is what will show up in the UI for this group
    groupId: 'angular', //to determine what directory these docs will go into and used as an identifier
    groupIcon: 'icon-book', //icon to use when relevant and within this group of documentation
    sections: [
        {
            id: "api",
            title:"Angular API",
            scripts: ["lib/angular/js"]
        },
        {
            id: "guide",
            title: "Developers Guide",
            docs: ["lib/angular/ngdocs/guide"]
        },
        {
            id: "tutorial",
            title: "Tutorial",
            docs: ["lib/angular/ngdocs/tutorial"]
        },
        {
            id: "misc",
            title: "Overview",
            docs: ["lib/angular/ngdocs/misc"]
        }
    ]
}
```

## Contributing


## Release History

