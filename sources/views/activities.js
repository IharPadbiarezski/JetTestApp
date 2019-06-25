import {JetView} from "webix-jet";
import ActivitiesDataTable from "./activities/activitiestable";
import ActivityForm from "./activities/activityform";

export default class DataView extends JetView{
	config(){
		return {
			rows: [
				{
					view: "button",
					label: "Add",
					type:"icon",
					icon: "wxi-plus-square",
					css: "webix_primary bg_color",
					align: "right",
					inputWidth: 200,
					click: () => {
					}
				},
				ActivitiesDataTable,
				// ActivityForm
			]
		};
	}
	
	init(){
	}
}