---
title: "Cheatsheet for Groovy to be used in Jenkins pipelines"
excerpt: "Cheatsheet for Groovy to be used in Jenkins pipelines"
last_modified_at: 2022-07-15T00:00:00-00:00
toc: false
categories:
  - Jenkins
tags:
  - groovy pipelines
---
Groovy is an object-oriented programming language used for JVM platform. This dynamic language has a lot of features like processing lists and arrays, loops and parralel execution. It is very usefull when you are working with Jenkins to automate your CI/CD pipelines.

I will not go deap into details. Obviously you are looking for some examples here.

## Variables definition
Define global variable for your pipeline script:
```groovy
foo = "bar"
```
Define local variable for the current scope (stage, step, script)
```groovy
def qwe = "rty"
```

Define environment variables
```groovy
env.AWS_DEFAULT_REGION = "us-west-1"
```
another option is to use environment block:
```groovy
environmnt {
    AWS_DEFAULT_REGION = "us-west-1"
    profile = "dev"
}
```

## Modify the value of the variable
Let's consider the following example:
```groovy
def myvar = "my-custom-value"
```
replace all `-` with `+`. The following will result into `my+custom+value`
```groovy
myvar.replaceAll("-", "+")
```

## Split value
In order to split the string we have the following options:
* tokenize() returns a list, will ignore empty string
* split() returns multiple strings

```groovy
myvar.split("-")
```

Will result into the following:
```bash
my
custom
value
```

```groovy
myvar.tokenize("-")
```

Will result into the following:
```bash
['my', 'custom', 'value']
```

## Collections
Let's create a list value from myvar string:
```groovy
def myList = myvar.tokenize("-")
```

Check if the list in not empty:
```groovy
if(myList) { 
    ... do something ...
}
```

get the size of array:
```groovy
myList.size()
```
Access elements in array
```groovy
myList[0] // first element
myList[1,2,-1] //second, third and first element
```

loop over array and check if one array contains elements from other array
```groovy
// define new array
newList = ['my', 'list' ]

// loop over new array
newList.each { 
    // check if element exists in first array
    if myList.contains(it) {
        // do something
    }
}

// If you need indexes
newList.eachWithIndex{ 
    element, index -> assert myList[index] == element 
}
```

More [operations with collections](https://www.tutorialspoint.com/groovy/groovy_lists.htm)

## Searching over array
* `find()` - returns the first appearance of a search request. Returns `Str`
* `findAll()` - returns all appearances of a search request. Returns `List`

```groovy
myList.findAll("my")
```

in case of numeric search:
```groovy
def intArray = ["1", "2", "3", "4"]
intArray.findAll { it > "2" } // returns ["3", "4"]
```

add element to array:
```groovy
def intArray = ["1", "2", "3", "4"]
intArray.add("5")
```

[List methods](http://docs.groovy-lang.org/next/html/documentation/working-with-collections.html#Collections-Lists) available in Groovy are another benefit.
* `Add()` Append the new value to the end of this list.
* `Get()` Returns the element at the specified position in this list.
* `Contains()` Returns true if this list contains the specified value.
* `Minus()` Create a new list of original elements that removes the specified element
* `Plus()` Create a new list of the original list elements and the specified elements.
* `Pop()` Remove the last item from this list
* `Remove()` Remove elements from the specified position in the list
* `Reverse()` Create a new list that is the opposite of the original list's elements
* `Size()` Get the number of elements in this list.
* `Sort()` Returns a sorted copy of the original list

## Working with maps
```groovy
def myMap = [
    "name": "Elon Mask",
    "gender": "male",
    "occupation": "business magnate"
]
if(!myMap.car) { 
    println "Returns true true if cat key is in the list, otherwise return false" 
}
```

another example with  bit more nested map:
```grovy
def myMap = [
    "a": [
        "id": "1",
        "name": "foo"
    ],
    "b": [
        "id": "2",
        "name": "bar"
    ],
    "c": [
        "id": "3",
        "name": "foo"
    ]
]
```
Find first appearance of name==foo.
'?' ensures that the following argument won't be executed if the result is null
```groovy
myMap.find { it.value.name == "foo" }?.key //returns "a"
```

Find all appearances of name==foo, list and grabs only specific components of nested elements, list
```groovy
myMap.findAll { it.value.name == "foo" }.collect { it.value.id} //returns ["1", "3"]
```

Access map elements
```groovy
myMap.a.id //returns "1"
myMap["a"]["id"] //returns "1"
```

[Map methods](http://docs.groovy-lang.org/next/html/documentation/working-with-collections.html#Collections-Lists) available in Groovy are another benefit.
* `containsKey()` Does this Map contain this key. [Example](https://www.tutorialspoint.com/groovy/groovy_containskey.htm#) 
* `get()`  Look up the key in this Map and return the corresponding value. If there is no entry in this Map for the key, then return null.
* `keySet()` Obtain a Set of the keys in this Map [Example](https://www.tutorialspoint.com/groovy/groovy_keyset.htm)
* `put()` Associates the specified value with the specified key in this Map. [Example](https://www.tutorialspoint.com/groovy/groovy_put.htm)
* `size()` Returns the number of key-value mappings in this Map.
* `values()` Returns a collection view of the values contained in this Map. [Example](https://www.tutorialspoint.com/groovy/groovy_values.htm)

## Conditions
### Switch/case is faster and are much easier to read
```groovy
weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
]

weekDays.each { day ->
    switch(day) {
        case "Monday": // if no break, will execute the next action
        case "Tuesday":
        case "Wednesday":
            println "${day} is just another business day"
            break // 'break' breaks the loop, no other action will be executed
        case "Friday":
            println "TGIF!"
            break
        case "Thursday":
            println "On ${day} we praise Thor"
            break
        case "Saturday":
        case "Sunday":
            println "It's ${day} :)"
        default: // default condition, when other didn't match
            break
    }
}
```
### If statements

## Variables with shell execution
```groovy
def myVar = "Im with Groovy"

sh """
    myVar="Im with Shell"

    # this one is groovy
    echo ${myVar}

    # but this one is shell
    echo \${myVar}
"""
```

Create groovy variable from shell output
```groovy
def myWhoAmI = sh(script: "whoami", returnStdout: true).toString().trim()
```
`trim()` will remove empty space at the end.
`toString()` will convert the output to the str type

Read file and save it into variable
```groovy
def varFromFile = readFile 'filename.txt'
echo "The contexts of the file is ${varFromFile}"
```

Another trick is to capture the status of the sh command and do something is status is not error:
```groovy
def commandStatus = sh(script: "whoami 2>&1> whoami.txt", returnStatus:true).toString().trim()
if (commandStatus == 0) {
    myWhoAmI = readFile 'whoami.txt'
} else { 
    println('Something went wrong')
}
```

## Exiting pipeline
If something goes wrong in your pipeline than obviously you'd like to make it stop at that point and change the job status. The best way to do this is is the following:
```groovy
   currentBuild.result = 'UNSTABLE'
   return
```

`currentBuild.result` is the system variable that can be defined in the pipeline. Possible values are "SUCCESS", "UNSTABLE", "FAILURE", "NOT_BUILT", "ABORTED". May be null for an ongoing build.

It can be used in exception handling:
```groovy
try {
    stage {
        ....
    }
} catch (e) {
    if (something) {
        currentBuild.result = 'SUCCESS'
        return
    } elif (something) {
        currentBuild.result = 'UNSTABLE'
        return
    } elif (something) {
        currentBuild.result = 'NOT_BUILT'
        return
    }
}
```

Alternatively you can interrupt pipeline execution inside the stage if something is not working. For example:
```groovy
stage('Stage1'){
    ...
    if ( somevar == false ) {
        currentBuild.result = 'ABORTED'
        return
    }
}
```

## Parsing XML
The Groovy `XmlParser class` employs a simple model for parsing an XML document into a tree of `Node instances`.
Lets' consider we have an xml like the following `Movies.xml`:
```xml
<collection shelf = "New Arrivals"> 
   <movie title = "Enemy Behind"> 
      <type>War, Thriller</type> 
      <format>DVD</format> 
      <year>2003</year> 
      <rating>PG</rating> 
      <stars>10</stars> 
      <description>Talk about a US-Japan war</description> 
   </movie> 
   <movie title = "Transformers"> 
      <type>Anime, Science Fiction</type>
      <format>DVD</format> 
      <year>1989</year> 
      <rating>R</rating> 
      <stars>8</stars> 
      <description>A schientific fiction</description> 
   </movie> 
</collection> 
```

```groovy
import groovy.xml.MarkupBuilder 
import groovy.util.*

def parser = new XmlParser()
def doc = parser.parse("Movies.xml");

doc.movie.each{
    bk->
    print("Movie Name:")
    println "${bk['@title']}"
    
    print("Movie Type:")
    println "${bk.type[0].text()}"
    
    print("Movie Format:")
    println "${bk.format[0].text()}"
}
```

Another flow is to loop over all keys and values inside xml file using `XmlSlurper`:
```groovy
doc = new XmlSlurper().parse("Movies.xml")
doc.collection.each { item ->
  println "item index: ${item.@indexNum}"
  item.children().each { tag ->
    println "  ${tag.name()}: ${tag.text()}"
  }
}
```
## Parsing Json
```groovy
import groovy.json.JsonSlurper 

def jsonSlurper = new JsonSlurper()
def object = jsonSlurper.parseText('{ "name": "John", "ID" : "1"}') 

println(object.name);
println(object.ID);
```

Loop over all key/values in the given json file
```groovy
def jsonFile = parse(new File('filename.json'))
def jsonObject = new groovy.json.JsonSlurper().jsonFile
jsonObject.each { key, value ->
  println "$key : $value"
}
```

## Templating
Groovy’s template engine is very similar to bas `envsubst`. 
### SimpleTemplateEngine()
Let's assume we have the following `Student.template` file:
```xml
<Student> 
   <name>${name}</name> 
   <ID>${id}</ID> 
   <subject>${subject}</subject> 
</Student>
```

The following will update the variables with the give values
```groovy
import groovy.text.* 
import java.io.* 

def file = new File("D:/Student.template") 
def binding = [
    'name' : 'Joe', 
    'id' : 1, 
    'subject' : 'Physics'
]
				  
def engine = new SimpleTemplateEngine() 
def template = engine.createTemplate(file) 
def writable = template.make(binding) 

println writable
```

### StreamingTemplateEngine()
The StreamingTemplateEngine engine is another templating engine available in Groovy. This is kind of equivalent to the SimpleTemplateEngine, but creates the template using writeable closures making it more scalable for large templates.
```groovy
def text = '''This Tutorial is <% out.print TutorialName %> The Topic name 

is ${TopicName}''' 
def template = new groovy.text.StreamingTemplateEngine().createTemplate(text)
  
def binding = [
    TutorialName : "Groovy", 
    TopicName  : "Templates",
    ]

String response = template.make(binding) 
println(response)
```

### XmlTemplateEngine()
The XmlTemplateEngine is used in templating scenarios where both the template source and the expected output are intended to be XML.
```groovy
def binding = [StudentName: 'Joe', id: 1, subject: 'Physics'] 
def engine = new groovy.text.XmlTemplateEngine() 

def text = '''\
   <document xmlns:gsp='http://groovy.codehaus.org/2005/gsp'>
      <Student>
         <name>${StudentName}</name>
         <ID>${id}</ID>
         <subject>${subject}</subject>
      </Student>
   </document> 
''' 

def template = engine.createTemplate(text).make(binding) 
println template.toString()
```

### Exteral links:
* [Switch cheat-sheet](https://www.tutorialspoint.com/groovy/groovy_switch_statement.htm)
* [https://www.tothenew.com/blog/groovy-tokenize-vs-split/](https://www.tothenew.com/blog/groovy-tokenize-vs-split/)
* [Working with collections in Groovy](http://docs.groovy-lang.org/next/html/documentation/working-with-collections.html)
* [Groovy - XML](https://www.tutorialspoint.com/groovy/groovy_xml.htm)