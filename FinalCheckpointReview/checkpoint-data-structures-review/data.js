'use strict';
/*
Fill in your own code where you see "your code here".
You can insert new lines at those locations, but you
will not need to edit the lines above and below them.
*/

//-----------------------------------------
// Stacks

function Stack () {
  // your code here
  this.arr = [];
}

Stack.prototype.add = function (item) {
  // your code here
  this.arr.push(item)

  return this; // for chaining, do not edit
};

Stack.prototype.remove = function () {
  if(!this.arr.length) return undefined
    else return this.arr.pop();
    // else return this.arr.slice(this.arr.length-1, this.arr.length)[0]

};

//-----------------------------------------
// Queues

// EXTRA CREDIT: remove the `pending` line in the spec to attempt.

function Queue () {
  // your code here
  this.arr = [];
}

Queue.prototype.add = function (item) {
  // your code here
  this.arr.unshift(item)

  return this; // for chaining, do not edit
};

Queue.prototype.remove = function () {
  // your code here
  if (!this.arr.length) return undefined 
    else return this.arr.pop();
};

//-----------------------------------------
// Linked lists

// EXTRA CREDIT: remove the `pending` line in the spec to attempt.

function LinkedList () {
  this.head = this.tail = null;
}

function ListNode (item, prev, next) {
  this.item = item;
  this.next = next || null;
  this.prev = prev || null;
}

LinkedList.prototype.addToTail = function (item) {
  // your code here

  var newNode = new ListNode(item);

  newNode.prev = this.tail;

   if(!this.head && !this.tail){
    this.tail = newNode;
    this.head = this.tail;
      } else if (this.tail.item && !this.tail.prev) {
        let temp = this.tail;    

        this.tail = newNode;
        this.tail.next = null;
        this.tail.prev = this.head;

        this.head.next = this.tail;

      } else{
        let temp = this.tail;    

        this.tail = newNode;
        this.tail.next = null;
        // this.tail.prev = this.head.next; 

        this.head.next.next = this.tail;       
      }
   
  
  return this; // for chaining, do not edit
};

LinkedList.prototype.removeFromTail = function () {
  // your code here
  let item2remove
  if(this.tail)
   {
    item2remove = this.tail.item
    
 
    if(this.tail.prev){
      let temp = this.tail.prev;
      this.tail = temp;
      this.tail.next = null;
    } else {
      this.tail = null;
      this.head = null;
    }
} else item2remove = undefined;

  return item2remove;

};

LinkedList.prototype.forEach = function (iterator) {
  // your code here
  let val = this.head;

  function runThrough(val){

    if (val) {
      iterator(val.item);
    } else return;

    let newItem = val.next;
    runThrough(newItem)

  }

  return runThrough(val);

};

//-----------------------------------------
// Association lists

function Alist () {
  // your code here
  this.head = null;
}

function AlistNode (key, value, next) {
  this.key = key;
  this.value = value;
  this.next = next;
}

Alist.prototype.set = function (key, value) {
  let newNode = new AlistNode(key, value);

  var key = newNode.key;
  var value = newNode.value;

  if (!this.head){
    this.head = {key: key, value: value, next: null};
  } else {
    let temp2 = this.head;
    this.head = {key: key, value: value, next: temp2}
    // this.head.next = {key: key, value: value, next: null}
  }

    // your code here
  return this; // for chaining; do not edit
};

Alist.prototype.get = function (key) {
  
  var temp = this.head;

  function checkvalue(temp){

    if(!temp) return undefined;

    if(temp.key === key) return temp.value  
      else return checkvalue(temp.next)

  }
  return checkvalue(temp)
  
  // your code here
};


//-----------------------------------------
// Hash tables

function hash (key) {
  var hashedKey = 0;
  for (var i = 0; i < key.length; i++) {
    hashedKey += key.charCodeAt(i);
  }
  return hashedKey % 20;
}

function HashTable () {
  this.buckets = Array(20);

  for(var i=0; i<this.buckets.length; i++){
    this.buckets[i] = new Alist();
  }
  // your code here
}

HashTable.prototype.set = function (key, value) {
  // your code here. DO NOT simply set a prop. on an obj., that is cheating.

  let hashIndex = hash(key);
  let hashAlist = this.buckets[hashIndex]
  hashAlist.set(key, value)
 
  return this; // for chaining, do not edit
};

HashTable.prototype.get = function (key) {
  // your code here. DO NOT simply get a prop. from an obj., that is cheating.

  let hashIndex = hash(key);
  let hashAlist = this.buckets[hashIndex]

  return hashAlist.get(key)
};

//-----------------------------------------
// Binary search trees

function BinarySearchTree (val) {
  // your code here
  this.value = val;
  this.left = null;
  this.right= null;
}

BinarySearchTree.prototype.insert = function (val) {
  // your code here

  if(!this.value) return new BinarySearchTree(val)
    else {
      
      function recursiveFunc(x){


      if(val > x.value){      
          if(!x.right) {
            x.right = new BinarySearchTree(val) }
            else recursiveFunc(x.right)
 
          } 

      else {
            if(!x.left){
              x.left = new BinarySearchTree(val) 
            } else recursiveFunc(x.left)
          }

  }
 
  recursiveFunc(this)

}
  return this; // for chaining, do not edit
};

BinarySearchTree.prototype.min = function () {
  
  function recursiveFunc(x){
    
    if(x.value && !x.left) return x.value
      else return recursiveFunc(x.left)

  }

  return recursiveFunc(this)
};

BinarySearchTree.prototype.max = function () {

  function recursiveFunc(x){
    
    if(x.value && !x.right) return x.value
      else return recursiveFunc(x.right)

  }

  return recursiveFunc(this)

};

BinarySearchTree.prototype.contains = function (val) {

     
  function recursiveFunc(x){

    if (x.value!==val && !x.left & !x.right) return false;
    if (x.value === val) return true;
    if (val > x.value) return recursiveFunc(x.right);
    if (val < x.value) return recursiveFunc(x.left);

  }
 
  return recursiveFunc(this)
};

BinarySearchTree.prototype.traverse = function (iterator) {
  // your code here

  if (this.left)
    this.left.traverse(iterator);

  iterator(this.value);

  if (this.right)
    this.right.traverse(iterator);

};
