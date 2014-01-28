
function MathPet(input)
{
    this.percentComplete = input.percentComplete;
    this.idle = new Array();
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
			   +this.waitingAnimation+'" />');
	this.pet = $('#math-pet-img');

	this.pet.height('50px');
	this.maxleft -= this.pet.width();
	this.maxtop -= this.pet.height();
	this.minleft += this.pet.width();
	this.mintop += this.pet.height();

	this.petleft = (this.maxleft+3*this.minleft)/4;
	this.pettop = (this.maxtop+3*this.mintop)/4;
	this.pethomeleft = this.petleft;
	this.pethometop = this.pettop;
	
	if ($("#achievementModal:contains('Level Up')").length > 0) {
                             
	    var temppetleft = $(window).width()/2;
	    var temppettop = $(window).height()/2;

	    $('#achievementModal').on('hidden', function () {
		self.pet.offset({'left':temppetleft,'top':temppettop});
		self.pet.animate({'opacity':1},1500);
		self.pet.animate({'height':'100px'},2000);
		self.pet.animate({'left':self.petleft,'top':self.pettop},3000);
	    });
	} else {

	    this.pet.offset({'left':this.petleft,'top':this.pettop});
	    this.pet.animate({'opacity':1},1500);
	}

	//Get things started then go into a loop
	this.animate();

    }

    this.animate = function() {
	if ($('#achievementModal').length > 0) {
	    
	    this.dance();
	    
	} else {

	    var i = Math.floor((Math.random()*this.idle.length));
	    this.idle[i](this);

	}
	
	setTimeout(callAnimate,1000);
    }

    this.dance = function() {
	this.pet.rotate({angle:0,animateTo:360});

    }

    this.idle.push(function(self) {
	
	var xdir;
	var ydir;
	var speed = 150; 
	var newpetleft;
	var newpettop;
	
	var i = 0;

	while (i < 2) {

	    do {
		xdir = 2*(Math.random()-.5);
		ydir = 2*(Math.random()-.5);
		newpetleft = speed*xdir + self.petleft;
		newpettop = speed*ydir + self.pettop;
	    } while (newpetleft > self.maxleft ||
		     newpetleft < self.minleft ||
		     newpettop > self.maxtop ||
		     newpettop < self.mintop);

	    self.pet.animate({'left':newpetleft+'px','top':newpettop+'px'},3000);
	    i++;
	}
    });
};

Derpy.prototype = Object.create(MathPet.prototype);
Derpy.prototype.constructor = Derpy;

function Derpy (input) {

    MathPet.call(this,input);
    this.waitingAnimation = input.mathPetURLimg+'/sprite_derpy.gif';
    this.idle.push( function(self) {
	self.pet.rotate({angle:0,animateTo:360});

    });

    

};

