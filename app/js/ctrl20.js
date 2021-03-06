'use strict';

var PLAY_SOUND = true,
    SOUND_PATH = 'snd/chiken1.mp3';

var Time = new function(){
  this.now = function(){
    return moment().format(this.MASK_HHMM);
  },

  this.relativeTime=function(fecha1){
    return moment().diff(fecha1, 'm');
  },

  this.subtractMins=function(hhmm, mins){
    return moment(hhmm, 'hh:mm').subtract(mins,'m').format(Time.MASK_HHMM);
  },

  this.addMinutes=function(mins){
    return moment().add(mins, 'm');
  }
}
Time.MASK_HHMM = 'HH:mm';

var SoundManager = new function(){
  soundManager.setup({
    preferFlash: false,
    onready: function() {
     soundManager.createSound({ id:'beep', url: SOUND_PATH });
    },
    ontimeout: function() { }
  });

  this.playBeep = function(){
    soundManager.play('beep');
  },

  this.playSound = function(sound_id){
    soundManager.play(sound_id)
  }
}

function animate(id, animation) {
  $('#'+id).addClass(animation);
  setTimeout(function(){ $('#'+id).removeClass(animation)}, 12000);
}

function Elem(min, acc, img){
  this.min = min;
  this.acc = acc;
  this.img = img;
  this.at = arguments[3];
}
  
var Beer = new function(){
  var time_start = null,
      thread = null,
      intsCoccion = [],
      intervals = [];

  function loadData(){
    intsCoccion = [
     new Elem(0,'Cascade', 'lupulo.png'),
     new Elem(15,'Hallertauer 9 GR','lupulo.png'),
     new Elem(40,'Hallertauer 10 GR', 'lupulo.png'),
     new Elem(60,'Hallertauer 11 GR', 'lupulo.png'),
     new Elem(75,'Apagar y Whirpool','wirpool.png')
    ];
  }

  function runTask(){
    time_start = moment();
    thread = setInterval(taskThread1, 2000);
  }

  function taskThread1(){
    var dat = Time.now(), ind = null;
    //console.log(dat);
    if (((ind = intervals.indexOf(dat)) > -1) && (!intsCoccion[ind].completed)){
      intsCoccion[ind].completed = true;
      console.log(intsCoccion[ind].acc);
      if (PLAY_SOUND){
        SoundManager.playBeep();
        animate('acc'+ind,'aniTada');
      }
    }
  }

  function addCustomItem(min, acc, img){
    var hh_cla = null, mm_cla = null;
    hh_cla = Time.subtractMins(intervals[intervals.length-1], min);
    mm_cla = intsCoccion[intsCoccion.length-1].min - min;
    intsCoccion.push(new Elem(mm_cla, acc, img, hh_cla));
    intsCoccion = Lazy(intsCoccion).sortBy(function(ob){ return ob.min; }).toArray();
  }

  this.start_macerado=function(){},

  this.start_coccion=function(){
    if ((localStorage.getItem("intervals"))&&(localStorage.getItem("intsCoccion"))){
      intervals = JSON.parse(localStorage.getItem('intervals'));
      intsCoccion = JSON.parse(localStorage.getItem('intsCoccion'));
    }
    else{
      loadData();
      Lazy(intsCoccion).each(function(ob){
        ob.at = Time.addMinutes(ob.min).format(Time.MASK_HHMM);
        intervals.push(ob.at);
      });

      addCustomItem(34,'Herbir Agua Levadura 250 cm3' , 'water.png');
      addCustomItem(20,'Preparar Levadura 30 C°', 'levadura.png');
      addCustomItem(15,'Irish Mosh 5 GR', 'irish_moss.png');

      intervals = Lazy(intsCoccion).map(function(x) { return x.at; }).toArray();

      localStorage.setItem("intervals", JSON.stringify(intervals));
      localStorage.setItem("intsCoccion", JSON.stringify(intsCoccion));

    }

    runTask();
  },

  this.getData=function(){
    return intsCoccion;
  }

  this.stop_task=function(){
    clearInterval(this.thread);
    time_start = null;
  }
}
