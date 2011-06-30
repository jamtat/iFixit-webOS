//Archived
/*enyo.kind({
	name: 'ifixit.ui.featured',
	kind: enyo.HFlexBox,
	className: 'featured-area',
	activeItem: undefined,
	components: [
		{name: 'scroller', kind: 'FadeScroller', autoHorizontal: false, horizontal: true, autoVertical: false, vertical: false, components: [
		
		]}
	],
	addPanel: function(guide) {
		this.$.scroller.createComponent({kind: 'ifixit.ui.featuredwidget', image:guide.image.text + '.large', title: guide.title, tools: guide.tools, guideid: guide.guideid});
		this.render();
	},
	
	itemClicked: function(sender) {
		if(this.activeItem)
			this.activeItem.removeClass('active');
		if(this.activeItem === sender) {
			this.activeItem.removeClass('active');
			this.activeItem = undefined;
			return true;
		}
		this.activeItem = sender;
		sender.addClass('active');
		return true;
	}
})

enyo.kind({
	name: 'ifixit.ui.featuredwidget',
	kind: enyo.HFlexBox,
	className: 'featured-widget',
	published: {
		image: '',
		title: '',
		tools: [],
		guideid: 0
	},
	flex: 1,
	chrome: [
		{className: 'featured-widget-label-background'},
		{kind: 'CustomButton', onclick: 'goClicked', name:'label', className: 'featured-widget-label'},
		{kind: 'CustomButton', className: 'go-button', content: 'Start Fixin\'', onclick: 'goClicked'},
		{name: 'toolbox', className: 'toolbox', components: [
			{className: 'toolbox-header', content: 'Toolbox'}
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.applyStyle('background-image', 'url(' + this.image + ')');
		this.$.label.setContent(this.title);
		for(var i = 0; i < this.tools.length;i++) {
			var toollink = '<a href ="' + this.tools[i].url + '">' + this.tools[i].text + '</a>';
			this.$.toolbox.createComponent({content: toollink, className: 'toolbox-item condensed'});
		}
	},
	itemClicked: function(sender, event) {
		this.owner.owner.itemClicked(sender.owner);
	},
	goClicked: function(sender, event) {
		enyo.$.home.launchGuide(this.guideid);
	}
});
*/

enyo.kind({
	name: 'ifixit.ui.featured',
	kind: enyo.VFlexBox,
	className: 'featured-area',
	activeItem: undefined,
	__index: 0,
	components: [
		{flex:1, className: 'featured-row', kind: enyo.HFlexBox, name: 'top'},
		{flex:1, className: 'featured-row', kind: enyo.HFlexBox, name: 'middle'},
		{flex:1, className: 'featured-row', kind: enyo.HFlexBox, name: 'bottom'}
	],
	addPanel: function(guide) {
		if(this.__index <=2) {
			this.$.top.createComponent({kind: 'ifixit.ui.featuredwidget', image:guide.image.text + '.large', title: guide.title, tools: guide.tools, guideid: guide.guideid});
		}
		
		if(this.__index > 2 && this.__index <= 5) {
			this.$.middle.createComponent({kind: 'ifixit.ui.featuredwidget', image:guide.image.text + '.large', title: guide.title, tools: guide.tools, guideid: guide.guideid});
		}
		
		if(this.__index > 5 && this.__index <= 8) {
			this.$.bottom.createComponent({kind: 'ifixit.ui.featuredwidget', image:guide.image.text + '.large', title: guide.title, tools: guide.tools, guideid: guide.guideid});
		}
		
		this.__index++;
		this.render();
	},
	
	itemClicked: function(sender) {
		if(this.activeItem)
			this.activeItem.removeClass('active');
		if(this.activeItem === sender) {
			this.activeItem.removeClass('active');
			this.activeItem = undefined;
			return true;
		}
		this.activeItem = sender;
		sender.addClass('active');
		return true;
	}
});

enyo.kind({
	name: 'ifixit.ui.featuredwidget',
	kind: enyo.HFlexBox,
	className: 'featured-widget',
	published: {
		image: '',
		title: '',
		tools: [],
		guideid: 0
	},
	flex: 1,
	chrome: [
		{kind: 'CustomButton', onclick: 'goClicked', name:'label', className: 'featured-widget-label'},
	],
	create: function() {
		this.inherited(arguments);
		this.applyStyle('background-image', 'url(' + this.image + ')');
		this.$.label.setContent(this.title);
	},
	goClicked: function(sender, event) {
		enyo.$.home.launchGuide(this.guideid);
	}
});