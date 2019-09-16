var store = [{
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
