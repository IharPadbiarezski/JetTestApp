import {JetView} from "webix-jet";
import {activities} from "../models/activitiesdata";
import ActivitiesDataTable from "./activities/activitiestable";
import ActivityWindow from "./activities/activityform";

export default class DataView extends JetView{
	config(){
		const tabbar = {
			view: "tabbar",
			id: "selector",
			gravity: 3,
			borderless: true,
			options: [
				{
					id: 1, value: "All"
				},
				{
					id: 2, value: "Overdue"
				},
				{
					id: 3, value: "Completed"
				},
				{
					id: 4, value: "Today"
				},
				{
					id: 5, value: "Tommorow"
				},
				{
					id: 6, value: "This week"
				},
				{
					id: 7, value: "This month"
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
							label: "Add",
							localId: "addButton",
							type:"icon",
							value: "Add",
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
				columnId: ["State"],
				compare: (value, filter) => {
					if (filter == 3) {
						return value == 1;
					} else {
						return value;
					}
				}
			},
			// {
			// 	columnId: "ConvDueDate",
			// 	compare: (value, filter, item)	=> {
			// 		// const currentDate = new Date();
			// 		// let date = new Date(value);
			// 		if (filter == 2) {
			// 			// console.log(value);
			// 			return value.getFullYear() < 2010;
			// 		// } else if (filter == 3) {
			// 		// 	return value > 1980 && value <= 2000;
			// 		// } else if (filter == 4) {
			// 		// 	return value > 2000 && value <= currentYear.getFullYear();
			// 		} else {
			// 			return value;
			// 		}
			// 	}
			// },
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