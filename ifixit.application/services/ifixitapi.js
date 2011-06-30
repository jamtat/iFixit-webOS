enyo.kind({
	name: 'ifixit.service.api',
	kind:'WebService',
	point: 'http://www.ifixit.com/api/0.1/',
	sync: false,
	create: function() {
		this.inherited(arguments);
	},
	getType: function(type) {
		this.setUrl(this.point + 'guides/' + type);
		this.call();
	},
	getGuide: function(guideid) {
		this.setUrl(this.point + 'guide/' + guideid);
		this.call();
	},
	getDevice: function(device) {
		this.setUrl(this.point + 'device/' + device);
		this.call();
	},
	getAreas: function() {
		this.setUrl(this.point + 'areas');
		this.call();
	},
	getApi: function(end) {
		this.setUrl(this.point + this.end);
		this.call();
	},
	getImage: function(imageid) {
		this.setUrl(this.point + 'image/' + imageid);
		this.call();
	}
})