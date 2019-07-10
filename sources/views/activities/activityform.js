import {JetView} from "webix-jet";
import {contacts} from "../../models/contactsdata";
import {activitytypes} from "../../models/activitytypesdata";

export default class ActivityWindow extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		return {
			view: "window",
			head: false,
			position: "center",
			modal: true,
			body: {
				view: "form",
				localId: "activityform",
				width: 600,
				elements: [
					{
						view: "template",
						localId: "activityHeader",
						template: obj => obj.value,
						type: "header",
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
						options: {
							body: {
								data: activitytypes,
								template: "#Value#"
							}
						},
						invalidMessage: _("Please select a type")
					},
					{
						view: "combo",
						name: "ContactID",
						label: _("Contact"),
						localId: "comboContact",
						options: contacts,
						invalidMessage: _("Please select a contact")
					},
					{
						cols: [
							{
								view: "datepicker",
								name: "ConvDueDate",
								label: _("Date"),
								invalidMessage: _("Please select a date")
							},
							{
								view: "datepicker",
								name: "ConvDueTime",
								format: "%H:%i",
								label: _("Time"),
								type: "time",
								invalidMessage: _("Please select any time")
							}
						]
					},
					{
						view: "checkbox",
						name: "State",
						labelRight: _("Completed"),
						checkValue: "Close",
						uncheckValue: "Open"
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

	init(view) {
		const _ = this.app.getService("locale")._;
		this.form = view.getBody();

		this.on(this.app, "form:fill", (values, flag) => {
			const check = flag === "specific" ? "flag" : "";
			const title = {head: `${_("Edit")}`, button: `${_("Save")}`};
			this.showActivityForm(values, title, check);
		});
	}

	setEnable() {
		const comboContact = this.form.elements.ContactID;
		if (!comboContact.isEnabled()) {
			comboContact.enable();
		}
	}

	showActivityForm(values, title, check) {
		const _ = this.app.getService("locale")._;
		this.form.setValues(values);
		this.getRoot().show();
		this.$$("activityHeader").setValues({value: `${_(title.head)} ${_("activity")}`});
		this.$$("saveButton").setValue(title.button || title.head);
		if (check) {
			this.setDisable();
		}
	}

	hideForm() {
		this.getRoot().hide();
		this.form.clear();
		this.form.clearValidation();
	}

	setDisable() {
		const comboContact = this.form.elements.ContactID;
		comboContact.disable();
	}
}
