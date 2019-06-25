import {JetView} from "webix-jet";
import {activities} from "../models/activitiesdata";
import ActivitiesDataTable from "./activities/activitiestable";
import ActivityForm from "./activities/activityform";

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
							localId:"button:add",
							type:"icon",
							icon: "wxi-plus-square",
							css: "webix_primary bg_color",
							align: "right",
							inputWidth: 200,
							click: () => {
								this.form.showForm();
							}
						}
					]
				},
				{ $subview:ActivitiesDataTable }
			]
		};
	}

	init () {
		this.form = this.ui(ActivityForm);

		this.on(this.app,"activities:save", values => {
			values.id ? activities.updateItem(values.id,values) : activities.add(values);
		});
	}
}