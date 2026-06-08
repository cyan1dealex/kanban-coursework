export const INITIAL_DATA = {
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
		'board-90498db6-e5e0-445b-8e83-95dc3515ff54': {
			id: 'board-90498db6-e5e0-445b-8e83-95dc3515ff54',
			title: 'Доска №3',
			columnIds: [],
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
			taskIds: [
				'task-1780341450553',
				'task-1780341453761',
				'task-1780341456163',
				'task-1780341594033',
			],
		},
		'column-3': {
			id: 'column-3',
			boardId: 'board-1',
			title: 'sss',
			taskIds: ['task-1780341507750', 'task-1780766325174'],
		},
		'column-4': {
			id: 'column-4',
			boardId: 'board-2',
			title: 'Список дел',
			taskIds: ['task-5', 'task-4', 'task-6'],
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
			isDone: true,
			labelIds: [1, 2],
			startDate: null,
			dueDate: '2026-06-02T19:18:18.582Z',
			checkLists: {
				'7aa064ba-2722-46e2-b956-1c7af37fa264': {
					id: '7aa064ba-2722-46e2-b956-1c7af37fa264',
					title: 'Чек-лист',
					elements: [
						{
							id: '70d7e0ac-dcd3-41b9-a800-b3e2938292dc',
							text: '1',
							isCompleted: true,
						},
						{
							id: 'd2cb523d-7e6c-4d45-85b3-c71d45f9fd8f',
							text: '2',
							isCompleted: true,
						},
						{
							id: 'a2ff6c8e-821d-44ce-bdd8-649f18deee02',
							text: '3',
							isCompleted: true,
						},
					],
				},
			},
		},
		'task-2': {
			id: 'task-2',
			text: '(1) Задача 2',
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa placeat labore consequuntur aut. Temporibus, consequatur? Eveniet sit nisi animi rerum qui ex illo fugit adipisci, temporibus quas magni nam itaque?',
			isDone: false,
			labelIds: [],
			startDate: null,
			dueDate: '2026-06-02T21:00:00.000Z',
			checkLists: null,
		},
		'task-3': {
			id: 'task-3',
			text: '(1) Задача 3',
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa placeat labore consequuntur aut. Temporibus, consequatur? Eveniet sit nisi animi rerum qui ex illo fugit adipisci, temporibus quas magni nam itaque?',
			isDone: null,
			labelIds: [],
			startDate: null,
			dueDate: null,
			checkLists: null,
		},
		'task-4': {
			id: 'task-4',
			text: '(2) Задача 1',
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa placeat labore consequuntur aut. Temporibus, consequatur? Eveniet sit nisi animi rerum qui ex illo fugit adipisci, temporibus quas magni nam itaque?',
			isDone: null,
			labelIds: [],
			startDate: null,
			dueDate: null,
			checkLists: null,
		},
		'task-5': {
			id: 'task-5',
			text: '(2) Задача 2',
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa placeat labore consequuntur aut. Temporibus, consequatur? Eveniet sit nisi animi rerum qui ex illo fugit adipisci, temporibus quas magni nam itaque?',
			isDone: null,
			labelIds: [],
			startDate: null,
			dueDate: null,
			checkLists: null,
		},
		'task-6': {
			id: 'task-6',
			text: '(2) Задача 3',
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa placeat labore consequuntur aut. Temporibus, consequatur? Eveniet sit nisi animi rerum qui ex illo fugit adipisci, temporibus quas magni nam itaque?',
			isDone: null,
			labelIds: [],
			startDate: null,
			dueDate: null,
			checkLists: null,
		},
		'task-7': {
			id: 'task-7',
			text: '(2) Задача 4',
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa placeat labore consequuntur aut. Temporibus, consequatur? Eveniet sit nisi animi rerum qui ex illo fugit adipisci, temporibus quas magni nam itaque?',
			isDone: null,
			labelIds: [],
			startDate: null,
			dueDate: null,
			checkLists: null,
		},
		'task-1780341450553': {
			id: 'task-1780341450553',
			text: 'Задача 4',
			isDone: true,
		},
		'task-1780341453761': {
			id: 'task-1780341453761',
			text: 'Просроченная задача',
			startDate: null,
			dueDate: '2026-05-31T21:00:00.000Z',
			isDone: false,
		},
		'task-1780341456163': {
			id: 'task-1780341456163',
			text: 'Задача 5',
			isDone: true,
		},
		'task-1780341507750': {
			id: 'task-1780341507750',
			text: 'Задача 6',
			checkLists: {
				'8ff86123-f194-46e1-8ea1-781d0d1d899e': {
					id: '8ff86123-f194-46e1-8ea1-781d0d1d899e',
					title: 'Чек-лист',
					elements: [
						{
							id: '40b7616e-edcf-4097-8c51-6f223e9da18b',
							text: '1',
							isCompleted: true,
						},
						{
							id: '33df1e6d-0c39-497b-829c-3cb9ec0fca75',
							text: '2',
							isCompleted: true,
						},
						{
							id: 'b2e92411-ae37-421a-aabb-4d72a23e9bac',
							text: '3',
							isCompleted: true,
						},
						{
							id: 'd3cf3a91-a635-43fc-96ec-17bf97c5d19c',
							text: '4',
							isCompleted: false,
						},
						{
							id: 'd5a1d8da-cd17-4f48-883c-c4cbfb597fb9',
							text: '5',
							isCompleted: false,
						},
					],
				},
			},
		},
		'task-1780341594033': {
			id: 'task-1780341594033',
			text: 'Задача 7',
		},
		'task-1780766325174': {
			id: 'task-1780766325174',
			text: '123',
		},
	},
	boardOrder: [
		'board-1',
		'board-2',
		'board-90498db6-e5e0-445b-8e83-95dc3515ff54',
	],
	ui: {
		menu: null,
		subMenu: null,
		modal: null,
	},
	labels: {
		1: {
			id: 1,
			color: '#FF595E',
			title: 'Дедлайн',
		},
		2: {
			id: 2,
			color: '#8AC926',
			title: 'Срочно',
		},
	},
}
