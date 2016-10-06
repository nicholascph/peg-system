import { Component, OnInit } from '@angular/core';
import {AngularFire, FirebaseListObservable,FirebaseObjectObservable} from 'angularfire2';
import 'jquery';

declare var $:JQueryStatic;
@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  currentTime: any = new Date().toLocaleTimeString();
  noOfCourts = 4;
  newPlayer :string;
  players: FirebaseListObservable<any[]>;
  playerInstance : any = [];
  waitingList: FirebaseListObservable<any[]>;
  waitingInstance:any = [];
  courts: FirebaseListObservable<any[]>;
  courtsInstance:any= [];
  waitingPlayers: FirebaseListObservable<any[]>;
  init:boolean = false;
  show:boolean = false;
  t: any;

  constructor(af: AngularFire) {
    this.players = af.database.list('/players')
    this.waitingList = af.database.list('/waitingList')
    this.courts = af.database.list('/courts')

    this.players.subscribe((players)=>{
      this.playerInstance = players
      this.playerInstance.sort(
        function(a, b) {
            var x = a.name.toLowerCase();
            var y = b.name.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        }
      )
    })

      this.waitingList.subscribe((waitingPlayers)=>{
        this.waitingInstance = waitingPlayers
        })

      this.courts.subscribe((courts)=>{
        if(!this.init)
          this.initialiseCourts(courts)
          this.courtsInstance = courts[0];
        })
  }


  initialiseCourts(courts){
    let newCourts = [];
      if(courts.length === 0)
      for(let i =0;i<this.noOfCourts;i++){
        newCourts[i] = []

        if(courts[i])
          newCourts[i] = courts[i]
        else
            newCourts[i] = [{name:''},{name:''},{name:''},{name:''}]

          delete newCourts[i]['$key']
          }
          this.courts.push(newCourts)

          this.init = true
  }

  ngOnInit(){
      setInterval(()=>{
        this.currentTime = new Date().toLocaleTimeString()
      },1000)
  }

  refreshCourts(){
    let i=0
    let j=0
    this.players.forEach((name)=>{
        this.courts[i][j] = name
          j++
        if(j % 4 === 0){
            i++
            j = 0
        }
    })
  }

 addNewPlayer(){
   this.newPlayer = this.newPlayer.toLowerCase()
   this.newPlayer = this.newPlayer[0].toUpperCase() + this.newPlayer.substr(1)
   this.players.push({name:this.newPlayer,waiting:false})
   this.newPlayer = ""
 }

 removeAllPlayers(){
   this.waitingInstance.forEach((player:any)=>{
     let key = this.getPlayerKey(player)
     if(key)
     this.players.update(key,{waiting:false})
     })
    this.waitingList.remove()
 }

 removePlayerFromWaitingList(player:any,a2Obj:any){
   let key = a2Obj.getPlayerKey(player)
   let waitingKey = a2Obj.getWaitingPlayerKey(player)

   if(key && waitingKey){
     a2Obj.players.update(key,{waiting:false})
     a2Obj.waitingList.remove(waitingKey)
     if(a2Obj.t)
      clearTimeout(a2Obj.t)
     }
 }

 getPlayerKey(player){
   var key = "";
   this.playerInstance.forEach((players)=>{
     if(player.name == players.name)
        key = players.$key
   })
   return key;
 }

 getWaitingPlayerKey(player){
   var key = "";
   this.waitingInstance.forEach((players:any)=>{
     if(player.name == players.name)
        key = players.$key
   })
   return key;
 }

 removePlayer(courtNo:number,player:any){
   if(this.validatePlayer(player)){
      this.waitingList.push(player)
     let i = this.courtsInstance[courtNo].indexOf(player)
     this.courtsInstance[courtNo][i].name = ''
     this.courts.update(this.courtsInstance.$key,this.courtsInstance)
   }
 }


 moveToCourt(player:any){
   let added = false

   this.courtsInstance.forEach((playersOnCourt)=>{
     playersOnCourt.forEach((playerOnCourt)=>{
       if(added !== true && this.validatePlayer(player)){
         if(playerOnCourt.name == ''){
           playerOnCourt.name = player.name
           added = true
           this.waitingList.remove(player.$key)
           }
         }
       })
   })
    this.courts.update(this.courtsInstance.$key,this.courtsInstance)
 }

 moveToWaitingList(player:any){
   if(this.validatePlayer(player)){
     let x = this.clone(player)

      delete x['$key']
      this.waitingList.push(x)
      this.players.update(player.$key,{waiting:true})
   }
 }

 clone(obj){
   let x = JSON.parse(JSON.stringify(obj))
   return x
 }

 validatePlayer(player:any){
    if(!player)
      return false

   if(player.name !== "" && player.name !== undefined){
     return true
   }else{
     return false
   }
 }

 holdit(player, action){
  var a2Obj = this
  var element: any = $('#' + player.name);
  var hold_time = 1000;
  var t

  element.on('mousedown',()=>{
      a2Obj.show = false
      t = setTimeout(action, hold_time)
  }).on('mouseup mouseleave',()=>{
      clearTimeout(t)
  }).on('click',()=>{
      if(a2Obj.show == false)
        a2Obj.moveToCourt(player)
  })

  }

  ValidateRemovingPlayer(event:any,player:any){
    var a2Obj = this
    this.holdit(player, function () {
      a2Obj.removePlayerFromWaitingList(player,a2Obj)
      a2Obj.show = true
    });
  }


}
