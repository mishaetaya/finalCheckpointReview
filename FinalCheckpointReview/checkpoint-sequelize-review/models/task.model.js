'use strict';
var Bluebird = require('bluebird');

var db = require('./database');
var Sequelize = require('sequelize');

// Make sure you have `postgres` running!

var Task = db.define('Task', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  complete: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  due: Sequelize.DATE
}, {
  //---------VVVV---------  your code below  ---------VVV----------
hooks:{
  beforeDestroy: function(){
      Task.destroy({where:{
        parentId:{
          $gt: 0
        }
      }})
  }
},

getterMethods: {
  timeRemaining: function(){
    var x = new Date();
    if (!this.due) return Infinity;
      else {
        return ( -x.getTime() + this.due.getTime())
        
      } 
  },

  overdue: function(){

    if(this.complete) {var x = this.complete}
      else var x = false

    if(this.timeRemaining < 0 && x) return false;
      else if(this.timeRemaining < 0 && !x) return true;
      else if(this.timeRemaining >0) return false;
  }
},

classMethods:{
  clearCompleted: function(){
    
    return Task.destroy({where:{complete:true}})
    
  },

  completeAll: function(){
   return Task.update({complete: true}, {where: {complete: false}})
  }
},

instanceMethods: {
  addChild: function(obj){
    const childObject = {
      name: obj.name,
      parentId: this.id
    }
    return Task.create(childObject)
  },
  

  getChildren: function(){
    return Task.findAll({where: {parentId: this.id}})
  },

  getSiblings: function(){
    return Task.findAll({
      where:{
        parentId: {
          $gt: 0
        }
      }
    }).then(data => {
      const val2return = [];
      const dataTemp = data;
      data.forEach(item => {
        for(let i=0; i<data.length; i++){

          if(item.name === data[i].name)
            dataTemp.splice(i,1)
        }
      })

      return dataTemp;


    })

  }

}


  //---------^^^---------  your code above  ---------^^^----------
});

Task.belongsTo(Task, {as: 'parent'});





module.exports = Task;

// instanceMethods: {
//   addChild: function(obj){
//     const childObject = {
//       name: obj.name,
//       parentId: this.id
//     }
    
//     if(!this.child) {
//         this.child = [];
//         this.child[0] = childObject;
//     }
//       else this.child.push(childObject)

//   const len = this.child.length    
    
//     this.child.map(function(item){
//       let val = this.child.indexOf(item)
//       let children = this.child
//       item.getSiblings = function(item){ 
//           let temp = []; 
//           for(var i=0; i<len; i++){
//               if(val !== i){
//                 temp.push(children[i]) 
//               }
//           }
//           return Promise.resolve(temp);   

//       } 
    
//     }, this)
     
//     return Promise.resolve(childObject)
//   },
  

//   getChildren: function(){
//     return Promise.resolve(this.child)
//   },

//   getSiblings: function(){
//     return this.child.siblings();
//   }
