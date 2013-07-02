Nodeworks
=========
Nodeworks is an open source IDE for Node.js applications based on [Adobe Brackets](https://github.com/adobe/brackets) project.
The IDE uses client-server model over HTTP, where the client is a standard web browser.
Nodeworks is designed to be an IDE for remote and collaborative application developmen,
but it can be used on stand-alone machines just as well.

Nodeworks is still in very early stage, nevertheless it is the IDE used for the development of Nodeworks itself.

Prerequisites
-------------
* Node.js v0.10 or newer
* Chrome or Chromium web browser

Installation
------------
Install from npm:

    $ npm install nodeworks -g
    
NOTE: Administrator (root) privileges are required. For Linux use with sudo.

Creating New Project From a Template
----------------------------------

    $ nodeworks -i "express -e" -d ./my-web-site
    
NOTE: Administrator (root) privileges are required. For Linux use with sudo.

Starting Nodeworks and Opening a Project
-----------------

    $ nodeworks -d ./my-web-site --IDE.port 6060
    
then open Chrome and navigate to **http://localhost:6060/works**

Command-line Options
--------------------
    -h, --help                       output usage information
    
    -V, --version                    output the version number
    
    -o, --open                       Opens the project in the default web browser. Warning: since Brackets currently supports only Chrome you should set it as your default browser.
    
    -i, --install <template>         Creates new project based on the template specified.
    
    -d, --directory <directory>      The path to the project root directory. If omitted, the CLI current working directory is assumed.
    
    -s, --start                      Starts Nodeworks server after template installation.
    
    -f, --force                      Force template installation on none empty directory.
    
    --IDE.port <port>                Specifies the TCP <port> for the IDE service. Alternatively, IDE__port environment variable can be set. If both are omitted, a random free port in the configured IDE ports range is assigned.
    
    --IDE.portRange.min <port>       Specifies the lowest TCP <port> for automatic port assignment for the IDE service. Alternatively, IDE__portRange__min environment variable can be set. The default value is 46100.
    
    --IDE.portRange.max <port>       Specifies the highest TCP <port> for automatic port assignment for the IDE service. Alternatively, IDE__portRange__max environment variable can be set. The default value is 46900.
    
    --live.port <port>               Specifies the TCP <port> for the Live server. Alternatively, live__port environment variable can be set. If both are omitted, a random free port in the configured Live Server ports range is assigned.
    
    --live.portRange.min <port>      Specifies the lowest TCP <port> for automatic port assignment for the Live server. Alternatively, live__portRange__min environment variable can be set. The default value is 44100.
    
    --live.portRange.max <port>      Specifies the highest TCP <port> for automatic port assignment for the Live server. Alternatively, live__portRange__max environment variable can be set. The default value is 44900.
    
    --debugger.port <port>           Specifies the TCP <port> for the Debugger service. Alternatively, debugger__port environment variable can be set. The default value is 8080.
    
    --debugger.portRange.min <port>  Specifies the lowest TCP <port> for automatic port assignment for debugging. Alternatively, debugger__portRange__min environment variable can be set. The default value is 45100.
    
    --debugger.portRange.max <port>  Specifies the highest TCP <port> for automatic port assignment for debugging. Alternatively, debugger__portRange__max environment variable can be set. The default value is 45900.

Features
--------
Multiple users can debug server code simultaneously without interfering with each other.
However, at  the current stage all users will be modifying the same files,
which may cause conflicts and loss of changes if more then one person is working on the same file.
In the future this problem will be solved with Git repositories.
Each user will be provided with a private repository upon authentication.

**Module Manager** – visually manage: browse, search, install, update and uninstall NPM packages.
Supports custom NPM registries.

**Project Templates** – custom templates can be easily created.

**Debugging** - TODO:

**Unit Testing** - TODO:

Roadmap
-------
TODO: