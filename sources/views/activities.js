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
							localId: "addButton",
							type:"icon",
							value: "Add",
							icon: "wxi-plus-square",
							css: "webix_primary",
							align: "right",
							inputWidth: 200,
							click: () => {
								const value = this.$$("addButton").getValue();
								this.form.showActivityForm({}, value, value);
							}
						}
					]
				},
				{ $subview:ActivitiesDataTable }
			]
		};
	}

	init() {

		this.form = this.ui(ActivityWindow);

		this.on(this.app, "activities:save", values => {
			values.id ? activities.updateItem(values.id, values) : activities.add(values);
		});

		this.on(this.app,"activities:delete", id => activities.remove(id));
	}

	destroy(){
		this.app.detachEvent("activities:save");
		this.app.detachEvent("activities:delete");
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