Node-Webkit-AngularJS-MySQL
===========================

A testing project that explores the combination of Node-Webkit with AngularJS and MySQL


INSTALLATION
===========================
1) Run npm install at the root.
2) Run the grunt's default target.
3) Execute the application inside the 'dist' directory.

WORKFLOW
===========================
The JS source files ca be found inside /src/js/client and /src/js/server.
The css are sass part files found under /src/css which in turn use what's inside /src/media as source for inline images. 
The html template sources are found under /src/html.

When the grunt compile target is run:
 The js sources are concatenated into 2 files the /build/js/client.js abd the /build/js/server.js.
 The sass part files are all resolved into /build/css/styles.css.
 The html templates are copied into the /build/templates and keep the original structure they are found in /src/html.
 
When the grunt compress target is run:
 The js files under /build/js are minified and uglyfied.
 the css file under /build/css and the html files under /build/templates are all minified as well.
 
When the grunt default target us run:
 All the above are processed and then the node-webkit packages are generated under /dist/releases folder for each release target using the files under /build as source. The default are Windows and Mac.