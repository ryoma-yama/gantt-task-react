import "../index.css";
import { ViewMode } from "../../../src";
type ViewSwitcherProps = {
	isChecked: boolean;
	onViewListChange: (isChecked: boolean) => void;
	onViewModeChange: (viewMode: ViewMode) => void;
};
export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
	onViewModeChange,
	onViewListChange,
	isChecked,
}) => {
	return (
		<div className="ViewContainer">
			<button
				className="Button"
				onClick={() => onViewModeChange(ViewMode.Hour)}
				type="button"
			>
				Hour
			</button>
			<button
				className="Button"
				onClick={() => onViewModeChange(ViewMode.QuarterDay)}
				type="button"
			>
				Quarter of Day
			</button>
			<button
				className="Button"
				onClick={() => onViewModeChange(ViewMode.HalfDay)}
				type="button"
			>
				Half of Day
			</button>
			<button
				className="Button"
				onClick={() => onViewModeChange(ViewMode.Day)}
				type="button"
			>
				Day
			</button>
			<button
				className="Button"
				onClick={() => onViewModeChange(ViewMode.Week)}
				type="button"
			>
				Week
			</button>
			<button
				className="Button"
				onClick={() => onViewModeChange(ViewMode.Month)}
				type="button"
			>
				Month
			</button>
			<button
				className="Button"
				onClick={() => onViewModeChange(ViewMode.Year)}
				type="button"
			>
				Year
			</button>
			<button
				className="Button"
				onClick={() => onViewModeChange(ViewMode.QuarterYear)}
				type="button"
			>
				QuarterYear
			</button>
			<div className="Switch">
				<label className="Switch_Toggle">
					<input
						type="checkbox"
						defaultChecked={isChecked}
						onClick={() => onViewListChange(!isChecked)}
					/>
					<span className="Slider" />
				</label>
				Show Task List
			</div>
		</div>
	);
};
