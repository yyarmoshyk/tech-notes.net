---
id: 2245
title: Статистика по дням в AwStats
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
AwStats - парсер лог файлов, написанный на perl, с помощью которого можно вести статистику посещений сайта на основе информации из лог файлов.

Как правило awstats отображает общую информаци за неделю, месяц. Но что же делать, если нужно отображать информацию о посещении сайта за конкретный день.

О подобном трюке дальше и пойдет речи на примере сервера на базе Linux Ubuntu c Apache2.

Для начала установим AwStats:

```bash
apt-get install awstats libapache2-mod-perl2
```

Создаем конфиг для сайта:

```bash
cp /etc/awstats/awstats.conf /etc/awstats/awstats.**website.com**.conf
```

Открываем новый файл. В нем нужно найти и отредактировать следующие области:

```bash
LogFile="/var/log/apache2/access.log" #path to logfile;
LogFormat=1 #for full statistics;
SiteDomain="website.com” #domainname;
HostAliases="www.website.com website.com" #site aliases
AllowFullYearView=3
DNSLookup=0
```


На этом все.  
Включаем конфигурацию AwStats в Apache:

```bash
cp /usr/share/doc/awstats/examples/apache.conf /etc/apache2/conf.d/awstats.conf  
/etc/init.d/apache2 reload
```

Открываем редактор запранированых заданий:

```bash
crontab -e
```

Создаем расписание (cronjob):

```bash
0 2 * * * /usr/lib/cgi-bin/awstats.pl --config=/etc/awstats/awstats.website.com.conf -DatabaseBreak=day > /dev/null
0 2 * * * /usr/lib/cgi-bin/awstats.pl --config=/etc/awstats/awstats.website.com.conf -DatabaseBreak=month > /dev/null
0 2 * * * /usr/lib/cgi-bin/awstats.pl --config=/etc/awstats/awstats.website.com.conf -DatabaseBreak=year > /dev/null
```


Осталось создать `index.cgi`, который и предоставит возможность выбирать диапазон для отображения статистики.  
Создайте файл `index.cgi` в папке `/usr/lib/cgi-bin/`

Содержимое файла - в спойлере.  
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

Выставте параметры доступа на файлы:
```bash
chmod 755 /usr/lib/cgi-bin/index.cgi
chown www-data:www-data /usr/lib/cgi-bin/index.cgi
```

Для упрощения доступа отредактируйте файл `/etc/apache2/conf.d/awstats.conf`:
```bash
DirectoryIndex index.cgi
```

По аналогии можно настроить <a href="http://www.tech-notes.net/awstats-for-nginx/" title="Настройка Awstats для Nginx" target="_blank">AwStats для NginX</a>
