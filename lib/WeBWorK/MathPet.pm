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

    $globalData->{'petClass'} = 'Derpy';

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

    my $percentComplete = 0;
    if ($globalUserAchievement->next_level_points) {
	$percentComplete = $globalUserAchievement->achievement_points/
	    $globalUserAchievement->next_level_points;
    }


    my $earnedLevel = $globalData->{earnedLevel} ? 1 : 0;
    my $earnedAchievement = $globalData->{earnedAchievement} ? 1 : 0;
    my $completedProblem = $globalData->{completedProblem} ? 1 : 0;
    my $completedSet =  $globalData->{completedSet} ? 1 : 0;
    my $sadPet =  $globalData->{incorrectStreak} > 10 ? 1 : 0;

    
    my $script = <<EOS;     
    <script type="text/javascript" src="$site_url/js/apps/MathPet/mathpet.js"></script>
    <script type="text/javascript">
    (function() {
	
	var parameters = {
        'mathPetURL' : '$ce->{webworkURLs}->{htdocs}/js/apps/MathPet',
	'mathPetURLimg' : '$ce->{webworkURLs}->{htdocs}/js/apps/MathPet/img',
        'percentComplete' : $percentComplete,
	'flags' : {
	    'earnedLevel' : $earnedLevel,
	    'earnedAchievement' : 1,
	    'completedProblem' : $completedProblem,
	    'completedSet' : $completedSet,
	    'sadPet' : $sadPet,
	},
	};
	/* create the pet using the appropriate class and initialize */ 
	var myPet = MathPets('WyvernA',parameters);
	myPet.initiate();

    }());
    </script>
EOS

    return $script;

}

1;
