import React from "react";
import styles from "./task-list-header.module.css";

export interface TaskListHeaderProps {
	headerHeight: number;
	rowWidth: string;
	fontFamily: string;
	fontSize: string;
	showFromTo: boolean;
}

export const TaskListHeaderDefault: React.FC<TaskListHeaderProps> = ({
	headerHeight,
	fontFamily,
	fontSize,
	rowWidth,
	showFromTo,
}) => {
	const headerItemStyle = {
		minWidth: rowWidth,
	};

	const headerSeparatorStyle = {
		height: headerHeight * 0.5,
		marginTop: headerHeight * 0.2,
	};

	const headers = ["Name"];
	if (showFromTo) {
		headers.push("From", "To");
	}

	return (
		<div className={styles.ganttTable} style={{ fontFamily, fontSize }}>
			<div
				className={styles.ganttTable_Header}
				style={{ height: headerHeight - 2 }}
			>
				{headers.map((header, index) => (
					<React.Fragment key={header}>
						<div
							className={styles.ganttTable_HeaderItem}
							style={headerItemStyle}
						>
							{header}
						</div>
						{index < headers.length - 1 && (
							<div
								className={styles.ganttTable_HeaderSeparator}
								style={headerSeparatorStyle}
							/>
						)}
					</React.Fragment>
				))}
			</div>
		</div>
	);
};
