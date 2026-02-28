const INITIAL_DATA = {
    tasks: {
            "1": {id: "1", text: "Задача 1"},
            "2": {id: "2", text: "Задача 2"},
            "3": {id: "3", text: "Задача 3"},
        },
    
    columns: {
        "column-1": {
            id: "column-1",
            title: "Список дел",
            taskIds: ["1", "2"],
        },
    
        "column-2": {
            id: "column-2",
            title: "В процессе",
            taskIds: ["3"],
        },
    
        "column-3": {
            id: "column-3",
            title: "Готово",
            taskIds: [],
        }
    },
    
    columnOrder: ["column-1", "column-2", "column-3"]
}

export default INITIAL_DATA