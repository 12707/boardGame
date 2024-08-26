import Square from "./Square"
import './Board.css'

const Board = ({ length, squares, handleClick }) => {
    const list = Array.from({ length }, (row, rowIndex) => (
        <div className='board-row' key={'row'+rowIndex}>
            {
                Array.from({ length }, (col, colIndex) => (
                    <Square value={squares[colIndex + rowIndex * length]} onSquareHandler={() => handleClick(colIndex + rowIndex * length)} key={'col'+(colIndex + rowIndex * length)}/>
                ))
            }
        </div>
    ))

    return (
        <>
            {list}
        </>
    )
}

export default Board