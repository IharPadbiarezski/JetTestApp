import {JetView} from "webix-jet";
import {contacts} from "../../models/contactsdata";
import {activitytypes} from "../../models/activitytypesdata";

export default class ActivityWindow extends JetView {
	config() {
		return {
			view:"window", head:false, position:"center",
			modal:true, body:{
				view: "form",
				localId: "activityform",
				width:600,
				elements: [
					{ view:"template", id: "activity:header", template: obj => obj.value, type:"header", css: "activities_header_align"},
					{
						view: "textarea",	name: "Details", label: "Details", invalidMessage: "Please entry your name"
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
							localId: "activity_form:button",
							type: "form",
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

			this.showForm({}, "Save");
			this.form.setValues(values);
		});
	}

	showForm(data, type){
		this.getRoot().show();
		this.$$("activity:header").setValues({value: `${type} activity`});
		this.$$("activity_form:button").setValue(type);
	}

	hideForm(){
		this.getRoot().hide();
		this.form.clear();
		this.form.clearValidation();
	}
}
