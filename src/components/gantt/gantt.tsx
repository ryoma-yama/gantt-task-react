import type { SyntheticEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { convertToBarTasks } from "../../helpers/bar-helper";
import { ganttDateRange, seedDates } from "../../helpers/date-helper";
import { removeHiddenTasks, sortTasks } from "../../helpers/other-helper";
import type { BarTask } from "../../types/bar-task";
import type { DateSetup } from "../../types/date-setup";
import type { GanttEvent } from "../../types/gantt-task-actions";
import {
	type GanttProps,
	type Task,
	ViewModeEnum,
} from "../../types/public-types";
import type { CalendarProps } from "../calendar/calendar";
import type { GridProps } from "../grid/grid";
import { HorizontalScroll } from "../other/horizontal-scroll";
import { StandardTooltipContent, Tooltip } from "../other/tooltip";
import { VerticalScroll } from "../other/vertical-scroll";
import { TaskList, type TaskListProps } from "../task-list/task-list";
import { TaskListHeaderDefault } from "../task-list/task-list-header";
import { TaskListTableDefault } from "../task-list/task-list-table";
import styles from "./gantt.module.css";
import { TaskGantt } from "./task-gantt";
import type { TaskGanttContentProps } from "./task-gantt-content";

export const Gantt: React.FunctionComponent<GanttProps> = ({
	tasks = [],
	headerHeight = 50,
	columnWidth = 60,
	listCellWidth = "155px",
	rowHeight = 50,
	ganttHeight = 0,
	viewMode = ViewModeEnum.Day,
	preStepsCount = 1,
	locale = "en-GB",
	barFill = 60,
	barCornerRadius = 3,
	barProgressColor = "#a3a3ff",
	barProgressSelectedColor = "#8282f5",
	barBackgroundColor = "#b8c2cc",
	barBackgroundSelectedColor = "#aeb8c2",
	projectProgressColor = "#7db59a",
	projectProgressSelectedColor = "#59a985",
	projectBackgroundColor = "#fac465",
	projectBackgroundSelectedColor = "#f7bb53",
	milestoneBackgroundColor = "#f1c453",
	milestoneBackgroundSelectedColor = "#f29e4c",
	rtl = false,
	showDayOfWeek = false,
	showFromTo = false,
	handleWidth = 8,
	timeStep = 300000,
	arrowColor = "grey",
	fontFamily = "Arial, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue",
	fontSize = "14px",
	arrowIndent = 20,
	todayColor = "rgba(252, 248, 227, 0.5)",
	viewDate,
	TooltipContent = StandardTooltipContent,
	TaskListHeader = TaskListHeaderDefault,
	TaskListTable = TaskListTableDefault,
	onDateChange,
	onProgressChange,
	onDoubleClick,
	onClick,
	onDelete,
	onSelect,
	onExpanderClick,
}) => {
	const createDefaultDates = () => {
		const today = new Date();
		const daysBefore = 7;
		const daysAfter = 7;

		const defaultDates: Date[] = [];

		// pre-week
		for (let i = daysBefore; i > 0; i--) {
			const date = new Date();
			date.setDate(today.getDate() - i);
			defaultDates.push(date);
		}

		// today
		defaultDates.push(today);

		// post-week
		for (let i = 1; i <= daysAfter; i++) {
			const date = new Date();
			date.setDate(today.getDate() + i);
			defaultDates.push(date);
		}

		return defaultDates;
	};

	const wrapperRef = useRef<HTMLDivElement>(null);
	const taskListRef = useRef<HTMLDivElement>(null);
	const [dateSetup, setDateSetup] = useState<DateSetup>(() => {
		if (!tasks || tasks.length === 0) {
			return { viewMode: ViewModeEnum.Day, dates: createDefaultDates() };
		}
		const [startDate, endDate] = ganttDateRange(tasks, viewMode, preStepsCount);
		return { viewMode, dates: seedDates(startDate, endDate, viewMode) };
	});
	const [currentViewDate, setCurrentViewDate] = useState<Date | undefined>(
		undefined,
	);

	const [taskListWidth, setTaskListWidth] = useState(0);
	const [svgContainerWidth, setSvgContainerWidth] = useState(0);
	const [svgContainerHeight, setSvgContainerHeight] = useState(ganttHeight);
	const [barTasks, setBarTasks] = useState<BarTask[]>([]);
	const [ganttEvent, setGanttEvent] = useState<GanttEvent>({
		action: "",
	});
	const taskHeight = useMemo(
		() => (rowHeight * barFill) / 100,
		[rowHeight, barFill],
	);

	const [selectedTask, setSelectedTask] = useState<BarTask>();
	const [failedTask, setFailedTask] = useState<BarTask | null>(null);

	const svgWidth = dateSetup.dates.length * columnWidth;
	const ganttFullHeight = barTasks.length * rowHeight;

	const [scrollY, setScrollY] = useState(0);
	const [scrollX, setScrollX] = useState(-1);
	const [ignoreScrollEvent, setIgnoreScrollEvent] = useState(false);

	// task change events
	useEffect(() => {
		if (!tasks || tasks.length === 0) {
			setSvgContainerHeight(headerHeight);
			return;
		}
		let filteredTasks: Task[];
		if (onExpanderClick) {
			filteredTasks = removeHiddenTasks(tasks);
		} else {
			filteredTasks = tasks;
		}
		filteredTasks = filteredTasks.sort(sortTasks);
		const [startDate, endDate] = ganttDateRange(
			filteredTasks,
			viewMode,
			preStepsCount,
		);
		let newDates = seedDates(startDate, endDate, viewMode);
		if (rtl) {
			newDates = newDates.reverse();
			if (scrollX === -1) {
				setScrollX(newDates.length * columnWidth);
			}
		}
		setDateSetup({ dates: newDates, viewMode });

		const newBarTasks = convertToBarTasks(
			filteredTasks,
			newDates,
			columnWidth,
			rowHeight,
			taskHeight,
			barCornerRadius,
			handleWidth,
			rtl,
			barProgressColor,
			barProgressSelectedColor,
			barBackgroundColor,
			barBackgroundSelectedColor,
			projectProgressColor,
			projectProgressSelectedColor,
			projectBackgroundColor,
			projectBackgroundSelectedColor,
			milestoneBackgroundColor,
			milestoneBackgroundSelectedColor,
		);
		if (newBarTasks.length === 0) {
			setSvgContainerHeight(headerHeight);
			return;
		}
		setBarTasks(newBarTasks);
	}, [
		tasks,
		viewMode,
		preStepsCount,
		rowHeight,
		barCornerRadius,
		columnWidth,
		taskHeight,
		handleWidth,
		barProgressColor,
		barProgressSelectedColor,
		barBackgroundColor,
		barBackgroundSelectedColor,
		projectProgressColor,
		projectProgressSelectedColor,
		projectBackgroundColor,
		projectBackgroundSelectedColor,
		milestoneBackgroundColor,
		milestoneBackgroundSelectedColor,
		rtl,
		scrollX,
		onExpanderClick,
		headerHeight,
	]);

	useEffect(() => {
		if (
			viewMode === dateSetup.viewMode &&
			((viewDate && !currentViewDate) ||
				(viewDate && currentViewDate?.valueOf() !== viewDate.valueOf()))
		) {
			const dates = dateSetup.dates;
			const index = dates.findIndex(
				(d, i) =>
					viewDate.valueOf() >= d.valueOf() &&
					i + 1 !== dates.length &&
					viewDate.valueOf() < dates[i + 1].valueOf(),
			);
			if (index === -1) {
				return;
			}
			setCurrentViewDate(viewDate);
			setScrollX(columnWidth * index);
		}
	}, [
		viewDate,
		columnWidth,
		dateSetup.dates,
		dateSetup.viewMode,
		viewMode,
		currentViewDate,
	]);

	useEffect(() => {
		const { changedTask, action } = ganttEvent;
		if (changedTask) {
			if (action === "delete") {
				setGanttEvent({ action: "" });
				setBarTasks(barTasks.filter((t) => t.id !== changedTask.id));
			} else if (
				action === "move" ||
				action === "end" ||
				action === "start" ||
				action === "progress"
			) {
				const prevStateTask = barTasks.find((t) => t.id === changedTask.id);
				if (
					prevStateTask &&
					(prevStateTask.start.getTime() !== changedTask.start.getTime() ||
						prevStateTask.end.getTime() !== changedTask.end.getTime() ||
						prevStateTask.progress !== changedTask.progress)
				) {
					// actions for change
					const newTaskList = barTasks.map((t) =>
						t.id === changedTask.id ? changedTask : t,
					);
					setBarTasks(newTaskList);
				}
			}
		}
	}, [ganttEvent, barTasks]);

	useEffect(() => {
		if (failedTask) {
			setBarTasks(
				barTasks.map((t) => (t.id !== failedTask.id ? t : failedTask)),
			);
			setFailedTask(null);
		}
	}, [failedTask, barTasks]);

	useEffect(() => {
		if (!listCellWidth) {
			setTaskListWidth(0);
		}
		if (taskListRef.current) {
			setTaskListWidth(taskListRef.current.offsetWidth);
		}
	}, [listCellWidth]);

	useEffect(() => {
		if (wrapperRef.current) {
			setSvgContainerWidth(wrapperRef.current.offsetWidth - taskListWidth);
		}
	}, [taskListWidth]);

	useEffect(() => {
		if (barTasks.length === 0) {
			setSvgContainerHeight(headerHeight);
		} else if (ganttHeight) {
			setSvgContainerHeight(ganttHeight + headerHeight);
		} else {
			setSvgContainerHeight(tasks.length * rowHeight + headerHeight);
		}
	}, [ganttHeight, tasks, headerHeight, rowHeight, barTasks.length]);

	// scroll events
	useEffect(() => {
		const handleWheel = (event: WheelEvent) => {
			if (event.shiftKey || event.deltaX) {
				const scrollMove = event.deltaX ? event.deltaX : event.deltaY;
				let newScrollX = scrollX + scrollMove;
				if (newScrollX < 0) {
					newScrollX = 0;
				} else if (newScrollX > svgWidth) {
					newScrollX = svgWidth;
				}
				setScrollX(newScrollX);
				event.preventDefault();
			} else if (ganttHeight) {
				let newScrollY = scrollY + event.deltaY;
				if (newScrollY < 0) {
					newScrollY = 0;
				} else if (newScrollY > ganttFullHeight - ganttHeight) {
					newScrollY = ganttFullHeight - ganttHeight;
				}
				if (newScrollY !== scrollY) {
					setScrollY(newScrollY);
					event.preventDefault();
				}
			}

			setIgnoreScrollEvent(true);
		};

		// subscribe if scroll is necessary
		wrapperRef.current?.addEventListener("wheel", handleWheel, {
			passive: false,
		});
		return () => {
			wrapperRef.current?.removeEventListener("wheel", handleWheel);
		};
	}, [scrollY, scrollX, ganttHeight, svgWidth, ganttFullHeight]);

	const handleScrollY = (event: SyntheticEvent<HTMLDivElement>) => {
		if (scrollY !== event.currentTarget.scrollTop && !ignoreScrollEvent) {
			setScrollY(event.currentTarget.scrollTop);
			setIgnoreScrollEvent(true);
		} else {
			setIgnoreScrollEvent(false);
		}
	};

	const handleScrollX = (event: SyntheticEvent<HTMLDivElement>) => {
		if (scrollX !== event.currentTarget.scrollLeft && !ignoreScrollEvent) {
			setScrollX(event.currentTarget.scrollLeft);
			setIgnoreScrollEvent(true);
		} else {
			setIgnoreScrollEvent(false);
		}
	};

	/**
	 * Handles arrow keys events and transform it to new scroll
	 */
	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		event.preventDefault();
		let newScrollY = scrollY;
		let newScrollX = scrollX;
		let isX = true;
		switch (event.key) {
			case "Down": // IE/Edge specific value
			case "ArrowDown":
				newScrollY += rowHeight;
				isX = false;
				break;
			case "Up": // IE/Edge specific value
			case "ArrowUp":
				newScrollY -= rowHeight;
				isX = false;
				break;
			case "Left":
			case "ArrowLeft":
				newScrollX -= columnWidth;
				break;
			case "Right": // IE/Edge specific value
			case "ArrowRight":
				newScrollX += columnWidth;
				break;
		}
		if (isX) {
			if (newScrollX < 0) {
				newScrollX = 0;
			} else if (newScrollX > svgWidth) {
				newScrollX = svgWidth;
			}
			setScrollX(newScrollX);
		} else {
			if (newScrollY < 0) {
				newScrollY = 0;
			} else if (newScrollY > ganttFullHeight - ganttHeight) {
				newScrollY = ganttFullHeight - ganttHeight;
			}
			setScrollY(newScrollY);
		}
		setIgnoreScrollEvent(true);
	};

	/**
	 * Task select event
	 */
	const handleSelectedTask = (taskId: string) => {
		const newSelectedTask = barTasks.find((t) => t.id === taskId);
		const oldSelectedTask = barTasks.find(
			(t) => !!selectedTask && t.id === selectedTask.id,
		);
		if (onSelect) {
			if (oldSelectedTask) {
				onSelect(oldSelectedTask, false);
			}
			if (newSelectedTask) {
				onSelect(newSelectedTask, true);
			}
		}
		setSelectedTask(newSelectedTask);
	};
	const handleExpanderClick = (task: Task) => {
		if (onExpanderClick && task.hideChildren !== undefined) {
			onExpanderClick({ ...task, hideChildren: !task.hideChildren });
		}
	};
	const gridProps: GridProps = {
		columnWidth,
		svgWidth,
		tasks: tasks,
		rowHeight,
		dates: dateSetup.dates,
		todayColor,
		rtl,
	};
	const calendarProps: CalendarProps = {
		dateSetup,
		locale,
		viewMode,
		headerHeight,
		columnWidth,
		fontFamily,
		fontSize,
		rtl,
		showDayOfWeek,
	};
	const barProps: TaskGanttContentProps = {
		tasks: barTasks,
		dates: dateSetup.dates,
		ganttEvent,
		selectedTask,
		rowHeight,
		taskHeight,
		columnWidth,
		arrowColor,
		timeStep,
		fontFamily,
		fontSize,
		arrowIndent,
		svgWidth,
		rtl,
		setGanttEvent,
		setFailedTask,
		setSelectedTask: handleSelectedTask,
		onDateChange,
		onProgressChange,
		onDoubleClick,
		onClick,
		onDelete,
	};

	const tableProps: TaskListProps = {
		rowHeight,
		rowWidth: listCellWidth,
		fontFamily,
		fontSize,
		tasks: barTasks,
		locale,
		headerHeight,
		scrollY,
		ganttHeight,
		horizontalContainerClass: styles.horizontalContainer,
		selectedTask,
		taskListRef,
		setSelectedTask: handleSelectedTask,
		onExpanderClick: handleExpanderClick,
		TaskListHeader,
		TaskListTable,
		showFromTo,
	};

	if (tasks.length === 0) {
		return null;
	}

	return (
		<div>
			<div
				className={styles.wrapper}
				onKeyDown={handleKeyDown}
				ref={wrapperRef}
			>
				{/* Column: Task List */}
				{listCellWidth && <TaskList {...tableProps} />}
				{/* Column: Gantt Chart */}
				<TaskGantt
					gridProps={gridProps}
					calendarProps={calendarProps}
					barProps={barProps}
					ganttHeight={ganttHeight}
					scrollY={scrollY}
					scrollX={scrollX}
				/>
				{ganttEvent.changedTask && (
					<Tooltip
						arrowIndent={arrowIndent}
						rowHeight={rowHeight}
						svgContainerHeight={svgContainerHeight}
						svgContainerWidth={svgContainerWidth}
						fontFamily={fontFamily}
						fontSize={fontSize}
						scrollX={scrollX}
						scrollY={scrollY}
						task={ganttEvent.changedTask}
						headerHeight={headerHeight}
						taskListWidth={taskListWidth}
						TooltipContent={TooltipContent}
						rtl={rtl}
						svgWidth={svgWidth}
					/>
				)}
				<VerticalScroll
					ganttFullHeight={ganttFullHeight}
					ganttHeight={ganttHeight}
					headerHeight={headerHeight}
					scroll={scrollY}
					onScroll={handleScrollY}
					rtl={rtl}
				/>
			</div>
			<HorizontalScroll
				svgWidth={svgWidth}
				taskListWidth={taskListWidth}
				scroll={scrollX}
				rtl={rtl}
				onScroll={handleScrollX}
			/>
		</div>
	);
};
