//Node Imports
var require		= IMPORTS.require;
//Palm Imports
var Foundations	= IMPORTS.foundations;
var ArrayUtils	= Foundations.ArrayUtils;
var AssertUtils	= Foundations.Assert;
var EnvUtils	= Foundations.EnvironmentUtils;
var PalmCall	= Foundations.Comms.PalmCall;
var AjaxCall	= Foundations.Comms.AjaxCall;
var ObjUtils	= Foundations.ObjectUtils;
var StringUtils	= Foundations.StringUtils;
var Err			= Foundations.Err;
var Class		= Foundations.Class;
var DB			= Foundations.Data.DB;
var Future		= Foundations.Control.Future;
var FSM			= Foundations.Control.FSM;
var MapReduce	= Foundations.Control.mapReduce;

var makeImageAssistant = function() {

};

makeImageAssistant.prototype = {
	run: function(future) {
		this.future = future;
		
		
		console.log('Service called with a data url, processing');
		
		var fs = require('fs');
		
		var self = this;
		
		
		//Check for ifixit directory
		if(!this.isdir('/media/internal/.ifixit')) {
			fs.mkdir('/media/internal/.ifixit', 0777, function(err) {
				fs.mkdir('/media/internal/.ifixit/icons', 0777, function(err) {
					self.makeIcon();
				});
			});
		} else {
			if(!this.isdir('/media/internal/.ifixit/icons')) {
				fs.mkdir('/media/internal/.ifixit/icons', 0777, function(err) {
					self.makeIcon();
				});
			} else {
				self.makeIcon();
			}
		}
		
	},
	
	makeIcon: function() {
		var fs = require('fs');
		var crypto = require('crypto');
		
		var img = this.controller.args.dataurl.replace('data:image/png;base64,', '');
		var self = this;
		var name = crypto.createHash('md5').update(img).digest('hex') + '.png';
		var Buff = new Buffer(img, 'base64');
		var Buff2 = new Buffer(Buff.toString('binary'), 'binary');
		fs.writeFile('/media/internal/.ifixit/icons/' + name, Buff2, 'binary', function(err) {
			self.future.result = {reply: '/media/internal/.ifixit/icons/' + name};
		});
	},
	
	isdir: function(path) {
		try{
			fs.readdirSync(path);
		} catch (e) {
			return false;
		}
		
		return true;
	}

};