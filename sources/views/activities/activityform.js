import {JetView} from "webix-jet";
import {contacts} from "../../models/contactsdata";
import {activitytypes} from "../../models/activitytypesdata";

export default class ActivityWindow extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		return {
			view:"window", head:false, position:"center",
			modal:true, body:{
				view: "form",
				localId: "activityform",
				width:600,
				elements: [
					{
						view:"template",
						localId: "activity:header",
						template: obj => obj.value,
						type:"header",
						css: "activities_header_align"
					},
					{
						view: "textarea",
						name: "Details",
						label: _("Details"),
						invalidMessage: _("Please entry your name")
					},
					{
						view: "combo",
						name: "TypeID",
						label: _("Type"),
						options: activitytypes,
						invalidMessage: _("Please select a type")
					},
					{
						view: "combo",
						name: "ContactID",
						label: _("Contact"),
						localId: "formCombo",
						id: "comboContact:activity",
						options: contacts,
						invalidMessage: _("Please select a contact")
					},
					{
						cols: [
							{
								view:"datepicker",
								name: "ConvDueDate",
								label: _("Date"),
								invalidMessage: _("Please select a date")
							},
							{
								view:"datepicker",
								name: "ConvDueTime",
								format:"%H:%i",
								label: _("Time"),
								type: "time",
								invalidMessage: _("Please select any time")
							}
						]
					},
					{
						view:"checkbox",
						name: "State",
						labelRight: _("Completed")
					},
					{cols: [
						{gravity: 2},
						{
							view: "button",
							localId: "activity_save_button",
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
							value: _("Cancel"),
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

		const _ = this.app.getService("locale")._;
		this.form = view.getBody();

		this.on(this.app, "form:fill", values => {
			this.showForm({}, `${_("Edit")}`, `${_("Save")}`);
			this.form.setValues(values);
		});
	}

	setEnable() {
		const comboContact = webix.$$("comboContact:activity");
		if (!comboContact.isEnabled()) {
			comboContact.enable();
		}
	}

	showForm(data, headerType, buttonType){
		const _ = this.app.getService("locale")._;
		this.getRoot().show();
		this.$$("activity:header").setValues({value: `${headerType} ${_("activity")}`});
		this.$$("activity_save_button").setValue(buttonType);
	}

	hideForm(){
		this.getRoot().hide();
		this.form.clear();
		this.form.clearValidation();
	}
}
