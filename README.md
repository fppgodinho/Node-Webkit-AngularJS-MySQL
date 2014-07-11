Node-Webkit-AngularJS-MySQL
===========================

A testing project that explores the combination of Node-Webkit with AngularJS and MySQL

INSTALLATION
===========================
1) Run npm install at the / folder.
1) Run npm install at the /build/ folder.
2) Run the grunt's default target at the / folder.
3) Execute the application inside the '/dist/releases/' folder.

WORKFLOW
===========================
The JS source files ca be found inside /src/js/client/ and /src/js/server/ folders.
The css are sass part files found under /src/css/ folder which in turn use what's inside /src/media/ folder as source for inline images. 
The html template sources are found under /src/html/ folder.

When the grunt compile target is run:
 The js sources are concatenated into 2 files the /build/js/client.js and the /build/js/server.js.
 The sass part files are all resolved into /build/css/styles.css.
 The html templates are copied into the /build/templates/ folder and keep the original structure found in /src/html/ folder.
 
When the grunt compress target is run:
 The js files under /build/js/ folder are minified and uglyfied.
 the css file under /build/css/ folder and the html files under /build/templates/ folder are all minified as well.
 
When the grunt default target us run:
 All the above are processed and then the node-webkit packages are generated under /dist/releases/ folder for each release target using the files under /build/ as source. The default are Windows and Mac.