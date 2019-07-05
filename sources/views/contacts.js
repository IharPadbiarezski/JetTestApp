import {JetView} from "webix-jet";
import ContactsList from "./contacts/contactslist";

export default class ContactsView extends JetView {
	config() {
		return {
			cols: [
				ContactsList,
				{ $subview: true }
			]
		};
	}

	ready(view) {
		this.contactList = view.queryView("list");
	}
	
	init() {

		this.on(this.app, "contactinfo:show", (id, mode, check) => {
			if (mode === "Add" && check) {	
				this.contactList.select(this.contactList.getFirstId());
			} else if (mode) {
				this.contactList.select(id);
			}
			this.show(`/top/contacts?id=${id}/contactinfo`);
		});

		this.on(this.app, "contactform:show", (mode) => {
			this.show("contactform").then(() => {
				this.setParam("mode", mode);
			});
		});
	}

	destroy() {
		this.app.detachEvent("contactinfo:show");
		this.app.detachEvent("contactform:show");
	}
}