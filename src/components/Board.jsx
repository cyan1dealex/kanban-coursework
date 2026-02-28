import { useContext, useEffect, useRef, useState } from 'react'
import Column from './Column'
import {  DndContext, DragOverlay, pointerWithin} from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import TaskCardOverlay from './TaskCardOverlay';
import ColumnOverlay from './ColumnOverlay';
import { BoardContext } from '../context/BoardContext';

const Board = () => {
    const { 
        board, 
        handleDragStart, 
        handleDragOver, 
        handleDragEnd,
        isAddingColumn,
        setIsAddingColumn,
        newTitle,
        setNewTitle,
        addColumn,
        activeColumn,
        activeTask,
        inputRef

    } = useContext(BoardContext)

    return (
        <>
            <DndContext  collisionDetection={pointerWithin} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
                <div className="board">
                    <SortableContext items={board.columnOrder} strategy={horizontalListSortingStrategy}>
                        {board.columnOrder.map((columnId) => {
                            const column = board.columns[columnId]
                            const tasks = column.taskIds.map((taskId) => board.tasks[taskId]).filter(Boolean)

                            return (
                                <Column 
                                    id={column.id}
                                    key={column.id}
                                    title={column.title} 
                                    tasks={tasks}/>
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
                                    if (e.key === 'Enter') {addColumn()} 
                                    if (e.key === 'Escape') {setIsAddingColumn(false); setNewTitle("")}
                                }}
                            />
                            <button onClick={addColumn}>Добавить </button>
                        </div>
                    ) : (
                        <button className="board__addColumnButton" onClick={() => setIsAddingColumn(true)}>+ Добавить колонку</button>
                    )}
                </div>
                <DragOverlay dropAnimation={null}>
                    {activeTask ? (
                    <TaskCardOverlay task={board.tasks[activeTask]} />
                    ) : null}
                    {activeColumn ? (
                        <ColumnOverlay column={activeColumn} tasks={activeColumn.taskIds?.map(id => board.tasks[id]).filter(Boolean) || []}/>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </>
    )
}

export default Board