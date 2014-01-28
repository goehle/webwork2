package WeBWorK::MathPet;
use base qw(WeBWorK);

use strict;
use warnings;

use Storable qw(nfreeze thaw);

=head2 NAME

Item - this file is responsible for updating the MathPet data stored in
 the global Achievement hash and for printing out the data which is used by 
 the javascript to actually create the math pet

=cut

sub updatePet {
    my $userName = shift;
    my $ce = shift;
    my $db = shift;
    my $globalData = shift;

    $globalData->{'thingie'} = 2;

}

sub getPetScript {
    my $userName = shift;
    my $ce = shift;
    my $db = shift;
    my $site_url = $ce->{webworkURLs}->{htdocs};

    
    my $globalUserAchievement = $db->getGlobalUserAchievement($userName);

    return "" unless $globalUserAchievement;

    my $globalData = {};
    #Thaw globalData hash
    if ($globalUserAchievement->frozen_hash) {       
		$globalData = thaw($globalUserAchievement->frozen_hash);
    }

    my $percentComplete = $globalUserAchievement->achievement_points/
	$globalUserAchievement->next_level_points;

    my $petClass = "Derpy";

    my $script = <<EOS;     
    <script type="text/javascript" src="$site_url/js/apps/MathPet/mathpet.js"></script>
    <script type="text/javascript">
    (function() {
	
	var parameters = {
        'mathPetURL' : '$ce->{webworkURLs}->{htdocs}/js/apps/MathPet',
	'mathPetURLimg' : '$ce->{webworkURLs}->{htdocs}/js/apps/MathPet/img',
        'percentComplete' : $percentComplete,
	'flags' : {
	    'earnedLevel' : 0,
	    'earnedAchievement' : 1,
	    'completedProblem' : 0,
	    'completedSet' : 0,
	    'sadPet' : 0,
	},
	};
	/* create the pet using the appropriate class and initialize */ 
	var myPet = new $petClass(parameters);
	myPet.initiate();

    }());
    </script>
EOS
	
    return $script;

}

1;
