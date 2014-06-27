var MathPets = function (petName,inputParams) {

    // This is the basic MathPets object.  Actual pets are subclasses of this
    function MathPet(input)
    {
	// This is so the pet can get subtly larger as they get through
	// The level
	this.percentComplete = input.percentComplete;
	// This is for flags (like new levels or something)
	this.flags = input.flags;
	// This an array of possible idle animation functions
	this.idles = new Array();
	// This is an array of possible click animation functions
	this.clicks = new Array();
	// This is the default image path, based off of the Pet name
	this.imgPath = input.mathPetURLimg+'/'+this.className;
	// The div containing the pet along with its boundaries
	this.petdiv = $('#math-pet');
	this.minleft = this.petdiv.offset().left;
	this.mintop = this.petdiv.offset().top;
	this.maxleft = this.petdiv.width()+ this.minleft;
	this.maxtop = this.petdiv.height() + this.mintop;

	// This hash contains infomration for the default animations
	// Each pet has to set the lengths (which will be different) and can
	// override the image name. 
	this.animations = {'move' : { 'img' : 'move.gif',
				      'length' : 0 },
			   'click1' : { 'img' : 'click1.gif',
					'length' : 0 },
			   'click2' : { 'img' : 'click2.gif',
					'length' : 0 },
			   'idle1' : { 'img' : 'idle1.gif',
				      'length' : 0 },
			   'idle2' : { 'img' : 'idle2.gif',
				       'length' : 0 },
			   'sad' : { 'img' : 'move.gif',
				      'length' : 0 },
			   'problemCheer' : { 'img' : 'problemCheer.gif',
					      'length' : 0 },
			   'setCheer' : { 'img' : 'setCheer.gif',
					  'length' : 0 },
			   'achievementCheer' : { 'img' : 'achievementCheer.gif',
						  'length' : 0 },
			   'levelUp' : { 'img' : 'levelUp.gif',
					 'length' : 0 }
			  }

	var self = this;
	
	// This is needed so that the same object is used across
	// setInterval calls
	function callAnimate() {
	    self.animate();
	}
	
	// Initiator function
	this.initiate = function()
	{

	    // Preload the images
	    $.each(this.animations, function (key, data) {
		self.animations[key].elem = $('<img/>',{
		    class: 'math-pet-img',
		    alt: 'MathPet', 
		    style: 'height:100%',
		    src:self.imgPath+'/'+data.img});
	    });

	    // Set up the petdiv with the pet
	    this.petdiv.append($('<div/>',{id : 'math-pet-img'}));
	    this.pet = $('#math-pet-img');
	    this.pet.html(this.animations.idle1.elem);
	    this.pet.css('position','absolute');
	    this.pet.css('user-select','none');
	    this.pet.height('150');
	    this.pet.on('dragstart',function (event) { 
		event.preventDefault(); 
	    });
	    
	    // set new boundaries
	    this.maxleft -= this.pet.width();
	    this.maxtop -= this.pet.height();
	    this.minleft += this.pet.width();
	    this.mintop += this.pet.height()+50;
	    
	    // set initial position of click
	    this.petleft = (this.maxleft+this.minleft)/2;
	    this.pettop = (this.maxtop+3*this.mintop)/4;
	    this.pet.offset({'left':this.petleft,'top':this.pettop});
	    
	    // we haven't idled or clicked yet
	    this.lastidle = -1;
	    this.lastclick = -1;
	    
	    // On a click we select a random click animation and call it
	    this.pet.click(function () {

		// interrupt other animations
		clearInterval(self.animateTimer);
		
		// Select new click
		var i;
	    	do {
		    i = Math.floor((Math.random()*self.clicks.length));
		} while (i == self.lastclick);
		
		// Call it
		self.lastclick = i;
		self.clicks[i](self);
		
		self.animateTimer = setTimeout(callAnimate,
					       self.animationLength*2000);
		
	    });
	    
	    //Get things started then go into a loop
	    this.animate();
	    
	}
	
	// This is the main animation loop
	this.animate = function() {
	    
	    // Do the level up animation if we have a new level
	    if (this.flags.earnedLevel) {
		var temppetleft = $(window).width()/2;
		var temppettop = $(window).height()/2;
		this.flags.earnedLevel = 0;
		
		$('#achievementModal').on('hidden', function () {
		    self.pet.offset({'left':temppetleft,'top':temppettop});
		    self.pet.animate({'opacity':1},1500);
		    self.pet.animate({'height':'100px'},2000);
		    self.pet.animate({'left':self.petleft,'top':self.pettop},3000);
		});
		
		// do other animations based off of the flags
	    } else if (this.flags.earnedAchievement) {
		this.flags.earnedAchievement = 0;
		this.achievementCheer();
	    } else if (this.flags.completedProblem) {
		this.flags.completedProblem = 0;
		this.completedProblemCheer();
	    } else if (this.flags.completedSet) {
		this.flags.completedSet = 0;
		this.completedSetCheer();	 
	    } else if (this.flags.sadPet) {
		this.sadAnimation();

		// do an idle animation if we are waiting.  
	    } else {
		
		// select a different idle animation
		var i;
		do {
		    i = Math.floor((Math.random()*this.idles.length));
		} while (i == this.lastidle);
		
		// run it.  
		this.lastidle=i;
		this.idles[i](this);
		
	    }
	    
	    this.animateTimer = setTimeout(callAnimate,
					   this.animationLength*2000);
	}
	
	// cheer and sad functions for flag animations
	this.problemCheer = function() {
	    this.pet.html(this.animations.problemCheer.elem);
	    this.pet.offset({'top':250,
			     'left':$( document ).width()/2});
	    this.animationLength = self.animations.problemCheer.length;
	}

	this.setCheer = function() {
	    this.pet.html(this.animations.setCheer.elem);
	    this.pet.offset({'top':250,
			     'left':$( document ).width()/2});
	    this.animationLength = self.animations.setCheer.length;
	}

	this.achievementCheer = function() {
	    this.pet.html(this.animations.achievementCheer.elem);
	    this.pet.offset({'top':250,
			     'left':$( document ).width()/2});
	    this.animationLength = self.animations.achievementCheer.length;
	}
	
	this.sadAnimation = function() {
	    this.pet.html(this.animations.sad.elem);
	    this.animationLength = self.animations.sad.length;
	}
	
	/* These are default standing idle animations */
	this.idles.push(function(self) {
	    self.pet.html(self.animations.idle1.elem);
	    self.animationLength = self.animations.idle1.length;
	});

	this.idles.push(function(self) {
	    self.pet.html(self.animations.idle2.elem);
	    self.animationLength = self.animations.idle2.length;
	});
	
	/* This is a walking around animation */
	this.idles.push(function(self) {
	    
	    var length = self.animations.move.length;
	    var newpetleft;
	    var newpettop;
	    
	    self.pet.html(self.animations.move.elem);
	    newpetleft = (Math.random()/2 + .5)*(self.maxleft-self.minleft) 
		+ self.minleft;
	    newpettop = (Math.random()/2 + .5)*(self.maxtop-self.mintop) + 
		self.mintop;

	    if (self.pet.offset().left < newpetleft) {
		self.pet.children('img').css({
		    '-moz-transform': 'scaleX(-1)',
		    '-o-transform': 'scaleX(-1)',
		    '-webkit-transform': 'scaleX(-1)',
		    'transform': 'scaleX(-1)',
		    'filter': 'FlipH',
		    '-ms-filter': 'FlipH',
		});
	    } else {
		self.pet.children('img').css({
		    '-moz-transform': 'scaleX(1)',
		    '-o-transform': 'scaleX(1)',
		    '-webkit-transform': 'scaleX(1)',
		    'transform': 'scaleX(1)',
		    'filter': 'none',
		    '-ms-filter': 'none',
		});
	    }

	    self.pet.animate({'left':newpetleft+'px','top':newpettop+'px'},
			     {'duration' : length*2000});
	    self.animationLength = length;
	});
	
	/* these are the default click animations */
	this.clicks.push(function(self) {
	    self.pet.html(self.animations.click1.elem);
	    self.animationLength = self.animations.click1.length;
	});
	
	this.clicks.push(function(self) {
	    self.pet.html(self.animations.click2.elem);
	    self.animationLength = self.animations.click2.length;
	});
	
    };
    
    // Egg animation.  This is the most different of the animations
    // because of its smaller move set.  
    Egg.prototype = Object.create(MathPet.prototype);
    Egg.prototype.constructor = Egg;
    
    function Egg (input) {
	
	this.className = 'Egg';
	MathPet.call(this,input);
	
	var self = this;

	// We override/duplicate some of the basic animations
	this.animations.move.length = 0;
	this.animations.click1.length = 0;
	this.animations.click2.img = 'click1.gif';
	this.animations.click2.length = 0;
	this.animations.idle1.length = 0;
	this.animations.idle2.img = 'idle2.gif';
	this.animations.idle2.length = 0;
	this.animations.sad.length = 0;
	this.animations.problemCheer.length = 0;
	this.animations.setCheer.img = 'problemCheer.gif';
	this.animations.setCheer.length = 0;
	this.animations.achievementCheer.img = 'problemCheer.gif';
	this.animations.achievementCheer.length = 0;
	this.animations.levelUp.length = 0;
    };

    // Dragonling pet is reasonably standard for this setup
    Dragonling.prototype = Object.create(MathPet.prototype);
    Dragonling.prototype.constructor = Dragonling;
    
    function Dragonling (input) {
	
	this.className = 'Dragonling';
	MathPet.call(this,input);
	
	var self = this;

	// Define the animation lengths
	this.animations.move.length = 0;
	this.animations.click1.length = 0;
	this.animations.click2.length = 0;
	this.animations.idle1.length = 0;
	this.animations.idle2.length = 0;
	this.animations.sad.length = 0;
	this.animations.problemCheer.length = 0;
	this.animations.setCheer.length = 0;
	this.animations.achievementCheer.length = 0;
	this.animations.levelUp.length = 0;

	// Adds another click animation
	this.clicks.push(function(self) {
	    self.pet.attr('src',self.imgPath+'/click3.gif');
	    self.animationLength = 0;
	});

	// Adds two click animations, one of which only happens very 
	// rarely. 
	this.clicks.push(function(self) {
	    if (Math.random() < .90) {
		self.pet.attr('src',self.imgPath+'/click4.gif');
		self.animationLength = 0;
	    } else {
		self.pet.attr('src',self.imgPath+'/click5.gif');
		self.animationLength = 0;
	    }
	});
	
	// Adds two idle animations, one of which only happens very 
	// rarely
	this.idles.push(function(self) {
	    if (Math.random() < .90) {
		self.pet.attr('src',self.imgPath+'/idle3.gif');
		self.animationLength = 0;
	    } else {
		self.pet.attr('src',self.imgPath+'/idle4.gif');
		self.animationLength = 0;
	    }
	});

    };

    // DrakeA pet is reasonably standard for this setup
    DrakeA.prototype = Object.create(MathPet.prototype);
    DrakeA.prototype.constructor = DrakeA;
    
    function DrakeA (input) {
	
	this.className = 'DrakeA';
	MathPet.call(this,input);
	
	var self = this;

	// Define the animation lengths
	this.animations.move.length = 0;
	this.animations.click1.length = 0;
	this.animations.click2.length = 0;
	this.animations.idle1.length = 0;
	this.animations.idle2.length = 0;
	this.animations.sad.length = 0;
	this.animations.problemCheer.length = 0;
	this.animations.setCheer.length = 0;
	this.animations.achievementCheer.length = 0;
	this.animations.levelUp.length = 0;

	// Adds another click animation
	this.clicks.push(function(self) {
	    self.pet.attr('src',self.imgPath+'/click3.gif');
	    self.animationLength = 0;
	});

	// Adds two click animations, one of which only happens very 
	// rarely. 
	this.clicks.push(function(self) {
	    if (Math.random() < .90) {
		self.pet.attr('src',self.imgPath+'/click4.gif');
		self.animationLength = 0;
	    } else {
		self.pet.attr('src',self.imgPath+'/click5.gif');
		self.animationLength = 0;
	    }
	});
	
	// Adds two idle animations, one of which only happens very 
	// rarely
	this.idles.push(function(self) {
	    if (Math.random() < .90) {
		self.pet.attr('src',self.imgPath+'/idle3.gif');
		self.animationLength = 0;
	    } else {
		self.pet.attr('src',self.imgPath+'/idle4.gif');
		self.animationLength = 0;
	    }
	});

    };

    // WyvernA pet is reasonably standard for this setup
    WyvernA.prototype = Object.create(MathPet.prototype);
    WyvernA.prototype.constructor = WyvernA;
    
    function WyvernA (input) {
	
	this.className = 'WyvernA';
	MathPet.call(this,input);
	
	var self = this;

	// Define the animation lengths
	this.animations.move.length = 4.77;
	this.animations.click1.length = 1.68;
	this.animations.click2.length = 2.70;
	this.animations.idle1.length = 3.30;
	this.animations.idle2.length = 3.15;
	this.animations.sad.length = 2.40;
	this.animations.problemCheer.length = 2.55;
	this.animations.setCheer.length = 3.78;
	this.animations.achievementCheer.length = 3.78;
	this.animations.levelUp.length = 0;

	$.extend(this.animations,{
	    'click3' : { 'img' : 'click3.gif',
			 'length' : 1.95 },
	    'click4' : { 'img' : 'click4.gif',
			 'length' : 2.70 },
	    'click5' : { 'img' : 'click5.gif',
			 'length' : 4.05 },
	    'idle3' : { 'img' : 'idle3.gif',
			'length' : 1.65 },
	    'idle4' : { 'img' : 'idle4.gif',
			'length' : 5.64 },
	});
	    
	// Adds another click animation
	this.clicks.push(function(self) {
	    self.pet.html(self.animations.click3.elem);
	    self.animationLength = self.animations.click3.length;
	});

	// Adds two click animations, one of which only happens very 
	// rarely. 
	this.clicks.push(function(self) {
	    if (Math.random() < .90) {
		self.pet.html(self.animations.click4.elem);
		self.animationLength = self.animations.click4.length;
	    } else {
		self.pet.html(self.animations.click5.elem);
		self.animationLength = self.animations.click5.length;
	    }
	});
	
	// Adds two idle animations, one of which only happens very 
	// rarely
	this.idles.push(function(self) {
	    if (Math.random() < .90) {
		self.pet.html(self.animations.idle3.elem);
		self.animationLength = self.animations.idle3.length;
	    } else {
		self.pet.html(self.animations.idle4.elem);
		self.animationLength = self.animations.idle4.length;
	    }
	});

    };

    // DragonA pet is reasonably standard for this setup, except
    // that it can have a sparkly overlay
    DragonA.prototype = Object.create(MathPet.prototype);
    DragonA.prototype.constructor = DragonA;
    
    function DragonA (input) {
	
	this.className = 'DragonA';
	MathPet.call(this,input);
	
	var self = this;

	// Define the animation lengths
	this.animations.move.length = 0;
	this.animations.click1.length = 0;
	this.animations.click2.length = 0;
	this.animations.idle1.length = 0;
	this.animations.idle2.length = 0;
	this.animations.sad.length = 0;
	this.animations.problemCheer.length = 0;
	this.animations.setCheer.length = 0;
	this.animations.achievementCheer.length = 0;
	this.animations.levelUp.length = 0;

	// Adds another click animation
	this.clicks.push(function(self) {
	    self.pet.attr('src',self.imgPath+'/click3.gif');
	    self.animationLength = 0;
	});

	// Adds two click animations, one of which only happens very 
	// rarely. 
	this.clicks.push(function(self) {
	    if (Math.random() < .90) {
		self.pet.attr('src',self.imgPath+'/click4.gif');
		self.animationLength = 0;
	    } else {
		self.pet.attr('src',self.imgPath+'/click5.gif');
		self.animationLength = 0;
	    }
	});
	
	// Adds two idle animations, one of which only happens very 
	// rarely
	this.idles.push(function(self) {
	    if (Math.random() < .90) {
		self.pet.attr('src',self.imgPath+'/idle3.gif');
		self.animationLength = 0;
	    } else {
		self.pet.attr('src',self.imgPath+'/idle4.gif');
		self.animationLength = 0;
	    }
	});

    };

    var cmd = 'var pet = new ' + petName + '(inputParams);';
    eval(cmd)
    return pet;
}