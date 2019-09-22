var store = [{
        "title": "Configure NginX to distribute traffic between multiple servers",
        "excerpt":"In this article I’d like to give some guidelines how to configure NginX to be the loadbalancer for a multiple backend servers. I consider the following schema: There are 2 NginX features that will do the trick for us: upstream is shipped with HttpUpstream module and allows to loadbalance the...","categories": ["NginX"],
        "tags": ["nginx","loadbalancing"],
        "url": "http://0.0.0.0:4000/nginx/nginx-loadbalancing/",
        "teaser":null},{
        "title": "Use lftp to work with files on ftp server in Linux",
        "excerpt":"Lftp - is a CLI tool that allows to exchange files with ftp and http server. Lftp supports mirroring that allows to upload/download files recursively. It also supports backward mirroring (mirror -R) that allows to upload our update the folder recursively. Mirorring allows to synchronize the particular folder between 2...","categories": ["FTP"],
        "tags": ["lftp","ftp","bash"],
        "url": "http://0.0.0.0:4000/ftp/use-lftp-to-work-with-ftp-server/",
        "teaser":null},{
        "title": "Enable Epel, Remi, Atrpms in RHEL/CentOS",
        "excerpt":"CentOS and other RHEL-based systems are being shipped with the default configuration for yum package manager. The default (official) repositories often don’t contain the required software or the latest versions of the perticular packages are not avaialble in these repositories. In order to extend yum capabilities the additional repositories can...","categories": ["CentOS"],
        "tags": ["centos","epel","remi","atrpms"],
        "url": "http://0.0.0.0:4000/centos/enable-additional-yum-repositories-in-centos/",
        "teaser":null},{
        "title": "Sed crib",
        "excerpt":"Sed is a streaming text editor in UNIX-like OS’es that allows to quickly edit contents of the commands outputs and edit files in place. The standart syntax is the following sed [options] commands [file name] Next you can find a lot of examples of sed usage Replace the word (root...","categories": ["Bash"],
        "tags": ["sed"],
        "url": "http://0.0.0.0:4000/bash/sed-crib/",
        "teaser":null},{
        "title": "Install Wireshark to Ubuntu 16.04/14.04",
        "excerpt":"WireShark is a great tool to analyze the network traffic. One day I discovered that it is not a trivial task to gegt it installed on Ubuntu. There is a surce package available for linux: https://1.na.dl.wireshark.org/src/wireshark-3.1.0.tar.xz However it is way easier to get it installed using the default package manager:...","categories": ["Ubuntu desktop"],
        "tags": ["ubuntu","wireshark"],
        "url": "http://0.0.0.0:4000/ubuntu%20desktop/install-wireshark-ubuntu-desktop/",
        "teaser":null},{
        "title": "Reading unique records from file",
        "excerpt":"The following command can be executed to read unique IPs from the apache access log. Different variations can be used to process records from any file:   cat access.log | awk '{print $1}' | sort -n | uniq -c | sort -nr | head -20  ","categories": ["Bash"],
        "tags": ["Bash","Apache","awk"],
        "url": "http://0.0.0.0:4000/bash/unique-ips-from-apache-log/",
        "teaser":null}]
