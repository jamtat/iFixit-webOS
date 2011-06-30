enyo.kind({
	name: 'ifixit.ui.guidecover',
	kind: enyo.VFlexBox,
	className: 'guide-cover',
	published: {
		guideid: 0,
		image: 0,
		introduction: '',
		title: '',
		tools: [],
		icon: ''
	},
	
	events: {
		onIcon: ''
	},
	
//Helper function to fix the api issues
	toHTML: function(str) {
		return str.replace(/&lt;/g,'<').replace(/&gt;/g,'>');
	},
	
	create: function() {
		this.inherited(arguments);
		this.$.guideTitle.setContent(this.toHTML(this.title));
		this.$.guideIntroduction.setContent(this.toHTML(this.introduction));
		for(var i = 0; i < this.tools.length;i++) {
			var toollink = '<a href ="' + this.tools[i].url + '">' + this.tools[i].text + '</a>';
			this.$.toolbox.createComponent({content: toollink, className: 'toolbox-item condensed'});
		}
		this.$.ImageService.getImage(this.image);
	},
	
	chrome:  [
		{kind: 'Image', className: 'guide-cover-logo', src: 'images/guide/logo.png'},
		{content: 'Swipe To Turn the Page', className: 'guide-hint oblique'}
	],
	
	components: [
		{name: 'guideTitle', className: 'guide-cover-title'},
		{flex: 1, name: 'toolbox', className: 'toolbox', components: [
			{className: 'toolbox-header', content: 'Toolbox'}
		]},
		{name: 'guideIntroduction', className: 'guide-introduction oblique', allowHtml: true},
		
		{name: 'ImageService', kind: 'ifixit.service.api',
			onSuccess: 'gotImage',
			onFailure: 'gotImageFailure'},
		{content: '+ Add To Launcher', onclick: 'addLauncherIcon', className: 'add-launcher-message'},
		{name: 'addToLauncherService',
			kind: 'PalmService',
			service: enyo.palmServices.application,
			method: 'addLaunchPoint'},
		{name: 'saveIconService',
			kind: 'PalmService',
			service: 'palm://com.jamtat.ifixit.service/',
			method: 'makeImage',
			onSuccess: 'doneImage'}
		
	],
	
	gotImage: function(inSender, inResponse, inRequest) {
		var img = inResponse.base_url + '.' + inResponse.sizes[inResponse.sizes.length-1];
		this.applyStyle('background-image', 'url(' + img + ')')
		this.iconImage = img;
	},
	
	addLauncherIcon: function() {
		if(!window.PalmSystem)
			return;
		this.setupIcon(this.iconImage, 64)
	},
	
	setupIcon: function(url, w) {
		enyo.windows.addBannerMessage('Making Icon', '{}');
		var i = new Image();
		var self = this;
		i.onload = function() {
			var c = document.createElement('canvas');
			c.width = c.height = w;
			var ctx = c.getContext('2d');
			
			roundRect(ctx, 0, 0, w, w, Math.round(60/512*w));
			
			ctx.drawImage(this, 0, 0, Math.floor(w/this.height*this.width), w);
			
			var icon = new Image()
			icon.onload = function() {
				ctx.drawImage(this, 0, 0, w, w);
				self.icon = c.toDataURL();
				self.doIcon(self.icon);
				enyo.windows.addBannerMessage('Saving Icon', '{}');
				self.$.saveIconService.call({
					dataurl: self.icon
				})
				//window.location.href = self.icon;
			}
			
			if(enyo.fetchAppInfo().guideicons[w.toString()]) {
				var path = enyo.fetchAppRootPath() + enyo.fetchAppInfo().guideicons[w.toString()];
			} else {
				var path = enyo.fetchAppRootPath() + enyo.fetchAppInfo().guideicons[512];
			}
			
			icon.src = path;
		}
		
		i.src = url;
		
		function roundRect(ctx, x, y, width, height, radius) {
			ctx.beginPath();
			ctx.moveTo(x + radius, y);
			ctx.lineTo(x + width - radius, y);
			ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
			ctx.lineTo(x + width, y + height - radius);
			ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
			ctx.lineTo(x + radius, y + height);
			ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
			ctx.lineTo(x, y + radius);
			ctx.quadraticCurveTo(x, y, x + radius, y);
			ctx.closePath();
			ctx.clip();     
		}
	},
	
	doneImage: function(sender, response) {
				
		if(!window.PalmSystem)
			return;
		var launchParams = {guideid: this.guideid};
		var callParams = {
		    id: enyo.fetchAppId(),
		    icon:  response.reply,
		    title: this.title,
		    params: launchParams
		};
		this.$.addToLauncherService.call(callParams);
		enyo.windows.addBannerMessage('Added to Favs', '{}');
	}
})