import {JetView} from "webix-jet";
import {contacts} from "../models/contactsdata";
import ContactsList from "./contacts/contactslist";

export default class ContactsView extends JetView {
	config() {
		return {
			cols: [
				ContactsList,
				{ $subview: true }
			],
			// on: {
			// 	onIdChange: (oldid, newid) => {
			// 		console.log(oldid, newid);
			// 		this.$$("list").select(newid);
			// 	}
			// }
		};
	}

	ready(view) {
		this.contactList = view.queryView("list");
	}
	
	init() {
		contacts.waitData.then(() => {
			this.show("/top/contacts/contactinfo");
		});

		this.on(this.app, "contactinfo:show", (id) => {
			this.show("/top/contacts/contactinfo").then(() => {
				this.setParam("id", id, true);
				if (id) {
					this.contactList.select(id);
				} else {
					this.contactList.select(this.contactList.getFirstId());
				}
			});
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