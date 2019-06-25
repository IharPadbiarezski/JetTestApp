import {JetView} from "webix-jet";
import {contacts} from "../../models/contactsdata";
import {activitytypes} from "../../models/activitytypesdata";

export default class ActivityForm extends JetView {
	config() {
		return {
			view:"window", head:false, position:"center",
			modal:true, body:{
				view: "form",
				width:600,
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
						},
						invalidMessage: "Please select a type"
					},
					{
						view: "combo",
						name: "ContactID",
						label: "Contact",
						options: {body: {
							data: contacts, template: "#FirstName# #LastName#"}},
						invalidMessage: "Please select a contact"
					},
					{
						cols: [
							{
								view:"datepicker",
								name: "DueDate",
								value: new Date(),
								format:"%d %M %Y",
								label: "Date", 
								timepicker: true,
								invalidMessage: "Please select a date"
							},
							{
								view:"datepicker",
								timepicker:true,
								format:"%H:%i",
								value: new Date(), 
								label: "Time",
								invalidMessage: "Please select time"
							}
						]
					},
					{
						view:"checkbox",
						name: "checkbox",
						labelRight:"Completed"
					},
					{cols: [
						{gravity: 2},
						{
							view: "button",
							value: "Add (*save)",
							css: "webix_primary",
							click: () => {
								if (this.form.validate()) {
									this.app.callEvent("activities:save", [this.form.getValues()]);
									this.hideForm();
								}
							}
						},
						{
							view: "button",
							value: "Cancel",
							click: () => {
								this.hideForm();
							}
						}
					]},
					{}
				],
				rules: {
					$all: webix.rules.isNotEmpty
				}
			}
		};
	}

	init(view){
		this.form = view.getBody();

		this.on(this.app, "form:fill", values => {
			view.show();
			this.form.setValues(values);
		});
	}

	addContact() {
		let form = this.$$("form");
		form.validate();
	}

	showForm(){
		this.getRoot().show();
	}

	hideForm(){
		this.getRoot().hide();
		this.form.clear();
		this.form.clearValidation();
	}
}
