import { Component, OnInit } from '@angular/core';
import {AngularFire, FirebaseListObservable,FirebaseObjectObservable, AuthProviders, AuthMethods} from 'angularfire2';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  title = 'app works!';
  currentTime: any = new Date().toLocaleTimeString();
  noOfCourts = 4;
  // courts :any = [];
  newPlayer :string;
  // players: any = ["Nicholas","Andy","Laura","Marshall","Gary","Adam","Eddie","Keith","Michael","Niall","Mike Lock","Jish","Cookie","Tim","Tom"];
  players: FirebaseListObservable<any[]>;
  playerInstance : any = [];
  waitingList: FirebaseListObservable<any[]>;
  waitingInstance:any = [];
  courts: FirebaseListObservable<any[]>;
  courtsInstance:any= [];
  waitingPlayers: FirebaseListObservable<any[]>;
  init:boolean = false;

  constructor(af: AngularFire) {

    af.auth.subscribe(auth => console.log(auth))

    this.players = af.database.list('/players')
    this.waitingList = af.database.list('/waitngList')
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
          console.log(this.courtsInstance)
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
   this.playerInstance.forEach((player:any)=>{
     this.players.update(player.$key,{waiting:false})
     })
    this.waitingList.remove()
 }

 removePlayer(courtNo:number,player:any){
   if(this.validatePlayer(player)){
      this.waitingList.push(player)
     let i = this.courtsInstance[courtNo].indexOf(player)
     console.log(i)
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
   console.log(this.courtsInstance)
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

}
