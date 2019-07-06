import {JetView} from "webix-jet";
import {activities} from "../models/activitiesdata";
import ActivitiesDataTable from "./activities/activitiestable";
import ActivityWindow from "./activities/activityform";

export default class DataView extends JetView{
	config(){
		const _ = this.app.getService("locale")._;

		const tabbar = {
			view: "tabbar",
			id: "selector",
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
					webix.$$("activities:datatable").filterByAll();
				}
			}
		};

		return {
			rows: [
				{	
					view:"toolbar", css:"subbar", padding:0,
					elements:[
						tabbar,
						{
							view: "button",
							label: _("Add"),
							localId: "addButton",
							type:"icon",
							value: _("Add"),
							icon: "wxi-plus-square",
							css: "webix_primary",
							align: "right",
							inputWidth: 200,
							click: () => {
								const value = this.$$("addButton").getValue();
								this.form.showForm({}, value, value);
							}
						}
					]
				},
				{ $subview:ActivitiesDataTable }
			]
		};
	}

	ready(view) {
		this.table = webix.$$("activities:datatable");
		this.table.attachEvent("onAfterSelect", (id) => { 
			this.show(`../activities?id=${id}`);
		});
		
		view.queryView("datatable").registerFilter(
			this.$$("selector"),
			{
				columnId: "DueDate",
				compare: (value, filter, item)	=> {
					if (value) {
						const currentDate = new Date();
						let mainArr = value.split(" ");
						let date = mainArr[0].split("-");
						let time = mainArr[1].split(":");
						let dd = date[0];
						let mm = date[1];
						let yy = date[2];
						let hh = time[0];
						let min = time[1];
						let valDate = new Date(yy, mm-1, dd, hh, min);

						if (Number(filter) === 2) {
							return valDate < currentDate;
						} else if (Number(filter) === 3) {
							return Number(item.State) === 1;
						} else if (Number(filter) == 4) {
							let today = new Date().toJSON().slice(0,10).replace(/-/g,"/");
							let convDate = valDate.toJSON().slice(0,10).replace(/-/g,"/");
							return convDate === today;
						} else if (Number(filter) === 5) {
							let convDate = valDate.toJSON().slice(0,10).replace(/-/g,"/");
							let currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
							let day = currentDate.getDate();
							let month = currentDate.getMonth() + 1;
							let year = currentDate.getFullYear();
							if (day < 10) {
								date = day.toString();
								day = "0" + day;
							}
							if (month < 10) {
								month = month.toString();
								month = "0" + month;
							}
							let tommorow = year + "/" + month + "/" + day;
							return convDate === tommorow;
						} else if (Number(filter) === 6) {
							let now = new Date();
							let dayOfWeek = now.getDay();
							let numDay = now.getDate();

							let startDate = new Date(now);
							startDate.setDate(numDay - dayOfWeek);
							startDate.setHours(0, 0, 0, 0);

							let endDate = new Date(now);
							endDate.setDate(numDay + (7 - dayOfWeek));
							endDate.setHours(0, 0, 0, 0);

							return (valDate > startDate && valDate < endDate);
						} else if (Number(filter) === 7) {
							let today = new Date().toJSON().slice(0,7).replace(/-/g,"/");
							let convMonth = valDate.toJSON().slice(0,7).replace(/-/g,"/");
							return convMonth === today;
						} else {
							return value;
						}
					}
				}
			},
			{
				getValue: function(node) {
					return node.getValue();
				},
				setValue: function(node, value) {
					node.setValue(value);
				}
			}
		);
	}

	init() {

		this.form = this.ui(ActivityWindow);

		this.on(this.app, "activities:save", values => {
			values.id ? activities.updateItem(values.id, values) : activities.add(values);
		});

		this.on(this.app,"activities:delete", id => activities.remove(id));
	}

	destroy(){
		this.table.detachEvent("onAfterSelect");
	}

	urlChange() {
		webix.promise.all([
			activities.waitData,
		]).then(() => {
			const activitiesTable = this.$$("activities:datatable");
			const id = this.getParam("id");
			const selectedId = activitiesTable.getSelectedId().id;
			if (id && activities.exists(id) && id !== selectedId) {
				activitiesTable.select(id);
			}
		});
	}
}