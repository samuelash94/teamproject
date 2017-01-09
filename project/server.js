var http = require('http');
var url = require('url');
var express = require('express');
var app = express();
var router = express.Router();
var fs = require('fs');
var qs = require('querystring');
var path = require('path');
var formidable = require("formidable");
var util = require('util');
var routes = require('./routes');
var jsonFile;

app.use(express.static(path.join('testing.js', 'public')));
app.get('/', routes.index);

//config
var config = {
    port: 3334,
    //localIPs: ['127.0.0.1'],
    srcpath: '/src'
};


//var server = http.createServer(processRequestRoute).listen(config.port);

http.createServer(function (req, res){
	processRequestRoute(req, res);
    if (req.method.toLowerCase() == 'get') {
        displayForm(req, res);
    } else if (req.method.toLowerCase() == 'post') {
        processFormFieldsIndividual(req, res);
    }
}).listen(config.port);

console.log("Server has started. port:"+config.port);

function displayForm(req, res){

	if (url.parse(req.url).pathname === '/destinations/barbados.JSON'){ jsonFile = 'destinations/barbados.JSON'; }
	else if(url.parse(req.url).pathname === '/destinations/barcelona.JSON'){ jsonFile = 'destinations/barcelona.JSON'; }
	else if(url.parse(req.url).pathname === '/destinations/kualalumpur.JSON'){ jsonFile = 'destinations/kualalumpur.JSON'; }
	else if(url.parse(req.url).pathname === '/destinations/nyc.JSON'){ jsonFile = 'destinations/nyc.JSON'; }
	else if(url.parse(req.url).pathname === '/destinations/info.JSON'){ jsonFile = 'destinations/info.JSON'; }
	
	
}

function processFormFieldsIndividual(req, res) {
	
	var errorMessage = null;
	if (url.parse(req.url).pathname === '/destinations/barbados.JSON'){ jsonFile = 'destinations/barbados.JSON'; }
	else if(url.parse(req.url).pathname === '/destinations/barcelona.JSON'){ jsonFile = 'destinations/barcelona.JSON'; }
	else if(url.parse(req.url).pathname === '/destinations/kualalumpur.JSON'){ jsonFile = 'destinations/kualalumpur.JSON'; }
	else if(url.parse(req.url).pathname === '/destinations/nyc.JSON'){ jsonFile = 'destinations/nyc.JSON'; }
	else if(url.parse(req.url).pathname === '/destinations/info.JSON'){ jsonFile = 'destinations/info.JSON'; }
	
	//console.log(url.parse(req.url).pathname);
	
    var fields = {};
    var a;
    var b;
    var form = new formidable.IncomingForm();
    form.on('field', function (field, value){
    	if (value === ''){
    		console.log("attempt to insert blank field. Not submitted.");
    		return; 
    	}
        console.log(field);
        if (field == 'managerreview'){
        	if (jsonFile === 'destinations/barbados.JSON'){ jsonFile = 'destinations/barbadosResponses.JSON'; }
        	else if(jsonFile === 'destinations/barcelona.JSON'){ jsonFile = 'destinations/barcelonaResponses.JSON'; }
        	else if(jsonFile === 'destinations/kualalumpur.JSON'){ jsonFile = 'destinations/kualalumpurResponses.JSON'; }
        	else if(jsonFile === 'destinations/nyc.JSON'){ jsonFile = 'destinations/nycResponses.JSON'; }
        	
        }else if (field === 'commentToDelete'){
        	fs.readFile(jsonFile, 'utf8', function read(err, data) {
                if (err) {
                    throw err;
                }
                var reviews = JSON.parse(data);
            	for (var i=0; i<reviews.length; i++){
            		var review = reviews[i];
            		if (review === null){ review = reviews[i+1]; return;}
            		if (review.title === value){
            			reviews[i] = "";
            			content = JSON.stringify(reviews);
            			fs.writeFile(jsonFile, content, function(err){
            	        	if(err) throw err;
            	        });
            			return;
            		}
            	}
        	});
        	return;
        }else if (field === 'responseToDelete'){
        	console.log("is it here?" + jsonFile);
        	if (jsonFile === 'destinations/barbados.JSON'){ jsonFile = 'destinations/barbadosResponses.JSON'; }
        	else if(jsonFile === 'destinations/barcelona.JSON'){ jsonFile = 'destinations/barcelonaResponses.JSON'; }
        	else if(jsonFile === 'destinations/kualalumpur.JSON'){ jsonFile = 'destinations/kualalumpurResponses.JSON'; }
        	else if(jsonFile === 'destinations/nyc.JSON'){ jsonFile = 'destinations/nycResponses.JSON'; }
        	fs.readFile(jsonFile, 'utf8', function read(err, data) {
                if (err) {
                    throw err;
                }
                var content = data;
                content = content.replace('[','');
                content = content.replace(']','');
                var reviews = JSON.parse(data);
            	for (var i=0; i<reviews.length; i++){
            		var review = reviews[i];
            		console.log(review);
            		if (review === null){ review = reviews[i+1]; return;}
            		if (review.managerreview === value){
            			reviews[i] = "";
            			content = JSON.stringify(reviews);
            			fs.writeFile(jsonFile, content, function(err){
            	        	if(err) throw err;
            	        });
            			return;
            		}
            	}
        	});
        	return;
        }
        
        else if (field === 'full-name'){
        	jsonFile = 'destinations/info.JSON';
        	
        }
        
        console.log(value);
        fields[field] = value;
    });

    form.on('end', function () {
        a = JSON.stringify(fields);
        if (a == "{}"){
    		return;
    	}
        //var query = qs.parse(a);
        console.log(a);
     // Take the JSON file, make it into an object, and then change the object and write the file.
     fs.readFile(jsonFile, 'utf8', function read(err, data) {
         if (err) {
             throw err;
         }
         var content = data;

         console.log(content);
         content = content.replace('[','');
         content = content.replace(']','');
         console.log(content);
         content += ",\n" + a;
      	 content = "[" + content + "]";
      	 console.log(content);
      	 b = content;
      	 console.log(b);
      	 fs.writeFile(jsonFile, b, function(err){
        	if(err) throw err;
        });

     });
     //res.end();
    });
    if (a != "{}"){ form.parse(req); }
}

//router URL
function processRequestRoute(request, response) {
	
    var pathname = url.parse(request.url).pathname;
    if (pathname === '/') {
        pathname = "/index.html"; //default page
    }
    var ext = path.extname(pathname);
    var temp;
    var localPath = ''; //local path
    var staticres = false; //statict or not
    if (ext.length > 0) {
        localPath = '.' + pathname;
        staticRes = true;
    } else {
        localPath = '.' + pathname + '.js';
        staticRes = false;
    }
    //do not allow remote access
    if (config.denyAccess && config.denyAccess.length > 0) {
        var islocal = false;
        var remoteAddress = request.connection.remoteAddress;
        for (var j = 0; j < config.localIPs.length; j++) {
            if (remoteAddress === config.localIPs[j]) {
                islocal = true;
                break;
            }
        }
        if (!islocal) {
            for (var i = 0; i < config.denyAccess.length; i++) {
                if (localPath === config.denyAccess[i]) {
                    response.writeHead(403, { 'Content-Type': 'text/plain' });
                    response.end('403:Deny access to this page');
                    return;
                }
            }
        }
    }
    //donot allow back ground js
    if (staticRes && localPath.indexOf(config.srcpath) >= 0) {
        response.writeHead(403, { 'Content-Type': 'text/plain' });
        response.end('403:Deny access to this page');
        return;
    }

    fs.exists(localPath, function (exists) {
        if (exists) {
            if (staticRes) {
                staticResHandler(localPath, ext, response); //statict resourse
            } else {
                try {
                    var handler = require(localPath);
                    if (handler.processRequest && typeof handler.processRequest === 'function') {
                        handler.processRequest(request, response); //dynamic resourse
                    } else {
                        response.writeHead(404, { 'Content-Type': 'text/plain' });
                        response.end('404:Handle Not found');
                    }
                } catch (exception) {
                    console.log('error::url:' + request.url + 'msg:' + exception);
                    response.writeHead(500, { "Content-Type": "text/plain" });
                    response.end("Server Error:" + exception);
                }
            }
        } else { //the resourse does not exist
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.end('404:File Not found');
        }
    });
    if(ext === '.JSON'){ processFormFieldsIndividual(request, response); }
}

//handle the dynamic resourse
function staticResHandler(localPath, ext, response) {
    fs.readFile(localPath, "binary", function (error, file) {
        if (error) {
            response.writeHead(500, { "Content-Type": "text/plain" });
            response.end("Server Error:" + error);
        } else {
            response.writeHead(200, { "Content-Type": getContentTypeByExt(ext) });
            response.end(file, "binary");
        }
    });
}

//the type of the Content
function getContentTypeByExt(ext) {
    ext = ext.toLowerCase();
    if (ext === '.htm' || ext === '.html')
        return 'text/html';
    else if (ext === '.js')
        return 'application/x-javascript';
    else if (ext === '.css')
        return 'text/css';
    else if (ext === '.jpe' || ext === '.jpeg' || ext === '.jpg')
        return 'image/jpeg';
    else if (ext === '.png')
        return 'image/png';
    else if (ext === '.ico')
        return 'image/x-icon';
    else if (ext === '.zip')
        return 'application/zip';
    else if (ext === '.doc')
        return 'application/msword';
    else
        return 'text/plain';
}