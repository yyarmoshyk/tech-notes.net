---
id: 2547
title: Удаляем Perl модули из cpan
date: 2015-04-24T15:54:48+00:00
author: admin

guid: http://www.tech-notes.net/?p=2547
permalink: /remove-perl-cpan-modules/
image: /wp-content/uploads/2015/04/perl_logo.jpg
categories:
  - Perl
---
В установке любого Perl модуля Вам поможет утилита `cpan`. Дело в том, что cpan скачивает архивы с исходным кодом, компилирует их и устанавливает. Проблема появляется, когда такой модуль нужно удалить.

Следующий скрипт поможет Вам в удалении ненужны модулей:

```perl
# uninstall_perl_module.pl from PerlTricks.com

use 5.14.2;
use ExtUtils::Installed;
use ExtUtils::Packlist;

# Exit unless a module name was passed
die ("Error: no Module::Name passed as an argument. E.G.\n\t perl $0 Module::Name\n") unless $#ARGV == 0;

my $module = shift @ARGV;

my $installed_modules = ExtUtils::Installed->new;

# iterate through and try to delete every file associated with the module
foreach my $file ($installed_modules->files($module)) {
    print "removing $file\n";
    unlink $file or warn "could not remove $file: $!\n";
}

# delete the module packfile
my $packfile = $installed_modules->packlist($module)->packlist_file;
print "removing $packfile\n";
unlink $packfile or warn "could not remove $packfile: $!\n";

# delete the module directories if they are empty
foreach my $dir (sort($installed_modules->directory_tree($module))) {
    print("removing $dir\n");
    rmdir $dir or warn "could not remove $dir: $!\n";
}
```


Выполняется так:

```bash
perl uninstall_perl_module.pl Acme::Dot
```

Альтернативой модет быть очистка руками:

```bash
cd ~/.cpan/build  
cd имя-модуля-xyz  
make uninstall
```

Следуем инструкциям.

Можно попытать счастье с [App::cpanminus](https://metacpan.org/pod/App::cpanminus). Устанавливается с помощью `cpan`

Выполняется:

```bash
cpanm -uninstall Acme::Dot
```

<a href="http://perltricks.com/article/3/2013/3/27/How-to-cleanly-uninstall-a-Perl-module" target="_blank">perltricks.com</a>  
<a href="https://coderwall.com/p/5slzow/perl-uninstall-perl-cpan-module" target="_blank">coderwall.com</a>
