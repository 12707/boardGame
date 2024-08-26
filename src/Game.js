import Board from "./Board"
import './Game.css'
import { useState } from "react"
import { FinishMatchContext } from "./Context"

const Game = () => {
    const [ squares, setSquares ] = useState(Array(9).fill(null))
    const [ isNextX, setIsNextX ] = useState(true)
    const [ endingMsg, setEndingMsg ] = useState('')
    const [ winner, setWinner ] = useState('')
    const [ histories, setHistories ] = useState([])
    const size = 24
    const winnerSize = 5

    const generateWinnerIndexes = (length, winLength) => {
        const result = []
        const totalSize = length * length
        const factors = [1, length, length + 1, length - 1]
        for(let i = 0; i < totalSize; i++) {
            factors.forEach(factor => {
                for(let j = i - (winLength - 1) * factor ; j < (i + winLength * factor); j+=factor ) {
                    if (j < 0 || j >= totalSize || j + factor * (winLength - 1) >= totalSize) {
                        continue
                    }
                    const winnerSquad = Array.from({ length: winLength }, (_, index) => (
                        j + index * factor
                    ))
                    result.push(winnerSquad)
                }
            })
        }
        return result
    }
    
    const winnerIndexes = generateWinnerIndexes(size, winnerSize)

    const handleClick = (i) => {
        if (!endingMsg) {
            const nextSquares = squares.slice()
            if(nextSquares[i]) {
                return 
            }
            if (isNextX) {
                nextSquares[i] = '●'
            } else {
                nextSquares[i] = '○'
            }
            setSquares(nextSquares)
            setIsNextX(!isNextX)
            const winner = calcGobangWinner(i, nextSquares)
            let msg
            if (winner) {
                msg = 'is the Winner!'
                setEndingMsg(msg)
                setWinner(winner)
            }
            setHistories([ ...histories, {
                squares: nextSquares,
                isNextX: !isNextX,
                endingMsg: msg
            } ] )
        }
    }

    const resetHandler = () => {
        setSquares(Array(9).fill(null))
        setIsNextX(true)
        setEndingMsg('')
        setWinner('')
        setHistories([])
    }

    const calcTicTacToeWinner = (i, squares) => {
        const winnerIndexes = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]
        let winner = null
        const length  = squares.filter(square => square === null).length
        if (length === 0) {
            setEndingMsg(`This is a tie match!`)
        }
        winnerIndexes.forEach(indexes => {
            if (squares[i] && squares[indexes[0]] === squares[i] && squares[indexes[1]] === squares[i] && squares[indexes[2]] === squares[i]) {
                winner = squares[i]
            }
        })
        return winner
    }

    const calcGobangWinner = (i, squares) => {
        let winner = null
        const length  = squares.filter(square => square === null).length
        if (length === 0) {
            setEndingMsg(`This is a tie match!`)
        }
        winnerIndexes.filter(winnerIndex => winnerIndex.includes(i)).forEach(wIndex => {
            let isAllEqual = true
            wIndex.forEach(index => {
                if (squares[i] !== squares[index]) {
                    isAllEqual = false
                }
            })
            if (isAllEqual) {
                winner = squares[i]
            }
        })
        return winner
    }

    const factorial = (n) => {
        if (typeof n !== 'number') {
            throw new Error('Please input a number!')
        }
        if (n <= 0) {
            throw new Error('Please input a positive integer!')
        } 
        if (n === 1) return 1
        const m = Math.floor(n)
        return m * factorial(m - 1)
    }

    const gotoStep = (step) => {
        setSquares(histories[step - 1]?.squares)
        setEndingMsg(histories[step - 1]?.endingMsg)
        setIsNextX(histories[step - 1]?.isNextX)
        setHistories(histories.slice(0, step))
    }

    const getHistories = () => {
        const result = histories.map((history, i) => {
            return (
                <li key={'a'+i}>
                    <button className={i%2===0?'blackStep':'whiteStep'} onClick={() => gotoStep(i+1)}>{i%2===0?'黑棋':'白棋'}第{Math.floor(i/2) + 1}步 </button>
                </li>
            )
        })
        return (
            <ul>
                {result}
            </ul>
        )
    }

    return (
        <FinishMatchContext.Provider value={!!endingMsg}>
            <div className='game'>
                { endingMsg && 
                    (
                        <>
                            <div className='game-msg'>
                                <span>
                                    {winner} 
                                </span>
                                <span style={{ color: 'red' }}>
                                    {endingMsg} 
                                </span>
                                <button className='game-reset' onClick={resetHandler}>Reset</button>
                            </div>
                            <hr/>
                        </>
                    ) 
                }
                <Board length={size} squares={squares} handleClick={handleClick} />
            </div>
            <div className='history'>
                {
                    getHistories()
                }
            </div>
        </FinishMatchContext.Provider>
    )
}

export default Game