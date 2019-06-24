import {JetView} from "webix-jet";
import DataTable from "./activities/datatable";

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
				DataTable
			]
		};
	}
	
	init(){
	}
}