import {JetView} from "webix-jet";
import {contacts} from "../../models/contactsdata";
import {activitytypes} from "../../models/activitytypesdata";

export default class ActivityForm extends JetView {
	config() {
		return {
			view:"window", head:false, position:"center",
			modal:true, body:{
				view: "form",
				localId: "activityform",
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
								name: "DueDate",
								// value: new Date(),
								format:"%d %m %Y",
								label: "Date", 
								timepicker: true,
								invalidMessage: "Please select a date"
							},
							{
								view:"datepicker",
								name: "DueTime",
								timepicker:true,
								format:"%H:%i",
								label: "Time",
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
							value: "Add (*save)",
							type: "form",
							css: "webix_primary",
							click: () => {
								if (this.form.validate()) {
									console.log(this.form.getValues())
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

	showForm(){
		this.getRoot().show();
	}

	hideForm(){
		this.getRoot().hide();
		this.form.clear();
		this.form.clearValidation();
	}
}
