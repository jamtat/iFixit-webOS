enyo.kind({
	name: 'ifixit.ui.guidepage',
	kind: enyo.HFlexBox,
	className: 'guide-cover guide-page',
	published: {
		step: {},
		last: false
	},
	
//Helper function to fix the api messing up the HTML
	toHTML: function(str) {
		return str.replace(/&lt;/g,'<').replace(/&gt;/g,'>');
	},
	
	create: function() {
		this.inherited(arguments);
		this.updateSteps();
		this.$.thumbnails.setImages(this.step.images);
		if(this.last === true) {
			this.$.pagehint.destroy();
		}
	},
	
	components: [
		//{kind: 'ifixit.ui.blur', name: 'blurImage', className: 'blurred hidden'},
		
		{/*width: '665px',*/flex:1, className: 'image-pane', kind: enyo.VFlexBox, components:[
			{name: 'stepNumber', className: 'step-number'},
			{name: 'mainImage', className: 'main-image'},
			{kind: 'ifixit.ui.thumbnailtray', name: 'thumbnails', onChoose: 'updateImage'}
		]},
		
		{className:'info-shadow'},
		{kind: enyo.VFlexBox, width:'370px', height: '100%', className: 'info-pane', components:[
			{flex:1, kind: 'Scroller', components: [
				{name: 'infoPane'}
			]},
			{content: 'Swipe To Turn the Page', name: 'pagehint', className: 'guide-hint guide-hint-page oblique'}
		]}	
	],
	
	
	updateBlur: function() {
		/*if(this.bigImage === undefined || !this.bigImage) {
			this.$.blurImage.setImage(this.step.images[0].text + '.large');
		} else {
			this.$.blurImage.setImage(this.bigImage);
		}*/
	},
	
	updateSteps: function() {
		this.$.stepNumber.setContent('Step ' + this.step.number);
		var lines = this.step.lines;
		for(var i = 0; i < lines.length; i++) {
			this.$.infoPane.createComponent({kind: 'ifixit.ui.infostep', colour: lines[i].bullet, text: this.toHTML(lines[i].text), level: lines[i].level});
		}
	},
	
	updateImage: function(inSender, inImage) {
		this.$.mainImage.applyStyle('background-image', 'url(' + inImage + '.large)');
		this.bigImage = inImage;
		enyo.job('updateBlur', enyo.bind(this, 'updateBlur'), 10);
	}
})



enyo.kind({
	name: 'ifixit.ui.infostep',
	kind: enyo.Control,
	className: 'infostep',
	allowHtml: true,
	published: {
		colour: 'black',
		text: '',
		level: 0
	},
	create: function() {
		this.inherited(arguments);
		this.addClass(this.colour);
		this.addClass('level' + this.level);
		this.setContent(this.text);
	}
})

enyo.kind({
	name: 'ifixit.ui.thumbnailtray',
	className: 'thumbnail-tray',
	kind: enyo.Scroller,
	autoHorizontal: false, horizontal: true, autoVertical: false, vertical: false, 
	selection: undefined,
	published: {
		images: []
	},
	events: {
		onChoose: ''
	},
	
	create: function() {
		this.inherited(arguments);
	},
	
	components: [
		{name: 'thumbnailTray', className: 'thumbnail-wrapper', kind: enyo.HFlexBox, components: []}
	],
	
	imagesChanged: function() {
		for(var i = 0; i < this.images.length; i++) {
			var comp = this.$.thumbnailTray.createComponent({kind: 'ifixit.ui.thumbnailimage', image: this.images[i].text, onPick: 'imageChosen', owner: this});
			if(i === 0) {
				this.imageChosen(comp);
			}
		}
		
	},
	
	imageChosen: function(inSender) {
		if(this.selection) {
			this.selection.removeClass('active');
		}
		this.selection = inSender;
		this.selection.addClass('active');
		this.doChoose(inSender.image);
	}
	
	
})

enyo.kind({
	name: 'ifixit.ui.thumbnailimage',
	kind: enyo.Control,
	className: 'thumbnail-image',
	published: {
		image: ''
	},
	events: {
		onPick: ''
	},
	
	create: function() {
		this.inherited(arguments);
		this.imageChanged();
	},
	
	imageChanged: function() {
		this.applyStyle('background-image', 'url(' + this.image + '.large)');
	},
	
	clickHandler: function() {
		this.doPick();
	}
})