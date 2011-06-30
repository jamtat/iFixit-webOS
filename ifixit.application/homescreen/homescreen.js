enyo.kind({
	name: 'ifixit.ui.home',
	kind: enyo.VFlexBox,
	published: {
		devicesarray: [],
		launchParams: null
	},
	components: [
		{kind: 'ApplicationEvents', onWindowParamsChange: 'windowParamsChangeHandler', onApplicationRelaunch: 'windowParamsChangeHandler'},
		
//UI
		{kind: enyo.HFlexBox, className: 'homescreen-header', components: [
			{flex:1, className: 'normal'},
			{className: 'title-homescreen'},
			{flex:1, className: 'slogan'}
		]},
		{kind: enyo.HFlexBox, flex:1, components: [
		//Featured Section
			{kind: enyo.VFlexBox, flex:1, components: [
				{className: 'featured-header'},
				{flex: 1, kind: enyo.HFlexBox, components:[
					{name: 'featuredSection', flex:1, kind: 'ifixit.ui.featured'},
					{name: 'browseButton', className: 'browse-button'}
				]},
			]},
		//Browse Section
			{className: 'browse-areas-container', kind: enyo.VFlexBox, width:'320px', components: [
				{className: 'areas-header'},
				{name: 'areasbrowser', kind: 'ifixit.ui.areasbrowser', flex: 1, onPickDevice: 'deviceFetch'}
			]}
		]},
		//Device Panel
		{kind: 'ifixit.ui.devicepanel', name: 'devicePanel', device: '', onExit: 'closeDevicePanel'},
//Palm Service
		{
		    name: 'iCheck',
		    kind: 'PalmService',
		    service: 'palm://com.palm.connectionmanager',
		    method: 'getstatus',
		    onSuccess: 'internets',
		    onFailure: 'internets',
		    subscribe: true
		},
//Services
		{name: 'FeaturedService', kind: 'ifixit.service.api',
			onSuccess: 'gotFeatured',
			onFailure: 'gotFeaturedFailure'},
		{name: 'GuideService', kind: 'ifixit.service.api',
			onSuccess: 'gotGuide',
			onFailure: 'gotGuideFailure'},
		{name: 'AreasService', kind: 'ifixit.service.api',
			onSuccess: 'gotAreas',
			onFailure: 'gotAreasFailure'},		
		{name: 'DeviceService', kind: 'ifixit.service.api',
			onSuccess: 'gotDevice',
			onFailure: 'gotDeviceFailure'},	
			
//App Menu
		{kind: 'AppMenu', components: [
			{caption: 'About iFixit', onclick: 'openabout'},
		]},
		
//About Box
		{name: 'about-box', align: 'center', className: 'about-main hidden', kind: enyo.VFlexBox, components:[
			{flex:1},
			{className: 'about', components:[
				{kind: 'CustomButton', className: 'about-close', onclick: 'closeabout', content:'x'},
				{kind:'Scroller', components:[
					{name: 'aboutcontent', kind: 'HtmlContent', srcId: 'aboutcontent', className: 'about-content', onLinkClick:'linkclick'}
				]}
			]},
			{flex:1}
		]},
		
//DB Stuff
		{kind: 'DbService', dbKind: 'ifixit.devices:1', onFailure: 'dbFailure', components: [
			{name: 'deleteiFixitDbKind', method: 'delKind', onResponse: 'deleteiFixitDbKindResponse'},
			{name: 'makeiFixitDbKind', method: 'putKind', onSuccess: 'putDbKindSuccess'},
			{name: 'insertiFixit', method: 'put', onResponse: 'insertiFixitResponse'},
			{name: 'findiFixit', method: 'find', onResponse: 'findiFixitResponse'}
		]},
		
		{
			name: 'putDBPermissions', 
			kind: enyo.PalmService,
		    service: 'palm://com.palm.db/',
		    method: 'putPermissions',
		    onSuccess: 'permissionSuccess',
		    onFailure: 'permissionFailure',
		}
	],
	
//DB functions	
	
	deleteiFixitDbKindResponse: function() {
		// when the delKind is done, then make the iFixit devices dbKind.
		this.$.makeiFixitDbKind.call({
			'id': 'ifixit.devices:1',
			'schema': {
				'id': 'ifixit.devices:1',
				'type': 'object',
				'properties': {
					'_kind': {
						'type': 'string',
						'value': 'ifixit.devices:1'
					},
					'device': {
						'type': 'string',
						'description': 'device string'
					},
					'devicelowercase': {
						'type': 'string',
						'description': 'device lowercase string'
					}
				}
			},
			'owner': 'com.jamtat.ifixit',
			'indexes': [{
				'name': 'device',
				'props': [{
					'name': 'device'
				}]
			},
			{
				'name': 'devicelowercase',
				'props': [{
					'name': 'devicelowercase'
				}]
			}]
		});
		
		this.recurse(this.areas);
		
		this.devicesarray.sort(function(a,b) {
			if(a.device.toLowerCase() < b.device.toLowerCase())
				return -1;
			if(a.device.toLowerCase() > b.device.toLowerCase())
				return 1;
			return 0;
		});
		console.log(this.devicesarray);
		
		this.$.insertiFixit.call({objects: this.devicesarray});
		
		var permObj = [{
			'type':'db.kind',
			'object':'ifixit.devices:1',
			'caller':'com.palm.launcher',
			'operations':{'read':'allow'}
		}];
		this.$.putDBPermissions.call({'permissions':permObj});
	},
	putDbKindSuccess: function() {
		this.log();
	},
	insertiFixitResponse: function(a, b, c) {
		console.log(a);
		console.log(JSON.stringify(b));
		console.log(JSON.stringify(c));
		this.log();
	},
	
	permissionSuccess: function(){
		console.log('DB permission granted successfully!');
	},
	permissionFailure: function(){
		console.log('DB failed to grant permissions!');
	},
	
//end DB functions

	create: function() {
		enyo.keyboard.setManualMode(true);
		this.inherited(arguments);
		//enyo.nextTick(this, 'getData');
		if(window.PalmSystem)
			this.$.iCheck.call();
		else
			enyo.nextTick(this, 'getData');
	},
	
	internets: function(sender, response) {
		if (response.isInternetConnectionAvailable === true) {
			enyo.nextTick(this, 'getData');
		} else {
			enyo.windows.addBannerMessage('No Internet Connection','{}');
		}
	},
	
	openAppMenu: function() {
		this.$.appMenu.open();
	},
	openabout: function(sender, event) {
		this.$['about-box'].removeClass('hidden');
	},
	closeabout: function(sender, event) {
		this.$['about-box'].addClass('hidden');
	},
	linkclick: function(sender, url) {
		location.href = url;
		return true;
	},
	
	getData: function() {
		this.$.FeaturedService.getType('featured');
		this.$.AreasService.getAreas();
	},
	
	gotFeatured: function(inSender, inResponse, inRequest) {
		for(var i = 0; i < inResponse.length; i++) {
			this.$.GuideService.getGuide(inResponse[i].guideid)
		}
	},
	
	gotGuide: function(inSender, inResponse, inRequest) {
		this.$.featuredSection.addPanel(inResponse.guide);
	},
	
	gotAreas: function(inSender, inResponse, inRequest) {
		console.log(inResponse);
		this.areas = inResponse;
		this.$.areasbrowser.setAreas(this.areas);
		
		//We'll delete the ifixit DB Kind
		if(window.PalmSystem) {
			this.$.deleteiFixitDbKind.call();
		} else {
			this.recurse(this.areas);
			
			this.devicesarray.sort(function(a,b) {
				if(a.device.toLowerCase() < b.device.toLowerCase())
					return -1;
				if(a.device.toLowerCase() > b.device.toLowerCase())
					return 1;
				return 0;
			});
			console.log(this.devicesarray);
		}
	},
	
	deviceFetch: function(inSender, deviceQuery) {
		console.log(deviceQuery);
		this.$.devicePanel.setDevice(deviceQuery);
		this.$.devicePanel.removeClass('kill');
	},
	
	closeDevicePanel: function() {
		this.$.devicePanel.addClass('kill');
	},
	
	gotDevice: function(inSender, inResponse, inRequest) {
	},
	
	launchGuide: function(guideid) {
		enyo.windows.activate('guide.html', 'guide' + guideid,  {'guideid': guideid});	
	},
	

	recurse: function(obj) {
		
		for(key in obj) {
		
			if(key === 'DEVICES' && obj[key].length) {
				var d = obj[key],
					l = d.length,
					i = 0;
					
				for(i;i<l;i++) {
					this.devicesarray.push({
						'_kind': 'ifixit.devices:1',
						'device': d[i],
						'devicelowercase': d[i].toLowerCase()
					});
				}
				
			} else {
				if(obj.hasOwnProperty(key)) {
					this.recurse(obj[key]);
				}
			}
			
		}
				
	},
	
	devices: function(arr) {
		var i = 0;
		var l = arr.length;
		var temp = []
		while(i < l) {
			temp.push(arr[i]);
			var device = {
				_kind: 'com.jamtat.ifixit:1',
			};	
	
			//this.$.dbPut.call({objects: [device]});
			
			i++;
		}
		this.devicesarray = this.devicesarray.concat(temp);		
	},
	
	//Handle launching a guide from another launcher icon
	launchParamsChanged: function(){
		
		if (this.launchParams.guideid){
			this.launchGuide(this.launchParams.guideid);
		}
		
		if(this.launchParams.deviceName) {
			this.deviceFetch(undefined, this.launchParams.deviceName);
		}
	},
	
	windowParamsChangeHandler: function() {
	// capture any parameters associated with this app instance
		var params = enyo.windowParams;
		this.setLaunchParams(enyo.windowParams);
	},
	
})