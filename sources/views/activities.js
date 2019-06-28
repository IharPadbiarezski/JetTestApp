import {JetView} from "webix-jet";
import {activities} from "../models/activitiesdata";
import ActivitiesDataTable from "./activities/activitiestable";
import ActivityWindow from "./activities/activityform";

export default class DataView extends JetView{
	config(){
		return {
			rows: [
				{	
					view:"toolbar", css:"subbar", padding:0,
					elements:[
						{},
						{
							view: "button",
							label: "Add",
							localId: "add:button",
							type:"icon",
							value: "Add",
							icon: "wxi-plus-square",
							css: "webix_primary bg_color",
							align: "right",
							inputWidth: 200,
							click: () => {
								const value = this.$$("add:button").getValue();
								this.form.showForm({}, value);
							}
						}
					]
				},
				{ $subview:ActivitiesDataTable }
			]
		};
	}

	init () {
		this.form = this.ui(ActivityWindow);

		this.on(this.app, "activities:save", values => {
			values.id ? activities.updateItem(values.id, values) : activities.add(values);
		});

		this.on(this.app,"activities:delete", id => activities.remove(id));
	}
}