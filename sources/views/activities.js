import {JetView} from "webix-jet";
import {activities} from "../models/activitiesdata";
import ActivitiesDataTable from "./activities/activitiestable";
import ActivityWindow from "./activities/activityform";

export default class DataView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const tabbar = {
			view: "tabbar",
			localId: "selector",
			gravity: 3,
			borderless: true,
			options: [
				{
					id: 1,
					value: _("All")
				},
				{
					id: 2,
					value: _("Overdue")
				},
				{
					id: 3,
					value: _("Completed")
				},
				{
					id: 4,
					value: _("Today")
				},
				{
					id: 5,
					value: _("Tommorow")
				},
				{
					id: 6,
					value: _("This week")
				},
				{
					id: 7,
					value: _("This month")
				}
			],
			on: {
				onChange: () => {
					this.table.filterByAll();
				}
			}
		};

		return {
			rows: [
				{
					view: "toolbar",
					css: "subbar",
					padding: 0,
					elements: [
						tabbar,
						{
							view: "button",
							label: _("Add"),
							localId: "addButton",
							type: "icon",
							value: "Add",
							icon: "wxi-plus-square",
							css: "webix_primary",
							align: "right",
							inputWidth: 200,
							click: () => {
								const value = this.$$("addButton").getValue();
								const title = {head: _(`${value} new`), button: `${_(value)}`};
								this.form.showActivityForm({}, title);
							}
						}
					]
				},
				{$subview: new ActivitiesDataTable(this.app, "", "all")}
			]
		};
	}

	ready(view) {
		this.table = view.queryView("datatable");
	}

	init() {
		this.form = this.ui(ActivityWindow);

		this.on(this.app, "activities:save", (values) => {
			if (values.id) {
				activities.updateItem(values.id, values);
			}
			else {
				activities.add(values);
			}
		});

		this.on(this.app, "activities:delete", id => activities.remove(id));

		webix.promise.all([
			activities.waitData
		]).then(() => {
			this.filterTableByTabbar(this.table);
		});
	}

	filterTableByTabbar(view) {
		const newDate = new Date();
		const currentDay = webix.Date.datePart(newDate);
		const tomorrow = webix.Date.add(currentDay, 1, "day", true);
		const startCurrentWeek = webix.Date.weekStart(currentDay);
		const startCurrentMonth = webix.Date.monthStart(currentDay);

		view.registerFilter(
			this.$$("selector"),
			{
				compare: (value, filter, item)	=> {
					const filterId = parseInt(filter);
					const state = item.State;
					const date = item.ConvDueDate;
					const DateDay = webix.Date.datePart(date, true);
					const startWeek = webix.Date.weekStart(DateDay);
					const startMonth = webix.Date.monthStart(DateDay);

					if (filterId === 2) {
						return date < currentDay && state === "Open";
					}
					else if (filterId === 3) {
						return state === "Close";
					}
					else if (filterId === 4) {
						return webix.Date.equal(currentDay, DateDay) && state === "Open";
					}
					else if (filterId === 5) {
						return webix.Date.equal(tomorrow, DateDay) && state === "Open";
					}
					else if (filterId === 6) {
						return webix.Date.equal(startCurrentWeek, startWeek) && state === "Open";
					}
					else if (filterId === 7) {
						return webix.Date.equal(startCurrentMonth, startMonth) && state === "Open";
					}
					return item;
				}
			},
			{
				getValue(node) {
					return node.getValue();
				},
				setValue(node, value) {
					node.setValue(value);
				}
			}
		);
	}
}
