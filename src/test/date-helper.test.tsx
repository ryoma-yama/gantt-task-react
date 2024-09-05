import {
	addToDate,
	getWeekNumberISO8601,
	seedDates,
} from "../helpers/date-helper";
import { ViewModeEnum } from "../types/public-types";

describe("seed date", () => {
	test("daily", () => {
		expect(
			seedDates(new Date(2020, 5, 28), new Date(2020, 6, 2), ViewModeEnum.Day),
		).toEqual([
			new Date(2020, 5, 28),
			new Date(2020, 5, 29),
			new Date(2020, 5, 30),
			new Date(2020, 6, 1),
			new Date(2020, 6, 2),
		]);
	});

	test("weekly", () => {
		expect(
			seedDates(
				new Date(2020, 5, 28),
				new Date(2020, 6, 19),
				ViewModeEnum.Week,
			),
		).toEqual([
			new Date(2020, 5, 28),
			new Date(2020, 6, 5),
			new Date(2020, 6, 12),
			new Date(2020, 6, 19),
		]);
	});

	test("monthly", () => {
		expect(
			seedDates(
				new Date(2020, 5, 28),
				new Date(2020, 6, 19),
				ViewModeEnum.Month,
			),
		).toEqual([new Date(2020, 5, 28), new Date(2020, 6, 28)]);
	});

	test("quarterly", () => {
		expect(
			seedDates(
				new Date(2020, 5, 28),
				new Date(2020, 5, 29),
				ViewModeEnum.QuarterDay,
			),
		).toEqual([
			new Date(2020, 5, 28, 0, 0),
			new Date(2020, 5, 28, 6, 0),
			new Date(2020, 5, 28, 12, 0),
			new Date(2020, 5, 28, 18, 0),
			new Date(2020, 5, 29, 0, 0),
		]);
	});
});

describe("add to date", () => {
	test("add month", () => {
		expect(addToDate(new Date(2020, 0, 1), 40, "month")).toEqual(
			new Date(2023, 4, 1),
		);
	});

	test("add day", () => {
		expect(addToDate(new Date(2020, 0, 1), 40, "day")).toEqual(
			new Date(2020, 1, 10),
		);
	});
});

test("get week number", () => {
	expect(getWeekNumberISO8601(new Date(2019, 11, 31))).toEqual("01");
	expect(getWeekNumberISO8601(new Date(2021, 0, 1))).toEqual("53");
	expect(getWeekNumberISO8601(new Date(2020, 6, 20))).toEqual("30");
});
