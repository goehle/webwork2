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
			   'achievementCheer' : { 'img' : 'achievmentCheer.gif',
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
	    // Set up the petdiv with the pet
	    this.petdiv.append('<img id="math-pet-img" alt="MathPet" src="'
			       +this.imgPath+'/idle1.gif" />');
	    this.pet = $('#math-pet-img');
	    this.pet.css('position','absolute');
	    this.pet.height(100);
	    
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
					       self.animationLength);
		
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
					   this.animationLength);
	}
	
	// cheer and sad functions for flag animations
	this.problemCheer = function() {
	    this.pet.attr('src',self.imgPath+'/'+
			 self.animations.problemCheer.img);
	    this.pet.offset({'top':250,
			     'left':$( document ).width()/2});
	    this.animationLength = self.animations.problemCheer.length;
	}

	this.setCheer = function() {
	    this.pet.attr('src',self.imgPath+'/'+
			 self.animations.setCheer.img);
	    this.pet.offset({'top':250,
			     'left':$( document ).width()/2});
	    this.animationLength = self.animations.setCheer.length;
	}

	this.achievementCheer = function() {
	    this.pet.attr('src',self.imgPath+'/'+
			 self.animations.achievementCheer.img);
	    this.pet.offset({'top':250,
			     'left':$( document ).width()/2});
	    this.animationLength = self.animations.achievementCheer.length;
	}
	
	this.sadAnimation = function() {
	    this.pet.attr('src',self.imgPath+'/'+
			 self.animations.sad.img);
	    this.animationLength = self.animations.sad.length;
	}
	
	/* These are default standing idle animations */
	this.idles.push(function(self) {
	    this.pet.attr('src',self.imgPath+'/'+
			 self.animations.idle1.img);
	    this.animationLength = self.animations.idle1.length;
	});

	this.idles.push(function(self) {
	    this.pet.attr('src',self.imgPath+'/'+
			 self.animations.idle2.img);
	    this.animationLength = self.animations.idle2.length;
	});
	
	/* This is a walking around animation */
	this.idles.push(function(self) {
	    
	    var length = self.animations.move.length;
	    var newpetleft;
	    var newpettop;
	    
	    self.pet.attr('src',self.imgPath+'/'+
			 self.animations.move.img);
	    
	    newpetleft = Math.random()*(self.maxleft-self.minleft) + 
		self.minleft;
	    newpettop = Math.random()*(self.maxtop-self.mintop) + 
		self.mintop;
	    self.pet.animate({'left':newpetleft+'px','top':newpettop+'px'},
			     {'duration' : length});
	    self.animationLength = length;
	});
	
	/* these are the default click animations */
	this.clicks.push(function(self) {
	    self.pet.attr('src',self.imgPath+'/'+
			 self.animations.click1.img);
	    self.animationLength = self.animations.click1.length;
	});
	
	this.clicks.push(function(self) {
	    self.pet.attr('src',self.imgPath+'/'+
			  self.animations.click2.img);
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