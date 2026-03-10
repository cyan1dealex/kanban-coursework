const INITIAL_DATA = {
    boards: {
        "board-1": {
            title: "board-1",

            tasks: {
                "1": {id: "1", text: "Доска №1: Задача 1"},
                "2": {id: "2", text: "Доска №1: Задача 2"},
                "3": {id: "3", text: "Доска №1: Задача 3"},
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
        },

        "board-2": {
            title: "board-2",

            tasks: {
                "1": {id: "1", text: "Доска №2: Задача 1"},
                "2": {id: "2", text: "Доска №2: Задача 2"},
                "3": {id: "3", text: "Доска №2: Задача 3"},
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
        },
    },

    boardOrder: ["board-1", "board-2"],
}

export default INITIAL_DATA