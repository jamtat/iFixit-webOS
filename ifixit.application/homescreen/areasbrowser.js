enyo.kind({
	name: 'ifixit.ui.areasbrowser',
	kind: enyo.VFlexBox,
	className: 'areasbrowser',
	currentPlace: ['root'],
	depth: 1,
	published: {
		areas: {},
	},
	events: {
		onPickDevice: ''
	},
	create: function() {
		this.inherited(arguments);
		document.addEventListener();
	},
	
	components: [
	
		{flex:1, kind: enyo.VFlexBox, className: 'listSwitcherPane',  name: 'listSwitcherPane'},
		{className: 'areas-list-divider areas-footnote', content: 'Drag to the right to go back'}	
	],
	
	areasChanged: function(params) {
		this.$.listSwitcherPane.createComponent({flex: 1, name: 'displayList', kind: 'ifixit.ui.listbuilder',owner: this, onClickDevice: 'bubble', depth: this.depth});
		this.$.displayList.setCurrent(this.areas);
		this.render();
	},
	
	loadCategory: function(category) {
		this.depth++;
		if(category) {
			this.currentPlace.push(category);
		}
		var temp  = undefined;
		
		for(var i = 0; i < this.currentPlace.length; i++) {
			if(temp === undefined) {
				temp = this.areas[this.currentPlace[i]];
			} else {
				temp = temp[this.currentPlace[i]]
			}
		}
		if(temp === undefined || !temp) {
			temp = this.areas;
		}
		this.$.displayList.setDepth(this.depth);
		this.$.displayList.setCurrent(temp);
	},
	
	back: function() {
		this.depth-=2;
		this.currentPlace.pop();
		this.loadCategory();
		this.$.listSwitcherPane.hasNode().style.webkitTransform = '';
		
	},
	
	dragHandler: function(inSender, inEvent) {
		var dx = inEvent.dx;
		if(this.currentPlace[1] === undefined) {
			dx = Math.min((dx/320)*50,50);;
		}
		if(inEvent.dx < 0)
			return false;
		if(inEvent.dx < 50)
			return false;
		this.$.listSwitcherPane.hasNode().style.webkitTransform = 'translate3d(' + dx + 'px,0,0)';
		inEvent.stopPropagation();
		return true;
	},
	
	dragfinishHandler: function(inSender, inEvent) {
		if(this.currentPlace[1] === undefined) {
			this.$.listSwitcherPane.hasNode().style.webkitTransform = '';
			return false;
		}
		if(inEvent.dx > 150) {
			this.$.listSwitcherPane.hasNode().style.webkitTransform = 'translate3d(320px,0,0)';
			this.back();
		} else {	
			this.$.listSwitcherPane.hasNode().style.webkitTransform = '';
		}
	},
	
	bubble: function(sender, device) {
		this.doPickDevice(device);
	}
	
})

enyo.kind({
	name: 'ifixit.ui.listbuilder',
	kind: enyo.VFlexBox,
	categories: [],
	published: {
		current: {DEVICES:[]},
		depth: 1
	},
	events: {
		onClickDevice: ''
	},
	components:[
		{className: 'areas-list-divider', content: 'Devices'},
		{flex: 1, name: 'devicesList', kind: 'VirtualList', onSetupRow: 'setupDevicesRow', components: [
			{kind: 'Item', onclick: 'deviceClick', className: 'devices-item', components: [
				{kind: 'Control', className: 'areas-label', name: 'listItemLabel'}
			]}
		]},
		
		{className: 'areas-list-divider', content: 'Categories'},
		{flex: 2, name: 'categoryList', kind: 'VirtualList', onSetupRow: 'setupCategoryRow', components: [
			{kind: 'Item', onclick: 'categoryClick', className: 'category-item', components: [
				{kind: 'Control', className: 'areas-label', name: 'categoryItemLabel'}
			]}
		]}
	],
	
	currentChanged: function() {
		this.categories = [];
		
		if(this.depth !== 1) {
			this.$.devicesList.punt();
		}
		
		this.$.devicesList.refresh();
		
		
		for(category in this.current) {
			if(this.current.hasOwnProperty(category) && category !== 'DEVICES') {
				this.categories.push(category)
			}
		}
		
		if(this.depth !== 1) {
			this.$.categoryList.punt();
		}
		
		this.$.categoryList.refresh();
	},
	
	create: function() {
		this.inherited(arguments);
		this.current = this.owner.areas;
		enyo.nextTick(this, 'fixLists');
	},
	
	fixLists: function() {
		this.$.devicesList.refresh();
		this.$.categoryList.refresh();
	},
	
	setupDevicesRow: function(inSender, index) {
		if(!this.current.DEVICES)
			return false;
		var row = this.current.DEVICES[index];
		if(row) {
			this.$.listItemLabel.setContent(row);
			return true;
		}
	},
	
	setupCategoryRow: function(inSender, index) {
		var row = this.categories[index];
		if(row) {
			this.$.categoryItemLabel.setContent(row);
			return true;
		}
	},
	
	deviceClick: function(inSender, event, index) {
		var devicetext = this.current.DEVICES[index];
		this.doClickDevice(devicetext);
	},
	
	categoryClick: function(inSender, event, index) {
		this.owner.loadCategory(this.categories[index])
	}
	
})

enyo.kind({
	name: 'ifixit.ui.devicebutton',
	kind: enyo.CustomButton,
	className: 'devices-item',
	published: {
		device: ''
	},
	components: [],
	create: function() {
		this.inherited(arguments);
		this.createComponent({className: 'areas-label', name: 'label', content: this.device});
	}
})

enyo.kind({
	name: 'ifixit.ui.categorybutton',
	kind: enyo.CustomButton,
	className: 'category-item',
	published: {
		category: ''
	},
	components: [],
	create: function() {
		this.inherited(arguments);
		this.createComponent({className: 'areas-label', name: 'label', content: this.category});
	}
})