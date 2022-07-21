---
id: 2245
title: Daily statistics in AwStats
date: 2014-12-02T16:51:32+00:00
author: admin

guid: http://www.tech-notes.net/?p=2245
permalink: /daily-stats-awstats/
image: /wp-content/uploads/2014/02/awstats_ban_460x270.png
categories:
  - Apache
tags:
  - awstats
---
AwStats is a log file parser written in perl, with which you can keep statistics of site visits based on information from log files.

As a rule, awstats displays general information for the week, month. But what to do if you need to display information about visiting the site for a specific day.

A similar trick will be discussed further on the example of a server based on Linux Ubuntu with Apache2.

First, install AwStats:
```bash
apt-get install awstats libapache2-mod-perl2
```

Create website config:
```bash
cp /etc/awstats/awstats.conf /etc/awstats/awstats.**website.com**.conf
```

Edit the file accordingly:
```bash
LogFile="/var/log/apache2/access.log" #path to logfile;
LogFormat=1 #for full statistics;
SiteDomain="website.com” #domainname;
HostAliases="www.website.com website.com" #site aliases
AllowFullYearView=3
DNSLookup=0
```


That is it. Next enable AwStats in Apache:
```bash
cp /usr/share/doc/awstats/examples/apache.conf /etc/apache2/conf.d/awstats.conf  
/etc/init.d/apache2 reload
```

Edit cron tab:
```bash
crontab -e
```

Create the following cron jobs:
```bash
0 2 * * * /usr/lib/cgi-bin/awstats.pl --config=/etc/awstats/awstats.website.com.conf -DatabaseBreak=day > /dev/null
0 2 * * * /usr/lib/cgi-bin/awstats.pl --config=/etc/awstats/awstats.website.com.conf -DatabaseBreak=month > /dev/null
0 2 * * * /usr/lib/cgi-bin/awstats.pl --config=/etc/awstats/awstats.website.com.conf -DatabaseBreak=year > /dev/null
```


It remains to create `index.cgi` that will provide the ability to select a range for displaying statistics.
Create an `index.cgi` file in `/usr/lib/cgi-bin/`

The contents of the file are in the spoiler.
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="/assets/js/spoiler.js" type="text/javascript"></script>


<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    /usr/lib/cgi-bin/index.cgi
  </div>

  <div class="spoiler-body">

<pre>
#!/usr/bin/perl

# The awstats config file name
$CONFIG="awstats";

### Begin program ###

@now=localtime(time);
$today_day=$now[3];
$today_month=$now[4]+1;
$today_year=$now[5]+1900;

@yesterday=localtime(time-3600*24);
$ytd_day=$yesterday[3];
$ytd_month=$yesterday[4]+1;
$ytd_year=$yesterday[5]+1900;

$lastmonth=$today_month-1;
$lastmonth_year=$today_year;
if($lastmonth&lt;1)
{
	$lastmonth=1;
	$lastmonth_year=$today_year-1;
}
$lastyear=$today_year-1;

print "Content-type: text/html\n\n";
print "&lt;html&gt;&lt;body&gt;\n";
print "&lt;a href='".getLink($today_year,$today_month,$today_day)."'&gt;Today&lt;/a&gt; ";
print "&lt;a href='".getLink($ytd_year,$ytd_month,$ytd_day)."'&gt;Yesterday&lt;/a&gt; ";
print "&lt;a href='".getLink($today_year,$today_month)."'&gt;ThisMonth&lt;/a&gt; ";
print "&lt;a href='".getLink($lastmonth_year,$lastmonth)."'&gt;LastMonth&lt;/a&gt; ";
print "&lt;a href='".getLink($today_year)."'&gt;ThisYear&lt;/a&gt; ";
print "&lt;a href='".getLink($lastyear)."'&gt;LastYear&lt;/a&gt; ";
print "\n&lt;hr/&gt;\n";

printCal($lastmonth_year, $lastmonth);
print "\n&lt;br&gt;\n";
printCal($today_year, $today_month);

print "\n&lt;hr/&gt;&lt;/body&gt;&lt;/html&gt;\n";


##### Methods ######

sub getLink
{
	my($year, $month, $day)=@_;
	$query="";
	if($day)
	{
		$query="DatabaseBreak=day&day=${day}&month=${month}&year=${year}";
	}
	elsif($month)
	{
		$query="month=${month}&year=${year}";
	}
	elsif($year)
	{
		$query="year=${year}&month=all";
	}
	return "awstats.pl?config=${CONFIG}&$query";
}

sub printCal
{
my($y, $m)=@_;
open(CAL, "cal $m $y |");
@days = &lt;CAL&gt;;
close(CAL);

$month = $days[0];
$month=~ s/\s\s\s*//g;
$mbg="";
if($m==$today_month && $y==$today_year)
{
	$mbg="bgcolor='#ffaaaa'";
}
print "&lt;table border=1&gt;&lt;tr&gt;&lt;td colspan=7 $mbg&gt;&lt;a href='".getLink($y, $m)."'&gt;$month&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;\n";
foreach $dy (split(/ /, $days[1]))
{
	print "&lt;td&gt;$dy&lt;/td&gt;";
}
print "&lt;/tr&gt;\n";
shift(@days);
shift(@days);
foreach $line (@days)
{
	chomp $line;
	$line =~ s/^\s+//;
	$line =~ s/\s+$//;
	print "&lt;tr&gt;";
	foreach	$d (split(/\s+/, $line))
	{
		$bg="";
		if($d==$today_day && $m==$today_month && $y==$today_year)
		{
			$bg="bgcolor='#ffaaaa'";
		}
		print "&lt;td $bg&gt;&lt;a href='".getLink($y, $m, $d)."'&gt;$d&lt;/a&gt;&lt;/td&gt;";
	}
	print"&lt;/tr&gt;\n";
}
print "&lt;/table&gt;\n";
}
</pre>
</div> </div>

Make it executable and change the owner:
```bash
chmod 755 /usr/lib/cgi-bin/index.cgi
chown www-data:www-data /usr/lib/cgi-bin/index.cgi
```

Edit `/etc/apache2/conf.d/awstats.conf` with the following:
```bash
DirectoryIndex index.cgi
```

I got the same note for <a href="http://www.tech-notes.net/awstats-for-nginx/" title="Configure Awstats for Nginx" target="_blank">NginX</a>
