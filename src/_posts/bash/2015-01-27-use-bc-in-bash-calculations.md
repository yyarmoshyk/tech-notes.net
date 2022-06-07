---
id: 2321
title: Doing match calculations in BASH with bc
date: 2015-01-27T16:05:40+00:00
author: "Yaroslav Yarmoshyk"

guid: http://www.tech-notes.net/?p=2321
permalink: /use-bc-in-bash-calculations/
image: /wp-content/uploads/2014/10/shellshocker.png
categories:
  - bash
tags:
  - bash
  - using bc
  - bc match
---
`bc` is a tool that allows to do inline calculations in bash cli.
Eventually `bc` can't be used for complicated calculations.

The primary advantage of `bc` is float support. In bash, you can do the usual operations (addition, subtraction, division, and multiplication) on integers but bc is indispensable when it comes to decimals.

Next you can find a number of examples of `bc` usage:

### Basic operations with bc
```bash
bc <<< 3-2  
bc <<< 5*2  
bc <<< 9/3
```
of cource you can use it with echo and pipe `echo ... |bc`:
```bash
echo '3*2' |bc  
echo '3-2' |bc  
echo '3*2' |bc  
echo '3/2' |bc
```
`bc`  respects the precedence of mathematical operations. Check this out:
```bash
echo '2 + 2 * 2' |bc
```

### Rounding result
In the case of the division operation from the example `bc` will return 1. In order to show the numbers after the decimal point, you need to specify how many of them you need using `scale` (default = 0):
```bash
echo 'scale=1;3/2' |bc
```

### You can use the file with the set of match operations
```bash
bc < FileName
```

### Using result of last operation
```bash
echo '2 + 2;last * 2' |bc
```

You can use dot (.) instead of `last`

```bash
echo '2 + 2;. * 2' |bc
```

**Getting the square root and exponentiation**  
`sqrt` returns square root. You can use scale for floats `scale`
```bash
echo 'sqrt(16)' | bc
```
It is rather strange that a tool written in C does not have the use of `sqr`.

**Exponentiation example**
```bash
echo '4^2' | bc
```

### Trigonometric functions
I doubt that someone will use the cosine value or the natural logarithm of a number in scripts, but still:
   * **s (x)** Sine **x**. **x** is given in radians.
   * **c (x)** Cosine **x**. **x** is given in radians.
   * **l (x)** Natural logarithm of x

### Cerate variables from bc outputs
```bash
var1=$(echo 'sqrt(16)' | bc)
```

```bash
var2=$(bc <<< "2 + 2 * 2")
```

```bash
echo $var1 + $var2 |bc
```

In [this article]("/mysql-database-size/") `bc` is used to determine the size of the MySQL databases.

## External links:
* [mylinuxbook.com]("http://mylinuxbook.com/linux-command-line-calculator-bc-examples/")
* [basicallytech.com]("http://www.basicallytech.com/blog/?/archives/23-command-line-calculations-using-bc.html")
