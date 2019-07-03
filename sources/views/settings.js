import {JetView} from "webix-jet";
import { activitytypes } from "../models/activitytypesdata";
import { statuses } from "../models/statusesdata";

export default class SettingsView extends JetView {
	config() {
		// const lang = this.app.getService("locale").getLang();
		// const _ = this.app.getService("locale")._;

		const selector = {
			view: "segmented",
			inputWidth: 250,
			id: "lng",
			options: [
				{id: "en", value: "EN"},
				{id: "ru", value: "RU"}
			],
			// click: () => this.toggleLanguage(),
			// value: lang
		};

		const activityTypesTable = {
			view: "datatable",
			localId: "activityTypesTable",
			editable: true,
			scroll: "auto",
			editaction: "dblclick",
			columns: [
				{
					id:"Value",
					header:"Activity Type",
					fillspace: true,
					editor: "text"
				},
				{
					id:"Icon",
					header:"Icon",
					width: 150,
					editor: "text"
				},
				{
					id: "",
					template: "{common.trashIcon()}",
					width: 60
				}
			],
			onClick: {
				"wxi-trash":(e, id) => {
					webix.confirm({
						text: "Are you sure you want to delete it?"
					}).then( () => {
						activitytypes.remove(id);
					});
					return false;
				}
			}
		};

		const statusesTable = {
			view: "datatable",
			localId: "statusesTable",
			editable: true,
			scroll: "auto",
			editaction: "dblclick",
			columns: [
				{
					id:"Value",
					header:"Status",
					fillspace: true,
					editor: "text"
				},
				{
					id:"Icon",
					header:"Icon",
					width: 150,
					editor: "text"
				},
				{
					id: "",
					template: "{common.trashIcon()}",
					width: 60
				}
			],
			onClick: {
				"wxi-trash":(e, id) => {
					webix.confirm({
						text: "Are you sure you want to delete it?"
					}).then( () => {
						statuses.remove(id);
					});
					return false;
				}
			}
		};

		const activityTypesLabel = {
			view: "label",
			label: "Activity Types",
			align: "center",
			localId: "label",
			css: "settings_label"
		};

		const statusesLabel = {
			view: "label",
			label: "Statuses",
			align: "center",
			localId: "label",
			css: "settings_label"
		};

		const buttons = {	
			view:"toolbar", css:"subbar", padding:0,
			elements:[
				{},
				{
					view: "button",
					label: "Add type",
					localId: "addButton",
					type:"icon",
					icon: "wxi-plus",
					css: "webix_primary",
					click: () => {
						activitytypes.add({Value: "value", Icon: "icon"});
					}
				},
				{
					gravity: 2
				},
				{
					view: "button",
					label: "Add status",
					localId: "addButton",
					type:"icon",
					icon: "wxi-plus",
					css: "webix_primary",
					click: () => {
						statuses.add({Value: "name", Icon: "icon"});
					}
				},
				{}
			]
		};

		return {
			rows: [
				selector,
				{
					cols: [
						{
							rows: [
								activityTypesLabel,
								activityTypesTable
							]
						},
						{
							rows: [
								statusesLabel,
								statusesTable
							]
						}
					]
				},
				buttons
			]
		};
	}

	init() {
		this.$$("activityTypesTable").sync(activitytypes);
		this.$$("statusesTable").sync(statuses);
	}

	// toggleLanguage() {
	// 	const langs = this.app.getService("locale");
	// 	const value = this.$$("lng").getValue();
	// 	langs.setLang(value);
	// }
}
