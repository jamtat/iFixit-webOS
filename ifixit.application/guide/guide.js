enyo.kind({
	name: 'ifixit.ui.guide',
	kind: enyo.VFlexBox,
	published: {
		guideid: 0,
		guide: {}
	},
	
	create: function() {
		this.inherited(arguments);
		enyo.keyboard.setManualMode(true);
		//enyo.setAllowedOrientation('up');
		if(enyo.windowParams.guideid) {
			this.guideid = enyo.windowParams.guideid;
		} else {
			this.guideid = 5071;
		}
		
		enyo.nextTick(this , 'fetchGuide');
	},
		
	components: [
		{name: 'loadingArea', align: 'center', kind: enyo.VFlexBox, className: 'guide-loading', components: [
			{flex:1},
			{className: 'gear gear-black'},
			{className: 'gear gear-white'},
			{content: 'L<img src="images/guide/loading/gear-white-small.png" class="lil-gear"/>ading guide', className: 'loading-message'},
		]},
		{name: 'GuideService', kind: 'ifixit.service.api',
			onSuccess: 'gotGuide',
			onFailure: 'gotGuideFailure'},
			
		{kind: 'AppMenu', components: [
			{caption: 'Add This Guide To The Launcher', onclick: 'addLauncherIcon'},
		]},
		
		{name: 'addToLauncherService', kind: 'PalmService', service: enyo.palmServices.application, method: 'addLaunchPoint'},
	],
	
	openAppMenuHandler: function() {
		var menu = this.$.appMenu;
		menu.open();
	},
	closeAppMenuHandler: function() {
		var menu = this.$.appMenu;
		menu.close();
	},
	
	
	gotGuide: function(inSender, inResponse, inRequest) {
		this.guide = inResponse.guide;
		this.createComponent({flex: 1, kind: 'BasicCarousel', name: 'pagesCarousel', layoutKind: 'HFlexLayout', height: '100%'});
		var cover = this.$.pagesCarousel.createComponent({kind: 'ifixit.ui.guidecover', guideid: this.guideid, image: this.guide.image.imageid, introduction: this.guide.introduction, title: this.guide.title, tools: this.guide.tools});
		
		this.$.pagesCarousel.addViews(cover);
		
		for(var i = 0; i < this.guide.steps.length; i++) {
			var page = this.$.pagesCarousel.createComponent({kind: 'ifixit.ui.guidepage', step: this.guide.steps[i], last: (i===this.guide.steps.length-1)});
			
			this.$.pagesCarousel.addViews(page);
		}
		
		this.render();
		this.$.loadingArea.addClass('dead');
		function kill() {
			this.$.loadingArea.destroy();
			console.log('killed');
		}
		setTimeout(kill.bind(this), 1500);
	},
	
	fetchGuide: function() {
		this.$.GuideService.getGuide(this.guideid)
	},
	
	addLauncherIcon: function() {
		this.$.pagesCarousel.$.guidecover.addLauncherIcon();
	},
	
	clickHandler: function(sender, event) {
		var t = event.target;
		var h;
		if((t.nodeName === 'A' || t.nodeName === 'a') && t.href) {
			event.preventDefault();
			event.stopPropagation();
			if(t.href.indexOf('http://') === -1) {
				h = 'http://ifixit.com' + t.pathname;
			} else {
				h = t.href;
			}
			console.log(h);
			
			window.location.href = h;
		}
	}
})
 
/*
//Define the launch params the app will receive in the app assistant handleLaunch method when the shortcut is tapped:
var launchParams = {
    runTimer: timer.id()
    ,runTimerName: timer.getLaunchpointCaption()
};
//define service call params to add the shortcut
var callParams = {
    id: Mojo.appInfo.id,
    icon: Mojo.appPath + Mojo.appInfo.shortcuticon,
    title: timer.getLaunchpointCaption(),
    params: launchParams
};
//Call the service :)
new Mojo.Service.Request('palm://com.palm.applicationManager/addLaunchPoint', {
    parameters: callParams,
    onSuccess: function(){
        bannerShow('Timer added to launcher');
    }.bind(this),
    onFailure: function(){
        bannerShow('Timer could not be added to launcher');
    }.bind(this)
});*/