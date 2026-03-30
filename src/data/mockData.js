const INITIAL_DATA = {
	boards: {
		'board-1': {
			id: 'board-1',
			title: 'Доска №1',
			columnIds: ['column-1', 'column-2', 'column-3'],
		},

		'board-2': {
			id: 'board-2',
			title: 'Доска №2',
			columnIds: ['column-4', 'column-5', 'column-6'],
		},
	},

	columns: {
		'column-1': {
			id: 'column-1',
			boardId: 'board-1',
			title: 'Список дел',
			taskIds: ['task-1', 'task-2', 'task-3'],
		},
		'column-2': {
			id: 'column-2',
			boardId: 'board-1',
			title: 'В процессе',
			taskIds: [],
		},
		'column-3': {
			id: 'column-3',
			boardId: 'board-1',
			title: 'Готово',
			taskIds: [],
		},
		'column-4': {
			id: 'column-4',
			boardId: 'board-2',
			title: 'Список дел',
			taskIds: ['task-4', 'task-5', 'task-6'],
		},
		'column-5': {
			id: 'column-5',
			boardId: 'board-2',
			title: 'В процессе',
			taskIds: ['task-7'],
		},
		'column-6': {
			id: 'column-6',
			boardId: 'board-2',
			title: 'Готово',
			taskIds: [],
		},
	},

	tasks: {
		'task-1': {
			id: 'task-1',
			text: '(1) Задача 1',
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa placeat labore consequuntur aut. Temporibus, consequatur? Eveniet sit nisi animi rerum qui ex illo fugit adipisci, temporibus quas magni nam itaque?',
			labelIds: [],
			startDate: null,
			dueDate: null,
		},
		'task-2': {
			id: 'task-2',
			text: '(1) Задача 2',
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa placeat labore consequuntur aut. Temporibus, consequatur? Eveniet sit nisi animi rerum qui ex illo fugit adipisci, temporibus quas magni nam itaque?',
			labelIds: [],
			startDate: null,
			dueDate: null,
		},
		'task-3': {
			id: 'task-3',
			text: '(1) Задача 3',
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa placeat labore consequuntur aut. Temporibus, consequatur? Eveniet sit nisi animi rerum qui ex illo fugit adipisci, temporibus quas magni nam itaque?',
			labelIds: [],
			startDate: null,
			dueDate: null,
		},
		'task-4': {
			id: 'task-4',
			text: '(2) Задача 1',
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa placeat labore consequuntur aut. Temporibus, consequatur? Eveniet sit nisi animi rerum qui ex illo fugit adipisci, temporibus quas magni nam itaque?',
			labelIds: [],
			startDate: null,
			dueDate: null,
		},
		'task-5': {
			id: 'task-5',
			text: '(2) Задача 2',
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa placeat labore consequuntur aut. Temporibus, consequatur? Eveniet sit nisi animi rerum qui ex illo fugit adipisci, temporibus quas magni nam itaque?',
			labelIds: [],
			startDate: null,
			dueDate: null,
		},
		'task-6': {
			id: 'task-6',
			text: '(2) Задача 3',
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa placeat labore consequuntur aut. Temporibus, consequatur? Eveniet sit nisi animi rerum qui ex illo fugit adipisci, temporibus quas magni nam itaque?',
			labelIds: [],
			startDate: null,
			dueDate: null,
		},
		'task-7': {
			id: 'task-7',
			text: '(2) Задача 4',
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa placeat labore consequuntur aut. Temporibus, consequatur? Eveniet sit nisi animi rerum qui ex illo fugit adipisci, temporibus quas magni nam itaque?',
			labelIds: [],
			startDate: null,
			dueDate: null,
		},
	},

	boardOrder: ['board-1', 'board-2'],

	ui: {
		menu: {
			taskId: null,
			columnId: null,
			position: null,
		},
		subMenu: {
			type: null,
			position: null,
			data: null,
		},
	},

	labels: {
		1: {
			id: 1,
			color: '#FF595E',
			title: 'Дедлайн',
		},
		2: {
			id: 2,
			color: '#FFCA3A',
			title: '',
		},
		3: {
			id: 3,
			color: '#8AC926',
			title: 'Срочно',
		},
		4: {
			id: 4,
			color: '#1982C4',
			title: '',
		},
		5: {
			id: 5,
			color: '#6A4C93',
			title: '',
		},
	},
}

export default INITIAL_DATA
