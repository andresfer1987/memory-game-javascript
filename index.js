const btnStart = document.getElementById('btnStart');
const brown = document.getElementById('brown');
const violet = document.getElementById('violet');
const gold = document.getElementById('gold');
const fuchsia = document.getElementById('fuchsia');
const timeToAnswer = document.getElementById('timeToAnswer');
let time = document.getElementById('time');
const lastLevel =5;

const startGame = () => {
    window.game = new Game();    
    timeToAnswer.classList.add('timeToAnswerAnimation');
}

class Clock {
    constructor(element){
        this.seconds = 0;
        this.minutes = 0;
        this.hours = 0;
        this.renderElement = element
    }
    render(element){
        element.innerHTML = `${this.minutes.toString().padStart(2,'0')}:${this.seconds.toString().padStart(2,'0')}`
    }
    start(listeners = []) {
        this.started = setInterval(() => {
            this.seconds ++;
            this.render(this.renderElement);
            this.seconds === 60 && this.addMinute();
            this.minutes === 60 && this.addHour();     
            listeners.map(listener => listener());               
        }, 1000)    
    }
    addMinute(){
        this.seconds = 0;
        this.minutes ++;
        this.render(this.renderElement);
    }
    addHour(){
        this.minutes = 0;
        this.hours ++;
        this.render(this.renderElement);
    }
    stop(){
        clearInterval(this.started);
    }
    reset(){
        this.seconds = 0;
        this.minutes = 0;
        this.hours = 0;
        this.render(this.renderElement);
    }
}


class Game {
    constructor(){
        this.timeToAnswer = 5; 
        this.level =1;  
        this.activateTime= false;
        this.clock =new Clock(time);
        this.timeToAnswerListener = this.timeToAnswerListener.bind(this)
        this.initializeGame();
        this.initializeSecuence();        
        setTimeout(this.nextLevel,500)           
    }
    timeToAnswerListener(){
        if (this.activateTime) {
            this.timeToAnswer--    
            timeToAnswer.innerHTML=this.timeToAnswer; 
            } 

            this.timeToAnswer === 0 && this.lose('Se te acabo el tiempo!!!!')
              
    }
    initializeGame() {  
        this.clock.start([this.timeToAnswerListener]);      
        this.colors = {
            brown,
            violet,
            gold,
            fuchsia
        }       
        this.selectColor = this.selectColor.bind(this);  
        this.nextLevel= this.nextLevel.bind(this);
        this.toggleBtnEmpezar()   
          
    }

    toggleBtnEmpezar() {
        if(btnStart.classList.contains('hide')){
            btnStart.classList.remove('hide')
        }
        else{
            btnStart.classList.add('hide');
        }
    }
    nextLevel(){
        this.subnivel= 0;
        this.iluminateSecuence();
        this.addClicksEvents();
    }
    activateTimeToAnswer(){
        this.activateTime = true;
        timeToAnswer.classList.add('timeToAnswerAnimation')
    }

    initializeSecuence(){
        this.secuence = new Array(lastLevel).fill(0).map(x => Math.floor(Math.random() * 4));
    }
    iluminateSecuence() {
        for(let i = 0; i< this.level;i++){
         const color =this.numberToColor(this.secuence[i])
         setTimeout(() => {
             this.iluminateColor(color)
             this.level - i === 1  && this.activateTimeToAnswer();            
            },1000 * i);
        
        }
    }
    iluminateColor(color){
        this.colors[color].classList.add('ligth')
        setTimeout(() => this.colors[color].classList.remove('ligth'),350)
    }
    numberToColor(num){
        switch(num){
            case 0:
                return 'brown';
            case 1:
                return 'violet';
            case 2:
                return 'gold';
            case 3:
                return 'fuchsia';
        }
    }
    colorToNumber(color){
        switch(color){
            case 'brown':
                return 0;
            case 'violet':
                return 1;
            case 'gold':
                return 2;
            case 'fuchsia':
                return 3;
        }
    }
    addClicksEvents(){
        this.colors.brown.addEventListener('click',this.selectColor)
        this.colors.violet.addEventListener('click',this.selectColor)
        this.colors.gold.addEventListener('click',this.selectColor)
        this.colors.fuchsia.addEventListener('click',this.selectColor)
    }
    deleteClicksEvents(){
        this.colors.brown.removeEventListener('click',this.selectColor )
        this.colors.violet.removeEventListener('click',this.selectColor) 
        this.colors.gold.removeEventListener('click',this.selectColor)
        this.colors.fuchsia.removeEventListener('click',this.selectColor)
    }
    selectColor(ev){
        const selectedColor = ev.target.dataset.color;
        const numberColor = this.colorToNumber(selectedColor);
        this.iluminateColor(selectedColor);
        if(numberColor === this.secuence[this.subnivel]){
            this.subnivel++;
           
            if(this.subnivel === this.level){
                this.level++;
                this.deleteClicksEvents();
                this.timeToAnswer = 5;
                timeToAnswer.innerHTML=this.timeToAnswer; 
                timeToAnswer.classList.remove('timeToAnswerAnimation');
                this.activateTime = false;
                if (this.level === (lastLevel + 1)){
                    this.win();
                }
                else{
                    setTimeout(this.nextLevel,1500);
                }
            }
        }
        else {
            this.lose('Has perdido la partida');
        }
    }
    win(){        
        this.stopGame();  
        swal('Game','Felicitaciones, Has Ganado la partida', 'success').
        then(() =>{
            this.finalizeGame()
        })
    }
    lose(message){  
        this.stopGame();      
        swal('Game',message,'error')
        .then(() => {
            this.deleteClicksEvents()
            this.finalizeGame()            
        })
    }
    stopGame(){      
        this.clock.stop()        
        timeToAnswer.classList.remove('timeToAnswerAnimation');
    }
    finalizeGame(){
        this.clock.reset()
        this.timeToAnswer = 5   
        timeToAnswer.innerHTML=this.timeToAnswer;
        this.toggleBtnEmpezar();
    }     
}