import { useEffect, useRef } from "react";
import { Calendar, type CalendarProps } from "../calendar/calendar";
import { Grid, type GridProps } from "../grid/grid";
import styles from "./gantt.module.css";
import {
	TaskGanttContent,
	type TaskGanttContentProps,
} from "./task-gantt-content";

export type TaskGanttProps = {
	gridProps: GridProps;
	calendarProps: CalendarProps;
	barProps: TaskGanttContentProps;
	ganttHeight: number;
	scrollY: number;
	scrollX: number;
};

export const TaskGantt: React.FC<TaskGanttProps> = ({
	gridProps,
	calendarProps,
	barProps,
	ganttHeight,
	scrollY,
	scrollX,
}) => {
	const ganttSVGRef = useRef<SVGSVGElement>(null);
	const horizontalContainerRef = useRef<HTMLDivElement>(null);
	const verticalGanttContainerRef = useRef<HTMLDivElement>(null);
	const newBarProps = { ...barProps, svg: ganttSVGRef };

	useEffect(() => {
		if (horizontalContainerRef.current) {
			horizontalContainerRef.current.scrollTop = scrollY;
		}
	}, [scrollY]);

	useEffect(() => {
		if (verticalGanttContainerRef.current) {
			verticalGanttContainerRef.current.scrollLeft = scrollX;
		}
	}, [scrollX]);

	return (
		<div
			className={styles.ganttVerticalContainer}
			ref={verticalGanttContainerRef}
			dir="ltr"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={gridProps.svgWidth}
				height={calendarProps.headerHeight}
				fontFamily={barProps.fontFamily}
			>
				<title>Gantt Chart</title>
				<Calendar {...calendarProps} />
			</svg>
			<div
				ref={horizontalContainerRef}
				className={styles.horizontalContainer}
				style={
					ganttHeight
						? { height: ganttHeight, width: gridProps.svgWidth }
						: { width: gridProps.svgWidth }
				}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width={gridProps.svgWidth}
					height={barProps.rowHeight * barProps.tasks.length}
					fontFamily={barProps.fontFamily}
					ref={ganttSVGRef}
				>
					<title>Gantt Chart</title>
					<Grid {...gridProps} />
					<TaskGanttContent {...newBarProps} />
				</svg>
			</div>
		</div>
	);
};
