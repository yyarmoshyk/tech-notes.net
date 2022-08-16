---
id: 154
title: Find neighbors of the matrix element at the given position
date: 2022-08-16T00:00:00+00:00
author: admin

permalink: /python-element-neighbor-in-matrix/
categories:
  - Python
tags:
  - matrix
---
I force myself to learn something but before learning something new I need to memorize what I knew before. So I take python labs at [exercism.org](https://exercism.org/).

In one of the labs I had a chllange to find the neighour elements of the matrix element at the given position so I decided to save the solution for further refference.

For example given the matrix:
```
matrix = [
    "123",
    "456",
    "789"
]
```

I need to build the function that takes the the following arguments:
* matrix
* element position (x, y as a separate arguments)

The function should return all the elements arround the specified coordinates.

For example:
* if I specify `x=0`, `y=1` that corrensponds with the "2" the function should return 1,3,4,5,6
* if I specify `x=1`, `y=1` that corrensponds with the "5" the function should return 1,3,4,6,7,8,9

The logics is fairy simple:
* loop over rows in range x-1, x+2
* loop over columns in range y-1, y+2
* row index should be `>0` and `<len(row) `
* column index should be `>0` and `<num(columns)` or `<len(row[0])`
* exclude the element at specified position

```python
def get_neighbors(matrix, x, y):
    num_rows, num_cols = len(matrix), len(matrix[0])
    
    for i in range( (0 if x-1 < 0 else x-1), (num_rows if x+2 > num_rows else x+2), 1  ):
        for j in range( (0 if y-1 < 0 else y-1), (num_cols if y+2 > num_cols else y+2), 1 ):
            if matrix[r][c] != matrix[x][y]:
                print(" • matrix["+str(i)+"]["+str(j)+"] = "+str(matrix[i][j]))
```

This example prints the values but it is possible to build the `list()` with the discovered values.
```python
def get_neighbors(matrix, x, y):
    num_rows, num_cols = len(matrix), len(matrix[0])
    result =[]
    
    for i in range( (0 if x-1 < 0 else x-1), (num_rows if x+2 > num_rows else x+2), 1  ):
        for j in range( (0 if y-1 < 0 else y-1), (num_cols if y+2 > num_cols else y+2), 1 ):
            if matrix[r][c] != matrix[x][y]:
                print(" • matrix["+str(i)+"]["+str(j)+"] = "+str(matrix[i][j]))
                result.append(matrix[i][j])
    return result
```

Another option is to build the `dict()` object using the discovered value as a key and cooridinates as a values.
```python
def get_neighbors(matrix, x, y):
    num_rows, num_cols = len(matrix), len(matrix[0])
    result = dict()
    
    for i in range( (0 if x-1 < 0 else x-1), (num_rows if x+2 > num_rows else x+2), 1  ):
        for j in range( (0 if y-1 < 0 else y-1), (num_cols if y+2 > num_cols else y+2), 1 ):
            if matrix[r][c] != matrix[x][y]:
                print(" • matrix["+str(i)+"]["+str(j)+"] = "+str(matrix[i][j]))
                result[matrix[i][j]] = [i,j]

    return result
```

Or you can do whatever modifications with the original mattrix you'd like to inside this function and return it as a result.