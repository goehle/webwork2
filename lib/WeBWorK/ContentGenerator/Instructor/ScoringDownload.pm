################################################################################
# WeBWorK Online Homework Delivery System
# Copyright � 2000-2003 The WeBWorK Project, http://openwebwork.sf.net/
# $CVSHeader$
# 
# This program is free software; you can redistribute it and/or modify it under
# the terms of either: (a) the GNU General Public License as published by the
# Free Software Foundation; either version 2, or (at your option) any later
# version, or (b) the "Artistic License" which comes with this package.
# 
# This program is distributed in the hope that it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
# FOR A PARTICULAR PURPOSE.  See either the GNU General Public License or the
# Artistic License for more details.
################################################################################

package WeBWorK::ContentGenerator::Instructor::ScoringDownload;
use base qw(WeBWorK::ContentGenerator::Instructor);

=head1 NAME
 
WeBWorK::ContentGenerator::Instructor::ScoringDownload - Download scoring data files

=cut

use strict;
use warnings;
use Apache::Constants qw(:common);

sub header {
	my ($self) = @_;
	my $r = $self->{r};
	my $ce = $self->{ce};
	my $scoringDir = $ce->{courseDirs}->{scoring};
	my $file = $r->param('getFile');
	if (-f "$scoringDir/$file") {
		$r->content_type('text/comma-separated-values');
		$r->header_out("Content-Disposition" => "attachment; filename=$file;");
		$r->send_http_header();
		return OK;
	} else {
		$self->{noContent} = 1;
		return NOT_FOUND;
	}
}

sub content {
	my ($self) = @_;
	my $r = $self->{r};
	my $ce = $self->{ce};
	my $authz = $self->{authz};
	my $scoringDir = $ce->{courseDirs}->{scoring};
	my $user = $r->param('user');
	
	if (!$authz->hasPermissions($user, "score_sets")) {
		print "You do not have permission to access scoring data";
	} else {
		my $file = $r->param('getFile');
		open my $fh, "<", "$scoringDir/$file";
		print while (<$fh>);
		close $fh;
	}
}

1;
