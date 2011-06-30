enyo.kind({
	name: 'ifixit.ui.devicewidget',
	kind: enyo.VFlexBox,
	className: 'device-widget',
	state: 'closed',
	published: {
		image: '',
		title: '',
		guideid: 0,
		tools: []
	},
	components: [
		{kind: 'CustomButton', onclick: 'itemClicked', name:'label', className: 'device-widget-label'},
		{flex: 1, name: 'toolbox', className: 'toolbox', components: [
			{className: 'toolbox-header', content: 'Toolbox'}
		]},
		{kind: 'CustomButton', className: 'go-button', content: 'Start Fixin\'', onclick: 'goClicked'},
		
		{name: 'GuideService', kind: 'ifixit.service.api',
			onSuccess: 'gotGuide',
			onFailure: 'gotGuideFailure'},
		
	],
	create: function() {
		this.inherited(arguments);
		this.applyStyle('background-image', 'url(' + this.image + ')');
		this.$.label.setContent(this.title);
		this.$.GuideService.getGuide(this.guideid);
	},
	itemClicked: function(inEvent) {
		
		if(this.state === 'closed') {
			this.addClass('active');
			this.state = 'open';
			return true;
		}
		
		if(this.state === 'open') {
			this.removeClass('active');
			this.state = 'closed';
			return true;
		}
		
	},
	
	gotGuide: function(inSender, inResponse, inRequest) {
		this.tools = inResponse.guide.tools;
		for(var i = 0; i < this.tools.length;i++) {
			var toollink = '<a href ="' + this.tools[i].url + '">' + this.tools[i].text + '</a>';
			this.$.toolbox.createComponent({content: toollink, className: 'toolbox-item condensed'});
		}
		this.render();
	},
	
	goClicked: function(sender, event) {
		enyo.$.home.launchGuide(this.guideid);
	}
})

enyo.kind({
	name: 'ifixit.ui.devicepanel',
	kind: enyo.HFlexBox,
	className: 'device-panel kill',
	published: {
		device: ''
	},
	events: {
		onExit: ''
	},
	components: [
		{flex:1, onclick: 'doExit'},
		{kind: 'Scroller', width:'612px', components: [
			{className: 'device-panel-frame', name: 'devicePanelFrame', components: [
				//About the device box
				{name: 'aboutDevice', className: 'about-device-box', components:[
					//Header
					{className: 'about-device-box-header', components:[
						{name: 'deviceTitle', className: 'about-device-box-header-title'},
						{name: 'deviceDescription', className: 'about-device-box-header-description'}
					]}
				]},
			]},
		]},
		{flex:1, onclick: 'doExit'},
		
		
		{name: 'DeviceService', kind: 'ifixit.service.api',
			onSuccess: 'gotDevice',
			onFailure: 'gotDeviceFailure'},		
	],
	
	create: function() {
		this.inherited(arguments);
		if(this.device !== '') {
			this.$.DeviceService.getDevice(this.device);
			this.$.deviceTitle.setContent(this.device);
		}
	},
	
	deviceChanged: function() {
		if(this.$.guidesSection) {
			this.$.guidesSection.destroy();
		}
		this.$.devicePanelFrame.createComponent({name: 'guidesSection', owner: this});
		if(this.device !== '') {
			this.$.DeviceService.getDevice(this.device);
			this.$.deviceTitle.setContent(this.device);
		}
	},
	
	gotDevice: function(inSender, inResponse, inRequest) {
		this.$.aboutDevice.applyStyle('background-image',  'url(' + inResponse.image.text+'.medium)');
		this.$.deviceDescription.setContent(inResponse.description);
		
		var guides = inResponse.guides;
		
		for(var i = 0; i < guides.length; i++) {
			var img = guides[i].thumbnail.replace('.thumbnail','.medium');
			this.$.guidesSection.createComponent({kind: 'ifixit.ui.devicewidget', image: img, guideid: guides[i].guideid, title: guides[i].title});
		}
		this.render();
	}
})