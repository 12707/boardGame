
import './Square.css'
import { useContext } from 'react'
import { FinishMatchContext } from "./Context"

export default function Square({ value, onSquareHandler }) {
    const isFinishMatch = useContext(FinishMatchContext)
    return <button disabled={isFinishMatch} style={{ cursor: isFinishMatch ? '' : 'crosshair' }} className='Square' onClick={onSquareHandler}>{value}</button>
}