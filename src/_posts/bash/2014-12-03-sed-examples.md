---
id: 2257
title: SED Cheat Sheet
date: 2014-12-03T20:30:26+00:00
author: "Yaroslav Yarmoshyk"

guid: http://www.tech-notes.net/?p=2257
permalink: /sed-examples/
image: /wp-content/uploads/2014/12/sed_logo.jpg
categories:
  - bash
tags:
  - sed
---
`Sed` is a stream editor on UNIX-like operating systems that is used to filter and transform text.

`Sed` can be used for both editing files and standard output of programs/operations to stdout.

Standard syntax:
```bash
sed [options] commands [filename]
```

The following are examples of using sed in various situations.

**Word replacement** (root on Admin):
```bash
sed 's/root/Admin/' filename
```

As a result, the contents of the file will be printed to stdout and `root` will be replaced by `Admin`.
Unfortunately, the replacement will be made only for the first occurance of `root`. To have all output processed, use `g` in the expression.
```bash
sed 's/root/Admin/g' filename
```

Typically, a sed command consists of two parts, separated by the `/` character.
On the left side, the value or expression that interests us is indicated, on the right side, the new value for the left side.

<center>
  <div id="gads">
  </div>
</center>

**To perform multiple operations** use the `-e` switch:
```bash
sed -e 's/root/Admin/g' -e 's/bash/sh/g' filename
```

**Replace the word only in lines containing the desired one** (replace `root` with `Admin` in lines with the word `user`):
```bash
sed '/user/s/root/Admin/g' filename
```

**To edit a file** use the `-i` switch:
```bash
sed -i '/user/s/root/Admin/g' filename
```

**Removing the 5th line**
```bash
sed -i '5d' filename
```

**To backup the original file** use -i.bak
```bash
sed -i.bak '5d' filename
```

**Remove the line containing the word `games`**:
```bash
sed '/games/d' filename
```

**Remove all blank lines**:
```bash
sed '/^$/d' filename
```

**Row range display** (rows from one to five)
```bash
sed -n '1,5p' filename
```

The file name is optional. With sed you can change the standard output.

Compare standard output:
```bash
df -kh
```

and its modified version:
```bash
df -kh |sed 's/%/000000/g'
```

<center>
  <div id="gads">
  </div>
</center>

### Using special characters:
You can use special characters:
* `^` - start of line
* `$` - end of line
* `.` - designation of one character

The complete set is not limited to just these three. `Sed` understands [regular expressions](https://www.gnu.org/software/sed/manual/html_node/Regular-Expressions.html) very well.

The following command will replace `root` with `Admin` on lines that start with `user`:
```bash
sed '/^user/s/root/Admin/g' filename
```

The following command will replace `root` with `Admin` on lines that end with `data`:
```bash
sed '/data$/s/root/Admin/g' filename
```

In case you need to use any special character in sed ( `$`, `^`, `/`, space, dot, `'`, etc.) it must be `escaped` with `\ `.

The following construct will replace the word `root` followed by a space with `Admin` followed by a colon:
```bash
sed 's/root\ /Admin:/g' filename
```

In the case of using the symbol | (pipe) special characters do not need to be escaped as a separator, but regular expressions will not work in this case
```bash
sed 's|root |Admin:|g' filename
```

<center>
  <div id="gads">
  </div>
</center>

### Regular Expressions

**Remove all digits from output**:
```bash
sed 's/\[0-9\]\[0-9\]//g'
```

**Duplicate Clipped Value**:
```bash
sed 's/root/& &/g'
```

Try executing:
```bash
echo '123abc' | sed 's/\[0-9\]\[0-9\]*/&-&/'
```

The regular expression `[0-9]*` matches 0 or more digits.
The regular expression `\[0-9\]\[0-9\]*` matches 1 or more digits.

If you need to use the first word from a line of text, mark it with an escaped digit:
```bash
sed 's/\([a-z]\*\).\*/\1/'
```

Check this out:
```bash
echo 'abcd qwer zxc 123'| sed 's/\([a-z]\*\).\*/\1/'
```

In order to swap the first and second word - use the following construction:
```bash
sed 's/\([a-z]\*\) \([a-z]\*\)/\2 \1/'
```

The space on the left side of the expression can be replaced by any other delimiter.

For test:

```bash
echo 'abcd qwer zxc 123'| sed -r 's/([a-z]+) ([a-z]+)/\2 \1/'
```

and

```bash
echo 'abcd_qwer_zxc_123'| sed -r 's/([a-z]+)_([a-z]+)/\2**_**\1/'
```

```bash
echo 'abcd_qwer_zxc_123'| sed -r 's/([a-z]+)**_**([a-z]+)/\2 \1/'
```

**Replacing text between two words**
```bash
sed -ure 's/**word1**.+?**word2**/**word1**\ replacement\ **word2**/g' -i file
```

<center>
  <div id="gads">
  </div>
</center>

### Using variables in sed expressions

When writing bash scripts, we use variables. Sometimes it becomes necessary to use these variables in sed expressions.

The easiest approach is to use double quotes for the wrapper:
```bash
sed 's/$var1/$var2/g'
```

Double quotes won't work, there are special characters in `$var1` or `$var2`. Your best bet is to exclude variables from the wrapper:
```bash
sed 's/''$var1''/''$var2''/g'
```