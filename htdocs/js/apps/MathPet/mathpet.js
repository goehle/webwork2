function mathPet(score,imgurl)
{
    this.score = score;
    this.url = imgurl;
    this.petdiv = $('#math-pet');
    this.minleft = this.petdiv.offset().left;
    this.mintop = this.petdiv.offset().top;
    this.maxleft = this.petdiv.width()+ this.minleft;
    this.maxtop = this.petdiv.height() + this.mintop;

    // This is needed so that the same object is used across setInterval calls
    var self = this;
    function callAnimate() {
	self.animate();
    }

    this.initiate = function()
    {
	this.petdiv.append('<img id="math-pet-img" alt="MathPet" src="'+imgurl+'" />');
	this.pet = $('#math-pet-img');

	this.pet.height('50px');
	this.maxleft -= this.pet.width();
	this.maxtop += this.pet.height();

	this.petleft = (this.maxleft+3*this.minleft)/4;
	this.pettop = (this.maxtop+3*this.mintop)/4;
	this.pethomeleft = this.petleft;
	this.pethometop = this.pettop;

	this.pet.offset({'left':this.petleft,'top':this.pettop});
	this.pet.animate({'opacity':1},1500);
	
	//Get things started then go into a loop
	this.animate();
	window.setInterval(callAnimate, 10000);

    }

    this.animate = function() {
	this.wander();
    }

    this.wander = function() {
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
		newpetleft = speed*xdir + this.petleft;
		newpettop = speed*ydir + this.pettop;
	    } while (newpetleft > this.maxleft ||
		     newpetleft < this.minleft ||
		     newpettop > this.maxtop ||
		     newpettop < this.mintop);

	    this.pet.animate({'left':newpetleft+'px','top':newpettop+'px'},3000);
	    i++;
	}
    }
}
