import type { ReactNode } from "react";
import {
	getCachedDateTimeFormat,
	getDaysInMonth,
	getLocalDayOfWeek,
	getLocaleMonth,
	getWeekNumberISO8601,
} from "../../helpers/date-helper";
import type { DateSetup } from "../../types/date-setup";
import { ViewModeEnum } from "../../types/public-types";
import styles from "./calendar.module.css";
import { TopPartOfCalendar } from "./top-part-of-calendar";

export type CalendarProps = {
	dateSetup: DateSetup;
	locale: string;
	viewMode: ViewModeEnum;
	rtl: boolean;
	headerHeight: number;
	columnWidth: number;
	fontFamily: string;
	fontSize: string;
	showDayOfWeek?: boolean;
};

export const Calendar: React.FC<CalendarProps> = ({
	dateSetup,
	locale,
	viewMode,
	rtl,
	headerHeight,
	columnWidth,
	fontFamily,
	fontSize,
	showDayOfWeek = false,
}) => {
	const calculateXText = (
		rtl: boolean,
		i: number,
		value: number,
		columnWidth: number,
	) => {
		return rtl
			? (6 + i + value + 1) * columnWidth
			: (6 + i - value) * columnWidth;
	};

	const getCalendarValuesForYear = () => {
		const topValues: ReactNode[] = [];
		const bottomValues: ReactNode[] = [];
		const topDefaultHeight = headerHeight * 0.5;
		for (let i = 0; i < dateSetup.dates.length; i++) {
			const date = dateSetup.dates[i];
			const bottomValue = date.getFullYear();
			bottomValues.push(
				<text
					key={date.getTime()}
					y={headerHeight * 0.8}
					x={columnWidth * i + columnWidth * 0.5}
					className={styles.calendarBottomText}
				>
					{bottomValue}
				</text>,
			);
			if (
				i === 0 ||
				date.getFullYear() !== dateSetup.dates[i - 1].getFullYear()
			) {
				const topValue = date.getFullYear().toString();
				const xText = calculateXText(rtl, i, date.getFullYear(), columnWidth);
				topValues.push(
					<TopPartOfCalendar
						key={topValue}
						value={topValue}
						x1Line={columnWidth * i}
						y1Line={0}
						y2Line={headerHeight}
						xText={xText}
						yText={topDefaultHeight * 0.9}
					/>,
				);
			}
		}
		return [topValues, bottomValues];
	};

	const getCalendarValuesForQuarterYear = () => {
		const topValues: ReactNode[] = [];
		const bottomValues: ReactNode[] = [];
		const topDefaultHeight = headerHeight * 0.5;
		for (let i = 0; i < dateSetup.dates.length; i++) {
			const date = dateSetup.dates[i];
			// const bottomValue = getLocaleMonth(date, locale);
			const quarter = `Q${Math.floor((date.getMonth() + 3) / 3)}`;
			bottomValues.push(
				<text
					key={date.getTime()}
					y={headerHeight * 0.8}
					x={columnWidth * i + columnWidth * 0.5}
					className={styles.calendarBottomText}
				>
					{quarter}
				</text>,
			);
			if (
				i === 0 ||
				date.getFullYear() !== dateSetup.dates[i - 1].getFullYear()
			) {
				const topValue = date.getFullYear().toString();
				const xText = calculateXText(rtl, i, date.getMonth(), columnWidth);
				topValues.push(
					<TopPartOfCalendar
						key={topValue}
						value={topValue}
						x1Line={columnWidth * i}
						y1Line={0}
						y2Line={topDefaultHeight}
						xText={Math.abs(xText)}
						yText={topDefaultHeight * 0.9}
					/>,
				);
			}
		}
		return [topValues, bottomValues];
	};

	const getCalendarValuesForMonth = () => {
		const topValues: ReactNode[] = [];
		const bottomValues: ReactNode[] = [];
		const topDefaultHeight = headerHeight * 0.5;
		for (let i = 0; i < dateSetup.dates.length; i++) {
			const date = dateSetup.dates[i];
			const bottomValue = getLocaleMonth(date, locale);
			bottomValues.push(
				<text
					key={bottomValue + date.getFullYear()}
					y={headerHeight * 0.8}
					x={columnWidth * i + columnWidth * 0.5}
					className={styles.calendarBottomText}
				>
					{bottomValue}
				</text>,
			);
			if (
				i === 0 ||
				date.getFullYear() !== dateSetup.dates[i - 1].getFullYear()
			) {
				const topValue = date.getFullYear().toString();
				const xText = calculateXText(rtl, i, date.getMonth(), columnWidth);
				topValues.push(
					<TopPartOfCalendar
						key={topValue}
						value={topValue}
						x1Line={columnWidth * i}
						y1Line={0}
						y2Line={topDefaultHeight}
						xText={xText}
						yText={topDefaultHeight * 0.9}
					/>,
				);
			}
		}
		return [topValues, bottomValues];
	};

	const getCalendarValuesForWeek = () => {
		const topValues: ReactNode[] = [];
		const bottomValues: ReactNode[] = [];
		let weeksCount = 1;
		const topDefaultHeight = headerHeight * 0.5;
		const dates = dateSetup.dates;
		for (let i = dates.length - 1; i >= 0; i--) {
			const date = dates[i];
			let topValue = "";
			if (i === 0 || date.getMonth() !== dates[i - 1].getMonth()) {
				// top
				topValue = `${getLocaleMonth(date, locale)}, ${date.getFullYear()}`;
			}
			// bottom
			const bottomValue = `W${getWeekNumberISO8601(date)}`;

			bottomValues.push(
				<text
					key={date.getTime()}
					y={headerHeight * 0.8}
					x={columnWidth * (i + +rtl)}
					className={styles.calendarBottomText}
				>
					{bottomValue}
				</text>,
			);

			if (topValue) {
				// if last day is new month
				if (i !== dates.length - 1) {
					topValues.push(
						<TopPartOfCalendar
							key={topValue}
							value={topValue}
							x1Line={columnWidth * i + weeksCount * columnWidth}
							y1Line={0}
							y2Line={topDefaultHeight}
							xText={columnWidth * i + columnWidth * weeksCount * 0.5}
							yText={topDefaultHeight * 0.9}
						/>,
					);
				}
				weeksCount = 0;
			}
			weeksCount++;
		}
		return [topValues, bottomValues];
	};

	const getCalendarValuesForDay = () => {
		const topValues: ReactNode[] = [];
		const bottomValues: ReactNode[] = [];
		const topDefaultHeight = headerHeight * 0.5;
		const dates = dateSetup.dates;
		for (let i = 0; i < dates.length; i++) {
			const date = dates[i];
			const dayOfWeek = getLocalDayOfWeek(date, locale, "short");
			const bottomValue = showDayOfWeek
				? `${dayOfWeek}, ${date.getDate()}`
				: `${date.getDate()}`;

			bottomValues.push(
				<text
					key={date.getTime()}
					y={headerHeight * 0.8}
					x={columnWidth * i + columnWidth * 0.5}
					className={styles.calendarBottomText}
				>
					{bottomValue}
				</text>,
			);
			if (
				i + 1 !== dates.length &&
				date.getMonth() !== dates[i + 1].getMonth()
			) {
				const topValue = getLocaleMonth(date, locale);

				topValues.push(
					<TopPartOfCalendar
						key={topValue + date.getFullYear()}
						value={topValue}
						x1Line={columnWidth * (i + 1)}
						y1Line={0}
						y2Line={topDefaultHeight}
						xText={
							columnWidth * (i + 1) -
							getDaysInMonth(date.getMonth(), date.getFullYear()) *
								columnWidth *
								0.5
						}
						yText={topDefaultHeight * 0.9}
					/>,
				);
			}
		}
		return [topValues, bottomValues];
	};

	const getCalendarValuesForPartOfDay = () => {
		const topValues: ReactNode[] = [];
		const bottomValues: ReactNode[] = [];
		const ticks = viewMode === ViewModeEnum.HalfDay ? 2 : 4;
		const topDefaultHeight = headerHeight * 0.5;
		const dates = dateSetup.dates;
		for (let i = 0; i < dates.length; i++) {
			const date = dates[i];
			const bottomValue = getCachedDateTimeFormat(locale, {
				hour: "numeric",
			}).format(date);

			bottomValues.push(
				<text
					key={date.getTime()}
					y={headerHeight * 0.8}
					x={columnWidth * (i + +rtl)}
					className={styles.calendarBottomText}
					fontFamily={fontFamily}
				>
					{bottomValue}
				</text>,
			);
			if (i === 0 || date.getDate() !== dates[i - 1].getDate()) {
				const topValue = `${getLocalDayOfWeek(
					date,
					locale,
					"short",
				)}, ${date.getDate()} ${getLocaleMonth(date, locale)}`;
				topValues.push(
					<TopPartOfCalendar
						key={topValue + date.getFullYear()}
						value={topValue}
						x1Line={columnWidth * i + ticks * columnWidth}
						y1Line={0}
						y2Line={topDefaultHeight}
						xText={columnWidth * i + ticks * columnWidth * 0.5}
						yText={topDefaultHeight * 0.9}
					/>,
				);
			}
		}

		return [topValues, bottomValues];
	};

	const getCalendarValuesForHour = () => {
		const topValues: ReactNode[] = [];
		const bottomValues: ReactNode[] = [];
		const topDefaultHeight = headerHeight * 0.5;
		const dates = dateSetup.dates;
		for (let i = 0; i < dates.length; i++) {
			const date = dates[i];
			const bottomValue = getCachedDateTimeFormat(locale, {
				hour: "numeric",
			}).format(date);

			bottomValues.push(
				<text
					key={date.getTime()}
					y={headerHeight * 0.8}
					x={columnWidth * (i + +rtl)}
					className={styles.calendarBottomText}
					fontFamily={fontFamily}
				>
					{bottomValue}
				</text>,
			);
			if (i !== 0 && date.getDate() !== dates[i - 1].getDate()) {
				const displayDate = dates[i - 1];
				const topValue = `${getLocalDayOfWeek(
					displayDate,
					locale,
					"long",
				)}, ${displayDate.getDate()} ${getLocaleMonth(displayDate, locale)}`;
				const topPosition = (date.getHours() - 24) / 2;
				topValues.push(
					<TopPartOfCalendar
						key={topValue + displayDate.getFullYear()}
						value={topValue}
						x1Line={columnWidth * i}
						y1Line={0}
						y2Line={topDefaultHeight}
						xText={columnWidth * (i + topPosition)}
						yText={topDefaultHeight * 0.9}
					/>,
				);
			}
		}

		return [topValues, bottomValues];
	};

	let topValues: ReactNode[] = [];
	let bottomValues: ReactNode[] = [];
	switch (dateSetup.viewMode) {
		case ViewModeEnum.Year:
			[topValues, bottomValues] = getCalendarValuesForYear();
			break;
		case ViewModeEnum.QuarterYear:
			[topValues, bottomValues] = getCalendarValuesForQuarterYear();
			break;
		case ViewModeEnum.Month:
			[topValues, bottomValues] = getCalendarValuesForMonth();
			break;
		case ViewModeEnum.Week:
			[topValues, bottomValues] = getCalendarValuesForWeek();
			break;
		case ViewModeEnum.Day:
			[topValues, bottomValues] = getCalendarValuesForDay();
			break;
		case ViewModeEnum.QuarterDay:
		case ViewModeEnum.HalfDay:
			[topValues, bottomValues] = getCalendarValuesForPartOfDay();
			break;
		case ViewModeEnum.Hour:
			[topValues, bottomValues] = getCalendarValuesForHour();
	}
	return (
		<g className="calendar" fontSize={fontSize} fontFamily={fontFamily}>
			<rect
				x={0}
				y={0}
				width={columnWidth * dateSetup.dates.length}
				height={headerHeight}
				className={styles.calendarHeader}
			/>
			{bottomValues} {topValues}
		</g>
	);
};
