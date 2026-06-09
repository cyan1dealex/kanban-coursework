export const INITIAL_DATA = {
	boards: {
		'board-1': {
			id: 'board-1',
			title: 'Разработка таск-менеджера',
			columnIds: ['column-1', 'column-2', 'column-3', 'column-4'],
		},
		'board-2': {
			id: 'board-2',
			title: 'Маркетинг и продвижение',
			columnIds: ['column-5', 'column-6'],
		},
		'board-90498db6-e5e0-445b-8e83-95dc3515ff54': {
			id: 'board-90498db6-e5e0-445b-8e83-95dc3515ff54',
			title: 'Архив проектов',
			columnIds: [],
		},
	},
	columns: {
		'column-1': {
			id: 'column-1',
			boardId: 'board-1',
			title: 'Бэклог задач',
			taskIds: ['task-1', 'task-2', 'task-3'],
		},
		'column-2': {
			id: 'column-2',
			boardId: 'board-1',
			title: 'В работе',
			taskIds: ['task-4', 'task-5'],
		},
		'column-3': {
			id: 'column-3',
			boardId: 'board-1',
			title: 'На проверке (Code Review)',
			taskIds: ['task-6', 'task-7'],
		},
		'column-4': {
			id: 'column-4',
			boardId: 'board-1',
			title: 'Готово',
			taskIds: ['task-8', 'task-9'],
		},
		'column-5': {
			id: 'column-5',
			boardId: 'board-2',
			title: 'Запланировано',
			taskIds: ['task-10'],
		},
		'column-6': {
			id: 'column-6',
			boardId: 'board-2',
			title: 'В процессе',
			taskIds: [],
		},
	},
	tasks: {
		'task-1': {
			id: 'task-1',
			text: 'Разработка модуля авторизации (OAuth2)',
			description:
				'<h1>Техническое задание</h1><p>Необходимо реализовать безопасный вход пользователей через сторонние сервисы (GitHub, Google), используя протокол OAuth2.</p>',
			isDone: false,
			labelIds: [1, 3],
			startDate: null,
			dueDate: '2026-06-25T18:00:00.000Z',
			checkLists: null,
		},
		'task-2': {
			id: 'task-2',
			text: 'Верстка адаптивного подвала сайта (Footer)',
			description:
				'Сделать резиновый футер. Обеспечить корректное отображение на смартфонах, планшетах и мониторах с разрешением 4K.',
			isDone: false,
			labelIds: [4, 5],
			startDate: null,
			dueDate: '2026-06-30T21:00:00.000Z',
			checkLists: null,
		},
		'task-3': {
			id: 'task-3',
			text: 'Написание юнит-тестов для кастомных хуков',
			description:
				'Покрыть тестами хуки useDebounce, useLocalStorage и глобальный стейт.',
			isDone: false,
			labelIds: [6],
			startDate: null,
			dueDate: '2026-06-01T12:00:00.000Z',
			checkLists: null,
		},

		'task-4': {
			id: 'task-4',
			text: 'Интеграция WYSIWYG-редактора Tiptap',
			description:
				'<h2>Текущий прогресс</h2><p>Базовая библиотека установлена. Необходимо донастроить элементы управления форматированием текста в модальном окне задачи.</p>',
			isDone: false,
			labelIds: [2, 4],
			startDate: null,
			dueDate: '2026-06-11T15:00:00.000Z',
			checkLists: {
				'checklist-tiptap': {
					id: 'checklist-tiptap',
					title: 'Этапы интеграции редактора',
					elements: [
						{
							id: 'el-1',
							text: 'Установить пакеты @tiptap/react и starter-kit',
							isCompleted: true,
						},
						{
							id: 'el-2',
							text: 'Спроектировать кастомный тулбар',
							isCompleted: true,
						},
						{
							id: 'el-3',
							text: 'Добавить поддержку списков и inline-кода',
							isCompleted: false,
						},
						{
							id: 'el-4',
							text: 'Протестировать автосохранение HTML в localStorage',
							isCompleted: false,
						},
					],
				},
			},
		},
		'task-5': {
			id: 'task-5',
			text: 'Рефакторинг структуры проекта под архитектуру FSD',
			description:
				'Перенести старые компоненты из общей папки в изолированные слои: shared, entities, features, widgets, pages.',
			isDone: false,
			labelIds: [7],
			startDate: null,
			dueDate: null,
			checkLists: null,
		},

		'task-6': {
			id: 'task-6',
			text: 'Оптимизация рендеринга доски через React.memo',
			description:
				'<p>Проведен аудит производительности. Избыточные перерисовки карточек устранены.</p>',
			isDone: false,
			labelIds: [2, 8],
			startDate: null,
			dueDate: '2026-06-15T09:00:00.000Z',
			checkLists: {
				'checklist-memo': {
					id: 'checklist-memo',
					title: 'Чек-лист оптимизации',
					elements: [
						{
							id: 'el-5',
							text: 'Изолировать компонент TaskCard через React.memo',
							isCompleted: true,
						},
						{
							id: 'el-6',
							text: 'Обернуть функции обработки Drag-and-Drop в useCallback',
							isCompleted: true,
						},
						{
							id: 'el-7',
							text: 'Проверить стабильность FPS при быстром перемещении',
							isCompleted: true,
						},
					],
				},
			},
		},
		'task-7': {
			id: 'task-7',
			text: 'Настройка конфигурации деплоя vercel.json',
			description:
				'Исправить ошибку клиентского роутинга 404 при обновлении страниц SPA на серверах Vercel.',
			isDone: false,
			labelIds: [3],
			startDate: null,
			dueDate: null,
			checkLists: null,
		},

		'task-8': {
			id: 'task-8',
			text: 'Проектирование нормализованной схемы данных JSON',
			description:
				'Базовая структура INITIAL_DATA успешно спроектирована и внедрена.',
			isDone: true,
			labelIds: [7],
			startDate: null,
			dueDate: '2026-06-05T21:00:00.000Z',
			checkLists: null,
		},
		'task-9': {
			id: 'task-9',
			text: 'Настройка клиентской навигации React Router',
			description:
				'Конфигурация BrowserRouter, динамических путей /board/:id и вложенных модальных путей завершена.',
			isDone: true,
			labelIds: [4],
			startDate: null,
			dueDate: '2026-06-06T18:00:00.000Z',
			checkLists: null,
		},

		'task-10': {
			id: 'task-10',
			text: 'Подготовка презентации проекта для защиты',
			description:
				'Сделать лаконичные слайды, отражающие архитектуру FSD и метрики оптимизации производительности.',
			isDone: false,
			labelIds: [1],
			startDate: null,
			dueDate: '2026-06-20T21:00:00.000Z',
			checkLists: null,
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
		1: { id: 1, color: '#F44336', title: 'Дедлайн' },
		2: { id: 2, color: '#FF9800', title: 'Срочно' },
		3: { id: 3, color: '#3F51B5', title: 'Бэкенд' },
		4: { id: 4, color: '#673AB7', title: 'Фронтенд' },
		5: { id: 5, color: '#9C27B0', title: 'UI/UX' },
		6: { id: 6, color: '#E91E63', title: 'Тестирование' },
		7: { id: 7, color: '#009688', title: 'Архитектура' },
		8: { id: 8, color: '#5AB963', title: 'Оптимизация' },
	},
}
