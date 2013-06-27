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

sub getPetData {
    my $userName = shift;
    my $ce = shift;
    my $db = shift;
    
    my $globalUserAchievement = $db->getGlobalUserAchievement($userName);

    return "" unless $globalUserAchievement;

    my $globalData = {};
    #Thaw globalData hash
    if ($globalUserAchievement->frozen_hash) {       
		$globalData = thaw($globalUserAchievement->frozen_hash);
    }

    my $points = $globalUserAchievement->achievement_points;
    my $url = $ce->{webworkURLs}->{htdocs}.'/js/apps/MathPet/img/cat.gif';

    my $script = <<EOS;     
    var myPet = new mathPet($points,"$url");
    myPet.initiate();
EOS
    ;
	
    return $script;

}

1;
