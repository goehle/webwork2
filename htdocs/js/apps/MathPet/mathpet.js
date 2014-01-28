
function MathPet(input)
{
    this.percentComplete = input.percentComplete;
    this.flags = input.flags;
    this.idle = new Array();
    this.imgPath = input.mathPetURLimg+'/'+this.className;
    this.petdiv = $('#math-pet');
    this.minleft = this.petdiv.offset().left;
    this.mintop = this.petdiv.offset().top;
    this.maxleft = this.petdiv.width()+ this.minleft;
    this.maxtop = this.petdiv.height() + this.mintop;


    var self = this;

    // This is needed so that the same object is used across setInterval calls
    function callAnimate() {
	self.animate();
    }

    this.initiate = function()
    {
	this.petdiv.append('<img id="math-pet-img" alt="MathPet" src="'
			   +this.imgPath+'/idle.gif" />');
	this.pet = $('#math-pet-img');
	this.pet.css('position','absolute');

	this.maxleft -= this.pet.width();
	this.maxtop -= this.pet.height();
	this.minleft += this.pet.width();
	this.mintop += this.pet.height()+50;

	this.petleft = (this.maxleft+this.minleft)/2;
	this.pettop = (this.maxtop+3*this.mintop)/4;
	this.pet.offset({'left':this.petleft,'top':this.pettop});

	//Get things started then go into a loop
	this.animate();

    }

    this.animate = function() {

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
	} else {

	    var i = Math.floor((Math.random()*this.idle.length));
	    this.idle[i](this);

	}

	setTimeout(callAnimate,this.animationLength);
    }

    this.defaultCheer = function() {
	this.pet.attr('src',self.imgPath+'/cheer.gif');
	this.animationLength = 10000;
    }

    this.achievementCheer = this.defaultCheer;
    this.completedProblemCheer = this.defaultCheer;
    this.completedSetCheer = this.defaultCheer;


    /* This is a standing idle animation */
    this.idle.push(function(self) {
	self.pet.attr('src',self.imgPath+'/idle.gif');
	self.animationLength = 4000;
    });
    
    /* This is a walking around animation */
    this.idle.push(function(self) {
	
	var length = 3000;
	var newpetleft;
	var newpettop;
	
	self.pet.attr('src',self.imgPath+'/walk.gif');
	
	newpetleft = Math.random()*(self.maxleft-self.minleft) + 
	    self.minleft;
	newpettop = Math.random()*(self.maxtop-self.mintop) + 
	    self.mintop;
	self.pet.animate({'left':newpetleft+'px','top':newpettop+'px'},
			 {'duration' : length});
	self.animationLength = length;
    });
    
    this.sadAnimation = function() {
	this.pet.attr('src',self.imgPath+'/sad.gif');
	this.animationlength = 10000;
    }
};

Derpy.prototype = Object.create(MathPet.prototype);
Derpy.prototype.constructor = Derpy;

function Derpy (input) {
    
    this.className = 'Derpy';
    MathPet.call(this,input);

    var self = this;

    /* this is another idle animation */
    this.idle.push( function(self) {
	self.pet.attr('src',self.imgPath+'/idle2.gif');
	self.animationLength = 10000;
    });

    /* this overrides the achievement cheer */
    this.achievementCheer = function () {
	this.pet.attr('src',self.imgPath+'/muffin.gif');
	this.animationLength = 6000;
    }    

};

