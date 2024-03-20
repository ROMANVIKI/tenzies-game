import { useEffect, useState } from "react"
import Die from "./components/Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"
import { useStopwatch } from "react-timer-hook"


export default function App() {


    const {
        totalSeconds,
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        reset,
      } = useStopwatch({ autoStart: true });


    

    const [dice, setDice] = useState(allNewDice())
    const [tenzies, setTenzies] = useState(false)
    const [rolls, setNoRolls] = useState(0)
    const [bestTime, setBestTime] = useState({time:0});
    const prevBestTime = localStorage.getItem('best-time')
    let intOfTime = parseInt(prevBestTime)
    
   
    // localStorage.setItem('best-time', 50)
    
    useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value == firstValue)
        if (allHeld && allSameValue){
            
            let totalSecondsTaken = totalSeconds
            console.log(`log from the totalseconds taken variable - ${totalSecondsTaken}`)
            setBestTime(prevNum => totalSecondsTaken)
            
            setTenzies(true) 

            setTimeout(() => {
                resetGame(); // Call your resetGame function here
               
              }, 5000);
            
        }
    }, [dice])

    useEffect(()=> {
        console.log(`log from the useState - ${bestTime}`)
        
        if(intOfTime > bestTime){
            localStorage.setItem('best-time', bestTime)            
        }
    }, [bestTime])

    function allNewDice() {
        // if (intOfTime === null || isNaN(intOfTime) || intOfTime === undefined){
        //     localStorage.setItem('best-time', 100)
        // }
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateDie())
        }
        

        return newDice
    }

    function generateDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }

    

    function rollDice() {
        
        if(!tenzies){
            setNoRolls(rolls => rolls+=1)
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? die : generateDie()
            }))
        }else{
            setTenzies(false)
            setDice(allNewDice())
        }

    }

   

    function resetGame(){
        reset()
        setNoRolls(0)
        setTenzies(false)
        setDice(allNewDice())
    }


    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id == id ?
                {
                    ...die, isHeld: !die.isHeld
                } : die
        }))
    }

    const diceElements = dice.map(die => (
        <Die
            key={die.id}
            value={die.value}
            isHeld={die.isHeld}
            holdDice={() => holdDice(die.id)}
        />
    ))

 

    return (
        <>
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <div className="btns">
                
            <button className="roll-dice" onClick={rollDice}>
            {tenzies ? "New Game": "ROLL"}
            </button>
            <button onClick={resetGame}  className="roll-dice" style={{backgroundColor: 'red'}}>RESET</button>
            </div>

        <div className="player-stats">
                <h3 className="player-stats-h3">Timer <br /><span>{minutes}:{seconds}</span></h3>
                
                <h3 className="player-stats-h3">No.Rolls <br /><span>{rolls}</span></h3>
                
                <h3 className="player-stats-h3">Best Time <br /><span>{intOfTime}</span></h3>

           
         </div>
            
        </main>

        </>
    )
}