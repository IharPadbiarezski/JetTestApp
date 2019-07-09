import {JetView} from "webix-jet";
import {contacts} from "../../models/contactsdata";
import {activitytypes} from "../../models/activitytypesdata";

export default class ActivityWindow extends JetView {
	config() {
		return {
			view:"window",
			head:false,
			position:"center",
			modal:true,
			body:{
				view: "form",
				width:600,
				elements: [
					{
						view:"template",
						localId: "activityHeader",
						template: obj => obj.value,
						type:"header",
						css: "activities_header_align"
					},
					{
						view: "textarea",
						name: "Details",
						label: "Details",
						invalidMessage: "Please entry your name"
					},
					{
						view: "combo",
						name: "TypeID",
						label: "Type",
						options: activitytypes,
						invalidMessage: "Please select a type"
					},
					{
						view: "combo",
						name: "ContactID",
						label: "Contact",
						localId: "comboContact",
						options: contacts,
						invalidMessage: "Please select a contact"
					},
					{
						cols: [
							{
								view:"datepicker",
								name: "ConvDueDate",
								label: "Date",
								invalidMessage: "Please select a date"
							},
							{
								view:"datepicker",
								name: "ConvDueTime",
								format:"%H:%i",
								label: "Time",
								type: "time",
								invalidMessage: "Please select any time"
							}
						]
					},
					{
						view:"checkbox",
						name: "State",
						labelRight:"Completed"
					},
					{cols: [
						{gravity: 2},
						{
							view: "button",
							localId: "saveButton",
							type: "form",
							css: "webix_primary",
							click: () => {
								if (this.form.validate()) {
									this.app.callEvent("activities:save", [this.form.getValues()]);
									this.hideForm();
									this.setEnable();
								}
							}
						},
						{
							view: "button",
							value: "Cancel",
							click: () => {
								this.hideForm();
								this.setEnable();
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

		this.on(this.app, "form:fill", (values, flag) => {
			const check = (flag === "specific") ? true : false;
			const title = {head: "Edit", button: "Save"};
			this.showActivityForm(values, title, check);
		});
	}

	setEnable() {
		const comboContact = this.form.elements["ContactID"];
		if (!comboContact.isEnabled()) {
			comboContact.enable();
		}
	}

	showActivityForm(values, title, check){
		this.form.setValues(values);
		this.getRoot().show();
		this.$$("activityHeader").setValues({value: `${title.head} activity`});
		this.$$("saveButton").setValue(title.button || title.head);
		if(check) {
			this.setDisable();
		}
	}

	hideForm(){
		this.getRoot().hide();
		this.form.clear();
		this.form.clearValidation();
	}

	setDisable() {
		const comboContact = this.form.elements["ContactID"];
		comboContact.disable();
	}
}
