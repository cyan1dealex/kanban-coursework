import { useContext, useEffect, useRef, useState } from 'react'
import Column from './Column'
import {  DndContext, DragOverlay, pointerWithin} from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import TaskCardOverlay from './TaskCardOverlay';
import ColumnOverlay from './ColumnOverlay';
import { BoardContext } from '../context/BoardContext';
import { useParams } from 'react-router-dom';
import useBoardDnd from '../hooks/useBoardDnd';

const Board = () => {
    const { boardId } = useParams()
    
    const { 
        boards,
        setBoards,
        isAddingColumn,
        setIsAddingColumn,
        newTitle,
        setNewTitle,
        addColumn,
        inputRef
    } = useContext(BoardContext)
    
    const { 
        activeTask, 
        setActiveTask, 
        activeColumn, 
        setActiveColumn, 
        handleDragStart, 
        handleDragOver, 
        handleDragEnd 
    } = useBoardDnd(boardId, boards, setBoards)
    
    const handleSubmit = () => {
        addColumn(boardId)
        setIsAddingColumn(false)
    }

    const currentBoard = boards.boards[boardId]

    return (
        <>
            <DndContext  collisionDetection={pointerWithin} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
                <div className="board">
                    <SortableContext items={currentBoard.columnOrder} strategy={horizontalListSortingStrategy}>
                        {currentBoard.columnOrder.map((columnId) => {
                            const column = currentBoard.columns[columnId]
                            const tasks = column.taskIds.map((taskId) => currentBoard.tasks[taskId]).filter(Boolean)

                            return (
                                <Column
                                    boardId={boardId} 
                                    id={column.id}
                                    key={column.id}
                                    title={column.title} 
                                    tasks={tasks}
                                />
                            )
                        })}
                    </SortableContext>
                    
                    {isAddingColumn ? (
                        <div className="board__addColumn">
                            <input 
                                type="text" 
                                placeholder="Название колонки"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                ref={inputRef}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {handleSubmit} 
                                    if (e.key === 'Escape') {setIsAddingColumn(false); setNewTitle("")}
                                }}
                            />
                            <button onClick={handleSubmit}>Добавить </button>
                        </div>
                    ) : (
                        <button className="board__addColumnButton" onClick={() => setIsAddingColumn(true)}>+ Добавить колонку</button>
                    )}
                </div>
                <DragOverlay dropAnimation={null}>
                    {activeTask ? (
                    <TaskCardOverlay task={currentBoard.tasks[activeTask]} />
                    ) : null}
                    {activeColumn ? (
                        <ColumnOverlay column={activeColumn} tasks={activeColumn.taskIds?.map(id => currentBoard.tasks[id]).filter(Boolean) || []}/>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </>
    )
}

export default Board