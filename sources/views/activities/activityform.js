import {JetView} from "webix-jet";
import {contacts} from "../../models/contactsdata";
import {activitytypes} from "../../models/activitytypesdata";

export default class ActivityForm extends JetView {
	config() {
		return {
			view: "form",
			localId: "form",
			elements: [
				{ view:"template", template:"Add (*edit) activity", type:"header", css: "activities_header_align"},
				{
					view: "textarea",	name: "Details", label: "Details", invalidMessage: "Please entry your name"
				},
				{
					view: "combo",
					name: "TypeID",
					label: "Type",
					options: {
						body: {
							data: activitytypes, template: "#Value#"
						}
					}
				},
				{
					view: "combo",
					name: "ContactID",
					label: "Contact",
					options: {body: {
						data: contacts, template: "#FirstName# #LastName#"}}
				},
				{
					cols: [
						{
							view:"datepicker", 
							value: new Date(),
							format:"%d %M %Y",
							label: "Date", 
							timepicker: true
						},
						{
							view:"datepicker",
							timepicker:true,
							format:"%H:%i",
							value: new Date(), 
							label: "Time"
						}
					]
				},
				{
					view:"checkbox", 
					labelRight:"Completed"
				},
				{cols: [
					{gravity: 2},
					{
						view: "button",
						value: "Add (*save)",
						css: "webix_primary",
						click: () => {
							this.addContact();
						}
					},
					{
						view: "button",
						value: "Cancel",
						click: () => {
							// this.updateContact();
						}
					}
				]},
				{}
			],
			rules: {
				Details: webix.rules.isNotEmpty,
				TypeID: webix.rules.isNotEmpty,
				ContactID: webix.rules.isNotEmpty
			}
		};
	}

	addContact() {
		let form = this.$$("form");
		form.validate();
	}
}
